'use client';

import { create } from 'zustand';
import { Neighborhood } from '../data/dummyNeighborhoods';

export interface FindHomeFormState {
  // Location & Workplace
  selectedCity: string;
  selectedWorkplace: string;
  workplaceCoordinates: { lat: number; lng: number } | null;

  // Commute preference
  maxCommuteMins: number;
  commuteType: 'transit' | 'car' | 'bike' | 'walk' | 'flexible';

  // Lifestyle preferences
  preferredScore: number;
  priorityCategories: {
    walkability: number;
    safety: number;
    culture: number;
    greenSpace: number;
    nightlife: number;
    transit: number;
    affordability: number;
    family: number;
  };

  // Demographics
  demographic: 'young_professionals' | 'families' | 'retirees' | 'students' | 'mixed';

  // Budget
  maxHousePrice: number;
  minHousePrice: number;

  // POI preferences
  requiredPOIs: ('parks' | 'pubs' | 'museums' | 'restaurants' | 'gyms' | 'schools')[];
  minPOICount: { [key: string]: number };

  // Map view
  mapCenter: { lat: number; lng: number };
  mapZoom: number;

  // Results
  filteredNeighborhoods: Neighborhood[];
  selectedNeighborhood: Neighborhood | null;
  loading: boolean;
  error: string | null;

  // Form actions
  setSelectedCity: (city: string) => void;
  setSelectedWorkplace: (workplaceId: string, coordinates: { lat: number; lng: number }) => void;
  setMaxCommuteMins: (mins: number) => void;
  setCommuteType: (type: 'transit' | 'car' | 'bike' | 'walk' | 'flexible') => void;
  setPreferredScore: (score: number) => void;
  setPriorityCategory: (category: keyof FindHomeFormState['priorityCategories'], weight: number) => void;
  setDemographic: (demographic: 'young_professionals' | 'families' | 'retirees' | 'students' | 'mixed') => void;
  setMaxHousePrice: (price: number) => void;
  setMinHousePrice: (price: number) => void;
  toggleRequiredPOI: (poi: 'parks' | 'pubs' | 'museums' | 'restaurants' | 'gyms' | 'schools') => void;
  setMinPOICount: (poi: string, count: number) => void;

  // Map actions
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setMapZoom: (zoom: number) => void;

  // Results actions
  setFilteredNeighborhoods: (neighborhoods: Neighborhood[]) => void;
  setSelectedNeighborhood: (neighborhood: Neighborhood | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset
  resetForm: () => void;
}

const defaultPriorities = {
  walkability: 60,
  safety: 80,
  culture: 60,
  greenSpace: 50,
  nightlife: 50,
  transit: 70,
  affordability: 50,
  family: 0,
};

const defaultMapCenter = { lat: 51.5074, lng: -0.1278 };

export const useFindHomeStore = create<FindHomeFormState>((set) => ({
  // Initial state
  selectedCity: 'London',
  selectedWorkplace: 'workplace-kings-cross',
  workplaceCoordinates: { lat: 51.5308, lng: -0.1223 },
  maxCommuteMins: 45,
  commuteType: 'transit',
  preferredScore: 70,
  priorityCategories: defaultPriorities,
  demographic: 'young_professionals',
  maxHousePrice: 800000,
  minHousePrice: 250000,
  requiredPOIs: [],
  minPOICount: {
    parks: 0,
    pubs: 0,
    museums: 0,
    restaurants: 0,
    gyms: 0,
    schools: 0,
  },
  mapCenter: defaultMapCenter,
  mapZoom: 12,
  filteredNeighborhoods: [],
  selectedNeighborhood: null,
  loading: false,
  error: null,

  // Actions
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedWorkplace: (workplaceId, coordinates) =>
    set({ selectedWorkplace: workplaceId, workplaceCoordinates: coordinates }),
  setMaxCommuteMins: (mins) => set({ maxCommuteMins: mins }),
  setCommuteType: (type) => set({ commuteType: type }),
  setPreferredScore: (score) => set({ preferredScore: score }),
  setPriorityCategory: (category, weight) =>
    set((state) => ({
      priorityCategories: {
        ...state.priorityCategories,
        [category]: weight,
      },
    })),
  setDemographic: (demographic) => set({ demographic }),
  setMaxHousePrice: (price) => set({ maxHousePrice: price }),
  setMinHousePrice: (price) => set({ minHousePrice: price }),
  toggleRequiredPOI: (poi) =>
    set((state) => ({
      requiredPOIs: state.requiredPOIs.includes(poi)
        ? state.requiredPOIs.filter((p) => p !== poi)
        : [...state.requiredPOIs, poi],
    })),
  setMinPOICount: (poi, count) =>
    set((state) => ({
      minPOICount: {
        ...state.minPOICount,
        [poi]: count,
      },
    })),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  setFilteredNeighborhoods: (neighborhoods) => set({ filteredNeighborhoods: neighborhoods }),
  setSelectedNeighborhood: (neighborhood) => set({ selectedNeighborhood: neighborhood }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  resetForm: () =>
    set({
      selectedCity: 'London',
      selectedWorkplace: 'workplace-kings-cross',
      workplaceCoordinates: { lat: 51.5308, lng: -0.1223 },
      maxCommuteMins: 45,
      commuteType: 'transit',
      preferredScore: 70,
      priorityCategories: defaultPriorities,
      demographic: 'young_professionals',
      maxHousePrice: 800000,
      minHousePrice: 250000,
      requiredPOIs: [],
      minPOICount: {
        parks: 0,
        pubs: 0,
        museums: 0,
        restaurants: 0,
        gyms: 0,
        schools: 0,
      },
      mapCenter: defaultMapCenter,
      mapZoom: 12,
      filteredNeighborhoods: [],
      selectedNeighborhood: null,
      loading: false,
      error: null,
    }),
}));
