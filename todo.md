# Farialover - TODO

## Integração Backend
- [x] Configurar cliente Supabase no servidor
- [x] Criar procedures tRPC para buscar perfis e fotos
- [x] Implementar queries com relacionamento profiles + photos

## Componentes UI
- [x] Hero carousel com foto principal e informações do perfil
- [x] Seção Stories horizontal com fotos circulares
- [x] Grid de cards VIP com tags de destaque
- [x] Grid principal de perfis completos
- [x] Header fixo com navegação e logo

## Sistema de Cores e Tema
- [x] Configurar paleta preto/branco/verde neon/dourado
- [x] Aplicar tema dark no ThemeProvider
- [x] Estilizar tags de destaque coloridas

## Layout Responsivo
- [x] Grid 4 colunas (desktop)
- [x] Grid 2-3 colunas (tablet)
- [x] Grid 1-2 colunas (mobile)
- [x] Testar navegação mobile

## Efeitos e Interações
- [x] Hover effects nos cards
- [x] Transições suaves
- [x] Avaliação em estrelas douradas
- [x] Navegação por setas nos carousels

## Testes
- [x] Testar integração com Supabase
- [x] Validar responsividade em diferentes dispositivos
- [x] Verificar performance de carregamento de imagens

## Ajustes Solicitados pelo Usuário
- [x] Reduzir altura do banner hero para proporção do Agenda31
- [x] Criar páginas de perfil individual clicáveis
- [x] Implementar galeria completa de fotos em cada perfil
- [x] Adicionar navegação funcional entre perfis
- [x] Implementar sistema de rotas com wouter
- [x] Tornar todos os cards clicáveis
- [x] Adicionar botões de navegação anterior/próximo nos perfis
- [x] Replicar exatamente as proporções e espaçamentos do Agenda31

## Correções Urgentes Solicitadas
- [x] Corrigir banner hero para layout IDÊENTICO ao Agenda31 (foto horizontal + info sobreposta em card)
- [x] Implementar stories 100% funcionais exatamente como no vídeo
- [x] Ajustar aspect ratio das fotos para mostrar corpo inteiro (não cortar)
- [x] Replicar formato exato das fotos do Agenda31 (aspect ratio 2:3)
- [x] Garantir que stories sejam clicáveis e abram modal fullscreen

## Correção do Banner Hero
- [x] Ajustar banner para mostrar foto COMPLETA da modelo (não cortada)
- [x] Posicionar card de informações no canto superior esquerdo como no Agenda31
- [x] Remover object-position que está cortando a foto
- [x] Ajustar altura do banner se necessário para mostrar pose completa

## Implementar Carrossel no Banner
- [x] Adicionar transição automática entre perfis no banner (autoplay a cada 5s)
- [x] Implementar setas de navegação funcionais (anterior/próximo)
- [x] Adicionar animação de fade entre fotos
- [x] Garantir que fotos do banner sejam horizontais com object-cover
- [x] Ajustar fotos dentro do perfil para formato correto

## Correção de Proporção das Fotos no Banner
- [x] Mudar object-cover para object-contain no banner
- [x] Garantir que foto da modelo apareça COMPLETA (corpo inteiro)
- [x] Centralizar foto da modelo no banner
- [x] Adicionar fundo escuro para preencher espaços vazios

## Correção de Fotos na Página de Perfil Individual
- [x] Mudar object-cover para object-contain na galeria de fotos do perfil
- [x] Garantir que fotos mostrem corpo inteiro da modelo
- [x] Adicionar fundo preto para preencher espaços vazios

## Replicar Página de Perfil EXATAMENTE como Agenda31
- [x] Analisar estrutura completa da página de perfil do Agenda31
- [x] Replicar layout exato da galeria de fotos
- [x] Replicar seção de informações e detalhes
- [x] Replicar sidebar fixa com foto, nome, avaliação, telefone
- [x] Replicar todos os botões e funcionalidades
- [x] Garantir layout idêntico ao original

## Tornar Banner Clicável
- [x] Adicionar link no banner hero para perfil da modelo
- [x] Tornar toda área do banner clicável
- [x] Manter funcionalidade das setas de navegação com stopPropagation

