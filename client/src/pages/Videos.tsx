import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Facebook, Twitter, Instagram, Play } from "lucide-react";
import { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";

export default function Videos() {
  const { data: profiles, isLoading } = trpc.profiles.list.useQuery();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Get all videos from profiles
  const allVideos = useMemo(() => {
    if (!profiles) return [];
    return profiles.flatMap((profile) =>
      (profile.videos || []).map((video) => ({
        ...video,
        profileId: profile.id,
        profileName: profile.name,
        profilePhoto: profile.photos[0]?.url || "",
      }))
    );
  }, [profiles]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allVideos.map((v) => (v as any).category || "Geral")));
    return ["Todos", ...cats.sort()];
  }, [allVideos]);

  // Filter videos by category
  const filteredVideos = useMemo(() => {
    if (selectedCategory === "Todos") return allVideos;
    return allVideos.filter((v) => ((v as any).category || "Geral") === selectedCategory);
  }, [allVideos, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
              <Link href="/videos" className="text-primary transition-colors font-medium">VÍDEOS</Link>
              <Link href="/audios" className="text-foreground hover:text-primary transition-colors font-medium">ÁUDIOS</Link>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Vídeos</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Confira os vídeos exclusivos das acompanhantes
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
                    ({allVideos.filter((v) => ((v as any).category || "Geral") === category).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-muted-foreground text-base sm:text-lg">
              Nenhum vídeo encontrado nesta categoria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredVideos.map((video, index) => (
              <Card
                key={index}
                className="bg-card border-border overflow-hidden hover:border-primary transition-all cursor-pointer group"
                onClick={() => setPlayingVideo(video.url)}
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-black">
                  {playingVideo === video.url ? (
                    <video
                      src={video.url}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={video.thumbnail || video.profilePhoto}
                        alt={video.title || "Vídeo"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play size={28} className="text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </>
                  )}
                  {(video as any).duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                      {(video as any).duration}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1 line-clamp-2">
                    {video.title || "Vídeo sem título"}
                  </h3>
                  <p
                    className="text-primary text-xs sm:text-sm hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/perfil/${video.profileId}`);
                    }}
                  >
                    {video.profileName}
                  </p>
                  {(video as any).views && (
                    <p className="text-muted-foreground text-xs mt-1">
                      {(video as any).views.toLocaleString()} visualizações
                    </p>
                  )}
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
                <li><Link href="/videos" className="text-muted-foreground hover:text-primary transition-colors">Vídeos</Link></li>
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
