PRAGMA foreign_keys = OFF;

-- Categories already inserted above

-- Products (Womens + Accessories)
INSERT OR IGNORE INTO products (id, category_id, name, slug, description, price, sale_price, on_sale, is_active, is_featured, sort_order, meta_title, meta_description) VALUES
('gymflex-women-leggings', 'womens', 'High-Waist Training Leggings', 'high-waist-training-leggings', 'Buttery-soft high-waist leggings with squat-proof fabric.', 2499, 1999, 1, 1, 1, 0, 'High-Waist Training Leggings | GymFlex', 'Squat-proof high-waist leggings'),
('gymflex-women-sports-bra', 'womens', 'Medium Support Sports Bra', 'medium-support-sports-bra', 'Padded sports bra with medium support.', 1799, NULL, 0, 1, 1, 1, 'Medium Support Sports Bra | GymFlex', 'Breathable padded sports bra'),
('gymflex-women-tank', 'womens', 'Cropped Gym Tank', 'cropped-gym-tank', 'Sleek cropped tank for confident training.', 1299, 999, 1, 1, 1, 2, 'Cropped Gym Tank | GymFlex', 'Confident cropped tank'),
('gymflex-women-joggers', 'womens', 'Slim-Fit Women''s Joggers', 'slim-fit-womens-joggers', 'Tapered joggers with flattering slim fit.', 2199, NULL, 0, 1, 0, 3, 'Slim-Fit Women''s Joggers | GymFlex', 'Tapered joggers'),
('gymflex-women-shorts', 'womens', 'Biker Training Shorts', 'biker-training-shorts', '4-inch biker shorts with compression waistband.', 1599, NULL, 0, 1, 0, 4, 'Biker Training Shorts | GymFlex', '4-inch biker shorts'),
('gymflex-women-hoodie', 'womens', 'Oversized Women''s Hoodie', 'oversized-womens-hoodie', 'Cozy oversized hoodie for layering.', 2799, 2299, 1, 1, 1, 5, 'Oversized Women''s Hoodie | GymFlex', 'Cozy oversized hoodie'),
('gymflex-women-racerback', 'womens', 'Racerback Training Top', 'racerback-training-top', 'Lightweight racerback top for maximum mobility.', 1399, NULL, 0, 1, 0, 6, 'Racerback Training Top | GymFlex', 'Lightweight racerback top'),
('gymflex-women-thermal', 'womens', 'Women''s Thermal Tee', 'womens-thermal-tee', 'Brushed thermal tee for cold-weather training.', 1799, NULL, 0, 1, 0, 7, 'Women''s Thermal Tee | GymFlex', 'Brushed thermal tee'),
('gymflex-women-capris', 'womens', 'Capri Training Leggings', 'capri-training-leggings', 'Cropped capri leggings for warmer sessions.', 2199, NULL, 0, 1, 0, 8, 'Capri Training Leggings | GymFlex', 'Cropped capri leggings'),
('gymflex-women-sleeveless', 'womens', 'Sleeveless Gym Top', 'sleeveless-gym-top', 'Flowy sleeveless top with keyhole back.', 1199, NULL, 0, 1, 0, 9, 'Sleeveless Gym Top | GymFlex', 'Flowy sleeveless top'),
('gymflex-lifting-straps', 'accessories', 'Premium Lifting Straps', 'premium-lifting-straps', 'Heavy-duty cotton lifting straps.', 899, NULL, 0, 1, 1, 0, 'Premium Lifting Straps | GymFlex', 'Heavy-duty cotton lifting straps'),
('gymflex-knee-sleeves', 'accessories', 'Neoprene Knee Sleeves', 'neoprene-knee-sleeves', '7mm neoprene knee sleeves for squat support.', 1499, NULL, 0, 1, 0, 1, 'Neoprene Knee Sleeves | GymFlex', '7mm neoprene knee sleeves'),
('gymflex-gym-bag', 'accessories', 'Duffel Gym Bag', 'duffel-gym-bag', '40L waterproof duffel with wet-dry separation.', 3499, 2999, 1, 1, 1, 2, 'Duffel Gym Bag | GymFlex', '40L waterproof duffel'),
('gymflex-water-bottle', 'accessories', 'Insulated Water Bottle', 'insulated-water-bottle', '750ml stainless steel bottle.', 1199, NULL, 0, 1, 0, 3, 'Insulated Water Bottle | GymFlex', '750ml stainless steel bottle'),
('gymflex-jump-rope', 'accessories', 'Speed Jump Rope', 'speed-jump-rope', 'Ball-bearing speed rope with adjustable cable.', 699, NULL, 0, 1, 0, 4, 'Speed Jump Rope | GymFlex', 'Ball-bearing speed rope'),
('gymflex-resistance-bands', 'accessories', 'Resistance Band Set', 'resistance-band-set', 'Set of 5 latex resistance bands.', 1999, NULL, 0, 1, 0, 5, 'Resistance Band Set | GymFlex', 'Set of 5 latex bands'),
('gymflex-foam-roller', 'accessories', 'High-Density Foam Roller', 'high-density-foam-roller', '33cm foam roller for muscle recovery.', 1499, NULL, 0, 1, 0, 6, 'High-Density Foam Roller | GymFlex', '33cm foam roller'),
('gymflex-gym-gloves', 'accessories', 'Ventilated Gym Gloves', 'ventilated-gym-gloves', 'Breathable gym gloves with silicone grip.', 999, NULL, 0, 1, 0, 7, 'Ventilated Gym Gloves | GymFlex', 'Breathable gym gloves');

