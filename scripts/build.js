'use strict';
/* Erzeugt dist/index.html: THULE-9.html mit eingebettetem Three.js r128 aus node_modules,
   damit das Spiel ohne CDN-Zugriff (offline) läuft. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'THULE-9.html');
const threeFile = require.resolve('three/build/three.min.js', { paths: [root] });
const outDir = path.join(root, 'dist');
const CDN_TAG = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>';

const html = fs.readFileSync(src, 'utf8');
if (!html.includes(CDN_TAG)) {
  console.error('Build fehlgeschlagen: Three.js-CDN-Tag in THULE-9.html nicht gefunden.');
  process.exit(1);
}
// "</script" im Bundle würde den Inline-Block vorzeitig beenden
const three = fs.readFileSync(threeFile, 'utf8').replace(/<\/script/gi, '<\\/script');
const out = html.replace(CDN_TAG, () => '<script>\n' + three + '\n</script>');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), out);
console.log('dist/index.html geschrieben (' + (out.length / 1024).toFixed(0) + ' KB)');
