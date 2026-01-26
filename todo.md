# TODO - farialover

## Backend e Banco de Dados
- [x] Criar schema completo do banco (perfis, mídias, comentários, categorias, regiões)
- [x] Implementar helpers de banco de dados para todas as operações
- [x] Criar routers tRPC para todas as funcionalidades

## Sistema de Perfis
- [x] Implementar CRUD completo de perfis com todas as informações
- [x] Sistema de upload de fotos dos perfis para S3
- [x] Sistema de categorias e tags de serviços
- [x] Filtros por região, categoria e características
- [x] Sistema de busca avançada

## Sistema de Mídia
- [x] Implementar upload de vídeos para S3
- [x] Player de vídeo funcional integrado aos perfis
- [x] Implementar upload de áudios para S3
- [x] Player de áudio funcional integrado aos perfis

## Sistema de Comentários
- [x] Criar tabela e sistema de comentários
- [x] Sistema de avaliações (estrelas/notas)
- [x] Exibição de comentários por perfil
- [x] Moderação de comentários no painel admin

## Integração WhatsApp
- [x] Botão de contato direto com redirecionamento WhatsApp
- [x] Formatação correta do link com número do perfil

## Frontend - Layout Principal
- [x] Implementar header com logo farialover e navegação
- [x] Banner/slider principal com perfis destacados
- [x] Seção Stories em carrossel horizontal
- [x] Grid de perfis com cards estilizados
- [x] Footer com informações

## Frontend - Páginas
- [x] Página inicial com listagem de perfis
- [x] Página de detalhes do perfil com todas as informações
- [x] Página de vídeos
- [x] Página de áudios
- [x] Página de busca com filtros
- [ ] Página de categorias

## Painel Administrativo
- [x] Dashboard admin com estatísticas
- [x] Gerenciamento de perfis (criar, editar, deletar)
- [x] Upload e gerenciamento de mídias
- [x] Moderação de comentários
- [x] Gerenciamento de categorias e tags
- [x] Sistema de destaque de perfis (VIP, Premium, etc.)

## Estilização e Identidade Visual
- [x] Aplicar paleta de cores farialover (roxo, rosa, preto, branco)
- [x] Integrar logo farialover no header
- [x] Efeitos visuais (gradientes, glow, hover effects)
- [x] Responsividade completa (mobile e desktop)

## Testes
- [x] Testes de funcionalidades principais
- [x] Validação de uploads
- [x] Testes de integração

## Geração de Imagens e População do Site
- [x] Gerar imagens de modelos usando IA (8 perfis)
- [x] Fazer upload das imagens para S3
- [x] Atualizar perfis no banco de dados com URLs das imagens
- [x] Verificar exibição das imagens no site

## Ajustes de Layout e Galeria
- [x] Ajustar tamanho do banner para corresponder ao agenda31.com.br
- [x] Gerar 5 fotos adicionais para cada perfil (40 imagens total)
- [x] Criar tabela de galeria no banco de dados
- [x] Implementar sistema de galeria de fotos nos perfis
- [x] Fazer upload de todas as fotos para S3
- [x] Atualizar interface para exibir galeria de fotos

## Lightbox e Sistema de Verificação
- [x] Adicionar campos de verificação no schema do banco (isVerified, hasRealPhotos)
- [x] Atualizar perfis existentes com status de verificação
- [x] Implementar componente Lightbox para galeria de fotos
- [x] Adicionar navegação entre fotos no lightbox (setas esquerda/direita)
- [x] Criar componente de badges de verificação
- [x] Integrar badges na página de detalhes do perfil
- [x] Integrar badges nos cards de perfil da home
- [x] Testar todas as funcionalidades

## Sistema de Filtros Avançados e Depoimentos
- [x] Criar componente FilterSidebar com interface deslizante
- [x] Adicionar filtros por idade (range slider)
- [x] Adicionar filtros por altura e peso
- [x] Adicionar filtros por região/cidade
- [x] Adicionar filtros por categorias (checkboxes)
- [x] Implementar lógica de filtragem no backend
- [x] Integrar filtros na página Home
- [x] Criar tabela de depoimentos no banco de dados
- [x] Criar página de depoimentos (/depoimentos)
- [x] Implementar sistema de destaque de depoimentos verificados
- [x] Adicionar seção de depoimentos na home
- [x] Testar todas as funcionalidades

## Painel Administrativo Completo
- [x] Criar tabela de pagamentos PIX no banco de dados
- [x] Adicionar campos de status de aprovação nos perfis
- [x] Implementar rotas de aprovação/rejeição de perfis
- [x] Implementar sistema de registro manual de pagamentos PIX
- [x] Criar dashboard administrativo com estatísticas
- [x] Criar interface de gerenciamento de perfis (aprovar, editar, desativar)
- [x] Criar interface de gerenciamento de pagamentos
- [x] Criar interface de moderação de comentários e depoimentos
- [x] Criar interface de controle de destaques (VIP, Featured, Stories)
- [x] Adicionar sistema de logs de ações administrativas
- [x] Testar todas as funcionalidades do painel admin
