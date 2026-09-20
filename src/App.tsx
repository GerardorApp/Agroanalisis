import { useState, useEffect } from 'react';
import { ActiveModule, AIConfig, BenefitTicket, CestaRecord, CestasInventoryConfig } from './types';
import { 
  getStoredAIConfig, 
  saveStoredAIConfig, 
  getStoredTickets, 
  saveStoredTickets,
  getStoredCestas,
  saveStoredCestas,
  getStoredCestasConfig,
  saveStoredCestasConfig
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { AIConfigModule } from './components/AIConfigModule';
import { DashboardModule } from './components/DashboardModule';
import { CestasMaxipollosModule } from './components/CestasMaxipollosModule';
import { IntelligentCaptureModule } from './components/IntelligentCaptureModule';
import { DocumentImporterModule } from './components/DocumentImporterModule';
import { ScaleFormModule } from './components/ScaleFormModule';
import { DidacticGuideModule } from './components/DidacticGuideModule';
import { GitHubDeploymentModule } from './components/GitHubDeploymentModule';
import { AIChatReportModule } from './components/AIChatReportModule';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('cestas');
  const [aiConfig, setAiConfig] = useState<AIConfig>({ apiKey: '', model: 'gemini-2.5-flash' });
  const [tickets, setTickets] = useState<BenefitTicket[]>([]);
  const [cestasRecords, setCestasRecords] = useState<CestaRecord[]>([]);
  const [cestasConfig, setCestasConfig] = useState<CestasInventoryConfig>({
    titulo: 'Cestas Maxipollos',
    subtitulo: 'Inv. General: Saldo anterior',
    fechaInicial: '11/9/26',
    saldoInicial: 16,
    conteoPatioBase: 1456,
    actualizadoPatio: 1503,
    alertaStockMinimo: 100,
  });

  useEffect(() => {
    setAiConfig(getStoredAIConfig());
    setTickets(getStoredTickets());
    setCestasRecords(getStoredCestas());
    setCestasConfig(getStoredCestasConfig());
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

  const handleUpdateCestasRecords = (updated: CestaRecord[]) => {
    setCestasRecords(updated);
    saveStoredCestas(updated);
  };

  const handleUpdateCestasConfig = (updated: CestasInventoryConfig) => {
    setCestasConfig(updated);
    saveStoredCestasConfig(updated);
  };

  const currentCestasSaldo = cestasRecords.length > 0 
    ? cestasRecords[cestasRecords.length - 1].saldo 
    : cestasConfig.saldoInicial;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        aiConfig={aiConfig}
        tickets={tickets}
        cestasSaldo={currentCestasSaldo}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeModule === 'cestas' && (
          <CestasMaxipollosModule
            records={cestasRecords}
            config={cestasConfig}
            aiConfig={aiConfig}
            onUpdateRecords={handleUpdateCestasRecords}
            onUpdateConfig={handleUpdateCestasConfig}
            onNavigateToCapture={() => setActiveModule('capture')}
          />
        )}

        {activeModule === 'dashboard' && (
          <DashboardModule
            tickets={tickets}
          />
        )}

        {activeModule === 'scale' && (
          <ScaleFormModule
            tickets={tickets}
            onAddTicket={handleAddTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        )}

        {activeModule === 'didactic' && (
          <DidacticGuideModule />
        )}

        {activeModule === 'github' && (
          <GitHubDeploymentModule />
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

        {activeModule === 'chat' && (
          <AIChatReportModule
            aiConfig={aiConfig}
            tickets={tickets}
          />
        )}

        {activeModule === 'config' && (
          <AIConfigModule
            aiConfig={aiConfig}
            onSaveConfig={handleSaveAIConfig}
          />
        )}
      </main>
    </div>
  );
}

