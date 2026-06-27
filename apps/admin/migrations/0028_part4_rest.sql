PRAGMA foreign_keys = OFF;

-- FAQ (15)
INSERT OR IGNORE INTO faq_items (id, category, question, answer, sort_order, is_active) VALUES
('faq-1', 'Orders', 'How do I place an order?', 'Simply browse our catalog, select your size and quantity, then add items to your cart. Proceed to checkout, enter your delivery details, and confirm your order. Payment is Cash on Delivery.', 0, 1),
('faq-2', 'Orders', 'Can I cancel my order?', 'Yes, you can cancel your order within 24 hours of placing it as long as it hasn''t been shipped yet.', 1, 1),
('faq-3', 'Orders', 'How do I track my order?', 'Use the Track Order page on our website and enter your order number. You can also contact our support team.', 2, 1),
('faq-4', 'Shipping', 'How long does delivery take?', 'Delivery typically takes 3-5 business days within Pakistan. Orders to Karachi, Lahore, and Islamabad may arrive in 2-3 days.', 0, 1),
('faq-5', 'Shipping', 'What are the shipping charges?', 'Standard shipping is Rs. 250 for most cities. Orders over Rs. 1,000 qualify for free shipping automatically.', 1, 1),
('faq-6', 'Shipping', 'Do you deliver to my city?', 'We deliver to all major cities across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and more.', 2, 1),
('faq-7', 'Returns', 'What is your return policy?', 'We offer a 30-day return policy on all unworn, unwashed items with tags intact.', 0, 1),
('faq-8', 'Returns', 'How do I return an item?', 'Email us with your order number and items you wish to return. We will arrange a pickup from your address.', 1, 1),
('faq-9', 'Returns', 'Are sale items returnable?', 'Yes, sale items can be returned within 14 days of delivery under the same conditions.', 2, 1),
('faq-10', 'Products', 'How do I choose the right size?', 'Check our Size Guide on each product page. We recommend measuring your chest, waist, and hips.', 0, 1),
('faq-11', 'Products', 'Are your products true to size?', 'Yes, most customers find our products true to size. Compression fits are designed to be snug.', 1, 1),
('faq-12', 'Products', 'How should I wash my GymFlex gear?', 'Machine wash cold with similar colors. Do not use fabric softener. Tumble dry low or hang dry.', 2, 1),
('faq-13', 'Products', 'Do you have a loyalty program?', 'Yes! Our loyalty program rewards you with points on every purchase. Ask our team for details.', 3, 1),
('faq-14', 'Products', 'What is your bulk pricing policy?', 'We offer tiered discounts on bulk orders of 5+ units. Check the Bulk Pricing section on product pages.', 4, 1),
('faq-15', 'General', 'How can I contact support?', 'Email us at support@gymflex.pk or call 0300-1234567. Available 9 AM to 6 PM, Mon-Sat.', 0, 1);

