import { jsPDF } from 'jspdf';
import { POPPINS_REGULAR_TTF } from './pdfFonts';

const statusLabels = {
  new: 'Order received',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function registerBrandFonts(doc) {
  if (doc.__bulbulFontsRegistered) return;
  doc.addFileToVFS('Poppins-Regular.ttf', POPPINS_REGULAR_TTF);
  doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
  doc.addFont('Poppins-Regular.ttf', 'Poppins', 'bold');
  doc.__bulbulFontsRegistered = true;
}

function setBrandFont(doc, weight = 'normal') {
  doc.setFont('Poppins', weight === 'bold' ? 'bold' : 'normal');
}

function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString('en-PK')}`;
}

function safe(value, fallback = '—') {
  return String(value || '').trim() || fallback;
}

function orderNumber(order) {
  return order?.order_number || order?.orderNumber || 'order';
}

function customerName(order) {
  return `${order?.first_name || ''} ${order?.last_name || ''}`.trim() || order?.name || 'Customer';
}

function statusLabel(status) {
  return statusLabels[status] || status || 'Order';
}

function drawHeader(doc, order, title = 'Order document') {
  doc.setFillColor(44, 35, 31);
  doc.roundedRect(10, 10, 190, 30, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  setBrandFont(doc, 'bold');
  doc.setFontSize(20);
  doc.text('GYMFLEX', 18, 24);
  doc.setFontSize(10);
  setBrandFont(doc, 'normal');
  doc.text('Order invoice + packing slip', 18, 31);
  setBrandFont(doc, 'bold');
  doc.setFontSize(13);
  doc.text(orderNumber(order), 196, 23, { align: 'right' });
  setBrandFont(doc, 'normal');
  doc.setFontSize(9);
  doc.text(title, 196, 31, { align: 'right' });
  doc.setTextColor(31, 41, 55);
}

function chip(doc, text, x, y, fill = [244, 241, 236], color = [44, 35, 31]) {
  doc.setFillColor(...fill);
  doc.roundedRect(x, y, 40, 9, 4, 4, 'F');
  setBrandFont(doc, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...color);
  doc.text(String(text).toUpperCase(), x + 20, y + 6.2, { align: 'center' });
  doc.setTextColor(31, 41, 55);
}

function labelValue(doc, label, value, x, y, width = 85) {
  setBrandFont(doc, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(String(label).toUpperCase(), x, y);
  setBrandFont(doc, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(31, 41, 55);
  const lines = doc.splitTextToSize(safe(value), width);
  doc.text(lines, x, y + 5);
  return y + 5 + lines.length * 4.5;
}

function drawCustomerBlock(doc, order, y) {
  doc.setDrawColor(229, 231, 235);
  doc.setFillColor(250, 250, 249);
  doc.roundedRect(10, y, 190, 42, 4, 4, 'FD');
  labelValue(doc, 'Customer', customerName(order), 18, y + 10, 75);
  labelValue(doc, 'Phone', order.phone, 105, y + 10, 55);
  chip(doc, statusLabel(order.status), 155, y + 8, [226, 232, 240], [44, 35, 31]);
  labelValue(doc, 'Address', `${safe(order.address, '')}, ${safe(order.city, '')}${order.state ? `, ${order.state}` : ''}`, 18, y + 27, 166);
}


async function imageToDataUrl(url) {
  if (!url) return null;
  try {
    const proxiedUrl = `/api/pdf-image?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxiedUrl, { credentials: 'include', cache: 'force-cache' });
    if (!response.ok) return null;
    const blob = await response.blob();

    const objectUrl = URL.createObjectURL(blob);
    try {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = objectUrl;
      });
      const sourceWidth = Math.max(1, image.naturalWidth || image.width || 1);
      const sourceHeight = Math.max(1, image.naturalHeight || image.height || 1);
      const maxSize = 96;
      const scale = Math.min(1, maxSize / Math.max(sourceWidth, sourceHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(sourceWidth * scale));
      canvas.height = Math.max(1, Math.round(sourceHeight * scale));
      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      return { dataUrl: canvas.toDataURL('image/jpeg', 0.58), type: 'image/jpeg' };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

function imageFormat(type = '') {
  if (type.includes('png')) return 'PNG';
  if (type.includes('webp')) return 'WEBP';
  return 'JPEG';
}

async function drawItems(doc, items = [], y) {
  setBrandFont(doc, 'bold');
  doc.setFontSize(9);
  doc.setFillColor(44, 35, 31);
  doc.setTextColor(255, 255, 255);
  doc.roundedRect(10, y, 190, 10, 3, 3, 'F');
  doc.text('Product', 16, y + 6.8);
  doc.text('Variant', 94, y + 6.8);
  doc.text('Qty', 137, y + 6.8);
  doc.text('Total', 190, y + 6.8, { align: 'right' });
  doc.setTextColor(31, 41, 55);
  y += 14;

  for (const [index, item] of items.entries()) {
    if (y > 246) {
      doc.addPage();
      drawHeader(doc, { order_number: 'continued' }, 'Continued items');
      y = 50;
    }
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 249);
      doc.roundedRect(10, y - 6, 190, 17, 2, 2, 'F');
    }

    const image = await imageToDataUrl(item.variant_image_url || item.image_url || item.product_image_url);
    if (image?.dataUrl) {
      try {
        doc.addImage(image.dataUrl, imageFormat(image.type), 15, y - 4.8, 10, 10);
      } catch {
        doc.setFillColor(229, 231, 235);
        doc.roundedRect(15, y - 4.8, 10, 10, 2, 2, 'F');
      }
    } else {
      doc.setFillColor(229, 231, 235);
      doc.roundedRect(15, y - 4.8, 10, 10, 2, 2, 'F');
    }

    setBrandFont(doc, 'bold');
    doc.setFontSize(9.5);
    doc.text(doc.splitTextToSize(safe(item.product_name), 60), 30, y);
    setBrandFont(doc, 'normal');
    doc.setFontSize(9);
    const variant = item.variant_name ? `${item.variant_type || 'Option'}: ${item.variant_name}` : '—';
    doc.text(doc.splitTextToSize(variant, 38), 94, y);
    doc.text(String(item.quantity || 0), 140, y);
    setBrandFont(doc, 'bold');
    doc.text(money(item.line_total), 190, y, { align: 'right' });
    y += 17;
  }
  return y;
}

