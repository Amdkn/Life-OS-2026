/** Hook useParaProjects — Cross-LD Data Aggregator (P4.2) */
import { useState, useEffect, useCallback } from 'react';
import { useParaStore } from '../stores/fw-para.store';
import { readFromLD, writeToLD, LDId, LDStore } from '../lib/ld-router';
import { ParaItem } from '../stores/ld01.store';

export function useParaProjects() {
  const { activeTab, activeLdFilter } = useParaStore();
  const [items, setItems] = useState<ParaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const domains: LDId[] = activeLdFilter === 'all' 
        ? ['ld01', 'ld02', 'ld03', 'ld04', 'ld05', 'ld06', 'ld07', 'ld08']
        : [activeLdFilter as LDId];

      const storeName = activeTab as LDStore;
      
      const results = await Promise.all(
        domains.map(ld => readFromLD<ParaItem>(ld, storeName))
      );

      // Flatten results and sort by date
      const flatItems = results.flat().sort((a, b) => b.updatedAt - a.updatedAt);
      setItems(flatItems);
    } catch (err) {
      console.error("[useParaProjects] Failed to fetch items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, activeLdFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (ldId: LDId, item: ParaItem) => {
    await writeToLD(ldId, activeTab as LDStore, 'add', item, 'para');
    await fetchItems();
  };

  const updateItem = async (ldId: LDId, item: ParaItem) => {
    await writeToLD(ldId, activeTab as LDStore, 'update', item, 'para');
    await fetchItems();
  };

  const removeItem = async (ldId: LDId, id: string) => {
    await writeToLD(ldId, activeTab as LDStore, 'delete', { id }, 'para');
    await fetchItems();
  };

  return { items, isLoading, addItem, updateItem, removeItem, refresh: fetchItems };
}
