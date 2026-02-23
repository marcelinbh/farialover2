import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Facebook, Twitter, Instagram, Play, Pause } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { useLocation, Link } from "wouter";

export default function Audios() {
  const { data: profiles, isLoading } = trpc.profiles.list.useQuery();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get all audios from profiles (simulated - using videos as placeholder)
  const allAudios = useMemo(() => {
    if (!profiles) return [];
    // In real implementation, this would come from an 'audios' field
    // For now, we'll create placeholder data
    return profiles.slice(0, 8).map((profile, index) => ({
      id: `audio-${profile.id}-${index}`,
      url: `https://example.com/audio/${profile.id}.mp3`,
      title: `Mensagem de ${profile.name}`,
      category: index % 3 === 0 ? "Apresentação" : index % 3 === 1 ? "Depoimento" : "Geral",
      duration: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      profileId: profile.id,
      profileName: profile.name,
      profilePhoto: profile.photos[0]?.url || "",
    }));
  }, [profiles]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allAudios.map((a) => a.category)));
    return ["Todos", ...cats.sort()];
  }, [allAudios]);

  // Filter audios by category
  const filteredAudios = useMemo(() => {
    if (selectedCategory === "Todos") return allAudios;
    return allAudios.filter((a) => a.category === selectedCategory);
  }, [allAudios, selectedCategory]);

  const toggleAudio = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      audioRef.current?.pause();
      setPlayingAudio(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
      setPlayingAudio(audioUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingAudio(null)}
        className="hidden"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src="https://storage.manus.tech/manus-public/farialover-logo-v4-processed.png"
                alt="Farialover"
                className="h-10 sm:h-14 md:h-16"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">HOME</Link>
              <Link href="/modelos" className="text-foreground hover:text-primary transition-colors font-medium">MODELOS</Link>
              <Link href="/cidades" className="text-foreground hover:text-primary transition-colors font-medium">CIDADES</Link>
              <Link href="/videos" className="text-foreground hover:text-primary transition-colors font-medium">VÍDEOS</Link>
              <Link href="/audios" className="text-primary transition-colors font-medium">ÁUDIOS</Link>
            </nav>

            {/* Social + CTA */}
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
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-3 sm:px-6">
                ANUNCIE AQUI
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Áudios</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Ouça mensagens exclusivas das acompanhantes
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`text-xs sm:text-sm ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-transparent border-border hover:bg-primary/20"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                {category !== "Todos" && (
                  <span className="ml-2 text-xs opacity-70">
                    ({allAudios.filter((a) => a.category === category).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Audios List */}
        {filteredAudios.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-muted-foreground text-base sm:text-lg">
              Nenhum áudio encontrado nesta categoria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAudios.map((audio) => (
              <Card
                key={audio.id}
                className="bg-card border-border overflow-hidden hover:border-primary transition-all"
              >
                <div className="p-4 sm:p-6">
                  {/* Profile Info */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <img
                      src={audio.profilePhoto}
                      alt={audio.profileName}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                        {audio.title}
                      </h3>
                      <p
                        className="text-primary text-xs sm:text-sm hover:underline cursor-pointer truncate"
                        onClick={() => setLocation(`/perfil/${audio.profileId}`)}
                      >
                        {audio.profileName}
                      </p>
                    </div>
                  </div>

                  {/* Audio Player */}
                  <div className="bg-background rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => toggleAudio(audio.url)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      {playingAudio === audio.url ? (
                        <Pause size={20} className="text-white" fill="white" />
                      ) : (
                        <Play size={20} className="text-white ml-0.5" fill="white" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-primary transition-all ${
                            playingAudio === audio.url ? "w-1/2" : "w-0"
                          }`}
                        />
                      </div>
                      <div className="flex justify-between mt-1.5 sm:mt-2">
                        <span className="text-xs text-muted-foreground">
                          {playingAudio === audio.url ? "Tocando..." : "Parado"}
                        </span>
                        <span className="text-xs text-muted-foreground">{audio.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mt-3 sm:mt-4">
                    <span className="inline-block px-2 sm:px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                      {audio.category}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12 sm:mt-16">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Logo */}
            <div>
              <img
                src="https://storage.manus.tech/manus-public/farialover-logo-v4-processed.png"
                alt="Farialover"
                className="h-12 sm:h-16 mb-3 sm:mb-4"
              />
              <p className="text-muted-foreground text-xs sm:text-sm">
                As melhores acompanhantes de luxo de Belo Horizonte
              </p>
            </div>

            {/* Links Rápidos */}
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Links Rápidos</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/modelos" className="text-muted-foreground hover:text-primary transition-colors">Modelos</Link></li>
                <li><Link href="/cidades" className="text-muted-foreground hover:text-primary transition-colors">Cidades</Link></li>
                <li><Link href="/audios" className="text-muted-foreground hover:text-primary transition-colors">Áudios</Link></li>
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
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-muted-foreground text-xs sm:text-sm">
              © 2026 Farialover. Todos os direitos reservados. Conteúdo adulto +18.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              ⚠️ Este site contém material adulto. Acesso restrito a maiores de 18 anos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
