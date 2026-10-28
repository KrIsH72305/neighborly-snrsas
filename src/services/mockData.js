import { getTodayString, addDays } from '../utils/dateUtils'

const today = getTodayString()

export const INITIAL_PROFILES = [
  {
    id: 'user-1',
    full_name: 'Sarah Jenkins',
    email: 'sarah@maplewood.org',
    locality: 'Maplewood Heights',
    phone: '(555) 234-5678',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'Happy to share everyday household tools and equipment with friendly neighbors!'
  },
  {
    id: 'user-2',
    full_name: 'David Chen',
    email: 'david@maplewood.org',
    locality: 'Maplewood Heights',
    phone: '(555) 345-6789',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'Sharing common home appliances, study supplies, and garden utilities.'
  },
  {
    id: 'user-3',
    full_name: 'Maria Rodriguez',
    email: 'maria@oakridge.org',
    locality: 'Oakridge Park',
    phone: '(555) 456-7890',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'Neighbor sharing cleaning equipment, books, and balcony garden gear.'
  },
  {
    id: 'user-admin',
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
    id: 'res-1',
    owner_id: 'user-1',
    title: '45-Piece Home Repair Tool Box with Claw Hammer & Screwdrivers',
    category: 'Tools',
    description: 'Basic essential home repair kit containing a solid claw hammer, adjustable wrench, pliers, utility knife, multi-bit screwdrivers, and a 16-foot tape measure. Ideal for assembling furniture, hanging wall frames, or tightening loose screws.',
    condition: 'Like New',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Please return all bits and pieces back into their molded organizer slots.',
    status: 'available',
    created_at: addDays(today, -15)
  },
  {
    id: 'res-2',
    owner_id: 'user-1',
    title: '4-Step Folding Aluminum Step Ladder with Anti-Slip Pedals',
    category: 'Tools',
    description: 'Lightweight folding 4-step aluminum ladder with non-slip wide steps, safety hand grip, and rubber feet. Perfect for changing ceiling lightbulbs, cleaning kitchen cabinets, or hanging curtains.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 45),
    guidelines: 'Folds flat easily; fits into any car trunk or backseat.',
    status: 'available',
    created_at: addDays(today, -12)
  },
  {
    id: 'res-3',
    owner_id: 'user-2',
    title: 'Steam Clothes Iron with Padded Folding Ironing Board',
    category: 'Household Items',
    description: 'Non-stick ceramic soleplate steam iron with adjustable temperature settings and burst steam, paired with an adjustable folding ironing board. Great for ironing formal office shirts, suits, or traditional wear.',
    condition: 'Like New',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 30),
    guidelines: 'Empty remaining water from tank before packing up.',
    status: 'available',
    created_at: addDays(today, -10)
  },
  {
    id: 'res-4',
    owner_id: 'user-2',
    title: '50-Foot Flexible Garden Water Hose with 8-Spray Pattern Nozzle',
    category: 'Gardening',
    description: 'Durable, lightweight expandable garden hose with brass connectors and an 8-mode spray nozzle (mist, jet, shower, flat, etc.). Ideal for watering balcony pots, washing the porch, or car cleaning.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 90),
    guidelines: 'Drain remaining water and coil loosely after use.',
    status: 'available',
    created_at: addDays(today, -20)
  },
  {
    id: 'res-5',
    owner_id: 'user-3',
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
    id: 'res-6',
    owner_id: 'user-3',
    title: 'Compact Wet & Dry Canister Vacuum Cleaner',
    category: 'Household Items',
    description: 'High-suction 1200W compact vacuum cleaner with dust bag, sofa upholstery nozzle, and crevice tool. Excellent for weekend deep cleaning of bedrooms, mattresses, window sills, and car interiors.',
    condition: 'Like New',
    locality: 'Oakridge Park',
    image_url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 45),
    guidelines: 'Empty dust canister after vacuuming dry dirt.',
    status: 'borrowed',
    created_at: addDays(today, -18)
  },
  {
    id: 'res-7',
    owner_id: 'user-1',
    title: '4-Foot White Plastic Folding Table with 4 Sturdy Chairs',
    category: 'Household Items',
    description: 'Portable heavy-duty plastic folding table with 4 stackable chairs. Perfect for hosting extra guests, birthday dinners, festival gatherings, or setting up a temporary work/study area.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Wipe tabletop clean with a damp cloth before returning.',
    status: 'available',
    created_at: addDays(today, -5)
  },
  {
    id: 'res-8',
    owner_id: 'user-2',
    title: '10-Foot Surge Protector Extension Board with 4 Fast USB Ports',
    category: 'Electronics',
    description: 'Heavy duty 6-socket universal power surge protector with 10ft cord, individual switches, and 4 USB fast-charging slots. Great for study sessions, home workstations, or family movie setups.',
    condition: 'Like New',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 30),
    guidelines: 'For indoor use only. Do not overload with heavy heating appliances.',
    status: 'available',
    created_at: addDays(today, -25)
  },
  {
    id: 'res-9',
    owner_id: 'user-1',
    title: '12V Cordless Hand Drill with Battery & Wall Anchor Screws',
    category: 'Tools',
    description: 'Compact, easy-to-use cordless hand drill with forward/reverse, battery charger, and basic drill bits. Perfect for hanging clocks, mirrors, and assembling wooden shelves.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 40),
    guidelines: 'Please recharge battery before returning.',
    status: 'available',
    created_at: addDays(today, -14)
  },
  {
    id: 'res-10',
    owner_id: 'user-3',
    title: 'Ergonomic Garden Hand Trowel, Cultivator & Pruning Shears Set',
    category: 'Gardening',
    description: 'Comfortable soft-grip rust-resistant gardening hand tool set including a soil trowel, small rake, and bypass pruning shears for trimming potted plants and balcony gardens.',
    condition: 'Like New',
    locality: 'Oakridge Park',
    image_url: 'https://images.unsplash.com/photo-1599818816935-86f2b7745778?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Wipe off dirt from blades and trowel before returning.',
    status: 'available',
    created_at: addDays(today, -7)
  }
]

