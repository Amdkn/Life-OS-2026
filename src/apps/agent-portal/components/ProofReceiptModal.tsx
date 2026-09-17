import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, CheckCircle, Database } from 'lucide-react';
import type { BlackboardEvent } from '../../../lib/blackboard/client';

interface ProofReceiptModalProps {
  agentId: string;
  agentName: string;
  isOpen: boolean;
  onClose: () => void;
  receipts: BlackboardEvent[];
}

export default function ProofReceiptModal({
  agentId,
  agentName,
  isOpen,
  onClose,
  receipts
}: ProofReceiptModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-[var(--glass-border)] rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border-subtle)] bg-[var(--glass-l2-bg)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brass)]/20 to-transparent border border-[var(--brass)]/30 flex items-center justify-center shadow-inner">
                  <Database className="w-6 h-6 text-[var(--brass)]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">Execution Receipts</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider">{agentName} ({agentId})</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--glass-bg-hover)] text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {receipts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-50">
                  <FileText className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">No receipts found for this agent.</p>
                </div>
              ) : (
                receipts.map((receipt) => (
                  <div key={receipt.id} className="glass-card bg-[var(--glass-l2-bg)] rounded-2xl border border-[var(--glass-border-subtle)] overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border-subtle)] bg-[var(--glass-bg-hover)]/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Receipt ID: {receipt.id.slice(0, 8)}...</span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {new Date(receipt.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="p-4 bg-black/40">
                      <pre className="text-[10px] font-mono text-[var(--text-secondary)] whitespace-pre-wrap break-all custom-scrollbar overflow-x-auto">
                        {(() => {
                          try {
                            return JSON.stringify(JSON.parse(receipt.payload_json), null, 2);
                          } catch {
                            return receipt.payload_json;
                          }
                        })()}
                      </pre>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