## Implementar Seção de Vídeos
- [x] Analisar seção de vídeos no Agenda31
- [x] Adicionar campo de vídeos no schema do Supabase
- [x] Criar componente de player de vídeo com modal
- [x] Adicionar seção de vídeos na página de perfil
- [x] Implementar grid de thumbnails de vídeos
- [x] Garantir que seja idêntico ao Agenda31

## Implementar Sistema de Comentários/Elogios
- [x] Analisar seção de comentários no Agenda31
- [x] Criar tabela de comentários no Supabase
- [x] Criar formulário de envio de comentários
- [x] Implementar listagem de comentários com nome, data e texto
- [x] Adicionar validação e moderação (approved flag)
- [x] Garantir layout idêntico ao Agenda31

## Alterar Identidade Visual
- [x] Gerar 3 opções de logo diferentes para escolha
- [x] Atualizar paleta de cores para rosa, vermelho e preto no index.css
- [x] Substituir cores verde neon (#00FF14) por rosa
- [x] Substituir cores dourado (#FFD700) por vermelho
- [x] Manter preto (#000000) como cor de fundo
- [x] Aplicar nova logo no header de todas as páginas
- [x] Atualizar favicon com nova logo
- [x] Testar contraste e legibilidade das novas cores

## Correção da Logo
- [x] Gerar nova logo com fundo transparente (sem branco)
- [x] Aumentar tamanho da logo no header (h-20 na Home, h-16 no Profile)
- [x] Testar logo corrigida em todas as páginas

## Remover Fundo Preto da Logo Original
- [x] Processar logo original (Opção 1) para remover fundo preto
- [x] Deixar apenas texto rosa/vermelho e coração em fundo transparente
- [x] Aplicar logo processada no site

## Criar Nova Logo Elegante
- [x] Gerar 3 opções de logo bonitas e modernas
- [x] Logo deve contrastar perfeitamente com identidade visual rosa/vermelho/preto
- [x] Aplicar logo escolhida no site via CDN
- [x] Testar logo em todas as páginas

## Remover Fundo Branco da Logo Completamente
- [x] Processar logo v1 com Python PIL para remover TODO fundo branco/cinza claro
- [x] Garantir que apenas texto rosa/vermelho e coração permaneçam visíveis
- [x] Aplicar logo processada no site
- [x] Testar logo sem nenhum fundo branco

## Funcionalidades Faltantes a Implementar

### Modal de Aviso +18
- [x] Criar modal de aviso de conteúdo adulto (idade +18)
- [x] Adicionar checkbox "Li e concordo com as declarações"
- [x] Adicionar checkbox "Lembrar minha escolha por 30 dias (cookie)"
- [x] Botões "Sair do site" e "Entrar no FARIALOVER"
- [x] Links para "Termos e condições" e "Privacidade"
- [x] Implementar lógica de cookie para lembrar escolha

### Botão WhatsApp Flutuante
- [x] Criar botão verde fixo no canto inferior direito
- [x] Ícone do WhatsApp
- [x] Link para contato via WhatsApp
- [x] Animação de entrada/hover

### Rodapé Completo
- [x] Links para seções do site (HOME, MODELOS, CIDADES)
- [x] Informações de contato
- [x] Links para termos de uso e privacidade
- [x] Copyright e informações legais
- [x] Redes sociais

### Sistema de Filtros e Busca
- [x] Barra de pesquisa no header
- [x] Filtro por cidade
- [x] Filtro por características físicas
- [x] Filtro por disponibilidade (novidade, últimos dias)
- [x] Aplicar filtros na listagem de perfis

### Indicadores do Carrossel
- [x] Dots/bullets abaixo do banner
- [x] Mostrar posição atual no carrossel
- [x] Clicáveis para navegar entre perfis

### Página MODELOS
- [x] Criar rota /modelos
- [x] Listagem completa de todos os perfis
- [x] Grid responsivo
- [x] Integração com filtros

### Página CIDADES
- [x] Criar rota /cidades
- [x] Seletor de cidades disponíveis
- [x] Listagem de perfis por cidade selecionada

### Seções Adicionais na Home
- [x] Seção "Novidades" (últimos perfis adicionados)
- [x] Seção "Mais Visitadas" (perfis com mais acessos)
- [x] Seção "Destaques da Semana" (perfis em destaque)

### SEO e Meta Tags
- [ ] Meta tags otimizadas (title, description, keywords)
- [ ] Open Graph tags para compartilhamento social
- [ ] Schema.org markup
- [ ] Sitemap XML

## Funcionalidades Parciais a Completar

### Contador de Acessos Funcional
- [x] Criar procedure tRPC para incrementar contador
- [x] Adicionar chamada da procedure ao abrir perfil
- [x] Testar incremento automático

### Sistema de Compartilhamento Social
- [x] Criar componente ShareModal
- [x] Implementar Web Share API
- [x] Adicionar links para Facebook, Twitter, WhatsApp
- [x] Adicionar botão "Copiar Link"
- [x] Integrar modal com botões "Compartilhe"

## Funcionalidades Faltando a Implementar

### SEO Completo
- [x] Adicionar meta tags otimizadas (title, description, keywords)
- [x] Implementar Open Graph tags para redes sociais
- [x] Adicionar Schema.org markup
- [x] Criar sitemap.xml
- [x] Criar robots.txt

### Painel Administrativo
- [x] Criar rota /admin com proteção
- [x] Implementar dashboard com estatísticas
- [x] Criar página de moderação de comentários
- [x] Adicionar sistema de autenticação admin
- [x] Implementar procedures tRPC protegidas (adminProcedure)
- [ ] Criar página de gerenciamento de perfis (CRUD) - Opcional

## Otimização Mobile

### Home.tsx
- [x] Otimizar header para mobile (menu hamburguer, logo menor)
- [x] Ajustar hero banner para telas pequenas
- [x] Tornar cards de perfis responsivos (1 coluna em mobile)
- [x] Ajustar seções VIP, Novidades, Mais Visitadas para mobile
- [x] Otimizar footer para mobile (colunas empilhadas)
- [x] Ajustar espaçamentos e tamanhos de fonte

### Profile.tsx
- [x] Converter layout de 2 colunas para 1 coluna em mobile
- [x] Ajustar galeria de fotos para mobile (swipe horizontal)
- [x] Otimizar sidebar para mobile
- [x] Ajustar formulário de comentários para mobile
- [x] Tornar botões e textos responsíveisara toque em telas pequenas
### Páginas Modelos, Cidades e Admin
- [x] Otimizar grid de perfis em Modelos para mobile
- [x] Ajustar seletor de cidades para mobile
- [ ] Otimizar painel Admin para mobile (se aplicável)ados)
- [ ] Ajustar tabela de comentári### Componentes
- [x] Otimizar SearchFilters para mobile (drawer/sheet)
- [x] Otimizar ShareModal para mobile
- [x] Ajustar modais (AgeVerificationModal, StoryModal) para mobile] Ajustar WhatsAppButton posição para mobile
- [ ] Melhorar indicadores de carrossel para toque

## Correções de Bugs

### Erro de Acessibilidade Dialog
- [x] Adicionar DialogTitle ao modal de verificação de idade
- [x] Garantir que todos os Dialogs tenham DialogTitle para acessibilidade


## Correções de Bugs Críticos Encontrados nos Testes

### BUG #1: Modal +18 reaparece em cada navegação
- [x] Verificar lógica de cookie no AgeVerificationModal.tsx
- [x] Garantir que cookie seja lido corretamente em todas as páginas
- [x] Testar navegação entre páginas sem reaparecimento do modal

### BUG #2: Links do menu não navegam corretamente
- [x] Corrigir links no header (HOME, MODELOS, CIDADES, VÍDEOS, ÁUDIOS)
- [x] Usar componente Link do wouter ao invés de <a> com href
- [x] Testar navegação entre todas as páginas


## Novas Funcionalidades Solicitadas

### Páginas VÍDEOS e ÁUDIOS
- [x] Criar página /videos com grid de vídeos
- [x] Implementar player de vídeo integrado
- [x] Adicionar filtros por categoria de vídeos
- [x] Criar página /audios com lista de áudios
- [x] Implementar player de áudio integrado
- [x] Adicionar filtros por categoria de áudios
- [x] Adicionar rotas no App.tsx
- [x] Corrigir links VÍDEOS e ÁUDIOS no header

### Filtros Avançados por Serviços
- [x] Adicionar campo de serviços no SearchFilters
- [x] Criar lista de serviços disponíveis (massagem, acompanhamento, etc.)
- [x] Implementar lógica de filtro por serviços
- [x] Testar filtros em todas as páginas
