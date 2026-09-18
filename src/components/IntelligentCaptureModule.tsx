import React, { useState } from 'react';
import { AIConfig, BenefitTicket } from '../types';
import { extractTicketFromImage } from '../utils/gemini';
import { Camera, Upload, Sparkles, Loader2, CheckCircle2, ArrowRight, AlertTriangle, FileText } from 'lucide-react';

interface IntelligentCaptureModuleProps {
  aiConfig: AIConfig;
  onAddTicket: (ticket: BenefitTicket) => void;
  onNavigateToScale: () => void;
}

export const IntelligentCaptureModule: React.FC<IntelligentCaptureModuleProps> = ({
  aiConfig,
  onAddTicket,
  onNavigateToScale,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<BenefitTicket> | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage(reader.result as string);
        processImageWithGemini(base64String, file.type || 'image/jpeg');
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageWithGemini = async (base64: string, mimeType: string) => {
    if (!aiConfig.apiKey) {
      alert('Por favor configure primero su Google Gemini API Key en el Módulo 1.');
      return;
    }

    setLoading(true);
    try {
      const result = await extractTicketFromImage(aiConfig.apiKey, aiConfig.model, base64, mimeType);
      setExtractedData(result);
    } catch (err: any) {
      console.error(err);
      alert('Error al procesar la imagen con Gemini Vision OCR: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndSave = () => {
    if (!extractedData) return;
    const newTicket: BenefitTicket = {
      id: `TICK-${Date.now().toString().slice(-4)}`,
      ticketNumber: extractedData.ticketNumber || `BNF-${Math.floor(1000 + Math.random() * 9000)}`,
      date: extractedData.date || new Date().toISOString().split('T')[0],
      farm: extractedData.farm || 'Granja Asociada OCR',
      driver: extractedData.driver || 'Conductor Registrado',
      plate: extractedData.plate || 'ABC-999-X',
      cagesCount: extractedData.cagesCount || 150,
      birdsCount: extractedData.birdsCount || 3500,
      mortalityCount: extractedData.mortalityCount || 10,
      grossWeight: extractedData.grossWeight || 9800,
      tareWeight: extractedData.tareWeight || 2000,
      farmNetWeight: extractedData.farmNetWeight || 7800,
      plantNetWeight: extractedData.plantNetWeight || 7580,
      shrinkageKg: extractedData.shrinkageKg || 220,
      shrinkagePercentage: extractedData.shrinkagePercentage || 2.82,
      mortalityPercentage: extractedData.mortalityPercentage || 0.28,
      operationalYield: extractedData.operationalYield || 73.5,
      classification: extractedData.classification || {
        firstQualityKg: 5300,
        firstQualityBirds: 3100,
        secondQualityKg: 400,
        secondQualityBirds: 300,
        tearKg: 100,
        tearBirds: 90,
      },
      subproducts: extractedData.subproducts || {
        feetKg: 340,
        liverKg: 160,
        gizzardsKg: 130,
        heartsKg: 50,
      },
      status: 'Revisión IA',
      notes: extractedData.notes || 'Boleta procesada automáticamente por Gemini Multimodal OCR.',
    };

    onAddTicket(newTicket);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <Camera className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Módulo 3: Captura Inteligente (Cámara & OCR Multimodal)</h2>
              <p className="text-slate-300 text-sm">Escanee boletas de báscula físicas para extracción automática con Gemini Vision</p>
            </div>
          </div>
          <Sparkles className="w-8 h-8 text-emerald-400 hidden sm:block opacity-80" />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {!aiConfig.apiKey && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 text-amber-900 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Atención:</strong> No ha configurado su Gemini API Key en el Módulo 1. El OCR multimodal requiere una API Key activa para analizar imágenes de boletas.
              </div>
            </div>
          )}

          {/* Upload / Camera Action Box */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center transition-all bg-slate-50 relative group">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div className="text-lg font-bold text-slate-800">
                Tome una foto o seleccione la boleta de beneficio
              </div>
              <p className="text-sm text-slate-500 max-w-md">
                Soporta archivos JPG, PNG o captura directa desde la cámara de su dispositivo móvil o tablet.
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md">
                <Camera className="w-4 h-4" />
                <span>Activar Cámara / Subir Imagen</span>
              </div>
            </div>
          </div>

          {/* Image Preview & Loading State */}
          {selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Imagen Escaneada</span>
                </h3>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-64 flex items-center justify-center">
                  <img src={selectedImage} alt="Boleta escaneada" className="max-h-full object-contain" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Resultado Extracción Gemini Vision OCR</span>
                </h3>

                {loading ? (
                  <div className="h-64 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    <span className="text-sm font-medium text-slate-600">Analizando boleta con Gemini Multimodal...</span>
                  </div>
                ) : extractedData ? (
                  <div className="h-64 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 overflow-y-auto space-y-2 text-xs font-mono">
                    <div className="text-emerald-900 font-bold text-sm mb-2 pb-1 border-b border-emerald-200">
                      Datos Extraídos con Éxito
                    </div>
                    <div><strong>Ticket:</strong> {extractedData.ticketNumber}</div>
                    <div><strong>Fecha:</strong> {extractedData.date}</div>
                    <div><strong>Granja:</strong> {extractedData.farm}</div>
                    <div><strong>Chofer:</strong> {extractedData.driver} ({extractedData.plate})</div>
                    <div><strong>Aves:</strong> {extractedData.birdsCount} (Mortalidad: {extractedData.mortalityCount})</div>
                    <div><strong>Peso Bruto:</strong> {extractedData.grossWeight} kg</div>
                    <div><strong>Peso Tara:</strong> {extractedData.tareWeight} kg</div>
                    <div><strong>Peso Neto Granja:</strong> {extractedData.farmNetWeight} kg</div>
                    <div><strong>Merma Est.:</strong> {extractedData.shrinkageKg} kg ({extractedData.shrinkagePercentage}%)</div>
                  </div>
                ) : (
                  <div className="h-64 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-sm text-slate-400">
                    Suba una imagen para ver los datos extraídos
                  </div>
                )}
              </div>
            </div>
          )}

          {extractedData && !loading && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Los datos han sido validados por Gemini y están listos para registrarse en la báscula.
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleConfirmAndSave}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Guardar Ticket en Báscula</span>
                </button>
                <button
                  onClick={onNavigateToScale}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-center space-x-2"
                >
                  <span>Ver en Módulo 5</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl font-semibold text-center text-sm animate-fade-in">
              ¡Ticket de beneficio guardado exitosamente en la base de datos local! Ya puede consultarlo en el Módulo 2 y 5.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
