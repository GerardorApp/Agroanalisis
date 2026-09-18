import React, { useState } from 'react';
import { BenefitTicket } from '../types';
import { Scale, Plus, Trash2, CheckCircle2, DollarSign, Award, Layers } from 'lucide-react';

interface ScaleFormModuleProps {
  tickets: BenefitTicket[];
  onAddTicket: (ticket: BenefitTicket) => void;
  onDeleteTicket: (id: string) => void;
}

export const ScaleFormModule: React.FC<ScaleFormModuleProps> = ({
  tickets,
  onAddTicket,
  onDeleteTicket,
}) => {
  const [ticketNumber, setTicketNumber] = useState(`BNF-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [farm, setFarm] = useState('Granja Avícola La Bendición');
  const [driver, setDriver] = useState('Esteban Ramirez');
  const [plate, setPlate] = useState('TRK-882-P');
  const [cagesCount, setCagesCount] = useState(150);
  const [birdsCount, setBirdsCount] = useState(3750);
  const [mortalityCount, setMortalityCount] = useState(10);
  const [grossWeight, setGrossWeight] = useState(10500);
  const [tareWeight, setTareWeight] = useState(2100);

  // Classification
  const [firstQualityKg, setFirstQualityKg] = useState(5800);
  const [secondQualityKg, setSecondQualityKg] = useState(650);
  const [tearKg, setTearKg] = useState(120);

  // Subproducts
  const [feetKg, setFeetKg] = useState(380);
  const [liverKg, setLiverKg] = useState(175);
  const [gizzardsKg, setGizzardsKg] = useState(145);
  const [heartsKg, setHeartsKg] = useState(55);

  // Cash
  const [expectedAmount, setExpectedAmount] = useState(18500);
  const [actualAmount, setActualAmount] = useState(18500);
  const [cashNotes, setCashNotes] = useState('Cuadre de caja verificado por supervisor de báscula.');

  const [successMessage, setSuccessMessage] = useState(false);

  const farmNet = grossWeight - tareWeight;
  const plantNet = Math.round((farmNet * 0.978) * 10) / 10;
  const shrinkage = Math.round((farmNet - plantNet) * 10) / 10;
  const shrinkagePct = Math.round((shrinkage / farmNet) * 100 * 100) / 100;
  const mortalityPct = Math.round((mortalityCount / birdsCount) * 100 * 100) / 100;
  const operationalYield = Math.round((plantNet / farmNet) * 100 * 10) / 10;
  const cashDiscrepancy = actualAmount - expectedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: BenefitTicket = {
      id: `TICK-${Date.now()}`,
      ticketNumber,
      date,
      farm,
      driver,
      plate,
      cagesCount,
      birdsCount,
      mortalityCount,
      grossWeight,
      tareWeight,
      farmNetWeight: farmNet,
      plantNetWeight: plantNet,
      shrinkageKg: shrinkage,
      shrinkagePercentage: shrinkagePct,
      mortalityPercentage: mortalityPct,
      operationalYield,
      classification: {
        firstQualityKg,
        firstQualityBirds: Math.round(birdsCount * 0.85),
        secondQualityKg,
        secondQualityBirds: Math.round(birdsCount * 0.10),
        tearKg,
        tearBirds: Math.round(birdsCount * 0.05),
      },
      subproducts: {
        feetKg,
        liverKg,
        gizzardsKg,
        heartsKg,
      },
      cashReconciliation: {
        expectedAmount,
        actualAmount,
        discrepancy: cashDiscrepancy,
        notes: cashNotes,
      },
      status: 'Completado',
      notes: 'Registro manual de báscula y tierra.',
    };

    onAddTicket(newTicket);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 4000);
    // Reset ticket number
    setTicketNumber(`BNF-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
            <Scale className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Módulo 5: Báscula, Producción y Tierra</h2>
            <p className="text-slate-300 text-sm">Registro de tickets, control de jaulas, clasificación y cuadre de caja</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200 text-slate-800 font-bold text-lg">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Datos Generales del Ticket y Báscula</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Número de Ticket / Folio</label>
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fecha de Recepción</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Granja de Origen</label>
              <input
                type="text"
                value={farm}
                onChange={(e) => setFarm(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Conductor</label>
              <input
                type="text"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Placa del Vehículo</label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cantidad de Jaulas</label>
              <input
                type="number"
                value={cagesCount}
                onChange={(e) => setCagesCount(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cantidad de Aves</label>
              <input
                type="number"
                value={birdsCount}
                onChange={(e) => setBirdsCount(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mortalidad en Recepción</label>
              <input
                type="number"
                value={mortalityCount}
                onChange={(e) => setMortalityCount(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Peso Bruto (kg)</label>
              <input
                type="number"
                step="0.1"
                value={grossWeight}
                onChange={(e) => setGrossWeight(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Peso Tara (kg)</label>
              <input
                type="number"
                step="0.1"
                value={tareWeight}
                onChange={(e) => setTareWeight(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-rose-700"
              />
            </div>
          </div>

          {/* Calculated summary bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-slate-500 font-medium">Neto Granja</div>
              <div className="text-base font-bold text-slate-900">{farmNet} kg</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Neto Planta</div>
              <div className="text-base font-bold text-emerald-700">{plantNet} kg</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Merma</div>
              <div className="text-base font-bold text-amber-700">{shrinkage} kg ({shrinkagePct}%)</div>
            </div>
          </div>

          {/* Classification Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-2 pb-3 text-slate-800 font-bold text-md">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Clasificación de Pollo Beneficiado</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">1ra Calidad (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={firstQualityKg}
                  onChange={(e) => setFirstQualityKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">2da Calidad (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={secondQualityKg}
                  onChange={(e) => setSecondQualityKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Desgarre / Golpes (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tearKg}
                  onChange={(e) => setTearKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Subproducts Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-2 pb-3 text-slate-800 font-bold text-md">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Subproductos y Vísceras (kg)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Patas (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={feetKg}
                  onChange={(e) => setFeetKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hígado (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={liverKg}
                  onChange={(e) => setLiverKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mollejas (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={gizzardsKg}
                  onChange={(e) => setGizzardsKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Corazones (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={heartsKg}
                  onChange={(e) => setHeartsKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Cash Reconciliation Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-2 pb-3 text-slate-800 font-bold text-md">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Cuadre de Caja y Conciliación</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monto Esperado ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={expectedAmount}
                  onChange={(e) => setExpectedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monto Recibido ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={actualAmount}
                  onChange={(e) => setActualAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Discrepancia</label>
                <div className={`px-3 py-2 rounded-xl border text-sm font-bold flex items-center justify-center ${
                  cashDiscrepancy === 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {cashDiscrepancy >= 0 ? `+$${cashDiscrepancy.toFixed(2)}` : `-$${Math.abs(cashDiscrepancy).toFixed(2)}`}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Ticket en Base de Datos</span>
          </button>

          {successMessage && (
            <div className="p-3 bg-emerald-100 text-emerald-800 text-center rounded-xl text-sm font-semibold animate-fade-in">
              ¡Ticket de báscula registrado exitosamente!
            </div>
          )}
        </form>

        {/* Tickets List Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>Tickets Registrados</span>
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">{tickets.length} total</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{t.ticketNumber}</span>
                      <div className="text-xs text-slate-500">{t.farm}</div>
                    </div>
                    <button
                      onClick={() => onDeleteTicket(t.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Eliminar ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                    <div>Aves: <strong>{t.birdsCount}</strong></div>
                    <div>Neto: <strong>{t.plantNetWeight} kg</strong></div>
                    <div>Rendimiento: <strong>{t.operationalYield}%</strong></div>
                    <div>Merma: <strong>{t.shrinkagePercentage}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
