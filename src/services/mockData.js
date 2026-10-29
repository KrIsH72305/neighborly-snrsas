import { getTodayString, addDays } from '../utils/dateUtils'

const today = getTodayString()

export const USER_ID_MAP = {
  'user-1': 'a1111111-1111-1111-1111-111111111111',
  'user-2': 'a2222222-2222-2222-2222-222222222222',
  'user-3': 'a3333333-3333-3333-3333-333333333333',
  'user-admin': 'a4444444-4444-4444-4444-444444444444',
  'a1111111-1111-1111-1111-111111111111': 'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222': 'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333': 'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444': 'a4444444-4444-4444-4444-444444444444'
}

export const RESOURCE_ID_MAP = {
  'res-1': 'b1111111-1111-1111-1111-111111111111',
  'res-2': 'b2222222-2222-2222-2222-222222222222',
  'res-3': 'b3333333-3333-3333-3333-333333333333',
  'res-4': 'b4444444-4444-4444-4444-444444444444',
  'res-5': 'b5555555-5555-5555-5555-555555555555',
  'res-6': 'b6666666-6666-6666-6666-666666666666',
  'res-7': 'b7777777-7777-7777-7777-777777777777',
  'res-8': 'b8888888-8888-8888-8888-888888888888',
  'res-9': 'b9999999-9999-9999-9999-999999999999',
  'res-10': 'ba101010-1010-1010-1010-101010101010',
  'b1111111-1111-1111-1111-111111111111': 'b1111111-1111-1111-1111-111111111111',
  'b2222222-2222-2222-2222-222222222222': 'b2222222-2222-2222-2222-222222222222',
  'b3333333-3333-3333-3333-333333333333': 'b3333333-3333-3333-3333-333333333333',
  'b4444444-4444-4444-4444-444444444444': 'b4444444-4444-4444-4444-444444444444',
  'b5555555-5555-5555-5555-555555555555': 'b5555555-5555-5555-5555-555555555555',
  'b6666666-6666-6666-6666-666666666666': 'b6666666-6666-6666-6666-666666666666',
  'b7777777-7777-7777-7777-777777777777': 'b7777777-7777-7777-7777-777777777777',
  'b8888888-8888-8888-8888-888888888888': 'b8888888-8888-8888-8888-888888888888',
  'b9999999-9999-9999-9999-999999999999': 'b9999999-9999-9999-9999-999999999999',
  'ba101010-1010-1010-1010-101010101010': 'ba101010-1010-1010-1010-101010101010'
}

export function normalizeUserId(id) {
  if (!id) return id
  return USER_ID_MAP[id] || id
}

export function normalizeResourceId(id) {
  if (!id) return id
  return RESOURCE_ID_MAP[id] || id
}

export const INITIAL_PROFILES = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    legacy_id: 'user-1',
    full_name: 'Sarah Jenkins',
    email: 'sarah@maplewood.org',
    locality: 'Maplewood Heights',
    phone: '(555) 234-5678',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'Happy to share everyday household tools and equipment with friendly neighbors!'
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    legacy_id: 'user-2',
    full_name: 'David Chen',
    email: 'david@maplewood.org',
    locality: 'Maplewood Heights',
    phone: '(555) 345-6789',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'Sharing common home appliances, study supplies, and garden utilities.'
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    legacy_id: 'user-3',
    full_name: 'Maria Rodriguez',
    email: 'maria@oakridge.org',
    locality: 'Oakridge Park',
    phone: '(555) 456-7890',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'Neighbor sharing cleaning equipment, books, and balcony garden gear.'
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    legacy_id: 'user-admin',
    full_name: 'Alex Rivera (Admin)',
    email: 'admin@neighborly.org',
    locality: 'Maplewood Heights',
    phone: '(555) 999-0000',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    bio: 'Neighborhood Board Administrator for the Neighborly platform.'
  }
]

