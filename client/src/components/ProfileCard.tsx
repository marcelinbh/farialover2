import { Link } from "wouter";
import { Phone, Share2, Star } from "lucide-react";
import { Profile } from "../../../drizzle/schema";

interface ProfileCardProps {
  profile: Profile;
  categories?: Array<{ id: number; name: string; color?: string }>;
}

export default function ProfileCard({ profile, categories = [] }: ProfileCardProps) {
  const whatsappUrl = `https://wa.me/${profile.phone.replace(/\D/g, '')}`;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: profile.name,
        text: `Confira o perfil de ${profile.name}`,
        url: window.location.origin + `/profile/${profile.id}`,
      });
    }
  };

  return (
    <div className="profile-card">
      <Link href={`/profile/${profile.id}`}>
        <a className="block relative aspect-[3/4] overflow-hidden">
          <img
            src={profile.photoUrl || '/placeholder-profile.jpg'}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          {profile.isVip && (
            <div className="absolute top-2 right-2 tag">
              VIP
            </div>
          )}
        </a>
      </Link>
      
      <div className="p-4 space-y-3">
        {/* Categorias */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 2).map(cat => (
              <span
                key={cat.id}
                className="tag text-xs"
                style={{ background: cat.color || undefined }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Nome e Idade */}
        <Link href={`/profile/${profile.id}`}>
          <a className="block">
            <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors">
              {profile.name}
            </h3>
          </a>
        </Link>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{profile.age} anos</p>
          {profile.height && profile.weight && (
            <p>{profile.height} m, {profile.weight} kg</p>
          )}
          <p className="text-foreground">{profile.city}</p>
          {profile.region && <p>{profile.region}</p>}
        </div>

        {/* Rating */}
        {profile.ratingCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(Number(profile.rating)) ? "star filled" : "star"}
                  fill={i < Math.round(Number(profile.rating)) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({profile.ratingCount})
            </span>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-2 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-gradient px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2"
          >
            <Phone size={16} />
            {profile.phone}
          </a>
          <button
            onClick={handleShare}
            className="p-2 bg-muted hover:bg-accent rounded-md transition-colors"
            title="Compartilhar"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
