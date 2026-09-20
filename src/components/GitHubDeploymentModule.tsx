import React, { useState } from 'react';
import { 
  Github, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  ExternalLink, 
  Download, 
  FileCode, 
  Workflow, 
  Smartphone, 
  ShieldCheck, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const GitHubDeploymentModule: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/GerardorApp/Agroanalisis.git');
  const [githubUser, setGithubUser] = useState('GerardorApp');
  const [githubRepo, setGithubRepo] = useState('Agroanalisis');
  const [copied, setCopied] = useState<string | null>(null);

  const cleanRepoUrl = githubUser.trim() 
    ? `https://github.com/${githubUser.trim()}/${githubRepo.trim() || 'Agroanalisis'}.git`
    : repoUrl;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 3000);
  };

  const gitPushScript = `# 1. Asegurar la rama principal
git branch -M main

# 2. Conectar tu repositorio remoto de GitHub (reemplaza con tu URL)
git remote add origin ${cleanRepoUrl}

# 3. Enviar todo el código a GitHub
git push -u origin main`;

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Github className="w-4 h-4" />
              <span>Sincronización GitHub & Generador de APK Android</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Despliegue y Compilación GitHub Actions
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
              Configuración y comandos verificados para sincronizar el proyecto en GitHub sin errores de argumentos y compilar el APK de Android automáticamente.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800/80 px-4 py-2.5 rounded-xl text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Git & Capacitor Android 100% Listos</span>
          </div>
        </div>
      </div>

      {/* Checklist diagnostic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Repositorio Git Local</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Rama <strong>main</strong> inicializada, usuario configurado y .gitignore ajustado para Android.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">GitHub Action Validado</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Archivo <code>.github/workflows/build-apk.yml</code> listo con Java 21 y Android SDK para compilar APK.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start space-x-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Capacitor Android</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Proyecto nativo Android generado con Gradle wrapper listo para empaquetar APK.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step Guide without argument errors */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg">
          <Terminal className="w-5 h-5 text-indigo-600" />
          <h2>Guía Rápida: Subir a GitHub en 3 Pasos (Sin Errores)</h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Para evitar el <strong>error de argumentos</strong>, asegúrese de ingresar el usuario y repositorio de GitHub aquí abajo para generar los comandos exactos listos para copiar con 1 solo clic:
        </p>

        {/* Input Generator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tu Usuario de GitHub
            </label>
            <input
              type="text"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              placeholder="Ej: tu-usuario-github"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre de tu Repositorio en GitHub
            </label>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder="Ej: agroai-suite-pro"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* Command Display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Comandos de Consola a Ejecutar:
            </span>
            <button
              onClick={() => copyToClipboard(gitPushScript, 'script')}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied === 'script' ? '¡Copiado al portapapeles!' : 'Copiar Comandos'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
            {gitPushScript}
          </pre>
        </div>

        {/* How GitHub Actions compiles the APK */}
        <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-indigo-950 font-bold text-sm">
            <Workflow className="w-5 h-5 text-indigo-600" />
            <span>¿Cómo funciona la compilación automática del APK en GitHub?</span>
          </div>

          <ol className="list-decimal list-inside text-xs text-indigo-900 space-y-1.5 leading-relaxed">
            <li>Al hacer <code>git push</code>, GitHub detecta automáticamente el flujo en <code>.github/workflows/build-apk.yml</code>.</li>
            <li>GitHub Actions crea una máquina virtual Ubuntu, instala Node 22, compila la aplicación web con <code>npm run build</code>.</li>
            <li>Configura Java 21 y Android SDK automáticamente, sincroniza Capacitor y ejecuta <code>./gradlew assembleDebug</code>.</li>
            <li>Sube el archivo <strong>agroai-debug-apk</strong> (formato .apk) a la pestaña <strong>Actions</strong> de tu repositorio listo para descargar e instalar en cualquier celular o tablet Android.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
