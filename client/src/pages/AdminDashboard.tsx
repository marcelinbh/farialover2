import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { 
  Users, DollarSign, MessageSquare, Activity, 
  CheckCircle, XCircle, Eye, EyeOff, Star, Crown,
  Shield, Image, Clock, TrendingUp
} from "lucide-react";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profiles' | 'payments' | 'comments' | 'logs'>('dashboard');

  const utils = trpc.useUtils();

  // Queries
  const { data: stats } = trpc.admin.getStats.useQuery(undefined, { 
    enabled: isAuthenticated && user?.role === 'admin' 
  });
  
  const { data: profiles = [] } = trpc.profiles.search.useQuery({}, { 
    enabled: isAuthenticated && user?.role === 'admin' 
  });
  
  const { data: payments = [] } = trpc.admin.getPayments.useQuery(undefined, { 
    enabled: isAuthenticated && user?.role === 'admin' 
  });
  
  const { data: allComments = [] } = trpc.comments.listAll.useQuery({ approvedOnly: false }, { 
    enabled: isAuthenticated && user?.role === 'admin' 
  });
  
  const { data: logs = [] } = trpc.admin.getLogs.useQuery({ limit: 50 }, { 
    enabled: isAuthenticated && user?.role === 'admin' 
  });

  // Mutations - Perfis
  const approveProfileMutation = trpc.admin.approveProfile.useMutation({
    onSuccess: () => {
      toast.success("Perfil aprovado com sucesso!");
      utils.profiles.list.invalidate();
      utils.admin.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const rejectProfileMutation = trpc.admin.rejectProfile.useMutation({
    onSuccess: () => {
      toast.success("Perfil rejeitado!");
      utils.profiles.list.invalidate();
      utils.admin.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const toggleProfileActiveMutation = trpc.admin.toggleProfileActive.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado!");
      utils.profiles.list.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  const toggleProfileFeatureMutation = trpc.admin.toggleProfileFeature.useMutation({
    onSuccess: () => {
      toast.success("Recurso atualizado!");
      utils.profiles.list.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  // Mutations - Pagamentos
  const createPaymentMutation = trpc.admin.createPayment.useMutation({
    onSuccess: () => {
      toast.success("Pagamento registrado!");
      utils.admin.getPayments.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  const confirmPaymentMutation = trpc.admin.confirmPayment.useMutation({
    onSuccess: () => {
      toast.success("Pagamento confirmado!");
      utils.admin.getPayments.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  // Mutations - Comentários
  const approveCommentMutation = trpc.comments.approve.useMutation({
    onSuccess: () => {
      toast.success("Comentário aprovado!");
      utils.comments.listAll.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onSuccess: () => {
      toast.success("Comentário deletado!");
      utils.comments.listAll.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  // Estados para formulários
  const [rejectReason, setRejectReason] = useState("");
  const [selectedProfileForReject, setSelectedProfileForReject] = useState<number | null>(null);
  
  const [paymentForm, setPaymentForm] = useState({
    profileId: 0,
    amount: "",
    paymentType: "vip" as "vip" | "featured" | "verification" | "monthly",
    pixKey: "",
    transactionId: "",
    notes: "",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">Você precisa estar logado para acessar o painel administrativo.</p>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Fazer Login
          </Button>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        </Card>
      </div>
    );
  }

  const handleApproveProfile = (profileId: number) => {
    approveProfileMutation.mutate({ profileId });
  };

  const handleRejectProfile = () => {
    if (!selectedProfileForReject || !rejectReason.trim()) {
      toast.error("Informe o motivo da rejeição");
      return;
    }
    rejectProfileMutation.mutate({ 
      profileId: selectedProfileForReject, 
      reason: rejectReason 
    });
    setSelectedProfileForReject(null);
    setRejectReason("");
  };

  const handleToggleActive = (profileId: number, isActive: boolean) => {
    toggleProfileActiveMutation.mutate({ profileId, isActive: !isActive });
  };

  const handleToggleFeature = (profileId: number, feature: "isFeatured" | "isVip" | "isVerified" | "hasRealPhotos", currentValue: boolean) => {
    toggleProfileFeatureMutation.mutate({ profileId, feature, value: !currentValue });
  };

  const handleCreatePayment = () => {
    if (!paymentForm.profileId || !paymentForm.amount) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    createPaymentMutation.mutate(paymentForm);
    setPaymentForm({
      profileId: 0,
      amount: "",
      paymentType: "vip",
      pixKey: "",
      transactionId: "",
      notes: "",
    });
  };

  const handleConfirmPayment = (paymentId: number) => {
    confirmPaymentMutation.mutate({ paymentId });
  };

  const handleApproveComment = (commentId: number) => {
    approveCommentMutation.mutate({ id: commentId });
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate({ id: commentId });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="h-20" />

      <div className="container py-8">
        <h1 className="text-4xl font-bold gradient-text mb-8">Painel Administrativo</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2"
          >
            <Activity size={18} />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'profiles' ? 'default' : 'outline'}
            onClick={() => setActiveTab('profiles')}
            className="flex items-center gap-2"
          >
            <Users size={18} />
            Perfis ({stats?.pendingApproval || 0})
          </Button>
          <Button
            variant={activeTab === 'payments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('payments')}
            className="flex items-center gap-2"
          >
            <DollarSign size={18} />
            Pagamentos ({stats?.pendingPayments || 0})
          </Button>
          <Button
            variant={activeTab === 'comments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('comments')}
            className="flex items-center gap-2"
          >
            <MessageSquare size={18} />
            Comentários ({stats?.pendingComments || 0})
          </Button>
          <Button
            variant={activeTab === 'logs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('logs')}
            className="flex items-center gap-2"
          >
            <Clock size={18} />
            Logs
          </Button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Perfis</p>
                    <p className="text-3xl font-bold">{stats.totalProfiles}</p>
                  </div>
                  <Users className="text-primary" size={32} />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Perfis Ativos</p>
                    <p className="text-3xl font-bold">{stats.activeProfiles}</p>
                  </div>
                  <CheckCircle className="text-green-500" size={32} />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Aguardando Aprovação</p>
                    <p className="text-3xl font-bold text-yellow-500">{stats.pendingApproval}</p>
                  </div>
                  <Clock className="text-yellow-500" size={32} />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Total</p>
                    <p className="text-3xl font-bold text-green-500">R$ {stats.totalRevenue}</p>
                  </div>
                  <TrendingUp className="text-green-500" size={32} />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Perfis Premium</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VIP:</span>
                    <span className="font-bold">{stats.vipProfiles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destaque:</span>
                    <span className="font-bold">{stats.featuredProfiles}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Pagamentos</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pendentes:</span>
                    <span className="font-bold text-yellow-500">{stats.pendingPayments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confirmados:</span>
                    <span className="font-bold text-green-500">{stats.confirmedPayments}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Comentários</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pendentes:</span>
                    <span className="font-bold text-yellow-500">{stats.pendingComments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aprovados:</span>
                    <span className="font-bold text-green-500">{stats.approvedComments}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Gerenciamento de Perfis</h2>
            
            {profiles.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum perfil cadastrado</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <Card key={profile.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {profile.photoUrl && (
                        <img
                          src={profile.photoUrl}
                          alt={profile.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold">{profile.name}</h3>
                            <p className="text-muted-foreground">
                              {profile.age} anos • {profile.city}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {profile.approvalStatus === 'pending' && (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                                Pendente
                              </Badge>
                            )}
                            {profile.approvalStatus === 'approved' && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Aprovado
                              </Badge>
                            )}
                            {profile.approvalStatus === 'rejected' && (
                              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                                Rejeitado
                              </Badge>
                            )}
                            {profile.isActive && (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                                Ativo
                              </Badge>
                            )}
                            {profile.isVip && (
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                                <Crown size={14} className="mr-1" />
                                VIP
                              </Badge>
                            )}
                            {profile.isFeatured && (
                              <Badge variant="outline" className="bg-pink-500/10 text-pink-500">
                                <Star size={14} className="mr-1" />
                                Destaque
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {profile.approvalStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveProfile(profile.id)}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle size={16} />
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setSelectedProfileForReject(profile.id)}
                                className="flex items-center gap-2"
                              >
                                <XCircle size={16} />
                                Rejeitar
                              </Button>
                            </>
                          )}
                          
                          {profile.approvalStatus === 'approved' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleActive(profile.id, profile.isActive)}
                                className="flex items-center gap-2"
                              >
                                {profile.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                {profile.isActive ? 'Desativar' : 'Ativar'}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleFeature(profile.id, "isVip", profile.isVip)}
                                className="flex items-center gap-2"
                              >
                                <Crown size={16} />
                                {profile.isVip ? 'Remover VIP' : 'Tornar VIP'}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleFeature(profile.id, "isFeatured", profile.isFeatured)}
                                className="flex items-center gap-2"
                              >
                                <Star size={16} />
                                {profile.isFeatured ? 'Remover Destaque' : 'Destacar'}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleFeature(profile.id, "isVerified", profile.isVerified)}
                                className="flex items-center gap-2"
                              >
                                <Shield size={16} />
                                {profile.isVerified ? 'Remover Verificação' : 'Verificar'}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleFeature(profile.id, "hasRealPhotos", profile.hasRealPhotos)}
                                className="flex items-center gap-2"
                              >
                                <Image size={16} />
                                {profile.hasRealPhotos ? 'Desmarcar Fotos Reais' : 'Marcar Fotos Reais'}
                              </Button>
                            </>
                          )}
                        </div>

                        {selectedProfileForReject === profile.id && (
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2">Motivo da Rejeição:</h4>
                            <Textarea
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Descreva o motivo da rejeição..."
                              className="mb-2"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleRejectProfile}>
                                Confirmar Rejeição
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedProfileForReject(null);
                                  setRejectReason("");
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}

                        {profile.rejectionReason && (
                          <div className="mt-4 p-4 bg-red-500/10 rounded-lg">
                            <p className="text-sm text-red-500">
                              <strong>Motivo da rejeição:</strong> {profile.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Registrar Novo Pagamento PIX</h2>
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Perfil ID *</label>
                    <Input
                      type="number"
                      value={paymentForm.profileId || ""}
                      onChange={(e) => setPaymentForm({ ...paymentForm, profileId: parseInt(e.target.value) || 0 })}
                      placeholder="ID do perfil"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor (R$) *</label>
                    <Input
                      type="text"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      placeholder="100.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Pagamento *</label>
                    <select
                      value={paymentForm.paymentType}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentType: e.target.value as any })}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="vip">VIP</option>
                      <option value="featured">Destaque</option>
                      <option value="verification">Verificação</option>
                      <option value="monthly">Mensalidade</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Chave PIX</label>
                    <Input
                      type="text"
                      value={paymentForm.pixKey}
                      onChange={(e) => setPaymentForm({ ...paymentForm, pixKey: e.target.value })}
                      placeholder="Chave PIX usada"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">ID da Transação</label>
                    <Input
                      type="text"
                      value={paymentForm.transactionId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                      placeholder="ID da transação PIX"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Observações</label>
                    <Textarea
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      placeholder="Observações sobre o pagamento..."
                    />
                  </div>
                </div>
                
                <Button onClick={handleCreatePayment} className="mt-4">
                  Registrar Pagamento
                </Button>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Pagamentos Registrados</h2>
              {payments.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum pagamento registrado</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <Card key={payment.id} className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold">Perfil ID: {payment.profileId}</h3>
                            {payment.status === 'pending' && (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                                Pendente
                              </Badge>
                            )}
                            {payment.status === 'confirmed' && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Confirmado
                              </Badge>
                            )}
                            {payment.status === 'cancelled' && (
                              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                                Cancelado
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <p><strong>Valor:</strong> R$ {payment.amount}</p>
                            <p><strong>Tipo:</strong> {payment.paymentType}</p>
                            {payment.pixKey && <p><strong>Chave PIX:</strong> {payment.pixKey}</p>}
                            {payment.transactionId && <p><strong>ID Transação:</strong> {payment.transactionId}</p>}
                            {payment.notes && <p><strong>Obs:</strong> {payment.notes}</p>}
                            <p className="text-muted-foreground">
                              Criado em: {new Date(payment.createdAt).toLocaleString('pt-BR')}
                            </p>
                            {payment.paidAt && (
                              <p className="text-green-500">
                                Pago em: {new Date(payment.paidAt).toLocaleString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {payment.status === 'pending' && (
                          <div className="flex items-center">
                            <Button
                              onClick={() => handleConfirmPayment(payment.id)}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle size={16} />
                              Confirmar Pagamento
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Moderação de Comentários</h2>
            
            {allComments.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum comentário encontrado</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {allComments.map((comment) => (
                  <Card key={comment.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">{comment.authorName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Perfil ID: {comment.profileId} • {new Date(comment.createdAt).toLocaleString('pt-BR')}
                        </p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < comment.rating ? "star filled" : "star"}
                              fill={i < comment.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {comment.isApproved ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Aprovado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                          Pendente
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-foreground mb-4">{comment.content}</p>
                    
                    <div className="flex gap-2">
                      {!comment.isApproved && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveComment(comment.id)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Aprovar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        Deletar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Logs Administrativos</h2>
            
            {logs.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum log encontrado</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <Card key={log.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{log.action}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {log.targetType} #{log.targetId}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Admin ID: {log.adminId} • {new Date(log.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-card py-8 border-t border-border mt-12">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 farialover. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
