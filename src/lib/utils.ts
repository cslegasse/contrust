export interface SpendingPattern {
  category: string;
  budget: number;
  spent: number;
  efficiency: number;
}

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface FraudAlert {
  category: string;
  severity: "low" | "medium" | "high";
  message: string;
  confidence: number;
}

interface Category {
  name: string;
  amount: number;
  raised: number;
  spent: number;
}

export function analyzeSpendingPatterns(categories: Category[]): SpendingPattern[] {
  return categories.map((cat) => {
    const efficiency = cat.amount > 0 ? (cat.spent / cat.amount) * 100 : 0;
    return {
      category: cat.name,
      budget: cat.amount,
      spent: cat.spent,
      efficiency: Math.min(efficiency, 100),
    };
  });
}

export function detectFraudAlerts(categories: Category[]): FraudAlert[] {
  const alerts: FraudAlert[] = [];

  categories.forEach((cat) => {
    if (cat.spent > cat.raised) {
      alerts.push({
        category: cat.name,
        severity: "high",
        message: `Spending (${cat.spent.toLocaleString()}) exceeds funds raised (${cat.raised.toLocaleString()})`,
        confidence: 95,
      });
    }

    if (cat.spent > cat.amount) {
      alerts.push({
        category: cat.name,
        severity: "medium",
        message: `Spending exceeds allocated budget by ${((cat.spent / cat.amount - 1) * 100).toFixed(1)}%`,
        confidence: 88,
      });
    }

    const utilizationRate = cat.raised > 0 ? (cat.spent / cat.raised) * 100 : 0;
    if (utilizationRate < 20 && cat.raised > 10000) {
      alerts.push({
        category: cat.name,
        severity: "low",
        message: "Low fund utilization detected - consider reallocating resources",
        confidence: 72,
      });
    }
  });

  return alerts;
}

export function generateSpendingRecommendations(categories: Category[]): string[] {
  const recommendations: string[] = [];

  const totalBudget = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalRaised = categories.reduce((sum, cat) => sum + cat.raised, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  if (totalRaised > totalBudget * 0.8) {
    recommendations.push(
      "Campaign is performing well! Consider increasing target goals or expanding impact areas."
    );
  }

  const underutilizedCategories = categories.filter(
    (cat) => cat.raised > 0 && cat.spent / cat.raised < 0.3
  );
  if (underutilizedCategories.length > 0) {
    recommendations.push(
      `Low spending detected in ${underutilizedCategories[0].name}. Review if funds can be better allocated.`
    );
  }

  const overspentCategories = categories.filter((cat) => cat.spent > cat.amount);
  if (overspentCategories.length > 0) {
    recommendations.push(
      `Consider rebalancing budget for ${overspentCategories[0].name} to prevent overspending.`
    );
  }

  if (totalSpent / totalRaised < 0.5 && totalRaised > 50000) {
    recommendations.push(
      "Funds are accumulating. Consider accelerating program implementation to maximize impact."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Campaign spending is well-balanced. Continue monitoring for optimal impact."
    );
  }

  return recommendations;
}

export function calculateSuccessProbability(params: {
  totalBudget: number;
  totalRaised: number;
  daysElapsed: number;
  targetDays: number;
}): number {
  const { totalBudget, totalRaised, daysElapsed, targetDays } = params;

  const fundingProgress = (totalRaised / totalBudget) * 100;
  const timeProgress = (daysElapsed / targetDays) * 100;

  const pace = fundingProgress / timeProgress;

  let baseProbability = fundingProgress;

  if (pace > 1.2) {
    baseProbability = Math.min(baseProbability * 1.2, 95);
  } else if (pace < 0.8) {
    baseProbability = baseProbability * 0.8;
  }

  if (daysElapsed < targetDays * 0.25 && fundingProgress > 50) {
    baseProbability = Math.min(baseProbability * 1.15, 95);
  }

  return Math.round(Math.min(Math.max(baseProbability, 10), 95));
}
