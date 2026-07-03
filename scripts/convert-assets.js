import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const targets = [
  { src: 'src/assets/anh-can-tin-so-2.jpg', dest: 'src/assets/anh-can-tin-so-2.webp', resize: { width: 1920 } },
  { src: 'src/assets/bg_XanhDuong.png', dest: 'src/assets/bg_XanhDuong.webp', quality: 75 },
  { src: 'src/assets/bg_xanhla.png', dest: 'src/assets/bg_xanhla.webp', quality: 75 },
  { src: 'src/assets/bg_cam.png', dest: 'src/assets/bg_cam.webp', quality: 75 },
  { src: 'src/assets/left_order.png', dest: 'src/assets/left_order.webp', resize: { width: 1000 } },
  { src: 'src/assets/right_order.png', dest: 'src/assets/right_order.webp', resize: { width: 1200 } },
  { src: 'src/assets/header4.png', dest: 'src/assets/header4.webp', resize: { width: 2000 } },
  { src: 'src/assets/kido.jpg', dest: 'src/assets/kido.webp', resize: { width: 512, height: 512 } },
  { src: 'public/kido.jpg', dest: 'public/kido.webp', resize: { width: 512, height: 512 } },
  { src: 'src/assets/bgr_formXacNhanThanhToan.jpg', dest: 'src/assets/bgr_formXacNhanThanhToan.webp', resize: { width: 800 } }
];

async function convert() {
  for (const target of targets) {
    const srcPath = path.resolve(target.src);
    const destPath = path.resolve(target.dest);

    if (fs.existsSync(srcPath)) {
      console.log(`Converting ${target.src}...`);
      try {
        let pipeline = sharp(srcPath);
        if (target.resize) {
          pipeline = pipeline.resize(target.resize);
        }
        
        const q = target.quality || 80;
        const info = await pipeline
          .webp({ quality: q })
          .toFile(destPath);
        
        const srcSize = (fs.statSync(srcPath).size / 1024).toFixed(2);
        const destSize = (info.size / 1024).toFixed(2);
        const reduction = ((1 - info.size / fs.statSync(srcPath).size) * 100).toFixed(1);

        console.log(`Saved ${target.dest}: ${srcSize} KB -> ${destSize} KB (-${reduction}%)`);
      } catch (err) {
        console.error(`Error converting ${target.src}:`, err.message);
      }
    } else {
      console.warn(`Source file not found: ${target.src}`);
    }
  }
}

convert();
