import { recordLedgerEntry, calculateBalance, type LedgerEntry } from './ledger.js';
import * as crypto from 'crypto';

export class HoldingTreasuryEngine {
  // A pseudo holding account workspace ID
  public static readonly HOLDING_FRANCHISE_ID = 'holding_alikaly_bana';
  public static readonly TREASURY_ALERT_THRESHOLD = 5000; // Example threshold

  /**
   * Process a recurring receipt (e.g. child care fees)
   * This credits the franchise's local balance.
   */
  public processRecurringReceipt(franchiseId: string, amount: number, description: string): boolean {
    const entry: LedgerEntry = {
      idempotencyKey: crypto.randomUUID(), // In a real scenario, this would come from the payment provider (Stripe)
      franchiseId,
      amount,
      currency: 'USD',
      description,
      type: 'credit',
      category: 'recurring_receipt',
      timestamp: Date.now()
    };
    return recordLedgerEntry(entry);
  }

  /**
   * Allocates a specific fee or percentage to the holding account from the franchise account.
   */
  public allocateToHolding(franchiseId: string, amount: number, description: string, idempotencyKey: string): boolean {
    // 1. Debit from Franchise
    const franchiseDebit: LedgerEntry = {
      idempotencyKey: `debit_${idempotencyKey}`,
      franchiseId,
      amount,
      currency: 'USD',
      description: `Holding Allocation: ${description}`,
      type: 'debit',
      category: 'holding_allocation',
      timestamp: Date.now()
    };

    const debitSuccess = recordLedgerEntry(franchiseDebit);
    if (!debitSuccess) {
      return false; // Already processed or failed
    }

    // 2. Credit to Holding
    const holdingCredit: LedgerEntry = {
      idempotencyKey: `credit_${idempotencyKey}`,
      franchiseId: HoldingTreasuryEngine.HOLDING_FRANCHISE_ID,
      amount,
      currency: 'USD',
      description: `Received from Franchise ${franchiseId}: ${description}`,
      type: 'credit',
      category: 'holding_allocation_receipt',
      timestamp: Date.now()
    };

    return recordLedgerEntry(holdingCredit);
  }

  /**
   * Calculate net margin for a franchise
   */
  public getNetMargin(franchiseId: string): number {
    return calculateBalance(franchiseId);
  }

  /**
   * Check if treasury alert threshold is reached
   */
  public isTreasuryAlertTriggered(franchiseId: string): boolean {
    const balance = calculateBalance(franchiseId);
    return balance < HoldingTreasuryEngine.TREASURY_ALERT_THRESHOLD;
  }
}
