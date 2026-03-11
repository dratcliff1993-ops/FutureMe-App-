export interface Workplace {
  id: string;
  name: string;
  city: string;
  coordinates: { lat: number; lng: number };
  industry: string;
  description: string;
  avgSalary: number;
  companies?: string[];
}

export const dummyWorkplaces: Workplace[] = [
  {
    id: 'workplace-kings-cross',
    name: "King's Cross / St Pancras",
    city: 'London',
    coordinates: { lat: 51.5308, lng: -0.1223 },
    industry: 'Tech, Media, Publishing',
    description: 'Trendy tech hub with creative agencies and startups. Home to major media companies.',
    avgSalary: 72000,
    companies: ['Google, Facebook', 'The Guardian', 'Typeform', 'TransferWise']
  },
  {
    id: 'workplace-canary-wharf',
    name: 'Canary Wharf',
    city: 'London',
    coordinates: { lat: 51.5054, lng: -0.0197 },
    industry: 'Finance, Banking',
    description: 'Major financial centre with banking headquarters and trading firms.',
    avgSalary: 95000,
    companies: ['HSBC', 'Barclays', 'Morgan Stanley', 'Bank of America', 'Citadel']
  },
  {
    id: 'workplace-city-london',
    name: 'City of London',
    city: 'London',
    coordinates: { lat: 51.5151, lng: -0.0909 },
    industry: 'Finance, Insurance, Law',
    description: 'Historic financial district with banks, law firms, and insurance companies.',
    avgSalary: 100000,
    companies: ['Lloyd\'s of London', 'Clifford Chance', 'Linklaters', 'Goldman Sachs']
  },
  {
    id: 'workplace-shoreditch',
    name: 'Shoreditch',
    city: 'London',
    coordinates: { lat: 51.5263, lng: -0.0842 },
    industry: 'Tech, Startups, Design',
    description: 'Vibrant startup ecosystem with design studios and tech companies.',
    avgSalary: 65000,
    companies: ['Deliveroo', 'Slack', 'Wise', 'Trustpilot']
  },
  {
    id: 'workplace-south-london',
    name: 'Elephant & Castle / Southwark',
    city: 'London',
    coordinates: { lat: 51.4949, lng: -0.1037 },
    industry: 'Tech, Healthcare, Education',
    description: 'Emerging tech hub with universities and healthcare institutions.',
    avgSalary: 62000,
    companies: ['Guy\'s Hospital', 'London South Bank University', 'GiffGaff']
  },
  {
    id: 'workplace-west-london',
    name: 'Hammersmith / West London',
    city: 'London',
    coordinates: { lat: 51.4938, lng: -0.2265 },
    industry: 'Media, Broadcasting, Tech',
    description: 'Broadcasting hub and media production with creative studios.',
    avgSalary: 68000,
    companies: ['Sky', 'Virgin Media', 'BBC', 'Channel 4']
  },
  {
    id: 'workplace-manchester',
    name: 'Manchester City Centre',
    city: 'Manchester',
    coordinates: { lat: 53.4808, lng: -2.2426 },
    industry: 'Tech, Finance, Media',
    description: 'Growing tech hub with fintech and media companies. Lower cost of living than London.',
    avgSalary: 55000,
    companies: ['Boohoo', 'Bet365', 'Matomo', 'Wyzant']
  },
  {
    id: 'workplace-bristol',
    name: 'Bristol City Centre',
    city: 'Bristol',
    coordinates: { lat: 51.4545, lng: -2.6362 },
    industry: 'Tech, Aerospace, Creative',
    description: 'Tech and creative hub with aerospace companies and design agencies.',
    avgSalary: 52000,
    companies: ['Airbus, Rolls Royce', 'Gameworthy', 'The Candle Group', 'MOO']
  },
  {
    id: 'workplace-london-general',
    name: 'Central London (General)',
    city: 'London',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    industry: 'Mixed',
    description: 'Central London as a general commute destination.',
    avgSalary: 70000,
    companies: []
  },
];

export const getWorkplaceById = (id: string): Workplace | undefined => {
  return dummyWorkplaces.find(w => w.id === id);
};

export const getWorkplacesByCity = (city: string): Workplace[] => {
  return dummyWorkplaces.filter(w => w.city === city);
};

export const getWorkplacesByIndustry = (industry: string): Workplace[] => {
  return dummyWorkplaces.filter(w => w.industry.toLowerCase().includes(industry.toLowerCase()));
};

export const calculateDistance = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number => {
  // Simple distance calculation (not exact, but good for dummy data)
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const lon1 = from.lng * Math.PI / 180;
  const lon2 = to.lng * Math.PI / 180;

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  const r = 6371; // Earth's radius in km

  return c * r;
};
