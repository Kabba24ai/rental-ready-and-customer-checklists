# Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the Rental Ready Checklist System to production environments following the domain-driven architecture pattern.

## 🏗️ Infrastructure Architecture

### Domain Deployment Strategy
```
Production Environment:
├── kabba.ai (Frontend - Static Hosting)
├── admin.kabba.ai (Admin Portal - Static Hosting)
├── customer.kabba.ai (Customer Portal - Static Hosting)
└── api.kabba.ai (Backend API - Container Hosting)
```

### Recommended Hosting Providers

#### Frontend Domains (Static Hosting)
- **Primary**: Netlify (recommended for ease of use)
- **Alternative**: Vercel, AWS S3 + CloudFront
- **Enterprise**: AWS CloudFront + S3, Azure Static Web Apps

#### Backend API Domain
- **Primary**: AWS ECS/Fargate, Google Cloud Run
- **Alternative**: DigitalOcean App Platform, Railway
- **Enterprise**: Kubernetes (EKS, GKE, AKS)

#### Database
- **Primary**: AWS RDS PostgreSQL, Google Cloud SQL
- **Alternative**: PlanetScale, Supabase
- **Enterprise**: Self-managed PostgreSQL cluster

## 📦 Build Configuration

### Environment-Specific Builds

#### Development Environment
```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development
VITE_ENABLE_MOCK_DATA=true
VITE_DEBUG_MODE=true
```

#### Staging Environment
```bash
# .env.staging
VITE_API_URL=https://api-staging.kabba.ai
VITE_APP_ENV=staging
VITE_ENABLE_MOCK_DATA=false
VITE_DEBUG_MODE=true
```

#### Production Environment
```bash
# .env.production
VITE_API_URL=https://api.kabba.ai
VITE_APP_ENV=production
VITE_ENABLE_MOCK_DATA=false
VITE_DEBUG_MODE=false
VITE_SENTRY_DSN=your-sentry-dsn
```

### Build Scripts
```json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production",
    "build:analyze": "vite build --mode production && npx vite-bundle-analyzer dist"
  }
}
```

## 🌐 Netlify Deployment (Recommended)

### Netlify Configuration
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build:prod"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
```

### Deployment Steps
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Initialize site
netlify init

# 4. Deploy to staging
netlify deploy --build

# 5. Deploy to production
netlify deploy --prod --build
```

### Domain Configuration
```bash
# Set up custom domains
netlify domains:add kabba.ai
netlify domains:add admin.kabba.ai
netlify domains:add customer.kabba.ai

# Configure DNS
# Add CNAME records pointing to your-site.netlify.app
```

## ☁️ AWS Deployment

### S3 + CloudFront Setup

#### S3 Bucket Configuration
```bash
# Create S3 buckets
aws s3 mb s3://kabba-ai-frontend
aws s3 mb s3://admin-kabba-ai
aws s3 mb s3://customer-kabba-ai

# Configure bucket for static hosting
aws s3 website s3://kabba-ai-frontend \
  --index-document index.html \
  --error-document index.html
```

#### CloudFront Distribution
```json
{
  "DistributionConfig": {
    "CallerReference": "kabba-ai-frontend",
    "Origins": [{
      "Id": "S3-kabba-ai-frontend",
      "DomainName": "kabba-ai-frontend.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }],
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-kabba-ai-frontend",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "CachePolicyId": "managed-caching-optimized"
    },
    "CustomErrorResponses": [{
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html"
    }]
  }
}
```

#### Deployment Script
```bash
#!/bin/bash
# deploy-aws.sh

# Build the application
npm run build:prod

# Sync to S3
aws s3 sync dist/ s3://kabba-ai-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## 🐳 Docker Deployment

### Multi-Stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:prod

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Security headers
RUN echo 'add_header X-Frame-Options "DENY" always;' > /etc/nginx/conf.d/security.conf && \
    echo 'add_header X-Content-Type-Options "nosniff" always;' >> /etc/nginx/conf.d/security.conf && \
    echo 'add_header X-XSS-Protection "1; mode=block" always;' >> /etc/nginx/conf.d/security.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security headers
        include /etc/nginx/conf.d/security.conf;
    }
}
```

### Docker Compose for Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

  api:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./api:/app
    ports:
      - "3001:3000"
    command: npm start
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/kabba

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=kabba
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build:prod
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📊 Monitoring and Analytics

### Error Tracking (Sentry)
```tsx
// src/utils/sentry.ts
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_APP_ENV,
    tracesSampleRate: 1.0,
  });
}

export { Sentry };
```

### Performance Monitoring
```tsx
// src/utils/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log(metric);
}

// Measure Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Health Checks
```tsx
// src/utils/healthCheck.ts
export const healthCheck = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
```

## 🔒 Security Configuration

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.kabba.ai;
">
```

### Environment Variables Security
```bash
# Use secrets management for sensitive data
# Never commit .env files with real credentials

# AWS Secrets Manager
aws secretsmanager create-secret \
  --name "kabba-ai/production" \
  --description "Production environment variables" \
  --secret-string '{"API_URL":"https://api.kabba.ai","DATABASE_URL":"..."}'
```

## 📈 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build:analyze

# Check for unused dependencies
npx depcheck

# Audit for vulnerabilities
npm audit
```

### Caching Strategy
```javascript
// Service Worker for caching
const CACHE_NAME = 'kabba-ai-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## 🚨 Rollback Strategy

### Quick Rollback Process
```bash
# Netlify rollback
netlify sites:list
netlify api listSiteDeploys --data '{"site_id":"YOUR_SITE_ID"}'
netlify api restoreSiteDeploy --data '{"site_id":"YOUR_SITE_ID","deploy_id":"PREVIOUS_DEPLOY_ID"}'

# AWS CloudFront rollback
aws s3 sync s3://backup-bucket/previous-version/ s3://kabba-ai-frontend/
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Deployment Checklist
- [ ] All tests passing
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security headers configured
- [ ] SSL certificates valid
- [ ] DNS records updated
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented
- [ ] Team notified of deployment

---

## 📞 Support and Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### Environment Variable Issues
```bash
# Verify environment variables are loaded
npm run build:prod -- --debug
```

#### Performance Issues
```bash
# Check bundle size
npm run build:analyze

# Profile runtime performance
npm run dev -- --profile
```

For additional support, contact the development team or refer to the troubleshooting documentation.

---

**Deployment completed successfully! 🚀**