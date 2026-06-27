-- ============================================================================
-- GymFlex Mock Data Seed — v1
-- Breathes life into the demo store: reviews, orders, stock, discounts,
-- bundles, FAQ, community photos, gift cards, subscribers, alerts, and more.
-- Idempotent: all INSERTs use ON CONFLICT DO NOTHING / OR IGNORE.
-- ============================================================================

-- ============================================================================
-- 1. CATEGORIES
-- ============================================================================
INSERT OR IGNORE INTO categories (id, name, slug, description, sort_order) VALUES
  ('womens', 'Women''s', 'womens', 'High-performance gym wear designed for women.', 1),
  ('accessories', 'Accessories', 'accessories', 'Gear, grips, and essentials for every workout.', 2),
  ('sale', 'Sale', 'sale', 'Limited-time deals on premium gym wear.', 3);

-- ============================================================================
-- 2. PRODUCTS — Women's + Accessories
-- ============================================================================
INSERT OR IGNORE INTO products (id, category_id, name, slug, description, price, sale_price, on_sale, is_active, is_featured, sort_order, meta_title, meta_description) VALUES
  ('gymflex-women-leggings', 'womens', 'High-Waist Training Leggings', 'high-waist-training-leggings', 'Buttery-soft high-waist leggings with squat-proof fabric. Four-way stretch and moisture-wicking for your toughest workouts.', 2499, 1999, 1, 1, 1, 0, 'High-Waist Training Leggings | GymFlex', 'Squat-proof high-waist leggings with four-way stretch.'),
  ('gymflex-women-sports-bra', 'womens', 'Medium Support Sports Bra', 'medium-support-sports-bra', 'Padded sports bra with medium support for gym and cardio. Breathable mesh panels and racerback design.', 1799, NULL, 0, 1, 1, 1, 'Medium Support Sports Bra | GymFlex', 'Breathable padded sports bra with medium support.'),
  ('gymflex-women-tank', 'womens', 'Cropped Gym Tank', 'cropped-gym-tank', 'Sleek cropped tank for confident training. Scoop neck with a relaxed fit through the body.', 1299, 999, 1, 1, 1, 2, 'Cropped Gym Tank | GymFlex', 'Confident cropped tank for training.'),
  ('gymflex-women-joggers', 'womens', 'Slim-Fit Women''s Joggers', 'slim-fit-womens-joggers', 'Tapered joggers with a flattering slim fit. Hidden pocket and stretch waistband.', 2199, NULL, 0, 1, 0, 3, 'Slim-Fit Women''s Joggers | GymFlex', 'Tapered joggers with a flattering slim fit.'),
  ('gymflex-women-shorts', 'womens', 'Biker Training Shorts', 'biker-training-shorts', '4-inch biker shorts with a wide compression waistband. Phone pocket and anti-chafe seams.', 1599, NULL, 0, 1, 0, 4, 'Biker Training Shorts | GymFlex', '4-inch biker shorts with compression waistband.'),
  ('gymflex-women-hoodie', 'womens', 'Oversized Women''s Hoodie', 'oversized-womens-hoodie', 'Cozy oversized hoodie with dropped shoulders. Perfect for pre and post workout layering.', 2799, 2299, 1, 1, 1, 5, 'Oversized Women''s Hoodie | GymFlex', 'Cozy oversized hoodie for layering.'),
  ('gymflex-women-racerback', 'womens', 'Racerback Training Top', 'racerback-training-top', 'Lightweight racerback top for maximum mobility. Sweat-wicking fabric with anti-odor tech.', 1399, NULL, 0, 1, 0, 6, 'Racerback Training Top | GymFlex', 'Lightweight racerback top for maximum mobility.'),
  ('gymflex-women-thermal', 'womens', 'Women''s Thermal Tee', 'womens-thermal-tee', 'Brushed thermal tee for cold-weather training. Compression fit keeps you warm and dry.', 1799, NULL, 0, 1, 0, 7, 'Women''s Thermal Tee | GymFlex', 'Brushed thermal tee for cold-weather training.'),
  ('gymflex-women-capris', 'womens', 'Capri Training Leggings', 'capri-training-leggings', 'Cropped capri leggings for warmer sessions. Same squat-proof fabric in a 7-inch inseam.', 2199, NULL, 0, 1, 0, 8, 'Capri Training Leggings | GymFlex', 'Cropped capri leggings for warmer sessions.'),
  ('gymflex-women-sleeveless', 'womens', 'Sleeveless Gym Top', 'sleeveless-gym-top', 'Flowy sleeveless top with a keyhole back detail. Lightweight and breathable.', 1199, NULL, 0, 1, 0, 9, 'Sleeveless Gym Top | GymFlex', 'Flowy sleeveless top with keyhole back.'),
  ('gymflex-lifting-straps', 'accessories', 'Premium Lifting Straps', 'premium-lifting-straps', 'Heavy-duty cotton lifting straps with neoprene padding. 60cm length for secure wraps.', 899, NULL, 0, 1, 1, 0, 'Premium Lifting Straps | GymFlex', 'Heavy-duty cotton lifting straps.'),
  ('gymflex-knee-sleeves', 'accessories', 'Neoprene Knee Sleeves', 'neoprene-knee-sleeves', '7mm neoprene knee sleeves for squat support. Thermal retention keeps joints warm between sets.', 1499, NULL, 0, 1, 0, 1, 'Neoprene Knee Sleeves | GymFlex', '7mm neoprene knee sleeves for squat support.'),
  ('gymflex-gym-bag', 'accessories', 'Duffel Gym Bag', 'duffel-gym-bag', '40L waterproof duffel with wet-dry separation. Shoe compartment and padded shoulder strap.', 3499, 2999, 1, 1, 1, 2, 'Duffel Gym Bag | GymFlex', '40L waterproof duffel with wet-dry separation.'),
  ('gymflex-water-bottle', 'accessories', 'Insulated Water Bottle', 'insulated-water-bottle', '750ml stainless steel bottle. Double-wall vacuum insulation keeps water cold for 24 hours.', 1199, NULL, 0, 1, 0, 3, 'Insulated Water Bottle | GymFlex', '750ml stainless steel insulated water bottle.'),
  ('gymflex-jump-rope', 'accessories', 'Speed Jump Rope', 'speed-jump-rope', 'Ball-bearing speed rope with adjustable 3m cable. Foam handles for comfortable grip.', 699, NULL, 0, 1, 0, 4, 'Speed Jump Rope | GymFlex', 'Ball-bearing speed jump rope.'),
  ('gymflex-resistance-bands', 'accessories', 'Resistance Band Set', 'resistance-band-set', 'Set of 5 latex resistance bands (10-50lbs). Includes carry bag and exercise guide.', 1999, NULL, 0, 1, 0, 5, 'Resistance Band Set | GymFlex', 'Set of 5 latex resistance bands.'),
  ('gymflex-foam-roller', 'accessories', 'High-Density Foam Roller', 'high-density-foam-roller', '33cm foam roller with medium density for muscle recovery. Textured surface targets knots.', 1499, NULL, 0, 1, 0, 6, 'High-Density Foam Roller | GymFlex', '33cm foam roller for muscle recovery.'),
  ('gymflex-gym-gloves', 'accessories', 'Ventilated Gym Gloves', 'ventilated-gym-gloves', 'Breathable gym gloves with silicone palm grip. Wrist wrap support and finger loops for easy removal.', 999, NULL, 0, 1, 0, 7, 'Ventilated Gym Gloves | GymFlex', 'Breathable gym gloves with silicone grip.');

