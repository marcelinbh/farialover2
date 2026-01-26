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
  const [, params] = useRoute("/perfil/:id");
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
      <div className="min-h-screen bg-black">
        <Header />
        <div className="h-20 md:h-24"></div>
        <div className="container py-8">
          <p className="text-center text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="h-20 md:h-24"></div>
        <div className="container py-8">
          <p className="text-center text-white">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  const allPhotos = [profile.photoUrl, ...photos.map(p => p.url)].filter(Boolean);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Espaçamento para header fixo */}
      <div className="h-20 md:h-24"></div>

      {/* Layout Principal - 2 Colunas */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          
          {/* SIDEBAR ESQUERDA */}
          <aside className="space-y-4">
            {/* Card Principal da Sidebar */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
              {/* Foto Pequena do Perfil */}
              <div className="mb-4">
                <img
                  src={profile.photoUrl || '/placeholder-profile.jpg'}
                  alt={profile.name}
                  className="w-full aspect-square object-cover rounded-lg border-2 border-primary"
                />
              </div>
              
              {/* Nome com estilo dourado/gradient */}
              <h1 className="text-2xl font-bold text-center mb-3 gradient-text">{profile.name}</h1>
              
              {/* Avaliação (Estrelas) */}
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Telefone */}
              <div className="flex items-center justify-center gap-2 mb-3 text-white">
                <Phone size={18} className="text-primary" />
                <span className="font-semibold text-lg">{profile.phone}</span>
              </div>

              {/* Localização */}
              <div className="text-center mb-4">
                <p className="font-semibold text-white">{profile.city}</p>
                <p className="text-sm text-primary">{profile.region}</p>
              </div>

              {/* Botão WhatsApp */}
              <a
                href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors mb-4"
              >
                <MessageCircle size={20} />
                MENSAGEM
              </a>

              {/* Status */}
              <div className="text-center mb-4">
                <span className="inline-block bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Disponível
                </span>
              </div>

              {/* Aviso */}
              <div className="text-center text-xs bg-black/50 border border-primary rounded p-2">
                <p className="text-white">AO LIGAR DIGA QUE ME VIU NO <span className="text-primary font-bold">FARIALOVER</span></p>
              </div>
            </div>

            {/* Informações Detalhadas */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Idade</span>
                  <span className="font-semibold text-white">{profile.age}</span>
                </div>
                {profile.height && (
                  <div className="flex justify-between border-b border-[#333] pb-2">
                    <span className="text-gray-400">Altura</span>
                    <span className="font-semibold text-white">{profile.height}</span>
                  </div>
                )}
                {profile.weight && (
                  <div className="flex justify-between border-b border-[#333] pb-2">
                    <span className="text-gray-400">Peso</span>
                    <span className="font-semibold text-white">{profile.weight}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Manequim</span>
                  <span className="font-semibold text-white">38</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Biotipo</span>
                  <span className="font-semibold text-white">Magra</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Cabelos</span>
                  <span className="font-semibold text-white">Castanhos</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Olhos</span>
                  <span className="font-semibold text-white">Castanhos</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Seios</span>
                  <span className="font-semibold text-white">Silicone</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Pés</span>
                  <span className="font-semibold text-white">37</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Cintura</span>
                  <span className="font-semibold text-white">60</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Quadril</span>
                  <span className="font-semibold text-white">102</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Tatuagem</span>
                  <span className="font-semibold text-white">Sim</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Piercing</span>
                  <span className="font-semibold text-white">Não</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Fumante</span>
                  <span className="font-semibold text-white">Não</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Nível Cultural</span>
                  <span className="font-semibold text-white">Universitária</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-2">
                  <span className="text-gray-400">Idiomas</span>
                  <span className="font-semibold text-white">Português</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Signo</span>
                  <span className="font-semibold text-white">Escorpião</span>
                </div>
              </div>
            </div>

            {/* Contador de Acessos */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-2 font-semibold">ACESSOS NO MÊS</p>
              <div className="flex items-center justify-center gap-2">
                <Eye className="text-primary" size={24} />
                <span className="text-3xl font-bold text-primary">94083</span>
              </div>
            </div>

            {/* Badges de Verificação */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
              <VerificationBadges 
                isVerified={profile.isVerified}
                hasRealPhotos={profile.hasRealPhotos}
              />
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL - DIREITA */}
          <main className="space-y-6">
            {/* FOTO PRINCIPAL GRANDE (800x600px) */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
              <img
                src={profile.photoUrl || '/placeholder-profile.jpg'}
                alt={profile.name}
                className="w-full h-[600px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(0)}
              />
            </div>

            {/* Descrição Completa */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="text-white leading-relaxed space-y-4">
                <p>
                  <strong className="text-primary text-xl">{profile.name.toUpperCase()}.</strong> PRIMEIRA VEZ EM {profile.city.toUpperCase()}. Venha me conhecer e se encantar. <span className="text-primary font-bold">ALTO NÍVEL!</span>
                </p>
                
                <p className="text-gray-300">
                  – ANTECIPE SEU AGENDAMENTO!<br/>
                  – LIGAÇÕES: {profile.phone}<br/>
                  – WHATSAPP: {profile.phone}
                </p>

                <p className="text-gray-300">
                  (1) – ATENDO 24 HORAS DE SEGUNDA À SÁBADO EM HOTÉIS, MOTÉIS, ESCRITÓRIOS, RESIDÊNCIAS E EM LOCAL PRÓPRIO
                </p>

                <p className="text-gray-300">
                  (2) – POR SEGURANÇA EU PREFIRO NÃO ATENDER LIGAÇÕES PRIVADAS (CONFIDENCIAIS)
                </p>

                <p className="text-gray-300">
                  (3) – AGENDE SEU ENCONTRO COMIGO TAMBÉM PELO WHATSAPP {profile.phone} MAS SEJA GENTIL E OBJETIVO POR FAVOR
                </p>

                <p className="text-gray-300">
                  (4) – SE POSSÍVEL COM PELO MENOS 50 MINUTOS DE ANTECEDÊNCIA
                </p>

                <p className="text-gray-300">
                  (5) – ACEITO DINHEIRO, PIX E TODAS AS BANDEIRAS DE CARTÕES DE CRÉDITO/DÉBITO (CONSULTE ACRÉSCIMO)
                </p>

                <p className="text-gray-300">
                  (6) – AVALIE O MEU ATENDIMENTO DEIXANDO SEU COMENTÁRIO LOGO ABAIXO NO FINAL DA PÁGINA
                </p>
              </div>
            </div>

            {/* MEU PERFIL */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">MEU PERFIL</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white">
                <div>
                  <span className="text-gray-400">Quem:</span> <span className="font-semibold">Casais, Homens</span>
                </div>
                <div>
                  <span className="text-gray-400">Onde:</span> <span className="font-semibold">Escritório, Hotéis, Motéis, Privê, Residência</span>
                </div>
                <div>
                  <span className="text-gray-400">Quando:</span> <span className="font-semibold">2ª à 6ª feira, Sábado</span>
                </div>
                <div>
                  <span className="text-gray-400">Período:</span> <span className="font-semibold">24 Horas</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400">Disponível para:</span> <span className="font-semibold">Atendimento, Despedidas, Eventos, Festas, Jantares, Período, Pernoite</span>
                </div>
              </div>
            </div>

            {/* MEU ATENDIMENTO */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">MEU ATENDIMENTO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white">
                <div>
                  <span className="text-gray-400">Sexo Vaginal:</span> <span className="font-semibold">Sim</span>
                </div>
                <div>
                  <span className="text-gray-400">Sexo Oral:</span> <span className="font-semibold">Deixa-se Chupar, Oral C/ Preservativo</span>
                </div>
                <div>
                  <span className="text-gray-400">Sexo Anal:</span> <span className="font-semibold">Sim</span>
                </div>
                <div>
                  <span className="text-gray-400">Perfil:</span> <span className="font-semibold">Dominadora, Safadinha</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400">Fantasias:</span> <span className="font-semibold">Acessórios, Beijo na Boca, Dominação, Massagens, Pompoarismo, Roupa Erótica, Strip-tease</span>
                </div>
              </div>
            </div>

            {/* MEU CACHÊ */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">MEU CACHÊ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white">
                <div>
                  <span className="text-gray-400">1H:</span> <span className="font-semibold text-primary text-lg">R$ 400,00</span>
                </div>
                <div>
                  <span className="text-gray-400">2H:</span> <span className="font-semibold">A combinar</span>
                </div>
                <div>
                  <span className="text-gray-400">Pernoite:</span> <span className="font-semibold">A combinar</span>
                </div>
                <div>
                  <span className="text-gray-400">Casais:</span> <span className="font-semibold">A combinar</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400">Pagamento:</span> <span className="font-semibold">Dinheiro, Crédito, Débito, Pix (+) Deslocamento</span>
                </div>
              </div>
            </div>

            {/* Categorias */}
            {categories.length > 0 && (
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">CATEGORIAS</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Galeria de Fotos (SELFIES) */}
            {photos.length > 0 && (
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">SELFIES</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`Foto ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-[#333]"
                      onClick={() => openLightbox(index + 1)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Vídeos */}
            {videos.length > 0 && (
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">VÍDEOS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <video
                      key={video.id}
                      src={video.url}
                      controls
                      className="w-full rounded-lg border border-[#333]"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Áudios */}
            {audios.length > 0 && (
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">ÁUDIOS</h3>
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

            {/* Comentários/Elogios */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">MEUS ELOGIOS</h3>
              
              <div className="mb-6 text-sm text-gray-400 space-y-2">
                <p>SRS. USUÁRIOS - Este espaço é reservado SOMENTE para que você escreva o seu elogio ou simplesmente dê seu depoimento (elogioso) sobre algum encontro em que você teve com {profile.name}.</p>
                <p className="text-primary font-semibold">ATENÇÃO - Este NÃO É um canal de comunicação direto. O seu contato deverá ser realizado SOMENTE através do telefone {profile.phone}.</p>
              </div>

              {/* Formulário de Comentário */}
              <div className="mb-6 p-4 bg-black/50 rounded-lg border border-[#333]">
                <h4 className="font-semibold mb-3 text-white">PUBLICAR</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Avaliação</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={24}
                          className={`cursor-pointer transition-colors ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
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
                    className="bg-black/50 border-[#333] text-white"
                  />
                  <Textarea
                    placeholder="Seu comentário..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={4}
                    className="bg-black/50 border-[#333] text-white"
                  />
                  <Button
                    onClick={handleSubmitComment}
                    disabled={createCommentMutation.isPending}
                    className="w-full btn-gradient"
                  >
                    {createCommentMutation.isPending ? "Enviando..." : "PUBLICAR"}
                  </Button>
                </div>
              </div>

              {/* Lista de Comentários */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    Nenhum comentário ainda. Seja o primeiro!
                  </p>
                ) : (
                  comments.map((comment, idx) => (
                    <div key={comment.id} className={`p-4 rounded-lg border border-[#333] ${idx % 2 === 0 ? 'bg-black/30' : 'bg-black/50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-primary">{comment.authorName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-white mb-2">{comment.content}</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= comment.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }
                          />
                        ))}
                      </div>
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
