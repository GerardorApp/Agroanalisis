import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  TrendingDown, 
  Scale, 
  Boxes, 
  Percent, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  Truck
} from 'lucide-react';

export const DidacticGuideModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'formulas' | 'simulator' | 'glossary' | 'cestasGuide'>('formulas');

  // Simulator state
  const [simAves, setSimAves] = useState(3500);
  const [simPesoPromedioGranja, setSimPesoPromedioGranja] = useState(2.50); // kg
  const [simMermaPct, setSimMermaPct] = useState(3.0); // %
  const [simRendimientoPct, setSimRendimientoPct] = useState(74.0); // %
  const [simAvesPorCesta, setSimAvesPorCesta] = useState(10); // aves por cesta

  // Calculations for simulator
  const simPesoTotalGranja = simAves * simPesoPromedioGranja;
  const simMermaKg = (simPesoTotalGranja * (simMermaPct / 100));
  const simPesoPlantaNeto = simPesoTotalGranja - simMermaKg;
  const simPesoCanalTotal = (simPesoPlantaNeto * (simRendimientoPct / 100));
  const simCestasRequeridas = Math.ceil(simAves / simAvesPorCesta);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap className="w-5 h-5" />
              <span>Academia Agroindustrial & Modo Didáctico</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Centro Didáctico de Operaciones y Báscula
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
              Manual interactivo, fórmulas matemáticas estandarizadas y simulador en vivo para capacitar al personal técnico en mermas, rendimiento y control de cestas.
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl flex items-center space-x-3">
            <Lightbulb className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-emerald-300">Normativa Zootécnica</div>
              <div className="text-slate-300">Merma ideal: &lt; 3.0% • Rendimiento: &gt; 72%</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'formulas'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Fórmulas Matemáticas Clave</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'simulator'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Simulador Didáctico en Vivo</span>
          </button>

          <button
            onClick={() => setActiveTab('cestasGuide')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cestasGuide'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Guía de Cestas Maxipollos</span>
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'glossary'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Glosario Técnico Agroindustrial</span>
          </button>
        </div>
      </div>

      {/* Tab: Fórmulas Matemáticas Clave */}
      {activeTab === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Merma */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-rose-600 font-bold">
              <div className="p-2 bg-rose-50 rounded-xl">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Merma de Transporte y Espera (Shrinkage)</h3>
            </div>
            <p className="text-xs text-slate-600">
              Es la pérdida involuntaria de peso corporal del lote vivo durante el traslado desde la granja hasta el pesaje en la báscula de la planta de beneficio.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-2">
              <div>Merma (kg) = Peso Neto Granja - Peso Neto Planta</div>
              <div>% Merma = (Merma kg / Peso Neto Granja) × 100</div>
            </div>
            <div className="text-xs space-y-1 text-slate-700 bg-slate-50 p-3 rounded-xl">
              <div className="font-semibold text-slate-900">Parámetros Didácticos:</div>
              <div>• <strong>Óptimo:</strong> Menor al 2.5%</div>
              <div>• <strong>Aceptable:</strong> Entre 2.5% y 3.5%</div>
              <div>• <strong>Crítico (&gt; 3.5%):</strong> Pérdida financiera severa. Revisar horas de espera, ayuno previo en granja o ventilación en camión.</div>
            </div>
          </div>

          {/* Card 2: Rendimiento Operativo */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-emerald-600 font-bold">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Rendimiento Operativo en Canal</h3>
            </div>
            <p className="text-xs text-slate-600">
              Porcentaje de carne aprovechable en canal eviscerada respecto al peso vivo total recibido en planta.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-2">
              <div>Rendimiento (%) = (Peso Canal Eviscerada / Peso Neto Planta) × 100</div>
              <div>Canal Fría = Canal Caliente - Merma de Chiller (1.5% - 2.0%)</div>
            </div>
            <div className="text-xs space-y-1 text-slate-700 bg-slate-50 p-3 rounded-xl">
              <div className="font-semibold text-slate-900">Subproductos de Valor Agregado:</div>
              <div>• Patas: ~4.5% a 5.0% del peso vivo.</div>
              <div>• Hígados: ~2.0% a 2.5% del peso vivo.</div>
              <div>• Mollejas: ~1.8% a 2.2% del peso vivo.</div>
              <div>• Corazones: ~0.6% a 0.8% del peso vivo.</div>
            </div>
          </div>

          {/* Card 3: Balance de Cestas Maxipollos */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-blue-600 font-bold">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Control de Saldo de Cestas (Maxipollos)</h3>
            </div>
            <p className="text-xs text-slate-600">
              Cálculo secuencial continuo para garantizar que nunca falten cestas en la línea de colgado y sacrificio.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-2">
              <div>Saldo Fila Actual = Saldo Fila Anterior + Entrada - Salida</div>
              <div>Patio Acumulado = Conteo Base + Botes Asignados a Patio</div>
            </div>
            <div className="text-xs space-y-1 text-slate-700 bg-slate-50 p-3 rounded-xl">
              <div className="font-semibold text-slate-900">Reglas Didácticas de Control:</div>
              <div>• <strong>Botes a Patio:</strong> Cestas vacías enviadas a zona externa de recepción/lavado.</div>
              <div>• <strong>Rotuladas (* -5 rotulados *):</strong> Cestas dañadas o rotas que se descartan formalmente para que el balance contable cuadre con el inventario físico.</div>
            </div>
          </div>

          {/* Card 4: Peso Neto y Tara */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-purple-600 font-bold">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">4. Peso Neto de Báscula y Tara</h3>
            </div>
            <p className="text-xs text-slate-600">
              Determinación de la masa viva neta deduciendo el vehículo y las jaulas vacías.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-2">
              <div>Peso Neto Granja = Peso Bruto Camión Lleno - Tara Camión Vacío</div>
              <div>Peso Promedio por Ave = Peso Neto Planta / Número de Aves Vivas</div>
            </div>
            <div className="text-xs space-y-1 text-slate-700 bg-slate-50 p-3 rounded-xl">
              <div className="font-semibold text-slate-900">Control de Tara Estricto:</div>
              <div>• El camión debe pesarse en el mismo estado de combustible.</div>
              <div>• La tara debe incluir las plumas o excretas residuales para evitar liquidaciones infladas.</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Simulador Didáctico en Vivo */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              <span>Simulador Didáctico Interactivo de Lote Avícola</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Modifique los parámetros del lote para ver cómo impactan en tiempo real la merma en kilogramos, la carne en canal y el número de cestas requeridas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Número Total de Aves: <span className="text-emerald-700 font-extrabold">{simAves.toLocaleString()} aves</span>
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="100"
                value={simAves}
                onChange={(e) => setSimAves(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[11px] text-slate-500">Rango: 1,000 a 10,000 aves</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peso Promedio en Granja: <span className="text-emerald-700 font-extrabold">{simPesoPromedioGranja.toFixed(2)} kg</span>
              </label>
              <input
                type="range"
                min="1.80"
                max="3.50"
                step="0.05"
                value={simPesoPromedioGranja}
                onChange={(e) => setSimPesoPromedioGranja(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[11px] text-slate-500">Rango: 1.80 kg a 3.50 kg</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Merma de Transporte Estimada: <span className="text-rose-600 font-extrabold">{simMermaPct.toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.1"
                value={simMermaPct}
                onChange={(e) => setSimMermaPct(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
              <span className="text-[11px] text-slate-500">Normal: 2.0% - 3.5%</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-xs text-blue-700 font-semibold uppercase block">Peso Vivo en Granja</span>
              <div className="text-2xl font-extrabold text-blue-950 mt-1">
                {simPesoTotalGranja.toLocaleString('es-ES', { maximumFractionDigits: 1 })} kg
              </div>
              <span className="text-[11px] text-blue-800 mt-1 block">
                {simAves} aves × {simPesoPromedioGranja} kg
              </span>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="text-xs text-rose-700 font-semibold uppercase block">Merma en Camino</span>
              <div className="text-2xl font-extrabold text-rose-950 mt-1">
                -{simMermaKg.toLocaleString('es-ES', { maximumFractionDigits: 1 })} kg
              </div>
              <span className="text-[11px] text-rose-800 mt-1 block">
                Pérdida por viaje ({simMermaPct}%)
              </span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs text-emerald-700 font-semibold uppercase block">Peso Neto en Planta</span>
              <div className="text-2xl font-extrabold text-emerald-950 mt-1">
                {simPesoPlantaNeto.toLocaleString('es-ES', { maximumFractionDigits: 1 })} kg
              </div>
              <span className="text-[11px] text-emerald-800 mt-1 block">
                {(simPesoPlantaNeto / simAves).toFixed(2)} kg promedio por ave
              </span>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="text-xs text-purple-700 font-semibold uppercase block">Cestas / Jaulas Necesarias</span>
              <div className="text-2xl font-extrabold text-purple-950 mt-1">
                {simCestasRequeridas} unid.
              </div>
              <span className="text-[11px] text-purple-800 mt-1 block">
                A razón de {simAvesPorCesta} aves/cesta
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Guía de Cestas Maxipollos */}
      {activeTab === 'cestasGuide'}
      {activeTab === 'cestasGuide' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-emerald-700">
            <Boxes className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Manual Didáctico: Hoja de Control Cestas Maxipollos</h3>
              <p className="text-xs text-slate-500">Desglose exhaustivo de cómo interpretar y auditar la planilla física.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">¿Por qué es indispensable este control diario?</h4>
              <p>
                En una planta de beneficio avícola, las cestas plásticas son un activo circulante crítico. Si un lote arriba y no hay cestas vacías lavadas y desinfectadas disponibles, los camiones con pollos vivos deben esperar bajo el sol, disparando la merma por deshidratación y la mortalidad por asfixia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-900 text-sm">1. Columna de Entradas</span>
                <p>
                  Representa las cestas que retornan de granjas, clientes o del túnel de lavado. Aumentan inmediatamente el saldo disponible de planta.
                </p>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2">
                <span className="font-bold text-rose-900 text-sm">2. Columna de Salidas y Patio</span>
                <p>
                  Representa las cestas despachadas con producto a clientes, enviadas a patio para carga de camiones o dadas de baja por daño (rotuladas).
                </p>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                <span className="font-bold text-blue-900 text-sm">3. Columna En Cava</span>
                <p>
                  Indica las cestas que permanecen almacenadas con producto refrigerado en las cámaras de frío y no pueden usarse para recepción hasta su despacho.
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <span className="font-bold text-amber-900 text-sm">4. Desincorporación de Rotuladas</span>
                <p>
                  Cuando una cesta se rompe en los apiladores mecánicos, se marca como <em>rotulada</em> (ejemplo en el libro físico: <strong>* -5 rotulados *</strong>). Deducir estas cestas asegura que el balance informático coincida al 100% con las cestas reales en planta.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Glosario Técnico */}
      {activeTab === 'glossary' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Glosario Técnico de Términos Agroindustriales</span>
          </h3>

          <div className="divide-y divide-slate-200 text-xs">
            <div className="py-3">
              <span className="font-bold text-slate-900 text-sm">Tara</span>
              <p className="text-slate-600 mt-1">Peso del camión de transporte vacío junto con sus jaulas o cestas limpias antes o después de la descarga.</p>
            </div>
            <div className="py-3">
              <span className="font-bold text-slate-900 text-sm">Peso Bruto</span>
              <p className="text-slate-600 mt-1">Peso total registrado en la báscula puente: camión + jaulas + aves vivas.</p>
            </div>
            <div className="py-3">
              <span className="font-bold text-slate-900 text-sm">Canal Eviscerada</span>
              <p className="text-slate-600 mt-1">Cuerpo del ave sacrificada sin plumas, vísceras, cabeza ni patas, lista para comercialización o despiece.</p>
            </div>
            <div className="py-3">
              <span className="font-bold text-slate-900 text-sm">Subproductos Comestibles</span>
              <p className="text-slate-600 mt-1">Órganos internos aptos para consumo: hígado, molleja y corazón (menudencias), y patas de exportación o mercado nacional.</p>
            </div>
            <div className="py-3">
              <span className="font-bold text-slate-900 text-sm">Botes a Patio</span>
              <p className="text-slate-600 mt-1">Transferencia de cestas apiladas desde el área interna hacia los patios exteriores para reabastecer las cuadrillas de acarreo.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
