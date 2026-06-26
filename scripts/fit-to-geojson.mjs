// Parst die Garmin-.fit-Aufzeichnung des Laufs in saubere Web-Geodaten.
// Output:
//   data/route-full.geojson   – kompletter Track (downgesampelt)
//   data/route-lap.geojson    – EINE repraesentative Runde (~6,706 km) fuer die Leaflet-Karte
//   data/route-lap.json       – dieselbe Runde, auf [-1..1] normalisiert (fuer Canvas/SVG/WebGL)
//
// Aufruf:  node scripts/fit-to-geojson.mjs "Tracking Daten Backyard.fit"

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import FitParserModule from 'fit-file-parser';

const FitParser = FitParserModule.default ?? FitParserModule;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dataDir = resolve(root, 'data');
mkdirSync(dataDir, { recursive: true });

const fitPath = resolve(root, process.argv[2] ?? 'Tracking Daten Backyard.fit');
const buffer = readFileSync(fitPath);

const parser = new FitParser({
  force: true,
  speedUnit: 'km/h',
  lengthUnit: 'km',
  temperatureUnit: 'celsius',
  elapsedRecordField: true,
  mode: 'list',
});

parser.parse(buffer, (error, data) => {
  if (error) {
    console.error('FIT-Parse-Fehler:', error);
    process.exit(1);
  }

  const records = (data.records ?? []).filter(
    (r) =>
      Number.isFinite(r.position_lat) &&
      Number.isFinite(r.position_long) &&
      Math.abs(r.position_lat) <= 90 &&
      Math.abs(r.position_long) <= 180,
  );

  if (records.length === 0) {
    console.error('Keine GPS-Punkte im FIT gefunden.');
    process.exit(1);
  }

  const pts = records.map((r) => ({
    lat: r.position_lat,
    lng: r.position_long,
    dist: Number.isFinite(r.distance) ? r.distance : null, // kumulativ, km
    ele: Number.isFinite(r.altitude) ? r.altitude : null,
  }));

  const totalKm = pts[pts.length - 1].dist ?? null;
  const LAP_KM = 6.706; // ein "Yard" beim Backyard Ultra

  // --- Eine repraesentative Runde: erste vollstaendige Schleife (~6,706 km) ---
  let lap = pts;
  if (Number.isFinite(pts[0].dist) && totalKm && totalKm > LAP_KM) {
    const start = pts[0].dist;
    lap = pts.filter((p) => p.dist != null && p.dist - start <= LAP_KM + 0.05);
    if (lap.length < 20) lap = pts.slice(0, Math.min(pts.length, 600));
  }

  // --- GeoJSON-Helfer ---
  const toLineString = (arr) => ({
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: arr.map((p) => [p.lng, p.lat]) },
  });

  // Vollen Track downsampeln (jeder n-te Punkt), damit die Datei klein bleibt
  const step = Math.max(1, Math.floor(pts.length / 4000));
  const fullDown = pts.filter((_, i) => i % step === 0);
  const fullGeo = {
    type: 'FeatureCollection',
    features: [toLineString(fullDown)],
    meta: { totalKm, points: pts.length, downsampledTo: fullDown.length, lapKm: LAP_KM },
  };

  const lapGeo = {
    type: 'FeatureCollection',
    features: [toLineString(lap)],
    meta: { lapKm: LAP_KM, points: lap.length },
  };

  // --- Normalisierte Runde fuer Canvas/SVG/WebGL ---
  const lats = lap.map((p) => p.lat);
  const lngs = lap.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const cLat = (minLat + maxLat) / 2;
  const mPerDegLat = 111320;
  const mPerDegLng = 111320 * Math.cos((cLat * Math.PI) / 180);

  // in lokale Meter (equirektangular) projizieren
  const meters = lap.map((p) => ({
    x: (p.lng - (minLng + maxLng) / 2) * mPerDegLng,
    y: (p.lat - cLat) * mPerDegLat,
    ele: p.ele,
  }));
  const xs = meters.map((m) => m.x), ys = meters.map((m) => m.y);
  const spanX = Math.max(...xs) - Math.min(...xs) || 1;
  const spanY = Math.max(...ys) - Math.min(...ys) || 1;
  const span = Math.max(spanX, spanY);
  // auf [-1..1] (Y nach oben positiv)
  const norm = meters.map((m) => [(2 * m.x) / span, (2 * m.y) / span]);

  const elevs = lap.map((p) => p.ele).filter((e) => Number.isFinite(e));
  const lapJson = {
    points: norm,                       // [[x,y], ...] in [-1..1]
    latlng: lap.map((p) => [p.lat, p.lng]),
    bounds: { minLat, maxLat, minLng, maxLng },
    center: [cLat, (minLng + maxLng) / 2],
    aspect: spanX / spanY,
    lengthKm: LAP_KM,
    elevation: elevs.length ? { min: Math.min(...elevs), max: Math.max(...elevs) } : null,
    meta: { totalKm, totalPoints: pts.length, lapPoints: lap.length },
  };

  writeFileSync(resolve(dataDir, 'route-full.geojson'), JSON.stringify(fullGeo));
  writeFileSync(resolve(dataDir, 'route-lap.geojson'), JSON.stringify(lapGeo));
  writeFileSync(resolve(dataDir, 'route-lap.json'), JSON.stringify(lapJson));

  console.log('OK');
  console.log('  Gesamtdistanz:', totalKm ? totalKm.toFixed(2) + ' km' : 'n/a');
  console.log('  GPS-Punkte gesamt:', pts.length);
  console.log('  Runde-Punkte:', lap.length, '(~' + LAP_KM + ' km)');
  console.log('  Center:', lapJson.center.map((v) => v.toFixed(5)).join(', '));
  console.log('  BBox:', [minLat, minLng, maxLat, maxLng].map((v) => v.toFixed(5)).join(', '));
});
