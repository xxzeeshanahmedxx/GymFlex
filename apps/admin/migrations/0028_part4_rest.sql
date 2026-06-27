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

-- Newsletter Subscribers (200)
INSERT OR IGNORE INTO newsletter_subscribers (id, email, created_at) VALUES
('sub-001', 'ali.hassan@gmail.com', '2025-08-01'), ('sub-002', 'fatima.ahmed@yahoo.com', '2025-08-03'), ('sub-003', 'muhammad.khan@hotmail.com', '2025-08-05'), ('sub-004', 'ayesha.malik@gmail.com', '2025-08-08'),
('sub-005', 'hassan.raza@outlook.com', '2025-08-10'), ('sub-006', 'sana.iqbal@live.com', '2025-08-12'), ('sub-007', 'bilal.ahmed@gmail.com', '2025-08-15'), ('sub-008', 'hira.khan@yahoo.com', '2025-08-18'),
('sub-009', 'omar.sheikh@hotmail.com', '2025-08-20'), ('sub-010', 'mahnoor.tariq@gmail.com', '2025-08-22'), ('sub-011', 'zain.abbas@outlook.com', '2025-08-25'), ('sub-012', 'amna.riaz@live.com', '2025-08-28'),
('sub-013', 'haroon.malik@gmail.com', '2025-09-01'), ('sub-014', 'zara.hashmi@yahoo.com', '2025-09-03'), ('sub-015', 'usman.gondal@hotmail.com', '2025-09-05'), ('sub-016', 'mariam.shah@outlook.com', '2025-09-08'),
('sub-017', 'fahad.khan@gmail.com', '2025-09-10'), ('sub-018', 'saima.butt@live.com', '2025-09-12'), ('sub-019', 'taha.rana@yahoo.com', '2025-09-15'), ('sub-020', 'rabia.anwar@gmail.com', '2025-09-18'),
('sub-021', 'saad.naeem@hotmail.com', '2025-09-20'), ('sub-022', 'ayesha.khan2@outlook.com', '2025-09-22'), ('sub-023', 'rayan.ali@live.com', '2025-09-25'), ('sub-024', 'fatima.zahra@gmail.com', '2025-09-28'),
('sub-025', 'shehryar.afridi@yahoo.com', '2025-10-01'), ('sub-026', 'mahnoor.siddiqui@hotmail.com', '2025-10-03'), ('sub-027', 'awais.butt@outlook.com', '2025-10-05'), ('sub-028', 'arslan.mehmood@gmail.com', '2025-10-08'),
('sub-029', 'hira.noreen@live.com', '2025-10-10'), ('sub-030', 'taimoor.siddiqui@yahoo.com', '2025-10-12'), ('sub-031', 'shahmir.ali@gmail.com', '2025-10-15'), ('sub-032', 'sadia.tariq@hotmail.com', '2025-10-18'),
('sub-033', 'waleed.malik@outlook.com', '2025-10-20'), ('sub-034', 'naveed.rasheed@live.com', '2025-10-22'), ('sub-035', 'sana.murtaza@gmail.com', '2025-10-25'), ('sub-036', 'zubair.ahmed@yahoo.com', '2025-10-28'),
('sub-037', 'mariam.ali@hotmail.com', '2025-11-01'), ('sub-038', 'rohail.khan@outlook.com', '2025-11-03'), ('sub-039', 'hammad.naeem@gmail.com', '2025-11-05'), ('sub-040', 'rabia.khalid@live.com', '2025-11-08'),
('sub-041', 'noman.ahmed@gmail.com', '2025-11-10'), ('sub-042', 'sara.khan@yahoo.com', '2025-11-12'), ('sub-043', 'kamran.siddiqui@hotmail.com', '2025-11-15'), ('sub-044', 'tahira.rasheed@outlook.com', '2025-11-18'),
('sub-045', 'farhan.ali@live.com', '2025-11-20'), ('sub-046', 'nadia.malik@gmail.com', '2025-11-22'), ('sub-047', 'junaid.hassan@yahoo.com', '2025-11-25'), ('sub-048', 'rubab.shah@hotmail.com', '2025-11-28'),
('sub-049', 'fawad.khan@outlook.com', '2025-12-01'), ('sub-050', 'komal.raza@live.com', '2025-12-03'), ('sub-051', 'zainab.ali@gmail.com', '2025-12-05'), ('sub-052', 'hamza.akram@yahoo.com', '2025-12-08'),
('sub-053', 'sahar.butt@hotmail.com', '2025-12-10'), ('sub-054', 'rehan.khan@outlook.com', '2025-12-12'), ('sub-055', 'numair.hassan@live.com', '2025-12-15'), ('sub-056', 'alina.sheikh@gmail.com', '2025-12-18'),
('sub-057', 'irfan.khan@yahoo.com', '2025-12-20'), ('sub-058', 'sundus.tariq@hotmail.com', '2025-12-22'), ('sub-059', 'adil.raza@outlook.com', '2025-12-25'), ('sub-060', 'sabeen.malik@live.com', '2025-12-28'),
('sub-061', 'umair.hassan@gmail.com', '2026-01-01'), ('sub-062', 'tuba.khan@yahoo.com', '2026-01-03'), ('sub-063', 'shahid.siddiqui@hotmail.com', '2026-01-05'), ('sub-064', 'bushra.ali@outlook.com', '2026-01-08'),
('sub-065', 'muneeb.ahmed@live.com', '2026-01-10'), ('sub-066', 'sarah.iqbal@gmail.com', '2026-01-12'), ('sub-067', 'faraz.khan@yahoo.com', '2026-01-15'), ('sub-068', 'aiza.raza@hotmail.com', '2026-01-18'),
('sub-069', 'imran.khan@outlook.com', '2026-01-20'), ('sub-070', 'laiba.shah@live.com', '2026-01-22'), ('sub-071', 'hina.nasir@gmail.com', '2026-01-25'), ('sub-072', 'aqib.hussain@yahoo.com', '2026-01-28'),
('sub-073', 'zarnish.akram@hotmail.com', '2026-02-01'), ('sub-074', 'waseem.ahmed@outlook.com', '2026-02-03'), ('sub-075', 'amna.siddiqui@live.com', '2026-02-05'), ('sub-076', 'bilawal.khan@gmail.com', '2026-02-08'),
('sub-077', 'sania.mirza@yahoo.com', '2026-02-10'), ('sub-078', 'salman.butt@hotmail.com', '2026-02-12'), ('sub-079', 'zainab.noor@outlook.com', '2026-02-15'), ('sub-080', 'arsalan.ahmed@live.com', '2026-02-18'),
('sub-081', 'maria.khan@gmail.com', '2026-02-20'), ('sub-082', 'faisal.javed@yahoo.com', '2026-02-22'), ('sub-083', 'nimra.rizvi@hotmail.com', '2026-02-25'), ('sub-084', 'asim.shah@outlook.com', '2026-02-28'),
('sub-085', 'sabeen.ali@live.com', '2026-03-01'), ('sub-086', 'aamir.siddiqui@gmail.com', '2026-03-03'), ('sub-087', 'sana.zafar@yahoo.com', '2026-03-05'), ('sub-088', 'farhan.khan@hotmail.com', '2026-03-08'),
('sub-089', 'hira.sheikh@outlook.com', '2026-03-10'), ('sub-090', 'nabeel.ahmed@live.com', '2026-03-12'), ('sub-091', 'tania.malik@gmail.com', '2026-03-15'), ('sub-092', 'rizwan.khan@yahoo.com', '2026-03-18'),
('sub-093', 'ayesha.noreen@hotmail.com', '2026-03-20'), ('sub-094', 'saad.khalid@outlook.com', '2026-03-22'), ('sub-095', 'hira.fatima@live.com', '2026-03-25'), ('sub-096', 'omer.ahmed@gmail.com', '2026-03-28'),
('sub-097', 'rida.khan@yahoo.com', '2026-04-01'), ('sub-098', 'daniyal.ali@hotmail.com', '2026-04-03'), ('sub-099', 'sabahat.raza@outlook.com', '2026-04-05'), ('sub-100', 'zohaib.ahmed@live.com', '2026-04-08'),
('sub-101', 'nazia.hussain@gmail.com', '2026-04-10'), ('sub-102', 'noman.ali@yahoo.com', '2026-04-12'), ('sub-103', 'zara.khan@hotmail.com', '2026-04-15'), ('sub-104', 'shahzad.ahmed@outlook.com', '2026-04-18'),
('sub-105', 'tahseen.fatima@live.com', '2026-04-20'), ('sub-106', 'asif.khan@gmail.com', '2026-04-22'), ('sub-107', 'saima.raza@yahoo.com', '2026-04-25'), ('sub-108', 'fahad.siddiqui@hotmail.com', '2026-04-28'),
('sub-109', 'umm-e-hani@outlook.com', '2026-05-01'), ('sub-110', 'shahbaz.ahmed@live.com', '2026-05-03'), ('sub-111', 'iqra.malik@gmail.com', '2026-05-05'), ('sub-112', 'junaid.khan@yahoo.com', '2026-05-08'),
('sub-113', 'busra.naz@hotmail.com', '2026-05-10'), ('sub-114', 'tariq.mehmood@outlook.com', '2026-05-12'), ('sub-115', 'hajra.bibi@live.com', '2026-05-15'), ('sub-116', 'zafar.ali@gmail.com', '2026-05-18'),
('sub-117', 'kiran.sheikh@yahoo.com', '2026-05-20'), ('sub-118', 'rashid.khan@hotmail.com', '2026-05-22'), ('sub-119', 'sadia.akram@outlook.com', '2026-05-25'), ('sub-120', 'adnan.ahmed@live.com', '2026-05-28'),
('sub-121', 'sumaira.ali@gmail.com', '2026-06-01'), ('sub-122', 'naveed.khan@yahoo.com', '2026-06-03'), ('sub-123', 'kanwal.naz@hotmail.com', '2026-06-05'), ('sub-124', 'owais.raza@outlook.com', '2026-06-08'),
('sub-125', 'khizra.khan@live.com', '2026-06-10'), ('sub-126', 'mudassar.ali@gmail.com', '2026-06-12'), ('sub-127', 'tahira.siddiqui@yahoo.com', '2026-06-15'), ('sub-128', 'shoaib.khan@hotmail.com', '2026-06-18'),
('sub-129', 'anila.hassan@outlook.com', '2026-06-20'), ('sub-130', 'zahid.ahmed@live.com', '2026-06-22'), ('sub-131', 'sabrina.ali@gmail.com', '2026-06-25'), ('sub-132', 'khalid.khan@yahoo.com', '2026-06-28'),
('sub-133', 'rabail.naz@hotmail.com', '2026-07-01'), ('sub-134', 'shahzad.raza@outlook.com', '2026-07-03'), ('sub-135', 'fariha.shah@live.com', '2026-07-05'), ('sub-136', 'waqas.ahmed@gmail.com', '2026-07-08'),
('sub-137', 'sana.malik@yahoo.com', '2026-07-10'), ('sub-138', 'hasan.khan@hotmail.com', '2026-07-12'), ('sub-139', 'samia.bibi@outlook.com', '2026-07-15'), ('sub-140', 'rizwan.ali@live.com', '2026-07-18'),
('sub-141', 'noreen.akram@gmail.com', '2026-07-20'), ('sub-142', 'atif.khan@yahoo.com', '2026-07-22'), ('sub-143', 'zulekha.raza@hotmail.com', '2026-07-25'), ('sub-144', 'saleem.ahmed@outlook.com', '2026-07-28'),
('sub-145', 'fizza.hassan@live.com', '2026-08-01'), ('sub-146', 'shahrukh.khan@gmail.com', '2026-08-03'), ('sub-147', 'tayyaba.siddiqui@yahoo.com', '2026-08-05'), ('sub-148', 'taha.ali@hotmail.com', '2026-08-08'),
('sub-149', 'parveen.malik@outlook.com', '2026-08-10'), ('sub-150', 'aliya.khan@live.com', '2026-08-12'), ('sub-151', 'saif.khan@gmail.com', '2026-08-15'), ('sub-152', 'kaneez.fatima@yahoo.com', '2026-08-18'),
('sub-153', 'shahbaz.khan@hotmail.com', '2026-08-20'), ('sub-154', 'sara.ahmed@outlook.com', '2026-08-22'), ('sub-155', 'nadeem.hussain@live.com', '2026-08-25'), ('sub-156', 'rubina.khan@gmail.com', '2026-08-28'),
('sub-157', 'zaman.ali@yahoo.com', '2026-09-01'), ('sub-158', 'nasreen.akhtar@hotmail.com', '2026-09-03'), ('sub-159', 'akram.khan@outlook.com', '2026-09-05'), ('sub-160', 'farhat.jabeen@live.com', '2026-09-08'),
('sub-161', 'rashid.mehmood@gmail.com', '2026-09-10'), ('sub-162', 'nusrat.raza@yahoo.com', '2026-09-12'), ('sub-163', 'shafiq.ahmed@hotmail.com', '2026-09-15'), ('sub-164', 'mariya.khan@outlook.com', '2026-09-18'),
('sub-165', 'tufail.hussain@live.com', '2026-09-20'), ('sub-166', 'sadia.ali@gmail.com', '2026-09-22'), ('sub-167', 'wajid.khan@yahoo.com', '2026-09-25'), ('sub-168', 'zareen.siddiqui@hotmail.com', '2026-09-28'),
('sub-169', 'imtiaz.ahmed@outlook.com', '2026-10-01'), ('sub-170', 'naheed.parveen@live.com', '2026-10-03'), ('sub-171', 'shahid.mehmood@gmail.com', '2026-10-05'), ('sub-172', 'nargis.fatima@yahoo.com', '2026-10-08'),
('sub-173', 'irfan.butt@hotmail.com', '2026-10-10'), ('sub-174', 'tahira.akram@outlook.com', '2026-10-12'), ('sub-175', 'farhan.ali@live.com', '2026-10-15'), ('sub-176', 'saima.naz@gmail.com', '2026-10-18'),
('sub-177', 'waseem.khan@yahoo.com', '2026-10-20'), ('sub-178', 'kausar.siddiqui@hotmail.com', '2026-10-22'), ('sub-179', 'nazia.raza@outlook.com', '2026-10-25'), ('sub-180', 'iftikhar.ahmed@live.com', '2026-10-28'),
('sub-181', 'shazia.ali@gmail.com', '2026-11-01'), ('sub-182', 'khalid.khan@yahoo.com', '2026-11-03'), ('sub-183', 'nasreen.jabeen@hotmail.com', '2026-11-05'), ('sub-184', 'shahzad.raza@outlook.com', '2026-11-08'),
('sub-185', 'sakeena.bibi@live.com', '2026-11-10'), ('sub-186', 'aman.ali@gmail.com', '2026-11-12'), ('sub-187', 'zainab.khan@yahoo.com', '2026-11-15'), ('sub-188', 'gulshan.parveen@hotmail.com', '2026-11-18'),
('sub-189', 'shabbir.ahmed@outlook.com', '2026-11-20'), ('sub-190', 'rukhsana.khan@live.com', '2026-11-22'), ('sub-191', 'javed.ali@gmail.com', '2026-11-25'), ('sub-192', 'nabila.siddiqui@yahoo.com', '2026-11-28'),
('sub-193', 'tanveer.ahmed@hotmail.com', '2026-12-01'), ('sub-194', 'azra.begum@outlook.com', '2026-12-03'), ('sub-195', 'shahjahan.khan@live.com', '2026-12-05'), ('sub-196', 'mahnoor.ali@gmail.com', '2026-12-08'),
('sub-197', 'shabnam.naz@yahoo.com', '2026-12-10'), ('sub-198', 'zafar.khan@hotmail.com', '2026-12-12'), ('sub-199', 'anisa.siddiqui@outlook.com', '2026-12-15'), ('sub-200', 'ghulam.hussain@live.com', '2026-12-18');

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
