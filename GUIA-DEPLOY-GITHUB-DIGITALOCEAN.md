# 🚀 Guia Completo: Deploy do FariaLover no GitHub + DigitalOcean

Este guia te levará do código no Manus até um site 100% funcional hospedado na DigitalOcean com código no GitHub.

---

## 📋 PRÉ-REQUISITOS

Antes de começar, você precisará:

1. ✅ **Conta no GitHub** - https://github.com/signup
2. ✅ **Conta na DigitalOcean** - https://www.digitalocean.com (use o cupom `DO10` para $200 de crédito grátis)
3. ✅ **Domínio próprio** (opcional, mas recomendado) - Ex: farialover.com.br
4. ✅ **Acesso SSH ao seu computador** (terminal/cmd)

---

## 🎯 VISÃO GERAL DO PROCESSO

```
Manus → GitHub → DigitalOcean Droplet → Domínio → Site no Ar
```

**Tempo estimado:** 1-2 horas (primeira vez)

---

## PARTE 1: EXPORTAR CÓDIGO DO MANUS PARA GITHUB

### Passo 1.1: Exportar código via Management UI

1. Abra o **Management UI** do projeto farialover (painel direito)
2. Clique em **Settings** → **GitHub**
3. Clique em **"Export to GitHub"**
4. Escolha:
   - **Owner:** Sua conta GitHub
   - **Repository name:** `farialover` (ou outro nome)
   - **Visibility:** Private (recomendado)
5. Clique em **"Create Repository"**

✅ **Pronto!** Seu código agora está no GitHub em `https://github.com/SEU_USUARIO/farialover`

### Passo 1.2: Clonar repositório localmente (opcional)

Se quiser editar o código localmente:

```bash
git clone https://github.com/SEU_USUARIO/farialover.git
cd farialover
```

---

## PARTE 2: CONFIGURAR DIGITALOCEAN DROPLET

### Passo 2.1: Criar Droplet (Servidor Virtual)

1. Acesse https://cloud.digitalocean.com
2. Clique em **"Create" → "Droplets"**
3. Configure:
   - **Imagem:** Ubuntu 22.04 LTS
   - **Plano:** Basic ($6/mês - 1GB RAM, 25GB SSD)
   - **Datacenter:** New York ou São Paulo (mais próximo do Brasil)
   - **Autenticação:** SSH Key (recomendado) ou Password
   - **Hostname:** `farialover-server`
4. Clique em **"Create Droplet"**

⏱️ Aguarde 1-2 minutos até o droplet estar pronto.

✅ Anote o **IP do servidor** (ex: `159.89.123.45`)

### Passo 2.2: Conectar ao servidor via SSH

No seu terminal/cmd:

```bash
ssh root@SEU_IP_AQUI
```

Se usar senha, digite quando solicitado. Se usar SSH key, a conexão será automática.

---

## PARTE 3: CONFIGURAR SERVIDOR (Ubuntu)

### Passo 3.1: Atualizar sistema

```bash
apt update && apt upgrade -y
```

### Passo 3.2: Instalar Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v  # Deve mostrar v22.x.x
npm -v   # Deve mostrar 10.x.x
```

### Passo 3.3: Instalar pnpm

```bash
npm install -g pnpm
pnpm -v  # Deve mostrar 9.x.x
```

### Passo 3.4: Instalar MySQL

```bash
apt install -y mysql-server
mysql_secure_installation
```

Durante a configuração:
- **VALIDATE PASSWORD COMPONENT:** No
- **Remove anonymous users:** Yes
- **Disallow root login remotely:** Yes
- **Remove test database:** Yes
- **Reload privilege tables:** Yes

### Passo 3.5: Criar banco de dados

```bash
mysql -u root -p
```

Dentro do MySQL:

```sql
CREATE DATABASE farialover CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'farialover_user'@'localhost' IDENTIFIED BY 'SENHA_FORTE_AQUI';
GRANT ALL PRIVILEGES ON farialover.* TO 'farialover_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

⚠️ **Troque `SENHA_FORTE_AQUI` por uma senha forte!**

### Passo 3.6: Instalar Nginx (Servidor Web)

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

Teste: Acesse `http://SEU_IP` no navegador. Deve aparecer a página padrão do Nginx.

### Passo 3.7: Instalar Certbot (SSL/HTTPS)

```bash
apt install -y certbot python3-certbot-nginx
```

---

## PARTE 4: DEPLOY DO CÓDIGO

### Passo 4.1: Clonar repositório no servidor

