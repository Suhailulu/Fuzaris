import { api } from './api';
import type { AlertSeverity, Cargo, InventoryItem, Asset } from './types';

export interface RiskEvaluationResult {
  score: number;
  level: AlertSeverity;
  reasons: string[];
  recommendations: string[];
  shouldAlert: boolean;
}

export const riskEngine = {
  evaluateCargoDelay: async (orgId: string, cargo: Cargo): Promise<RiskEvaluationResult | null> => {
    if (cargo.status !== 'DELAYED') return null;

    let score = 30; // base score for delay
    const reasons: string[] = [];
    const recommendations: string[] = [];
    let shouldAlert = true;

    reasons.push(`Cargo ${cargo.cargo_code} is delayed.`);

    if (cargo.priority === 'CRITICAL') {
      score += 40;
      reasons.push('Cargo priority is Critical.');
    } else if (cargo.priority === 'HIGH') {
      score += 20;
      reasons.push('Cargo priority is High.');
    }

    // specific rule for MEDICAL cargo delay
    if (cargo.category === 'MEDICAL' && cargo.priority === 'CRITICAL') {
      // Find medical inventory for this expedition or globally if not assigned
      const inventory = await api.getInventoryItems(orgId);
      const medicalStock = inventory.filter(i => i.category === 'MEDICAL' && (i.assigned_expedition_id === cargo.expedition_id || !cargo.expedition_id));
      
      let hasLowStock = false;
      medicalStock.forEach(item => {
        if (item.quantity <= item.critical_threshold) {
          hasLowStock = true;
        }
      });

      if (hasLowStock) {
        score += 21; // gets to 91 for CRITICAL priority (30 + 40 + 21)
        reasons.push('Medical stock is below critical threshold.');
        reasons.push('Expected delay exceeds current supply coverage.');
        recommendations.push('Reallocate medical supplies from another station.');
        recommendations.push('Prioritize the delayed medical shipment.');
        recommendations.push('Notify the expedition commander.');
        recommendations.push('Review current medical consumption.');
      } else {
        reasons.push('Medical stock is sufficient to cover delay.');
        recommendations.push('Monitor consumption closely until cargo arrives.');
      }
    } else {
      recommendations.push('Review transit routes and carrier status.');
      recommendations.push('Notify affected personnel.');
    }

    if (score > 100) score = 100;

    return {
      score,
      level: riskEngine.scoreToLevel(score),
      reasons,
      recommendations,
      shouldAlert
    };
  },

  evaluateInventory: (_orgId: string, item: InventoryItem): RiskEvaluationResult | null => {
    if (item.status === 'HEALTHY') return null;

    let score = 0;
    const reasons: string[] = [];
    const recommendations: string[] = [];
    
    if (item.status === 'LOW') {
      score = 40;
      reasons.push(`${item.name} stock is low.`);
      recommendations.push('Place restocking order.');
    } else if (item.status === 'CRITICAL' || item.status === 'OUT_OF_STOCK') {
      score = item.category === 'MEDICAL' || item.category === 'FOOD' || item.category === 'FUEL' ? 85 : 70;
      reasons.push(`${item.name} stock is ${item.status.replace('_', ' ').toLowerCase()}.`);
      reasons.push(`Current quantity (${item.quantity}) is below critical threshold (${item.critical_threshold}).`);
      
      recommendations.push('Emergency resupply required.');
      recommendations.push('Identify alternative local supplies.');
      if (item.category === 'MEDICAL' || item.category === 'FOOD') {
        recommendations.push('Implement rationing procedures.');
      }
    }

    return {
      score,
      level: riskEngine.scoreToLevel(score),
      reasons,
      recommendations,
      shouldAlert: true
    };
  },

  evaluateAsset: (_orgId: string, asset: Asset): RiskEvaluationResult | null => {
    if (asset.status !== 'MAINTENANCE_DUE' && asset.status !== 'DAMAGED') return null;

    let score = asset.status === 'DAMAGED' ? 75 : 45;
    const reasons: string[] = [];
    const recommendations: string[] = [];

    reasons.push(`Asset ${asset.name} is ${asset.status.replace(/_/g, ' ').toLowerCase()}.`);
    if (asset.condition === 'POOR' || asset.condition === 'CRITICAL') {
      reasons.push('Condition is poor or critical.');
    }

    recommendations.push('Schedule urgent maintenance.');
    if (asset.status === 'DAMAGED') {
      recommendations.push('Assign replacement asset if available.');
    }

    return {
      score,
      level: riskEngine.scoreToLevel(score),
      reasons,
      recommendations,
      shouldAlert: true
    };
  },

  scoreToLevel: (score: number): AlertSeverity => {
    if (score < 30) return 'LOW';
    if (score < 60) return 'MEDIUM';
    if (score < 80) return 'HIGH';
    return 'CRITICAL';
  }
};
