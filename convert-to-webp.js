const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is available
try {
  require('sharp');
} catch (error) {
  console.log('📦 Installing sharp for WebP conversion...');
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
  } catch (installError) {
    console.error('❌ Failed to install sharp. Please run: npm install sharp');
    process.exit(1);
  }
}

const sharp = require('sharp');

// WebP quality settings for different image types
const webpConfig = {
  hero: { quality: 80, effort: 6 },
  products: { quality: 85, effort: 6 },
  categories: { quality: 80, effort: 6 },
  banners: { quality: 80, effort: 6 },
  brands: { quality: 90, effort: 6 },
  logo: { quality: 95, effort: 6 }
};

async function convertToWebP(inputPath, outputPath, options) {
  try {
    await sharp(inputPath)
      .webp(options)
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = Math.round((1 - outputStats.size / inputStats.size) * 100);
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}: ${formatBytes(inputStats.size)} → ${formatBytes(outputStats.size)} (${savings}% saved)`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function convertDirectory(dir, options) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'originals') {
      await convertDirectory(filePath, options);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      await convertToWebP(filePath, webpPath, options);
    }
  }
}

async function main() {
  console.log('🔄 Converting images to WebP format...\n');
  
  const imageDir = 'public/images';
  
  // Convert different categories
  const categories = [
    { dir: path.join(imageDir, 'hero'), config: webpConfig.hero },
    { dir: path.join(imageDir, 'products'), config: webpConfig.products },
    { dir: path.join(imageDir, 'categories'), config: webpConfig.categories },
    { dir: path.join(imageDir, 'category-banners'), config: webpConfig.banners },
    { dir: path.join(imageDir, 'brands'), config: webpConfig.brands }
  ];
  
  // Convert logo
  const logoPath = path.join(imageDir, 'logo.png');
  if (fs.existsSync(logoPath)) {
    console.log('🏷️  Converting logo to WebP...');
    const webpLogoPath = path.join(imageDir, 'logo.webp');
    await convertToWebP(logoPath, webpLogoPath, webpConfig.logo);
    console.log();
  }
  
  for (const category of categories) {
    if (fs.existsSync(category.dir)) {
      console.log(`📁 Converting ${path.basename(category.dir)} images to WebP...`);
      await convertDirectory(category.dir, category.config);
      console.log();
    }
  }
  
  console.log('✨ WebP conversion complete!');
  console.log('\n💡 Next steps:');
  console.log('- Update your components to use <picture> elements with WebP fallbacks');
  console.log('- Consider removing original JPG/PNG files after testing');
  console.log('- Test WebP support in your target browsers');
}

main().catch(console.error);