import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Users, Video, Music, MessageSquare, Tags, Plus } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'profiles' | 'videos' | 'audios' | 'comments' | 'categories'>('profiles');

  const { data: profiles = [] } = trpc.profiles.list.useQuery({}, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: allComments = [] } = trpc.comments.listAll.useQuery({ approvedOnly: false }, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: categories = [] } = trpc.categories.list.useQuery();

  const approveCommentMutation = trpc.comments.approve.useMutation({
    onSuccess: () => {
      toast.success("Comentário aprovado!");
    },
  });

  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onSuccess: () => {
      toast.success("Comentário deletado!");
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-20 md:h-24"></div>
        <div className="container py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-20 md:h-24"></div>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-6">Você precisa estar logado para acessar o painel administrativo.</p>
          <a href={getLoginUrl()} className="btn-gradient px-6 py-3 rounded-md inline-block">
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-20 md:h-24"></div>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-20 md:h-24"></div>

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Painel Administrativo</h1>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Perfis</p>
                <p className="text-2xl font-bold">{profiles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <MessageSquare size={24} className="text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comentários Pendentes</p>
                <p className="text-2xl font-bold">
                  {allComments.filter(c => !c.isApproved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Tags size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categorias</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Perfis VIP</p>
                <p className="text-2xl font-bold">
                  {profiles.filter(p => p.isVip).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg border border-border">
          <div className="flex border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'profiles'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Perfis
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'comments'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Comentários
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Categorias
            </button>
          </div>

          <div className="p-6">
            {/* Tab: Perfis */}
            {activeTab === 'profiles' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Gerenciar Perfis</h2>
                  <Button className="btn-gradient">
                    <Plus size={20} className="mr-2" />
                    Novo Perfil
                  </Button>
                </div>

                <div className="space-y-2">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between p-4 bg-background rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={profile.photoUrl || '/placeholder-profile.jpg'}
                          alt={profile.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold">{profile.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {profile.city} - {profile.age} anos
                          </p>
                          <div className="flex gap-2 mt-1">
                            {profile.isVip && <span className="tag text-xs">VIP</span>}
                            {profile.isFeatured && <span className="tag text-xs">Destaque</span>}
                            {!profile.isActive && <span className="tag text-xs bg-destructive">Inativo</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="destructive" size="sm">Deletar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Comentários */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Moderar Comentários</h2>

                {allComments.filter(c => !c.isApproved).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum comentário pendente
                  </p>
                ) : (
                  <div className="space-y-4">
                    {allComments
                      .filter(c => !c.isApproved)
                      .map((comment) => {
                        const profile = profiles.find(p => p.id === comment.profileId);
                        return (
                          <div key={comment.id} className="p-4 bg-background rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">{comment.authorName}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Perfil: {profile?.name || 'Desconhecido'} | {comment.rating} estrelas
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-foreground mb-4">{comment.content}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="btn-gradient"
                                onClick={() => approveCommentMutation.mutate({ id: comment.id })}
                                disabled={approveCommentMutation.isPending}
                              >
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteCommentMutation.mutate({ id: comment.id })}
                                disabled={deleteCommentMutation.isPending}
                              >
                                Deletar
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Categorias */}
            {activeTab === 'categories' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
                  <Button className="btn-gradient">
                    <Plus size={20} className="mr-2" />
                    Nova Categoria
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 bg-background rounded-lg border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="tag"
                          style={{ background: category.color || undefined }}
                        >
                          {category.name}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm">
                          Deletar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-card py-8 border-t border-border mt-12">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 farialover. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
