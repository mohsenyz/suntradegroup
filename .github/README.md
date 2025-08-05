# 🚀 GitHub Actions CI/CD Setup

This directory contains comprehensive GitHub Actions workflows for the Sun Trade Group product portfolio website.

## 📋 Workflows Overview

### 1. 🚀 Deploy to Production (`deploy.yml`)
**Triggers:** Push to `main` branch, manual dispatch
**Purpose:** Complete deployment pipeline for production

**Features:**
- 🔒 Security scanning with Trivy
- 🌐 Frontend build and optimization
- 🐘 PHP API validation
- 📤 FTP deployment to production server
- 🏥 Post-deployment health checks
- 🚨 Performance audits with Lighthouse

### 2. 🧪 Continuous Integration (`ci.yml`)
**Triggers:** Pull requests, pushes to feature branches
**Purpose:** Quality assurance and testing

**Features:**
- 🔍 Code quality checks (ESLint, TypeScript)
- 🔨 Multi-Node.js version testing
- 🐘 PHP API integration tests
- 🔒 Security vulnerability scanning
- ⚡ Performance validation
- 📦 Dependency analysis

### 3. 🔒 Security Monitoring (`security.yml`)
**Triggers:** Weekly schedule, manual dispatch, security-related changes
**Purpose:** Comprehensive security monitoring

**Features:**
- 📦 Dependency vulnerability audits
- 🕵️ Secret scanning with multiple tools
- 🛡️ Security headers validation
- 📁 File permissions checking
- 📊 Security reporting

## 🔧 Setup Instructions

### 1. Repository Secrets Configuration

Add these secrets to your GitHub repository (`Settings` → `Secrets and Variables` → `Actions`):

```bash
# FTP Deployment Credentials
FTP_HOST=23.88.79.16
FTP_USERNAME=sitesync@suntradegroup.ir
FTP_PASSWORD=sitesync*@
FTP_PORT=21
FTP_REMOTE_DIR=public_html

# Optional: Enhanced Security
GITLEAKS_LICENSE=your_gitleaks_license_key  # For advanced secret scanning
```

### 2. Environment Protection Rules

1. Go to `Settings` → `Environments`
2. Create `production` environment
3. Add protection rules:
   - ✅ Required reviewers (recommended)
   - ✅ Wait timer (optional)
   - ✅ Restrict to main branch

### 3. Branch Protection Rules

Configure branch protection for `main`:
1. Go to `Settings` → `Branches`
2. Add rule for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass
   - ✅ Require conversation resolution before merging
   - ✅ Include administrators

## 🎯 Workflow Details

### Build Process
1. **Frontend Build:**
   - Node.js setup and dependency installation
   - Next.js static site generation (`npm run build`)
   - Bundle analysis and optimization
   - Artifact uploading for deployment

2. **API Validation:**
   - PHP syntax validation
   - Local server testing
   - Endpoint health checks
   - Integration testing

3. **Deployment:**
   - Secure FTP upload via FTPS
   - Atomic deployment with rollback capability
   - Health checks and validation

### Security Features
- **Automated Vulnerability Scanning:** Weekly dependency audits
- **Secret Detection:** Multiple layers of secret scanning
- **Code Quality:** TypeScript and ESLint validation
- **Performance Monitoring:** Lighthouse audits
- **Security Headers:** Production security validation

### Performance Optimization
- **Bundle Analysis:** Size monitoring and optimization
- **Multi-Node Testing:** Compatibility across Node.js versions
- **Caching:** Intelligent dependency and build caching
- **Parallel Jobs:** Optimized execution time

## 📊 Monitoring and Notifications

### GitHub Actions Dashboard
- All workflow runs visible in the `Actions` tab
- Detailed logs for debugging and monitoring
- Artifact downloads for build inspection

### Status Badges
Add these to your main README.md:

```markdown
[![Deploy](https://github.com/mohsenyz/suntradegroup/actions/workflows/deploy.yml/badge.svg)](https://github.com/mohsenyz/suntradegroup/actions/workflows/deploy.yml)
[![CI](https://github.com/mohsenyz/suntradegroup/actions/workflows/ci.yml/badge.svg)](https://github.com/mohsenyz/suntradegroup/actions/workflows/ci.yml)
[![Security](https://github.com/mohsenyz/suntradegroup/actions/workflows/security.yml/badge.svg)](https://github.com/mohsenyz/suntradegroup/actions/workflows/security.yml)
```

## 🚀 Usage Examples

### Manual Deployment
```bash
# Trigger production deployment
# Go to Actions → Deploy to Production → Run workflow
# Select: production environment
```

### Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push and create PR
git push origin feature/new-feature
# Create PR on GitHub - CI will run automatically

# 4. After PR approval and merge, deployment runs automatically
```

### Security Monitoring
- Runs automatically every Monday at 6 AM UTC
- Can be triggered manually for immediate security checks
- Results available in workflow summaries and security tab

## 🛠️ Customization

### Adding New Environments
1. Create new environment in GitHub settings
2. Add environment-specific secrets
3. Modify `deploy.yml` to include new environment
4. Update deployment logic as needed

### Custom Deployment Targets
```yaml
# Example: Add staging deployment
deploy-staging:
  environment:
    name: staging
    url: https://staging.suntradegroup.ir
  # Add staging-specific deployment steps
```

### Additional Security Checks
```yaml
# Example: Add custom security validation
custom-security-check:
  steps:
    - name: Custom Security Check
      run: |
        # Your custom security validation
        echo "Running custom security checks..."
```

## 📝 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify TypeScript compilation
   - Review ESLint errors

2. **Deployment Failures:**
   - Verify FTP credentials
   - Check server connectivity
   - Validate file permissions

3. **Security Alerts:**
   - Review dependency vulnerabilities
   - Check for exposed secrets
   - Validate security headers

### Debug Commands
```bash
# Local testing
npm run build          # Test frontend build
./dev-api.sh          # Test API locally
npm run lint          # Check code quality
npm audit             # Check security vulnerabilities
```

## 🔄 Maintenance

### Regular Tasks
- **Weekly:** Review security scan results
- **Monthly:** Update dependencies and review outdated packages
- **Quarterly:** Review and update CI/CD workflows
- **As needed:** Rotate secrets and credentials

### Optimization Tips
- Monitor workflow execution times
- Review cache hit rates
- Optimize build processes
- Update GitHub Actions versions

## 📞 Support

For issues with the CI/CD pipeline:
1. Check workflow logs in GitHub Actions
2. Review repository settings and secrets
3. Consult this documentation
4. Create an issue in the repository

---

🎉 **Happy Deploying!** This CI/CD setup provides enterprise-grade automation for your Sun Trade Group website.