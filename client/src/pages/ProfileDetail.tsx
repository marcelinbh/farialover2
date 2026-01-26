import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Lightbox from "@/components/Lightbox";
import VerificationBadges from "@/components/VerificationBadges";
import { Phone, Star, MapPin, MessageCircle, Eye } from "lucide-react";
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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-20 md:h-24"></div>
        <div className="container py-8">
          <p className="text-center">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-20 md:h-24"></div>
        <div className="container py-8">
          <p className="text-center">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  const allPhotos = [profile.photoUrl, ...photos.map(p => p.url)].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Espaçamento para header fixo */}
      <div className="h-20 md:h-24"></div>

      {/* Layout Principal - 2 Colunas */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
          
          {/* SIDEBAR ESQUERDA */}
          <aside className="space-y-4">
            {/* Foto Pequena do Perfil */}
            <div className="bg-card border-2 border-primary rounded-lg p-4">
              <img
                src={profile.photoUrl || '/placeholder-profile.jpg'}
                alt={profile.name}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              
              {/* Nome */}
              <h1 className="text-2xl font-bold text-center mb-2">{profile.name}</h1>
              
              {/* Badges de Verificação */}
              <div className="flex justify-center mb-3">
                <VerificationBadges 
                  isVerified={profile.isVerified}
                  hasRealPhotos={profile.hasRealPhotos}
                />
              </div>
              
              {/* Avaliação */}
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Telefone */}
              <div className="flex items-center justify-center gap-2 mb-3 text-foreground">
                <Phone size={18} className="text-primary" />
                <span className="font-semibold">{profile.phone}</span>
              </div>

              {/* Localização */}
              <div className="text-center mb-1">
                <p className="font-semibold">{profile.city}</p>
                <p className="text-sm text-primary">{profile.region}</p>
              </div>

              {/* Botão WhatsApp */}
              <a
                href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors mt-4"
              >
                <MessageCircle size={20} />
                MENSAGEM
              </a>

              {/* Status */}
              <div className="text-center mt-3">
                <span className="inline-block bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Disponível
                </span>
              </div>

              {/* Aviso */}
              <div className="mt-4 text-center text-xs border border-primary rounded p-2">
                <p>AO LIGAR DIGA QUE ME VIU NO <span className="text-primary font-bold">FARIALOVER</span></p>
              </div>
            </div>

            {/* Informações Detalhadas */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Idade</span>
                <span className="font-semibold">{profile.age}</span>
              </div>
              {profile.height && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Altura</span>
                  <span className="font-semibold">{profile.height} m</span>
                </div>
              )}
              {profile.weight && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peso</span>
                  <span className="font-semibold">{profile.weight} kg</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Manequim</span>
                <span className="font-semibold">38</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biotipo</span>
                <span className="font-semibold">Magra / Gostosa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cabelos</span>
                <span className="font-semibold">Castanhos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Olhos</span>
                <span className="font-semibold">Castanhos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seios</span>
                <span className="font-semibold">Silicone</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pés</span>
                <span className="font-semibold">37</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cintura</span>
                <span className="font-semibold">60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quadril</span>
                <span className="font-semibold">102</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tatuagem</span>
                <span className="font-semibold">Sim</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Piercing</span>
                <span className="font-semibold">Não</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fumante</span>
                <span className="font-semibold">Não</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nível Cultural</span>
                <span className="font-semibold">Universitária</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Idiomas</span>
                <span className="font-semibold">Inglês, Português</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signo</span>
                <span className="font-semibold">Escorpião</span>
              </div>
            </div>

            {/* Contador de Acessos */}
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">ACESSOS NO MÊS</p>
              <div className="flex items-center justify-center gap-2">
                <Eye className="text-primary" size={24} />
                <span className="text-3xl font-bold text-primary">94083</span>
              </div>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL - DIREITA */}
          <main className="space-y-6">
            {/* FOTO PRINCIPAL GRANDE */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <img
                src={profile.photoUrl || '/placeholder-profile.jpg'}
                alt={profile.name}
                className="w-full h-[600px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(0)}
              />
            </div>

            {/* Descrição */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground leading-relaxed mb-4">
                <strong className="text-primary">{profile.name.toUpperCase()}</strong> é uma belíssima acompanhante de luxo que está em {profile.city}. 
                Com {profile.age} anos, {profile.height && `${profile.height}m de altura`} e corpo sarado, ela representa a beleza brasileira. 
                Para os que desejam uma companhia ardente, capaz de proporcionar momentos de muito prazer. 
                Ela pode ser sua companhia perfeita. Linda, extrovertida e elegante, ela está muito ansiosa pra acompanhá-lo em qualquer ocasião 
                e espera a sua ligação para fazer do encontro um momento único cheio de sensualidade e sedução!
              </p>
              
              <div className="border-t border-border pt-4 mt-4">
                <p className="text-primary font-bold text-lg mb-2">ALTÍSSIMO PADRÃO! – IMPERDÍVEL!</p>
                <p className="text-sm text-muted-foreground">– <span className="text-primary font-semibold">FARIALOVER LIMITADÍSSIMA!</span></p>
                <p className="text-sm text-muted-foreground">– LIGAÇÕES: {profile.phone}</p>
              </div>
            </div>

            {/* Categorias */}
            {categories.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Categorias</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Galeria de Fotos */}
            {photos.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Galeria de Fotos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`Foto ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openLightbox(index + 1)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Vídeos */}
            {videos.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Vídeos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <video
                      key={video.id}
                      src={video.url}
                      controls
                      className="w-full rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Áudios */}
            {audios.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Áudios</h3>
                <div className="space-y-3">
                  {audios.map((audio) => (
                    <audio
                      key={audio.id}
                      src={audio.url}
                      controls
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Comentários */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Comentários e Avaliações</h3>
              
              {/* Formulário de Comentário */}
              <div className="mb-6 p-4 bg-background rounded-lg">
                <h4 className="font-semibold mb-3">Deixe seu comentário</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Avaliação</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={24}
                          className={`cursor-pointer transition-colors ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
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
                    placeholder="Seu comentário..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={handleSubmitComment}
                    disabled={createCommentMutation.isPending}
                    className="w-full"
                  >
                    {createCommentMutation.isPending ? "Enviando..." : "Enviar Comentário"}
                  </Button>
                </div>
              </div>

              {/* Lista de Comentários */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum comentário ainda. Seja o primeiro!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-background rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{comment.authorName}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= comment.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Lightbox */}
      {allPhotos.length > 0 && (
        <Lightbox
          images={allPhotos.map((url, idx) => ({ id: idx, url: url as string, order: idx }))}
          isOpen={lightboxOpen}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
