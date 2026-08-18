export type Category = {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
};

export type Worker = {
  id: string;
  avatar: string;
  name: string;
  trade: string;
  category: string;
  distance: string;
  rating: number;
  rate: string;
  verified: boolean;
  reviews: number;
  about: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const categories: Category[] = [
  { slug: 'cleaning', name: 'Cleaning', icon: 'sparkles', blurb: 'Sparkling homes and offices, done right.' },
  { slug: 'plumbing', name: 'Plumbing', icon: 'droplet', blurb: 'Leaks, blockages and installations.' },
  { slug: 'electrical', name: 'Electrical', icon: 'zap', blurb: 'Safe wiring, repairs and fittings.' },
  { slug: 'painting', name: 'Painting', icon: 'paint-bucket', blurb: 'Interior and exterior makeovers.' },
  { slug: 'moving', name: 'Moving', icon: 'truck', blurb: 'Careful moves, across town and beyond.' },
  { slug: 'gardening', name: 'Gardening', icon: 'flower', blurb: 'Lawns, pruning and tidy yards.' },
  { slug: 'repairs', name: 'Repairs', icon: 'wrench', blurb: 'General fixes around the house.' },
  { slug: 'carpentry', name: 'Carpentry', icon: 'hammer', blurb: 'Custom woodwork and joinery.' },
];

export const workers: Worker[] = [
  {
    id: 'w1',
    avatar: 'TM',
    name: 'Thabo M.',
    trade: 'Plumber',
    category: 'plumbing',
    distance: '1.2 km',
    rating: 4.8,
    rate: 'R250/hr',
    verified: true,
    reviews: 132,
    about: 'Qualified plumber with 8 years of experience handling leaks, geysers and full bathroom installations.',
  },
  {
    id: 'w2',
    avatar: 'NP',
    name: 'Naledi P.',
    trade: 'Cleaning',
    category: 'cleaning',
    distance: '2.4 km',
    rating: 4.9,
    rate: 'R180/hr',
    verified: true,
    reviews: 98,
    about: 'Detail-focused cleaner who leaves every home spotless. Specialises in deep cleans and move-out cleans.',
  },
  {
    id: 'w3',
    avatar: 'SM',
    name: 'Sipho M.',
    trade: 'Electrician',
    category: 'electrical',
    distance: '3.1 km',
    rating: 4.7,
    rate: 'R300/hr',
    verified: false,
    reviews: 74,
    about: 'Certified electrician for wiring, repairs, lighting and safety inspections across the neighbourhood.',
  },
  {
    id: 'w4',
    avatar: 'KD',
    name: 'Kabelo D.',
    trade: 'Painter',
    category: 'painting',
    distance: '1.8 km',
    rating: 4.6,
    rate: 'R220/hr',
    verified: false,
    reviews: 41,
    about: 'Interior and exterior painter with a steady hand and a sharp eye for clean lines.',
  },
  {
    id: 'w5',
    avatar: 'ZT',
    name: 'Zanele T.',
    trade: 'Moving',
    category: 'moving',
    distance: '4.0 km',
    rating: 4.5,
    rate: 'R350/job',
    verified: true,
    reviews: 63,
    about: 'Reliable mover with a bakkie and helpers. Careful with furniture, fair with prices.',
  },
  {
    id: 'w6',
    avatar: 'MN',
    name: 'Musa N.',
    trade: 'Gardener',
    category: 'gardening',
    distance: '2.9 km',
    rating: 4.7,
    rate: 'R150/hr',
    verified: false,
    reviews: 28,
    about: 'Keeps lawns neat and gardens thriving with pruning, weeding and seasonal care.',
  },
  {
    id: 'w7',
    avatar: 'KM',
    name: 'Kagiso M.',
    trade: 'Handyman',
    category: 'repairs',
    distance: '0.9 km',
    rating: 4.9,
    rate: 'R200/hr',
    verified: true,
    reviews: 117,
    about: 'Jack of all trades for household fixes: doors, taps, shelves, tiles and more.',
  },
  {
    id: 'w8',
    avatar: 'LM',
    name: 'Lebo M.',
    trade: 'Carpenter',
    category: 'carpentry',
    distance: '3.5 km',
    rating: 4.6,
    rate: 'R280/hr',
    verified: false,
    reviews: 52,
    about: 'Custom woodwork, built-ins and joinery done with care and precision.',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Job accepted',
    body: 'Thabo accepted your plumbing request.',
    time: '5m',
    unread: true,
  },
  {
    id: 'n2',
    title: 'New message',
    body: 'You have a new message from Naledi.',
    time: '1h',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Payment received',
    body: 'R250.00 was added to your wallet.',
    time: '2h',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Review received',
    body: 'Sipho left you a 5-star review.',
    time: '1d',
    unread: false,
  },
  {
    id: 'n5',
    title: 'Quote approved',
    body: 'Your quote for the moving job was approved.',
    time: '2d',
    unread: false,
  },
];

export type JobStatus = 'ongoing' | 'requested' | 'completed';

export type Job = {
  id: string;
  service: string;
  worker: string;
  category: string;
  date: string;
  price: string;
  status: JobStatus;
};

export const jobs: Job[] = [
  {
    id: 'j1',
    service: 'Geyser replacement',
    worker: 'Thabo M.',
    category: 'plumbing',
    date: '12 Aug',
    price: 'R1 200',
    status: 'ongoing',
  },
  {
    id: 'j2',
    service: 'Deep clean',
    worker: 'Naledi P.',
    category: 'cleaning',
    date: '14 Aug',
    price: 'R540',
    status: 'requested',
  },
  {
    id: 'j3',
    service: 'Wiring repair',
    worker: 'Sipho M.',
    category: 'electrical',
    date: '3 Aug',
    price: 'R600',
    status: 'completed',
  },
  {
    id: 'j4',
    service: 'Interior painting',
    worker: 'Kabelo D.',
    category: 'painting',
    date: '9 Aug',
    price: 'R800',
    status: 'requested',
  },
  {
    id: 'j5',
    service: 'Fence repair',
    worker: 'Kagiso M.',
    category: 'repairs',
    date: '5 Aug',
    price: 'R350',
    status: 'completed',
  },
];

export type RatingRow = {
  stars: number;
  count: number;
};

export const ratingBreakdown: RatingRow[] = [
  { stars: 5, count: 86 },
  { stars: 4, count: 30 },
  { stars: 3, count: 10 },
  { stars: 2, count: 4 },
  { stars: 1, count: 2 },
];

export type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  body: string;
};

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Busisiwe K.',
    date: '2 Aug',
    rating: 5,
    body: 'Arrived on time and fixed the leak in under an hour. Highly recommend!',
  },
  {
    id: 'r2',
    name: 'Lerato N.',
    date: '28 Jul',
    rating: 5,
    body: 'Professional and friendly. Fair price for the work done.',
  },
  {
    id: 'r3',
    name: 'Kagiso D.',
    date: '15 Jul',
    rating: 4,
    body: 'Great job overall, just ran a little late. Would book again.',
  },
];

export type ChatMessage = {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
};

export const chatMessages: ChatMessage[] = [
  { id: 'm1', from: 'them', text: 'Hi! I can take a look at your geyser tomorrow morning.', time: '09:02' },
  { id: 'm2', from: 'me', text: 'That works for me. What time is best?', time: '09:10' },
  { id: 'm3', from: 'them', text: 'How about 10:00?', time: '09:11' },
];