export const INITIAL_RESOURCES = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    legacy_id: 'res-1',
    owner_id: 'a1111111-1111-1111-1111-111111111111',
    title: '45-Piece Home Repair Tool Box with Claw Hammer & Screwdrivers',
    category: 'Tools',
    description: 'Basic essential home repair kit containing a solid claw hammer, adjustable wrench, pliers, utility knife, multi-bit screwdrivers, and a 16-foot tape measure. Ideal for assembling furniture, hanging wall frames, or tightening loose screws.',
    condition: 'Like New',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1585569695919-db237e7cc455?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Please return all bits and pieces back into their molded organizer slots.',
    status: 'available',
    created_at: addDays(today, -15)
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    legacy_id: 'res-2',
    owner_id: 'a1111111-1111-1111-1111-111111111111',
    title: '4-Step Folding Aluminum Step Ladder with Anti-Slip Pedals',
    category: 'Tools',
    description: 'Lightweight folding 4-step aluminum ladder with non-slip wide steps, safety hand grip, and rubber feet. Perfect for changing ceiling lightbulbs, cleaning kitchen cabinets, or hanging curtains.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1635082627989-dcd12a107364?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 45),
    guidelines: 'Folds flat easily; fits into any car trunk or backseat.',
    status: 'available',
    created_at: addDays(today, -12)
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    legacy_id: 'res-3',
    owner_id: 'a2222222-2222-2222-2222-222222222222',
    title: 'Steam Clothes Iron with Padded Folding Ironing Board',
    category: 'Household Items',
    description: 'Non-stick ceramic soleplate steam iron with adjustable temperature settings and burst steam, paired with an adjustable folding ironing board. Great for ironing formal office shirts, suits, or traditional wear.',
    condition: 'Like New',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1633680889715-2c9752bf0840?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 30),
    guidelines: 'Empty remaining water from tank before packing up.',
    status: 'available',
    created_at: addDays(today, -10)
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    legacy_id: 'res-4',
    owner_id: 'a2222222-2222-2222-2222-222222222222',
    title: '50-Foot Flexible Garden Water Hose with 8-Spray Pattern Nozzle',
    category: 'Gardening',
    description: 'Durable, lightweight expandable garden hose with brass connectors and an 8-mode spray nozzle (mist, jet, shower, flat, etc.). Ideal for watering balcony pots, washing the porch, or car cleaning.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1697281717882-7b3b0e06fe52?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 90),
    guidelines: 'Drain remaining water and coil loosely after use.',
    status: 'available',
    created_at: addDays(today, -20)
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    legacy_id: 'res-5',
    owner_id: 'a3333333-3333-3333-3333-333333333333',
    title: 'Engineering Mathematics & Reference Books with Scientific Calculator',
    category: 'Books',
    description: 'Higher Engineering Mathematics and Physics reference book set, along with a Casio FX-991EX scientific calculator. Perfect for semester exams, college assignments, and technical study sessions.',
    condition: 'Like New',
    locality: 'Oakridge Park',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Please keep books dry and do not write or highlight on the pages.',
    status: 'available',
    created_at: addDays(today, -8)
  },
  {
    id: 'b6666666-6666-6666-6666-666666666666',
    legacy_id: 'res-6',
    owner_id: 'a3333333-3333-3333-3333-333333333333',
    title: 'Compact Wet & Dry Canister Vacuum Cleaner',
    category: 'Household Items',
    description: 'High-suction 1200W compact vacuum cleaner with dust bag, sofa upholstery nozzle, and crevice tool. Excellent for weekend deep cleaning of bedrooms, mattresses, window sills, and car interiors.',
    condition: 'Like New',
    locality: 'Oakridge Park',
    image_url: 'https://images.unsplash.com/photo-1687443093393-2406de382ced?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 45),
    guidelines: 'Empty dust canister after vacuuming dry dirt.',
    status: 'borrowed',
    created_at: addDays(today, -18)
  },
  {
    id: 'b7777777-7777-7777-7777-777777777777',
    legacy_id: 'res-7',
    owner_id: 'a1111111-1111-1111-1111-111111111111',
    title: '4-Foot White Plastic Folding Table with 4 Sturdy Chairs',
    category: 'Household Items',
    description: 'Portable heavy-duty plastic folding table with 4 stackable chairs. Perfect for hosting extra guests, birthday dinners, festival gatherings, or setting up a temporary work/study area.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1611486212355-d276af4581c0?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Wipe tabletop clean with a damp cloth before returning.',
    status: 'available',
    created_at: addDays(today, -5)
  },
  {
    id: 'b8888888-8888-8888-8888-888888888888',
    legacy_id: 'res-8',
    owner_id: 'a2222222-2222-2222-2222-222222222222',
    title: '10-Foot Surge Protector Extension Board with 4 Fast USB Ports',
    category: 'Electronics',
    description: 'Heavy duty 6-socket universal power surge protector with 10ft cord, individual switches, and 4 USB fast-charging slots. Great for study sessions, home workstations, or family movie setups.',
    condition: 'Like New',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1581558775369-0fe7925f0035?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 30),
    guidelines: 'For indoor use only. Do not overload with heavy heating appliances.',
    status: 'available',
    created_at: addDays(today, -25)
  },
  {
    id: 'b9999999-9999-9999-9999-999999999999',
    legacy_id: 'res-9',
    owner_id: 'a1111111-1111-1111-1111-111111111111',
    title: '12V Cordless Hand Drill with Battery & Wall Anchor Screws',
    category: 'Tools',
    description: 'Compact, easy-to-use cordless hand drill with forward/reverse, battery charger, and basic drill bits. Perfect for hanging clocks, mirrors, and assembling wooden shelves.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1562237553-36ad661d6f2c?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 40),
    guidelines: 'Please recharge battery before returning.',
    status: 'available',
    created_at: addDays(today, -14)
  },
  {
    id: 'ba101010-1010-1010-1010-101010101010',
    legacy_id: 'res-10',
    owner_id: 'a3333333-3333-3333-3333-333333333333',
    title: 'Ergonomic Garden Hand Trowel, Cultivator & Pruning Shears Set',
    category: 'Gardening',
    description: 'Comfortable soft-grip rust-resistant gardening hand tool set including a soil trowel, small rake, and bypass pruning shears for trimming potted plants and balcony gardens.',
    condition: 'Like New',
    locality: 'Oakridge Park',
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Wipe off dirt from blades and trowel before returning.',
    status: 'available',
    created_at: addDays(today, -7)
  }
]

