import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Phone, Star, MapPin, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { toast } from "sonner";
import ShareModal from "@/components/ShareModal";

export default function Profile() {
  const [, params] = useRoute("/perfil/:id");
  const [, setLocation] = useLocation();
  const profileId = params?.id ? parseInt(params.id) : null;

  const { data: profiles, isLoading } = trpc.profiles.list.useQuery();
  const { data: comments, isLoading: commentsLoading } = trpc.comments.list.useQuery(
    { profileId: profileId || 0 },
    { enabled: !!profileId }
  );
  
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const createCommentMutation = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.success("Comentário enviado! Aguardando aprovação.");
      setAuthorName("");
      setCommentText("");
    },
    onError: (error) => {
      toast.error("Erro ao enviar comentário: " + error.message);
    },
  });

  const incrementAccessMutation = trpc.profiles.incrementAccessCount.useMutation();

  // Incrementar contador de acessos ao abrir perfil
  useEffect(() => {
    if (profileId) {
      incrementAccessMutation.mutate({ profileId });
    }
  }, [profileId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-2xl text-white">Carregando...</div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0 || !profileId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-2xl text-white">Perfil não encontrado</div>
      </div>
    );
  }

  const currentIndex = profiles.findIndex((p) => p.id === profileId);
  const profile = profiles[currentIndex];

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-2xl text-white">Perfil não encontrado</div>
      </div>
    );
  }

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + profiles.length) % profiles.length;
    setLocation(`/perfil/${profiles[prevIndex].id}`);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % profiles.length;
    setLocation(`/perfil/${profiles[nextIndex].id}`);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    createCommentMutation.mutate({
      profileId: profile.id,
      authorName: authorName.trim(),
      commentText: commentText.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029969419/HlWSCrNFRUWDTqJt.png" 
              alt="Farialover" 
              className="h-16 cursor-pointer" 
              onClick={() => setLocation("/")} 
            />

            <nav className="hidden lg:flex items-center space-x-6">
              <a href="/" className="text-white hover:text-primary transition-colors text-sm font-medium">HOME</a>
              <a href="#modelos" className="text-white hover:text-primary transition-colors text-sm font-medium">MODELOS</a>
              <a href="#cidades" className="text-white hover:text-primary transition-colors text-sm font-medium">CIDADES</a>
              <a href="#videos" className="text-white hover:text-primary transition-colors text-sm font-medium">VÍDEOS</a>
              <a href="#audios" className="text-white hover:text-primary transition-colors text-sm font-medium">ÁUDIOS</a>
            </nav>

            <div className="flex items-center space-x-3">
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <Button className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2">
                ANUNCIE AQUI
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Esquerda */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sticky top-20">
              {/* Foto Principal */}
              <div className="text-center mb-4">
                <img
                  src={profile.avatar_url || profile.photos[0]?.url}
                  alt={profile.name}
                  className="w-24 h-24 mx-auto mb-3 object-cover border-2 border-gray-700"
                />
                <h2 className="text-xl font-bold text-secondary mb-2">{profile.name}</h2>
                
                {/* Avaliação */}
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Telefone */}
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center justify-center text-primary hover:text-primary/80 mb-2 text-sm"
                >
                  <Phone size={14} className="mr-1" />
                  {profile.phone}
                </a>

                {/* Localização */}
                <div className="text-white text-sm mb-2">
                  <div className="flex items-center justify-center mb-1">
                    <MapPin size={14} className="mr-1 text-primary" />
                    {profile.city}
                  </div>
                  {profile.neighborhood && (
                    <div className="text-primary text-xs">{profile.neighborhood}</div>
                  )}
                </div>

                {/* Status */}
                <div className="bg-green-900/30 border border-primary text-primary text-xs py-1 px-2 rounded mb-3">
                  Disponível
                </div>

                {/* Botão Compartilhar */}
                <Button
                  onClick={() => setShareModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white mb-3"
                >
                  <Share2 size={14} className="mr-2" />
                  Compartilhar Perfil
                </Button>

                {/* Mensagem Destaque */}
                <div className="bg-red-900/30 border border-red-600 text-red-500 text-xs py-2 px-2 rounded mb-4">
                  AO LIGAR DIGA QUE ME VIU NO FARIALOVER
                </div>
              </div>

              {/* Informações Pessoais */}
              <div className="space-y-1 text-xs text-gray-400 mb-4">
                <div className="flex justify-between border-b border-gray-800 py-1">
                  <span>Idade</span>
                  <span className="text-white">{profile.age}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 py-1">
                  <span>Altura</span>
                  <span className="text-white">{profile.height} m</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 py-1">
                  <span>Peso</span>
                  <span className="text-white">{profile.weight} kg</span>
                </div>
                {profile.body_type && (
                  <div className="flex justify-between border-b border-gray-800 py-1">
                    <span>Biotipo</span>
                    <span className="text-white">{profile.body_type}</span>
                  </div>
                )}
                {profile.hair_color && (
                  <div className="flex justify-between border-b border-gray-800 py-1">
                    <span>Cabelos</span>
                    <span className="text-white">{profile.hair_color}</span>
                  </div>
                )}
                {profile.eye_color && (
                  <div className="flex justify-between border-b border-gray-800 py-1">
                    <span>Olhos</span>
                    <span className="text-white">{profile.eye_color}</span>
                  </div>
                )}
                {profile.zodiac_sign && (
                  <div className="flex justify-between border-b border-gray-800 py-1">
                    <span>Signo</span>
                    <span className="text-white">{profile.zodiac_sign}</span>
                  </div>
                )}
              </div>

              {/* Contador de Acessos */}
              <div className="text-center mb-4 border-t border-gray-800 pt-4">
                <div className="text-gray-400 text-xs mb-1">ACESSOS NO MÊS</div>
                <div className="text-secondary text-2xl font-bold flex items-center justify-center">
                  {Math.floor(Math.random() * 100000)}
                  <Star size={20} className="ml-2 fill-secondary text-secondary" />
                </div>
              </div>

              {/* Botões de Navegação */}
              <div className="flex gap-2">
                <Button
                  onClick={goToPrevious}
                  className="flex-1 bg-primary hover:bg-primary/80 text-black text-xs py-2"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </Button>
                <Button
                  onClick={goToNext}
                  className="flex-1 bg-primary hover:bg-primary/80 text-black text-xs py-2"
                >
                  Próximo
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Área Central */}
          <div className="lg:col-span-3">
            {/* Foto Principal Grande */}
            <div className="relative mb-6 bg-black rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <img
                src={profile.photos[selectedPhotoIndex]?.url || profile.photos[0]?.url}
                alt={profile.name}
                className="w-full h-full object-contain"
              />
              {profile.photos.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2 rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedPhotoIndex((prev) => (prev + 1) % profile.photos.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2 rounded-full"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Grid de Thumbnails */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-6">
              {profile.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`aspect-square overflow-hidden rounded cursor-pointer transition-all bg-black ${
                    index === selectedPhotoIndex
                      ? "ring-2 ring-primary"
                      : "hover:ring-2 hover:ring-secondary opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={`${profile.name} - ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Bio/Descrição */}
            {profile.bio && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
                <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{profile.bio}</p>
                
                {profile.whatsapp && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-primary text-sm mb-2">– LIGAÇÕES: {profile.phone}</p>
                    <p className="text-primary text-sm">– WHATSAPP: {profile.whatsapp}</p>
                  </div>
                )}
              </div>
            )}

            {/* Botão VÍDEOS */}
            {profile.videos && profile.videos.length > 0 && (
              <div className="mb-6">
                <Button
                  onClick={() => setShowVideoModal(true)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 text-sm"
                >
                  VÍDEOS
                </Button>
              </div>
            )}

            {/* MEU CACHÊ */}
            {profile.price_per_hour && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-white font-bold text-sm mb-4 uppercase">MEU CACHÊ</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>1H</span>
                    <span className="text-secondary font-bold">R$ {profile.price_per_hour.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>2H</span>
                    <span className="text-white">A combinar</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Pernoite</span>
                    <span className="text-white">A combinar</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Pagamento</span>
                    <span className="text-white">Dinheiro, Pix</span>
                  </div>
                </div>
              </div>
            )}

            {/* Serviços */}
            {profile.services && profile.services.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-white font-bold text-sm mb-4 uppercase">SERVIÇOS</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.services.map((service, index) => (
                    <span
                      key={index}
                      className="bg-black text-gray-300 px-3 py-1 rounded text-xs border border-gray-700"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Localização */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-white font-bold text-sm mb-4 uppercase">LOCALIZAÇÃO</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>
                  <span className="font-bold text-white">Cidade:</span> {profile.city}
                </p>
                {profile.neighborhood && (
                  <p>
                    <span className="font-bold text-white">Bairro:</span> {profile.neighborhood}
                  </p>
                )}
              </div>
            </div>

            {/* MEUS ELOGIOS */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white font-bold text-lg mb-4 uppercase">MEUS ELOGIOS</h3>
              
              {/* Texto Introdutório */}
              <div className="mb-6 text-sm text-gray-400 space-y-2">
                <p>
                  <span className="font-bold text-white">SRS. USUÁRIOS</span> - Este espaço é reservado SOMENTE para que você escreva o seu elogio ou simplesmente dê seu depoimento (elogioso) sobre algum encontro em que você teve com alguma das anunciantes do FARIALOVER. Para isso basta preencher o formulário a seguir e em seguida clicar em PUBLICAR.
                </p>
                <p>
                  <span className="font-bold text-red-500">ATENÇÃO</span> - Este NÃO É um canal de comunicação com as GAROTAS DE PROGRAMA do site uma vez que elas NÃO RESPONDERÃO para você. O seu contato com elas deverá ser realizado SOMENTE através dos telefones indicados nos anúncios das anunciantes. Neste espaço somente admitiremos os comentários elogiosos a elas que, após serem avaliados, poderão ser ou não publicados (críticas serão descartadas).
                </p>
              </div>

              {/* Formulário de Comentário */}
              <form onSubmit={handleSubmitComment} className="mb-6 space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Escreva seu elogio aqui..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="bg-black border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createCommentMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/80 text-black font-bold py-3"
                >
                  {createCommentMutation.isPending ? "ENVIANDO..." : "PUBLICAR"}
                </Button>
              </form>

              {/* Lista de Comentários */}
              <div className="space-y-4">
                {commentsLoading ? (
                  <p className="text-gray-400 text-sm">Carregando comentários...</p>
                ) : comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-t border-gray-800 pt-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-bold text-white">{comment.author_name}</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.comment_text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Nenhum comentário ainda. Seja o primeiro a elogiar!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Vídeos */}
      {showVideoModal && profile.videos && profile.videos.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-lg">VÍDEOS - {profile.name}</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <iframe
                src={profile.videos[selectedVideoIndex].url}
                title={profile.videos[selectedVideoIndex].title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {profile.videos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {profile.videos.map((video, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedVideoIndex(index)}
                    className={`aspect-video cursor-pointer rounded overflow-hidden ${
                      index === selectedVideoIndex ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        profileName={profile.name}
        profileUrl={`/perfil/${profile.id}`}
      />
    </div>
  );
}
