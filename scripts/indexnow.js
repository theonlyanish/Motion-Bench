/**
 * Pings IndexNow (Bing, and through it DuckDuckGo, Yandex, Naver, Seznam) with
 * every URL in sitemap.xml, so changed pages are fetched within hours instead of
 * waiting for a scheduled crawl. Google does not use IndexNow.
 *
 *   node scripts/indexnow.js            # submit every sitemap URL
 *   node scripts/indexnow.js --dry-run  # print the payload, send nothing
 *   node scripts/indexnow.js /scroll /typography/gooey   # just these paths
 *
 * Run it after a deploy has gone live — IndexNow verifies the key by fetching
 * https://motion-bench.vercel.app/<key>.txt, so the key file must already be
 * reachable. The key file is the 32-hex-character .txt in the site root.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const root = path.join(__dirname, '..');
const HOST = 'motion-bench.vercel.app';
const SITE = 'https://' + HOST + '/';

const keyFile = fs.readdirSync(root).find(function (f) { return /^[0-9a-f]{32}\.txt$/.test(f); });
if (!keyFile) {
  console.error('No IndexNow key file (32 hex chars + .txt) found in the site root.');
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, '');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const paths = args.filter(function (a) { return a.startsWith('/'); });

let urls;
if (paths.length) {
  urls = paths.map(function (p) { return SITE + p.replace(/^\//, ''); });
} else {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  urls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), function (m) { return m[1]; });
}

const payload = JSON.stringify({
  host: HOST,
  key: key,
  keyLocation: SITE + keyFile,
  urlList: urls
});

if (dryRun) {
  console.log('Would POST to https://api.indexnow.org/indexnow');
  console.log(JSON.stringify({ host: HOST, key: key, keyLocation: SITE + keyFile, urlCount: urls.length, first: urls[0], last: urls[urls.length - 1] }, null, 2));
  process.exit(0);
}

const req = https.request({
  hostname: 'api.indexnow.org',
  path: '/indexnow',
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) }
}, function (res) {
  let body = '';
  res.on('data', function (d) { body += d; });
  res.on('end', function () {
    // 200 = accepted, 202 = accepted and key will be validated later.
    const ok = res.statusCode === 200 || res.statusCode === 202;
    console.log((ok ? 'Submitted ' : 'Failed: HTTP ' + res.statusCode + ' ') + urls.length + ' URLs' + (body ? ' — ' + body.trim() : ''));
    process.exit(ok ? 0 : 1);
  });
});
req.on('error', function (e) { console.error('Request failed:', e.message); process.exit(1); });
req.write(payload);
req.end();