export const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    resource_id: 'res-2', // 4-Step Ladder (Sarah's)
    borrower_id: 'user-2', // David
    start_date: addDays(today, 2),
    end_date: addDays(today, 3),
    message: 'Hi Sarah, need to borrow your 4-step ladder to change two high ceiling lightbulbs in my living room this weekend!',
    status: 'pending',
    response_note: null,
    created_at: addDays(today, -1)
  },
  {
    id: 'req-2',
    resource_id: 'res-3', // Steam Iron (David's)
    borrower_id: 'user-3', // Maria
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
    id: 'resv-1',
    request_id: 'req-prev-1',
    resource_id: 'res-6', // Vacuum Cleaner (Maria's)
    borrower_id: 'user-2', // David Chen
    owner_id: 'user-3', // Maria Rodriguez
    start_date: addDays(today, -2),
    end_date: addDays(today, 2),
    actual_return_date: null,
    status: 'active',
    notes: 'David picked up the vacuum cleaner with the upholstery nozzle on Wednesday.',
    created_at: addDays(today, -3)
  },
  {
    id: 'resv-2',
    request_id: 'req-prev-2',
    resource_id: 'res-8', // Extension Board (David's)
    borrower_id: 'user-1', // Sarah Jenkins
    owner_id: 'user-2', // David Chen
    start_date: addDays(today, -10),
    end_date: addDays(today, -6),
    actual_return_date: addDays(today, -6),
    status: 'returned',
    notes: 'Returned on schedule in clean condition.',
    created_at: addDays(today, -12)
  },
  {
    id: 'resv-3',
    request_id: 'req-prev-3',
    resource_id: 'res-1', // Home Tool Box (Sarah's)
    borrower_id: 'user-3', // Maria
    owner_id: 'user-1', // Sarah
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
    id: 'rate-1',
    reservation_id: 'resv-2',
    resource_id: 'res-8',
    reviewer_id: 'user-1', // Sarah reviewed David's extension board
    reviewee_id: 'user-2', // David
    score: 5,
    comment: 'The power extension board worked great for our weekend study group. David gave helpful tips on socket safety!',
    created_at: addDays(today, -5)
  },
  {
    id: 'rate-2',
    reservation_id: 'resv-3',
    resource_id: 'res-1',
    reviewer_id: 'user-3', // Maria reviewed Sarah's tool box
    reviewee_id: 'user-1', // Sarah
    score: 5,
    comment: 'Sarah is an awesome neighbor! The hammer and screwdriver set made assembling our study desk so easy.',
    created_at: addDays(today, -14)
  }
]

export const INITIAL_REPORTS = [
  {
    id: 'rep-1',
    reporter_id: 'user-2',
    resource_id: 'res-9',
    reported_user_id: 'user-1',
    reason: 'Misleading Description',
    description: 'Minor suggestion: Previous drill battery charge lasted about 30 mins, suggested adding a note to keep the charger handy.',
    status: 'open',
    admin_notes: 'Reviewed by admin. Advised owner to note battery runtime.',
    created_at: addDays(today, -4)
  }
]