-- ============================================================================
-- 3. PRODUCT VARIANTS — Women's (S-XL) & Accessories (One Size)
-- ============================================================================
INSERT OR IGNORE INTO product_variants (id, product_id, type, name, sort_order, image_url) VALUES
  -- Women's leggings
  ('var-w-leggings-xs', 'gymflex-women-leggings', 'Size', 'XS', 0, ''),
  ('var-w-leggings-s', 'gymflex-women-leggings', 'Size', 'S', 1, ''),
  ('var-w-leggings-m', 'gymflex-women-leggings', 'Size', 'M', 2, ''),
  ('var-w-leggings-l', 'gymflex-women-leggings', 'Size', 'L', 3, ''),
  ('var-w-leggings-xl', 'gymflex-women-leggings', 'Size', 'XL', 4, ''),
  -- Women's sports bra
  ('var-w-bra-s', 'gymflex-women-sports-bra', 'Size', 'S', 0, ''),
  ('var-w-bra-m', 'gymflex-women-sports-bra', 'Size', 'M', 1, ''),
  ('var-w-bra-l', 'gymflex-women-sports-bra', 'Size', 'L', 2, ''),
  ('var-w-bra-xl', 'gymflex-women-sports-bra', 'Size', 'XL', 3, ''),
  -- Women's tank
  ('var-w-tank-s', 'gymflex-women-tank', 'Size', 'S', 0, ''),
  ('var-w-tank-m', 'gymflex-women-tank', 'Size', 'M', 1, ''),
  ('var-w-tank-l', 'gymflex-women-tank', 'Size', 'L', 2, ''),
  ('var-w-tank-xl', 'gymflex-women-tank', 'Size', 'XL', 3, ''),
  -- Women's joggers
  ('var-w-joggers-xs', 'gymflex-women-joggers', 'Size', 'XS', 0, ''),
  ('var-w-joggers-s', 'gymflex-women-joggers', 'Size', 'S', 1, ''),
  ('var-w-joggers-m', 'gymflex-women-joggers', 'Size', 'M', 2, ''),
  ('var-w-joggers-l', 'gymflex-women-joggers', 'Size', 'L', 3, ''),
  ('var-w-joggers-xl', 'gymflex-women-joggers', 'Size', 'XL', 4, ''),
  -- Women's shorts
  ('var-w-shorts-xs', 'gymflex-women-shorts', 'Size', 'XS', 0, ''),
  ('var-w-shorts-s', 'gymflex-women-shorts', 'Size', 'S', 1, ''),
  ('var-w-shorts-m', 'gymflex-women-shorts', 'Size', 'M', 2, ''),
  ('var-w-shorts-l', 'gymflex-women-shorts', 'Size', 'L', 3, ''),
  ('var-w-shorts-xl', 'gymflex-women-shorts', 'Size', 'XL', 4, ''),
  -- Women's hoodie
  ('var-w-hoodie-s', 'gymflex-women-hoodie', 'Size', 'S', 0, ''),
  ('var-w-hoodie-m', 'gymflex-women-hoodie', 'Size', 'M', 1, ''),
  ('var-w-hoodie-l', 'gymflex-women-hoodie', 'Size', 'L', 2, ''),
  ('var-w-hoodie-xl', 'gymflex-women-hoodie', 'Size', 'XL', 3, ''),
  -- Women's racerback
  ('var-w-racerback-xs', 'gymflex-women-racerback', 'Size', 'XS', 0, ''),
  ('var-w-racerback-s', 'gymflex-women-racerback', 'Size', 'S', 1, ''),
  ('var-w-racerback-m', 'gymflex-women-racerback', 'Size', 'M', 2, ''),
  ('var-w-racerback-l', 'gymflex-women-racerback', 'Size', 'L', 3, ''),
  -- Women's thermal
  ('var-w-thermal-s', 'gymflex-women-thermal', 'Size', 'S', 0, ''),
  ('var-w-thermal-m', 'gymflex-women-thermal', 'Size', 'M', 1, ''),
  ('var-w-thermal-l', 'gymflex-women-thermal', 'Size', 'L', 2, ''),
  ('var-w-thermal-xl', 'gymflex-women-thermal', 'Size', 'XL', 3, ''),
  -- Women's capris
  ('var-w-capris-xs', 'gymflex-women-capris', 'Size', 'XS', 0, ''),
  ('var-w-capris-s', 'gymflex-women-capris', 'Size', 'S', 1, ''),
  ('var-w-capris-m', 'gymflex-women-capris', 'Size', 'M', 2, ''),
  ('var-w-capris-l', 'gymflex-women-capris', 'Size', 'L', 3, ''),
  ('var-w-capris-xl', 'gymflex-women-capris', 'Size', 'XL', 4, ''),
  -- Women's sleeveless
  ('var-w-sleeveless-xs', 'gymflex-women-sleeveless', 'Size', 'XS', 0, ''),
  ('var-w-sleeveless-s', 'gymflex-women-sleeveless', 'Size', 'S', 1, ''),
  ('var-w-sleeveless-m', 'gymflex-women-sleeveless', 'Size', 'M', 2, ''),
  ('var-w-sleeveless-l', 'gymflex-women-sleeveless', 'Size', 'L', 3, ''),
  ('var-w-sleeveless-xl', 'gymflex-women-sleeveless', 'Size', 'XL', 4, ''),
  -- Accessories (One Size)
  ('var-lifting-straps-os', 'gymflex-lifting-straps', 'Size', 'One Size', 0, ''),
  ('var-knee-sleeves-s', 'gymflex-knee-sleeves', 'Size', 'S', 0, ''),
  ('var-knee-sleeves-m', 'gymflex-knee-sleeves', 'Size', 'M', 1, ''),
  ('var-knee-sleeves-l', 'gymflex-knee-sleeves', 'Size', 'L', 2, ''),
  ('var-knee-sleeves-xl', 'gymflex-knee-sleeves', 'Size', 'XL', 3, ''),
  ('var-gym-bag-os', 'gymflex-gym-bag', 'Size', 'One Size', 0, ''),
  ('var-water-bottle-os', 'gymflex-water-bottle', 'Size', 'One Size', 0, ''),
  ('var-jump-rope-os', 'gymflex-jump-rope', 'Size', 'One Size', 0, ''),
  ('var-resistance-bands-os', 'gymflex-resistance-bands', 'Size', 'One Size', 0, ''),
  ('var-foam-roller-os', 'gymflex-foam-roller', 'Size', 'One Size', 0, ''),
  ('var-gym-gloves-s', 'gymflex-gym-gloves', 'Size', 'S', 0, ''),
  ('var-gym-gloves-m', 'gymflex-gym-gloves', 'Size', 'M', 1, ''),
  ('var-gym-gloves-l', 'gymflex-gym-gloves', 'Size', 'L', 2, ''),
  ('var-gym-gloves-xl', 'gymflex-gym-gloves', 'Size', 'XL', 3, '');

-- ============================================================================
-- 4. STOCK — Every variant gets realistic inventory (5-50 units)
-- ============================================================================
UPDATE product_variants SET stock = ABS(RANDOM() % 46) + 5 WHERE 1=1;

-- A few variants with 0 stock to demo out-of-stock state
UPDATE product_variants SET stock = 0 WHERE id IN (
  'var-dri-fit-tee-1', 'var-shorts-2', 'var-w-hoodie-xl', 'var-gym-gloves-s'
);

-- ============================================================================
-- 5. REVIEWS — 4-5 per product, realistic Pakistani names, 3-5★ ratings
-- ============================================================================
INSERT OR IGNORE INTO reviews (id, product_id, rating, title, body, author_name, is_approved, created_at) VALUES
  -- gymflex-dri-fit-tee (4 reviews)
  ('rev-dri-fit-1', 'gymflex-dri-fit-tee', 5, 'Best tee for gym', 'Incredible fabric quality. Keeps me dry during heavy sessions. True to size.', 'Ali R.', 1, '2025-09-10'),
  ('rev-dri-fit-2', 'gymflex-dri-fit-tee', 4, 'Great value', 'Comfortable and breathable. The fit is slightly loose which I like.', 'Hassan M.', 1, '2025-10-05'),
  ('rev-dri-fit-3', 'gymflex-dri-fit-tee', 5, 'Recommend', 'Bought three of these. Wash well and dont shrink. Perfect for Lahore weather.', 'Usman K.', 1, '2025-11-12'),
  ('rev-dri-fit-4', 'gymflex-dri-fit-tee', 4, 'Good quality', 'Decent tee for the price. Logo is subtle which I appreciate.', 'Ahmed S.', 1, '2025-12-01'),
  -- gymflex-compression-tank (5 reviews)
  ('rev-comp-tank-1', 'gymflex-compression-tank', 5, 'Perfect fit', 'Compression is just right. Not too tight, not too loose. Arm holes are perfectly sized.', 'Bilal A.', 1, '2025-08-15'),
  ('rev-comp-tank-2', 'gymflex-compression-tank', 4, 'Good tank', 'Nice material and stitching. Runs slightly small so size up.', 'Salman K.', 1, '2025-09-20'),
  ('rev-comp-tank-3', 'gymflex-compression-tank', 5, 'Love this', 'My go-to gym tank. The fabric is soft yet durable.', 'Taha R.', 1, '2025-10-10'),
  ('rev-comp-tank-4', 'gymflex-compression-tank', 3, 'Okay', 'Average quality. Stitching could be better around the neck.', 'Zain A.', 1, '2025-11-05'),
  ('rev-comp-tank-5', 'gymflex-compression-tank', 5, 'Excellent', 'Bought for my son and he loves it. Great quality GymFlex products!', 'Fatima A.', 1, '2025-12-15'),
  -- gymflex-joggers (4 reviews)
  ('rev-joggers-1', 'gymflex-joggers', 5, 'Perfect joggers', 'Finally found joggers that fit well. Tapered leg is ideal and the pockets are deep enough for phone.', 'Omar F.', 1, '2025-09-01'),
  ('rev-joggers-2', 'gymflex-joggers', 4, 'Very comfortable', 'Soft inside and look great. Zip pockets are a nice touch.', 'Hammad N.', 1, '2025-10-18'),
  ('rev-joggers-3', 'gymflex-joggers', 5, 'Get these', 'Worth every rupee. Wore them to gym and casual outings both.', 'Saad M.', 1, '2025-11-22'),
  ('rev-joggers-4', 'gymflex-joggers', 4, 'Nice quality', 'Good stitching and material. Sizing is accurate.', 'Rayan A.', 1, '2025-12-10'),
  -- gymflex-stringer (4 reviews)
  ('rev-stringer-1', 'gymflex-stringer', 5, 'Classic stringer', 'Perfect for shoulder day. Full range of motion and looks great.', 'Haroon S.', 1, '2025-08-28'),
  ('rev-stringer-2', 'gymflex-stringer', 4, 'Good cut', 'Nice deep armholes. Fabric is a bit thin but breathable.', 'Aamir K.', 1, '2025-09-15'),
  ('rev-stringer-3', 'gymflex-stringer', 3, 'Decent', 'Sizing runs small. Quality is okay for the price.', 'Naveed R.', 1, '2025-10-20'),
  ('rev-stringer-4', 'gymflex-stringer', 5, 'Love it', 'Best stringer I have owned. Will definitely buy more.', 'Fahad M.', 1, '2025-11-08'),
  -- gymflex-shorts (4 reviews)
  ('rev-shorts-1', 'gymflex-shorts', 4, 'Great shorts', 'Lightweight and perfect for training. The phone pocket is a lifesaver.', 'Zubair A.', 1, '2025-09-05'),
  ('rev-shorts-2', 'gymflex-shorts', 5, 'Perfect length', '7 inch is the sweet spot. Enough coverage without restricting movement.', 'Saifullah K.', 1, '2025-10-12'),
  ('rev-shorts-3', 'gymflex-shorts', 4, 'Nice shorts', 'Comfortable for both gym and runs. Liner is well designed.', 'Waleed M.', 1, '2025-11-20'),
  ('rev-shorts-4', 'gymflex-shorts', 5, 'Buy these', 'Best training shorts I have used. Fabric quality is top notch.', 'Imran P.', 1, '2025-12-05'),
  -- gymflex-hoodie (5 reviews)
  ('rev-hoodie-1', 'gymflex-hoodie', 5, 'Cozy and stylish', 'Oversized fit is perfect. French terry fabric is soft and warm without being heavy.', 'Daniyal S.', 1, '2025-09-20'),
  ('rev-hoodie-2', 'gymflex-hoodie', 5, 'Amazing hoodie', 'Got compliments at the gym. Great quality and stitching.', 'Rohail A.', 1, '2025-10-15'),
  ('rev-hoodie-3', 'gymflex-hoodie', 4, 'Good hoodie', 'Nice and warm. Slightly oversized as expected. Good for Lahore winters.', 'Hamza B.', 1, '2025-11-01'),
  ('rev-hoodie-4', 'gymflex-hoodie', 4, 'Recommended', 'Quality fabric and well made. Only the pockets could be deeper.', 'Shehryar K.', 1, '2025-12-10'),
  ('rev-hoodie-5', 'gymflex-hoodie', 5, 'Perfect', 'Best purchase this month. My new favorite hoodie.', 'Ahmad R.', 1, '2026-01-05'),
  -- gymflex-women-leggings (5 reviews)
  ('rev-w-leggings-1', 'gymflex-women-leggings', 5, 'Squat proof!', 'These leggings are amazing. Completely squat proof and super comfortable. Best gym leggings I have owned.', 'Ayesha K.', 1, '2025-09-15'),
  ('rev-w-leggings-2', 'gymflex-women-leggings', 5, 'Love the fit', 'High waist stays in place during workouts. Fabric is buttery soft.', 'Fatima Z.', 1, '2025-10-20'),
  ('rev-w-leggings-3', 'gymflex-women-leggings', 4, 'Very good', 'Great quality and true to size. Wish they came in more colors.', 'Zara H.', 1, '2025-11-08'),
  ('rev-w-leggings-4', 'gymflex-women-leggings', 5, 'Best leggings', 'Bought two pairs. Worth every penny for the quality.', 'Sana M.', 1, '2025-12-01'),
  ('rev-w-leggings-5', 'gymflex-women-leggings', 4, 'Good but pricey', 'Quality is excellent. Slightly expensive but you get what you pay for.', 'Mahnoor A.', 1, '2026-01-10'),
  -- gymflex-women-sports-bra (4 reviews)
  ('rev-w-bra-1', 'gymflex-women-sports-bra', 5, 'Great support', 'Medium support is perfect for gym and cardio. Very comfortable for extended wear.', 'Hira N.', 1, '2025-09-25'),
  ('rev-w-bra-2', 'gymflex-women-sports-bra', 4, 'Nice bra', 'Good fit and padding is removable. Straps are adjustable which is great.', 'Mariam S.', 1, '2025-10-30'),
  ('rev-w-bra-3', 'gymflex-women-sports-bra', 5, 'Love it', 'Racerback design is cute and functional. Color options are lovely.', 'Rabia K.', 1, '2025-11-15'),
  ('rev-w-bra-4', 'gymflex-women-sports-bra', 4, 'Comfortable', 'Good for medium intensity workouts. Would buy again.', 'Sadia T.', 1, '2025-12-20'),
  -- gymflex-water-bottle (3 reviews)
  ('rev-bottle-1', 'gymflex-water-bottle', 5, 'Keeps water cold', 'Ice water stays cold for a full day. No condensation on the outside. Perfect gym companion.', 'Zain A.', 1, '2025-10-05'),
  ('rev-bottle-2', 'gymflex-water-bottle', 4, 'Good bottle', 'Sturdy build and nice design. The spout could be a bit wider for cleaning.', 'Ali H.', 1, '2025-11-10'),
  ('rev-bottle-3', 'gymflex-water-bottle', 5, 'Worth it', '750ml is the perfect size. Fits in most cup holders and gym bag pockets.', 'Omer K.', 1, '2025-12-15');

