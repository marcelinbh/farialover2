import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValues) => void;
  categories: Array<{ id: number; name: string }>;
}

export interface FilterValues {
  ageMin: number;
  ageMax: number;
  heightMin: number;
  heightMax: number;
  weightMin: number;
  weightMax: number;
  city: string;
  region: string;
  categoryIds: number[];
  isVip: boolean;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  onApplyFilters,
  categories,
}: FilterSidebarProps) {
  const [ageRange, setAgeRange] = useState<number[]>([18, 40]);
  const [heightRange, setHeightRange] = useState<number[]>([150, 180]);
  const [weightRange, setWeightRange] = useState<number[]>([45, 80]);
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isVip, setIsVip] = useState(false);

  const handleApply = () => {
    onApplyFilters({
      ageMin: ageRange[0]!,
      ageMax: ageRange[1]!,
      heightMin: heightRange[0]!,
      heightMax: heightRange[1]!,
      weightMin: weightRange[0]!,
      weightMax: weightRange[1]!,
      city,
      region,
      categoryIds: selectedCategories,
      isVip,
    });
    onClose();
  };

  const handleReset = () => {
    setAgeRange([18, 40]);
    setHeightRange([150, 180]);
    setWeightRange([45, 80]);
    setCity("");
    setRegion("");
    setSelectedCategories([]);
    setIsVip(false);
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-card border-l border-border z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Filtros Avançados</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Fechar filtros"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Idade */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Idade</Label>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{ageRange[0]} anos</span>
              <span>{ageRange[1]} anos</span>
            </div>
            <Slider
              value={ageRange}
              onValueChange={setAgeRange}
              min={18}
              max={60}
              step={1}
              className="w-full"
            />
          </div>

          {/* Altura */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Altura (cm)</Label>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{heightRange[0]} cm</span>
              <span>{heightRange[1]} cm</span>
            </div>
            <Slider
              value={heightRange}
              onValueChange={setHeightRange}
              min={140}
              max={200}
              step={1}
              className="w-full"
            />
          </div>

          {/* Peso */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Peso (kg)</Label>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{weightRange[0]} kg</span>
              <span>{weightRange[1]} kg</span>
            </div>
            <Slider
              value={weightRange}
              onValueChange={setWeightRange}
              min={40}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Cidade */}
          <div className="space-y-3">
            <Label htmlFor="city" className="text-sm font-semibold">
              Cidade
            </Label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Belo Horizonte"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Região */}
          <div className="space-y-3">
            <Label htmlFor="region" className="text-sm font-semibold">
              Região/Bairro
            </Label>
            <input
              id="region"
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Ex: Savassi"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Categorias */}
          {categories.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Categorias</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIP */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="vip"
              checked={isVip}
              onCheckedChange={(checked) => setIsVip(checked as boolean)}
            />
            <Label htmlFor="vip" className="text-sm cursor-pointer">
              Apenas perfis VIP
            </Label>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Limpar
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
