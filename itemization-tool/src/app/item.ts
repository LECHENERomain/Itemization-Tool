export interface Item {
  id: string;
  name: string;
  description?: string;
  icon: string;
  stats: Record<string, number>;
  goldCost: number;
  tags: string[];
  from?: string[];
  into?: string[];
  depth?: number;
  requiredChampion?: string;
}
