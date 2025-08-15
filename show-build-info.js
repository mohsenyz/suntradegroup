#!/usr/bin/env node

/**
 * Show build information from the generated HTML
 * Useful for deployment verification
 */

const fs = require('fs');
const path = require('path');

function showBuildInfo() {
  const buildDir = path.join(__dirname, '.next');
  const outDir = path.join(__dirname, 'out');
  
  console.log('🏗️  Build Information\n');
  
  // Check if .next exists (dev/build)
  if (fs.existsSync(buildDir)) {
    console.log('✅ Next.js build directory exists (.next/)');
    
    const buildId = path.join(buildDir, 'BUILD_ID');
    if (fs.existsSync(buildId)) {
      const id = fs.readFileSync(buildId, 'utf8').trim();
      console.log(`📦 Build ID: ${id}`);
    }
  }
  
  // Check if out exists (static export)
  if (fs.existsSync(outDir)) {
    console.log('📤 Static export directory exists (out/)');
    
    // Try to find build info in index.html
    const indexPath = path.join(outDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      
      // Extract build time from comment
      const commentMatch = content.match(/Build Info: ([^v]+)v([\d.]+)/);
      if (commentMatch) {
        console.log(`⏰ Build Time: ${commentMatch[1].trim()}`);
        console.log(`🔖 Version: v${commentMatch[2]}`);
      }
      
      // Extract from meta tags
      const buildTimeMatch = content.match(/<meta name="build-time" content="([^"]+)"/);
      const buildVersionMatch = content.match(/<meta name="build-version" content="([^"]+)"/);
      
      if (buildTimeMatch) {
        console.log(`🕒 Meta Build Time: ${buildTimeMatch[1]}`);
      }
      if (buildVersionMatch) {
        console.log(`📋 Meta Version: ${buildVersionMatch[1]}`);
      }
    }
  }
  
  // Show current time for comparison
  console.log(`\n🕐 Current Time: ${new Date().toISOString()}`);
  
  // Show package.json version
  const packagePath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`📦 Package Version: v${pkg.version}`);
  }
}

if (require.main === module) {
  showBuildInfo();
}

module.exports = { showBuildInfo };