// GeoJSON isochrone (commute time zone) geometries
// Each isochrone represents a polygon of areas reachable within a certain time

export interface Polygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface Isochrone {
  id: string;
  workplaceId: string;
  neighborhoodId: string;
  commuteMins: number;
  geometry: Polygon;
}

export const dummyIsochrones: Isochrone[] = [
  // King's Cross (Central London) - 15 min isochrone
  {
    id: 'isochrone-kc-15',
    workplaceId: 'workplace-kings-cross',
    neighborhoodId: 'king-cross',
    commuteMins: 15,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.1223, 51.5308], [-0.1100, 51.5400], [-0.1050, 51.5350],
        [-0.1150, 51.5250], [-0.1250, 51.5200], [-0.1350, 51.5250],
        [-0.1320, 51.5350], [-0.1223, 51.5308]
      ]]
    }
  },
  // King's Cross - 30 min isochrone
  {
    id: 'isochrone-kc-30',
    workplaceId: 'workplace-kings-cross',
    neighborhoodId: 'camden',
    commuteMins: 30,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.1426, 51.5390], [-0.1200, 51.5600], [-0.0900, 51.5450],
        [-0.0750, 51.5150], [-0.1100, 51.4950], [-0.1450, 51.5050],
        [-0.1426, 51.5390]
      ]]
    }
  },
  // King's Cross - 45 min isochrone
  {
    id: 'isochrone-kc-45',
    workplaceId: 'workplace-kings-cross',
    neighborhoodId: 'islington',
    commuteMins: 45,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.1031, 51.5425], [-0.0500, 51.5700], [-0.0200, 51.5300],
        [0.0100, 51.4800], [-0.0500, 51.4500], [-0.1200, 51.4600],
        [-0.1031, 51.5425]
      ]]
    }
  },
  // City of London (Canary Wharf) - 20 min isochrone
  {
    id: 'isochrone-cl-20',
    workplaceId: 'workplace-canary-wharf',
    neighborhoodId: 'bethnal-green',
    commuteMins: 20,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.0581, 51.5233], [-0.0400, 51.5350], [-0.0200, 51.5250],
        [0.0000, 51.5000], [-0.0400, 51.4900], [-0.0700, 51.5050],
        [-0.0581, 51.5233]
      ]]
    }
  },
  // City of London - 35 min isochrone
  {
    id: 'isochrone-cl-35',
    workplaceId: 'workplace-canary-wharf',
    neighborhoodId: 'hackney',
    commuteMins: 35,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.0591, 51.5456], [-0.0200, 51.5700], [0.0100, 51.5400],
        [0.0200, 51.5000], [-0.0200, 51.4700], [-0.0800, 51.4900],
        [-0.0591, 51.5456]
      ]]
    }
  },
  // Shoreditch - 10 min isochrone (local)
  {
    id: 'isochrone-shoreditch-10',
    workplaceId: 'workplace-shoreditch',
    neighborhoodId: 'shoreditch',
    commuteMins: 10,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.0842, 51.5263], [-0.0750, 51.5330], [-0.0650, 51.5280],
        [-0.0720, 51.5200], [-0.0842, 51.5263]
      ]]
    }
  },
  // South London hub - 25 min isochrone
  {
    id: 'isochrone-south-25',
    workplaceId: 'workplace-south-london',
    neighborhoodId: 'clapham',
    commuteMins: 25,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.1543, 51.4614], [-0.1300, 51.4800], [-0.1000, 51.4700],
        [-0.0900, 51.4400], [-0.1300, 51.4300], [-0.1543, 51.4614]
      ]]
    }
  },
  // South London hub - 40 min isochrone
  {
    id: 'isochrone-south-40',
    workplaceId: 'workplace-south-london',
    neighborhoodId: 'brixton',
    commuteMins: 40,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.1159, 51.4616], [-0.0800, 51.4900], [-0.0400, 51.4700],
        [-0.0300, 51.4200], [-0.1000, 51.4100], [-0.1159, 51.4616]
      ]]
    }
  },
  // West London (Putney/Wimbledon) - 35 min isochrone
  {
    id: 'isochrone-west-35',
    workplaceId: 'workplace-west-london',
    neighborhoodId: 'putney',
    commuteMins: 35,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.2189, 51.4540], [-0.1900, 51.4800], [-0.1600, 51.4700],
        [-0.1700, 51.4300], [-0.2000, 51.4200], [-0.2189, 51.4540]
      ]]
    }
  },
  // West London - 50 min isochrone
  {
    id: 'isochrone-west-50',
    workplaceId: 'workplace-west-london',
    neighborhoodId: 'wimbledon',
    commuteMins: 50,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-0.2078, 51.4195], [-0.1700, 51.4500], [-0.1300, 51.4400],
        [-0.1200, 51.3900], [-0.1600, 51.3800], [-0.2078, 51.4195]
      ]]
    }
  },
  // Manchester City Centre - 15 min isochrone
  {
    id: 'isochrone-manchester-15',
    workplaceId: 'workplace-manchester',
    neighborhoodId: 'central-manchester',
    commuteMins: 15,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-2.2426, 53.4808], [-2.2200, 53.4950], [-2.2000, 53.4850],
        [-2.2100, 53.4650], [-2.2426, 53.4808]
      ]]
    }
  },
  // Manchester - 30 min isochrone
  {
    id: 'isochrone-manchester-30',
    workplaceId: 'workplace-manchester',
    neighborhoodId: 'central-manchester',
    commuteMins: 30,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-2.2426, 53.4808], [-2.1900, 53.5100], [-2.1600, 53.4850],
        [-2.1700, 53.4500], [-2.2200, 53.4400], [-2.2426, 53.4808]
      ]]
    }
  },
  // Bristol City Centre - 20 min isochrone
  {
    id: 'isochrone-bristol-20',
    workplaceId: 'workplace-bristol',
    neighborhoodId: 'bristol-clifton',
    commuteMins: 20,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-2.6362, 51.4545], [-2.6100, 51.4700], [-2.5900, 51.4600],
        [-2.6000, 51.4400], [-2.6362, 51.4545]
      ]]
    }
  },
  // Bristol - 35 min isochrone
  {
    id: 'isochrone-bristol-35',
    workplaceId: 'workplace-bristol',
    neighborhoodId: 'bristol-clifton',
    commuteMins: 35,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [-2.6362, 51.4545], [-2.5800, 51.4800], [-2.5500, 51.4600],
        [-2.5700, 51.4200], [-2.6200, 51.4100], [-2.6362, 51.4545]
      ]]
    }
  },
];

export const getIsochrones = (workplaceId: string): Isochrone[] => {
  return dummyIsochrones.filter(iso => iso.workplaceId === workplaceId);
};

export const getIsochroneByTime = (workplaceId: string, commuteMins: number): Isochrone | undefined => {
  return dummyIsochrones.find(iso => iso.workplaceId === workplaceId && iso.commuteMins === commuteMins);
};
