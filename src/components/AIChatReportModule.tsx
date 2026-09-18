import React, { useState } from 'react';
import { AIConfig, BenefitTicket, ChatMessage } from '../types';
import { queryAIChatWithContext } from '../utils/gemini';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { 
  MessageSquareText, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  FileText, 
  FileSpreadsheet, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';

interface AIChatReportModuleProps {
  aiConfig: AIConfig;
  tickets: BenefitTicket[];
}

export const AIChatReportModule: React.FC<AIChatReportModuleProps> = ({ aiConfig, tickets }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'gemini',
      text: '¡Hola! Soy tu Asistente Analítico de Syntropy Delta Labs. Conecto directamente con los registros de beneficio avícola en tu dispositivo. ¿Qué diagnóstico, análisis de merma o reporte ejecutivo deseas consultar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText;
    setInputText('');
    setLoading(true);

    const botResponseText = await queryAIChatWithContext(aiConfig.apiKey, aiConfig.model, query, tickets);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'gemini',
      text: botResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputText(promptText);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('AgroAI Suite Pro - Reporte Ejecutivo de Beneficio', 14, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total de Lotes Registrados: ${tickets.length}`, 14, 35);

    let y = 45;
    tickets.forEach((t, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}. Ticket: ${t.ticketNumber} - Granja: ${t.farm}`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`   Fecha: ${t.date} | Aves: ${t.birdsCount} | Peso Neto Planta: ${t.plantNetWeight} kg`, 14, y + 6);
      doc.text(`   Merma: ${t.shrinkagePercentage}% | Rendimiento: ${t.operationalYield}%`, 14, y + 12);
      y += 22;
    });

    doc.save('reporte_ejecutivo_agroai.pdf');
  };

  const exportToExcel = () => {
    const dataToExport = tickets.map(t => ({
      Ticket: t.ticketNumber,
      Fecha: t.date,
      Granja: t.farm,
      Chofer: t.driver,
      Placa: t.plate,
      Jaulas: t.cagesCount,
      Aves: t.birdsCount,
      Mortalidad: t.mortalityCount,
      PesoBrutoKg: t.grossWeight,
      PesoTaraKg: t.tareWeight,
      PesoNetoPlantaKg: t.plantNetWeight,
      MermaPorcentaje: t.shrinkagePercentage,
      RendimientoPorcentaje: t.operationalYield,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ReporteBeneficio');
    XLSX.writeFile(wb, 'reporte_agroai_suported.xlsx');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
            <MessageSquareText className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Módulo 6: Chat Analítico IA & Reportes Ejecutivos</h2>
            <p className="text-slate-300 text-sm">Consulte con Gemini sobre sus datos en tiempo real y exporte reportes profesionales</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={exportToPDF}
            className="flex-1 md:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 text-sm shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={exportToExcel}
            className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 text-sm shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm">Asistente Gemini AI - AgroAI Suite Pro</span>
          </div>
          <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
            Modelo Activo ({aiConfig.model || 'gemini-2.5-flash'})
          </span>
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Sugerencias:</span>
          </span>
          <button
            onClick={() => handleQuickPrompt('¿Cuál ha sido el lote con mayor rendimiento operativo y por qué?')}
            className="px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs rounded-lg border border-slate-200 whitespace-nowrap shadow-xs transition-all"
          >
            Lote con mayor rendimiento
          </button>
          <button
            onClick={() => handleQuickPrompt('Haz un diagnóstico de las mermas globales y da recomendaciones para reducirlas.')}
            className="px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs rounded-lg border border-slate-200 whitespace-nowrap shadow-xs transition-all"
          >
            Diagnóstico de mermas
          </button>
          <button
            onClick={() => handleQuickPrompt('Resume el total de subproductos (patas, hígado, mollejas) obtenidos.')}
            className="px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs rounded-lg border border-slate-200 whitespace-nowrap shadow-xs transition-all"
          >
            Resumen de subproductos
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.map((msg) => {
            const isBot = msg.sender === 'gemini';
            return (
              <div key={msg.id} className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isBot ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-800 text-white'
                }`}>
                  {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm ${
                  isBot ? 'bg-white text-slate-800 border border-slate-200' : 'bg-emerald-600 text-white'
                }`}>
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                  <div className={`text-[10px] mt-2 font-mono ${isBot ? 'text-slate-400' : 'text-emerald-100'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center space-x-3 text-sm text-slate-600 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                <span>Analizando datos de la base de datos con Gemini...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregunte a la IA sobre rendimientos, mermas, lotes o diagnósticos..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <span>Enviar</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
