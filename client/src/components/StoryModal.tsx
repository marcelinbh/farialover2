import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Phone, X } from "lucide-react";
import { useEffect } from "react";

interface Profile {
  id: number;
  name: string;
  phone: string;
  whatsapp?: string | null;
  photos: { id: number; url: string }[];
  avatar_url?: string | null;
}

interface StoryModalProps {
  profile: Profile;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewProfile: () => void;
}

export default function StoryModal({
  profile,
  onClose,
  onPrevious,
  onNext,
  onViewProfile,
}: StoryModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const storyPhoto = profile.photos[0]?.url || profile.avatar_url || "";
  const whatsappNumber = profile.whatsapp || profile.phone.replace(/\D/g, "");

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
      >
        <X size={32} />
      </button>

      {/* Previous Button */}
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
      >
        <ChevronRight size={32} />
      </button>

      {/* Story Content */}
      <div className="relative w-full max-w-md h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
          <div className="flex items-center space-x-3">
            <img
              src={profile.avatar_url || profile.photos[0]?.url}
              alt={profile.name}
              className="w-10 h-10 rounded-full border-2 border-primary object-cover"
            />
            <div>
              <p className="text-white font-bold">{profile.name}</p>
              <p className="text-white/70 text-sm">Agora</p>
            </div>
          </div>
        </div>

        {/* Story Image/Video */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={storyPhoto}
            alt={profile.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex justify-center space-x-3">
            <Button
              onClick={() => window.open(`tel:${profile.phone}`, "_self")}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            >
              <Phone size={18} className="mr-2" />
              Ligar
            </Button>
            <Button
              onClick={() =>
                window.open(
                  `https://wa.me/${whatsappNumber}?text=Olá, vi seu perfil no Farialover`,
                  "_blank"
                )
              }
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </Button>
            <Button
              onClick={onViewProfile}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            >
              Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
