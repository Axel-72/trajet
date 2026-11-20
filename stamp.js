// Met a jour le numero de version : a lancer AVANT chaque publication.
//   node stamp.js
// Ecrit la meme version dans version.json et dans "const BUILD" de chaque page ; les pages installees comparent les deux
// au lancement et se rechargent toutes seules quand elles different.
const fs = require('fs'), path = require('path');
const v = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);       // AAAAMMJJHHMMSS (UTC)
for (const f of ['index.html', 'piste/index.html']) {
  const p = path.join(__dirname, f);
  const s = fs.readFileSync(p, 'utf8');
  if (!/const BUILD = '[^']*';/.test(s)) { console.error('BUILD introuvable dans', f); process.exit(1); }
  fs.writeFileSync(p, s.replace(/const BUILD = '[^']*';/, "const BUILD = '" + v + "';"));
}
fs.writeFileSync(path.join(__dirname, 'version.json'), JSON.stringify({ v }) + '\n');
console.log('version', v);
