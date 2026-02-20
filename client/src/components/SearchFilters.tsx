import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SearchFiltersProps {
  onSearch: (filters: FilterValues) => void;
}

export interface FilterValues {
  searchTerm: string;
  city: string;
  ageMin: number;
  ageMax: number;
  bodyType: string;
  services: string[];
  priceMin: number;
  priceMax: number;
}

const CITIES = [
  "Todas as cidades",
  "Belo Horizonte",
  "São Paulo",
  "Rio de Janeiro",
  "Brasília",
  "Curitiba",
  "Porto Alegre",
  "Salvador",
  "Fortaleza",
  "Recife",
];

const BODY_TYPES = [
  "Todos os tipos",
  "Magra",
  "Atlética",
  "Curvilínea",
  "Plus Size",
];

const SERVICES = [
  "Acompanhamento",
  "Jantar",
  "Eventos",
  "Viagens",
  "Massagem",
  "Pernoite",
];

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("Todas as cidades");
  const [ageRange, setAgeRange] = useState([18, 50]);
  const [bodyType, setBodyType] = useState("Todos os tipos");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    onSearch({
      searchTerm,
      city: city === "Todas as cidades" ? "" : city,
      ageMin: ageRange[0],
      ageMax: ageRange[1],
      bodyType: bodyType === "Todos os tipos" ? "" : bodyType,
      services: selectedServices,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCity("Todas as cidades");
    setAgeRange([18, 50]);
    setBodyType("Todos os tipos");
    setSelectedServices([]);
    setPriceRange([0, 5000]);
    onSearch({
      searchTerm: "",
      city: "",
      ageMin: 18,
      ageMax: 50,
      bodyType: "",
      services: [],
      priceMin: 0,
      priceMax: 5000,
    });
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const activeFiltersCount = [
    city !== "Todas as cidades",
    ageRange[0] !== 18 || ageRange[1] !== 50,
    bodyType !== "Todos os tipos",
    selectedServices.length > 0,
    priceRange[0] !== 0 || priceRange[1] !== 5000,
  ].filter(Boolean).length;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-black/50 border-border text-white placeholder:text-muted-foreground"
        />
      </div>

      {/* Advanced Filters Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="relative border-border bg-black/50 hover:bg-black/70 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
          >
            <SlidersHorizontal size={16} className="sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-primary text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-black border-border p-4 sm:p-6">
          <SheetHeader>
            <SheetTitle className="text-white text-base sm:text-lg">Filtros Avançados</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            {/* City Filter */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-white text-xs sm:text-sm">Cidade</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="bg-black/50 border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-border">
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-white">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Age Range */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-white text-xs sm:text-sm">
                Idade: {ageRange[0]} - {ageRange[1]} anos
              </Label>
              <Slider
                value={ageRange}
                onValueChange={setAgeRange}
                min={18}
                max={50}
                step={1}
                className="py-4"
              />
            </div>

            {/* Body Type */}
            <div className="space-y-2">
              <Label className="text-white">Biotipo</Label>
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger className="bg-black/50 border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-border">
                  {BODY_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <Label className="text-white">Serviços</Label>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedServices.includes(service)
                        ? "bg-primary text-white"
                        : "bg-black/50 text-muted-foreground border border-border hover:border-primary"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label className="text-white">
                Cachê: R$ {priceRange[0]} - R$ {priceRange[1]}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={5000}
                step={100}
                className="py-4"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 border-border hover:bg-black/70"
              >
                <X size={16} className="mr-2" />
                Limpar
              </Button>
              <Button
                onClick={handleSearch}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Search size={16} className="mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
