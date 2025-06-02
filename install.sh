
#!/bin/bash

# AgendoPro - Autoinstalador para VPS com EasyPanel
# Versão: 1.0.0
# Autor: AgendoPro Team

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar se está rodando como root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "Este script não deve ser executado como root. Use um usuário com privilégios sudo."
    fi
}

# Detectar sistema operacional
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$ID
        VER=$VERSION_ID
    else
        error "Sistema operacional não suportado"
    fi
    
    log "Sistema detectado: $OS $VER"
}

# Verificar requisitos mínimos
check_requirements() {
    log "Verificando requisitos mínimos..."
    
    # Verificar memória RAM (mínimo 2GB)
    MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $2/1024}')
    if [ $MEMORY -lt 2 ]; then
        error "Memória RAM insuficiente. Mínimo: 2GB, Atual: ${MEMORY}GB"
    fi
    
    # Verificar espaço em disco (mínimo 10GB)
    DISK=$(df -h / | awk 'NR==2{print $4}' | sed 's/G//')
    if [ ${DISK%.*} -lt 10 ]; then
        error "Espaço em disco insuficiente. Mínimo: 10GB, Disponível: ${DISK}GB"
    fi
    
    log "Requisitos atendidos: RAM ${MEMORY}GB, Disco ${DISK}GB"
}

# Instalar dependências
install_dependencies() {
    log "Atualizando sistema e instalando dependências..."
    
    case $OS in
        ubuntu|debian)
            sudo apt update && sudo apt upgrade -y
            sudo apt install -y curl wget git nodejs npm postgresql postgresql-contrib nginx certbot python3-certbot-nginx ufw fail2ban
            ;;
        centos|rhel|fedora)
            sudo dnf update -y
            sudo dnf install -y curl wget git nodejs npm postgresql postgresql-server nginx certbot python3-certbot-nginx firewalld fail2ban
            ;;
        *)
            error "Sistema operacional não suportado: $OS"
            ;;
    esac
}

# Configurar PostgreSQL
setup_postgresql() {
    log "Configurando PostgreSQL..."
    
    # Gerar senhas aleatórias
    DB_PASSWORD=$(openssl rand -base64 32)
    SUPABASE_DB_PASSWORD=$(openssl rand -base64 32)
    
    # Inicializar PostgreSQL se necessário
    if [[ $OS == "centos" || $OS == "rhel" || $OS == "fedora" ]]; then
        sudo postgresql-setup --initdb
    fi
    
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Criar usuário e banco
    sudo -u postgres psql << EOF
CREATE USER agendopro WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE agendopro OWNER agendopro;
GRANT ALL PRIVILEGES ON DATABASE agendopro TO agendopro;

-- Criar usuário para Supabase
CREATE USER supabase_admin WITH PASSWORD '$SUPABASE_DB_PASSWORD' SUPERUSER;
CREATE DATABASE supabase OWNER supabase_admin;

-- Configurações de segurança
ALTER USER postgres PASSWORD '$DB_PASSWORD';
EOF

    # Configurar pg_hba.conf
    PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oP 'PostgreSQL \K[0-9]+')
    PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
    
    if [[ -f $PG_HBA ]]; then
        sudo cp $PG_HBA $PG_HBA.backup
        sudo sed -i "s/local   all             all                                     peer/local   all             all                                     md5/" $PG_HBA
        sudo systemctl restart postgresql
    fi
    
    log "PostgreSQL configurado com sucesso"
}

# Instalar Node.js e dependências
setup_nodejs() {
    log "Instalando Node.js LTS..."
    
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Instalar gerenciadores de pacote globais
    sudo npm install -g pm2 yarn
    
    log "Node.js $(node --version) instalado"
}

# Clonar e configurar aplicação
setup_application() {
    log "Configurando aplicação AgendoPro..."
    
    # Criar diretório da aplicação
    APP_DIR="/var/www/agendopro"
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
    
    # Criar estrutura da aplicação
    cd $APP_DIR
    
    # Criar arquivo package.json
    cat > package.json << 'EOF'
{
  "name": "agendopro",
  "version": "1.0.0",
  "description": "Sistema de Agendamento Profissional",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@supabase/supabase-js": "^2.49.8",
    "@tanstack/react-query": "^5.56.2",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.6.2",
    "vite": "^5.4.8"
  }
}
EOF
    
    # Instalar dependências
    yarn install
    
    log "Dependências instaladas"
}

