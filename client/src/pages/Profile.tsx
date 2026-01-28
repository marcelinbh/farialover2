import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Phone, Share2, Star, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRoute, useLocation } from "wouter";

export default function Profile() {
  const [, params] = useRoute("/perfil/:id");
  const [, setLocation] = useLocation();
  const profileId = params?.id ? parseInt(params.id) : null;

  const { data: profiles, isLoading } = trpc.profiles.list.useQuery();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-foreground">Carregando...</div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0 || !profileId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-foreground">Perfil não encontrado</div>
      </div>
    );
  }

  const currentIndex = profiles.findIndex((p) => p.id === profileId);
  const profile = profiles[currentIndex];

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-foreground">Perfil não encontrado</div>
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

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="text-foreground hover:text-primary"
              >
                <ArrowLeft size={20} className="mr-2" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold">
                <span className="text-primary">faria</span>
                <span className="text-secondary">lover</span>
              </h1>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">HOME</a>
              <a href="#modelos" className="text-foreground hover:text-primary transition-colors font-medium">MODELOS</a>
              <a href="#cidades" className="text-foreground hover:text-primary transition-colors font-medium">CIDADES</a>
            </nav>

            <div className="flex items-center space-x-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card border border-border p-6 sticky top-24">
              {/* Profile Info */}
              <div className="text-center mb-6">
                <img
                  src={profile.avatar_url || profile.photos[0]?.url}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary"
                />
                <h2 className="text-2xl font-bold text-foreground mb-2">{profile.name}</h2>
                {profile.highlight_tag && (
                  <span className="inline-block bg-black text-primary border-2 border-primary px-3 py-1 text-sm font-bold mb-4">
                    {profile.highlight_tag}
                  </span>
                )}
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-secondary text-secondary" />
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-foreground">
                  <Phone size={18} className="mr-2 text-primary" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                {profile.whatsapp && (
                  <div className="flex items-center text-foreground">
                    <span className="text-sm">WhatsApp: {profile.whatsapp}</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-muted-foreground border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Idade:</span>
                  <span className="text-foreground">{profile.age} anos</span>
                </div>
                <div className="flex justify-between">
                  <span>Altura:</span>
                  <span className="text-foreground">{profile.height} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Peso:</span>
                  <span className="text-foreground">{profile.weight} kg</span>
                </div>
                {profile.body_type && (
                  <div className="flex justify-between">
                    <span>Biotipo:</span>
                    <span className="text-foreground">{profile.body_type}</span>
                  </div>
                )}
                {profile.hair_color && (
                  <div className="flex justify-between">
                    <span>Cabelos:</span>
                    <span className="text-foreground">{profile.hair_color}</span>
                  </div>
                )}
                {profile.eye_color && (
                  <div className="flex justify-between">
                    <span>Olhos:</span>
                    <span className="text-foreground">{profile.eye_color}</span>
                  </div>
                )}
                {profile.zodiac_sign && (
                  <div className="flex justify-between">
                    <span>Signo:</span>
                    <span className="text-foreground">{profile.zodiac_sign}</span>
                  </div>
                )}
              </div>

              {/* Price */}
              {profile.price_per_hour && (
                <div className="mt-6 border-t border-border pt-4">
                  <h3 className="text-sm font-bold text-foreground mb-2">CACHÊ</h3>
                  <div className="text-2xl font-bold text-secondary">
                    R$ {profile.price_per_hour.toFixed(2)}
                    <span className="text-sm text-muted-foreground"> / hora</span>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-6 flex space-x-2">
                <Button
                  onClick={goToPrevious}
                  className="flex-1 bg-primary hover:bg-primary/80 text-black"
                >
                  <ChevronLeft size={18} />
                  Anterior
                </Button>
                <Button
                  onClick={goToNext}
                  className="flex-1 bg-primary hover:bg-primary/80 text-black"
                >
                  Próximo
                  <ChevronRight size={18} />
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Photo */}
            <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={profile.photos[selectedPhotoIndex]?.url || profile.photos[0]?.url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              {profile.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-3 rounded-full"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-3 rounded-full"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Photo Gallery */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">GALERIA DE FOTOS</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`aspect-[2/3] overflow-hidden rounded-lg cursor-pointer transition-all ${
                      index === selectedPhotoIndex
                        ? "ring-4 ring-primary"
                        : "hover:ring-2 hover:ring-secondary"
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={`${profile.name} - Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <Card className="bg-card border border-border p-6 mb-8">
                <h3 className="text-xl font-bold text-foreground mb-4">SOBRE MIM</h3>
                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
              </Card>
            )}

            {/* Services */}
            {profile.services && profile.services.length > 0 && (
              <Card className="bg-card border border-border p-6 mb-8">
                <h3 className="text-xl font-bold text-foreground mb-4">SERVIÇOS</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.services.map((service, index) => (
                    <span
                      key={index}
                      className="bg-muted text-foreground px-3 py-1 rounded-full text-sm border border-primary"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Location */}
            <Card className="bg-card border border-border p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">LOCALIZAÇÃO</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <span className="font-bold text-foreground">Cidade:</span> {profile.city}
                </p>
                {profile.neighborhood && (
                  <p>
                    <span className="font-bold text-foreground">Bairro:</span> {profile.neighborhood}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
