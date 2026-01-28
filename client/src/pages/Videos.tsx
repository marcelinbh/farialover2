import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import { Play } from "lucide-react";
import { Link } from "wouter";

export default function Videos() {
  const { data: videos = [], isLoading } = trpc.videos.list.useQuery();
  const { data: profiles = [] } = trpc.profiles.search.useQuery({});

  const getProfileById = (id: number) => {
    return profiles.find(p => p.id === id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20 md:h-24"></div>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8 gradient-text">VÍDEOS</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Carregando vídeos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Nenhum vídeo disponível</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => {
              const profile = getProfileById(video.profileId);
              return (
                <div key={video.id} className="profile-card">
                  <div className="relative aspect-video">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title || 'Vídeo'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={video.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play size={48} className="text-white" />
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-2">
                    {video.title && (
                      <h3 className="font-semibold text-foreground">{video.title}</h3>
                    )}
                    {profile && (
                      <Link href={`/profile/${profile.id}`}>
                        <a className="text-sm text-primary hover:text-secondary transition-colors">
                          {profile.name}
                        </a>
                      </Link>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {video.viewCount} visualizações
                    </p>
                    
                    {/* Player inline */}
                    <video controls className="w-full rounded-lg mt-2">
                      <source src={video.url} type="video/mp4" />
                      Seu navegador não suporta vídeos.
                    </video>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="bg-card py-8 border-t border-border mt-12">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 farialover. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
