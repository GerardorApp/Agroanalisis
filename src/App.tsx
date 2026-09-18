import { useState, useEffect } from 'react';
import { ActiveModule, AIConfig, BenefitTicket } from './types';
import { getStoredAIConfig, saveStoredAIConfig, getStoredTickets, saveStoredTickets } from './utils/storage';
import { Navbar } from './components/Navbar';
import { AIConfigModule } from './components/AIConfigModule';
import { DashboardModule } from './components/DashboardModule';
import { IntelligentCaptureModule } from './components/IntelligentCaptureModule';
import { DocumentImporterModule } from './components/DocumentImporterModule';
import { ScaleFormModule } from './components/ScaleFormModule';
import { AIChatReportModule } from './components/AIChatReportModule';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [aiConfig, setAiConfig] = useState<AIConfig>({ apiKey: '', model: 'gemini-2.5-flash' });
  const [tickets, setTickets] = useState<BenefitTicket[]>([]);

  useEffect(() => {
    setAiConfig(getStoredAIConfig());
    setTickets(getStoredTickets());
  }, []);

  const handleSaveAIConfig = (newConfig: AIConfig) => {
    setAiConfig(newConfig);
    saveStoredAIConfig(newConfig);
  };

  const handleAddTicket = (ticket: BenefitTicket) => {
    const updated = [ticket, ...tickets];
    setTickets(updated);
    saveStoredTickets(updated);
  };

  const handleAddMultipleTickets = (newTickets: BenefitTicket[]) => {
    const updated = [...newTickets, ...tickets];
    setTickets(updated);
    saveStoredTickets(updated);
  };

  const handleDeleteTicket = (id: string) => {
    const updated = tickets.filter(t => t.id !== id);
    setTickets(updated);
    saveStoredTickets(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        aiConfig={aiConfig}
        tickets={tickets}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeModule === 'config' && (
          <AIConfigModule
            aiConfig={aiConfig}
            onSaveConfig={handleSaveAIConfig}
          />
        )}

        {activeModule === 'dashboard' && (
          <DashboardModule
            tickets={tickets}
          />
        )}

        {activeModule === 'capture' && (
          <IntelligentCaptureModule
            aiConfig={aiConfig}
            onAddTicket={handleAddTicket}
            onNavigateToScale={() => setActiveModule('scale')}
          />
        )}

        {activeModule === 'importer' && (
          <DocumentImporterModule
            onAddMultipleTickets={handleAddMultipleTickets}
            onNavigateToDashboard={() => setActiveModule('dashboard')}
          />
        )}

        {activeModule === 'scale' && (
          <ScaleFormModule
            tickets={tickets}
            onAddTicket={handleAddTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        )}

        {activeModule === 'chat' && (
          <AIChatReportModule
            aiConfig={aiConfig}
            tickets={tickets}
          />
        )}
      </main>
    </div>
  );
}