function drawTotals(doc, order, y) {
  const x = 122;
  doc.setDrawColor(229, 231, 235);
  doc.line(x, y, 200, y);
  y += 8;
  doc.setFontSize(10);
  setBrandFont(doc, 'normal');
  doc.text('Subtotal', x, y);
  doc.text(money(order.subtotal), 196, y, { align: 'right' });
  y += 7;
  doc.text('Shipping', x, y);
  doc.text(money(order.shipping_fee || order.shippingFee), 196, y, { align: 'right' });
  y += 8;
  setBrandFont(doc, 'bold');
  doc.setFontSize(13);
  doc.text('Total', x, y);
  doc.text(money(order.total), 196, y, { align: 'right' });
  return y;
}

function drawPackingStrip(doc, order, y) {
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(10, y, 190, 20, 4, 4, 'F');
  setBrandFont(doc, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175);
  doc.text('Packing note', 18, y + 8);
  doc.setTextColor(31, 41, 55);
  setBrandFont(doc, 'normal');
  doc.text(`COD / manual confirmation • ${safe(order.city)} • ${safe(order.phone)}`, 18, y + 15);
}

export async function createOrderPdfDocument(orderPayloads, { bulk = false } = {}) {
  const orders = Array.isArray(orderPayloads) ? orderPayloads : [orderPayloads];
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true, putOnlyUsedFonts: true });
  registerBrandFonts(doc);

  for (const [index, payload] of orders.entries()) {
    if (index > 0) doc.addPage();
    const order = payload.order || payload;
    const items = payload.items || order.items || [];
    drawHeader(doc, order, bulk ? 'Bulk order sheet' : 'Invoice + packing slip');
    drawCustomerBlock(doc, order, 48);
    let y = await drawItems(doc, items, 102);
    y = drawTotals(doc, order, Math.max(y + 5, 216));
    drawPackingStrip(doc, order, Math.min(y + 14, 260));
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Generated from GymFlex admin panel', 10, 288);
    doc.text(new Date().toLocaleString(), 200, 288, { align: 'right' });
  }

  return doc;
}

export async function downloadOrderPdf(payload) {
  const doc = await createOrderPdfDocument(payload);
  doc.save(`${orderNumber(payload.order || payload)}.pdf`);
}

export async function downloadBulkOrdersPdf(payloads, label = 'orders') {
  const doc = await createOrderPdfDocument(payloads, { bulk: true });
  doc.save(`gymflex-${label}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
