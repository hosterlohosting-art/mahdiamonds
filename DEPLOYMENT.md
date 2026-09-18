# MAH Diamonds London — Production Deployment & Server Hosting Guide

This guide contains complete, step-by-step instructions for deploying the **MAH Diamonds London** luxury boutique application to a Linux VPS (Ubuntu 22.04 / 24.04 LTS), configuring domain DNS, setting up Nginx with SSL, process management with PM2, and Docker containerization.

---

## 1. Technical Stack & Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom Chaumet Paris Design System (`globals.css`)
- **Runtime**: Node.js 20+ LTS (or Node 22)
- **Production Mode**: `output: "standalone"` (Configured in `next.config.ts`)
- **Web Server / Reverse Proxy**: Nginx with HTTP/2, Gzip/Brotli compression, and TLS 1.3
- **Process Manager**: PM2 (Cluster Mode with auto-restart on crash & system reboot)
- **SSL Certificate**: Let's Encrypt Automated SSL via Certbot
- **Default Port**: `3000` (Proxied internally to Nginx on port `80` and `443`)

---

## 2. Server Requirements (VPS Sizing)

| Specification | Minimum Required | Recommended Production |
| :--- | :--- | :--- |
| **Provider** | Any VPS (DigitalOcean, Hetzner, AWS EC2, Linode, Vultr) | Hetzner Cloud / DigitalOcean / AWS |
| **Operating System** | Ubuntu 22.04 LTS or 24.04 LTS (x86_64) | Ubuntu 24.04 LTS |
| **vCPU** | 1 vCPU | 2 vCPU |
| **RAM** | 1 GB (with 2GB Swap) | 2 GB – 4 GB RAM |
| **Disk Space** | 15 GB NVMe SSD | 25 GB+ NVMe SSD |
| **Bandwidth** | 1 TB/month | 2 TB+/month |

---

## 3. Step-by-Step Ubuntu VPS Deployment (Nginx + PM2)

### Step 3.1: Connect to Server & Update Packages
```bash
ssh root@YOUR_SERVER_IP

# Update apt repositories and system packages
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git ufw software-properties-common nginx certbot python3-certbot-nginx
```

### Step 3.2: Configure Firewall (UFW)
```bash
# Allow SSH, HTTP, and HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Check status
ufw status
```

### Step 3.3: Install Node.js 20 LTS & PM2
```bash
# Install Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify versions
node -v   # Should output v20.x.x
npm -v    # Should output 10.x.x

# Install PM2 globally
npm install -g pm2
```

### Step 3.4: Configure Swap Space (Crucial for smooth Next.js builds)
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Step 3.5: Deploy Application Code
```bash
# Create web directory
mkdir -p /var/www/mah-diamonds
cd /var/www/mah-diamonds

# Clone your repository (or copy files via rsync/scp)
git clone https://github.com/YOUR_ORGANIZATION/mah-diamonds.git .

# Install dependencies
npm ci

# Configure environment variables
cp .env.example .env.production
nano .env.production
# Set: NEXT_PUBLIC_SITE_URL=https://mahdiamonds.co.uk

# Build the Next.js production bundle
npm run build
```

### Step 3.6: Start Application with PM2
```bash
# Start Next.js using PM2 ecosystem file
pm2 start ecosystem.config.cjs --env production

# Check status and logs
pm2 status
pm2 logs mah-diamonds --lines 20

# Configure PM2 to start automatically on system reboot
pm2 startup
# (Run the generated sudo env command shown in terminal output)
pm2 save
```

---

## 4. Domain & DNS Configuration

Before setting up SSL, update the DNS records at your domain registrar (Namecheap, GoDaddy, Cloudflare, Google Domains):

| Record Type | Host / Name | Value / Destination | TTL | Note |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `YOUR_SERVER_IP` | Automatic / 300s | Points apex domain to VPS |
| **A** or **CNAME** | `www` | `YOUR_SERVER_IP` (or `mahdiamonds.co.uk`) | Automatic / 300s | Points www subdomain to VPS |

> **If using Cloudflare**:
> 1. Set SSL/TLS Encryption mode to **Full (Strict)**.
> 2. Ensure the orange proxy cloud is **Active (Proxied)** for DDoS protection, global CDN caching, and edge TLS termination.

---

## 5. Nginx Reverse Proxy Configuration

Create the Nginx server block configuration for the domain:

```bash
nano /etc/nginx/sites-available/mahdiamonds.co.uk
```

Paste the following configuration:

```nginx
# Upstream Next.js application server
upstream nextjs_upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP — Redirect all traffic to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name mahdiamonds.co.uk www.mahdiamonds.co.uk;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS — Production Reverse Proxy
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name mahdiamonds.co.uk www.mahdiamonds.co.uk;

    # SSL Certificates (Created automatically by Certbot in Step 6)
    ssl_certificate /etc/letsencrypt/live/mahdiamonds.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mahdiamonds.co.uk/privkey.pem;

    # Modern SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip Compression
    gzip on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Next.js Static Assets Caching (_next/static)
    location /_next/static/ {
        alias /var/www/mah-diamonds/.next/static/;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public Directory Static Files (Images, Icons, Favicons)
    location /images/ {
        alias /var/www/mah-diamonds/public/images/;
        expires 30d;
        access_log off;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Reverse Proxy to Next.js Node Server
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable site configuration and test Nginx:
```bash
ln -s /etc/nginx/sites-available/mahdiamonds.co.uk /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 6. Free SSL Installation (Let's Encrypt / Certbot)

Run Certbot to obtain and configure trusted SSL certificates:

```bash
certbot --nginx -d mahdiamonds.co.uk -d www.mahdiamonds.co.uk
```

Test auto-renewal:
```bash
certbot renew --dry-run
```

---

## 7. Alternative: Docker & Docker Compose Deployment

If deploying via Docker containers:

```bash
# 1. Build and start container in background
docker compose up -d --build

# 2. View live logs
docker compose logs -f

# 3. Stop containers
docker compose down
```

---

## 8. Continuous Deployment & Updates (Zero-Downtime Script)

To pull the latest commits and reload without downtime:

```bash
# Run the included deployment script
./deploy.sh
```

---

## 9. Useful Maintenance & Debugging Commands

| Task | Command |
| :--- | :--- |
| **Check App Status** | `pm2 status` |
| **Live App Logs** | `pm2 logs mah-diamonds` |
| **Restart App** | `pm2 restart mah-diamonds` |
| **Check Nginx Status** | `systemctl status nginx` |
| **Reload Nginx** | `nginx -t && systemctl reload nginx` |
| **Check Server RAM & CPU** | `htop` or `free -m` |
| **Check Disk Space** | `df -h` |