-- Product Variants (Womens sizes)
INSERT OR IGNORE INTO product_variants (id, product_id, type, name, sort_order, image_url) VALUES
('var-w-leggings-xs', 'gymflex-women-leggings', 'Size', 'XS', 0, ''),
('var-w-leggings-s', 'gymflex-women-leggings', 'Size', 'S', 1, ''),
('var-w-leggings-m', 'gymflex-women-leggings', 'Size', 'M', 2, ''),
('var-w-leggings-l', 'gymflex-women-leggings', 'Size', 'L', 3, ''),
('var-w-leggings-xl', 'gymflex-women-leggings', 'Size', 'XL', 4, ''),
('var-w-bra-s', 'gymflex-women-sports-bra', 'Size', 'S', 0, ''),
('var-w-bra-m', 'gymflex-women-sports-bra', 'Size', 'M', 1, ''),
('var-w-bra-l', 'gymflex-women-sports-bra', 'Size', 'L', 2, ''),
('var-w-bra-xl', 'gymflex-women-sports-bra', 'Size', 'XL', 3, ''),
('var-w-tank-s', 'gymflex-women-tank', 'Size', 'S', 0, ''),
('var-w-tank-m', 'gymflex-women-tank', 'Size', 'M', 1, ''),
('var-w-tank-l', 'gymflex-women-tank', 'Size', 'L', 2, ''),
('var-w-tank-xl', 'gymflex-women-tank', 'Size', 'XL', 3, ''),
('var-w-joggers-xs', 'gymflex-women-joggers', 'Size', 'XS', 0, ''),
('var-w-joggers-s', 'gymflex-women-joggers', 'Size', 'S', 1, ''),
('var-w-joggers-m', 'gymflex-women-joggers', 'Size', 'M', 2, ''),
('var-w-joggers-l', 'gymflex-women-joggers', 'Size', 'L', 3, ''),
('var-w-joggers-xl', 'gymflex-women-joggers', 'Size', 'XL', 4, ''),
('var-w-shorts-xs', 'gymflex-women-shorts', 'Size', 'XS', 0, ''),
('var-w-shorts-s', 'gymflex-women-shorts', 'Size', 'S', 1, ''),
('var-w-shorts-m', 'gymflex-women-shorts', 'Size', 'M', 2, ''),
('var-w-shorts-l', 'gymflex-women-shorts', 'Size', 'L', 3, ''),
('var-w-shorts-xl', 'gymflex-women-shorts', 'Size', 'XL', 4, ''),
('var-w-hoodie-s', 'gymflex-women-hoodie', 'Size', 'S', 0, ''),
('var-w-hoodie-m', 'gymflex-women-hoodie', 'Size', 'M', 1, ''),
('var-w-hoodie-l', 'gymflex-women-hoodie', 'Size', 'L', 2, ''),
('var-w-hoodie-xl', 'gymflex-women-hoodie', 'Size', 'XL', 3, ''),
('var-w-racerback-xs', 'gymflex-women-racerback', 'Size', 'XS', 0, ''),
('var-w-racerback-s', 'gymflex-women-racerback', 'Size', 'S', 1, ''),
('var-w-racerback-m', 'gymflex-women-racerback', 'Size', 'M', 2, ''),
('var-w-racerback-l', 'gymflex-women-racerback', 'Size', 'L', 3, ''),
('var-w-thermal-s', 'gymflex-women-thermal', 'Size', 'S', 0, ''),
('var-w-thermal-m', 'gymflex-women-thermal', 'Size', 'M', 1, ''),
('var-w-thermal-l', 'gymflex-women-thermal', 'Size', 'L', 2, ''),
('var-w-thermal-xl', 'gymflex-women-thermal', 'Size', 'XL', 3, ''),
('var-w-capris-xs', 'gymflex-women-capris', 'Size', 'XS', 0, ''),
('var-w-capris-s', 'gymflex-women-capris', 'Size', 'S', 1, ''),
('var-w-capris-m', 'gymflex-women-capris', 'Size', 'M', 2, ''),
('var-w-capris-l', 'gymflex-women-capris', 'Size', 'L', 3, ''),
('var-w-capris-xl', 'gymflex-women-capris', 'Size', 'XL', 4, ''),
('var-w-sleeveless-xs', 'gymflex-women-sleeveless', 'Size', 'XS', 0, ''),
('var-w-sleeveless-s', 'gymflex-women-sleeveless', 'Size', 'S', 1, ''),
('var-w-sleeveless-m', 'gymflex-women-sleeveless', 'Size', 'M', 2, ''),
('var-w-sleeveless-l', 'gymflex-women-sleeveless', 'Size', 'L', 3, ''),
('var-w-sleeveless-xl', 'gymflex-women-sleeveless', 'Size', 'XL', 4, ''),
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

-- Stock for existing Men's variants
UPDATE product_variants SET stock = ABS(RANDOM() % 46) + 5 WHERE stock IS NULL OR stock = 0;

-- A few zero stock to demo out-of-stock
UPDATE product_variants SET stock = 0 WHERE id IN (
  'var-dri-fit-tee-1', 'var-shorts-2', 'var-w-hoodie-xl', 'var-gym-gloves-s'
);

PRAGMA foreign_keys = ON;
