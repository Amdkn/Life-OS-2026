import { Project, Resource, LifeWheelDomain } from '../stores/fw-para.store';

const ASPACE_NS = 'https://amdk.com/onto/aspace#';

export function exportParaToRdf(projects: Project[], resources: Resource[]): { turtle: string; jsonld: string } {
  const triples: { s: string; p: string; o: string; oType: 'uri' | 'literal' }[] = [];

  const addTriple = (s: string, p: string, o: string, oType: 'uri' | 'literal' = 'uri') => {
    triples.push({ s, p, o, oType });
  };

  const sanitizeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Domains as Area
  const domains = new Set<LifeWheelDomain>();
  const pillars = new Set<string>();

  projects.forEach(p => {
    domains.add(p.domain);
    p.pillars.forEach(pil => pillars.add(`${p.domain}-${pil}`));
  });
  resources.forEach(r => {
    domains.add(r.domain);
    r.linkedPillars.forEach(pil => pillars.add(`${r.domain}-${pil}`));
  });

  domains.forEach(d => {
    const dUri = `aspace:Domain_${d}`;
    addTriple(dUri, 'a', 'aspace:Area');
    addTriple(dUri, 'aspace:name', `"${d}"`, 'literal');
  });

  pillars.forEach(p => {
    const pUri = `aspace:Pillar_${p}`;
    addTriple(pUri, 'a', 'aspace:Area');
    addTriple(pUri, 'aspace:name', `"${p}"`, 'literal');
    // Assuming partOf domain
    const [domain] = p.split('-');
    addTriple(pUri, 'aspace:partOf', `aspace:Domain_${domain}`);
  });

  // Projects
  projects.forEach(p => {
    const pUri = `aspace:Project_${sanitizeId(p.id)}`;
    addTriple(pUri, 'a', 'aspace:Project');
    addTriple(pUri, 'aspace:name', `"${p.title.replace(/"/g, '\\"')}"`, 'literal');
    addTriple(pUri, 'aspace:status', `"${p.status}"`, 'literal');

    // Links to Domains and Pillars
    addTriple(pUri, 'aspace:covers', `aspace:Domain_${p.domain}`);
    p.pillars.forEach(pil => {
      addTriple(pUri, 'aspace:covers', `aspace:Pillar_${p.domain}-${pil}`);
    });
  });

  // Resources
  resources.forEach(r => {
    const rUri = `aspace:Resource_${sanitizeId(r.id)}`;
    addTriple(rUri, 'a', 'aspace:Resource');
    addTriple(rUri, 'aspace:name', `"${r.title.replace(/"/g, '\\"')}"`, 'literal');

    // Links to Domains and Pillars
    addTriple(rUri, 'aspace:covers', `aspace:Domain_${r.domain}`);
    r.linkedPillars.forEach(pil => {
      addTriple(rUri, 'aspace:covers', `aspace:Pillar_${r.domain}-${pil}`);
    });

    // Links to Projects
    r.linkedProjects.forEach(pid => {
       addTriple(rUri, 'aspace:partOf', `aspace:Project_${sanitizeId(pid)}`);
    });
    if (r.projectId) {
       addTriple(rUri, 'aspace:partOf', `aspace:Project_${sanitizeId(r.projectId)}`);
    }
  });

  // Generate Turtle
  let turtle = `@prefix aspace: <${ASPACE_NS}> .\n\n`;
  const groupedBySubject = triples.reduce((acc, t) => {
    if (!acc[t.s]) acc[t.s] = [];
    acc[t.s].push(t);
    return acc;
  }, {} as Record<string, typeof triples>);

  for (const [subject, st] of Object.entries(groupedBySubject)) {
    turtle += `${subject}\n`;
    const preds = st.reduce((acc, t) => {
      if (!acc[t.p]) acc[t.p] = [];
      acc[t.p].push(t);
      return acc;
    }, {} as Record<string, typeof triples>);

    const predStrs = Object.entries(preds).map(([p, ts]) => {
      const objStrs = ts.map(t => t.o).join(', ');
      return `  ${p} ${objStrs}`;
    });

    turtle += predStrs.join(' ;\n') + ' .\n\n';
  }

  // Generate JSON-LD
  const jsonldGraph = Object.entries(groupedBySubject).map(([subject, st]) => {
    const node: any = {
      '@id': subject.replace('aspace:', ASPACE_NS)
    };

    st.forEach(t => {
      const p = t.p === 'a' ? '@type' : t.p.replace('aspace:', ASPACE_NS);
      const o = t.oType === 'uri'
        ? (t.o.startsWith('aspace:') ? t.o.replace('aspace:', ASPACE_NS) : t.o)
        : t.o.replace(/^"|"$/g, ''); // strip quotes for JSON-LD literal

      if (!node[p]) {
        node[p] = o;
      } else {
        if (!Array.isArray(node[p])) node[p] = [node[p]];
        node[p].push(o);
      }
    });

    if (node['@type']) {
        node['@type'] = Array.isArray(node['@type'])
            ? node['@type'].map((t: string) => t.replace('aspace:', ASPACE_NS))
            : node['@type'].replace('aspace:', ASPACE_NS);
    }
    return node;
  });

  const jsonld = JSON.stringify({
    '@context': {
      'aspace': ASPACE_NS,
      'aspace:covers': { '@type': '@id' },
      'aspace:partOf': { '@type': '@id' }
    },
    '@graph': jsonldGraph
  }, null, 2);

  return { turtle, jsonld };
}