-- Community Photos (25)
INSERT OR IGNORE INTO community_photos (id, product_id, image_url, author_name, is_approved, created_at) VALUES
('cp-001', 'gymflex-dri-fit-tee', 'https://placehold.co/600x600/1e293b/ffffff?text=Ali+in+Dri-Fit', 'Ali R.', 1, '2025-10-01'),
('cp-002', 'gymflex-compression-tank', 'https://placehold.co/600x600/334155/ffffff?text=Tank+Mode', 'Hassan M.', 1, '2025-10-05'),
('cp-003', 'gymflex-joggers', 'https://placehold.co/600x600/0f172a/ffffff?text=Jogger+Fit', 'Usman K.', 1, '2025-10-10'),
('cp-004', 'gymflex-stringer', 'https://placehold.co/600x600/1e293b/ffffff?text=Stringer+Season', 'Bilal A.', 1, '2025-10-15'),
('cp-005', 'gymflex-hoodie', 'https://placehold.co/600x600/334155/ffffff?text=Hoodie+Vibes', 'Saad M.', 1, '2025-10-20'),
('cp-006', 'gymflex-women-leggings', 'https://placehold.co/600x600/0f172a/ffffff?text=LegDay+Fit', 'Ayesha K.', 1, '2025-10-25'),
('cp-007', 'gymflex-women-sports-bra', 'https://placehold.co/600x600/1e293b/ffffff?text=Bra+Strong', 'Fatima Z.', 1, '2025-11-01'),
('cp-008', 'gymflex-women-tank', 'https://placehold.co/600x600/334155/ffffff?text=Tank+Girl', 'Zara H.', 1, '2025-11-05'),
('cp-009', 'gymflex-dri-fit-tee', 'https://placehold.co/600x600/0f172a/ffffff?text=GymFlex+Pride', 'Taha R.', 1, '2025-11-10'),
('cp-010', 'gymflex-racerback', 'https://placehold.co/600x600/1e293b/ffffff?text=Racerback+Day', 'Faisal R.', 1, '2025-11-12'),
('cp-011', 'gymflex-women-joggers', 'https://placehold.co/600x600/334155/ffffff?text=Jogger+Queen', 'Sana M.', 1, '2025-11-15'),
('cp-012', 'gymflex-gym-bag', 'https://placehold.co/600x600/0f172a/ffffff?text=Bag+Pack', 'Hammad N.', 1, '2025-11-18'),
('cp-013', 'gymflex-lifting-straps', 'https://placehold.co/600x600/1e293b/ffffff?text=PR+Pull', 'Arslan M.', 1, '2025-11-22'),
('cp-014', 'gymflex-women-hoodie', 'https://placehold.co/600x600/334155/ffffff?text=Cozy+Gains', 'Hira N.', 1, '2025-11-25'),
('cp-015', 'gymflex-compression-tank', 'https://placehold.co/600x600/0f172a/ffffff?text=Chest+Day', 'Salman K.', 1, '2025-12-01'),
('cp-016', 'gymflex-women-leggings', 'https://placehold.co/600x600/1e293b/ffffff?text=Squat+Proof', 'Mahnoor A.', 1, '2025-12-05'),
('cp-017', 'gymflex-shorts', 'https://placehold.co/600x600/334155/ffffff?text=Short+Fit', 'Waleed M.', 1, '2025-12-08'),
('cp-018', 'gymflex-zip-hoodie', 'https://placehold.co/600x600/0f172a/ffffff?text=Zip+Up', 'Ahmed S.', 1, '2025-12-12'),
('cp-019', 'gymflex-women-sports-bra', 'https://placehold.co/600x600/1e293b/ffffff?text=Strong+Girl', 'Rabia K.', 1, '2025-12-15'),
('cp-020', 'gymflex-resistance-bands', 'https://placehold.co/600x600/334155/ffffff?text=Band+Work', 'Shahmir A.', 1, '2025-12-18'),
('cp-021', 'gymflex-dri-fit-tee', 'https://placehold.co/600x600/0f172a/ffffff?text=Tee+Time', 'Omar F.', 1, '2025-12-22'),
('cp-022', 'gymflex-women-shorts', 'https://placehold.co/600x600/1e293b/ffffff?text=Short+Gurl', 'Mariam S.', 1, '2025-12-25'),
('cp-023', 'gymflex-hoodie', 'https://placehold.co/600x600/334155/ffffff?text=Hoodie+Weather', 'Daniyal S.', 1, '2025-12-28'),
('cp-024', 'gymflex-knee-sleeves', 'https://placehold.co/600x600/0f172a/ffffff?text=Squat+Deep', 'Awais M.', 1, '2026-01-02'),
('cp-025', 'gymflex-stringer', 'https://placehold.co/600x600/1e293b/ffffff?text=Shredded', 'Zain A.', 1, '2026-01-10');

-- Discount Codes (6 additional, keeping 2 from migration 0005)
INSERT OR IGNORE INTO discount_codes (id, code, type, value, min_order_amount, max_uses, used_count, is_active, expires_at) VALUES
('summer25', 'SUMMER25', 'percentage', 25, 1499, 200, 45, 1, '2026-06-30'),
('flex150', 'FLEX150', 'fixed', 150, 999, 500, 120, 1, NULL),
('free-ship', 'FREESHIP', 'fixed', 250, 500, 1000, 310, 1, '2026-12-31'),
('new20', 'NEW20', 'percentage', 20, 2000, 100, 12, 1, '2026-03-31'),
('bulk500', 'BULK500', 'fixed', 500, 5000, 50, 8, 1, '2026-09-30'),
('fitfam', 'FITFAM', 'percentage', 15, 1000, 300, 67, 1, NULL);

