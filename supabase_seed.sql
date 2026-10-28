-- =========================================================================
-- Smart Neighborhood Resource Sharing & Allocation System (SNRSAS)
-- Database Seed Data Script for Supabase PostgreSQL
-- Run this in your Supabase SQL Editor to populate sample neighborhood data
-- =========================================================================

-- 1. SEED PROFILES & USERS
-- Insert auth users so foreign key references work seamlessly
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sarah@maplewood.org', crypt('password123', gen_salt('bf')), NOW(), '{"full_name": "Sarah Jenkins", "locality": "Maplewood Heights", "role": "user"}', NOW(), NOW()),
  ('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'david@maplewood.org', crypt('password123', gen_salt('bf')), NOW(), '{"full_name": "David Chen", "locality": "Maplewood Heights", "role": "user"}', NOW(), NOW()),
  ('a3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maria@oakridge.org', crypt('password123', gen_salt('bf')), NOW(), '{"full_name": "Maria Rodriguez", "locality": "Oakridge Park", "role": "user"}', NOW(), NOW()),
  ('a4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@neighborly.org', crypt('password123', gen_salt('bf')), NOW(), '{"full_name": "Alex Rivera (Admin)", "locality": "Maplewood Heights", "role": "admin"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert/Update Profiles
INSERT INTO public.profiles (id, full_name, email, locality, phone, avatar_url, role)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Sarah Jenkins', 'sarah@maplewood.org', 'Maplewood Heights', '(555) 234-5678', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'user'),
  ('a2222222-2222-2222-2222-222222222222', 'David Chen', 'david@maplewood.org', 'Maplewood Heights', '(555) 345-6789', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'user'),
  ('a3333333-3333-3333-3333-333333333333', 'Maria Rodriguez', 'maria@oakridge.org', 'Oakridge Park', '(555) 456-7890', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'user'),
  ('a4444444-4444-4444-4444-444444444444', 'Alex Rivera (Admin)', 'admin@neighborly.org', 'Maplewood Heights', '(555) 999-0000', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'admin')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  locality = EXCLUDED.locality,
  role = EXCLUDED.role;

-- 2. SEED RESOURCES
INSERT INTO public.resources (id, owner_id, title, category, description, condition, locality, image_url, available_from, available_to, guidelines, status)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'DeWalt 20V Max Cordless Drill & Impact Driver Kit', 'Tools', 'High-performance brushless drill kit including 2 lithium-ion batteries, charger, and standard masonry/wood drill bit set. Perfect for home repairs.', 'Like New', 'Maplewood Heights', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Recharge batteries before returning.', 'available'),
  ('b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'Werner 16ft Aluminum Extension Ladder', 'Tools', 'Sturdy type II rated aluminum extension ladder with non-marring end caps and slip-resistant rungs.', 'Good', 'Maplewood Heights', 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', 'Requires roof rack or truck for pickup.', 'available'),
  ('b3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'Epson 1080p Home Cinema Movie Projector', 'Electronics', 'Crisp Full HD projector with 3,000 lumens brightness, HDMI inputs, and built-in speakers. Great for backyard movie nights.', 'Like New', 'Maplewood Heights', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Handle lens with care. Includes 15ft HDMI cord.', 'available'),
  ('b4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222', 'Honda 21-inch Self-Propelled Gas Lawn Mower', 'Gardening', 'Twin-blade self-propelled mower with easy starting engine and mulch/bag capability. Runs smoothly.', 'Good', 'Maplewood Heights', 'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'Regular unleaded 87 octane only. Clean deck before drop-off.', 'available'),
  ('b5555555-5555-5555-5555-555555555555', 'a3333333-3333-3333-3333-333333333333', 'Complete Harry Potter Special 7-Book Hardcover Set', 'Books', 'Collector edition hardcovers in pristine condition. Great for family reading or binge-reading weekends.', 'New', 'Oakridge Park', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Keep away from moisture and liquids.', 'available'),
  ('b6666666-6666-6666-6666-666666666666', 'a3333333-3333-3333-3333-333333333333', 'Karcher K5 2000-PSI Electric Pressure Washer', 'Household Items', 'Electric pressure washer with dirt blaster wand. Fantastic for driveways, patios, and outdoor furniture.', 'Like New', 'Oakridge Park', 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', 'Garden hose connection required.', 'borrowed'),
  ('b7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111', 'Coleman 6-Person Weatherproof Dome Camping Tent', 'Household Items', 'Spacious 10x10 ft dome tent with WeatherTec system to withstand 35+ mph winds.', 'Good', 'Maplewood Heights', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Ensure tent is clean and completely dry before repacking.', 'available'),
  ('b8888888-8888-8888-8888-888888888888', 'a2222222-2222-2222-2222-222222222222', 'Sony Alpha A6400 4K Mirrorless Digital Camera Kit', 'Electronics', 'Equipped with 16-50mm power zoom lens, fast autofocus, 64GB high speed SD card, and 2 batteries.', 'Like New', 'Maplewood Heights', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Use neck strap at all times.', 'available')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED BORROW REQUESTS
INSERT INTO public.borrow_requests (id, resource_id, borrower_id, start_date, end_date, message, status)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '4 days', 'Hi Sarah, need to clean my rain gutters before the weekend storms!', 'pending'),
  ('c2222222-2222-2222-2222-222222222222', 'b3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days', 'Hi David! Our neighborhood book club is hosting an outdoor documentary showing.', 'pending')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED RESERVATIONS (One Active, Two Completed)
INSERT INTO public.reservations (id, request_id, resource_id, borrower_id, owner_id, start_date, end_date, actual_return_date, status, notes)
VALUES
  ('d1111111-1111-1111-1111-111111111111', NULL, 'b6666666-6666-6666-6666-666666666666', 'a2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '3 days', NULL, 'active', 'David picked up washer on Wednesday with hose adapter.'),
  ('d2222222-2222-2222-2222-222222222222', NULL, 'b8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '7 days', 'returned', 'Returned on schedule in great shape.'),
  ('d3333333-3333-3333-3333-333333333333', NULL, 'b1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '17 days', CURRENT_DATE - INTERVAL '17 days', 'returned', 'Completed smoothly.')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED RATINGS
INSERT INTO public.ratings (id, reservation_id, resource_id, reviewer_id, reviewee_id, score, comment)
VALUES
  ('e1111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'b8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 5, 'The Sony camera was immaculate and captured incredible photos at our family graduation!'),
  ('e2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 5, 'Sarah is an amazing neighbor! The drill made putting up our heavy bookshelf a breeze.')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED REPORTS
INSERT INTO public.reports (id, reporter_id, resource_id, reported_user_id, reason, description, status, admin_notes)
VALUES
  ('f1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Misleading Description', 'Minor concern: previous drill bit was slightly duller than listed, suggested adding a sharpening disclaimer.', 'open', 'Reviewed by admin. Advised owner to note bit condition.')
ON CONFLICT (id) DO NOTHING;
