# CONTRACTS.md — Contrats d'API Inviolables du Web OS 🔒

> **Doctrine** : Tout agent qui modifie un composant du Shell DOIT respecter ces contrats.
> **Dernière mise à jour** : 2026-03-17 (Post-Audit RCA V0.1.1)

## 🧿 Double Matrice d'Agents

### Pipeline SPECS (Antigravity conçoit)
| Strate | Agent | Artefact | Sizing |
|--------|-------|----------|--------|
| A0 | Amadeus | SDD (Wishlists) | ~50L |
| A1 | Antigravity (Claude) | PRD (OpenSpec) | ~200L |
| A2 | Antigravity (Claude) | ADR (7 Phases) | ~80L |
| A3 | Antigravity (Claude) | **DDD (Contrats)** | **200-2000L** |

### Pipeline DEV (Gemini CLI exécute)
| Strate | Agent | Source |
|--------|-------|--------|
| A0 | Antigravity (Claude) | Audit final |
| A1 | Gemini CLI | PRD + CONTRACTS.md |
| A2 | Conductor (Extension) | META-CONDUCTOR + ADR |
| A3 | Ralph Loop (Extension) | **DDD + CONTRACTS.md** |

> **Le DDD est le PONT entre les deux pipelines.** Ralph ne code qu'avec le DDD devant les yeux.


---

## 1. App Registry — `src/lib/app-registry.ts`

### Interface `AppManifest`
```typescript
interface AppManifest {
  id: string;            // Unique, kebab-case (ex: 'command-center')
  name: string;          // Titre affiché dans la barre de titre
  icon: string;          // Nom d'icône Lucide en PascalCase (ex: 'LayoutDashboard')
  version: string;       // SemVer (ex: '0.1.1')
  description: string;   // Description courte pour le Store/Drawer
  component: ComponentType; // ⚠️ REQUIS — Le composant React à monter
  dockSlot?: number;     // Position dans le Dock (0 = premier)
  a2Ship?: string;       // Vaisseau A2 associé (ex: 'USS Enterprise')
}
```

### Signature `registerApp`
```typescript
// ✅ CORRECT — 1 argument, component DANS le manifest
registerApp({ id: 'para', name: 'PARA', ..., component: App });

// ❌ INTERDIT — 2 arguments (ancienne API)
registerApp({ id: 'para', name: 'PARA', ... }, App);
```

### Fichier `register.ts` — Template obligatoire
```typescript
import { registerApp } from '../../lib/app-registry';
import App from './[NomDuComposant]';

registerApp({
  id: '[kebab-case-id]',
  name: '[Display Name]',
  icon: '[LucideIconPascalCase]',
  version: '0.1.x',
  description: '[Description courte]',
  component: App
});
```

### Anti-Patterns INTERDITS
- ❌ Ne jamais exporter autre chose qu'un appel `registerApp()`
- ❌ Ne jamais importer depuis un store dans un register.ts
- ❌ Ne jamais utiliser d'export default dans register.ts

---

## 2. ErrorBoundary — `src/components/ErrorBoundary.tsx`

### Contrat de rendu
```typescript
class ErrorBoundary extends Component<{ children?: ReactNode }, State> {
  render() {
    if (this.state.hasError) return <FallbackUI />;
    return this.props.children;  // ⚠️ JAMAIS this.children
  }
}
```

### Règle d'intégrité
- `this.props.children` est la **seule** façon d'accéder aux enfants
- `this.children` retourne `undefined` et VIDE toutes les fenêtres
- Ce composant est wrappé autour de CHAQUE fenêtre dans Desktop.tsx

---

## 3. WindowFrame — `src/components/WindowFrame.tsx`

### Props
```typescript
interface WindowFrameProps {
  id: string;               // Doit correspondre à un AppManifest.id
  title: string;            // Affiché dans la barre de titre
  children: React.ReactNode; // ⚠️ REQUIS — Le contenu de la fenêtre
}
```

### Invariants
- La position est clampée par `clampPosition()` (jamais hors viewport)
- `zIndex` est capé à 1000 via `nextZ()`
- Le resize handle est en bas à droite (cursor-se-resize)

---

## 4. Shell Store — `src/stores/shell.store.ts`

### Interface `AppWindow`
```typescript
interface AppWindow {
  id: string;              // Doit correspondre à un AppManifest.id
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;          // 0-1000
  position: { x: number; y: number };  // Clampée dans le viewport
  size: { width: number; height: number };
}
```

### Clés de persistence
| Clé | Format | Version actuelle |
|-----|--------|-----------------|
| `aspace-shell-layout-v1` | JSON `{ version, state }` | `0.1.1` |

### Invariants
- `openApp()` réutilise un window existant (pas de doublons)
- `bootClean()` supprime le localStorage ET recharge la page
- Le schema version DOIT être mis à jour si le format de `AppWindow` change

---

## 5. Desktop — `src/components/Desktop.tsx`

### Chaîne de rendu (DO NOT BREAK)
```
Desktop
  └→ ViewportGuard
       └→ TopBar
       └→ windows.map(win =>
            └→ WindowFrame(id, title)
                 └→ ErrorBoundary
                      └→ AppComponent ? <AppComponent /> : <PlaceholderApp />
          )
       └→ ToastContainer
       └→ AppDrawer
       └→ Dock
```

