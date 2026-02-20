import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, MessageCircle, Link2, Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  profileUrl: string;
}

export default function ShareModal({ isOpen, onClose, profileName, profileUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `Confira o perfil de ${profileName} no Farialover`;
  const fullUrl = `${window.location.origin}${profileUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profileName,
          text: shareText,
          url: fullUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed");
      }
    } else {
      toast.error("Compartilhamento não suportado neste navegador");
    }
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + fullUrl)}`,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md w-[calc(100%-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg sm:text-xl font-bold">
            Compartilhar Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          {/* Web Share API (mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              onClick={handleWebShare}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-sm sm:text-base py-2 sm:py-2.5"
            >
              <Share2 className="mr-2" size={18} />
              Compartilhar
            </Button>
          )}

          {/* Social Media Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Button
              onClick={() => window.open(shareUrls.facebook, '_blank', 'width=600,height=400')}
              className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white py-2 sm:py-2.5"
            >
              <Facebook size={18} className="sm:w-5 sm:h-5" />
            </Button>

            <Button
              onClick={() => window.open(shareUrls.twitter, '_blank', 'width=600,height=400')}
              className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white py-2 sm:py-2.5"
            >
              <Twitter size={18} className="sm:w-5 sm:h-5" />
            </Button>

            <Button
              onClick={() => window.open(shareUrls.whatsapp, '_blank')}
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white py-2 sm:py-2.5"
            >
              <MessageCircle size={18} className="sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Copy Link */}
          <div className="border border-border rounded-lg p-2 sm:p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-medium">Link do Perfil</span>
              <Button
                onClick={handleCopyLink}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/90"
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Link2 size={16} className="mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <div className="bg-background rounded p-2 text-sm text-foreground break-all">
              {fullUrl}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
