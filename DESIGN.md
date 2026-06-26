# Design

> Visuelles System für die Variante 04 (impeccable). Die anderen Varianten haben bewusst
> eigene Systeme; dieses Dokument beschreibt die markentreue „Drenched-Orange"-Linie.

## Color

Strategie: **Drenched** (die Fläche IST die Farbe). Identitätswahrend aus dem Logo.

| Rolle | Wert | Einsatz |
|---|---|---|
| Orange (Drench) | `#E5722A` | dominante Flächen, Hero |
| Orange tief | `#C8551B` | Ränder/Hover auf Orange |
| Tinte | `#1A1206` | Text auf Orange (Kontrast 6,8:1), dunkle Sektionen |
| Creme | `#F4E9D3` | Text auf Tinte, helle Karten/Kartenrahmen |
| Amber | `#F2A03A` | sekundärer Akzent, Hervorhebungen |

Kontrast-Regel: Auf Orange immer **Tinte**, nie Weiß/Creme (Weiß auf Orange < 3:1).
Auf Tinte immer Creme. Karte auf cremefarbenem Rahmen für Tile-Lesbarkeit.

## Typography

- Display: **Big Shoulders Display** (athletische Chicago-Signage-Grotesk; nicht auf der
  Reflex-Reject-Liste; trägt „unerbittlich/athletisch"). Gewichte 700–900.
- Body: **Hanken Grotesk** (humanistisch, ruhig) als Kontrast-Achse zum kondensierten Display.
- Kein Mono (wäre „technisches Kostüm" für ein Lauf-Event).
- Scale: fluid `clamp()`, ≥1.25-Ratio; Display-Headlines groß und eng (`letter-spacing` ~ -0.01em).

## Layout
- Drenched-Orange-Hero, dann Rhythmus aus Orange- und Tinte-Sektionen.
- Karte als großflächiges Kernstück auf cremefarbenem Rahmen.
- Container max ~1180px, fluid spacing `clamp()`.

## Motion
- Zurückhaltend, ease-out-expo. Karten-/Listen-Reveals per IntersectionObserver.
- `prefers-reduced-motion`: Crossfade statt Bewegung. Leaflet ohne Auto-Bewegung.

## Signature
Echte **Leaflet-Karte** der Dreisam-Runde (route-lap.geojson) plus ausgegrauter Gesamt-Track,
Marker an Hirzbergsteg und Schlosssteg Ebnet, dazu ein Höhen-/Fakten-Panel.
