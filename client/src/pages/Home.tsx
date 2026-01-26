import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";
import FilterSidebar, { FilterValues } from "@/components/FilterSidebar";
import TestimonialsSection from "@/components/TestimonialsSection";
import { ChevronLeft, ChevronRight, MapPin, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<Partial<FilterValues>>({});
  
  const { data: profiles = [], isLoading } = trpc.profiles.list.useQuery({
    search: searchTerm || undefined,
    ...filters,
  });

  const { data: featuredProfiles = [] } = trpc.profiles.list.useQuery({
    isFeatured: true,
  });

  const { data: categories = [] } = trpc.categories.list.useQuery();

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (featuredProfiles.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % featuredProfiles.length);
    }
  };

  const prevSlide = () => {
    if (featuredProfiles.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + featuredProfiles.length) % featuredProfiles.length);
    }
  };

  // Função para obter categorias de um perfil
  const getProfileCategories = (profileId: number) => {
    // TODO: Implementar query para buscar categorias do perfil
    return [];
  };

  const handleApplyFilters = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Espaçamento para header fixo */}
      <div className="h-20 md:h-24"></div>

      {/* Banner/Slider Principal */}
      {featuredProfiles.length > 0 && (
        <section className="relative h-[450px] md:h-[550px] overflow-hidden">
          {featuredProfiles.map((profile, index) => (
            <Link
              key={profile.id}
              href={`/perfil/${profile.id}`}
              className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={profile.photoUrl || '/placeholder-profile.jpg'}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/30 to-black/80"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="container">
                  <h2 className="text-4xl md:text-5xl font-bold mb-2">{profile.name}</h2>
                  <p className="text-xl mb-1">{profile.age} anos</p>
                  {profile.height && profile.weight && (
                    <p className="text-lg mb-2">{profile.height} m, {profile.weight} kg</p>
                  )}
                  <p className="text-lg mb-4">{profile.city} - {profile.region}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(`https://wa.me/${profile.phone.replace(/\D/g, '')}`, '_blank');
                    }}
                    className="inline-block btn-gradient px-6 py-3 rounded-md hover:scale-105 transition-transform"
                  >
                    {profile.phone}
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {/* Navegação do Slider */}
          {featuredProfiles.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </section>
      )}

      {/* Stories */}
      <section className="py-8 bg-card/50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-4 gradient-text">STORIES</h2>
          <div className="stories-container">
            {profiles.slice(0, 20).map((profile) => (
              <Link
                key={profile.id}
                href={`/perfil/${profile.id}`}
                className="story-item"
              >
                <img
                  src={profile.photoUrl || '/placeholder-profile.jpg'}
                  alt={profile.name}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-6 bg-card/30">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => setFilterSidebarOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <SlidersHorizontal size={18} />
              Filtros Avançados
            </Button>
          </div>
        </div>
      </section>

      {/* Seção VIP */}
      {profiles.filter(p => p.isVip).length > 0 && (
        <section className="py-12">
          <div className="container">
            <h2 className="text-3xl font-bold mb-6 gradient-text">VIP'S</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles.filter(p => p.isVip).map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  categories={getProfileCategories(profile.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Listagem      {/* Depoimentos em Destaque */}
      <TestimonialsSection />

      {/* Todos os Perfis */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold gradient-text">TODOS OS PERFIS</h2>        <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={20} />
              <span>{profiles.length} perfis encontrados</span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Carregando perfis...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">Nenhum perfil encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  categories={getProfileCategories(profile.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FilterSidebar */}
      <FilterSidebar
        isOpen={filterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
        onApplyFilters={handleApplyFilters}
        categories={categories}
      />

      {/* Footer */}
      <footer className="bg-card py-8 border-t border-border">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 farialover. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
