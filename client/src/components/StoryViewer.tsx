import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Phone, MessageCircle, User } from "lucide-react";
import { Link } from "wouter";

interface Story {
  id: number;
  profileId: number;
  profileName: string;
  profilePhoto: string;
  profilePhone: string;
  imageUrl: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000; // 5 segundos

  const currentStory = stories[currentIndex];

  // Progresso automático
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Avançar para próximo story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            onClose();
          }
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length, onClose]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
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
  }, [currentIndex]);

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header com barra de progresso */}
        <div className="story-header">
          {/* Barras de progresso */}
          <div className="story-progress-bars">
            {stories.map((_, index) => (
              <div key={index} className="story-progress-bar-wrapper">
                <div
                  className="story-progress-bar"
                  style={{
                    width: index < currentIndex ? "100%" : index === currentIndex ? `${progress}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Info do perfil */}
          <div className="story-profile-info">
            <Link href={`/perfil/${currentStory.profileId}`} onClick={onClose}>
              <img
                src={currentStory.profilePhoto}
                alt={currentStory.profileName}
                className="story-profile-avatar"
              />
            </Link>
            <Link href={`/perfil/${currentStory.profileId}`} onClick={onClose}>
              <span className="story-profile-name">{currentStory.profileName}</span>
            </Link>
            <button onClick={onClose} className="story-close-btn">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Imagem do story */}
        <div className="story-content">
          <img
            src={currentStory.imageUrl}
            alt={currentStory.profileName}
            className="story-image"
          />
        </div>

        {/* Navegação */}
        {currentIndex > 0 && (
          <button onClick={handlePrevious} className="story-nav-btn story-nav-prev">
            <ChevronLeft size={32} />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button onClick={handleNext} className="story-nav-btn story-nav-next">
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
