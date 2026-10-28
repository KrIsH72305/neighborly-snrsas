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
    bio: 'Avid DIYer and gardener. Happy to share tools with trusted neighbors!'
  },
  {
    id: 'user-2',
    full_name: 'David Chen',
    email: 'david@maplewood.org',
    locality: 'Maplewood Heights',
    phone: '(555) 345-6789',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'Tech enthusiast and home cinema lover. Lending electronics & lawn care tools.'
  },
  {
    id: 'user-3',
    full_name: 'Maria Rodriguez',
    email: 'maria@oakridge.org',
    locality: 'Oakridge Park',
    phone: '(555) 456-7890',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    bio: 'Book club organizer and outdoor gear collector. Let us share sustainably.'
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
    title: 'DeWalt 20V Max Cordless Drill & Impact Driver Kit',
    category: 'Tools',
    description: 'High-performance brushless drill kit including 2 lithium-ion batteries, charger, and standard masonry/wood drill bit set. Perfect for home repairs and shelf mounting.',
    condition: 'Like New',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Please recharge both batteries before returning. Return in original protective hardcase.',
    status: 'available',
    created_at: addDays(today, -15)
  },
  {
    id: 'res-2',
    owner_id: 'user-1',
    title: 'Werner 16ft Aluminum Extension Ladder',
    category: 'Tools',
    description: 'Sturdy type II rated aluminum extension ladder with non-marring end caps and slip-resistant rungs. Maximum reach approx. 19 feet.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 45),
    guidelines: 'Bring a vehicle with roof racks or a pickup truck for transport. Clean off any mud.',
    status: 'available',
    created_at: addDays(today, -12)
  },
  {
    id: 'res-3',
    owner_id: 'user-2',
    title: 'Epson 1080p Home Cinema Movie Projector',
    category: 'Electronics',
    description: 'Crisp Full HD projector with 3,000 lumens brightness, HDMI inputs, and built-in speakers. Ideal for backyard movie nights, presentations, or gaming.',
    condition: 'Like New',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 30),
    guidelines: 'Handle lens with care. Includes 15-foot HDMI cord and protective padded bag.',
    status: 'available',
    created_at: addDays(today, -10)
  },
  {
    id: 'res-4',
    owner_id: 'user-2',
    title: 'Honda 21-inch Self-Propelled Gas Lawn Mower',
    category: 'Gardening',
    description: 'Twin-blade self-propelled mower with easy starting engine and mulch/bag capability. Runs smoothly and delivers clean cuts.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 90),
    guidelines: 'Regular unleaded 87 octane fuel only. Clean deck of grass clippings prior to drop-off.',
    status: 'available',
    created_at: addDays(today, -20)
  },
  {
    id: 'res-5',
    owner_id: 'user-3',
    title: 'Complete Harry Potter Special 7-Book Hardcover Set',
    category: 'Books',
    description: 'Collector edition hardcovers in pristine condition. Great for family reading or binge-reading weekends.',
    condition: 'New',
    locality: 'Oakridge Park',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Keep away from moisture and liquids. Please use bookmarks rather than dog-earing pages.',
    status: 'available',
    created_at: addDays(today, -8)
  },
  {
    id: 'res-6',
    owner_id: 'user-3',
    title: 'Karcher K5 2000-PSI Electric Pressure Washer',
    category: 'Household Items',
    description: 'Electric pressure washer with dirt blaster wand and Vario Power spray. Fantastic for power-washing driveways, patios, outdoor furniture, and cars.',
    condition: 'Like New',
    locality: 'Oakridge Park',
    image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 45),
    guidelines: 'Standard garden hose inlet required. Connect to GFCI protected outdoor electrical outlet.',
    status: 'borrowed',
    created_at: addDays(today, -18)
  },
  {
    id: 'res-7',
    owner_id: 'user-1',
    title: 'Coleman 6-Person Weatherproof Dome Camping Tent',
    category: 'Household Items',
    description: 'Spacious 10x10 ft dome tent with WeatherTec system to withstand 35+ mph winds. Setup takes under 10 minutes with snag-free continuous pole sleeves.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Ensure tent is completely dry and shaken clean of pine needles/sand before repacking into bag.',
    status: 'available',
    created_at: addDays(today, -5)
  },
  {
    id: 'res-8',
    owner_id: 'user-2',
    title: 'Sony Alpha A6400 4K Mirrorless Digital Camera Kit',
    category: 'Electronics',
    description: 'Equipped with 16-50mm power zoom lens, ultra-fast autofocus, flip screen, 64GB high speed SD card, and 2 batteries. Ideal for graduation, weddings, or vacations.',
    condition: 'Like New',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 30),
    guidelines: 'Use camera neck strap at all times. Backup your photos and format the SD card before returning.',
    status: 'available',
    created_at: addDays(today, -25)
  },
  {
    id: 'res-9',
    owner_id: 'user-1',
    title: 'Bosch SDS-Plus 1-Inch Rotary Hammer Drill',
    category: 'Tools',
    description: 'Heavy duty rotary hammer for drilling into solid concrete, brick, and stone foundations. Includes chisel bit and grease.',
    condition: 'Good',
    locality: 'Maplewood Heights',
    image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 40),
    guidelines: 'Safety glasses and ear protection strongly advised when operating.',
    status: 'available',
    created_at: addDays(today, -14)
  },
  {
    id: 'res-10',
    owner_id: 'user-3',
    title: 'Stihl HSA 26 Cordless Grass & Shrub Shears',
    category: 'Gardening',
    description: 'Lightweight, cordless hedge trimmer with dual action blades for shaping ornamental shrubs and precision lawn edging.',
    condition: 'Like New',
    locality: 'Oakridge Park',
    image_url: 'https://images.unsplash.com/photo-1599818816935-86f2b7745778?w=600&auto=format&fit=crop&q=80',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: 'Wipe resin off blades with vegetable oil or mild soap after use.',
    status: 'available',
    created_at: addDays(today, -7)
  }
]

