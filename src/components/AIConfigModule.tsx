import React, { useState } from 'react';
import { AIConfig } from '../types';
import { testGeminiConnection } from '../utils/gemini';
import { Cpu, KeyRound, CheckCircle2, AlertCircle, Loader2, Save, ShieldCheck, Sparkles } from 'lucide-react';

interface AIConfigModuleProps {
  aiConfig: AIConfig;
  onSaveConfig: (config: AIConfig) => void;
}

export const AIConfigModule: React.FC<AIConfigModuleProps> = ({ aiConfig, onSaveConfig }) => {
  const [apiKey, setApiKey] = useState(aiConfig.apiKey);
  const [model, setModel] = useState(aiConfig.model || 'gemini-2.5-flash');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({ apiKey, model });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Por favor ingrese una API Key antes de probar.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const res = await testGeminiConnection(apiKey, model);
    setTestResult(res);
    setTesting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <Cpu className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Módulo 1: Configuración de Inteligencia Artificial (Gemini API)</h2>
              <p className="text-slate-300 text-sm">Configure sus credenciales para habilitar OCR multimodal, análisis predictivo y chat inteligente</p>
            </div>
          </div>
          <Sparkles className="w-8 h-8 text-emerald-400 hidden sm:block opacity-80" />
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Google Gemini API Key</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm shadow-sm"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Su API Key se almacena de forma segura en el almacenamiento local de su dispositivo y nunca se comparte con servidores externos.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Modelo de Google Gemini
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm shadow-sm font-medium"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recomendado - Ultra rápido y multimodal)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Máximo razonamiento y análisis complejo)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Versión estándar anterior)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1.5">
                Gemini 2.5 Flash es ideal para OCR en tiempo real de boletas de báscula y respuestas de chat instantáneas.
              </p>
            </div>
          </div>

          {testResult && (
            <div className={`p-4 rounded-xl flex items-start space-x-3 border ${
              testResult.success 
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-sm font-medium">{testResult.message}</div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 gap-4">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !apiKey.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Probando Conexión...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Probar Conexión con Gemini</span>
                </>
              )}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>

          {savedMessage && (
            <div className="p-3 bg-emerald-100 text-emerald-800 text-center rounded-xl text-sm font-semibold animate-fade-in">
              ¡Configuración guardada correctamente en el dispositivo!
            </div>
          )}
        </form>
      </div>

      {/* Security Info Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Arquitectura de Privacidad Syntropy Delta Labs</span>
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Las claves de API se procesan estrictamente en el cliente (Browser LocalStorage) y se comunican de forma directa y cifrada con los servidores oficiales de Google GenAI SDK. Ningún dato agroindustrial o clave privada es retenido en servidores intermediarios.
        </p>
      </div>
    </div>
  );
};
