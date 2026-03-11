'use client';

import { dummyWorkplaces } from '@/lib/data/dummyWorkplaces';
import { useFindHomeStore } from '@/lib/stores/useFindHomeStore';

export default function WorkplaceSelector() {
  const { selectedWorkplace, selectedCity, setSelectedWorkplace, setSelectedCity } = useFindHomeStore();

  const cities = Array.from(new Set(dummyWorkplaces.map((w) => w.city))).sort();
  const workplacesInCity = dummyWorkplaces.filter((w) => w.city === selectedCity);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-white mb-2">City</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            const firstInCity = dummyWorkplaces.find((w) => w.city === e.target.value);
            if (firstInCity) {
              setSelectedWorkplace(firstInCity.id, firstInCity.coordinates);
            }
          }}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-2">Workplace</label>
        <select
          value={selectedWorkplace}
          onChange={(e) => {
            const workplace = dummyWorkplaces.find((w) => w.id === e.target.value);
            if (workplace) {
              setSelectedWorkplace(workplace.id, workplace.coordinates);
            }
          }}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          {workplacesInCity.map((workplace) => (
            <option key={workplace.id} value={workplace.id}>
              {workplace.name} • {workplace.industry}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          <strong>Avg Salary:</strong> £{dummyWorkplaces.find((w) => w.id === selectedWorkplace)?.avgSalary.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
