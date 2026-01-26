import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import { Music } from "lucide-react";
import { Link } from "wouter";

export default function Audios() {
  const { data: audios = [], isLoading } = trpc.audios.list.useQuery();
  const { data: profiles = [] } = trpc.profiles.list.useQuery();

  const getProfileById = (id: number) => {
    return profiles.find(p => p.id === id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20 md:h-24"></div>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8 gradient-text">ÁUDIOS</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Carregando áudios...</p>
          </div>
        ) : audios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Nenhum áudio disponível</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audios.map((audio) => {
              const profile = getProfileById(audio.profileId);
              return (
                <div key={audio.id} className="profile-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Music size={32} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {audio.title && (
                        <h3 className="font-semibold text-foreground truncate">{audio.title}</h3>
                      )}
                      {profile && (
                        <Link href={`/profile/${profile.id}`}>
                          <a className="text-sm text-primary hover:text-secondary transition-colors">
                            {profile.name}
                          </a>
                        </Link>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {audio.playCount} reproduções
                      </p>
                    </div>
                  </div>
                  
                  <audio controls className="w-full">
                    <source src={audio.url} type="audio/mpeg" />
                    Seu navegador não suporta áudios.
                  </audio>
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