### Règle d'import des apps
Les imports dans Desktop.tsx suivent cet ordre strict :
```typescript
import '../apps/command-center/register';  // Slot 0
import '../apps/para/register';            // Framework
import '../apps/ikigai/register';          // Framework
import '../apps/life-wheel/register';      // Framework
import '../apps/twelve-week/register';     // Framework
import '../apps/gtd/register';             // Framework
import '../apps/deal/register';            // Framework
import '../apps/store/register';           // System
```

### Anti-Patterns INTERDITS
- ❌ Ne jamais modifier l'ordre des imports sans vérifier l'impact
- ❌ Ne jamais injecter de logique conditionnelle dans la boucle windows.map
- ❌ Ne jamais utiliser un `key` autre que `win.id` dans la boucle

---

## 7. Architecture 3 Couches — `ADR-FWK-020` (FONDAMENTAL)

```
COUCHE 3 : Frameworks (PARA, Ikigai, Wheel, 12WY, GTD, DEAL)
            ↕ R/W via LD-Router
COUCHE 2 : Domaines de Vie (LD01-LD08)
COUCHE 1 : OS (shell + agents)
```

### 16 IndexedDB
```
8x Domaines :  aspace-ld01-business ... aspace-ld08-impact
6x Frameworks : aspace-fw-para, fw-ikigai, fw-wheel, fw-12wy, fw-gtd, fw-deal
2x OS :         aspace-shell, aspace-agents
```

### Matrice de Coopération (R=Read, W=Write, —=Interdit)

| Framework | LD01 | LD02 | LD03 | LD04 | LD05 | LD06 | LD07 | LD08 |
|-----------|------|------|------|------|------|------|------|------|
| **PARA** | **W** | **W** | **W** | **W** | **W** | **W** | **W** | **W** |
| **Ikigai** | R | R | R | R | R | R | R | R |
| **Wheel** | R | R | R | R | R | R | R | R |
| **12WY** | **W** | R | R | R | R | R | R | R |
| **GTD** | **W** | — | **W** | **W** | — | **W** | — | — |
| **DEAL** | R | R | R | R | R | R | R | R |

---

## 8. LD-Router — `src/lib/ld-router.ts` (NOUVEAU V0.1.2+)

### Contrat d'écriture
```typescript
// Point d'entrée UNIQUE pour les écritures cross-LD
export async function writeToLD(
  ldId: LDId,
  store: string,
  action: 'add' | 'update' | 'delete',
  data: unknown,
  callerFramework: string   // 'para' | 'gtd' | '12wy'
): Promise<void>;
// ⚠️ REJETTE si le framework n'a pas le droit d'écrire dans ce LD
```

### Contrat de lecture
```typescript
export function useLDRead(ldId: LDId, store: string): readonly Item[];
// Retourne les données en LECTURE SEULE — pas de mutation
```

### Règles
- ❌ JAMAIS d'écriture directe dans un IndexedDB LD sans passer par le Router
- ❌ JAMAIS de lecture cross-FW (un FW store ne lit pas un autre FW store)
- ✅ Exception : Life Wheel peut lire les SCORES des autres FW stores

---

## 6. Nommage des fichiers — Convention PascalCase

| Type | Convention | Exemple |
|------|-----------|---------|
| Composant principal | `[NomPascal]App.tsx` | `ParaApp.tsx`, `GtdApp.tsx` |
| Registre | `register.ts` | Identique dans chaque app |
| Store FW (config) | `fw-[nom].store.ts` | `fw-para.store.ts`, `fw-ikigai.store.ts` |
| Store LD (données) | `ld[XX].store.ts` | `ld01.store.ts` (accès via LD-Router) |
| Store OS | `[domaine].store.ts` | `shell.store.ts`, `agents.store.ts` |
| Page | `[NomPascal]Page.tsx` | `DashboardPage.tsx` |
| Composant partagé | `[NomPascal].tsx` | `WindowFrame.tsx` |

### Mapping des fichiers existants
| App ID | Fichier composant | Import dans register.ts | FW Store |
|--------|------------------|------------------------|----------|
| `command-center` | `CommandCenter.tsx` | `import App from './CommandCenter'` | — (pas de FW store) |
| `para` | `ParaApp.tsx` | `import App from './ParaApp'` | `fw-para.store.ts` |
| `ikigai` | `IkigaiApp.tsx` | `import App from './IkigaiApp'` | `fw-ikigai.store.ts` |
| `life-wheel` | `LifeWheelApp.tsx` | `import App from './LifeWheelApp'` | `fw-wheel.store.ts` |
| `twelve-week` | `TwelveWeekApp.tsx` | `import App from './TwelveWeekApp'` | `fw-12wy.store.ts` |
| `gtd` | `GtdApp.tsx` | `import App from './GtdApp'` | `fw-gtd.store.ts` |
| `deal` | `DealApp.tsx` | `import App from './DealApp'` | `fw-deal.store.ts` |
| `store` | `AppStore.tsx` | `import App from './AppStore'` | — (utilise shell) |
