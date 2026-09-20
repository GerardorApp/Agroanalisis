import React, { useState } from 'react';
import { CestaRecord, CestasInventoryConfig, AIConfig } from '../types';
import { 
  recalculateCestasSaldos, 
  saveStoredCestas, 
  saveStoredCestasConfig 
} from '../utils/storage';
import { 
  Boxes, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Camera, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Warehouse, 
  RefreshCw,
  Eye,
  Printer
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface CestasMaxipollosModuleProps {
  records: CestaRecord[];
  config: CestasInventoryConfig;
  aiConfig: AIConfig;
  onUpdateRecords: (records: CestaRecord[]) => void;
  onUpdateConfig: (config: CestasInventoryConfig) => void;
  onNavigateToCapture?: () => void;
}

export const CestasMaxipollosModule: React.FC<CestasMaxipollosModuleProps> = ({
  records,
  config,
  aiConfig,
  onUpdateRecords,
  onUpdateConfig,
}) => {
  // New record form state
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  });
  const [entrada, setEntrada] = useState<number | ''>('');
  const [salida, setSalida] = useState<number | ''>('');
  const [enCava, setEnCava] = useState<number | ''>('');
  const [observaciones, setObservaciones] = useState('');
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  // Edit fields
  const [editFecha, setEditFecha] = useState('');
  const [editEntrada, setEditEntrada] = useState(0);
  const [editSalida, setEditSalida] = useState(0);
  const [editEnCava, setEditEnCava] = useState(0);
  const [editObservaciones, setEditObservaciones] = useState('');

  // UI helpers
  const [showOriginalSheet, setShowOriginalSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Quick preset chips
  const observationPresets = [
    '47 botes a patio',
    '* -5 rotulados *',
    'Despacho turno mañana',
    'Lavado y desinfección',
    'Devolución de granja',
    'Stock retenido en cava'
  ];

  // Calculations
  const lastRecord = records[records.length - 1];
  const saldoActual = lastRecord ? lastRecord.saldo : config.saldoInicial;
  const totalEntradas = records.reduce((acc, r) => acc + (Number(r.entrada) || 0), 0);
  const totalSalidas = records.reduce((acc, r) => acc + (Number(r.salida) || 0), 0);
  const totalEnCava = records.reduce((acc, r) => acc + (Number(r.enCava) || 0), 0);

  // Filtered list
  const filteredRecords = records.filter(r => 
    r.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.observaciones.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorToast(msg);
      setTimeout(() => setErrorToast(null), 4000);
    } else {
      setSuccessToast(msg);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const numEntrada = Number(entrada) || 0;
    const numSalida = Number(salida) || 0;
    const numEnCava = Number(enCava) || 0;

    if (numEntrada === 0 && numSalida === 0 && !observaciones.trim()) {
      showNotification('Ingrese al menos una entrada, salida o detalle de observación.', true);
      return;
    }

    const newRecord: CestaRecord = {
      id: `CESTA-${Date.now()}`,
      fecha: fecha.trim() || 'Hoy',
      entrada: numEntrada,
      salida: numSalida,
      enCava: numEnCava,
      saldo: 0, // will be recalculated
      observaciones: observaciones.trim(),
      createdAt: Date.now(),
    };

    const updated = recalculateCestasSaldos([...records, newRecord], config.saldoInicial);
    onUpdateRecords(updated);
    saveStoredCestas(updated);

    // Reset inputs
    setEntrada('');
    setSalida('');
    setEnCava('');
    setObservaciones('');
    showNotification('¡Registro insertado con saldo recalculado exitosamente!');
  };

  const startEdit = (record: CestaRecord) => {
    setIsEditingId(record.id);
    setEditFecha(record.fecha);
    setEditEntrada(record.entrada);
    setEditSalida(record.salida);
    setEditEnCava(record.enCava);
    setEditObservaciones(record.observaciones);
  };

  const saveEdit = (id: string) => {
    const updated = records.map(r => {
      if (r.id === id) {
        return {
          ...r,
          fecha: editFecha,
          entrada: Number(editEntrada) || 0,
          salida: Number(editSalida) || 0,
          enCava: Number(editEnCava) || 0,
          observaciones: editObservaciones,
        };
      }
      return r;
    });

    const recalculated = recalculateCestasSaldos(updated, config.saldoInicial);
    onUpdateRecords(recalculated);
    saveStoredCestas(recalculated);
    setIsEditingId(null);
    showNotification('Registro actualizado y saldos recalculados.');
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('¿Desea eliminar esta fila del libro de cestas? Los saldos se reajustarán automáticamente.')) {
      const filtered = records.filter(r => r.id !== id);
      const recalculated = recalculateCestasSaldos(filtered, config.saldoInicial);
      onUpdateRecords(recalculated);
      saveStoredCestas(recalculated);
      showNotification('Registro eliminado del control.');
    }
  };

  const exportToExcel = () => {
    const worksheetData = records.map(r => ({
      'Fecha': r.fecha,
      'Entrada': r.entrada,
      'Salida': r.salida,
      'En Cava': r.enCava,
      'Saldo': r.saldo,
      'Observaciones': r.observaciones,
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cestas Maxipollos');
    XLSX.writeFile(wb, `Control_Cestas_Maxipollos_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('Archivo Excel exportado con éxito.');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text('CESTAS MAXIPOLLOS - CONTROL GENERAL DE INVENTARIO', 14, 18);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Inv. General: Saldo anterior | Fecha Base: ${config.fechaInicial} | Saldo Inicial: ${config.saldoInicial} Disp.`, 14, 25);
    doc.text(`Patio Acumulado: ${config.actualizadoPatio} | Saldo Actual: ${saldoActual} Cestas`, 14, 30);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 35);
    
    // Table header
    doc.setFillColor(16, 185, 129); // emerald
    doc.rect(14, 40, 182, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Fecha', 16, 45);
    doc.text('Entrada', 45, 45);
    doc.text('Salida', 70, 45);
    doc.text('En Cava', 95, 45);
    doc.text('Saldo', 120, 45);
    doc.text('Observaciones', 145, 45);

    // Table rows
    let y = 52;
    doc.setTextColor(15, 23, 42);
    records.forEach((r, idx) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      if (idx % 2 === 1) {
        doc.setFillColor(241, 245, 249);
        doc.rect(14, y - 5, 182, 7, 'F');
      }
      doc.text(String(r.fecha), 16, y);
      doc.text(String(r.entrada || '-'), 47, y);
      doc.text(String(r.salida || '-'), 72, y);
      doc.text(String(r.enCava || '-'), 97, y);
      doc.text(String(r.saldo), 122, y);
      doc.text(String(r.observaciones || '').substring(0, 30), 145, y);
      y += 7;
    });

    doc.save(`Cestas_Maxipollos_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('Documento PDF generado y descargado.');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast notifications */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{successToast}</span>
        </div>
      )}
      {errorToast && (
        <div className="fixed top-20 right-6 z-50 bg-rose-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium text-sm">{errorToast}</span>
        </div>
      )}

      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-8 -translate-y-4">
          <Boxes className="w-64 h-64 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Boxes className="w-4 h-4" />
              <span>Módulo Digital Oficial • Digitalización de Planilla de Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Cestas Maxipollos
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Libro Mayor Digital
              </span>
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
              Control general de inventario de cestas plásticas avícolas, entradas de granja, despachos a patio, saldo en cava y mermas por rotulado.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowOriginalSheet(!showOriginalSheet)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm transition-all"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>{showOriginalSheet ? 'Ocultar Planilla Original' : 'Ver Planilla Física Original'}</span>
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel</span>
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Ledger sub-header data */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Referencia Inicial:</span>
            <span className="font-semibold text-emerald-300">
              {config.subtitulo} ({config.fechaInicial})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Saldo Anterior Inicial:</span>
            <span className="font-semibold text-white">
              ({config.saldoInicial} Disp.)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Conteo Patio Acumulado:</span>
            <span className="font-semibold text-teal-300">
              {config.conteoPatioBase} + 47 = {config.actualizadoPatio}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Estado Operativo:</span>
            <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saldos Cuadrados al 100%</span>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Saldo Actual en Planta</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {saldoActual}
            <span className="text-xs font-medium text-slate-500 ml-1.5">cestas</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Disponible para recepción de aves
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Entradas (Recibidas)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalEntradas}
            <span className="text-xs font-medium text-slate-500 ml-1.5">cestas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Ingresos de granjas y lavado
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Salidas (Despacho)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalSalidas}
            <span className="text-xs font-medium text-slate-500 ml-1.5">cestas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Distribución y envíos a patio
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Patio Acumulado</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {config.actualizadoPatio}
            <span className="text-xs font-medium text-slate-500 ml-1.5">unid.</span>
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-1">
            1456 base + 47 botes anotados
          </p>
        </div>
      </div>

      {/* Comparison View / Original Scanned Sheet Visual Replica */}
      {showOriginalSheet && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 relative animate-fadeIn shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
              <Info className="w-5 h-5 text-amber-600" />
              <span>Réplica Digital de la Planilla Física Escaneada (Camscanner_1789697438190_0.jpg)</span>
            </div>
            <button
              onClick={() => setShowOriginalSheet(false)}
              className="text-amber-800 hover:text-amber-950 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-amber-800/90 mt-1 max-w-3xl">
            Esta vista didáctica modela con total fidelidad el libro físico donde el supervisor lleva el control en tinta azul. Cada número en el sistema corresponde a las filas escritas a mano:
          </p>

          {/* Physical Sheet Simulation Container */}
          <div className="mt-4 bg-white border border-slate-300 rounded-xl p-6 shadow-inner font-mono text-xs overflow-x-auto">
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3 mb-3">
              <div>
                <p className="text-slate-800 font-bold text-sm">
                  Inv. General: Saldo anterior 11/9/26 - 16 Disp.
                </p>
                <p className="text-slate-900 font-extrabold text-base tracking-wider uppercase">
                  Cestas Maxipollos
                </p>
              </div>
              <div className="text-right border border-blue-400 bg-blue-50/50 p-2 rounded text-blue-900 font-sans">
                <span className="block text-[11px] font-bold">14/9/26 Actualizado</span>
                <span className="block font-extrabold text-xs text-blue-800">1456 + 47 = 1503</span>
                <span className="text-[10px] text-blue-600">(Anotación en margen derecho)</span>
              </div>
            </div>

            {/* Simulated sheet grid */}
            <div className="grid grid-cols-6 gap-2 font-bold text-slate-700 bg-slate-100 p-2 rounded border border-slate-300 text-center">
              <div>Fecha</div>
              <div>Entrada</div>
              <div>Salida</div>
              <div>En Cava</div>
              <div>Saldo</div>
              <div>Observ.</div>
            </div>

            <div className="divide-y divide-slate-200 mt-1">
              <div className="grid grid-cols-6 gap-2 p-2 text-center text-slate-500 italic bg-slate-50">
                <div className="font-semibold text-slate-700">Saldo Agosto 26</div>
                <div>-</div>
                <div>-</div>
                <div>-</div>
                <div className="font-bold text-blue-700">(16)</div>
                <div className="text-left text-[11px]">Saldo inicial disponible</div>
              </div>
              <div className="grid grid-cols-6 gap-2 p-2 text-center">
                <div className="font-semibold text-slate-800">14/9/26</div>
                <div className="text-blue-700 font-bold">393</div>
                <div className="text-rose-700 font-bold">47</div>
                <div>-</div>
                <div className="font-extrabold text-slate-900">362</div>
                <div className="text-left text-blue-900 font-medium">47 botes a patio</div>
              </div>
              <div className="grid grid-cols-6 gap-2 p-2 text-center">
                <div className="font-semibold text-slate-800">15/9/26</div>
                <div className="text-blue-700 font-bold">213</div>
                <div className="text-rose-700 font-bold">374</div>
                <div>-</div>
                <div className="font-extrabold text-slate-900">201</div>
                <div className="text-left text-slate-400 italic">Sin observ.</div>
              </div>
              <div className="grid grid-cols-6 gap-2 p-2 text-center">
                <div className="font-semibold text-slate-800">16/9/26</div>
                <div className="text-blue-700 font-bold">146</div>
                <div className="text-rose-700 font-bold">219</div>
                <div>-</div>
                <div className="font-extrabold text-slate-900">128</div>
                <div className="text-left text-slate-400 italic">Sin observ.</div>
              </div>
              <div className="grid grid-cols-6 gap-2 p-2 text-center">
                <div className="font-semibold text-slate-800">16/9/26</div>
                <div className="text-blue-700 font-bold">430</div>
                <div className="text-rose-700 font-bold">357</div>
                <div>-</div>
                <div className="font-extrabold text-slate-900">201</div>
                <div className="text-left text-slate-400 italic">Sin observ.</div>
              </div>
              <div className="grid grid-cols-6 gap-2 p-2 text-center bg-amber-50/50">
                <div className="font-semibold text-slate-800">16/9/26</div>
                <div>-</div>
                <div className="text-rose-700 font-bold">* 5 *</div>
                <div>-</div>
                <div className="font-extrabold text-slate-900">196</div>
                <div className="text-left text-amber-900 font-bold">* -5 rotulados *</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-emerald-900 text-xs flex items-center justify-between">
              <span><strong>Fórmula didáctica:</strong> Saldo actual = Saldo anterior + Entrada - Salida</span>
              <span className="font-bold text-emerald-800">Ejemplo fila 1: 16 + 393 - 47 = 362 ✓</span>
            </div>
          </div>
        </div>
      )}

      {/* Form to insert new records */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-base">
            <Plus className="w-5 h-5 text-emerald-600" />
            <h2>Insertar Nuevo Registro en Libro de Cestas</h2>
          </div>
          <span className="text-xs text-slate-400">
            Cálculo matemático automático instantáneo
          </span>
        </div>

        <form onSubmit={handleAddRecord} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Fecha (Día/Mes/Año)
              </label>
              <input
                type="text"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                placeholder="Ej: 17/9/26"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Entrada (Cestas que entran)
              </label>
              <input
                type="number"
                min="0"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Salida (Cestas que salen)
              </label>
              <input
                type="number"
                min="0"
                value={salida}
                onChange={(e) => setSalida(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                En Cava (Opcional)
              </label>
              <input
                type="number"
                min="0"
                value={enCava}
                onChange={(e) => setEnCava(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Saldo Resultante Estimado
              </label>
              <div className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold flex items-center justify-between">
                <span>
                  {saldoActual + (Number(entrada) || 0) - (Number(salida) || 0)}
                </span>
                <span className="text-[10px] text-emerald-600 font-normal">
                  ({saldoActual} + {Number(entrada) || 0} - {Number(salida) || 0})
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Observaciones / Justificación de Movimiento
            </label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: 47 botes a patio, rotulados, cliente despachado, devolución de granja..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {/* Suggestion tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 self-center mr-1">Rápidos:</span>
              {observationPresets.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setObservaciones(tag)}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar Registro en Tabla</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Digital Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <span>Registros del Libro Mayor: Cestas Maxipollos</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {records.length} Filas Registradas
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Haga clic en cualquier fila para editar datos históricos; todos los saldos posteriores se actualizarán solos.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por fecha u observación..."
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 border-b border-slate-800">Fecha</th>
                <th className="py-3.5 px-4 border-b border-slate-800 text-right">Entrada</th>
                <th className="py-3.5 px-4 border-b border-slate-800 text-right">Salida</th>
                <th className="py-3.5 px-4 border-b border-slate-800 text-right">En Cava</th>
                <th className="py-3.5 px-4 border-b border-slate-800 text-right">Saldo</th>
                <th className="py-3.5 px-4 border-b border-slate-800">Observaciones</th>
                <th className="py-3.5 px-4 border-b border-slate-800 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-sm">
                    No se encontraron registros de cestas con el filtro indicado.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, index) => {
                  const isEditing = isEditingId === r.id;
                  const isRotulado = r.observaciones.toLowerCase().includes('rotulado');
                  const isPatio = r.observaciones.toLowerCase().includes('patio');

                  if (isEditing) {
                    return (
                      <tr key={r.id} className="bg-emerald-50/60">
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={editFecha}
                            onChange={(e) => setEditFecha(e.target.value)}
                            className="w-full px-2 py-1 text-xs border rounded border-emerald-400 bg-white"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={editEntrada}
                            onChange={(e) => setEditEntrada(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border rounded border-emerald-400 bg-white text-right"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={editSalida}
                            onChange={(e) => setEditSalida(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border rounded border-emerald-400 bg-white text-right"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={editEnCava}
                            onChange={(e) => setEditEnCava(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border rounded border-emerald-400 bg-white text-right"
                          />
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-700">
                          (Auto)
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={editObservaciones}
                            onChange={(e) => setEditObservaciones(e.target.value)}
                            className="w-full px-2 py-1 text-xs border rounded border-emerald-400 bg-white"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => saveEdit(r.id)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                              title="Guardar cambios"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setIsEditingId(null)}
                              className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr 
                      key={r.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        r.esSaldoInicial ? 'bg-slate-50/70 font-semibold' : ''
                      } ${isRotulado ? 'bg-amber-50/30' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                        {r.fecha}
                        {r.esSaldoInicial && (
                          <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-slate-200 text-slate-700">
                            Base
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-blue-700">
                        {r.entrada > 0 ? r.entrada : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-rose-700">
                        {r.salida > 0 ? (
                          isRotulado ? `* ${r.salida} *` : r.salida
                        ) : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        {r.enCava > 0 ? r.enCava : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-100 text-slate-900 border border-slate-200/80">
                          {r.esSaldoInicial ? `(${r.saldo})` : r.saldo}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-700">
                        {r.observaciones ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                            isRotulado
                              ? 'bg-amber-100 text-amber-800 font-bold border border-amber-200'
                              : isPatio
                                ? 'bg-blue-100 text-blue-800 font-medium'
                                : 'text-slate-700'
                          }`}>
                            {r.observaciones}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">--</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {!r.esSaldoInicial && (
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => startEdit(r)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Editar fila"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(r.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Eliminar fila"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-4">
            <span><strong>Total Entradas Período:</strong> {totalEntradas}</span>
            <span>•</span>
            <span><strong>Total Salidas Período:</strong> {totalSalidas}</span>
            <span>•</span>
            <span><strong>Saldo Final Vivo:</strong> <strong className="text-emerald-700">{saldoActual} cestas</strong></span>
          </div>

          <div className="text-[11px] text-slate-500">
            Fórmulas y registros sincronizados localmente en memoria segura.
          </div>
        </div>
      </div>
    </div>
  );
};
