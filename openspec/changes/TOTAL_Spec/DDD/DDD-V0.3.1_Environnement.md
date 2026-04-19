# DDD-V0.3.1 — Environnement & VFS

> **ADR** : ADR-V0.3.1 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Étape A.2 : Layering dans Desktop.tsx

**CODE DIRECTIVE**
```tsx
return (
  <ViewportGuard>
    {/* L-10: Wallpaper fixed */}
    <div key={activeWallpaperId} className="fixed inset-0 z-[-10] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${wallpaperUrl})` }} />
    
    {/* L-9: Overlay fixed */}
    <div className="fixed inset-0 z-[-9] bg-black/40 pointer-events-none" />

    {/* L0: Interface transparent */}
    <div className="w-full h-screen overflow-hidden relative bg-transparent text-[var(--theme-text)]">
       <TopBar />
       <Dock />
    </div>
  </ViewportGuard>
);
```

## Étape A.3 : Hook useWallpaper.ts

```typescript
export function useWallpaper() {
  const activeId = useOsSettingsStore(state => state.activeWallpaperId);
  const [url, setUrl] = useState(DEFAULTS[0]);

  useEffect(() => {
    let objUrl: string | null = null;
    let isMounted = true;

    async function load() {
      if (DEFAULTS[activeId]) {
        if (isMounted) setUrl(DEFAULTS[activeId]);
      } else {
        const wp = await getWallpaperById(activeId);
        if (isMounted && wp?.blob) {
          objUrl = URL.createObjectURL(wp.blob);
          setUrl(objUrl);
        }
      }
    }
    load();
    return () => { isMounted = false; if (objUrl) URL.revokeObjectURL(objUrl); };
  }, [activeId]);

  return url;
}
```

## Étape B.1-B.2 : Moteur de Variables RGB

**Utility `hexToRgb`** (dans useThemeApply.ts)
```typescript
const rgb = hexToRgb(color);
root.style.setProperty('--theme-accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
```
Permet l'usage dans le Dock : `backgroundColor: 'rgba(var(--theme-accent-rgb), 0.2)'`.

## Étape B.3 : Directive de Purge

**INTERDICTION** : Ne plus utiliser `text-white`, `text-emerald-400`, `bg-gray-900`.
**OBLIGATION** : Utiliser `text-[var(--theme-text)]`, `border-[var(--theme-accent)]`, `bg-[var(--theme-bg)]/80`.

**Gate** : `npx tsc --noEmit` + Vérification contraste Thème Clair.
