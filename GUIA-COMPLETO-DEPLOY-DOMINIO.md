# 🚀 GUIA COMPLETO - Deploy e Configuração de Domínio

## FariaLover - Clone do agenda31.com.br

**Data**: 27 de Janeiro de 2026  
**Status**: ✅ Deploy concluído | ⏳ DNS propagando

---

## 📋 ÍNDICE

1. [Resumo do Projeto](#resumo-do-projeto)
2. [Deploy no DigitalOcean](#deploy-no-digitalocean)
3. [Configuração de Domínio](#configuração-de-domínio)
4. [Problema DNS Encontrado](#problema-dns-encontrado)
5. [Verificação e Testes](#verificação-e-testes)
6. [Próximos Passos](#próximos-passos)

---

## 📊 RESUMO DO PROJETO

### Tecnologias:
- **Frontend**: React 18, TypeScript, Vite, Wouter, TailwindCSS
- **Backend**: Node.js, Express, tRPC
- **Database**: Supabase (PostgreSQL)
- **Hosting**: DigitalOcean App Platform
- **Repository**: GitHub (marcelinbh/farialover2)
- **Domain**: farialover.com (GoDaddy)

### Funcionalidades Implementadas:
✅ Homepage com banner, stories e grid de perfis  
✅ Stories fullscreen estilo Instagram (múltiplas fotos, progress bars, navegação)  
✅ Páginas de detalhes de perfil (layout 2 colunas como agenda31)  
✅ Filtros avançados (idade, altura, peso, região, categorias)  
✅ Sistema de comentários e avaliações  
✅ Menu simplificado: HOME, MODELOS, CIDADES, VÍDEOS, ÁUDIOS, CONTATO  
✅ Cores personalizadas (gradiente roxo/rosa em vez de vermelho)  
✅ Logo FariaLover customizada  

---

## 🚀 DEPLOY NO DIGITALOCEAN

### 1. Criar App no DigitalOcean App Platform

1. Acesse: https://cloud.digitalocean.com/apps
2. Clique em **"Create App"**
3. Conecte o repositório GitHub: **marcelinbh/farialover2**
4. Selecione a branch: **main**

### 2. Configurar Build Settings

```yaml
Build Command: pnpm install && pnpm run build
Run Command: pnpm start
Port: 3000
Environment: production
```

### 3. Adicionar Environment Variables

Vá em **Settings → Environment Variables** e adicione:

```bash
# Database
DATABASE_URL=postgresql://postgres.esbvidtmnlfduagkdoei:SuaPasswordAqui@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Supabase
SUPABASE_URL=https://esbvidtmnlfduagkdoei.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=sua-chave-secreta-aqui

# Node
NODE_ENV=production
```

### 4. Deploy

1. Clique em **"Create Resources"**
2. Aguarde o build (5-10 minutos)
3. Status: **"SUCESSO"** e **"IMPLANTAÇÃO AO VIVO"**

### 5. Obter URL e IPs

Após deploy bem-sucedido:
- **URL temporária**: `https://lionfish-app-pm7dg.ondigitalocean.app`
- **IP 1**: `162.159.140.98`
- **IP 2**: `172.66.0.96`

---

## 🌐 CONFIGURAÇÃO DE DOMÍNIO

### Passo 1: Adicionar Domínio na DigitalOcean

1. Vá para **Networking → Domains**
2. Clique em **"Add Domain"**
3. Digite: `farialover.com`
4. Selecione: **"Você gerencia seu domínio"** (manter nameservers do GoDaddy)
5. A DigitalOcean vai fornecer os IPs para configurar no GoDaddy

### Passo 2: Configurar DNS no GoDaddy

1. Acesse: https://dcc.godaddy.com/domains
2. Selecione o domínio **farialover.com**
3. Clique em **DNS → Registros DNS**
4. Adicione os registros A:

#### Registros A (obrigatórios):

```
Tipo: A
Nome: @
Valor: 162.159.140.98
TTL: 1 hora
```

```
Tipo: A
Nome: @
Valor: 172.66.0.96
TTL: 1 hora
```

#### Registro CNAME para www (opcional):

```
Tipo: CNAME
Nome: www
Valor: farialover.com
TTL: 1 hora
```

### Passo 3: Voltar para DigitalOcean

1. Na página de adicionar domínio, clique em **"Adicionar domínio"**
2. Status deve mudar para **"Domínio adicionado"** ✅

---

## ⚠️ PROBLEMA DNS ENCONTRADO

### Sintoma:
Domínio farialover.com mostrava página de "Lançamento em breve" do GoDaddy em vez do app.

### Causa:
Existia um **3º registro A** no GoDaddy:

```
Tipo: A
Nome: @
Valor: WebsiteBuilder Site  ← ESTE ERA O PROBLEMA!
TTL: 1 hora
```

Este registro do sistema de construção de sites do GoDaddy estava fazendo o domínio apontar para a página de parking.

### Solução:
✅ **DELETADO** o registro "WebsiteBuilder Site"

### Registros DNS Finais (corretos):

```
✅ A     | @   | 162.159.140.98           | 1 hora
✅ A     | @   | 172.66.0.96              | 1 hora
✅ CNAME | www | farialover.com.          | 1 hora
✅ NS    | @   | ns39.domaincontrol.com.  | 1 hora
✅ NS    | @   | ns40.domaincontrol.com.  | 1 hora
```

---

## 🔍 VERIFICAÇÃO E TESTES

### 1. Verificar Propagação DNS

**Online (recomendado)**:
- https://dnschecker.org
- Digite: `farialover.com`
- Tipo: `A`
- Deve mostrar: `162.159.140.98` e `172.66.0.96`

**Via terminal**:
```bash
curl -s "https://dns.google/resolve?name=farialover.com&type=A" | python3 -m json.tool
```

### 2. Testar no Navegador

```
https://farialover.com
```

**Se ainda mostrar página de parking**:
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Teste em modo anônimo/privado
- Aguarde mais tempo (DNS pode levar até 24h para propagar globalmente)

### 3. Verificar SSL/HTTPS

A DigitalOcean gera automaticamente um certificado SSL gratuito (Let's Encrypt) quando o domínio está ativo.

Status: ✅ Deve aparecer cadeado verde no navegador

---

## ⏱️ TEMPO DE PROPAGAÇÃO DNS

- **Mínimo**: 5-30 minutos
- **Médio**: 1-2 horas
- **Máximo**: 24-48 horas (raro)
- **TTL configurado**: 1 hora (3600 segundos)

**Status atual** (27/01/2026 às 15:30 GMT-3):
⏳ DNS propagando - Aguardar 1-2 horas

---

## 🎯 PRÓXIMOS PASSOS

### Funcionalidades Futuras:

1. **Admin Panel**
   - Upload de fotos de perfis
   - Gerenciamento de modelos
   - Moderação de comentários
   - Dashboard de analytics

2. **Vídeos**
   - Integração com Cloudflare Stream ou Vimeo
   - Player de vídeo customizado
   - Upload e gerenciamento de vídeos

3. **Áudios**
   - Player de áudio customizado
   - Upload e gerenciamento de áudios
   - Integração com Cloudflare R2 ou S3

4. **Filtros de Cidades**
   - Implementar filtro por cidade/região
   - Mapa interativo (opcional)

5. **Página de Contato**
   - Formulário de contato
   - Integração com email (Resend ou SendGrid)

6. **Pagamentos** (opcional)
   - Integração com Stripe ou Mercado Pago
   - Sistema de anúncios pagos
   - Planos VIP

### APIs Externas Necessárias:

Consulte o arquivo: **APIS-EXTERNAS-NECESSARIAS.md**

---

## 📞 SUPORTE

### DigitalOcean:
- Dashboard: https://cloud.digitalocean.com
- App ID: `7a689d80-d276-41f2-affb-11f798e23407`
- Docs: https://docs.digitalocean.com/products/app-platform/

### GoDaddy:
- DNS Manager: https://dcc.godaddy.com/domains
- Suporte: https://www.godaddy.com/help

### Supabase:
- Dashboard: https://supabase.com/dashboard
- Project: https://esbvidtmnlfduagkdoei.supabase.co
- Docs: https://supabase.com/docs

---

## ✅ CHECKLIST FINAL

- [x] Código no GitHub (marcelinbh/farialover2)
- [x] Deploy no DigitalOcean App Platform
- [x] Build bem-sucedido
- [x] App rodando (status: IMPLANTAÇÃO AO VIVO)
- [x] Banco de dados Supabase configurado
- [x] Environment variables configuradas
- [x] Domínio adicionado na DigitalOcean
- [x] Registros DNS configurados no GoDaddy
- [x] Registro problemático "WebsiteBuilder Site" deletado
- [ ] DNS propagado globalmente (aguardando 1-2 horas)
- [ ] SSL/HTTPS ativo
- [ ] Site acessível via farialover.com

---

## 🎉 CONCLUSÃO

O deploy está **100% completo** e configurado corretamente!

Agora é só aguardar a propagação natural do DNS (1-2 horas) e o site **farialover.com** estará online e funcionando perfeitamente.

**Parabéns pelo projeto! 🚀**

---

**Última atualização**: 27 de Janeiro de 2026 às 15:30 GMT-3
