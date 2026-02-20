import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Users, MessageSquare, Eye, AlertCircle, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: comments, isLoading: commentsLoading, refetch: refetchComments } = trpc.comments.listAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const approveCommentMutation = trpc.comments.approve.useMutation({
    onSuccess: () => {
      toast.success("Comentário aprovado com sucesso!");
      refetchComments();
    },
    onError: (error) => {
      toast.error("Erro ao aprovar comentário: " + error.message);
    },
  });

  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onSuccess: () => {
      toast.success("Comentário excluído com sucesso!");
      refetchComments();
    },
    onError: (error) => {
      toast.error("Erro ao excluir comentário: " + error.message);
    },
  });

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-2xl text-white">Carregando...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground mb-6">Você não tem permissão para acessar esta página.</p>
        <Button onClick={() => setLocation("/")} className="bg-primary hover:bg-primary/90">
          Voltar para Home
        </Button>
      </div>
    );
  }

  const pendingComments = comments?.filter(c => !c.approved) || [];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029969419/HlWSCrNFRUWDTqJt.png" 
                alt="Farialover" 
                className="h-16 cursor-pointer" 
                onClick={() => setLocation("/")} 
              />
              <h1 className="text-2xl font-bold text-primary">Painel Administrativo</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground text-sm">Admin: {user.name}</span>
              <Button 
                onClick={() => setLocation("/")} 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Voltar ao Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total de Perfis</p>
                <p className="text-3xl font-bold text-foreground">{stats?.totalProfiles || 0}</p>
              </div>
              <Users size={40} className="text-primary" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total de Comentários</p>
                <p className="text-3xl font-bold text-foreground">{stats?.totalComments || 0}</p>
              </div>
              <MessageSquare size={40} className="text-blue-500" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Comentários Pendentes</p>
                <p className="text-3xl font-bold text-yellow-500">{stats?.pendingComments || 0}</p>
              </div>
              <AlertCircle size={40} className="text-yellow-500" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total de Visualizações</p>
                <p className="text-3xl font-bold text-foreground">{stats?.totalViews || 0}</p>
              </div>
              <Eye size={40} className="text-green-500" />
            </div>
          </Card>
        </div>

        {/* Moderação de Comentários */}
        <Card className="bg-card border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Moderação de Comentários
            {pendingComments.length > 0 && (
              <span className="ml-2 text-sm text-yellow-500">
                ({pendingComments.length} pendentes)
              </span>
            )}
          </h2>

          {commentsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando comentários...</div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card 
                  key={comment.id} 
                  className={`p-4 ${comment.approved ? 'bg-green-900/10 border-green-500/30' : 'bg-yellow-900/10 border-yellow-500/30'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-foreground">{comment.author_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString('pt-BR')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${comment.approved ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                          {comment.approved ? 'Aprovado' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-foreground mb-2">{comment.comment_text}</p>
                      <p className="text-xs text-muted-foreground">Perfil ID: {comment.profile_id}</p>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      {!comment.approved && (
                        <Button
                          onClick={() => approveCommentMutation.mutate({ commentId: comment.id })}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={approveCommentMutation.isPending}
                        >
                          <Check size={16} className="mr-1" />
                          Aprovar
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este comentário?')) {
                            deleteCommentMutation.mutate({ commentId: comment.id });
                          }
                        }}
                        size="sm"
                        variant="destructive"
                        disabled={deleteCommentMutation.isPending}
                      >
                        <X size={16} className="mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum comentário encontrado.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