-- More reviews for remaining products (short entries)
INSERT OR IGNORE INTO reviews (id, product_id, rating, title, body, author_name, is_approved, created_at) VALUES
  -- gymflex-racerback
  ('rev-racerback-1', 'gymflex-racerback', 5, 'Great mobility', 'Racerback design gives full shoulder freedom. Very breathable fabric.', 'Faisal R.', 1, '2025-10-10'),
  ('rev-racerback-2', 'gymflex-racerback', 4, 'Nice tee', 'Good quality and fit. Anti-odor tech actually works.', 'Taimoor S.', 1, '2025-11-15'),
  ('rev-racerback-3', 'gymflex-racerback', 5, 'Perfect', 'My new favorite gym tee. Bought two more after trying the first one.', 'Waqar Z.', 1, '2025-12-20'),
  -- gymflex-lifting-straps
  ('rev-straps-1', 'gymflex-lifting-straps', 5, 'Solid straps', 'Great for heavy deadlifts. Padding prevents wrist pain even at 150kg+.', 'Arslan M.', 1, '2025-10-15'),
  ('rev-straps-2', 'gymflex-lifting-straps', 4, 'Good quality', 'Neoprene padding is comfortable. 60cm length is sufficient for most wraps.', 'Bilal R.', 1, '2025-11-20'),
  ('rev-straps-3', 'gymflex-lifting-straps', 5, 'Highly recommend', 'Best straps I have used. Stitching is reinforced and they feel durable.', 'Hassan A.', 1, '2025-12-25'),
  -- gymflex-gym-bag
  ('rev-bag-1', 'gymflex-gym-bag', 5, 'Perfect gym bag', 'Spacious with great organization. Wet pocket is a game changer for post-swim gym sessions.', 'Saad K.', 1, '2025-11-01'),
  ('rev-bag-2', 'gymflex-gym-bag', 4, 'Good bag', 'Lots of compartments. Could use a bit more padding on the shoulder strap.', 'Usman G.', 1, '2025-12-05'),
  ('rev-bag-3', 'gymflex-gym-bag', 5, 'Excellent quality', 'Waterproof material works as advertised. Shoe compartment keeps everything separate.', 'Hamza N.', 1, '2026-01-10'),
  -- gymflex-knee-sleeves
  ('rev-knee-1', 'gymflex-knee-sleeves', 5, 'Great for squats', 'Adds confidence on heavy squats. Keeps knees warm between sets.', 'Shahmir A.', 1, '2025-10-20'),
  ('rev-knee-2', 'gymflex-knee-sleeves', 4, 'Good support', '7mm is thick but manageable. Follow the sizing chart carefully.', 'Awais M.', 1, '2025-11-25'),
  -- gymflex-women-hoodie
  ('rev-w-hoodie-1', 'gymflex-women-hoodie', 5, 'Super cozy', 'Oversized fit is perfect for lounging and light gym wear. Amazing fabric.', 'Hira N.', 1, '2025-10-25'),
  ('rev-w-hoodie-2', 'gymflex-women-hoodie', 4, 'Nice hoodie', 'Warm and comfortable. Great for Islamabad winters.', 'Sana M.', 1, '2025-12-01'),
  -- gymflex-women-tank
  ('rev-w-tank-1', 'gymflex-women-tank', 5, 'Cute and comfy', 'Cropped length is perfect. Looks great with high-waist leggings.', 'Mariam S.', 1, '2025-10-28'),
  ('rev-w-tank-2', 'gymflex-women-tank', 4, 'Nice fit', 'Flattering cut and good quality material. Would love more colors.', 'Zara H.', 1, '2025-11-30'),
  -- gymflex-resistance-bands
  ('rev-bands-1', 'gymflex-resistance-bands', 5, 'Great set', '5 bands cover all resistance levels. Bag makes it easy to carry to the gym.', 'Taha R.', 1, '2025-11-05'),
  ('rev-bands-2', 'gymflex-resistance-bands', 4, 'Good quality bands', 'Latex is thick and durable. The included exercise guide has useful routines.', 'Rayan A.', 1, '2025-12-15'),
  -- gymflex-5inch-shorts
  ('rev-5shorts-1', 'gymflex-5inch-shorts', 5, 'Best running shorts', 'Lightweight and breezy. Built-in brief is comfortable and supportive.', 'Ali R.', 1, '2025-11-08'),
  ('rev-5shorts-2', 'gymflex-5inch-shorts', 4, 'Nice shorts', 'Good for hot weather training. Side splits allow full leg movement.', 'Salman K.', 1, '2025-12-20'),
  -- gymflex-zip-hoodie
  ('rev-zip-1', 'gymflex-zip-hoodie', 5, 'Full zip is handy', 'Easy to layer on and off between sets. Thumbholes are a nice bonus.', 'Ahmed S.', 1, '2025-11-12'),
  ('rev-zip-2', 'gymflex-zip-hoodie', 4, 'Good quality', 'Stand up collar looks sharp. Zippered pockets keep phone secure.', 'Zain A.', 1, '2025-12-25'),
  -- gymflex-foam-roller
  ('rev-roller-1', 'gymflex-foam-roller', 5, 'Great for recovery', 'Medium density hits the sweet spot. Textured surface really works out knots.', 'Bilal A.', 1, '2025-11-15'),
  ('rev-roller-2', 'gymflex-foam-roller', 4, 'Solid roller', 'Good size for travel. Sturdy and doesnt lose shape.', 'Omar F.', 1, '2025-12-28');

