import { BenefitTicket, AIConfig, CestaRecord, CestasInventoryConfig } from '../types';

const STORAGE_KEYS = {
  TICKETS: 'agroai_tickets_v1',
  AI_CONFIG: 'agroai_config_v1',
  CESTAS_RECORDS: 'agroai_cestas_records_v1',
  CESTAS_CONFIG: 'agroai_cestas_config_v1',
};

export const INITIAL_CESTAS_CONFIG: CestasInventoryConfig = {
  titulo: 'Cestas Maxipollos',
  subtitulo: 'Inv. General: Saldo anterior',
  fechaInicial: '11/9/26',
  saldoInicial: 16,
  conteoPatioBase: 1456,
  actualizadoPatio: 1503, // 1456 + 47
  alertaStockMinimo: 100,
};

export const INITIAL_CESTAS_RECORDS: CestaRecord[] = [
  {
    id: 'CESTA-INIT-00',
    fecha: 'Saldo Agosto 26',
    entrada: 0,
    salida: 0,
    enCava: 0,
    saldo: 16,
    observaciones: 'Saldo Inicial Disponible (16 Disp. al 11/9/26)',
    esSaldoInicial: true,
    createdAt: 1726000000000,
  },
  {
    id: 'CESTA-REC-01',
    fecha: '14/9/26',
    entrada: 393,
    salida: 47,
    enCava: 0,
    saldo: 362, // 16 + 393 - 47 = 362
    observaciones: '47 botes a patio (Act. Patio: 1456 + 47 = 1503)',
    createdAt: 1726300000000,
  },
  {
    id: 'CESTA-REC-02',
    fecha: '15/9/26',
    entrada: 213,
    salida: 374,
    enCava: 0,
    saldo: 201, // 362 + 213 - 374 = 201
    observaciones: 'Despacho comercial de producto',
    createdAt: 1726386400000,
  },
  {
    id: 'CESTA-REC-03',
    fecha: '16/9/26',
    entrada: 146,
    salida: 219,
    enCava: 0,
    saldo: 128, // 201 + 146 - 219 = 128
    observaciones: 'Turno matutino de distribución',
    createdAt: 1726472800000,
  },
  {
    id: 'CESTA-REC-04',
    fecha: '16/9/26',
    entrada: 430,
    salida: 357,
    enCava: 0,
    saldo: 201, // 128 + 430 - 357 = 201
    observaciones: 'Recepción de jaulas de granja y rotación planta',
    createdAt: 1726472850000,
  },
  {
    id: 'CESTA-REC-05',
    fecha: '16/9/26',
    entrada: 0,
    salida: 5,
    enCava: 0,
    saldo: 196, // 201 - 5 = 196
    observaciones: '* -5 rotulados * (desincorporación por rotura/daño)',
    createdAt: 1726472900000,
  },
];

export function recalculateCestasSaldos(records: CestaRecord[], saldoBase: number = 16): CestaRecord[] {
  let runningSaldo = saldoBase;
  return records.map((record) => {
    if (record.esSaldoInicial) {
      runningSaldo = record.saldo;
      return record;
    }
    const entrada = Number(record.entrada) || 0;
    const salida = Number(record.salida) || 0;
    runningSaldo = runningSaldo + entrada - salida;
    return {
      ...record,
      saldo: runningSaldo,
    };
  });
}

export function getStoredCestas(): CestaRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CESTAS_RECORDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CESTAS_RECORDS, JSON.stringify(INITIAL_CESTAS_RECORDS));
      return INITIAL_CESTAS_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CESTAS_RECORDS;
  }
}

export function saveStoredCestas(records: CestaRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.CESTAS_RECORDS, JSON.stringify(records));
}

export function getStoredCestasConfig(): CestasInventoryConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CESTAS_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CESTAS_CONFIG, JSON.stringify(INITIAL_CESTAS_CONFIG));
      return INITIAL_CESTAS_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CESTAS_CONFIG;
  }
}

export function saveStoredCestasConfig(config: CestasInventoryConfig): void {
  localStorage.setItem(STORAGE_KEYS.CESTAS_CONFIG, JSON.stringify(config));
}


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
