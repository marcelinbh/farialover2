import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterValues {
  name?: string;
  city?: string;
  minAge?: number;
  maxAge?: number;
  hairColor?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FilterValues) => void;
  onClearFilters: () => void;
}

export default function AdvancedFilters({ onApplyFilters, onClearFilters }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    onClearFilters();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Botão para abrir filtros */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="gap-2"
      >
        <SlidersHorizontal size={18} />
        Filtros Avançados
      </Button>

      {/* Modal de filtros */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Painel de filtros */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-lg p-6 z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Filtros Avançados</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Buscar por nome..."
                  value={filters.name || ''}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>

              {/* Cidade */}
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Select
                  value={filters.city || ''}
                  onValueChange={(value) => setFilters({ ...filters, city: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as cidades</SelectItem>
                    <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                    <SelectItem value="São Paulo">São Paulo</SelectItem>
                    <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="Curitiba">Curitiba</SelectItem>
                    <SelectItem value="Porto Alegre">Porto Alegre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Idade mínima */}
              <div>
                <Label htmlFor="minAge">Idade mínima</Label>
                <Input
                  id="minAge"
                  type="number"
                  placeholder="18"
                  min="18"
                  max="100"
                  value={filters.minAge || ''}
                  onChange={(e) => setFilters({ ...filters, minAge: parseInt(e.target.value) || undefined })}
                />
              </div>

              {/* Idade máxima */}
              <div>
                <Label htmlFor="maxAge">Idade máxima</Label>
                <Input
                  id="maxAge"
                  type="number"
                  placeholder="50"
                  min="18"
                  max="100"
                  value={filters.maxAge || ''}
                  onChange={(e) => setFilters({ ...filters, maxAge: parseInt(e.target.value) || undefined })}
                />
              </div>

              {/* Cor do cabelo */}
              <div>
                <Label htmlFor="hairColor">Cor do cabelo</Label>
                <Select
                  value={filters.hairColor || ''}
                  onValueChange={(value) => setFilters({ ...filters, hairColor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Loiro">Loiro</SelectItem>
                    <SelectItem value="Moreno">Moreno</SelectItem>
                    <SelectItem value="Ruivo">Ruivo</SelectItem>
                    <SelectItem value="Preto">Preto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de corpo */}
              <div>
                <Label htmlFor="bodyType">Tipo de corpo</Label>
                <Select
                  value={filters.bodyType || ''}
                  onValueChange={(value) => setFilters({ ...filters, bodyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Magra">Magra</SelectItem>
                    <SelectItem value="Atlética">Atlética</SelectItem>
                    <SelectItem value="Curvilínea">Curvilínea</SelectItem>
                    <SelectItem value="Plus Size">Plus Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preço mínimo */}
              <div>
                <Label htmlFor="minPrice">Preço mínimo (R$/hora)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="100"
                  min="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) || undefined })}
                />
              </div>

              {/* Preço máximo */}
              <div>
                <Label htmlFor="maxPrice">Preço máximo (R$/hora)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="1000"
                  min="0"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || undefined })}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <Button onClick={handleApply} className="flex-1">
                Aplicar Filtros
              </Button>
              <Button onClick={handleClear} variant="outline" className="flex-1">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
