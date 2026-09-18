import { BenefitTicket, AIConfig } from '../types';

const STORAGE_KEYS = {
  TICKETS: 'agroai_tickets_v1',
  AI_CONFIG: 'agroai_config_v1',
};

export const INITIAL_TICKETS: BenefitTicket[] = [
  {
    id: 'TICK-1001',
    ticketNumber: 'BNF-2026-0891',
    date: '2026-09-17',
    farm: 'Granja Avícola El Rocío',
    driver: 'Carlos Mendoza',
    plate: 'ABC-789-X',
    cagesCount: 140,
    birdsCount: 3500,
    mortalityCount: 12,
    grossWeight: 9250.0,
    tareWeight: 1850.0,
    farmNetWeight: 7400.0,
    plantNetWeight: 7180.0,
    shrinkageKg: 220.0,
    shrinkagePercentage: 2.97,
    mortalityPercentage: 0.34,
    operationalYield: 74.5,
    classification: {
      firstQualityKg: 4950,
      firstQualityBirds: 3100,
      secondQualityKg: 320,
      secondQualityBirds: 288,
      tearKg: 85,
      tearBirds: 100,
    },
    subproducts: {
      feetKg: 310,
      liverKg: 145,
      gizzardsKg: 120,
      heartsKg: 45,
    },
    cashReconciliation: {
      expectedAmount: 14500.0,
      actualAmount: 14500.0,
      discrepancy: 0.0,
      notes: 'Cuadre perfecto de caja en báscula.',
    },
    status: 'Completado',
    notes: 'Lote óptimo recibido en horario matutino. Excelente conformación pectoral.',
  },
  {
    id: 'TICK-1002',
    ticketNumber: 'BNF-2026-0892',
    date: '2026-09-17',
    farm: 'Agropecuaria San Jerónimo',
    driver: 'Miguel Ángel Rivas',
    plate: 'XYZ-456-Z',
    cagesCount: 160,
    birdsCount: 4000,
    mortalityCount: 25,
    grossWeight: 10600.0,
    tareWeight: 2100.0,
    farmNetWeight: 8500.0,
    plantNetWeight: 8190.0,
    shrinkageKg: 310.0,
    shrinkagePercentage: 3.64,
    mortalityPercentage: 0.62,
    operationalYield: 72.8,
    classification: {
      firstQualityKg: 5400,
      firstQualityBirds: 3500,
      secondQualityKg: 490,
      secondQualityBirds: 375,
      tearKg: 120,
      tearBirds: 100,
    },
    subproducts: {
      feetKg: 360,
      liverKg: 170,
      gizzardsKg: 140,
      heartsKg: 52,
    },
    cashReconciliation: {
      expectedAmount: 16800.0,
      actualAmount: 16750.0,
      discrepancy: -50.0,
      notes: 'Faltante menor por cambio de moneda en efectivo.',
    },
    status: 'Conciliado',
    notes: 'Transporte con retraso de 45 mins por tráfico en ruta norte.',
  },
  {
    id: 'TICK-1003',
    ticketNumber: 'BNF-2026-0893',
    date: '2026-09-16',
    farm: 'Avícola Los Alpes S.A.',
    driver: 'Roberto Gómez',
    plate: 'DEF-123-Y',
    cagesCount: 120,
    birdsCount: 3000,
    mortalityCount: 8,
    grossWeight: 8100.0,
    tareWeight: 1600.0,
    farmNetWeight: 6500.0,
    plantNetWeight: 6350.0,
    shrinkageKg: 150.0,
    shrinkagePercentage: 2.30,
    mortalityPercentage: 0.26,
    operationalYield: 75.2,
    classification: {
      firstQualityKg: 4450,
      firstQualityBirds: 2750,
      secondQualityKg: 210,
      secondQualityBirds: 192,
      tearKg: 45,
      tearBirds: 50,
    },
    subproducts: {
      feetKg: 270,
      liverKg: 125,
      gizzardsKg: 105,
      heartsKg: 40,
    },
    cashReconciliation: {
      expectedAmount: 12900.0,
      actualAmount: 12900.0,
      discrepancy: 0.0,
      notes: 'Sin novedades.',
    },
    status: 'Completado',
    notes: 'Excelente lote de alta conversión alimenticia.',
  },
];

export function getStoredTickets(): BenefitTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TICKETS;
  }
}

export function saveStoredTickets(tickets: BenefitTicket[]): void {
  localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
}

export function getStoredAIConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
    if (!raw) {
      const defaultCfg = { apiKey: '', model: 'gemini-2.5-flash' };
      localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(defaultCfg));
      return defaultCfg;
    }
    return JSON.parse(raw);
  } catch {
    return { apiKey: '', model: 'gemini-2.5-flash' };
  }
}

export function saveStoredAIConfig(config: AIConfig): void {
  localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(config));
}
