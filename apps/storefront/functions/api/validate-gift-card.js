import { error, json } from '../_lib/http';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = String(url.searchParams.get('code') || '').trim().toUpperCase();
  if (!code) return error('Gift card code required');
  const card = await context.env.STORE_DB.prepare("SELECT * FROM gift_cards WHERE code = ? AND is_active = 1 AND balance > 0 AND (expires_at IS NULL OR expires_at >= date('now')) LIMIT 1").bind(code).first();
  if (!card) return json({ valid: false, error: 'Invalid or expired gift card' });
  return json({ valid: true, code: card.code, balance: card.balance, id: card.id });
}