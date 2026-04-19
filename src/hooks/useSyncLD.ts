import { useEffect } from 'react';
import { useParaStore, Project } from '../stores/fw-para.store';
import { readFromLD, LDId } from '../lib/ld-router';
import { paraItemToProject } from '../utils/paraAdapter';
import { ParaItem } from '../stores/ld01.store';

const DOMAINS: LDId[] = ['ld01', 'ld02', 'ld03', 'ld04', 'ld05', 'ld06', 'ld07', 'ld08'];

export function useSyncLD() {
  const initializeProjects = useParaStore(s => s.initializeProjects);

  useEffect(() => {
    async function loadAll() {
      try {
        const allProjectsPromises = DOMAINS.map(async (ld) => {
          const items = await readFromLD<ParaItem>(ld, 'projects');
          return items.map(i => paraItemToProject(i, ld));
        });
        
        const results = await Promise.all(allProjectsPromises);
        const flatProjects = results.flat();
        
        if (flatProjects.length > 0) {
          initializeProjects(flatProjects);
          console.info("[useSyncLD] PARA Projects Hydrated:", flatProjects.length);
        } else {
          console.info("[useSyncLD] No external data found. Preserving local 'Pépites'.");
        }
      } catch (err) {
        console.error("Failed to sync LD stores", err);
      }
    }
    
    loadAll();
  }, [initializeProjects]);
}