-- ============================================================================
-- 6. ORDERS — 40 orders across statuses, spread over 6 months (Aug 2025 – Jan 2026)
-- ============================================================================
INSERT OR IGNORE INTO orders (id, order_number, first_name, last_name, address, city, state, phone, country, payment_method, status, subtotal, total, shipping_fee, discount_code, discount_amount, tax_amount, call_status, notes, created_at, updated_at) VALUES
  ('ord-001', 'GF-1001', 'Ali', 'Hassan', 'House 12, Street 5, G-9/1', 'Islamabad', 'Islamabad Capital Territory', '03001234567', 'Pakistan', 'COD', 'delivered', 4497, 4997, 500, '', 0, 0, 'not_needed', 'Leave at gate', '2025-08-05 10:30:00', '2025-08-08 14:00:00'),
  ('ord-002', 'GF-1002', 'Fatima', 'Ahmed', '22-C, Block 6, PECHS', 'Karachi', 'Sindh', '03111234567', 'Pakistan', 'COD', 'delivered', 2999, 3499, 500, '', 0, 0, 'not_needed', '', '2025-08-12 15:45:00', '2025-08-15 11:00:00'),
  ('ord-003', 'GF-1003', 'Muhammad', 'Khan', '15 Street 72, G-13/2', 'Islamabad', 'Islamabad Capital Territory', '03331234567', 'Pakistan', 'COD', 'shipped', 5397, 5897, 500, 'WELCOME10', 540, 0, 'not_needed', '', '2025-08-20 09:15:00', '2025-08-22 16:30:00'),
  ('ord-004', 'GF-1004', 'Ayesha', 'Malik', '45-D, Model Town', 'Lahore', 'Punjab', '03211234567', 'Pakistan', 'COD', 'delivered', 3499, 3999, 500, '', 0, 0, 'not_needed', '', '2025-09-01 11:00:00', '2025-09-04 13:00:00'),
  ('ord-005', 'GF-1005', 'Hassan', 'Raza', '7/A, Gulshan-e-Maymar', 'Karachi', 'Sindh', '03001112233', 'Pakistan', 'COD', 'delivered', 1599, 2099, 500, '', 0, 0, 'not_needed', 'Call before delivery', '2025-09-05 14:30:00', '2025-09-08 10:00:00'),
  ('ord-006', 'GF-1006', 'Sana', 'Iqbal', 'House 8, Street 4, F-10/1', 'Islamabad', 'Islamabad Capital Territory', '03339876543', 'Pakistan', 'COD', 'processing', 2499, 2999, 500, '', 0, 0, 'not_needed', '', '2025-09-10 10:00:00', '2025-09-10 10:00:00'),
  ('ord-007', 'GF-1007', 'Bilal', 'Ahmed', '33-G, Defence Housing Authority', 'Lahore', 'Punjab', '03221234567', 'Pakistan', 'COD', 'confirmed', 4797, 5297, 500, '', 0, 0, 'pending', '', '2025-09-15 16:00:00', '2025-09-15 16:00:00'),
  ('ord-008', 'GF-1008', 'Hira', 'Khan', '12/A, University Road', 'Peshawar', 'Khyber Pakhtunkhwa', '03055443322', 'Pakistan', 'COD', 'new', 1299, 1799, 500, '', 0, 0, 'pending', '', '2025-09-18 12:30:00', '2025-09-18 12:30:00'),
  ('ord-009', 'GF-1009', 'Omar', 'Sheikh', '5-C, Satellite Town', 'Rawalpindi', 'Punjab', '03451234567', 'Pakistan', 'COD', 'delivered', 3998, 4498, 500, 'GYMFLEX50', 500, 0, 'not_needed', '', '2025-09-22 11:15:00', '2025-09-25 14:00:00'),
  ('ord-010', 'GF-1010', 'Mahnoor', 'Tariq', 'House 2, Street 8, Phase 2', 'Faisalabad', 'Punjab', '03061122334', 'Pakistan', 'COD', 'delivered', 2199, 2699, 500, '', 0, 0, 'not_needed', 'Leave with guard', '2025-09-28 09:45:00', '2025-10-01 11:00:00'),
  ('ord-011', 'GF-1011', 'Zain', 'Abbas', '14, Gulberg III', 'Lahore', 'Punjab', '03221122334', 'Pakistan', 'COD', 'shipped', 1799, 2299, 500, '', 0, 0, 'not_needed', '', '2025-10-02 13:00:00', '2025-10-03 10:30:00'),
  ('ord-012', 'GF-1012', 'Amna', 'Riaz', '55-B, Jinnah Avenue', 'Multan', 'Punjab', '03006677889', 'Pakistan', 'COD', 'processing', 3499, 3999, 500, '', 0, 0, 'not_needed', '', '2025-10-05 15:30:00', '2025-10-05 15:30:00'),
  ('ord-013', 'GF-1013', 'Haroon', 'Malik', '16, F-7/3', 'Islamabad', 'Islamabad Capital Territory', '03339870123', 'Pakistan', 'COD', 'delivered', 6297, 6797, 500, 'WELCOME10', 630, 0, 'not_needed', '', '2025-10-10 10:00:00', '2025-10-13 12:00:00'),
  ('ord-014', 'GF-1014', 'Zara', 'Hashmi', 'House 7, Street 3, G-11/1', 'Islamabad', 'Islamabad Capital Territory', '03125678901', 'Pakistan', 'COD', 'cancelled', 1599, 2099, 500, '', 0, 0, 'not_needed', 'Customer cancelled', '2025-10-12 17:00:00', '2025-10-13 09:00:00'),
  ('ord-015', 'GF-1015', 'Usman', 'Gondal', '88-A, Canal View', 'Sialkot', 'Punjab', '03014455667', 'Pakistan', 'COD', 'delivered', 899, 1399, 500, '', 0, 0, 'not_needed', '', '2025-10-18 11:30:00', '2025-10-21 10:00:00'),
  ('ord-016', 'GF-1016', 'Mariam', 'Shah', '12, Defence View', 'Karachi', 'Sindh', '03117890123', 'Pakistan', 'COD', 'new', 2799, 3299, 500, '', 0, 0, 'pending', '', '2025-10-22 14:00:00', '2025-10-22 14:00:00'),
  ('ord-017', 'GF-1017', 'Fahad', 'Khan', '3-C, Askari X', 'Rawalpindi', 'Punjab', '03334567890', 'Pakistan', 'COD', 'confirmed', 2499, 2999, 500, '', 0, 0, 'pending', 'Call before coming', '2025-10-25 09:30:00', '2025-10-25 09:30:00'),
  ('ord-018', 'GF-1018', 'Saima', 'Butt', 'House 19, Street 12, F-8/4', 'Islamabad', 'Islamabad Capital Territory', '03009876543', 'Pakistan', 'COD', 'shipped', 4198, 4698, 500, '', 0, 0, 'not_needed', '', '2025-10-28 16:15:00', '2025-10-29 11:00:00'),
  ('ord-019', 'GF-1019', 'Taha', 'Rana', '22, Gulistan-e-Jauhar', 'Karachi', 'Sindh', '03228765432', 'Pakistan', 'COD', 'delivered', 699, 1199, 500, '', 0, 0, 'not_needed', '', '2025-11-01 12:00:00', '2025-11-04 10:00:00'),
  ('ord-020', 'GF-1020', 'Rabia', 'Anwar', '6-B, Satellite Town', 'Gujranwala', 'Punjab', '03053322114', 'Pakistan', 'COD', 'processing', 3499, 3999, 500, '', 0, 0, 'not_needed', '', '2025-11-05 10:30:00', '2025-11-05 10:30:00'),
  ('ord-021', 'GF-1021', 'Saad', 'Naeem', '101, Valencia Town', 'Lahore', 'Punjab', '03225443322', 'Pakistan', 'COD', 'delivered', 4497, 4997, 500, 'GYMFLEX50', 500, 0, 'not_needed', 'Gate code 5523', '2025-11-08 15:00:00', '2025-11-11 12:30:00'),
  ('ord-022', 'GF-1022', 'Ayesha', 'Khan', 'House 5, PAF Colony', 'Sargodha', 'Punjab', '03001110022', 'Pakistan', 'COD', 'confirmed', 2499, 2999, 500, '', 0, 0, 'pending', '', '2025-11-12 11:45:00', '2025-11-12 11:45:00'),
  ('ord-023', 'GF-1023', 'Rayan', 'Ali', '9, Defence Garden', 'Multan', 'Punjab', '03028887766', 'Pakistan', 'COD', 'new', 1799, 2299, 500, '', 0, 0, 'pending', '', '2025-11-15 14:00:00', '2025-11-15 14:00:00'),
  ('ord-024', 'GF-1024', 'Fatima', 'Zahra', '14-B, Gulshan-e-Ravi', 'Lahore', 'Punjab', '03226778899', 'Pakistan', 'COD', 'shipped', 3799, 4299, 500, '', 0, 0, 'not_needed', '', '2025-11-18 10:15:00', '2025-11-19 09:30:00'),
  ('ord-025', 'GF-1025', 'Shehryar', 'Afridi', '22, Phase 5, DHA', 'Karachi', 'Sindh', '03001928374', 'Pakistan', 'COD', 'delivered', 2799, 3299, 500, '', 0, 0, 'not_needed', 'Security will accept', '2025-11-22 12:30:00', '2025-11-25 14:00:00'),
  ('ord-026', 'GF-1026', 'Mahnoor', 'Siddiqui', '4/C, Shah Faisal Colony', 'Karachi', 'Sindh', '03124567890', 'Pakistan', 'COD', 'processing', 3998, 4498, 500, '', 0, 0, 'not_needed', '', '2025-11-25 15:00:00', '2025-11-25 15:00:00'),
  ('ord-027', 'GF-1027', 'Awais', 'Butt', '33, Johar Town', 'Lahore', 'Punjab', '03229988776', 'Pakistan', 'COD', 'cancelled', 1299, 1799, 500, '', 0, 0, 'not_needed', 'Out of stock, cancelled', '2025-11-28 09:00:00', '2025-11-28 09:30:00'),
  ('ord-028', 'GF-1028', 'Arslan', 'Mehmood', 'House 6, Street 2, I-8/3', 'Islamabad', 'Islamabad Capital Territory', '03006543219', 'Pakistan', 'COD', 'delivered', 899, 1399, 500, '', 0, 0, 'not_needed', '', '2025-12-01 11:00:00', '2025-12-04 10:00:00'),
  ('ord-029', 'GF-1029', 'Hira', 'Noreen', '55, Wapda Town', 'Lahore', 'Punjab', '03221119900', 'Pakistan', 'COD', 'new', 4797, 5297, 500, '', 0, 0, 'pending', '', '2025-12-05 13:30:00', '2025-12-05 13:30:00'),
  ('ord-030', 'GF-1030', 'Taimoor', 'Siddiqui', '8-A, Askari VII', 'Rawalpindi', 'Punjab', '03458887766', 'Pakistan', 'COD', 'confirmed', 1999, 2499, 500, '', 0, 0, 'pending', '', '2025-12-08 10:00:00', '2025-12-08 10:00:00'),
  ('ord-031', 'GF-1031', 'Shahmir', 'Ali', '17, Gulberg IV', 'Faisalabad', 'Punjab', '03007778899', 'Pakistan', 'COD', 'shipped', 1499, 1999, 500, '', 0, 0, 'not_needed', '', '2025-12-12 15:45:00', '2025-12-13 11:00:00'),
  ('ord-032', 'GF-1032', 'Sadia', 'Tariq', 'House 9, Street 10, F-10/3', 'Islamabad', 'Islamabad Capital Territory', '03331217890', 'Pakistan', 'COD', 'processing', 2699, 3199, 500, '', 0, 0, 'not_needed', '', '2025-12-18 11:30:00', '2025-12-18 11:30:00'),
  ('ord-033', 'GF-1033', 'Waleed', 'Malik', '42, Civil Lines', 'Sialkot', 'Punjab', '03045566778', 'Pakistan', 'COD', 'delivered', 3499, 3999, 500, 'WELCOME10', 350, 0, 'not_needed', '', '2025-12-22 09:00:00', '2025-12-25 12:00:00'),
  ('ord-034', 'GF-1034', 'Naveed', 'Rasheed', '7, People''s Colony', 'Multan', 'Punjab', '03062233445', 'Pakistan', 'COD', 'new', 1599, 2099, 500, '', 0, 0, 'pending', '', '2025-12-28 14:00:00', '2025-12-28 14:00:00'),
  ('ord-035', 'GF-1035', 'Sana', 'Murtaza', '10-B, Model Town', 'Gujranwala', 'Punjab', '03055544332', 'Pakistan', 'COD', 'confirmed', 4998, 5498, 500, '', 0, 0, 'pending', '', '2026-01-02 10:30:00', '2026-01-02 10:30:00'),
  ('ord-036', 'GF-1036', 'Zubair', 'Ahmed', '22, Garden Town', 'Lahore', 'Punjab', '03223456789', 'Pakistan', 'COD', 'new', 899, 1399, 500, '', 0, 0, 'pending', '', '2026-01-05 16:00:00', '2026-01-05 16:00:00'),
  ('ord-037', 'GF-1037', 'Mariam', 'Ali', '5-C, Gulistan-e-Jauhar', 'Karachi', 'Sindh', '03120987654', 'Pakistan', 'COD', 'shipped', 2199, 2699, 500, '', 0, 0, 'not_needed', '', '2026-01-08 11:15:00', '2026-01-09 10:00:00'),
  ('ord-038', 'GF-1038', 'Rohail', 'Khan', '16, Satellite Town', 'Peshawar', 'Khyber Pakhtunkhwa', '03099554433', 'Pakistan', 'COD', 'processing', 3299, 3799, 500, '', 0, 0, 'not_needed', '', '2026-01-12 13:00:00', '2026-01-12 13:00:00'),
  ('ord-039', 'GF-1039', 'Hammad', 'Naeem', '30, F-6/2', 'Islamabad', 'Islamabad Capital Territory', '03337654321', 'Pakistan', 'COD', 'confirmed', 2999, 3499, 500, '', 0, 0, 'not_needed', '', '2026-01-15 10:45:00', '2026-01-15 10:45:00'),
  ('ord-040', 'GF-1040', 'Rabia', 'Khalid', 'House 1, Street 5, F-11/2', 'Islamabad', 'Islamabad Capital Territory', '03001118822', 'Pakistan', 'COD', 'new', 1799, 2299, 500, '', 0, 0, 'pending', '', '2026-01-18 15:30:00', '2026-01-18 15:30:00');

