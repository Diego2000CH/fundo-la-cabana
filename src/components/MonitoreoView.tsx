import React, { useState } from 'react';
import { 
  Bug, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Plus, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Parcela, RegistroLabor, PlagaFicha } from '../types/campo';
import { plagasGuiaKiwi } from '../data/initialData';

interface MonitoreoViewProps {
  labores: RegistroLabor[];
  parcelas: Parcela[];
  onOpenNewLaborWithDefaults: (parcelaId?: string, tipoLabor?: any) => void;
  onSaveQuickObservation: (labor: RegistroLabor) => void;
}

export const MonitoreoView: React.FC<MonitoreoViewProps> = ({
  labores,
  parcelas,
  onOpenNewLaborWithDefaults,
  onSaveQuickObservation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaga, setSelectedPlaga] = useState<PlagaFicha | null>(plagasGuiaKiwi[0]);
  
  // Quick Scouting state
  const [isQuickScoutOpen, setIsQuickScoutOpen] = useState(false);
  const [scoutParcelaId, setScoutParcelaId] = useState<string>(parcelas[0]?.id || '');
  const [scoutPlaga, setScoutPlaga] = useState('Arañita roja del manzano/cerezo');
  const [scoutNivel, setScoutNivel] = useState<'Bajo (<5%)' | 'Medio (5-15%)' | 'Crítico (>15%)' | 'No detectado'>('Bajo (<5%)');
  const [scoutUmbralSuperado, setScoutUmbralSuperado] = useState(false);
  const [scoutNotas, setScoutNotas] = useState('');
  const [scoutPhotoPreview, setScoutPhotoPreview] = useState<string | null>(null);

  // Filter existing monitoring records
  const monitoringRecords = labores.filter(l => l.tipoLabor === 'monitoreo');

  // Filtered pest guide for kiwis
  const filteredPlagas = plagasGuiaKiwi.filter(p => 
    p.nombreComun.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nombreCientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cultivosAfectados.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScoutPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveScout = (e: React.FormEvent) => {
    e.preventDefault();
    const pSel = parcelas.find(p => p.id === scoutParcelaId);
    const newLog: RegistroLabor = {
      id: `lab-scout-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 5),
      parcelaId: scoutParcelaId,
      parcelaNombre: pSel ? pSel.nombre : 'Parcela',
      tipoLabor: 'monitoreo',
      descripcionGeneral: `Monitoreo de ${scoutPlaga}`,
      plagaObjetivo: scoutPlaga,
      nivelInfestacion: scoutNivel,
      umbralSuperado: scoutUmbralSuperado,
      fotoUrl: scoutPhotoPreview || '/src/assets/images/agro_monitoring_leaf_1792419620073.jpg',
      observaciones: scoutNotas,
      accionSugerida: scoutUmbralSuperado ? 'Aplicación correctiva recomendada' : 'Mantener monitoreo periódico',
      registradoPor: 'Diego Pereira'
    };
    onSaveQuickObservation(newLog);
    setIsQuickScoutOpen(false);
    setScoutNotas('');
    setScoutPhotoPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Monitoreo Fitosanitario y Scouting de Plagas
          </h1>
          <p className="text-xs text-stone-500">
            Seguimiento de umbrales económicos, registro fotográfico y guía técnica de control
          </p>
        </div>
        <button
          onClick={() => setIsQuickScoutOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
        >
          <Camera className="w-4 h-4" />
          Registrar Muestreo en Terreno
        </button>
      </div>

      {/* Quick Scouting Modal */}
      {isQuickScoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Bug className="w-4 h-4 text-emerald-800" />
                Ficha Rápida de Monitoreo / Scouting
              </h3>
              <button
                onClick={() => setIsQuickScoutOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveScout} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Parcela o Cuartel *</label>
                <select
                  value={scoutParcelaId}
                  onChange={(e) => setScoutParcelaId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                >
                  {parcelas.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} ({p.cultivo})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Plaga, Enfermedad o Síntoma *</label>
                <input
                  type="text"
                  required
                  value={scoutPlaga}
                  onChange={(e) => setScoutPlaga(e.target.value)}
                  placeholder="Ej: Arañita roja, Botrytis, Drosophila suzukii"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Nivel de Presencia</label>
                  <select
                    value={scoutNivel}
                    onChange={(e) => setScoutNivel(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="No detectado">No detectado (0%)</option>
                    <option value="Bajo (<5%)">Bajo (&lt;5%)</option>
                    <option value="Medio (5-15%)">Medio (5-15%)</option>
                    <option value="Crítico (>15%)">Crítico (&gt;15%)</option>
                  </select>
                </div>
                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                    <input
                      type="checkbox"
                      checked={scoutUmbralSuperado}
                      onChange={(e) => setScoutUmbralSuperado(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-800"
                    />
                    <span>¿Supera umbral económico?</span>
                  </label>
                </div>
              </div>

              {/* Photo Upload or Preset */}
              <div>
                <label className="block text-stone-700 font-medium mb-1">Evidencia Fotográfica de Síntomas</label>
                <div className="flex items-center gap-3">
                  <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-300 cursor-pointer flex items-center gap-1.5 font-medium transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    Subir Foto / Tomar Captura
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {!scoutPhotoPreview && (
                    <button
                      type="button"
                      onClick={() => setScoutPhotoPreview('/src/assets/images/agro_monitoring_leaf_1792419620073.jpg')}
                      className="text-[11px] text-emerald-800 hover:underline"
                    >
                      Usar foto de muestra (Tomate/Fruto)
                    </button>
                  )}
                </div>
                {scoutPhotoPreview && (
                  <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-stone-300">
                    <img 
                      src={scoutPhotoPreview} 
                      alt="Previsualización de síntoma" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setScoutPhotoPreview(null)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Notas de Muestreo / Conteo</label>
                <textarea
                  rows={2}
                  placeholder="Conteo de individuos por hoja, órganos afectados, trampas revisadas..."
                  value={scoutNotas}
                  onChange={(e) => setScoutNotas(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickScoutOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                >
                  Guardar Monitoreo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid: Active Monitoring Logs + Agronomic Pest Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Registered Field Scouting Observations (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Registros Recientes de Monitoreo ({monitoringRecords.length})
            </h3>
            <span className="text-[11px] text-stone-500">
              Evaluación fitosanitaria en terreno
            </span>
          </div>

          {monitoringRecords.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
              <Bug className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-600">No hay muestreos fitosanitarios registrados aún.</p>
              <button
                onClick={() => setIsQuickScoutOpen(true)}
                className="mt-3 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100"
              >
                Registrar primer muestreo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {monitoringRecords.map((m) => (
                <div key={m.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-4">
                  {/* Photo if present */}
                  {m.fotoUrl && (
                    <div className="w-full sm:w-28 sm:h-28 h-40 shrink-0 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                      <img 
                        src={m.fotoUrl} 
                        alt="Evidencia fitosanitaria" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">
                          {m.plagaObjetivo || m.descripcionGeneral}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                          <span className="font-medium text-stone-700">{m.parcelaNombre}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{m.fecha}</span>
                          <span aria-hidden="true">·</span>
                          <span>Presencia: <strong className="text-stone-800">{m.nivelInfestacion}</strong></span>
                        </div>
                      </div>

                      {m.umbralSuperado ? (
                        <span className="px-2 py-0.5 bg-red-50 text-red-800 text-[11px] font-bold rounded border border-red-200 whitespace-nowrap">
                          Umbral Superado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded border border-emerald-200 whitespace-nowrap">
                          Bajo Umbral
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {m.observaciones || 'Inspección de rutina sin anomalías graves.'}
                    </p>

                    {m.accionSugerida && (
                      <div className="text-[11px] text-stone-500">
                        <span className="font-semibold text-stone-700">Recomendación técnica:</span> {m.accionSugerida}
                      </div>
                    )}

                    {m.umbralSuperado && (
                      <div className="pt-2">
                        <button
                          onClick={() => onOpenNewLaborWithDefaults(m.parcelaId, 'fitosanitario')}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors inline-flex items-center gap-1.5"
                        >
                          Programar Tratamiento Fitosanitario
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Agronomic Pest & Disease Reference Guide (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-emerald-800" />
              Guía de Plagas y Umbrales Económicos
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Protocolos de monitoreo y criterios de intervención técnica
            </p>
          </div>

          {/* Search plagas */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar plaga o cultivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* List of pests */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {filteredPlagas.map((plaga) => (
              <button
                key={plaga.nombreComun}
                onClick={() => setSelectedPlaga(plaga)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between ${
                  selectedPlaga?.nombreComun === plaga.nombreComun
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="font-semibold text-stone-900">{plaga.nombreComun}</div>
                  <div className="text-[11px] text-stone-500 italic">{plaga.nombreCientifico}</div>
                </div>
                <span className="text-[10px] text-stone-400">{plaga.periodoAlerta}</span>
              </button>
            ))}
          </div>

          {/* Selected Pest Detail Card */}
          {selectedPlaga && (
            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs">
              <div className="border-b border-stone-200 pb-2">
                <h4 className="font-bold text-stone-900">{selectedPlaga.nombreComun}</h4>
                <p className="text-[11px] text-stone-500 italic">{selectedPlaga.nombreCientifico}</p>
                <div className="text-[11px] text-emerald-800 mt-1">
                  Cultivos: {selectedPlaga.cultivosAfectados.join(', ')}
                </div>
              </div>

              <div>
                <span className="font-semibold text-stone-800 block text-[11px]">Síntomas y Daño:</span>
                <p className="text-stone-600 text-[11px] leading-relaxed">{selectedPlaga.sintomas}</p>
              </div>

              <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-950">
                <span className="font-bold block text-[11px]">Umbral de Daño Económico:</span>
                <p className="text-[11px] leading-relaxed">{selectedPlaga.umbralEconomico}</p>
              </div>

              <div>
                <span className="font-semibold text-stone-800 block text-[11px]">Control y Manejo Integrado (MIP):</span>
                <p className="text-stone-600 text-[11px] leading-relaxed">{selectedPlaga.metodoControl}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
