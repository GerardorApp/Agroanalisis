export interface BenefitTicket {
  id: string;
  ticketNumber: string;
  date: string;
  farm: string;
  driver: string;
  plate: string;
  cagesCount: number;
  birdsCount: number;
  mortalityCount: number;
  grossWeight: number; // kg
  tareWeight: number; // kg
  farmNetWeight: number; // kg
  plantNetWeight: number; // kg
  shrinkageKg: number; // kg
  shrinkagePercentage: number; // %
  mortalityPercentage: number; // %
  operationalYield: number; // %
  classification: {
    firstQualityKg: number;
    firstQualityBirds: number;
    secondQualityKg: number;
    secondQualityBirds: number;
    tearKg: number;
    tearBirds: number;
  };
  subproducts: {
    feetKg: number;
    liverKg: number;
    gizzardsKg: number;
    heartsKg: number;
  };
  cashReconciliation?: {
    expectedAmount: number;
    actualAmount: number;
    discrepancy: number;
    notes: string;
  };
  status: 'Completado' | 'En Proceso' | 'Conciliado' | 'Revisión IA';
  notes?: string;
}

export interface AIConfig {
  apiKey: string;
  model: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export interface CestaRecord {
  id: string;
  fecha: string; // Formato DD/MM/AAAA o DD/MM/AA
  entrada: number;
  salida: number;
  enCava: number;
  saldo: number;
  observaciones: string;
  esSaldoInicial?: boolean;
  createdAt?: number;
}

export interface CestasInventoryConfig {
  titulo: string;
  subtitulo: string;
  fechaInicial: string;
  saldoInicial: number;
  conteoPatioBase: number;
  actualizadoPatio: number;
  alertaStockMinimo: number;
}

export type ActiveModule = 'dashboard' | 'cestas' | 'scale' | 'capture' | 'importer' | 'didactic' | 'github' | 'chat' | 'config';

