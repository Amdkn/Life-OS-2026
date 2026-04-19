/** Life Wheel Aggregation Hook — Cross-LD Metric Processor (V0.1.4) */
import { useEffect, useCallback } from 'react';
import { useLifeWheelStore } from '../../../stores/fw-wheel.store';
import { readFromLD, LDId } from '../../../lib/ld-router';

export function useLifeWheelAggregation() {
  const { domains, updateDomainScore, calculateGlobalScore } = useLifeWheelStore();

  const syncScores = useCallback(async () => {
    try {
      const syncTasks = domains.map(async (domain) => {
        // In a real scenario, we would read 'metrics' and calculate an average
        // For now, we simulate the aggregation from each LD
        const metrics = await readFromLD<any>(domain.ldId, 'metrics');
        
        let calculatedScore = 0;
        if (metrics && metrics.length > 0) {
          const sum = metrics.reduce((acc: number, m: any) => acc + (m.value || 0), 0);
          calculatedScore = Math.round(sum / metrics.length);
        } else {
          // Placeholder: random score if no metrics found for demonstration
          calculatedScore = Math.floor(Math.random() * 40) + 40; 
        }

        updateDomainScore(domain.id, calculatedScore);
      });

      await Promise.all(syncTasks);
      calculateGlobalScore();
    } catch (err) {
      console.error("[LifeWheelAggregation] Sync failed:", err);
    }
  }, [domains, updateDomainScore, calculateGlobalScore]);

  useEffect(() => {
    syncScores();
    // In a real OS, we could sync on a timer or on LD change events
  }, []);

  return { syncScores };
}
