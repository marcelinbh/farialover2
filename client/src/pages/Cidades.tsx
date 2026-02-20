import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Facebook, Twitter, Instagram, Phone, Share2, Star, MapPin } from "lucide-react";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";

export default function Cidades() {
  const { data: profiles, isLoading } = trpc.profiles.list.useQuery();
  const [, setLocation] = useLocation();
  const [selectedCity, setSelectedCity] = useState<string>("Todas");

  // Get unique cities from profiles
  const cities = useMemo(() => {
    if (!profiles) return [];
    const uniqueCities = Array.from(new Set(profiles.map(p => p.city)));
    return ["Todas", ...uniqueCities.sort()];
  }, [profiles]);

  // Count profiles per city
  const cityCounts = useMemo(() => {
    if (!profiles) return {};
    const counts: Record<string, number> = {};
    profiles.forEach(profile => {
      counts[profile.city] = (counts[profile.city] || 0) + 1;
    });
    return counts;
  }, [profiles]);

  // Filter profiles by selected city
  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    if (selectedCity === "Todas") return profiles;
    return profiles.filter(p => p.city === selectedCity);
  }, [profiles, selectedCity]);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-border">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/">
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029969419/HlWSCrNFRUWDTqJt.png" alt="Farialover" className="h-10 sm:h-12 md:h-14 lg:h-16" />
              </a>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">HOME</a>
              <a href="/modelos" className="text-foreground hover:text-primary transition-colors font-medium">MODELOS</a>
              <a href="/cidades" className="text-primary transition-colors font-medium">CIDADES</a>
              <a href="#videos" className="text-foreground hover:text-primary transition-colors font-medium">VÍDEOS</a>
              <a href="#audios" className="text-foreground hover:text-primary transition-colors font-medium">ÁUDIOS</a>
            </nav>

            {/* Social + CTA */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors hidden sm:block">
                <Facebook size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors hidden sm:block">
                <Twitter size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors hidden sm:block">
                <Instagram size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </a>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-xs md:text-sm px-2 sm:px-4 md:px-6 py-1 sm:py-2">
                ANUNCIE
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <section className="py-6 sm:py-8 md:py-12 bg-black">
        <div className="container mx-auto px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 text-foreground">
            MODELOS POR <span className="text-primary">CIDADE</span>
          </h1>
          <p className="text-center text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 md:mb-8">
            Selecione uma cidade para ver as modelos disponíveis
          </p>

          {/* City Selector */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-12">
            {cities.map((city) => (
              <Button
                key={city}
                onClick={() => setSelectedCity(city)}
                variant={selectedCity === city ? "default" : "outline"}
                className={`${
                  selectedCity === city
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border-border text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <MapPin size={14} className="sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">{city}</span>
                {city !== "Todas" && (
                  <span className="ml-1.5 sm:ml-2 bg-black/20 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                    {cityCounts[city] || 0}
                  </span>
                )}
                {city === "Todas" && (
                  <span className="ml-1.5 sm:ml-2 bg-black/20 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                    {profiles.length}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-center text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 md:mb-8">
            {filteredProfiles.length} {filteredProfiles.length === 1 ? 'modelo encontrada' : 'modelos encontradas'}
            {selectedCity !== "Todas" && ` em ${selectedCity}`}
          </p>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredProfiles.map((profile) => (
              <Card
                key={profile.id}
                onClick={() => setLocation(`/perfil/${profile.id}`)}
                className="bg-card border border-border hover:border-primary transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={profile.photos[0]?.url || ""}
                    alt={profile.name}
                    className="w-full h-full object-contain bg-black group-hover:scale-105 transition-transform duration-300"
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
                    <p className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {profile.city}
                    </p>
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
                <li><a href="/modelos" className="text-muted-foreground hover:text-primary transition-colors">Modelos</a></li>
                <li><a href="/cidades" className="text-muted-foreground hover:text-primary transition-colors">Cidades</a></li>
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
    </div>
  );
}