```bash
cd /var/www
git clone https://github.com/SEU_USUARIO/farialover.git
cd farialover
```

### Passo 4.2: Instalar dependências

```bash
pnpm install
```

### Passo 4.3: Configurar variáveis de ambiente

Crie o arquivo `.env`:

```bash
nano .env
```

Cole o seguinte conteúdo (ajuste os valores):

```env
# Banco de dados
DATABASE_URL=mysql://farialover_user:SENHA_FORTE_AQUI@localhost:3306/farialover

# JWT Secret (gere uma chave aleatória forte)
JWT_SECRET=SUA_CHAVE_SECRETA_AQUI_MINIMO_32_CARACTERES

# OAuth Manus (copie do Manus)
VITE_APP_ID=SEU_APP_ID_MANUS
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# Owner (copie do Manus)
OWNER_OPEN_ID=SEU_OWNER_OPEN_ID
OWNER_NAME=SEU_NOME

# Forge API (copie do Manus)
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=SUA_FORGE_API_KEY
VITE_FRONTEND_FORGE_API_KEY=SUA_FRONTEND_FORGE_KEY
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# Analytics (copie do Manus)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=SEU_WEBSITE_ID

# App Info
VITE_APP_TITLE=farialover - Acompanhantes de Luxo
VITE_APP_LOGO=/farialover-logo-new.png

# Porta (não mude)
PORT=3000
```

Salve com `Ctrl+O`, Enter, `Ctrl+X`.

⚠️ **IMPORTANTE:** Copie os valores corretos do painel Manus (Settings → Secrets).

### Passo 4.4: Gerar JWT Secret forte

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e cole no `.env` em `JWT_SECRET=`.

### Passo 4.5: Executar migrations do banco

```bash
pnpm db:push
```

### Passo 4.6: Build do projeto

```bash
pnpm build
```

⏱️ Aguarde 2-3 minutos.

### Passo 4.7: Testar localmente

```bash
NODE_ENV=production pnpm start
```

Abra outra aba do terminal e teste:

```bash
curl http://localhost:3000
```

Se retornar HTML, está funcionando! Pressione `Ctrl+C` para parar.

---

## PARTE 5: CONFIGURAR PM2 (PROCESS MANAGER)

### Passo 5.1: Instalar PM2

```bash
npm install -g pm2
```

### Passo 5.2: Iniciar aplicação com PM2

```bash
cd /var/www/farialover
pm2 start npm --name "farialover" -- start
pm2 save
pm2 startup
```

Copie e execute o comando que aparecer (começa com `sudo env PATH=...`).

### Passo 5.3: Verificar status

```bash
pm2 status
pm2 logs farialover
```

---

## PARTE 6: CONFIGURAR NGINX (PROXY REVERSO)

### Passo 6.1: Criar configuração do site

```bash
nano /etc/nginx/sites-available/farialover
```

Cole o seguinte conteúdo:

```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com.br www.SEU_DOMINIO.com.br;

    # Logs
    access_log /var/log/nginx/farialover_access.log;
    error_log /var/log/nginx/farialover_error.log;

    # Proxy para Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Arquivos estáticos (cache)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

⚠️ **Troque `SEU_DOMINIO.com.br` pelo seu domínio real!**

Salve com `Ctrl+O`, Enter, `Ctrl+X`.

### Passo 6.2: Ativar site

```bash
ln -s /etc/nginx/sites-available/farialover /etc/nginx/sites-enabled/
nginx -t  # Testar configuração
systemctl reload nginx
```

---

## PARTE 7: CONFIGURAR DOMÍNIO

### Passo 7.1: Apontar domínio para DigitalOcean

No painel do seu **registrador de domínio** (Registro.br, GoDaddy, Namecheap, etc.):

1. Acesse **DNS Settings** ou **Gerenciar DNS**
2. Adicione os seguintes registros:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | SEU_IP_DIGITALOCEAN | 3600 |
| A | www | SEU_IP_DIGITALOCEAN | 3600 |

⏱️ Aguarde 5-30 minutos para propagar.

### Passo 7.2: Testar DNS

```bash
ping SEU_DOMINIO.com.br
```

Deve retornar o IP do seu servidor.

---

## PARTE 8: CONFIGURAR SSL/HTTPS (CERTBOT)

### Passo 8.1: Obter certificado SSL

```bash
certbot --nginx -d SEU_DOMINIO.com.br -d www.SEU_DOMINIO.com.br
```

Durante a configuração:
- **Email:** Seu e-mail
- **Terms of Service:** Agree
- **Share email:** No
- **Redirect HTTP to HTTPS:** Yes (opção 2)

✅ **Pronto!** Seu site agora tem HTTPS.

### Passo 8.2: Testar renovação automática

```bash
certbot renew --dry-run
```

Se não houver erros, a renovação automática está configurada.

---

## PARTE 9: CONFIGURAR FIREWALL

### Passo 9.1: Configurar UFW

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

## PARTE 10: POPULAR BANCO DE DADOS (SEED)

### Passo 10.1: Criar script de seed

No servidor:

```bash
cd /var/www/farialover
nano seed.mjs
```

Cole o seguinte conteúdo:

```javascript
import { db } from './server/db.ts';
import { profiles, categories, profileCategories } from './drizzle/schema.ts';