# Configurar variáveis de ambiente
setup_environment() {
    log "Configurando variáveis de ambiente..."
    
    # Gerar chaves de segurança
    JWT_SECRET=$(openssl rand -base64 64)
    API_SECRET=$(openssl rand -base64 32)
    
    cat > .env << EOF
# Configurações do Banco de Dados
DATABASE_URL="postgresql://agendopro:$DB_PASSWORD@localhost:5432/agendopro"
SUPABASE_DB_URL="postgresql://supabase_admin:$SUPABASE_DB_PASSWORD@localhost:5432/supabase"

# Configurações de Segurança
JWT_SECRET="$JWT_SECRET"
API_SECRET="$API_SECRET"

# Configurações da Aplicação
NODE_ENV="production"
PORT="3000"
DOMAIN="${DOMAIN:-localhost}"

# Configurações de Email (configurar posteriormente)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""

# Configurações do WhatsApp (configurar posteriormente)
WHATSAPP_TOKEN=""
WHATSAPP_PHONE_ID=""

# Configurações do Supabase
SUPABASE_URL="http://localhost:8000"
SUPABASE_ANON_KEY="$API_SECRET"
SUPABASE_SERVICE_ROLE_KEY="$JWT_SECRET"
EOF

    chmod 600 .env
    log "Variáveis de ambiente configuradas"
}

# Configurar Nginx
setup_nginx() {
    log "Configurando Nginx..."
    
    DOMAIN=${DOMAIN:-$(hostname -I | awk '{print $1}')}
    
    cat > /tmp/agendopro.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Configurações de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Logs
    access_log /var/log/nginx/agendopro_access.log;
    error_log /var/log/nginx/agendopro_error.log;
    
    # Arquivos estáticos
    location / {
        root /var/www/agendopro/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache para assets estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Supabase
    location /supabase/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Limitar tamanho de upload
    client_max_body_size 10M;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
EOF

    sudo mv /tmp/agendopro.conf /etc/nginx/sites-available/agendopro
    sudo ln -sf /etc/nginx/sites-available/agendopro /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Testar configuração
    sudo nginx -t
    sudo systemctl restart nginx
    
    log "Nginx configurado para domínio: $DOMAIN"
}

# Configurar SSL com Let's Encrypt
setup_ssl() {
    if [[ ${SKIP_SSL:-false} == "true" ]]; then
        warn "Configuração SSL ignorada (SKIP_SSL=true)"
        return
    fi
    
    if [[ $DOMAIN == "localhost" || $DOMAIN =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        warn "SSL não configurado para localhost ou IP"
        return
    fi
    
    log "Configurando SSL com Let's Encrypt..."
    
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect
    
    # Configurar renovação automática
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
    
    log "SSL configurado com sucesso"
}

# Configurar firewall
setup_firewall() {
    log "Configurando firewall..."
    
    case $OS in
        ubuntu|debian)
            sudo ufw --force enable
            sudo ufw default deny incoming
            sudo ufw default allow outgoing
            sudo ufw allow ssh
            sudo ufw allow 'Nginx Full'
            sudo ufw allow 5432/tcp  # PostgreSQL
            ;;
        centos|rhel|fedora)
            sudo systemctl start firewalld
            sudo systemctl enable firewalld
            sudo firewall-cmd --permanent --add-service=ssh
            sudo firewall-cmd --permanent --add-service=http
            sudo firewall-cmd --permanent --add-service=https
            sudo firewall-cmd --permanent --add-port=5432/tcp
            sudo firewall-cmd --reload
            ;;
    esac
    
    log "Firewall configurado"
}

# Instalar e configurar Supabase CLI
setup_supabase() {
    log "Instalando Supabase CLI..."
    
    # Instalar Supabase CLI
    npm install -g supabase
    
    # Inicializar projeto Supabase
    cd /var/www/agendopro
    supabase init
    
    # Configurar Supabase
    cat > supabase/config.toml << EOF
project_id = "agendopro"

[api]
enabled = true
port = 8000
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[auth]
enabled = true
port = 8001
site_url = "http://$DOMAIN"
additional_redirect_urls = ["https://$DOMAIN"]
jwt_expiry = 3600
enable_signup = true

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = false

[db]
port = 5432
shadow_port = 5433
major_version = 15

[studio]
enabled = true
port = 3001
EOF
    
    log "Supabase configurado"
}

# Configurar PM2 para gerenciamento de processos
setup_pm2() {
    log "Configurando PM2..."
    
    cd /var/www/agendopro
    
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'agendopro-app',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/agendopro-error.log',
      out_file: '/var/log/pm2/agendopro-out.log',
      log_file: '/var/log/pm2/agendopro.log',
      time: true
    },
    {
      name: 'supabase',
      script: 'npx',
      args: 'supabase start',
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

    # Criar diretório de logs
    sudo mkdir -p /var/log/pm2
    sudo chown $USER:$USER /var/log/pm2
    
    # Configurar PM2 para iniciar no boot
    pm2 startup
    pm2 save
    
    log "PM2 configurado"
}

# Executar migrações do banco
run_migrations() {
    log "Executando migrações do banco de dados..."
    
    cd /var/www/agendopro
    
    # Aplicar migrações do Supabase
    supabase db reset
    
    log "Migrações executadas"
}

# Configurar backup automático
setup_backup() {
    log "Configurando backup automático..."
    
    # Criar script de backup
    cat > /usr/local/bin/agendopro-backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/agendopro"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup do banco de dados
pg_dump -U agendopro -h localhost agendopro | gzip > \$BACKUP_DIR/agendopro_\$DATE.sql.gz

# Backup dos arquivos
tar -czf \$BACKUP_DIR/files_\$DATE.tar.gz /var/www/agendopro

# Manter apenas os últimos 7 dias
find \$BACKUP_DIR -type f -mtime +7 -delete

echo "Backup realizado: \$DATE"
EOF

    sudo chmod +x /usr/local/bin/agendopro-backup.sh
    
    # Configurar cron para backup diário
    echo "0 2 * * * /usr/local/bin/agendopro-backup.sh" | sudo crontab -
    
    log "Backup automático configurado"
}

# Configurar monitoramento básico
setup_monitoring() {
    log "Configurando monitoramento básico..."
    
    # Instalar htop para monitoramento
    case $OS in
        ubuntu|debian)
            sudo apt install -y htop iotop
            ;;
        centos|rhel|fedora)
            sudo dnf install -y htop iotop
            ;;
    esac
    
    # Configurar logrotate
    cat > /tmp/agendopro << EOF