-- ============================================================================
-- 7. ORDER ITEMS — 2-5 items per order
-- ============================================================================
INSERT OR IGNORE INTO order_items (id, order_id, product_id, product_name, variant_id, variant_type, variant_name, unit_price, quantity, line_total) VALUES
  ('oi-001', 'ord-001', 'gymflex-dri-fit-tee', 'Dri-Fit Training Tee', 'var-dri-fit-tee-2', 'Size', 'M', 1499, 2, 2998),
  ('oi-002', 'ord-001', 'gymflex-compression-tank', 'Compression Tank Top', 'var-compression-tank-2', 'Size', 'M', 1499, 1, 1499),
  ('oi-003', 'ord-002', 'gymflex-joggers', 'Performance Joggers', 'var-joggers-2', 'Size', 'M', 2499, 1, 2499),
  ('oi-004', 'ord-002', 'gymflex-beanie', 'Gym Flex Beanie', 'var-beanie-1', 'Size', 'One Size', 699, 1, 699),
  ('oi-005', 'ord-003', 'gymflex-stringer', 'Classic Stringer Vest', 'var-stringer-1', 'Size', 'S', 999, 3, 2997),
  ('oi-006', 'ord-003', 'gymflex-wrist-straps', 'Leather Wrist Straps', 'var-wrist-straps-1', 'Size', 'One Size', 899, 2, 1798),
  ('oi-007', 'ord-004', 'gymflex-hoodie', 'Gym Hoodie', 'var-hoodie-2', 'Size', 'M', 2499, 1, 2499),
  ('oi-008', 'ord-004', 'gymflex-shorts', 'Training Shorts', 'var-shorts-1', 'Size', 'S', 1599, 1, 1599),
  ('oi-009', 'ord-005', 'gymflex-shorts', 'Training Shorts', 'var-shorts-3', 'Size', 'L', 1599, 1, 1599),
  ('oi-010', 'ord-006', 'gymflex-women-leggings', 'High-Waist Training Leggings', 'var-w-leggings-s', 'Size', 'S', 1999, 1, 1999),
  ('oi-011', 'ord-006', 'gymflex-women-tank', 'Cropped Gym Tank', 'var-w-tank-s', 'Size', 'S', 999, 1, 999),
  ('oi-012', 'ord-007', 'gymflex-dri-fit-tee', 'Dri-Fit Training Tee', 'var-dri-fit-tee-3', 'Size', 'L', 1499, 2, 2998),
  ('oi-013', 'ord-007', 'gymflex-stringer', 'Classic Stringer Vest', 'var-stringer-3', 'Size', 'L', 999, 2, 1998),
  ('oi-014', 'ord-008', 'gymflex-muscle-tee', 'Muscle Fit Tee', 'var-muscle-tee-2', 'Size', 'M', 1199, 1, 1199),
  ('oi-015', 'ord-009', 'gymflex-racerback', 'Racerback Gym Tee', 'var-racerback-3', 'Size', 'L', 1399, 2, 2798),
  ('oi-016', 'ord-009', 'gymflex-beanie', 'Gym Flex Beanie', 'var-beanie-1', 'Size', 'One Size', 699, 1, 699),
  ('oi-017', 'ord-010', 'gymflex-women-joggers', 'Slim-Fit Women''s Joggers', 'var-w-joggers-s', 'Size', 'S', 2199, 1, 2199),
  ('oi-018', 'ord-011', 'gymflex-compression-tank', 'Compression Tank Top', 'var-compression-tank-4', 'Size', 'XL', 1499, 1, 1499),
  ('oi-019', 'ord-012', 'gymflex-gym-bag', 'Duffel Gym Bag', 'var-gym-bag-os', 'Size', 'One Size', 2999, 1, 2999),
  ('oi-020', 'ord-013', 'gymflex-hoodie', 'Gym Hoodie', 'var-hoodie-3', 'Size', 'L', 2499, 1, 2499),
  ('oi-021', 'ord-013', 'gymflex-joggers', 'Performance Joggers', 'var-joggers-1', 'Size', 'S', 2499, 1, 2499),
  ('oi-022', 'ord-013', 'gymflex-water-bottle', 'Insulated Water Bottle', 'var-water-bottle-os', 'Size', 'One Size', 1199, 1, 1199),
  ('oi-023', 'ord-014', 'gymflex-women-shorts', 'Biker Training Shorts', 'var-w-shorts-m', 'Size', 'M', 1599, 1, 1599),
  ('oi-024', 'ord-015', 'gymflex-lifting-straps', 'Premium Lifting Straps', 'var-lifting-straps-os', 'Size', 'One Size', 899, 1, 899),
  ('oi-025', 'ord-016', 'gymflex-women-hoodie', 'Oversized Women''s Hoodie', 'var-w-hoodie-m', 'Size', 'M', 2299, 1, 2299),
  ('oi-026', 'ord-016', 'gymflex-women-tank', 'Cropped Gym Tank', 'var-w-tank-m', 'Size', 'M', 999, 1, 999),
  ('oi-027', 'ord-017', 'gymflex-gym-bag', 'Duffel Gym Bag', 'var-gym-bag-os', 'Size', 'One Size', 2999, 1, 2999),
  ('oi-028', 'ord-018', 'gymflex-women-racerback', 'Racerback Training Top', 'var-w-racerback-m', 'Size', 'M', 1399, 2, 2798),
  ('oi-029', 'ord-018', 'gymflex-women-leggings', 'High-Waist Training Leggings', 'var-w-leggings-m', 'Size', 'M', 1999, 1, 1999),
  ('oi-030', 'ord-019', 'gymflex-beanie', 'Gym Flex Beanie', 'var-beanie-1', 'Size', 'One Size', 699, 1, 699),
  ('oi-031', 'ord-020', 'gymflex-women-sports-bra', 'Medium Support Sports Bra', 'var-w-bra-m', 'Size', 'M', 1799, 1, 1799),
  ('oi-032', 'ord-020', 'gymflex-women-sleeveless', 'Sleeveless Gym Top', 'var-w-sleeveless-m', 'Size', 'M', 1199, 1, 1199),
  ('oi-033', 'ord-021', 'gymflex-dri-fit-tee', 'Dri-Fit Training Tee', 'var-dri-fit-tee-3', 'Size', 'L', 1499, 2, 2998),
  ('oi-034', 'ord-021', 'gymflex-joggers', 'Performance Joggers', 'var-joggers-3', 'Size', 'L', 2499, 1, 2499),
  ('oi-035', 'ord-022', 'gymflex-women-leggings', 'High-Waist Training Leggings', 'var-w-leggings-l', 'Size', 'L', 1999, 1, 1999),
  ('oi-036', 'ord-023', 'gymflex-water-bottle', 'Insulated Water Bottle', 'var-water-bottle-os', 'Size', 'One Size', 1199, 1, 1199),
  ('oi-037', 'ord-024', 'gymflex-windbreaker', 'Lightweight Windbreaker', 'var-windbreaker-2', 'Size', 'M', 3799, 1, 3799),
  ('oi-038', 'ord-025', 'gymflex-women-hoodie', 'Oversized Women''s Hoodie', 'var-w-hoodie-s', 'Size', 'S', 2299, 1, 2299),
  ('oi-039', 'ord-025', 'gymflex-women-thermal', 'Women''s Thermal Tee', 'var-w-thermal-s', 'Size', 'S', 1799, 1, 1799),
  ('oi-040', 'ord-026', 'gymflex-compression-tank', 'Compression Tank Top', 'var-compression-tank-2', 'Size', 'M', 1499, 2, 2998),
  ('oi-041', 'ord-026', 'gymflex-shorts', 'Training Shorts', 'var-shorts-3', 'Size', 'L', 1599, 1, 1599),
  ('oi-042', 'ord-027', 'gymflex-track-pants', 'Track Pants', 'var-track-pants-2', 'Size', 'M', 2199, 1, 2199),
  ('oi-043', 'ord-028', 'gymflex-lifting-straps', 'Premium Lifting Straps', 'var-lifting-straps-os', 'Size', 'One Size', 899, 1, 899),
  ('oi-044', 'ord-029', 'gymflex-dri-fit-tee', 'Dri-Fit Training Tee', 'var-dri-fit-tee-2', 'Size', 'M', 1499, 2, 2998),
  ('oi-045', 'ord-029', 'gymflex-stringer', 'Classic Stringer Vest', 'var-stringer-2', 'Size', 'M', 999, 2, 1998),
  ('oi-046', 'ord-030', 'gymflex-muscle-tee', 'Muscle Fit Tee', 'var-muscle-tee-3', 'Size', 'L', 1199, 1, 1199),
  ('oi-047', 'ord-031', 'gymflex-dri-fit-tee', 'Dri-Fit Training Tee', 'var-dri-fit-tee-4', 'Size', 'XL', 1499, 1, 1499),
  ('oi-048', 'ord-032', 'gymflex-women-joggers', 'Slim-Fit Women''s Joggers', 'var-w-joggers-m', 'Size', 'M', 2199, 1, 2199),
  ('oi-049', 'ord-033', 'gymflex-hoodie', 'Gym Hoodie', 'var-hoodie-4', 'Size', 'XL', 2499, 1, 2499),
  ('oi-050', 'ord-034', 'gymflex-gym-gloves', 'Ventilated Gym Gloves', 'var-gym-gloves-m', 'Size', 'M', 999, 1, 999),
  ('oi-051', 'ord-035', 'gymflex-women-sports-bra', 'Medium Support Sports Bra', 'var-w-bra-l', 'Size', 'L', 1799, 1, 1799),
  ('oi-052', 'ord-035', 'gymflex-women-leggings', 'High-Waist Training Leggings', 'var-w-leggings-m', 'Size', 'M', 1999, 1, 1999),
  ('oi-053', 'ord-036', 'gymflex-lifting-straps', 'Premium Lifting Straps', 'var-lifting-straps-os', 'Size', 'One Size', 899, 1, 899),
  ('oi-054', 'ord-037', 'gymflex-women-joggers', 'Slim-Fit Women''s Joggers', 'var-w-joggers-m', 'Size', 'M', 2199, 1, 2199),
  ('oi-055', 'ord-038', 'gymflex-zip-hoodie', 'Full Zip Hoodie', 'var-zip-hoodie-2', 'Size', 'M', 2799, 1, 2799),
  ('oi-056', 'ord-039', 'gymflex-cargo-joggers', 'Cargo Joggers', 'var-cargo-joggers-2', 'Size', 'M', 2699, 1, 2699),
  ('oi-057', 'ord-040', 'gymflex-women-tank', 'Cropped Gym Tank', 'var-w-tank-m', 'Size', 'M', 999, 1, 999),
  ('oi-058', 'ord-040', 'gymflex-water-bottle', 'Insulated Water Bottle', 'var-water-bottle-os', 'Size', 'One Size', 1199, 1, 1199);

