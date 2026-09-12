import React, { useState } from "react";
import { LocationOption } from "../types";
import { LOCATIONS_LIST } from "../data/locationsAndDestinations";
import { X, MapPin, Check, Search, Globe, Compass } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: LocationOption;
  onSelectLocation: (loc: LocationOption) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}) => {
  const [filterQuery, setFilterQuery] = useState("");

  if (!isOpen) return null;

  const filtered = LOCATIONS_LIST.filter(
    (l) =>
      l.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Selecionar Localização
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Personalize os resultados para a sua província ou cidade
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Pesquisar cidade ou província (ex: Maputo, Beira, Nampula)..."
            className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        {/* Location List */}
        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
          {filtered.map((loc) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-xs"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {loc.id === "world" ? (
                    <Globe className="w-4 h-4 shrink-0" />
                  ) : (
                    <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? "text-zinc-950" : "text-amber-500"}`} />
                  )}
                  <div>
                    <span className="text-xs font-semibold block">{loc.name}</span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? "text-zinc-900 opacity-80" : "text-zinc-400"
                      }`}
                    >
                      {loc.region} • {loc.country}
                    </span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
          <span>Localização atual: <strong className="text-zinc-700 dark:text-zinc-200">{selectedLocation.name}</strong></span>
          <button
            onClick={() => {
              onSelectLocation(LOCATIONS_LIST[0]);
              onClose();
            }}
            className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
          >
            Redefinir
          </button>
        </div>
      </div>
    </div>
  );
};
