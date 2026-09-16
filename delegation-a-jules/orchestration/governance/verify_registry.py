#!/usr/bin/env python3
"""Verificateur documentaire du registre work-items.json (pôle 0 gouvernance).

Analyse documentaire uniquement : aucune execution metier n'est affirmee.
Tests : inventaire source, 55 uniques, chemins existants, cycles/dependances
manquantes, scopes/owners (exclusivite inter-managers, package.json fondee).
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
BASE = REPO / "delegation-a-jules"
REGISTRY = Path(__file__).parent / "work-items.json"

EXPECTED_COUNT = 55
MANAGER_RULE = {0: "manager-a", 1: "manager-b", 2: "manager-c"}
FOUNDATION_ONLY = {"package.json", "package-lock.json"}

failures = []
passed = []


def check(name, ok, detail=""):
    (passed if ok else failures).append(f"{'PASS' if ok else 'FAIL'} {name}{(' — ' + detail) if detail else ''}")


def main():
    check("fichier registre lisible", REGISTRY.is_file(), str(REGISTRY))
    if failures:
        print("\n".join(failures))
        return 1
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    items = data.get("items", [])
    ids = [it.get("id") for it in items]

    # 1. Inventaire : exactement 55 items, uniques, champs requis
    check("count items == 55", len(items) == EXPECTED_COUNT, f"trouve {len(items)}")
    check("ids uniques", len(set(ids)) == len(ids), f"{len(set(ids))} uniques / {len(ids)}")
    required = {"id", "category", "path", "depends_on", "write_scope", "manager", "status", "evidence_sources"}
    malformed = [it.get("id", "?") for it in items if not required.issubset(it)]
    check("champs requis presents sur tous les items", not malformed, ", ".join(malformed))

    # 2. Statuts et managers
    bad_status = [it["id"] for it in items if it["status"] != "pending"]
    check("tous les status == pending", not bad_status, ", ".join(bad_status))
    bad_manager = [it["id"] for it in items if MANAGER_RULE.get(it["category"] % 3) != it["manager"]]
    check("managers = categorie modulo 3 (0->a,1->b,2->c)", not bad_manager, ", ".join(bad_manager))
    for m in ("manager-a", "manager-b", "manager-c"):
        n = sum(1 for it in items if it["manager"] == m)
        check(f"{m} non vide", n > 0, f"{n} items")

    # 3. Chemins sources existants sur disque
    missing_paths = [it["id"] for it in items if not (BASE / it["path"]).is_file()]
    check("tous les paths PRD existent", not missing_paths, ", ".join(missing_paths))

    # 4. Dependances : ids connus, pas d'auto-dependance, pas de cycle
    id_set = set(ids)
    unknown = sorted({d for it in items for d in it["depends_on"]} - id_set)
    check("aucune dependance vers un id absent du registre", not unknown, ", ".join(unknown))
    self_dep = [it["id"] for it in items if it["id"] in it["depends_on"]]
    check("aucune auto-dependance", not self_dep, ", ".join(self_dep))

    by_id = {it["id"]: it for it in items}
    WHITE, GREY, BLACK = 0, 1, 2
    color = {i: WHITE for i in ids}
    cycle_found = []

    def visit(node, stack):
        color[node] = GREY
        for dep in by_id[node]["depends_on"]:
            if color[dep] == GREY:
                cycle_found.append(stack + [dep])
            elif color[dep] == WHITE:
                visit(dep, stack + [dep])
        color[node] = BLACK

    for i in ids:
        if color[i] == WHITE:
            visit(i, [i])
    check("graphe de dependances acyclique", not cycle_found,
          " ; ".join("->".join(c) for c in cycle_found))

    # 5. Scopes : exclusivite entre managers differents, precision, fondation package.json
    scope_owner = {}
    dupes = []
    for it in items:
        for s in it["write_scope"]:
            norm = s.rstrip("/").lower()
            if norm in scope_owner and scope_owner[norm][1] != it["manager"]:
                dupes.append(f"{s}: {scope_owner[norm][0]} ({scope_owner[norm][1]}) vs {it['id']} ({it['manager']})")
            scope_owner.setdefault(norm, (it["id"], it["manager"]))
    check("aucun write_scope partage entre managers differents", not dupes, " ; ".join(dupes))
    pkg_owners = sorted(it["id"] for it in items if FOUNDATION_ONLY & {s.rstrip("/") for s in it["write_scope"]})
    check("package.json/lockfile uniquement sur PRD-011", pkg_owners == ["PRD-011"], f"owners={pkg_owners}")
    empty_scopes = [it["id"] for it in items if not it["write_scope"]]
    check("aucun scope vide", not empty_scopes, ", ".join(empty_scopes))

    # 6. Evidence sources renseignees et resolvees (fichier audit ou ancre code)
    bad_evidence = []
    for it in items:
        if not it["evidence_sources"]:
            bad_evidence.append(f"{it['id']} (vide)")
            continue
        for ev in it["evidence_sources"]:
            if not (REPO / ev).exists():
                bad_evidence.append(f"{it['id']} -> {ev}")
    check("evidence_sources renseignees et existantes", not bad_evidence, ", ".join(bad_evidence))

    # 7. Coherence categories couvertes 0..9
    cats = sorted({it["category"] for it in items})
    check("categories 0..9 couvertes", cats == list(range(10)), f"{cats}")

    print(f"Items: {len(items)} | Managers: "
          + ", ".join(f"{m}={sum(1 for it in items if it['manager'] == m)}" for m in ("manager-a", "manager-b", "manager-c")))
    print(f"Categorie manager-a: 0,3,6,9 | manager-b: 1,4,7 | manager-c: 2,5,8")
    print(f"Checks passes: {len(passed)} | Echecs: {len(failures)}")
    for line in failures:
        print(" ", line)
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())