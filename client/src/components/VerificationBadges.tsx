import { CheckCircle2, Camera } from "lucide-react";

interface VerificationBadgesProps {
  isVerified?: boolean;
  hasRealPhotos?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function VerificationBadges({
  isVerified = false,
  hasRealPhotos = false,
  size = "md",
  className = "",
}: VerificationBadgesProps) {
  const sizeClasses = {
    sm: "text-xs gap-1 px-2 py-1",
    md: "text-sm gap-1.5 px-3 py-1.5",
    lg: "text-base gap-2 px-4 py-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  if (!isVerified && !hasRealPhotos) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {isVerified && (
        <div
          className={`inline-flex items-center ${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg`}
          title="Perfil Verificado"
        >
          <CheckCircle2 size={iconSizes[size]} />
          <span>Verificado</span>
        </div>
      )}
      
      {hasRealPhotos && (
        <div
          className={`inline-flex items-center ${sizeClasses[size]} rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold shadow-lg`}
          title="Fotos Reais Verificadas"
        >
          <Camera size={iconSizes[size]} />
          <span>Fotos Reais</span>
        </div>
      )}
    </div>
  );
}
