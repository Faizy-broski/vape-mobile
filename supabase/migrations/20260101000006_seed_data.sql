-- Sample data matching what was previously hardcoded in the app, so the
-- site renders the same content once it's reading from Supabase.

-- ---------------------------------------------------------------------
-- Repair catalog
-- ---------------------------------------------------------------------

insert into public.repair_devices (slug, name, image, sort_order) values
  ('phone', 'Phone', '/tech/repairs/phone.png', 1),
  ('tablet', 'Tablet', '/tech/repairs/tablet.png', 2),
  ('laptop', 'Laptop', '/tech/repairs/laptop.png', 3),
  ('pc-desktop', 'PC Desktop', '/tech/repairs/pc.png', 4),
  ('data-recovery', 'Data Recovery', '/tech/repairs/data-recovery.png', 5),
  ('drone', 'Drone', '/tech/repairs/drone.png', 6),
  ('game-console', 'Game Console', '/tech/repairs/gaming-console.png', 7),
  ('other', 'Other Devices', '/tech/repairs/other-device.png', 8)
on conflict (slug) do nothing;

insert into public.repair_device_brands (device_id, name, sort_order)
select d.id, b.name, b.sort_order
from public.repair_devices d
join (values
  ('phone', 'Apple', 1), ('phone', 'Samsung', 2), ('phone', 'Google', 3),
  ('phone', 'Huawei', 4), ('phone', 'OnePlus', 5), ('phone', 'Other', 6),

  ('tablet', 'Apple', 1), ('tablet', 'Samsung', 2), ('tablet', 'Microsoft', 3),
  ('tablet', 'Amazon', 4), ('tablet', 'Other', 5),

  ('laptop', 'Apple', 1), ('laptop', 'Dell', 2), ('laptop', 'HP', 3),
  ('laptop', 'Lenovo', 4), ('laptop', 'Asus', 5), ('laptop', 'Other', 6),

  ('pc-desktop', 'Custom Build', 1), ('pc-desktop', 'Dell', 2),
  ('pc-desktop', 'HP', 3), ('pc-desktop', 'Alienware', 4), ('pc-desktop', 'Other', 5),

  ('data-recovery', 'Hard Drive', 1), ('data-recovery', 'SSD', 2),
  ('data-recovery', 'USB / Flash Drive', 3), ('data-recovery', 'Other', 4),

  ('drone', 'DJI', 1), ('drone', 'Parrot', 2), ('drone', 'Autel', 3), ('drone', 'Other', 4),

  ('game-console', 'PlayStation', 1), ('game-console', 'Xbox', 2),
  ('game-console', 'Nintendo Switch', 3), ('game-console', 'Other', 4),

  ('other', 'Not Listed', 1)
) as b(device_slug, name, sort_order) on b.device_slug = d.slug
on conflict (device_id, name) do nothing;

insert into public.repair_issues (name, sort_order) values
  ('Screen Damage', 1),
  ('Battery', 2),
  ('Charging Port', 3),
  ('Camera', 4),
  ('Water Damage', 5),
  ('Software / Data', 6),
  ('Other', 7)
on conflict (name) do nothing;

insert into public.repair_stores (name, sort_order) values
  ('Nearest available', 1),
  ('High Street', 2)
on conflict (name) do nothing;

-- ---------------------------------------------------------------------
-- Vape shop catalog
-- ---------------------------------------------------------------------

insert into public.shop_categories (slug, name, image, sort_order) values
  ('vape-kits', 'Vape Kits', '/vape/vapes/1.png', 1),
  ('600-puff-kits-pods', '600 Puff Kits & Pods', '/vape/vapes/2.png', 2),
  ('big-puff-kits-pods', 'Big Puff Kits & Pods', '/vape/vapes/3.png', 3),
  ('vape-juice', 'Vape Juice', '/vape/vapes/4.png', 4),
  ('nic-salts', 'Nic Salts', '/vape/vapes/5.png', 5),
  ('50ml-shortfill', '50ml Shortfill', '/vape/vapes/6.png', 6),
  ('100ml-shortfill', '100ml Shortfill', '/vape/vapes/7.png', 7),
  ('coils', 'Coils', '/vape/vapes/8.png', 8),
  ('spare-pods', 'Spare Pods', '/vape/vapes/9.png', 9),
  ('nicotine-pouches', 'Nicotine Pouches', '/vape/vapes/10.png', 10)