export const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    resource_id: 'res-2', // Werner Ladder (Sarah's)
    borrower_id: 'user-2', // David
    start_date: addDays(today, 2),
    end_date: addDays(today, 4),
    message: 'Hi Sarah, need to clean my second floor rain gutters this weekend before the rainy season!',
    status: 'pending',
    response_note: null,
    created_at: addDays(today, -1)
  },
  {
    id: 'req-2',
    resource_id: 'res-3', // Projector (David's)
    borrower_id: 'user-3', // Maria
    start_date: addDays(today, 5),
    end_date: addDays(today, 7),
    message: 'Hello David! Our neighborhood book club is hosting an outdoor documentary showing.',
    status: 'pending',
    response_note: null,
    created_at: addDays(today, -2)
  }
]

export const INITIAL_RESERVATIONS = [
  {
    id: 'resv-1',
    request_id: 'req-prev-1',
    resource_id: 'res-6', // Karcher Pressure Washer (Maria's)
    borrower_id: 'user-2', // David Chen
    owner_id: 'user-3', // Maria Rodriguez
    start_date: addDays(today, -2),
    end_date: addDays(today, 3),
    actual_return_date: null,
    status: 'active',
    notes: 'David picked up washer on Wednesday afternoon with hose adapter.',
    created_at: addDays(today, -3)
  },
  {
    id: 'resv-2',
    request_id: 'req-prev-2',
    resource_id: 'res-8', // Sony A6400 (David's)
    borrower_id: 'user-1', // Sarah Jenkins
    owner_id: 'user-2', // David Chen
    start_date: addDays(today, -12),
    end_date: addDays(today, -7),
    actual_return_date: addDays(today, -7),
    status: 'returned',
    notes: 'Returned on schedule in great shape.',
    created_at: addDays(today, -14)
  },
  {
    id: 'resv-3',
    request_id: 'req-prev-3',
    resource_id: 'res-1', // DeWalt Drill (Sarah's)
    borrower_id: 'user-3', // Maria
    owner_id: 'user-1', // Sarah
    start_date: addDays(today, -20),
    end_date: addDays(today, -17),
    actual_return_date: addDays(today, -17),
    status: 'returned',
    notes: 'Completed successfully.',
    created_at: addDays(today, -22)
  }
]

export const INITIAL_RATINGS = [
  {
    id: 'rate-1',
    reservation_id: 'resv-2',
    resource_id: 'res-8',
    reviewer_id: 'user-1', // Sarah reviewed David's camera
    reviewee_id: 'user-2', // David
    score: 5,
    comment: 'The Sony camera was immaculate and captured incredible photos at my niece graduation! David gave clear battery instructions.',
    created_at: addDays(today, -6)
  },
  {
    id: 'rate-2',
    reservation_id: 'resv-3',
    resource_id: 'res-1',
    reviewer_id: 'user-3', // Maria reviewed Sarah's drill
    reviewee_id: 'user-1', // Sarah
    score: 5,
    comment: 'Sarah is an amazing neighbor! The drill made putting up our heavy bookshelf a breeze.',
    created_at: addDays(today, -16)
  }
]

export const INITIAL_REPORTS = [
  {
    id: 'rep-1',
    reporter_id: 'user-2',
    resource_id: 'res-9',
    reported_user_id: 'user-1',
    reason: 'Misleading Description',
    description: 'Minor concern: previous drill bit was slightly duller than listed, suggested adding a sharpening disclaimer.',
    status: 'open',
    admin_notes: 'Reviewed by admin. Advised owner to note bit condition.',
    created_at: addDays(today, -4)
  }
]
