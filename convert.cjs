const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');

const ROOT = __dirname;
const DEST = path.join(ROOT, 'public', 'assets');

// Asegurarse de que el directorio existe
if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

// Archivos JPG a mover/copiar (nombre origen → nombre destino)
const jpgFiles = [
  ['nuestras intalaciones.JPG',            'instalaciones.jpg'],
  ['servicio  Mecánica General.JPG',         'servicio-mecanica.jpg'],
  ['servicio Frenos y Suspensión.JPG',      'servicio-frenos.jpg'],
  ['servicio Inyección Electrónica.JPG',    'servicio-inyeccion.jpg'],
  ['servicio Climatización.jpg',            'servicio-climatizacion.jpg'],
];

for (const [src, dest] of jpgFiles) {
  const srcPath = path.join(ROOT, src);
  const destPath = path.join(DEST, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copiado: ${src} → public/assets/${dest}`);
  } else {
    console.warn(`⚠️  No encontrado: ${src}`);
  }
}

// Convertir HEIC a JPG
(async () => {
  const heicFile = path.join(ROOT, 'servicio Electricidad y Electrónica.HEIC');
  const destPath = path.join(DEST, 'servicio-electricidad.jpg');
  if (fs.existsSync(heicFile)) {
    const inputBuffer = fs.readFileSync(heicFile);
    const outputBuffer = await heicConvert({ buffer: inputBuffer, format: 'JPEG', quality: 0.85 });
    fs.writeFileSync(destPath, outputBuffer);
    console.log('✅ Convertido: servicio Electricidad y Electrónica.HEIC → public/assets/servicio-electricidad.jpg');
  } else {
    console.warn('⚠️  No encontrado: servicio Electricidad y Electrónica.HEIC');
  }
})();
