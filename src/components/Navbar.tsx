import React from 'react';
import { ActiveModule, AIConfig, BenefitTicket } from '../types';
import { 
  Cpu, 
  LayoutDashboard, 
  Camera, 
  FileUp, 
  Scale, 
  MessageSquareText, 
  ShieldCheck, 
  AlertTriangle,
  Boxes,
  GraduationCap,
  Github
} from 'lucide-react';

interface NavbarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  aiConfig: AIConfig;
  tickets: BenefitTicket[];
  cestasSaldo?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  aiConfig,
  tickets,
  cestasSaldo = 196,
}) => {
  const isKeyConfigured = Boolean(aiConfig.apiKey && aiConfig.apiKey.trim().length > 5);

  const navItems: { id: ActiveModule; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard & KPI', 
      icon: <LayoutDashboard className="w-4 h-4" /> 
    },
    { 
      id: 'cestas', 
      label: 'Cestas Maxipollos', 
      icon: <Boxes className="w-4 h-4" />,
      badge: `${cestasSaldo} disp.`
    },
    { 
      id: 'scale', 
      label: 'Báscula & Tierra', 
      icon: <Scale className="w-4 h-4" />,
      badge: tickets.length
    },
    { 
      id: 'capture', 
      label: 'Captura OCR', 
      icon: <Camera className="w-4 h-4" /> 
    },
    { 
      id: 'importer', 
      label: 'Importador', 
      icon: <FileUp className="w-4 h-4" /> 
    },
    { 
      id: 'didactic', 
      label: 'Academia Didáctica', 
      icon: <GraduationCap className="w-4 h-4" />,
      badge: 'Guía'
    },
    { 
      id: 'github', 
      label: 'GitHub & APK', 
      icon: <Github className="w-4 h-4" />,
      badge: 'CI/CD'
    },
    { 
      id: 'chat', 
      label: 'Chat IA', 
      icon: <MessageSquareText className="w-4 h-4" /> 
    },
    { 
      id: 'config', 
      label: 'Config IA', 
      icon: <Cpu className="w-4 h-4" />, 
      badge: isKeyConfigured ? 'OK' : 'Falta Key' 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  AgroAI Suite Pro
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Syntropy Delta
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Plataforma Inteligente de Recepción y Beneficio Avícola
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${
              isKeyConfigured 
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60' 
                : 'bg-amber-950/50 text-amber-300 border-amber-800/60'
            }`}>
              {isKeyConfigured ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Gemini IA Activa ({aiConfig.model})</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Configure Gemini API Key</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : item.id === 'config' && !isKeyConfigured 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