-- ============================================================================
-- 8. FAQ — 15 entries across 4 categories
-- ============================================================================
INSERT OR IGNORE INTO faq_items (id, category, question, answer, sort_order, is_active) VALUES
  ('faq-1', 'Orders', 'How do I place an order?', 'Simply browse our catalog, select your size and quantity, then add items to your cart. Proceed to checkout, enter your delivery details, and confirm your order. Payment is Cash on Delivery.', 0, 1),
  ('faq-2', 'Orders', 'Can I cancel my order?', 'Yes, you can cancel your order within 24 hours of placing it as long as it hasn''t been shipped yet. Visit your order tracking page or contact us directly.', 1, 1),
  ('faq-3', 'Orders', 'How do I track my order?', 'Use the Track Order page on our website and enter your order number. You can also contact our support team for real-time updates on your delivery.', 2, 1),
  ('faq-4', 'Shipping', 'How long does delivery take?', 'Delivery typically takes 3-5 business days within Pakistan. Orders to Karachi, Lahore, and Islamabad may arrive in 2-3 business days.', 0, 1),
  ('faq-5', 'Shipping', 'What are the shipping charges?', 'Standard shipping is Rs. 250 for most cities. Orders over Rs. 1,000 qualify for free shipping automatically.', 1, 1),
  ('faq-6', 'Shipping', 'Do you deliver to my city?', 'We deliver to all major cities across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, and Gujranwala.', 2, 1),
  ('faq-7', 'Returns', 'What is your return policy?', 'We offer a 30-day return policy on all unworn, unwashed items with tags intact. Contact our support team to initiate a return.', 0, 1),
  ('faq-8', 'Returns', 'How do I return an item?', 'Email us with your order number and items you wish to return. We will arrange a pickup from your address. Refunds are processed within 5-7 business days.', 1, 1),
  ('faq-9', 'Returns', 'Are sale items returnable?', 'Yes, sale items can be returned within 14 days of delivery under the same conditions as regular items.', 2, 1),
  ('faq-10', 'Products', 'How do I choose the right size?', 'Check our Size Guide on each product page. We recommend measuring your chest, waist, and hips and comparing with our size chart. If in doubt, size up for a relaxed fit.', 0, 1),
  ('faq-11', 'Products', 'Are your products true to size?', 'Yes, most customers find our products true to size. Our compression fits are designed to be snug, while our classic fits offer a more relaxed silhouette.', 1, 1),
  ('faq-12', 'Products', 'How should I wash my GymFlex gear?', 'Machine wash cold with similar colors. Do not use fabric softener. Tumble dry low or hang dry to maintain the fabric''s moisture-wicking properties.', 2, 1),
  ('faq-13', 'Products', 'Do you have a loyalty program?', 'Yes! Our GymFlex Loyalty program rewards you with points on every purchase. You can redeem points for discounts on future orders. Ask our team for details.', 3, 1),
  ('faq-14', 'Products', 'What is your bulk pricing policy?', 'We offer tiered discounts on bulk orders of 5+ units. The discount increases with quantity. Check the Bulk Pricing section on product pages for details.', 4, 1),
  ('faq-15', 'General', 'How can I contact support?', 'You can reach us through the contact form on our website, email us at support@gymflex.pk, or call us at 0300-1234567. Our team is available 9 AM to 6 PM, Monday to Saturday.', 0, 1);

-- ============================================================================
-- 9. COMMUNITY PHOTOS — 25 social proof entries
-- ============================================================================
INSERT OR IGNORE INTO community_photos (id, product_id, image_url, author_name, is_approved, created_at) VALUES
  ('cp-001', 'gymflex-dri-fit-tee', 'https://placehold.co/600x600/1e293b/ffffff?text=Ali+in+Dri-Fit', 'Ali R.', 1, '2025-10-01'),
  ('cp-002', 'gymflex-compression-tank', 'https://placehold.co/600x600/334155/ffffff?text=Tank+Mode', 'Hassan M.', 1, '2025-10-05'),
  ('cp-003', 'gymflex-joggers', 'https://placehold.co/600x600/0f172a/ffffff?text=Jogger+Fit', 'Usman K.', 1, '2025-10-10'),
  ('cp-004', 'gymflex-stringer', 'https://placehold.co/600x600/1e293b/ffffff?text=#StringerSeason', 'Bilal A.', 1, '2025-10-15'),
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

-- ============================================================================
-- 10. DISCOUNT CODES — 8 codes (keeps the 2 from migration 0005)
-- ============================================================================
INSERT OR IGNORE INTO discount_codes (id, code, type, value, min_order_amount, max_uses, used_count, is_active, expires_at) VALUES
  ('summer25', 'SUMMER25', 'percentage', 25, 1499, 200, 45, 1, '2026-06-30'),
  ('flex150', 'FLEX150', 'fixed', 150, 999, 500, 120, 1, NULL),
  ('free-ship', 'FREESHIP', 'fixed', 250, 500, 1000, 310, 1, '2026-12-31'),
  ('new20', 'NEW20', 'percentage', 20, 2000, 100, 12, 1, '2026-03-31'),
  ('bulk500', 'BULK500', 'fixed', 500, 5000, 50, 8, 1, '2026-09-30'),
  ('fitfam', 'FITFAM', 'percentage', 15, 1000, 300, 67, 1, NULL);

-- ============================================================================
-- 11. BUNDLES — 4 bundles
-- ============================================================================
INSERT OR IGNORE INTO bundles (id, name, slug, description, price, is_active) VALUES
  ('bundle-starter', 'Starter Gym Pack', 'starter-gym-pack', 'Everything you need to start your fitness journey. T-shirt, shorts, and water bottle at a great price.', 3499, 1),
  ('bundle-womens', 'Women''s Training Set', 'womens-training-set', 'Complete women''s gym set: leggings, sports bra, and cropped tank for confident training.', 4999, 1),
  ('bundle-accessories', 'Accessory Essential Kit', 'accessory-essential-kit', 'Straps, knee sleeves, and jump rope — all the gear for serious lifting sessions.', 2999, 1),
  ('bundle-lifting', 'Heavy Lifting Bundle', 'heavy-lifting-bundle', 'Straps, knee sleeves, and gym gloves for heavy compound lifts. Save big on the complete set.', 3999, 1);

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

-- ============================================================================
-- 12. TIERED PRICING — Bulk discounts on 5 popular products
-- ============================================================================
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

-- ============================================================================
-- 13. SHIPPING RATES — Across major Pakistani cities
-- ============================================================================
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

-- ============================================================================
-- 14. GIFT CARDS — 10 codes with varying balances
-- ============================================================================
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