-- Bundles (4)
INSERT OR IGNORE INTO bundles (id, name, slug, description, price, is_active) VALUES
('bundle-starter', 'Starter Gym Pack', 'starter-gym-pack', 'Everything you need to start your fitness journey. T-shirt, shorts, and water bottle.', 3499, 1),
('bundle-womens', 'Women''s Training Set', 'womens-training-set', 'Complete women''s gym set: leggings, sports bra, and cropped tank.', 4999, 1),
('bundle-accessories', 'Accessory Essential Kit', 'accessory-essential-kit', 'Straps, knee sleeves, and jump rope — all the gear for serious lifting.', 2999, 1),
('bundle-lifting', 'Heavy Lifting Bundle', 'heavy-lifting-bundle', 'Straps, knee sleeves, and gym gloves for heavy compound lifts.', 3999, 1);

INSERT OR IGNORE INTO bundle_items (id, bundle_id, product_id, quantity) VALUES
('bi-starter-1', 'bundle-starter', 'gymflex-dri-fit-tee', 1),
('bi-starter-2', 'bundle-starter', 'gymflex-shorts', 1),
('bi-starter-3', 'bundle-starter', 'gymflex-water-bottle', 1),
('bi-womens-1', 'bundle-womens', 'gymflex-women-leggings', 1),
('bi-womens-2', 'bundle-womens', 'gymflex-women-sports-bra', 1),
('bi-womens-3', 'bundle-womens', 'gymflex-women-tank', 1),
('bi-acc-1', 'bundle-accessories', 'gymflex-lifting-straps', 1),
('bi-acc-2', 'bundle-accessories', 'gymflex-knee-sleeves', 1),
('bi-acc-3', 'bundle-accessories', 'gymflex-jump-rope', 1),
('bi-lift-1', 'bundle-lifting', 'gymflex-lifting-straps', 1),
('bi-lift-2', 'bundle-lifting', 'gymflex-knee-sleeves', 1),
('bi-lift-3', 'bundle-lifting', 'gymflex-gym-gloves', 1);

-- Tiered Pricing (14 tiers across 5 products)
INSERT OR IGNORE INTO tiered_pricing (id, product_id, min_quantity, discount_percent) VALUES
('tp-dri-fit-5', 'gymflex-dri-fit-tee', 5, 10),
('tp-dri-fit-10', 'gymflex-dri-fit-tee', 10, 18),
('tp-dri-fit-20', 'gymflex-dri-fit-tee', 20, 25),
('tp-tank-5', 'gymflex-compression-tank', 5, 10),
('tp-tank-10', 'gymflex-compression-tank', 10, 18),
('tp-tank-20', 'gymflex-compression-tank', 20, 25),
('tp-joggers-5', 'gymflex-joggers', 5, 8),
('tp-joggers-10', 'gymflex-joggers', 10, 15),
('tp-joggers-20', 'gymflex-joggers', 20, 22),
('tp-leggings-5', 'gymflex-women-leggings', 5, 10),
('tp-leggings-10', 'gymflex-women-leggings', 10, 18),
('tp-leggings-20', 'gymflex-women-leggings', 20, 25),
('tp-bottle-5', 'gymflex-water-bottle', 5, 12),
('tp-bottle-10', 'gymflex-water-bottle', 10, 20);

-- Shipping Rates (10 cities)
INSERT OR IGNORE INTO shipping_rates (id, city, fee, estimated_days) VALUES
('ship-lhr', 'Lahore', 150, '1-2'),
('ship-khi', 'Karachi', 250, '2-3'),
('ship-isb', 'Islamabad', 150, '1-2'),
('ship-rwp', 'Rawalpindi', 150, '1-2'),
('ship-fsd', 'Faisalabad', 200, '2-3'),
('ship-mlt', 'Multan', 250, '3-4'),
('ship-pesh', 'Peshawar', 300, '3-4'),
('ship-qta', 'Quetta', 350, '4-5'),
('ship-skt', 'Sialkot', 200, '2-3'),
('ship-guj', 'Gujranwala', 200, '2-3');

