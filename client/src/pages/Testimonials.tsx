import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import { Star, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = trpc.testimonials.list.useQuery({
    isVerified: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Espaçamento para header fixo */}
      <div className="h-20" />

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text text-center mb-4">
            Depoimentos Verificados
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Confira avaliações reais de clientes satisfeitos com nossos serviços
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando depoimentos...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum depoimento disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all shadow-lg"
                >
                  {/* Header do depoimento */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {testimonial.authorPhoto ? (
                        <img
                          src={testimonial.authorPhoto}
                          alt={testimonial.authorName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {testimonial.authorName}
                          {testimonial.isVerified && (
                            <CheckCircle2 size={16} className="text-primary" />
                          )}
                        </h3>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < testimonial.rating ? "star filled" : "star"}
                              fill={i < testimonial.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do depoimento */}
                  <p className="text-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Data */}
                  <p className="text-xs text-muted-foreground mt-4">
                    {new Date(testimonial.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 border-t border-border mt-12">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 farialover. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
