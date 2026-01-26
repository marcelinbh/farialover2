import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Star, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TestimonialsSection() {
  const { data: testimonials = [] } = trpc.testimonials.list.useQuery({
    isVerified: true,
    isFeatured: true,
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold gradient-text">DEPOIMENTOS VERIFICADOS</h2>
            <p className="text-muted-foreground mt-2">
              Avaliações reais de clientes satisfeitos
            </p>
          </div>
          <Link href="/depoimentos">
            <Button variant="outline" className="flex items-center gap-2">
              Ver Todos
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
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
              <p className="text-foreground leading-relaxed line-clamp-4">
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
      </div>
    </section>
  );
}