-- Gift Cards (10)
INSERT OR IGNORE INTO gift_cards (id, code, initial_balance, balance, expires_at, is_active) VALUES
('gc-001', 'GIFT-ALI-500', 500, 500, '2026-12-31', 1),
('gc-002', 'GIFT-SANA-1000', 1000, 750, '2026-12-31', 1),
('gc-003', 'GIFT-OMAR-250', 250, 0, '2026-06-30', 1),
('gc-004', 'GIFT-FATIMA-500', 500, 500, '2026-12-31', 1),
('gc-005', 'GIFT-HIRA-2000', 2000, 2000, '2027-06-30', 1),
('gc-006', 'GIFT-ZAIN-1500', 1500, 1200, '2026-09-30', 1),
('gc-007', 'GIFT-MARIAM-750', 750, 750, '2026-12-31', 1),
('gc-008', 'GIFT-USMAN-300', 300, 300, '2026-08-31', 1),
('gc-009', 'GIFT-SHOP-5000', 5000, 5000, '2027-12-31', 1),
('gc-010', 'GIFT-GYMFLEX-100', 100, 100, '2026-06-30', 1);

-- Stock & Price Alerts (20 each)
INSERT OR IGNORE INTO stock_alerts (id, variant_id, email, created_at) VALUES
('sa-001', 'var-dri-fit-tee-1', 'ali.hassan@gmail.com', '2025-11-01'), ('sa-002', 'var-compression-tank-2', 'fatima.ahmed@yahoo.com', '2025-11-03'),
('sa-003', 'var-joggers-3', 'muhammad.khan@hotmail.com', '2025-11-05'), ('sa-004', 'var-stringer-1', 'hassan.raza@outlook.com', '2025-11-08'),
('sa-005', 'var-hoodie-4', 'sana.iqbal@live.com', '2025-11-10'), ('sa-006', 'var-shorts-2', 'bilal.ahmed@gmail.com', '2025-11-15'),
('sa-007', 'var-w-leggings-m', 'hira.khan@yahoo.com', '2025-11-18'), ('sa-008', 'var-w-bra-l', 'omar.sheikh@hotmail.com', '2025-11-20'),
('sa-009', 'var-w-tank-s', 'mahnoor.tariq@gmail.com', '2025-11-22'), ('sa-010', 'var-w-hoodie-xl', 'zain.abbas@outlook.com', '2025-11-25'),
('sa-011', 'var-lifting-straps-os', 'amna.riaz@live.com', '2025-12-01'), ('sa-012', 'var-knee-sleeves-m', 'haroon.malik@gmail.com', '2025-12-03'),
('sa-013', 'var-gym-bag-os', 'zara.hashmi@yahoo.com', '2025-12-05'), ('sa-014', 'var-water-bottle-os', 'usman.gondal@hotmail.com', '2025-12-08'),
('sa-015', 'var-jump-rope-os', 'mariam.shah@outlook.com', '2025-12-10'), ('sa-016', 'var-gym-gloves-s', 'fahad.khan@gmail.com', '2025-12-12'),
('sa-017', 'var-racerback-2', 'saima.butt@live.com', '2025-12-15'), ('sa-018', 'var-zip-hoodie-3', 'taha.rana@yahoo.com', '2025-12-18'),
('sa-019', 'var-w-racerback-m', 'rabia.anwar@gmail.com', '2025-12-20'), ('sa-020', 'var-w-capris-l', 'saad.naeem@hotmail.com', '2025-12-22');