on conflict (slug) do nothing;

insert into public.shop_brands (name, image, sort_order) values
  ('Vampire Vape', '/vape/categories/vampire-vape.png', 1),
  ('Ohm Brew', '/vape/categories/ohm-brew.png', 2),
  ('Lost Mary', '/vape/categories/lost-mary.png', 3),
  ('Zeus Juice', '/vape/categories/zeus-juice.png', 4),
  ('SKE', '/vape/categories/ske.png', 5),
  ('Yeti', '/vape/categories/yeti.png', 6)
on conflict (name) do nothing;

insert into public.product_sections (slug, title, href, sort_order) values
  ('starter-kits', 'Starter Kits', '/vape-shop/category/starter-kits', 1),
  ('big-puff-kits-pods', 'Big Puff Kits & Pods', '/vape-shop/category/big-puff-kits-pods', 2),
  ('e-liquids', 'E-Liquids', '/vape-shop/category/e-liquids', 3),
  ('best-sellers', 'Best Sellers', '/vape-shop/category/best-sellers', 4)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------

insert into public.products
  (section_id, name, price, old_price, badge, image, stock, sort_order)
select s.id, p.name, p.price, p.old_price, p.badge, p.image, 25, p.sort_order
from public.product_sections s
join (values
  ('starter-kits', 'Lost Mary BM6000', 14.99, null::numeric, null::text, '/vape/carousel/starter-kits-1.png', 1),
  ('starter-kits', 'IVG Pro 10K Kit', 16.99, null, null, '/vape/carousel/starter-kits-2.png', 2),
  ('starter-kits', 'Double Brew Bundle', 12.99, 17.99, 'Sale', '/vape/carousel/starter-kits-3.png', 3),
  ('starter-kits', 'Riot Squad Pro Max+', 13.99, null, 'New', '/vape/carousel/starter-kits-4.png', 4),

  ('big-puff-kits-pods', 'Vape Kit Pro', 14.99, null, null, '/vape/vapes/1.png', 1),
  ('big-puff-kits-pods', 'Puff Bar Edition', 12.99, 16.99, 'Sale', '/vape/vapes/2.png', 2),
  ('big-puff-kits-pods', 'Big Puff Max Kit', 13.99, 17.99, 'Sale', '/vape/vapes/3.png', 3),
  ('big-puff-kits-pods', 'Crystal Pod Refill', 9.99, null, null, '/vape/vapes/9.png', 4),

  ('e-liquids', 'Mixed Berries Shortfill', 9.99, null, null, '/vape/vapes/4.png', 1),
  ('e-liquids', 'Nic Salt Twist Pack', 4.99, null, null, '/vape/vapes/5.png', 2),
  ('e-liquids', 'Classic Tobacco 10ml', 3.99, 5.99, 'Sale', '/vape/vapes/6.png', 3),
  ('e-liquids', 'Tropical Fruit Burst', 9.99, null, 'New', '/vape/vapes/7.png', 4),

  ('best-sellers', 'Aspire Pod Kit', 14.99, null, null, '/vape/carousel/vape-1.png', 1),
  ('best-sellers', 'Voopoo Pod Kit', 13.99, 17.99, 'Sale', '/vape/carousel/vape-2.png', 2),
  ('best-sellers', 'OXVA Origin Kit', 15.99, null, null, '/vape/carousel/vape-3.png', 3),
  ('best-sellers', 'Caliburn G3 Kit', 16.99, null, 'New', '/vape/carousel/vape-4.png', 4)
) as p(section_slug, name, price, old_price, badge, image, sort_order) on p.section_slug = s.slug;
