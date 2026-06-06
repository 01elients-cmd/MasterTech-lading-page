const fs = require('fs');
const heicConvert = require('heic-convert');
(async () => {
  const inputBuffer = fs.readFileSync('IMG_4482.HEIC');
  const outputBuffer = await heicConvert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.8
  });
  fs.writeFileSync('public/jesus.jpg', outputBuffer);
})();