async function seed() {
  console.log('🌱 Seeding database...');

  // Inserir categorias
  const cats = await db.insert(categories).values([
    { name: 'Loiras', color: '#FFD700' },
    { name: 'Morenas', color: '#8B4513' },
    { name: 'Ruivas', color: '#FF4500' },
    { name: 'Alto Nível', color: '#8B00FF' },
  ]).returning();

  console.log(`✅ ${cats.length} categorias criadas`);

  // Inserir perfis (use os 8 perfis que você já tem)
  const profs = await db.insert(profiles).values([
    {
      name: 'Isabela Brito',
      age: 22,
      phone: '(31) 99630-6565',
      city: 'Belo Horizonte',
      region: 'Sion',
      photoUrl: 'URL_DA_FOTO_AQUI',
      height: '1.72',
      weight: '52',
      isVip: true,
      isVerified: true,
      hasRealPhotos: true,
      rating: '5.0',
      ratingCount: 127,
    },
    // ... adicione os outros 7 perfis aqui
  ]).returning();

  console.log(`✅ ${profs.length} perfis criados`);

  console.log('🎉 Seed concluído!');
  process.exit(0);
}

seed().catch(console.error);
```

Salve e execute:

```bash
node seed.mjs
```

---

## PARTE 11: MANUTENÇÃO E ATUALIZAÇÕES

### Atualizar código do GitHub

Quando fizer mudanças no código:

```bash
cd /var/www/farialover
git pull origin main
pnpm install
pnpm build
pm2 restart farialover
```

### Ver logs da aplicação

```bash
pm2 logs farialover
```

### Reiniciar aplicação

```bash
pm2 restart farialover
```

### Ver status do servidor

```bash
pm2 status
systemctl status nginx
systemctl status mysql
```

### Backup do banco de dados

```bash
mysqldump -u farialover_user -p farialover > backup_$(date +%Y%m%d).sql
```

---

## 🔧 TROUBLESHOOTING

### Problema: Site não carrega

**Solução:**
```bash
pm2 logs farialover  # Ver erros
pm2 restart farialover
systemctl status nginx
```

### Problema: Erro de banco de dados

**Solução:**
```bash
mysql -u farialover_user -p farialover
# Verificar se banco existe e tem permissões
```

### Problema: SSL não funciona

**Solução:**
```bash
certbot renew --force-renewal
systemctl reload nginx
```

### Problema: Site lento

**Solução:**
1. Aumentar droplet (Resize no painel DigitalOcean)
2. Configurar CDN (Cloudflare)
3. Otimizar imagens

---

## 📊 MONITORAMENTO

### Instalar Netdata (opcional)

```bash
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

Acesse: `http://SEU_IP:19999`

---

## 💰 CUSTOS MENSAIS

- **DigitalOcean Droplet:** $6/mês (básico)
- **Domínio:** ~R$40/ano (~R$3.33/mês)
- **SSL:** Grátis (Let's Encrypt)

**TOTAL: ~$9/mês** (R$45/mês)

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Configurar Cloudflare** (CDN + proteção DDoS) - https://www.cloudflare.com
2. ✅ **Configurar backups automáticos** no painel DigitalOcean ($1.20/mês)
3. ✅ **Configurar monitoramento** (UptimeRobot grátis)
4. ✅ **Implementar CI/CD** (GitHub Actions para deploy automático)

---

## 📞 SUPORTE

- **DigitalOcean Community:** https://www.digitalocean.com/community
- **Documentação Nginx:** https://nginx.org/en/docs/
- **PM2 Docs:** https://pm2.keymetrics.io/docs/

---

**Última atualização:** Janeiro 2026

**Autor:** Guia criado para o projeto FariaLover
