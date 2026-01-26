import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Lightbox from "@/components/Lightbox";
import VerificationBadges from "@/components/VerificationBadges";
import { Phone, Star, MapPin, User, Ruler, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ProfileDetail() {
  const [, params] = useRoute("/profile/:id");
  const profileId = params?.id ? parseInt(params.id) : 0;

  const { data: profile, isLoading } = trpc.profiles.getById.useQuery({ id: profileId });
  const { data: photos = [] } = trpc.profiles.getPhotos.useQuery({ profileId });
  const { data: videos = [] } = trpc.videos.list.useQuery({ profileId });
  const { data: audios = [] } = trpc.audios.list.useQuery({ profileId });
  const { data: comments = [] } = trpc.comments.list.useQuery({ profileId });
  const { data: categories = [] } = trpc.profiles.getCategories.useQuery({ profileId });

  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const createCommentMutation = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.success("Comentário enviado! Aguardando aprovação.");
      setAuthorName("");
      setCommentContent("");
      setRating(5);
    },
    onError: (error) => {
      toast.error("Erro ao enviar comentário: " + error.message);
    },
  });

  const handleSubmitComment = () => {
    if (!authorName.trim() || !commentContent.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    createCommentMutation.mutate({
      profileId,
      authorName: authorName.trim(),
      content: commentContent.trim(),
      rating,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-20 md:h-24"></div>
        <div className="container py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-20 md:h-24"></div>
        <div className="container py-12 text-center">
          <p className="text-xl text-muted-foreground">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${profile.phone.replace(/\D/g, '')}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20 md:h-24"></div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Foto e Info */}
          <div className="lg:col-span-1">
            <div className="profile-card sticky top-24">
              <img
                src={profile.photoUrl || '/placeholder-profile.jpg'}
                alt={profile.name}
                className="w-full aspect-[3/4] object-cover"
              />
              
              {/* Galeria de Fotos */}
              {photos.length > 0 && (
                <div className="p-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Galeria de Fotos</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {photos.map((photo, index) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt={`Foto ${photo.order}`}
                        className="w-full aspect-square object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                        onClick={() => {
                          setLightboxIndex(index);
                          setLightboxOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <h1 className="text-3xl font-bold gradient-text">{profile.name}</h1>

                {/* Badges de Verificação */}
                <VerificationBadges
                  isVerified={profile.isVerified}
                  hasRealPhotos={profile.hasRealPhotos}
                  size="md"
                />

                {/* Categorias */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <span key={cat.id} className="tag">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Informações */}
                <div className="space-y-3 text-foreground">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-primary" />
                    <span>{profile.age} anos</span>
                  </div>
                  {profile.height && (
                    <div className="flex items-center gap-3">
                      <Ruler size={20} className="text-primary" />
                      <span>{profile.height} m</span>
                    </div>
                  )}
                  {profile.weight && (
                    <div className="flex items-center gap-3">
                      <Weight size={20} className="text-primary" />
                      <span>{profile.weight} kg</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-primary" />
                    <span>{profile.city} - {profile.region}</span>
                  </div>
                </div>

                {/* Rating */}
                {profile.ratingCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < Math.round(Number(profile.rating)) ? "star filled" : "star"}
                          fill={i < Math.round(Number(profile.rating)) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Number(profile.rating).toFixed(1)} ({profile.ratingCount} avaliações)
                    </span>
                  </div>
                )}

                {/* Botão WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block btn-gradient px-6 py-3 rounded-md text-center text-lg font-bold"
                >
                  <Phone size={20} className="inline mr-2" />
                  {profile.phone}
                </a>

                {/* Visualizações */}
                <p className="text-sm text-muted-foreground text-center">
                  {profile.viewCount} visualizações
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Conteúdo */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descrição */}
            {profile.description && (
              <section className="bg-card p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 gradient-text">Sobre</h2>
                <p className="text-foreground whitespace-pre-wrap">{profile.description}</p>
              </section>
            )}

            {/* Vídeos */}
            {videos.length > 0 && (
              <section className="bg-card p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 gradient-text">Vídeos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="space-y-2">
                      {video.title && (
                        <h3 className="font-semibold text-foreground">{video.title}</h3>
                      )}
                      <video
                        controls
                        className="w-full rounded-lg"
                        poster={video.thumbnailUrl || undefined}
                      >
                        <source src={video.url} type="video/mp4" />
                        Seu navegador não suporta vídeos.
                      </video>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Áudios */}
            {audios.length > 0 && (
              <section className="bg-card p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 gradient-text">Áudios</h2>
                <div className="space-y-4">
                  {audios.map((audio) => (
                    <div key={audio.id} className="space-y-2">
                      {audio.title && (
                        <h3 className="font-semibold text-foreground">{audio.title}</h3>
                      )}
                      <audio controls className="w-full">
                        <source src={audio.url} type="audio/mpeg" />
                        Seu navegador não suporta áudios.
                      </audio>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Comentários */}
            <section className="bg-card p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6 gradient-text">
                Avaliações ({comments.length})
              </h2>

              {/* Formulário de Comentário */}
              <div className="mb-8 p-4 bg-background rounded-lg space-y-4">
                <h3 className="font-semibold text-foreground">Deixe sua avaliação</h3>
                
                {/* Rating */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Nota:</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={32}
                        className={star <= rating ? "star filled" : "star"}
                        fill={star <= rating ? "currentColor" : "none"}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <Input
                  placeholder="Seu nome"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
                <Textarea
                  placeholder="Escreva seu comentário..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={createCommentMutation.isPending}
                  className="btn-gradient w-full"
                >
                  {createCommentMutation.isPending ? "Enviando..." : "Enviar Avaliação"}
                </Button>
              </div>

              {/* Lista de Comentários */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma avaliação ainda. Seja o primeiro!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{comment.authorName}</h4>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < comment.rating ? "star filled" : "star"}
                                fill={i < comment.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-foreground">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={photos}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-card py-8 border-t border-border mt-12">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 farialover. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