/var/log/pm2/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

    sudo mv /tmp/agendopro /etc/logrotate.d/agendopro
    
    log "Monitoramento básico configurado"
}

# Função principal de instalação
main() {
    log "Iniciando instalação do AgendoPro..."
    
    # Verificações iniciais
    check_root
    detect_os
    check_requirements
    
    # Coleta de informações
    read -p "Digite o domínio para a aplicação (ex: agendopro.exemplo.com): " DOMAIN
    read -p "Digite o email do administrador: " ADMIN_EMAIL
    
    # Instalação
    install_dependencies
    setup_postgresql
    setup_nodejs
    setup_application
    setup_environment
    setup_supabase
    setup_nginx
    setup_ssl
    setup_firewall
    setup_pm2
    run_migrations
    setup_backup
    setup_monitoring
    
    # Iniciar serviços
    log "Iniciando serviços..."
    pm2 start ecosystem.config.js
    
    # Mostrar informações finais
    log "Instalação concluída com sucesso!"
    echo
    info "=== INFORMAÇÕES DE ACESSO ==="
    info "URL da aplicação: http${DOMAIN:+s}://$DOMAIN"
    info "Email do admin: $ADMIN_EMAIL"
    info "Senha do banco: $DB_PASSWORD"
    echo
    info "=== PRÓXIMOS PASSOS ==="
    info "1. Acesse a aplicação e faça o primeiro cadastro"
    info "2. Configure as integrações de email e WhatsApp"
    info "3. Personalize as configurações de aparência"
    echo
    info "=== COMANDOS ÚTEIS ==="
    info "Ver logs da aplicação: pm2 logs agendopro-app"
    info "Reiniciar aplicação: pm2 restart agendopro-app"
    info "Status dos serviços: pm2 status"
    info "Backup manual: /usr/local/bin/agendopro-backup.sh"
    echo
    warn "IMPORTANTE: Salve as informações acima em local seguro!"
}

# Executar instalação
main "$@"
EOF

chmod +x install.sh

log "Autoinstalador criado com sucesso!"
