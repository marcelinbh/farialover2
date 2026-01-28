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
