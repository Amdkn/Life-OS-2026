# DDD-V0.3.5 — Doctrine Beth (Permissions & Veto)

> **ADR** : ADR-V0.3.5 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Étapes A.1-A.3 : Veto Rules

**MODIFY** `os-settings.store.ts` — ajouter :
```typescript
export interface VetoRule {
  id: string; action: string; description: string;
  requiresApproval: boolean; approver: 'manual' | 'auto';
}

vetoRules: VetoRule[];
updateVetoRule: (id: string, partial: Partial<VetoRule>) => void;

// Defaults :
vetoRules: [
  { id: 'vr-1', action: 'Delete Data',     description: 'Supprimer des données utilisateur',   requiresApproval: true, approver: 'manual' },
  { id: 'vr-2', action: 'Export External',  description: 'Envoyer des données vers un service externe', requiresApproval: true, approver: 'manual' },
  { id: 'vr-3', action: 'Agent Execute',    description: 'Exécuter une commande système via agent',     requiresApproval: true, approver: 'manual' },
  { id: 'vr-4', action: 'Hard Reset',       description: 'Purger toutes les données du système',        requiresApproval: true, approver: 'manual' },
],
updateVetoRule: (id, partial) => set(s => ({
  vetoRules: s.vetoRules.map(r => r.id === id ? { ...r, ...partial } : r)
})),
```

**NEW** `VetoRuleEditor.tsx` — Liste avec toggle + description + approver dropdown.

## Étapes B.1-B.2 : Permission Matrix

**NEW** `PermissionMatrix.tsx`
```typescript
const AGENTS = ['Rick', 'Amy', 'Clara', 'Rory', 'Nardole', 'River', 'Bill', 'Graham', 'Ryan', 'Yaz'];

export function PermissionMatrix() {
  const { vetoRules } = useOsSettingsStore();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead>
          <tr><th className="text-left p-2 text-white/30">Agent</th>
            {vetoRules.map(r => <th key={r.id} className="p-2 text-white/30 text-center">{r.action}</th>)}
          </tr>
        </thead>
        <tbody>
          {AGENTS.map(agent => (
            <tr key={agent} className="border-t border-white/5">
              <td className="p-2 text-white/60 font-bold">{agent}</td>
              {vetoRules.map(r => (
                <td key={r.id} className="p-2 text-center">
                  <span className={r.requiresApproval ? 'text-red-400' : 'text-emerald-400'}>
                    {r.requiresApproval ? '🔒' : '✅'}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Gate Finale** : `npm run gate` + veto rules modifiables + matrice visible

---

## Layout : SettingsApp.tsx

**NEW** `src/apps/settings/SettingsApp.tsx` — Sidebar interne 5 sections + main content :
```typescript
const SETTINGS_SECTIONS = [
  { id: 'environment', label: 'Environment', icon: Palette },
  { id: 'identity',    label: 'Identity',    icon: User },
  { id: 'fleet',       label: 'Fleet Gateway', icon: Wifi },
  { id: 'memory',      label: 'Memory State', icon: Database },
  { id: 'permissions', label: 'Permissions',  icon: Shield },
];
```

Chaque section rend le composant correspondant. Pattern identique aux autres framework apps.