INSERT OR IGNORE INTO price_alerts (id, product_id, email, target_price, created_at) VALUES
('pa-001', 'gymflex-dri-fit-tee', 'ali.hassan@gmail.com', 1200, '2025-10-01'), ('pa-002', 'gymflex-compression-tank', 'fatima.ahmed@yahoo.com', 1300, '2025-10-03'),
('pa-003', 'gymflex-joggers', 'muhammad.khan@hotmail.com', 2200, '2025-10-05'), ('pa-004', 'gymflex-stringer', 'hassan.raza@outlook.com', 900, '2025-10-08'),
('pa-005', 'gymflex-hoodie', 'sana.iqbal@live.com', 2000, '2025-10-10'), ('pa-006', 'gymflex-shorts', 'bilal.ahmed@gmail.com', 1400, '2025-10-15'),
('pa-007', 'gymflex-women-leggings', 'hira.khan@yahoo.com', 1800, '2025-10-18'), ('pa-008', 'gymflex-women-sports-bra', 'omar.sheikh@hotmail.com', 1500, '2025-10-20'),
('pa-009', 'gymflex-women-tank', 'mahnoor.tariq@gmail.com', 800, '2025-10-22'), ('pa-010', 'gymflex-gym-bag', 'zain.abbas@outlook.com', 2500, '2025-10-25'),
('pa-011', 'gymflex-water-bottle', 'amna.riaz@live.com', 1000, '2025-11-01'), ('pa-012', 'gymflex-lifting-straps', 'haroon.malik@gmail.com', 700, '2025-11-03'),
('pa-013', 'gymflex-knee-sleeves', 'zara.hashmi@yahoo.com', 1200, '2025-11-05'), ('pa-014', 'gymflex-women-joggers', 'usman.gondal@hotmail.com', 2000, '2025-11-08'),
('pa-015', 'gymflex-racerback', 'mariam.shah@outlook.com', 1000, '2025-11-10'), ('pa-016', 'gymflex-women-hoodie', 'fahad.khan@gmail.com', 2000, '2025-11-12'),
('pa-017', 'gymflex-zip-hoodie', 'saima.butt@live.com', 2500, '2025-11-15'), ('pa-018', 'gymflex-women-thermal', 'taha.rana@yahoo.com', 1500, '2025-11-18'),
('pa-019', 'gymflex-resistance-bands', 'rabia.anwar@gmail.com', 1500, '2025-11-20'), ('pa-020', 'gymflex-cargo-joggers', 'saad.naeem@hotmail.com', 2300, '2025-11-22');

-- Look Products (14 pairings)
INSERT OR IGNORE INTO look_products (id, product_id, linked_product_id, sort_order) VALUES
('look-001', 'gymflex-dri-fit-tee', 'gymflex-joggers', 0), ('look-002', 'gymflex-dri-fit-tee', 'gymflex-shorts', 1),
('look-003', 'gymflex-compression-tank', 'gymflex-shorts', 0), ('look-004', 'gymflex-compression-tank', 'gymflex-joggers', 1),
('look-005', 'gymflex-joggers', 'gymflex-dri-fit-tee', 0), ('look-006', 'gymflex-joggers', 'gymflex-hoodie', 1),
('look-007', 'gymflex-hoodie', 'gymflex-joggers', 0), ('look-008', 'gymflex-hoodie', 'gymflex-cargo-joggers', 1),
('look-009', 'gymflex-women-leggings', 'gymflex-women-tank', 0), ('look-010', 'gymflex-women-leggings', 'gymflex-women-sports-bra', 1),
('look-011', 'gymflex-women-tank', 'gymflex-women-leggings', 0), ('look-012', 'gymflex-women-joggers', 'gymflex-women-racerback', 0),
('look-013', 'gymflex-women-hoodie', 'gymflex-women-leggings', 0), ('look-014', 'gymflex-women-sports-bra', 'gymflex-women-shorts', 0);

-- Site Settings — Updated with realistic config
INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (
  'homepage',
  '{"heroButtonText":"Shop GymFlex","heroButtonLink":"/shop","featuredProductId":"gymflex-dri-fit-tee","featuredEyebrow":"New Arrivals","featuredTitle":"Featured Products","collectionKicker":"Premium Gym Wear","recentTitle":"Recently Viewed","headerCollectionSlugs":["mens","womens","accessories"],"heroBanner":{"animation":"fade","animationDuration":100,"slideDuration":5000,"desktopImages":["","",""],"mobileImages":["","",""]},"shippingFee":250,"freeShippingMinimum":1000,"taxRate":0}',
  CURRENT_TIMESTAMP
);

PRAGMA foreign_keys = ON;
