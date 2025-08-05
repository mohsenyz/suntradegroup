const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is available, if not provide installation instructions
try {
  require('sharp');
} catch (error) {
  console.log('📦 Installing sharp for image optimization...');
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
  } catch (installError) {
    console.error('❌ Failed to install sharp. Please run: npm install sharp');
    process.exit(1);
  }
}

const sharp = require('sharp');

// Configuration for different image types
const config = {
  hero: { width: 1920, height: 1080, quality: 85 },
  products: { width: 800, height: 600, quality: 90 },
  categories: { width: 400, height: 300, quality: 85 },
  banners: { width: 1200, height: 400, quality: 85 },
  brands: { width: 200, height: 200, quality: 90 },
  logo: { width: 300, height: 300, quality: 95 }
};

async function optimizeImage(inputPath, outputPath, options) {
  try {
    const { width, height, quality } = options;
    
    let pipeline = sharp(inputPath)
      .resize(width, height, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality,
        progressive: true,
        mozjpeg: true
      });

    // If it's a PNG (like logos), keep as PNG but optimize
    if (path.extname(inputPath).toLowerCase() === '.png') {
      pipeline = sharp(inputPath)
        .resize(width, height, { 
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({ 
          quality,
          compressionLevel: 9,
          progressive: true
        });
    }

    await pipeline.toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = Math.round((1 - outputStats.size / inputStats.size) * 100);
    
    console.log(`✅ ${path.basename(inputPath)}: ${formatBytes(inputStats.size)} → ${formatBytes(outputStats.size)} (${savings}% saved)`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function optimizeDirectory(dir, options) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await optimizeDirectory(filePath, options);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      // Create backup directory
      const backupDir = path.join(dir, 'originals');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Backup original
      const backupPath = path.join(backupDir, file);
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
      }
      
      // Optimize
      await optimizeImage(filePath, filePath, options);
    }
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  const imageDir = 'public/images';
  
  // Optimize different categories with appropriate settings
  const categories = [
    { dir: path.join(imageDir, 'hero'), config: config.hero },
    { dir: path.join(imageDir, 'products'), config: config.products },
    { dir: path.join(imageDir, 'categories'), config: config.categories },
    { dir: path.join(imageDir, 'category-banners'), config: config.banners },
    { dir: path.join(imageDir, 'brands'), config: config.brands }
  ];
  
  // Optimize logo separately
  const logoPath = path.join(imageDir, 'logo.png');
  if (fs.existsSync(logoPath)) {
    console.log('🏷️  Optimizing logo...');
    const backupPath = path.join(imageDir, 'originals', 'logo.png');
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(logoPath, backupPath);
    }
    await optimizeImage(logoPath, logoPath, config.logo);
    console.log();
  }
  
  for (const category of categories) {
    if (fs.existsSync(category.dir)) {
      console.log(`📁 Optimizing ${path.basename(category.dir)} images...`);
      await optimizeDirectory(category.dir, category.config);
      console.log();
    }
  }
  
  console.log('✨ Image optimization complete!');
  console.log('\n💡 Tips:');
  console.log('- Original images are backed up in originals/ folders');
  console.log('- Consider using WebP format for even better compression');
  console.log('- Use lazy loading for product images');
  console.log('- Implement responsive images with srcset');
}

main().catch(console.error);