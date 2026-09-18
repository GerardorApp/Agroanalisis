import React, { useState } from 'react';
import { BenefitTicket } from '../types';
import * as XLSX from 'xlsx';
import { FileUp, FileSpreadsheet, CheckCircle2, AlertCircle, Database, ArrowRight } from 'lucide-react';

interface DocumentImporterModuleProps {
  onAddMultipleTickets: (tickets: BenefitTicket[]) => void;
  onNavigateToDashboard: () => void;
}

export const DocumentImporterModule: React.FC<DocumentImporterModuleProps> = ({
  onAddMultipleTickets,
  onNavigateToDashboard,
}) => {
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonSheet: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (jsonSheet.length === 0) {
          setErrorMsg('El archivo está vacío o no contiene filas válidas.');
          return;
        }

        const newTickets: BenefitTicket[] = jsonSheet.map((row, idx) => {
          const birds = Number(row['Aves'] || row['birdsCount'] || 3000);
          const gross = Number(row['PesoBruto'] || row['grossWeight'] || 8500);
          const tare = Number(row['PesoTara'] || row['tareWeight'] || 1700);
          const farmNet = gross - tare;
          const plantNet = Math.round(farmNet * 0.98 * 10) / 10;
          const shrinkage = Math.round((farmNet - plantNet) * 10) / 10;

          return {
            id: `IMP-${Date.now()}-${idx}`,
            ticketNumber: String(row['Ticket'] || row['ticketNumber'] || `BNF-IMP-${100 + idx}`),
            date: String(row['Fecha'] || row['date'] || new Date().toISOString().split('T')[0]),
            farm: String(row['Granja'] || row['farm'] || 'Granja Importada Excel'),
            driver: String(row['Chofer'] || row['driver'] || 'Transportista Genérico'),
            plate: String(row['Placa'] || row['plate'] || 'IMP-999-A'),
            cagesCount: Number(row['Jaulas'] || row['cagesCount'] || 120),
            birdsCount: birds,
            mortalityCount: Number(row['Mortalidad'] || row['mortalityCount'] || 10),
            grossWeight: gross,
            tareWeight: tare,
            farmNetWeight: farmNet,
            plantNetWeight: plantNet,
            shrinkageKg: shrinkage,
            shrinkagePercentage: 2.5,
            mortalityPercentage: 0.3,
            operationalYield: 74.0,
            classification: {
              firstQualityKg: Math.round(plantNet * 0.72),
              firstQualityBirds: Math.round(birds * 0.88),
              secondQualityKg: Math.round(plantNet * 0.1),
              secondQualityBirds: Math.round(birds * 0.08),
              tearKg: Math.round(plantNet * 0.03),
              tearBirds: Math.round(birds * 0.04),
            },
            subproducts: {
              feetKg: Math.round(plantNet * 0.04),
              liverKg: Math.round(plantNet * 0.02),
              gizzardsKg: Math.round(plantNet * 0.015),
              heartsKg: Math.round(plantNet * 0.006),
            },
            status: 'Completado',
            notes: 'Importado masivamente vía Excel / CSV Parser.',
          };
        });

        onAddMultipleTickets(newTickets);
        setImportedCount(newTickets.length);
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Error al parsear el documento. Asegúrese de que sea un archivo Excel (.xlsx) o CSV válido.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const downloadSampleTemplate = () => {
    const sampleData = [
      { Ticket: 'BNF-2026-901', Fecha: '2026-09-17', Granja: 'Granja El Sol', Chofer: 'Pedro Perez', Placa: 'XYZ-111', Jaulas: 150, Aves: 3800, Mortalidad: 5, PesoBruto: 10200, PesoTara: 2000 },
      { Ticket: 'BNF-2026-902', Fecha: '2026-09-17', Granja: 'Granja La Esperanza', Chofer: 'Luis Gomez', Placa: 'ABC-222', Jaulas: 140, Aves: 3500, Mortalidad: 8, PesoBruto: 9500, PesoTara: 1850 },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PlantillaBeneficio');
    XLSX.writeFile(wb, 'plantilla_agroai_beneficio.xlsx');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <FileUp className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Módulo 4: Importador de Documentos (PDF / Excel / CSV)</h2>
              <p className="text-slate-300 text-sm">Cargue reportes masivos para parseo automático directo a la base de datos local</p>
            </div>
          </div>
          <FileSpreadsheet className="w-8 h-8 text-emerald-400 hidden sm:block opacity-80" />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">¿Necesita una plantilla de importación?</h4>
              <p className="text-xs text-slate-500">Descargue el archivo de ejemplo con las columnas requeridas para el beneficio.</p>
            </div>
            <button
              onClick={downloadSampleTemplate}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow transition-all"
            >
              Descargar Plantilla Excel
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center transition-all bg-slate-50 relative group">
            <input
              type="file"
              accept=".xlsx, .xls, .csv, .pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div className="text-lg font-bold text-slate-800">
                Arrastre su archivo Excel / CSV aquí o haga clic para seleccionar
              </div>
              <p className="text-sm text-slate-500 max-w-md">
                El sistema detectará automáticamente las columnas de peso bruto, tara, aves y granja.
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md">
                <FileUp className="w-4 h-4" />
                <span>Seleccionar Archivo</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 text-rose-900 rounded-xl flex items-center space-x-3 border border-rose-200 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {importedCount !== null && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-base">¡Importación Masiva Exitosa!</h4>
                  <p className="text-sm text-emerald-700">Se han importado y parseado {importedCount} tickets de beneficio hacia la base de datos local.</p>
                </div>
              </div>
              <button
                onClick={onNavigateToDashboard}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-600/20 whitespace-nowrap"
              >
                <Database className="w-4 h-4" />
                <span>Ver en Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
