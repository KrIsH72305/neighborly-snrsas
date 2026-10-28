-- =========================================================================
-- Smart Neighborhood Resource Sharing & Allocation System (SNRSAS)
-- Database Seed Data Script for Supabase PostgreSQL (Basic Daily Items)
-- =========================================================================

-- 1. SEED PROFILES & USERS
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

-- 2. SEED BASIC EVERYDAY RESOURCES
INSERT INTO public.resources (id, owner_id, title, category, description, condition, locality, image_url, available_from, available_to, guidelines, status)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '45-Piece Home Repair Tool Box with Claw Hammer & Screwdrivers', 'Tools', 'Basic essential home repair kit containing a solid claw hammer, adjustable wrench, pliers, utility knife, multi-bit screwdrivers, and a tape measure.', 'Like New', 'Maplewood Heights', 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Return all bits into their molded organizer slots.', 'available'),
  ('b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', '4-Step Folding Aluminum Step Ladder with Anti-Slip Pedals', 'Tools', 'Lightweight folding 4-step aluminum ladder with non-slip wide steps and safety hand grip. Great for changing ceiling lightbulbs or dusting fans.', 'Good', 'Maplewood Heights', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', 'Folds flat easily; fits into any car trunk or backseat.', 'available'),
  ('b3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'Steam Clothes Iron with Padded Folding Ironing Board', 'Household Items', 'Non-stick ceramic soleplate steam iron with adjustable temperature settings, paired with an adjustable folding ironing board.', 'Like New', 'Maplewood Heights', 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Empty remaining water from tank before packing up.', 'available'),
  ('b4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222', '50-Foot Flexible Garden Water Hose with 8-Spray Pattern Nozzle', 'Gardening', 'Durable, lightweight expandable garden hose with brass connectors and an 8-mode spray nozzle. Great for porch and balcony cleaning.', 'Good', 'Maplewood Heights', 'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'Drain remaining water and coil loosely after use.', 'available'),
  ('b5555555-5555-5555-5555-555555555555', 'a3333333-3333-3333-3333-333333333333', 'Engineering Mathematics & Reference Books with Scientific Calculator', 'Books', 'Higher Engineering Mathematics and Physics reference book set, along with a Casio FX-991EX scientific calculator. Perfect for semester exams.', 'Like New', 'Oakridge Park', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Please keep books dry and do not write or highlight on pages.', 'available'),
  ('b6666666-6666-6666-6666-666666666666', 'a3333333-3333-3333-3333-333333333333', 'Compact Wet & Dry Canister Vacuum Cleaner', 'Household Items', 'High-suction 1200W compact vacuum cleaner with dust bag, sofa upholstery nozzle, and crevice tool. Excellent for deep room cleaning.', 'Like New', 'Oakridge Park', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', 'Empty dust canister after vacuuming.', 'borrowed'),
  ('b7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111', '4-Foot White Plastic Folding Table with 4 Sturdy Chairs', 'Household Items', 'Portable heavy-duty plastic folding table with 4 stackable chairs. Perfect for hosting extra guests, festival dinners, or temporary study.', 'Good', 'Maplewood Heights', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Wipe tabletop clean with a damp cloth before returning.', 'available'),
  ('b8888888-8888-8888-8888-888888888888', 'a2222222-2222-2222-2222-222222222222', '10-Foot Surge Protector Extension Board with 4 Fast USB Ports', 'Electronics', 'Heavy duty 6-socket universal power surge protector with 10ft cord, individual switches, and 4 USB fast-charging slots. Great for study sessions.', 'Like New', 'Maplewood Heights', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'For indoor use only. Do not overload.', 'available')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED BORROW REQUESTS
INSERT INTO public.borrow_requests (id, resource_id, borrower_id, start_date, end_date, message, status)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '3 days', 'Hi Sarah, need to borrow your 4-step ladder to change two high ceiling lightbulbs in my living room this weekend!', 'pending'),
  ('c2222222-2222-2222-2222-222222222222', 'b3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', CURRENT_DATE + INTERVAL '4 days', CURRENT_DATE + INTERVAL '5 days', 'Hello David! I have an upcoming campus interview on Monday morning and need to press my formal blazer and shirts.', 'pending')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED RESERVATIONS
INSERT INTO public.reservations (id, request_id, resource_id, borrower_id, owner_id, start_date, end_date, actual_return_date, status, notes)
VALUES
  ('d1111111-1111-1111-1111-111111111111', NULL, 'b6666666-6666-6666-6666-666666666666', 'a2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days', NULL, 'active', 'David picked up the vacuum cleaner with the upholstery nozzle on Wednesday.'),
  ('d2222222-2222-2222-2222-222222222222', NULL, 'b8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '6 days', 'returned', 'Returned on schedule in clean condition.'),
  ('d3333333-3333-3333-3333-333333333333', NULL, 'b1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '15 days', 'returned', 'Returned neatly with all screwdriver bits intact.')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED RATINGS
INSERT INTO public.ratings (id, reservation_id, resource_id, reviewer_id, reviewee_id, score, comment)
VALUES
  ('e1111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'b8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 5, 'The power extension board worked great for our weekend study group. David gave helpful tips on socket safety!'),
  ('e2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 5, 'Sarah is an awesome neighbor! The hammer and screwdriver set made assembling our study desk so easy.')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED REPORTS
INSERT INTO public.reports (id, reporter_id, resource_id, reported_user_id, reason, description, status, admin_notes)
VALUES
  ('f1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Misleading Description', 'Minor suggestion: Previous drill battery charge lasted about 30 mins, suggested adding a note to keep charger handy.', 'open', 'Reviewed by admin. Advised owner to note battery runtime.')
ON CONFLICT (id) DO NOTHING;
