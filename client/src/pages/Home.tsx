import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Phone, Share2, Star } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import StoryModal from "@/components/StoryModal";
import SearchFilters, { FilterValues } from "@/components/SearchFilters";
import { useLocation } from "wouter";

export default function Home() {
  const { data: profiles, isLoading } = trpc.profiles.list.useQuery();
  const [heroIndex, setHeroIndex] = useState(0);
  const [storiesStart, setStoriesStart] = useState(0);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<FilterValues>({
    searchTerm: "",
    city: "",
    ageMin: 18,
    ageMax: 50,
    bodyType: "",
    services: [],
    priceMin: 0,
    priceMax: 5000,
  });

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!profiles || profiles.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % profiles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [profiles]);

  // Reset heroIndex when filters change
  useEffect(() => {
    setHeroIndex(0);
  }, [filters]);

  // Filter profiles based on search criteria
  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    
    return profiles.filter((profile) => {
      // Search term filter
      if (filters.searchTerm && !profile.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // City filter
      if (filters.city && profile.city !== filters.city) {
        return false;
      }
      
      // Age filter
      if (profile.age < filters.ageMin || profile.age > filters.ageMax) {
        return false;
      }
      
      // Body type filter
      if (filters.bodyType && profile.body_type !== filters.bodyType) {
        return false;
      }
      
      return true;
    });
  }, [profiles, filters]);

  const displayProfiles = filteredProfiles.length > 0 ? filteredProfiles : profiles || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-foreground">Carregando...</div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-foreground">Nenhum perfil encontrado</div>
      </div>
    );
  }

  const heroProfile = displayProfiles[heroIndex % displayProfiles.length];
  const heroPhoto = heroProfile?.photos[0]?.url || "";
  const storiesPerPage = 12;
  const visibleStories = displayProfiles.slice(storiesStart, storiesStart + storiesPerPage);

  const nextHero = () => {
    setHeroIndex((prev) => (prev + 1) % displayProfiles.length);
  };

  const prevHero = () => {
    setHeroIndex((prev) => (prev - 1 + displayProfiles.length) % displayProfiles.length);
  };

  const nextStories = () => {
    if (storiesStart + storiesPerPage < displayProfiles.length) {
      setStoriesStart(storiesStart + storiesPerPage);
    }
  };

  const prevStories = () => {
    if (storiesStart > 0) {
      setStoriesStart(Math.max(0, storiesStart - storiesPerPage));
    }
  };

  const handleSearch = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setHeroIndex(0);
    setStoriesStart(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029969419/HlWSCrNFRUWDTqJt.png" alt="Farialover" className="h-20" />
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">HOME</a>
              <a href="#modelos" className="text-foreground hover:text-primary transition-colors font-medium">MODELOS</a>
              <a href="#cidades" className="text-foreground hover:text-primary transition-colors font-medium">CIDADES</a>
              <a href="#videos" className="text-foreground hover:text-primary transition-colors font-medium">VÍDEOS</a>
              <a href="#audios" className="text-foreground hover:text-primary transition-colors font-medium">ÁUDIOS</a>
            </nav>

            {/* Social + CTA */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6">
                ANUNCIE AQUI
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center justify-center pb-4">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="relative h-[650px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-black cursor-pointer"
          onClick={() => setLocation(`/perfil/${heroProfile?.id}`)}
        >
          <img
            key={heroIndex}
            src={heroPhoto}
            alt={heroProfile?.name}
            className="w-full h-full object-contain transition-opacity duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-4 flex items-start pt-24 pointer-events-none">
          <div className="w-[280px] bg-black/75 backdrop-blur-md p-5 rounded-md">
            {/* Tag de Destaque */}
            {heroProfile?.highlight_tag && (
              <div className="inline-block mb-4">
                <span className="bg-black text-primary border-2 border-primary px-4 py-1 text-sm font-bold">
                  {heroProfile.highlight_tag}
                </span>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-secondary text-secondary" />
              ))}
            </div>

            {/* Name */}
            <h2 className="text-5xl font-bold text-white mb-3">{heroProfile?.name}</h2>

            {/* Info */}
            <div className="text-white space-y-1 mb-4">
              <p className="text-lg">{heroProfile?.age} anos</p>
              <p className="text-lg">{heroProfile?.height} m, {heroProfile?.weight} kg</p>
              <p className="text-lg">{heroProfile?.city}</p>
              {heroProfile?.neighborhood && (
                <p className="text-lg">{heroProfile.neighborhood}</p>
              )}
              <p className="flex items-center text-lg">
                <Phone size={18} className="mr-2" />
                {heroProfile?.phone}
              </p>
            </div>

            {/* Share Button */}
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Share2 size={18} className="mr-2" />
              Compartilhe
            </Button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHeroIndex((prev) => (prev - 1 + (profiles?.length || 1)) % (profiles?.length || 1));
          }}
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-10 backdrop-blur-sm pointer-events-auto"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHeroIndex((prev) => (prev + 1) % (profiles?.length || 1));
          }}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-10 backdrop-blur-sm pointer-events-auto"
        >
          <ChevronRight size={28} />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 pointer-events-auto">
          {profiles.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setHeroIndex(index);
              }}
              className={`transition-all ${
                index === heroIndex
                  ? 'w-8 h-2 bg-primary'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              } rounded-full`}
              aria-label={`Ir para perfil ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            STORIES <span className="text-primary">BELO HORIZONTE</span>
          </h3>

          <div className="relative">
            <div className="flex items-center justify-center space-x-6 overflow-hidden">
              {visibleStories.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => {
                    const index = displayProfiles.findIndex(p => p.id === profile.id);
                    setSelectedStoryIndex(index);
                    setStoryModalOpen(true);
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-24 h-24 rounded-full border-4 border-primary p-1 mb-2 group-hover:border-secondary transition-colors">
                    <img
                      src={profile.photos[0]?.url || ""}
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-foreground text-center">{profile.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>

            {/* Stories Navigation */}
            {storiesStart > 0 && (
              <button
                onClick={prevStories}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2 rounded-full"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            {storiesStart + storiesPerPage < displayProfiles.length && (
              <button
                onClick={nextStories}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2 rounded-full"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* VIP's Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            VIP'S <span className="text-primary">BELO HORIZONTE</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayProfiles.map((profile) => (
              <Card
                key={profile.id}
                onClick={() => window.location.href = `/perfil/${profile.id}`}
                className="bg-card border-2 border-primary hover:border-secondary transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-2"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={profile.photos[0]?.url || ""}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {profile.highlight_tag && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-black text-primary border border-primary px-2 py-1 text-xs font-bold">
                        {profile.highlight_tag}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h4 className="font-bold text-foreground mb-1">{profile.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center justify-center">
                    <Phone size={14} className="mr-1" />
                    {profile.phone}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Novidades Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            NOVIDADES <span className="text-primary">BELO HORIZONTE</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayProfiles.slice(0, 5).map((profile) => (
              <Card
                key={profile.id}
                onClick={() => setLocation(`/perfil/${profile.id}`)}
                className="bg-card border-2 border-primary hover:border-secondary transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-2"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={profile.photos[0]?.url || ""}
                    alt={profile.name}
                    className="w-full h-full object-contain bg-black"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary text-white px-2 py-1 text-xs font-bold">
                      NOVO
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center">
                  <h4 className="font-bold text-foreground mb-1">{profile.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center justify-center">
                    <Phone size={14} className="mr-1" />
                    {profile.phone}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mais Visitadas Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            MAIS VISITADAS <span className="text-primary">BELO HORIZONTE</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayProfiles.slice(0, 5).map((profile) => (
              <Card
                key={profile.id}
                onClick={() => setLocation(`/perfil/${profile.id}`)}
                className="bg-card border-2 border-secondary hover:border-primary transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-2"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={profile.photos[0]?.url || ""}
                    alt={profile.name}
                    className="w-full h-full object-contain bg-black"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-secondary text-white px-2 py-1 text-xs font-bold">
                      TOP
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center">
                  <h4 className="font-bold text-foreground mb-1">{profile.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center justify-center">
                    <Phone size={14} className="mr-1" />
                    {profile.phone}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques da Semana Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            DESTAQUES DA SEMANA <span className="text-primary">BELO HORIZONTE</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayProfiles.slice(0, 5).map((profile) => (
              <Card
                key={profile.id}
                onClick={() => setLocation(`/perfil/${profile.id}`)}
                className="bg-card border-2 border-primary hover:border-secondary transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-2"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={profile.photos[0]?.url || ""}
                    alt={profile.name}
                    className="w-full h-full object-contain bg-black"
                  />
                  {profile.highlight_tag && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-black text-primary border border-primary px-2 py-1 text-xs font-bold">
                        {profile.highlight_tag}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h4 className="font-bold text-foreground mb-1">{profile.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center justify-center">
                    <Phone size={14} className="mr-1" />
                    {profile.phone}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Profiles Grid */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            TODAS AS <span className="text-primary">MODELOS</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProfiles.map((profile) => (
              <Card
                key={profile.id}
                onClick={() => window.location.href = `/perfil/${profile.id}`}
                className="bg-card border border-border hover:border-primary transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={profile.photos[0]?.url || ""}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {profile.highlight_tag && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-black text-secondary border-2 border-secondary px-3 py-1 text-sm font-bold">
                        {profile.highlight_tag}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-xl font-bold text-foreground mb-2">{profile.name}</h4>
                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <p>{profile.age} anos</p>
                    <p>{profile.height} m, {profile.weight} kg</p>
                    <p>{profile.city}</p>
                    {profile.neighborhood && <p>{profile.neighborhood}</p>}
                    <p className="flex items-center">
                      <Phone size={14} className="mr-1" />
                      {profile.phone}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-black"
                  >
                    <Share2 size={14} className="mr-2" />
                    Compartilhe
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo e Descrição */}
            <div className="col-span-1 md:col-span-1">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029969419/HlWSCrNFRUWDTqJt.png" alt="Farialover" className="h-16 mb-4" />
              <p className="text-muted-foreground text-sm">
                A plataforma mais elegante de acompanhantes de luxo do Brasil.
              </p>
            </div>

            {/* Links Rápidos */}
            <div>
              <h4 className="text-white font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                <li><a href="#modelos" className="text-muted-foreground hover:text-primary transition-colors">Modelos</a></li>
                <li><a href="#cidades" className="text-muted-foreground hover:text-primary transition-colors">Cidades</a></li>
                <li><a href="#videos" className="text-muted-foreground hover:text-primary transition-colors">Vídeos</a></li>
              </ul>
            </div>

            {/* Informações Legais */}
            <div>
              <h4 className="text-white font-bold mb-4">Informações Legais</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/termos" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</a></li>
                <li><a href="/contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</a></li>
                <li><a href="/anuncie" className="text-muted-foreground hover:text-primary transition-colors">Anuncie Aqui</a></li>
              </ul>
            </div>

            {/* Redes Sociais */}
            <div>
              <h4 className="text-white font-bold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                Siga-nos nas redes sociais para novidades e atualizações.
              </p>
            </div>
          </div>

          {/* Aviso Legal */}
          <div className="border-t border-border pt-6 mb-6">
            <p className="text-muted-foreground text-xs text-center max-w-4xl mx-auto">
              <strong className="text-red-500">AVISO LEGAL:</strong> Este site contém conteúdo adulto e é destinado exclusivamente a maiores de 18 anos. 
              Todos os anúncios são de responsabilidade dos anunciantes. O Farialover não se responsabiliza pelo conteúdo dos anúncios publicados. 
              As imagens e informações são fornecidas pelos próprios anunciantes. Ao acessar este site, você declara ter mais de 18 anos e concorda com nossos Termos de Uso.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © 2026 <span className="text-primary font-bold">Farialover</span>. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Story Modal */}
      {storyModalOpen && displayProfiles && displayProfiles.length > 0 && (
        <StoryModal
          profile={displayProfiles[selectedStoryIndex]}
          onClose={() => setStoryModalOpen(false)}
          onPrevious={() => {
            setSelectedStoryIndex((prev) => (prev - 1 + displayProfiles.length) % displayProfiles.length);
          }}
          onNext={() => {
            setSelectedStoryIndex((prev) => (prev + 1) % displayProfiles.length);
          }}
          onViewProfile={() => {
            setStoryModalOpen(false);
            setLocation(`/perfil/${displayProfiles[selectedStoryIndex].id}`);
          }}
        />
      )}
    </div>
  );
}
