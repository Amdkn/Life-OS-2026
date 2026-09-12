const fs = require('fs');
let code = fs.readFileSync('src/stores/fw-12wy.store.ts', 'utf8');
code = code.replace(
`export interface WyVision extends ParaItem {
  type: 'wy-vision';
  domainId: string; // V0.6.7 REQUIRED
  ikigaiVisionId?: string;
}`,
`export interface WyVision extends ParaItem {
  type: 'wy-vision';
  domainId: string; // V0.6.7 REQUIRED
  ikigaiVisionId?: string;
  meaningHorizon?: string; // H1, H3, H10, H25, H90
  operationalCadence?: string; // weekly, cycle
  provenance?: string;
}`);
fs.writeFileSync('src/stores/fw-12wy.store.ts', code);