-- ============================================================================
-- 15. NEWSLETTER SUBSCRIBERS — 200 emails
-- ============================================================================
INSERT OR IGNORE INTO newsletter_subscribers (id, email, created_at) VALUES
  ('sub-001', 'ali.hassan@gmail.com', '2025-08-01'),
  ('sub-002', 'fatima.ahmed@yahoo.com', '2025-08-03'),
  ('sub-003', 'muhammad.khan@hotmail.com', '2025-08-05'),
  ('sub-004', 'ayesha.malik@gmail.com', '2025-08-08'),
  ('sub-005', 'hassan.raza@outlook.com', '2025-08-10'),
  ('sub-006', 'sana.iqbal@live.com', '2025-08-12'),
  ('sub-007', 'bilal.ahmed@gmail.com', '2025-08-15'),
  ('sub-008', 'hira.khan@yahoo.com', '2025-08-18'),
  ('sub-009', 'omar.sheikh@hotmail.com', '2025-08-20'),
  ('sub-010', 'mahnoor.tariq@gmail.com', '2025-08-22'),
  ('sub-011', 'zain.abbas@outlook.com', '2025-08-25'),
  ('sub-012', 'amna.riaz@live.com', '2025-08-28'),
  ('sub-013', 'haroon.malik@gmail.com', '2025-09-01'),
  ('sub-014', 'zara.hashmi@yahoo.com', '2025-09-03'),
  ('sub-015', 'usman.gondal@hotmail.com', '2025-09-05'),
  ('sub-016', 'mariam.shah@outlook.com', '2025-09-08'),
  ('sub-017', 'fahad.khan@gmail.com', '2025-09-10'),
  ('sub-018', 'saima.butt@live.com', '2025-09-12'),
  ('sub-019', 'taha.rana@yahoo.com', '2025-09-15'),
  ('sub-020', 'rabia.anwar@gmail.com', '2025-09-18'),
  ('sub-021', 'saad.naeem@hotmail.com', '2025-09-20'),
  ('sub-022', 'ayesha.khan2@outlook.com', '2025-09-22'),
  ('sub-023', 'rayan.ali@live.com', '2025-09-25'),
  ('sub-024', 'fatima.zahra@gmail.com', '2025-09-28'),
  ('sub-025', 'shehryar.afridi@yahoo.com', '2025-10-01'),
  ('sub-026', 'mahnoor.siddiqui@hotmail.com', '2025-10-03'),
  ('sub-027', 'awais.butt@outlook.com', '2025-10-05'),
  ('sub-028', 'arslan.mehmood@gmail.com', '2025-10-08'),
  ('sub-029', 'hira.noreen@live.com', '2025-10-10'),
  ('sub-030', 'taimoor.siddiqui@yahoo.com', '2025-10-12'),
  ('sub-031', 'shahmir.ali@gmail.com', '2025-10-15'),
  ('sub-032', 'sadia.tariq@hotmail.com', '2025-10-18'),
  ('sub-033', 'waleed.malik@outlook.com', '2025-10-20'),
  ('sub-034', 'naveed.rasheed@live.com', '2025-10-22'),
  ('sub-035', 'sana.murtaza@gmail.com', '2025-10-25'),
  ('sub-036', 'zubair.ahmed@yahoo.com', '2025-10-28'),
  ('sub-037', 'mariam.ali@hotmail.com', '2025-11-01'),
  ('sub-038', 'rohail.khan@outlook.com', '2025-11-03'),
  ('sub-039', 'hammad.naeem@gmail.com', '2025-11-05'),
  ('sub-040', 'rabia.khalid@live.com', '2025-11-08'),
  ('sub-041', 'noman.ahmed@gmail.com', '2025-11-10'),
  ('sub-042', 'sara.khan@yahoo.com', '2025-11-12'),
  ('sub-043', 'kamran.siddiqui@hotmail.com', '2025-11-15'),
  ('sub-044', 'tahira.rasheed@outlook.com', '2025-11-18'),
  ('sub-045', 'farhan.ali@live.com', '2025-11-20'),
  ('sub-046', 'nadia.malik@gmail.com', '2025-11-22'),
  ('sub-047', 'junaid.hassan@yahoo.com', '2025-11-25'),
  ('sub-048', 'rubab.shah@hotmail.com', '2025-11-28'),
  ('sub-049', 'fawad.khan@outlook.com', '2025-12-01'),
  ('sub-050', 'komal.raza@live.com', '2025-12-03'),
  ('sub-051', 'zainab.ali@gmail.com', '2025-12-05'),
  ('sub-052', 'hamza.akram@yahoo.com', '2025-12-08'),
  ('sub-053', 'sahar.butt@hotmail.com', '2025-12-10'),
  ('sub-054', 'rehan.khan@outlook.com', '2025-12-12'),
  ('sub-055', 'numair.hassan@live.com', '2025-12-15'),
  ('sub-056', 'alina.sheikh@gmail.com', '2025-12-18'),
  ('sub-057', 'irfan.khan@yahoo.com', '2025-12-20'),
  ('sub-058', 'sundus.tariq@hotmail.com', '2025-12-22'),
  ('sub-059', 'adil.raza@outlook.com', '2025-12-25'),
  ('sub-060', 'sabeen.malik@live.com', '2025-12-28'),
  ('sub-061', 'umair.hassan@gmail.com', '2026-01-01'),
  ('sub-062', 'tuba.khan@yahoo.com', '2026-01-03'),
  ('sub-063', 'shahid.siddiqui@hotmail.com', '2026-01-05'),
  ('sub-064', 'bushra.ali@outlook.com', '2026-01-08'),
  ('sub-065', 'muneeb.ahmed@live.com', '2026-01-10'),
  ('sub-066', 'sarah.iqbal@gmail.com', '2026-01-12'),
  ('sub-067', 'faraz.khan@yahoo.com', '2026-01-15'),
  ('sub-068', 'aiza.raza@hotmail.com', '2026-01-18'),
  ('sub-069', 'imran.khan@outlook.com', '2026-01-20'),
  ('sub-070', 'laiba.shah@live.com', '2026-01-22'),
  ('sub-071', 'hina.nasir@gmail.com', '2026-01-25'),
  ('sub-072', 'aqib.hussain@yahoo.com', '2026-01-28'),
  ('sub-073', 'zarnish.akram@hotmail.com', '2026-02-01'),
  ('sub-074', 'waseem.ahmed@outlook.com', '2026-02-03'),
  ('sub-075', 'amna.siddiqui@live.com', '2026-02-05'),
  ('sub-076', 'bilawal.khan@gmail.com', '2026-02-08'),
  ('sub-077', 'sania.mirza@yahoo.com', '2026-02-10'),
  ('sub-078', 'salman.butt@hotmail.com', '2026-02-12'),
  ('sub-079', 'zainab.noor@outlook.com', '2026-02-15'),
  ('sub-080', 'arsalan.ahmed@live.com', '2026-02-18'),
  ('sub-081', 'maria.khan@gmail.com', '2026-02-20'),
  ('sub-082', 'faisal.javed@yahoo.com', '2026-02-22'),
  ('sub-083', 'nimra.rizvi@hotmail.com', '2026-02-25'),
  ('sub-084', 'asim.shah@outlook.com', '2026-02-28'),
  ('sub-085', 'sabeen.ali@live.com', '2026-03-01'),
  ('sub-086', 'aamir.siddiqui@gmail.com', '2026-03-03'),
  ('sub-087', 'sana.zafar@yahoo.com', '2026-03-05'),
  ('sub-088', 'farhan.khan@hotmail.com', '2026-03-08'),
  ('sub-089', 'hira.sheikh@outlook.com', '2026-03-10'),
  ('sub-090', 'nabeel.ahmed@live.com', '2026-03-12'),
  ('sub-091', 'tania.malik@gmail.com', '2026-03-15'),
  ('sub-092', 'rizwan.khan@yahoo.com', '2026-03-18'),
  ('sub-093', 'ayesha.noreen@hotmail.com', '2026-03-20'),
  ('sub-094', 'saad.khalid@outlook.com', '2026-03-22'),
  ('sub-095', 'hira.fatima@live.com', '2026-03-25'),
  ('sub-096', 'omer.ahmed@gmail.com', '2026-03-28'),
  ('sub-097', 'rida.khan@yahoo.com', '2026-04-01'),
  ('sub-098', 'daniyal.ali@hotmail.com', '2026-04-03'),
  ('sub-099', 'sabahat.raza@outlook.com', '2026-04-05'),
  ('sub-100', 'zohaib.ahmed@live.com', '2026-04-08'),
  ('sub-101', 'nazia.hussain@gmail.com', '2026-04-10'),
  ('sub-102', 'noman.ali@yahoo.com', '2026-04-12'),
  ('sub-103', 'zara.khan@hotmail.com', '2026-04-15'),
  ('sub-104', 'shahzad.ahmed@outlook.com', '2026-04-18'),
  ('sub-105', 'tahseen.fatima@live.com', '2026-04-20'),
  ('sub-106', 'asif.khan@gmail.com', '2026-04-22'),
  ('sub-107', 'saima.raza@yahoo.com', '2026-04-25'),
  ('sub-108', 'fahad.siddiqui@hotmail.com', '2026-04-28'),
  ('sub-109', 'umm-e-hani@outlook.com', '2026-05-01'),
  ('sub-110', 'shahbaz.ahmed@live.com', '2026-05-03'),
  ('sub-111', 'iqra.malik@gmail.com', '2026-05-05'),
  ('sub-112', 'junaid.khan@yahoo.com', '2026-05-08'),
  ('sub-113', 'busra.naz@hotmail.com', '2026-05-10'),
  ('sub-114', 'tariq.mehmood@outlook.com', '2026-05-12'),
  ('sub-115', 'hajra.bibi@live.com', '2026-05-15'),
  ('sub-116', 'zafar.ali@gmail.com', '2026-05-18'),
  ('sub-117', 'kiran.sheikh@yahoo.com', '2026-05-20'),
  ('sub-118', 'rashid.khan@hotmail.com', '2026-05-22'),
  ('sub-119', 'sadia.akram@outlook.com', '2026-05-25'),
  ('sub-120', 'adnan.ahmed@live.com', '2026-05-28'),
  ('sub-121', 'sumaira.ali@gmail.com', '2026-06-01'),
  ('sub-122', 'naveed.khan@yahoo.com', '2026-06-03'),
  ('sub-123', 'kanwal.naz@hotmail.com', '2026-06-05'),
  ('sub-124', 'owais.raza@outlook.com', '2026-06-08'),
  ('sub-125', 'khizra.khan@live.com', '2026-06-10'),
  ('sub-126', 'mudassar.ali@gmail.com', '2026-06-12'),
  ('sub-127', 'tahira.siddiqui@yahoo.com', '2026-06-15'),
  ('sub-128', 'shoaib.khan@hotmail.com', '2026-06-18'),
  ('sub-129', 'anila.hassan@outlook.com', '2026-06-20'),
  ('sub-130', 'zahid.ahmed@live.com', '2026-06-22'),
  ('sub-131', 'sabrina.ali@gmail.com', '2026-06-25'),
  ('sub-132', 'khalid.khan@yahoo.com', '2026-06-28'),
  ('sub-133', 'rabail.naz@hotmail.com', '2026-07-01'),
  ('sub-134', 'shahzad.raza@outlook.com', '2026-07-03'),
  ('sub-135', 'fariha.shah@live.com', '2026-07-05'),
  ('sub-136', 'waqas.ahmed@gmail.com', '2026-07-08'),
  ('sub-137', 'sana.malik@yahoo.com', '2026-07-10'),
  ('sub-138', 'hasan.khan@hotmail.com', '2026-07-12'),
  ('sub-139', 'samia.bibi@outlook.com', '2026-07-15'),
  ('sub-140', 'rizwan.ali@live.com', '2026-07-18'),
  ('sub-141', 'noreen.akram@gmail.com', '2026-07-20'),
  ('sub-142', 'atif.khan@yahoo.com', '2026-07-22'),
  ('sub-143', 'zulekha.raza@hotmail.com', '2026-07-25'),
  ('sub-144', 'saleem.ahmed@outlook.com', '2026-07-28'),
  ('sub-145', 'fizza.hassan@live.com', '2026-08-01'),
  ('sub-146', 'shahrukh.khan@gmail.com', '2026-08-03'),
  ('sub-147', 'tayyaba.siddiqui@yahoo.com', '2026-08-05'),
  ('sub-148', 'taha.ali@hotmail.com', '2026-08-08'),
  ('sub-149', 'parveen.malik@outlook.com', '2026-08-10'),
  ('sub-150', 'aliya.khan@live.com', '2026-08-12'),
  ('sub-151', 'saif.khan@gmail.com', '2026-08-15'),
  ('sub-152', 'kaneez.fatima@yahoo.com', '2026-08-18'),
  ('sub-153', 'shahbaz.khan@hotmail.com', '2026-08-20'),
  ('sub-154', 'sara.ahmed@outlook.com', '2026-08-22'),
  ('sub-155', 'nadeem.hussain@live.com', '2026-08-25'),
  ('sub-156', 'rubina.khan@gmail.com', '2026-08-28'),
  ('sub-157', 'zaman.ali@yahoo.com', '2026-09-01'),
  ('sub-158', 'nasreen.akhtar@hotmail.com', '2026-09-03'),
  ('sub-159', 'akram.khan@outlook.com', '2026-09-05'),
  ('sub-160', 'farhat.jabeen@live.com', '2026-09-08'),
  ('sub-161', 'rashid.mehmood@gmail.com', '2026-09-10'),
  ('sub-162', 'nusrat.raza@yahoo.com', '2026-09-12'),
  ('sub-163', 'shafiq.ahmed@hotmail.com', '2026-09-15'),
  ('sub-164', 'mariya.khan@outlook.com', '2026-09-18'),
  ('sub-165', 'tufail.hussain@live.com', '2026-09-20'),
  ('sub-166', 'sadia.ali@gmail.com', '2026-09-22'),
  ('sub-167', 'wajid.khan@yahoo.com', '2026-09-25'),
  ('sub-168', 'zareen.siddiqui@hotmail.com', '2026-09-28'),
  ('sub-169', 'imtiaz.ahmed@outlook.com', '2026-10-01'),
  ('sub-170', 'naheed.parveen@live.com', '2026-10-03'),
  ('sub-171', 'shahid.mehmood@gmail.com', '2026-10-05'),
  ('sub-172', 'nargis.fatima@yahoo.com', '2026-10-08'),
  ('sub-173', 'irfan.butt@hotmail.com', '2026-10-10'),
  ('sub-174', 'tahira.akram@outlook.com', '2026-10-12'),
  ('sub-175', 'farhan.ali@live.com', '2026-10-15'),
  ('sub-176', 'saima.naz@gmail.com', '2026-10-18'),
  ('sub-177', 'waseem.khan@yahoo.com', '2026-10-20'),
  ('sub-178', 'kausar.siddiqui@hotmail.com', '2026-10-22'),
  ('sub-179', 'nazia.raza@outlook.com', '2026-10-25'),
  ('sub-180', 'iftikhar.ahmed@live.com', '2026-10-28'),
  ('sub-181', 'shazia.ali@gmail.com', '2026-11-01'),
  ('sub-182', 'khalid.khan@yahoo.com', '2026-11-03'),
  ('sub-183', 'nasreen.jabeen@hotmail.com', '2026-11-05'),
  ('sub-184', 'shahzad.raza@outlook.com', '2026-11-08'),
  ('sub-185', 'sakeena.bibi@live.com', '2026-11-10'),
  ('sub-186', 'aman.ali@gmail.com', '2026-11-12'),
  ('sub-187', 'zainab.khan@yahoo.com', '2026-11-15'),
  ('sub-188', 'gulshan.parveen@hotmail.com', '2026-11-18'),
  ('sub-189', 'shabbir.ahmed@outlook.com', '2026-11-20'),
  ('sub-190', 'rukhsana.khan@live.com', '2026-11-22'),
  ('sub-191', 'javed.ali@gmail.com', '2026-11-25'),
  ('sub-192', 'nabila.siddiqui@yahoo.com', '2026-11-28'),
  ('sub-193', 'tanveer.ahmed@hotmail.com', '2026-12-01'),
  ('sub-194', 'azra.begum@outlook.com', '2026-12-03'),
  ('sub-195', 'shahjahan.khan@live.com', '2026-12-05'),
  ('sub-196', 'mahnoor.ali@gmail.com', '2026-12-08'),
  ('sub-197', 'shabnam.naz@yahoo.com', '2026-12-10'),
  ('sub-198', 'zafar.khan@hotmail.com', '2026-12-12'),
  ('sub-199', 'anisa.siddiqui@outlook.com', '2026-12-15'),
  ('sub-200', 'ghulam.hussain@live.com', '2026-12-18');

