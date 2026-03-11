export interface POI {
  id: string;
  name: string;
  type: 'park' | 'pub' | 'museum' | 'restaurant' | 'gym' | 'school';
  coordinates: { lat: number; lng: number };
  areaId: string;
  rating?: number;
  address?: string;
}

export const dummyPOI: POI[] = [
  // Shoreditch Parks
  { id: 'shoreditch-park-1', name: 'Hoxton Square', type: 'park', coordinates: { lat: 51.5282, lng: -0.0809 }, areaId: 'area-shoreditch', rating: 4.2 },
  { id: 'shoreditch-park-2', name: 'Somerford Grove Park', type: 'park', coordinates: { lat: 51.5244, lng: -0.0769 }, areaId: 'area-shoreditch', rating: 3.8 },
  { id: 'shoreditch-park-3', name: 'Brick Lane Green Space', type: 'park', coordinates: { lat: 51.5219, lng: -0.0744 }, areaId: 'area-shoreditch', rating: 4.1 },

  // Shoreditch Pubs
  { id: 'shoreditch-pub-1', name: 'The Curtain', type: 'pub', coordinates: { lat: 51.5280, lng: -0.0834 }, areaId: 'area-shoreditch', rating: 4.3 },
  { id: 'shoreditch-pub-2', name: 'Caravan Shoreditch', type: 'pub', coordinates: { lat: 51.5265, lng: -0.0853 }, areaId: 'area-shoreditch', rating: 4.1 },
  { id: 'shoreditch-pub-3', name: 'Boxcar Vintage', type: 'pub', coordinates: { lat: 51.5246, lng: -0.0821 }, areaId: 'area-shoreditch', rating: 4.0 },

  // Shoreditch Restaurants
  { id: 'shoreditch-rest-1', name: 'Andina', type: 'restaurant', coordinates: { lat: 51.5289, lng: -0.0824 }, areaId: 'area-shoreditch', rating: 4.5 },
  { id: 'shoreditch-rest-2', name: 'Koya', type: 'restaurant', coordinates: { lat: 51.5273, lng: -0.0839 }, areaId: 'area-shoreditch', rating: 4.3 },
  { id: 'shoreditch-rest-3', name: 'Dishoom', type: 'restaurant', coordinates: { lat: 51.5267, lng: -0.0818 }, areaId: 'area-shoreditch', rating: 4.4 },

  // Shoreditch Gyms
  { id: 'shoreditch-gym-1', name: 'Fitness First Shoreditch', type: 'gym', coordinates: { lat: 51.5256, lng: -0.0843 }, areaId: 'area-shoreditch', rating: 4.1 },
  { id: 'shoreditch-gym-2', name: 'Third Space Shoreditch', type: 'gym', coordinates: { lat: 51.5271, lng: -0.0798 }, areaId: 'area-shoreditch', rating: 4.4 },

  // Shoreditch Museums
  { id: 'shoreditch-museum-1', name: 'Old Operating Theatre', type: 'museum', coordinates: { lat: 51.5055, lng: -0.0820 }, areaId: 'area-shoreditch', rating: 4.2 },

  // Shoreditch Schools
  { id: 'shoreditch-school-1', name: 'Hoxton Primary School', type: 'school', coordinates: { lat: 51.5301, lng: -0.0834 }, areaId: 'area-shoreditch' },
  { id: 'shoreditch-school-2', name: 'Hoxton Hall', type: 'school', coordinates: { lat: 51.5284, lng: -0.0826 }, areaId: 'area-shoreditch' },

  // Clapham Parks
  { id: 'clapham-park-1', name: 'Clapham Common', type: 'park', coordinates: { lat: 51.4636, lng: -0.1544 }, areaId: 'area-clapham', rating: 4.6 },
  { id: 'clapham-park-2', name: 'Windmill Park', type: 'park', coordinates: { lat: 51.4601, lng: -0.1518 }, areaId: 'area-clapham', rating: 4.1 },
  { id: 'clapham-park-3', name: 'Tooting Bec Common', type: 'park', coordinates: { lat: 51.4294, lng: -0.1625 }, areaId: 'area-clapham', rating: 4.3 },

  // Clapham Pubs
  { id: 'clapham-pub-1', name: 'The Polygon Bar', type: 'pub', coordinates: { lat: 51.4625, lng: -0.1532 }, areaId: 'area-clapham', rating: 4.2 },
  { id: 'clapham-pub-2', name: 'Clapham Picturehouse', type: 'pub', coordinates: { lat: 51.4618, lng: -0.1548 }, areaId: 'area-clapham', rating: 4.0 },
  { id: 'clapham-pub-3', name: 'The Bolingbroke', type: 'pub', coordinates: { lat: 51.4642, lng: -0.1623 }, areaId: 'area-clapham', rating: 4.1 },

  // Clapham Restaurants
  { id: 'clapham-rest-1', name: 'Tsunami Sushi', type: 'restaurant', coordinates: { lat: 51.4631, lng: -0.1539 }, areaId: 'area-clapham', rating: 4.3 },
  { id: 'clapham-rest-2', name: 'Buona Sera', type: 'restaurant', coordinates: { lat: 51.4628, lng: -0.1551 }, areaId: 'area-clapham', rating: 4.2 },

  // Wimbledon Parks
  { id: 'wimbledon-park-1', name: 'Wimbledon Common', type: 'park', coordinates: { lat: 51.4256, lng: -0.2098 }, areaId: 'area-wimbledon', rating: 4.7 },
  { id: 'wimbledon-park-2', name: 'Wimbledon Park Lake', type: 'park', coordinates: { lat: 51.4188, lng: -0.2057 }, areaId: 'area-wimbledon', rating: 4.4 },

  // Islington Parks
  { id: 'islington-park-1', name: 'Canonbury Park', type: 'park', coordinates: { lat: 51.5414, lng: -0.1064 }, areaId: 'area-islington', rating: 4.1 },
  { id: 'islington-park-2', name: 'Clissold Park', type: 'park', coordinates: { lat: 51.5512, lng: -0.1016 }, areaId: 'area-islington', rating: 4.3 },

  // Islington Restaurants
  { id: 'islington-rest-1', name: 'Lilia', type: 'restaurant', coordinates: { lat: 51.5417, lng: -0.1028 }, areaId: 'area-islington', rating: 4.4 },
  { id: 'islington-rest-2', name: 'The Draper\'s Arms', type: 'restaurant', coordinates: { lat: 51.5395, lng: -0.1048 }, areaId: 'area-islington', rating: 4.2 },

  // Bethnal Green Parks
  { id: 'bethnal-green-park-1', name: 'Bethnal Green Gardens', type: 'park', coordinates: { lat: 51.5249, lng: -0.0571 }, areaId: 'area-bethnal-green', rating: 4.0 },
  { id: 'bethnal-green-park-2', name: 'Hackney Marsh', type: 'park', coordinates: { lat: 51.5499, lng: -0.0529 }, areaId: 'area-bethnal-green', rating: 4.2 },

  // Brixton Parks
  { id: 'brixton-park-1', name: 'Brockwell Park', type: 'park', coordinates: { lat: 51.4680, lng: -0.1135 }, areaId: 'area-brixton', rating: 4.5 },
  { id: 'brixton-park-2', name: 'Archbishop Park', type: 'park', coordinates: { lat: 51.4540, lng: -0.1198 }, areaId: 'area-brixton', rating: 4.1 },

  // Brixton Restaurants
  { id: 'brixton-rest-1', name: 'Satay House', type: 'restaurant', coordinates: { lat: 51.4625, lng: -0.1165 }, areaId: 'area-brixton', rating: 4.3 },
  { id: 'brixton-rest-2', name: 'Kaosarn', type: 'restaurant', coordinates: { lat: 51.4618, lng: -0.1152 }, areaId: 'area-brixton', rating: 4.2 },

  // King's Cross Parks
  { id: 'kings-cross-park-1', name: 'Regent\'s Canal Path', type: 'park', coordinates: { lat: 51.5328, lng: -0.1203 }, areaId: 'area-king-cross', rating: 4.3 },
  { id: 'kings-cross-park-2', name: 'Gasholder Park', type: 'park', coordinates: { lat: 51.5340, lng: -0.1240 }, areaId: 'area-king-cross', rating: 4.0 },

  // Camden Parks
  { id: 'camden-park-1', name: 'Hampstead Heath', type: 'park', coordinates: { lat: 51.5637, lng: -0.1359 }, areaId: 'area-camden', rating: 4.7 },
  { id: 'camden-park-2', name: 'Regent\'s Park', type: 'park', coordinates: { lat: 51.5278, lng: -0.1447 }, areaId: 'area-camden', rating: 4.6 },

  // Hackney Parks
  { id: 'hackney-park-1', name: 'Hackney Marshes', type: 'park', coordinates: { lat: 51.5499, lng: -0.0529 }, areaId: 'area-hackney', rating: 4.2 },
  { id: 'hackney-park-2', name: 'Springfield Park', type: 'park', coordinates: { lat: 51.5551, lng: -0.0587 }, areaId: 'area-hackney', rating: 4.0 },

  // Putney Parks
  { id: 'putney-park-1', name: 'Putney Heath', type: 'park', coordinates: { lat: 51.4649, lng: -0.2198 }, areaId: 'area-putney', rating: 4.4 },
  { id: 'putney-park-2', name: 'Dukes Meadows', type: 'park', coordinates: { lat: 51.4570, lng: -0.2231 }, areaId: 'area-putney', rating: 4.1 },

  // Manchester City Centre Parks
  { id: 'manchester-park-1', name: 'Castlefield Urban Park', type: 'park', coordinates: { lat: 53.4763, lng: -2.2527 }, areaId: 'area-manchester-centre', rating: 4.3 },
  { id: 'manchester-park-2', name: 'Piccadilly Gardens', type: 'park', coordinates: { lat: 53.4828, lng: -2.2354 }, areaId: 'area-manchester-centre', rating: 4.1 },

  // Manchester Restaurants
  { id: 'manchester-rest-1', name: 'Where The Light Gets In', type: 'restaurant', coordinates: { lat: 53.4823, lng: -2.2445 }, areaId: 'area-manchester-centre', rating: 4.4 },
  { id: 'manchester-rest-2', name: 'The Mark Addy', type: 'restaurant', coordinates: { lat: 53.4759, lng: -2.2544 }, areaId: 'area-manchester-centre', rating: 4.3 },

  // Bristol Clifton Parks
  { id: 'bristol-park-1', name: 'Brandon Hill Park', type: 'park', coordinates: { lat: 51.4569, lng: -2.5973 }, areaId: 'area-bristol-clifton', rating: 4.5 },
  { id: 'bristol-park-2', name: 'Ashton Court Estate', type: 'park', coordinates: { lat: 51.4608, lng: -2.6341 }, areaId: 'area-bristol-clifton', rating: 4.6 },

  // Bristol Restaurants
  { id: 'bristol-rest-1', name: 'The Canteen', type: 'restaurant', coordinates: { lat: 51.4545, lng: -2.6302 }, areaId: 'area-bristol-clifton', rating: 4.3 },
  { id: 'bristol-rest-2', name: 'Root', type: 'restaurant', coordinates: { lat: 51.4556, lng: -2.6325 }, areaId: 'area-bristol-clifton', rating: 4.2 },
];

export const getPOIsByAreaId = (areaId: string): POI[] => {
  return dummyPOI.filter(poi => poi.areaId === areaId);
};

export const getPOIsByType = (type: POI['type']): POI[] => {
  return dummyPOI.filter(poi => poi.type === type);
};

export const getPOIsByAreaAndType = (areaId: string, type: POI['type']): POI[] => {
  return dummyPOI.filter(poi => poi.areaId === areaId && poi.type === type);
};
