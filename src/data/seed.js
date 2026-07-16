export const NAV_ITEMS = [
  { id: 'registration', label: 'Login / Register', icon: '👤' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'credits', label: 'Credit Actions', icon: '➕' },
  { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
  { id: 'ai', label: 'AI / RAG', icon: '🤖' },
]

export const INITIAL_USER = {
  firstName: '',
  lastName: '',
  email: '',
  wallet: '',
  role: '',
  location: '',
}

export const INITIAL_CREDITS = [
  {
    id: 'EC-101',
    source: 'Solar',
    category: 'Renewable',
    qty: 100,
    available: 100,
    rate: '0.00045 ETH/kWh',
    total: '0.045 ETH',
    location: 'Noida, India',
    status: 'Listed',
    badge: 'green-badge',
    owned: true,
  },
  {
    id: 'EC-118',
    source: 'Wind',
    category: 'Renewable',
    qty: 250,
    available: 250,
    rate: '0.00044 ETH/kWh',
    total: '0.110 ETH',
    location: 'Gujarat, India',
    status: 'Available',
    badge: 'blue-badge',
    owned: true,
  },
  {
    id: 'EC-203',
    source: 'Gas',
    category: 'Fossil',
    qty: 80,
    available: 80,
    rate: '0.00022 ETH/kWh',
    total: '0.018 ETH',
    location: 'Singapore',
    status: 'Listed',
    badge: 'orange-badge',
    owned: false,
  },
]

export const INITIAL_AUDIT = [
  'System initialized',
  'Marketplace loaded with sample credits',
  'EC-101 created: 100 kWh from Solar',
  'EC-101 marked for sell',
  'EC-118 created: 250 kWh from Wind',
  'EC-203 created: 80 kWh from Gas',
  'EC-203 marked for sell',
]

export const QUICK_QUESTIONS = [
  'How many credits are listed in marketplace?',
  'Which credits are renewable?',
  'Explain latest audit trail',
  'Can gas credits be marked as green?',
]

export const SOURCE_OPTIONS = ['Solar', 'Wind', 'Hydro', 'Coal', 'Gas', 'Thermal']

export const ROLE_OPTIONS = ['Producer / Buyer', 'Producer', 'Buyer', 'Auditor']
