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
