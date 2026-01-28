import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Phone, Share2, Star } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { data: profiles, isLoading } = trpc.profiles.list.useQuery();
  const [heroIndex, setHeroIndex] = useState(0);
  const [storiesStart, setStoriesStart] = useState(0);

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

  const heroProfile = profiles[heroIndex];
  const heroPhoto = heroProfile?.photos[0]?.url || "";
  const storiesPerPage = 12;
  const visibleStories = profiles.slice(storiesStart, storiesStart + storiesPerPage);

  const nextHero = () => {
    setHeroIndex((prev) => (prev + 1) % profiles.length);
  };

  const prevHero = () => {
    setHeroIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
  };

  const nextStories = () => {
    if (storiesStart + storiesPerPage < profiles.length) {
      setStoriesStart(storiesStart + storiesPerPage);
    }
  };

  const prevStories = () => {
    if (storiesStart > 0) {
      setStoriesStart(Math.max(0, storiesStart - storiesPerPage));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">
                <span className="text-primary">faria</span>
                <span className="text-secondary">lover</span>
              </h1>
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
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroPhoto}
            alt={heroProfile?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-4 flex items-end pb-12">
          <div className="max-w-md">
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
          onClick={prevHero}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextHero}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
        >
          <ChevronRight size={32} />
        </button>
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
                <div key={profile.id} className="flex flex-col items-center cursor-pointer group">
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
            {storiesStart + storiesPerPage < profiles.length && (
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
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className="bg-card border-2 border-primary hover:border-secondary transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-2"
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src={profile.photos[0]?.url || ""}
                    alt={profile.name}
                    className="w-full h-full object-cover"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className="bg-card border border-border hover:border-primary transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-[3/4]">
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
      <footer className="bg-black border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2026 <span className="text-primary">Farialover</span>. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