export const INITIAL_REQUESTS = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    legacy_id: 'req-1',
    resource_id: 'b2222222-2222-2222-2222-222222222222', // 4-Step Ladder (Sarah's)
    borrower_id: 'a2222222-2222-2222-2222-222222222222', // David
    start_date: addDays(today, 2),
    end_date: addDays(today, 3),
    message: 'Hi Sarah, need to borrow your 4-step ladder to change two high ceiling lightbulbs in my living room this weekend!',
    status: 'pending',
    response_note: null,
    created_at: addDays(today, -1)
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    legacy_id: 'req-2',
    resource_id: 'b3333333-3333-3333-3333-333333333333', // Steam Iron (David's)
    borrower_id: 'a3333333-3333-3333-3333-333333333333', // Maria
    start_date: addDays(today, 4),
    end_date: addDays(today, 5),
    message: 'Hello David! I have an upcoming campus interview on Monday morning and need to press my formal blazer and shirts.',
    status: 'pending',
    response_note: null,
    created_at: addDays(today, -2)
  }
]

export const INITIAL_RESERVATIONS = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    legacy_id: 'resv-1',
    request_id: 'c1111111-1111-1111-1111-111111111111',
    resource_id: 'b6666666-6666-6666-6666-666666666666', // Vacuum Cleaner (Maria's)
    borrower_id: 'a2222222-2222-2222-2222-222222222222', // David Chen
    owner_id: 'a3333333-3333-3333-3333-333333333333', // Maria Rodriguez
    start_date: addDays(today, -2),
    end_date: addDays(today, 2),
    actual_return_date: null,
    status: 'active',
    notes: 'David picked up the vacuum cleaner with the upholstery nozzle on Wednesday.',
    created_at: addDays(today, -3)
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    legacy_id: 'resv-2',
    request_id: null,
    resource_id: 'b8888888-8888-8888-8888-888888888888', // Extension Board (David's)
    borrower_id: 'a1111111-1111-1111-1111-111111111111', // Sarah Jenkins
    owner_id: 'a2222222-2222-2222-2222-222222222222', // David Chen
    start_date: addDays(today, -10),
    end_date: addDays(today, -6),
    actual_return_date: addDays(today, -6),
    status: 'returned',
    notes: 'Returned on schedule in clean condition.',
    created_at: addDays(today, -12)
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    legacy_id: 'resv-3',
    request_id: null,
    resource_id: 'b1111111-1111-1111-1111-111111111111', // Home Tool Box (Sarah's)
    borrower_id: 'a3333333-3333-3333-3333-333333333333', // Maria
    owner_id: 'a1111111-1111-1111-1111-111111111111', // Sarah
    start_date: addDays(today, -18),
    end_date: addDays(today, -15),
    actual_return_date: addDays(today, -15),
    status: 'returned',
    notes: 'Returned neatly with all screwdriver bits intact.',
    created_at: addDays(today, -20)
  }
]

export const INITIAL_RATINGS = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    legacy_id: 'rate-1',
    reservation_id: 'd2222222-2222-2222-2222-222222222222',
    resource_id: 'b8888888-8888-8888-8888-888888888888',
    reviewer_id: 'a1111111-1111-1111-1111-111111111111', // Sarah reviewed David's extension board
    reviewee_id: 'a2222222-2222-2222-2222-222222222222', // David
    score: 5,
    comment: 'The power extension board worked great for our weekend study group. David gave helpful tips on socket safety!',
    created_at: addDays(today, -5)
  },
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    legacy_id: 'rate-2',
    reservation_id: 'd3333333-3333-3333-3333-333333333333',
    resource_id: 'b1111111-1111-1111-1111-111111111111',
    reviewer_id: 'a3333333-3333-3333-3333-333333333333', // Maria reviewed Sarah's tool box
    reviewee_id: 'a1111111-1111-1111-1111-111111111111', // Sarah
    score: 5,
    comment: 'Sarah is an awesome neighbor! The hammer and screwdriver set made assembling our study desk so easy.',
    created_at: addDays(today, -14)
  }
]

export const INITIAL_REPORTS = [
  {
    id: 'f1111111-1111-1111-1111-111111111111',
    legacy_id: 'rep-1',
    reporter_id: 'a2222222-2222-2222-2222-222222222222',
    resource_id: 'b9999999-9999-9999-9999-999999999999',
    reported_user_id: 'a1111111-1111-1111-1111-111111111111',
    reason: 'Misleading Description',
    description: 'Minor suggestion: Previous drill battery charge lasted about 30 mins, suggested adding a note to keep the charger handy.',
    status: 'open',
    admin_notes: 'Reviewed by admin. Advised owner to note battery runtime.',
    created_at: addDays(today, -4)
  }
]
