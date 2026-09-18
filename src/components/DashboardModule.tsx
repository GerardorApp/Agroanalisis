import React from 'react';
import { BenefitTicket } from '../types';
import { 
  Scale, 
  TrendingUp, 
  Activity, 
  PackageCheck, 
  AlertTriangle, 
  Layers, 
  ArrowUpRight, 
  BarChart3 
} from 'lucide-react';

interface DashboardModuleProps {
  tickets: BenefitTicket[];
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ tickets }) => {
  const totalTickets = tickets.length;
  const totalBirds = tickets.reduce((acc, t) => acc + t.birdsCount, 0);
  const totalFarmWeight = tickets.reduce((acc, t) => acc + t.farmNetWeight, 0);
  const totalPlantWeight = tickets.reduce((acc, t) => acc + t.plantNetWeight, 0);
  const totalShrinkage = tickets.reduce((acc, t) => acc + t.shrinkageKg, 0);
  const totalMortality = tickets.reduce((acc, t) => acc + t.mortalityCount, 0);

  const avgShrinkagePct = totalTickets > 0 
    ? (tickets.reduce((acc, t) => acc + t.shrinkagePercentage, 0) / totalTickets).toFixed(2) 
    : '0.00';

  const avgMortalityPct = totalBirds > 0 
    ? ((totalMortality / totalBirds) * 100).toFixed(2) 
    : '0.00';

  const avgYield = totalTickets > 0 
    ? (tickets.reduce((acc, t) => acc + t.operationalYield, 0) / totalTickets).toFixed(1) 
    : '0.0';

  const totalSubproductsKg = tickets.reduce((acc, t) => {
    return acc + t.subproducts.feetKg + t.subproducts.liverKg + t.subproducts.gizzardsKg + t.subproducts.heartsKg;
  }, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-1">
            <Activity className="w-4 h-4" />
            <span>Métricas en Tiempo Real • Syntropy Delta Labs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dashboard Ejecutivo Agroindustrial</h1>
          <p className="text-slate-300 text-sm mt-1">
            Control integral de báscula, mermas, rendimiento de beneficio y subproductos avícolas.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
          <Layers className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs text-slate-300 font-medium">Lotes Procesados</div>
            <div className="text-lg font-bold text-white">{totalTickets} Registros</div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Aves */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <PackageCheck className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +4.2% vs ayer
            </span>
          </div>
          <div className="text-sm font-medium text-slate-500">Total Aves Procesadas</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {totalBirds.toLocaleString()} <span className="text-sm font-normal text-slate-500">aves</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Mortalidad acum: {avgMortalityPct}% ({totalMortality} aves)</p>
        </div>

        {/* Card 2: Peso Neto Granja vs Planta */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Scale className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              Granja vs Planta
            </span>
          </div>
          <div className="text-sm font-medium text-slate-500">Peso Neto Planta</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {totalPlantWeight.toLocaleString()} <span className="text-sm font-normal text-slate-500">kg</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Granja: {totalFarmWeight.toLocaleString()} kg</p>
        </div>

        {/* Card 3: Merma Global */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
              Merma Global
            </span>
          </div>
          <div className="text-sm font-medium text-slate-500">Merma Acumulada</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {avgShrinkagePct}% <span className="text-sm font-normal text-slate-500">({totalShrinkage.toLocaleString()} kg)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Rango objetivo: 2.0% - 3.5%</p>
        </div>

        {/* Card 4: Rendimiento Operativo */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              Rendimiento Medio
            </span>
          </div>
          <div className="text-sm font-medium text-slate-500">Rendimiento Operativo</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {avgYield}% <span className="text-sm font-normal text-slate-500">caraza</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Subproductos: {totalSubproductsKg.toLocaleString()} kg</p>
        </div>
      </div>

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Rendimiento por Lote */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-lg">Rendimiento por Lote de Beneficio</h3>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">Últimos Lotes</span>
          </div>

          <div className="space-y-4">
            {tickets.map((t, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{t.ticketNumber} — {t.farm}</span>
                  <span className="text-emerald-700 font-bold">{t.operationalYield}% Rendimiento</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(t.operationalYield, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Aves: {t.birdsCount}</span>
                  <span>Merma: {t.shrinkagePercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Comparativa Peso Granja vs Planta & Subproductos */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-lg">Distribución de Subproductos y Mermas</h3>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">Acumulado</span>
          </div>

          <div className="space-y-4">
            {tickets.map((t, idx) => {
              const subTotal = t.subproducts.feetKg + t.subproducts.liverKg + t.subproducts.gizzardsKg + t.subproducts.heartsKg;
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800">{t.farm}</span>
                    <span className="text-xs font-mono text-slate-500">{t.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="text-slate-400 font-medium">Patas</div>
                      <div className="font-bold text-slate-800">{t.subproducts.feetKg} kg</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="text-slate-400 font-medium">Hígado</div>
                      <div className="font-bold text-slate-800">{t.subproducts.liverKg} kg</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="text-slate-400 font-medium">Mollejas</div>
                      <div className="font-bold text-slate-800">{t.subproducts.gizzardsKg} kg</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Subproductos totales: <strong>{subTotal} kg</strong></span>
                    <span>Peso Planta: <strong>{t.plantNetWeight} kg</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
