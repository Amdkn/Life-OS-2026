import { useState, useEffect } from 'react';

export interface BridgeAnnotation {
  id: string;
  elementLabel: string;
  content: string;
  pageUrl: string;
  target: string;
  timestamp: string;
  screenshot?: string;
}

export const useBridgeWatcher = () => {
  const [annotations, setAnnotations] = useState<BridgeAnnotation[]>([]);
  const [lastAnnotation, setLastAnnotation] = useState<BridgeAnnotation | null>(null);

  // Simulation of real-time telemetry from .moat-stream.jsonl
  // In a production A'Space OS, this would be a WebSocket or FileSystem watcher
  useEffect(() => {
    const interval = setInterval(() => {
      // Logic to check for new annotations would go here
      // For now, we simulate a "Watcher Signal" every 30-60 seconds for demo purposes
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addManualAnnotation = (ann: BridgeAnnotation) => {
    setAnnotations(prev => [ann, ...prev]);
    setLastAnnotation(ann);
  };

  return { annotations, lastAnnotation, addManualAnnotation };
};
