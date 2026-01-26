import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Phone, MessageCircle, User } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface Story {
  id: number;
  profileId: number;
  profileName: string;
  profilePhoto: string;
  profilePhone: string;
  images: string[]; // array de URLs de imagens
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000; // 5 segundos por imagem

  const currentStory = stories[currentStoryIndex];
  
  // Buscar fotos adicionais do perfil atual
  const { data: additionalPhotos = [] } = trpc.profiles.getPhotos.useQuery({ 
    profileId: currentStory.profileId 
  });
  
  // Combinar foto principal com fotos adicionais
  const allImages = [
    ...currentStory.images,
    ...additionalPhotos.map(photo => photo.url)
  ];
  
  const currentImage = allImages[currentImageIndex] || allImages[0];
  const totalImages = allImages.length;

  // Progresso automático
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, currentImageIndex]);

  const handleNext = () => {
    // Se ainda tem imagens neste story, avança para próxima imagem
    if (currentImageIndex < totalImages - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      // Próximo story
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentImageIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    // Se não é a primeira imagem, volta para imagem anterior
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      // Story anterior
      const previousStory = stories[currentStoryIndex - 1];
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentImageIndex(previousStory.images.length - 1); // Última imagem do story anterior
      setProgress(0);
    }
  };

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStoryIndex, currentImageIndex]);

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header com barra de progresso */}
        <div className="story-header">
          {/* Barras de progresso - uma para cada imagem do story atual */}
          <div className="story-progress-bars">
            {allImages.map((_, index) => (
              <div key={index} className="story-progress-bar">
                <div
                  className="story-progress-fill"
                  style={{
                    width: index < currentImageIndex ? "100%" : index === currentImageIndex ? `${progress}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Info do perfil */}
          <div className="story-profile-info">
            <img src={currentStory.profilePhoto} alt={currentStory.profileName} />
            <span>{currentStory.profileName}</span>
          </div>

          {/* Botão fechar */}
          <button className="story-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Imagem do story */}
        <img
          src={currentImage}
          alt={currentStory.profileName}
          className="story-image"
        />

        {/* Botões de navegação */}
        {currentStoryIndex > 0 && (
          <button className="story-nav-btn story-nav-prev" onClick={handlePrevious}>
            <ChevronLeft size={32} />
          </button>
        )}
        {currentStoryIndex < stories.length - 1 && (
          <button className="story-nav-btn story-nav-next" onClick={handleNext}>
            <ChevronRight size={32} />
          </button>
        )}

        {/* Botões de ação na parte inferior */}
        <div className="story-actions">
          <a
            href={`tel:${currentStory.profilePhone.replace(/\D/g, '')}`}
            className="story-action-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone size={20} />
            <span>Ligar</span>
          </a>
          <a
            href={`https://wa.me/55${currentStory.profilePhone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="story-action-btn story-action-whatsapp"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle size={20} />
            <span>WhatsApp</span>
          </a>
          <Link
            href={`/perfil/${currentStory.profileId}`}
            className="story-action-btn"
            onClick={onClose}
          >
            <User size={20} />
            <span>Perfil</span>
          </Link>
        </div>

        {/* Áreas clicáveis para navegação */}
        <div className="story-click-area story-click-prev" onClick={handlePrevious} />
        <div className="story-click-area story-click-next" onClick={handleNext} />
      </div>
    </div>
  );
}
