import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Phone, Share2, Star, Menu, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import StoryModal from "@/components/StoryModal";
import ShareModal from "@/components/ShareModal";
import SearchFilters, { FilterValues } from "@/components/SearchFilters";
import { useLocation } from "wouter";

export default function Home() {
  const { data: profiles, isLoading } = trpc.profiles.list.useQuery();
  const [heroIndex, setHeroIndex] = useState(0);
  const [storiesStart, setStoriesStart] = useState(0);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProfileForShare, setSelectedProfileForShare] = useState<{ name: string; id: number } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029969419/HlWSCrNFRUWDTqJt.png" 
                alt="Farialover" 
                className="h-12 sm:h-16 md:h-20" 
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">HOME</a>
              <a href="/modelos" className="text-foreground hover:text-primary transition-colors font-medium">MODELOS</a>
              <a href="/cidades" className="text-foreground hover:text-primary transition-colors font-medium">CIDADES</a>
            </nav>

            {/* Desktop Social + CTA */}
            <div className="hidden lg:flex items-center space-x-4">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-foreground hover:text-primary transition-colors p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-4 border-t border-border">
              <a 
                href="/" 
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </a>
              <a 
                href="/modelos" 
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                MODELOS
              </a>
              <a 
                href="/cidades" 
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                CIDADES
              </a>
              <div className="flex items-center space-x-4 pt-2">
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold w-full">
                ANUNCIE AQUI
              </Button>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="flex items-center justify-center pb-2 sm:pb-4">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-black cursor-pointer"
          onClick={() => setLocation(`/perfil/${heroProfile?.id}`)}
        >
          <img
            key={heroIndex}
            src={heroPhoto}
            alt={heroProfile?.name}
            className="w-full h-full object-cover sm:object-contain transition-opacity duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-2 sm:px-4 flex items-end sm:items-start pb-4 sm:pt-24 pointer-events-none">
          <div className="w-full sm:w-[280px] bg-black/75 backdrop-blur-md p-3 sm:p-5 rounded-md">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">{heroProfile?.name}</h2>

            {/* Info */}
            <div className="text-white space-y-0.5 sm:space-y-1 mb-3 sm:mb-4">
              <p className="text-sm sm:text-base lg:text-lg">{heroProfile?.age} anos</p>
              <p className="text-sm sm:text-base lg:text-lg">{heroProfile?.height} m, {heroProfile?.weight} kg</p>
              <p className="text-sm sm:text-base lg:text-lg">{heroProfile?.city}</p>
              {heroProfile?.neighborhood && (
                <p className="text-sm sm:text-base lg:text-lg">{heroProfile.neighborhood}</p>
              )}
              <p className="flex items-center text-sm sm:text-base lg:text-lg">
                <Phone size={16} className="mr-2" />
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
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 md:p-4 rounded-full transition-all z-10 backdrop-blur-sm pointer-events-auto"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHeroIndex((prev) => (prev + 1) % (profiles?.length || 1));
          }}
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 md:p-4 rounded-full transition-all z-10 backdrop-blur-sm pointer-events-auto"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
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
      <section className="py-6 sm:py-8 md:py-12 bg-black">
        <div className="container mx-auto px-2 sm:px-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-foreground">
            STORIES <span className="text-primary">BELO HORIZONTE</span>
          </h3>

          <div className="relative">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 md:space-x-6 overflow-x-auto scrollbar-hide pb-2">
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
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 sm:border-3 md:border-4 border-primary p-0.5 sm:p-1 mb-1 sm:mb-2 group-hover:border-secondary transition-colors flex-shrink-0">
                    <img
                      src={profile.photos[0]?.url || ""}
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-foreground text-center">{profile.name.split(" ")[0]}</span>
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
      <section className="py-6 sm:py-8 md:py-12 bg-background">
        <div className="container mx-auto px-2 sm:px-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-foreground">
            VIP'S <span className="text-primary">BELO HORIZONTE</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
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
                <div className="p-2 sm:p-3 text-center">
                  <h4 className="font-bold text-sm sm:text-base text-foreground mb-1">{profile.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center">
                    <Phone size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                    <span className="truncate">{profile.phone}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Novidades Section */}
      <section className="py-6 sm:py-8 md:py-12 bg-background">
        <div className="container mx-auto px-2 sm:px-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-foreground">
            NOVIDADES <span className="text-primary">BELO HORIZONTE</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
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
                <div className="p-2 sm:p-3 text-center">
                  <h4 className="font-bold text-sm sm:text-base text-foreground mb-1">{profile.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center">
                    <Phone size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                    <span className="truncate">{profile.phone}</span>
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
                <div className="p-2 sm:p-3 text-center">
                  <h4 className="font-bold text-sm sm:text-base text-foreground mb-1">{profile.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center">
                    <Phone size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                    <span className="truncate">{profile.phone}</span>
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
                <div className="p-2 sm:p-3 text-center">
                  <h4 className="font-bold text-sm sm:text-base text-foreground mb-1">{profile.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center">
                    <Phone size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                    <span className="truncate">{profile.phone}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Profiles Grid */}
      <section className="py-6 sm:py-8 md:py-12 bg-black">
        <div className="container mx-auto px-2 sm:px-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-foreground">
            TODAS AS <span className="text-primary">MODELOS</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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

                <div className="p-3 sm:p-4">
                  <h4 className="text-lg sm:text-xl font-bold text-foreground mb-2">{profile.name}</h4>
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1 mb-3">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProfileForShare({ name: profile.name, id: profile.id });
                      setShareModalOpen(true);
                    }}
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
      <footer className="bg-black border-t border-border py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Logo e Descrição */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029969419/HlWSCrNFRUWDTqJt.png" alt="Farialover" className="h-12 sm:h-14 md:h-16 mb-3 sm:mb-4" />
              <p className="text-muted-foreground text-xs sm:text-sm">
                A plataforma mais elegante de acompanhantes de luxo do Brasil.
              </p>
            </div>

            {/* Links Rápidos */}
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Links Rápidos</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                <li><a href="#modelos" className="text-muted-foreground hover:text-primary transition-colors">Modelos</a></li>
                <li><a href="#cidades" className="text-muted-foreground hover:text-primary transition-colors">Cidades</a></li>
                <li><a href="#videos" className="text-muted-foreground hover:text-primary transition-colors">Vídeos</a></li>
              </ul>
            </div>

            {/* Informações Legais */}
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Informações Legais</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="/termos" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</a></li>
                <li><a href="/contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</a></li>
                <li><a href="/anuncie" className="text-muted-foreground hover:text-primary transition-colors">Anuncie Aqui</a></li>
              </ul>
            </div>

            {/* Redes Sociais */}
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Redes Sociais</h4>
              <div className="flex space-x-3 sm:space-x-4">
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
              <p className="text-muted-foreground text-xs sm:text-sm mt-3 sm:mt-4">
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

      {/* Share Modal */}
      {selectedProfileForShare && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedProfileForShare(null);
          }}
          profileName={selectedProfileForShare.name}
          profileUrl={`/perfil/${selectedProfileForShare.id}`}
        />
      )}
    </div>
  );
}