-- ============================================================================
-- 16. STOCK & PRICE ALERTS — 20 each
-- ============================================================================
INSERT OR IGNORE INTO stock_alerts (id, variant_id, email, created_at) VALUES
  ('sa-001', 'var-dri-fit-tee-1', 'ali.hassan@gmail.com', '2025-11-01'),
  ('sa-002', 'var-compression-tank-2', 'fatima.ahmed@yahoo.com', '2025-11-03'),
  ('sa-003', 'var-joggers-3', 'muhammad.khan@hotmail.com', '2025-11-05'),
  ('sa-004', 'var-stringer-1', 'hassan.raza@outlook.com', '2025-11-08'),
  ('sa-005', 'var-hoodie-4', 'sana.iqbal@live.com', '2025-11-10'),
  ('sa-006', 'var-shorts-2', 'bilal.ahmed@gmail.com', '2025-11-15'),
  ('sa-007', 'var-w-leggings-m', 'hira.khan@yahoo.com', '2025-11-18'),
  ('sa-008', 'var-w-bra-l', 'omar.sheikh@hotmail.com', '2025-11-20'),
  ('sa-009', 'var-w-tank-s', 'mahnoor.tariq@gmail.com', '2025-11-22'),
  ('sa-010', 'var-w-hoodie-xl', 'zain.abbas@outlook.com', '2025-11-25'),
  ('sa-011', 'var-lifting-straps-os', 'amna.riaz@live.com', '2025-12-01'),
  ('sa-012', 'var-knee-sleeves-m', 'haroon.malik@gmail.com', '2025-12-03'),
  ('sa-013', 'var-gym-bag-os', 'zara.hashmi@yahoo.com', '2025-12-05'),
  ('sa-014', 'var-water-bottle-os', 'usman.gondal@hotmail.com', '2025-12-08'),
  ('sa-015', 'var-jump-rope-os', 'mariam.shah@outlook.com', '2025-12-10'),
  ('sa-016', 'var-gym-gloves-s', 'fahad.khan@gmail.com', '2025-12-12'),
  ('sa-017', 'var-racerback-2', 'saima.butt@live.com', '2025-12-15'),
  ('sa-018', 'var-zip-hoodie-3', 'taha.rana@yahoo.com', '2025-12-18'),
  ('sa-019', 'var-w-racerback-m', 'rabia.anwar@gmail.com', '2025-12-20'),
  ('sa-020', 'var-w-capris-l', 'saad.naeem@hotmail.com', '2025-12-22');

INSERT OR IGNORE INTO price_alerts (id, product_id, email, target_price, created_at) VALUES
  ('pa-001', 'gymflex-dri-fit-tee', 'ali.hassan@gmail.com', 1200, '2025-10-01'),
  ('pa-002', 'gymflex-compression-tank', 'fatima.ahmed@yahoo.com', 1300, '2025-10-03'),
  ('pa-003', 'gymflex-joggers', 'muhammad.khan@hotmail.com', 2200, '2025-10-05'),
  ('pa-004', 'gymflex-stringer', 'hassan.raza@outlook.com', 900, '2025-10-08'),
  ('pa-005', 'gymflex-hoodie', 'sana.iqbal@live.com', 2000, '2025-10-10'),
  ('pa-006', 'gymflex-shorts', 'bilal.ahmed@gmail.com', 1400, '2025-10-15'),
  ('pa-007', 'gymflex-women-leggings', 'hira.khan@yahoo.com', 1800, '2025-10-18'),
  ('pa-008', 'gymflex-women-sports-bra', 'omar.sheikh@hotmail.com', 1500, '2025-10-20'),
  ('pa-009', 'gymflex-women-tank', 'mahnoor.tariq@gmail.com', 800, '2025-10-22'),
  ('pa-010', 'gymflex-gym-bag', 'zain.abbas@outlook.com', 2500, '2025-10-25'),
  ('pa-011', 'gymflex-water-bottle', 'amna.riaz@live.com', 1000, '2025-11-01'),
  ('pa-012', 'gymflex-lifting-straps', 'haroon.malik@gmail.com', 700, '2025-11-03'),
  ('pa-013', 'gymflex-knee-sleeves', 'zara.hashmi@yahoo.com', 1200, '2025-11-05'),
  ('pa-014', 'gymflex-women-joggers', 'usman.gondal@hotmail.com', 2000, '2025-11-08'),
  ('pa-015', 'gymflex-racerback', 'mariam.shah@outlook.com', 1000, '2025-11-10'),
  ('pa-016', 'gymflex-women-hoodie', 'fahad.khan@gmail.com', 2000, '2025-11-12'),
  ('pa-017', 'gymflex-zip-hoodie', 'saima.butt@live.com', 2500, '2025-11-15'),
  ('pa-018', 'gymflex-women-thermal', 'taha.rana@yahoo.com', 1500, '2025-11-18'),
  ('pa-019', 'gymflex-resistance-bands', 'rabia.anwar@gmail.com', 1500, '2025-11-20'),
  ('pa-020', 'gymflex-cargo-joggers', 'saad.naeem@hotmail.com', 2300, '2025-11-22');

-- ============================================================================
-- 17. LOOK PRODUCTS — "Complete the Look" pairings
-- ============================================================================
INSERT OR IGNORE INTO look_products (id, product_id, linked_product_id, sort_order) VALUES
  ('look-001', 'gymflex-dri-fit-tee', 'gymflex-joggers', 0),
  ('look-002', 'gymflex-dri-fit-tee', 'gymflex-shorts', 1),
  ('look-003', 'gymflex-compression-tank', 'gymflex-shorts', 0),
  ('look-004', 'gymflex-compression-tank', 'gymflex-joggers', 1),
  ('look-005', 'gymflex-joggers', 'gymflex-dri-fit-tee', 0),
  ('look-006', 'gymflex-joggers', 'gymflex-hoodie', 1),
  ('look-007', 'gymflex-hoodie', 'gymflex-joggers', 0),
  ('look-008', 'gymflex-hoodie', 'gymflex-cargo-joggers', 1),
  ('look-009', 'gymflex-women-leggings', 'gymflex-women-tank', 0),
  ('look-010', 'gymflex-women-leggings', 'gymflex-women-sports-bra', 1),
  ('look-011', 'gymflex-women-tank', 'gymflex-women-leggings', 0),
  ('look-012', 'gymflex-women-joggers', 'gymflex-women-racerback', 0),
  ('look-013', 'gymflex-women-hoodie', 'gymflex-women-leggings', 0),
  ('look-014', 'gymflex-women-sports-bra', 'gymflex-women-shorts', 0);

-- ============================================================================
-- 18. SITE SETTINGS — Update with realistic config
-- ============================================================================
INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (
  'homepage',
  '{
    "heroButtonText": "Shop GymFlex",
    "heroButtonLink": "/shop",
    "featuredProductId": "gymflex-dri-fit-tee",
    "featuredEyebrow": "New Arrivals",
    "featuredTitle": "Featured Products",
    "collectionKicker": "Premium Gym Wear",
    "recentTitle": "Recently Viewed",
    "headerCollectionSlugs": ["mens", "womens", "accessories"],
    "heroBanner": {
      "animation": "fade",
      "animationDuration": 100,
      "slideDuration": 5000,
      "desktopImages": ["", "", ""],
      "mobileImages": ["", "", ""]
    },
    "shippingFee": 250,
    "freeShippingMinimum": 1000,
    "taxRate": 0
  }',
  CURRENT_TIMESTAMP
);

-- ============================================================================
-- DONE — Verification query at the bottom
-- ============================================================================
-- Run this to verify counts:
-- SELECT 'categories', COUNT(*) FROM categories
-- UNION ALL SELECT 'products', COUNT(*) FROM products
-- UNION ALL SELECT 'variants', COUNT(*) FROM product_variants
-- UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
-- UNION ALL SELECT 'orders', COUNT(*) FROM orders
-- UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
-- UNION ALL SELECT 'faq_items', COUNT(*) FROM faq_items
-- UNION ALL SELECT 'community_photos', COUNT(*) FROM community_photos
-- UNION ALL SELECT 'discount_codes', COUNT(*) FROM discount_codes
-- UNION ALL SELECT 'bundles', COUNT(*) FROM bundles
-- UNION ALL SELECT 'bundle_items', COUNT(*) FROM bundle_items
-- UNION ALL SELECT 'tiered_pricing', COUNT(*) FROM tiered_pricing
-- UNION ALL SELECT 'shipping_rates', COUNT(*) FROM shipping_rates
-- UNION ALL SELECT 'gift_cards', COUNT(*) FROM gift_cards
-- UNION ALL SELECT 'subscribers', COUNT(*) FROM newsletter_subscribers
-- UNION ALL SELECT 'stock_alerts', COUNT(*) FROM stock_alerts
-- UNION ALL SELECT 'price_alerts', COUNT(*) FROM price_alerts
-- UNION ALL SELECT 'look_products', COUNT(*) FROM look_products;
