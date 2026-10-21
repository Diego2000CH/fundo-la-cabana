import React, { useState } from 'react';
import { 
  Snowflake, 
  Sprout, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Thermometer, 
  Flower2, 
  X, 
  Trash2,
  Sparkles,
  Calculator,
  Percent
} from 'lucide-react';
import { 
  Parcela, 
  CondicionHorasFrio, 
  SeguimientoFenologico, 
  RegistroPolinizacion,
  ConteoYemasBrotacion
} from '../types/campo';

interface HorasFrioFenologiaViewProps {
  parcelas: Parcela[];
  horasFrio: CondicionHorasFrio;
  onUpdateHorasFrio: (hf: CondicionHorasFrio) => void;
  fenologia: SeguimientoFenologico[];
  onAddFenologia: (item: SeguimientoFenologico) => void;
  onDeleteFenologia: (id: string) => void;
  polinizacion: RegistroPolinizacion[];
  onAddPolinizacion: (item: RegistroPolinizacion) => void;
  onDeletePolinizacion: (id: string) => void;
  activeUserName?: string;
}

export const HorasFrioFenologiaView: React.FC<HorasFrioFenologiaViewProps> = ({
  parcelas,
  horasFrio,
  onUpdateHorasFrio,
  fenologia,
  onAddFenologia,
  onDeleteFenologia,
  polinizacion,
  onAddPolinizacion,
  onDeletePolinizacion,
  activeUserName = 'Ing. Agrónomo'
}) => {
  const [subTab, setSubTab] = useState<'horas_frio' | 'brotacion' | 'fenologia' | 'polinizacion'>('brotacion');

  // Modales
  const [isModalFenologiaOpen, setIsModalFenologiaOpen] = useState(false);
  const [isModalPolinizacionOpen, setIsModalPolinizacionOpen] = useState(false);
  const [isModalBrotacionOpen, setIsModalBrotacionOpen] = useState(false);

  // Estados Conteo Yemas y Brotación
  const [conteosBrotacion, setConteosBrotacion] = useState<ConteoYemasBrotacion[]>([]);
  const [broParcelaId, setBroParcelaId] = useState(parcelas[0]?.id || '');
  const [broFecha, setBroFecha] = useState(new Date().toISOString().slice(0, 10));
  const [broHilera, setBroHilera] = useState('Hilera 1 a 10');
  const [broCargadores, setBroCargadores] = useState<number>(20);
  const [broYemasInvierno, setBroYemasInvierno] = useState<number>(360); // 18 yemas promedio x 20 cargadores
  const [broBrotesEmergidos, setBroBrotesEmergidos] = useState<number>(270);
  const [broBrotesFertiles, setBroBrotesFertiles] = useState<number>(215);
  const [broObservaciones, setBroObservaciones] = useState('');

  // Cálculo automático de % de brotación
  const pctBrotacionCalculado = broYemasInvierno > 0 
    ? Number(((broBrotesEmergidos / broYemasInvierno) * 100).toFixed(1)) 
    : 0;

  const pctFertilidadCalculado = broBrotesEmergidos > 0 
    ? Number(((broBrotesFertiles / broBrotesEmergidos) * 100).toFixed(1)) 
    : 0;

  const handleSaveBrotacion = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parcelas.find(item => item.id === broParcelaId);
    const nuevo: ConteoYemasBrotacion = {
      id: `brot-${Date.now()}`,
      fecha: broFecha,
      parcelaId: p ? p.id : 'parc-1',
      parcelaNombre: p ? p.nombre : 'Cuartel Principal',
      hileraSector: broHilera,
      cargadoresMuestreados: Number(broCargadores),
      yemasTotalesInvierno: Number(broYemasInvierno),
      brotesEmergidos: Number(broBrotesEmergidos),
      brotesFertilesFlorales: Number(broBrotesFertiles),
      porcentajeBrotacion: pctBrotacionCalculado,
      porcentajeFertilidad: pctFertilidadCalculado,
      evaluador: activeUserName,
      observaciones: broObservaciones || undefined
    };

    setConteosBrotacion([nuevo, ...conteosBrotacion]);
    setIsModalBrotacionOpen(false);
    setBroObservaciones('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-sky-950 via-emerald-950 to-teal-950 rounded-2xl text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-800/60 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-sky-600/30">
            <Sprout className="w-3.5 h-3.5 text-sky-300" />
            Kiwi Hayward · Potencial Productivo
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Yemas de Invierno, Brotación y Fenología
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl mt-1">
            Control agronómico de conteo de yemas por cargador, porcentaje real de brotación, horas de frío acumuladas y floración.
          </p>
        </div>

        <button
          onClick={() => setIsModalBrotacionOpen(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Registrar Conteo de Yemas / Brotación
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('brotacion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'brotacion' ? 'bg-emerald-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Percent className="w-4 h-4 text-emerald-300" />
          Conteo de Yemas & % Brotación ({conteosBrotacion.length})
        </button>

        <button
          onClick={() => setSubTab('horas_frio')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'horas_frio' ? 'bg-sky-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Snowflake className="w-4 h-4" />
          Horas Frío ({horasFrio.horasFrioAcumuladas} HF)
        </button>

        <button
          onClick={() => setSubTab('fenologia')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'fenologia' ? 'bg-emerald-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Sprout className="w-4 h-4" />
          Estados BBCH ({fenologia.length})
        </button>

        <button
          onClick={() => setSubTab('polinizacion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'polinizacion' ? 'bg-amber-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Flower2 className="w-4 h-4" />
          Polinización ({polinizacion.length})
        </button>
      </div>

      {/* SUBTAB CONTEO DE YEMAS Y BROTACIÓN */}
      {subTab === 'brotacion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Fórmula de Brotación
              </span>
              <div className="text-sm font-mono text-emerald-900 mt-1 font-bold">
                (Brotes Emergidos / Yemas de Invierno) &times; 100
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Óptimo en Kiwi Hayward: <strong>65% a 80%</strong>
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Yemas Promedio por Cargador
              </span>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                15 - 20 yemas
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                En parrón español y cargadores de 1.2 a 1.6 metros
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Fertilidad de Yemas
              </span>
              <div className="text-2xl font-bold text-teal-800 mt-1">
                Brotes con Flor
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Calcula cuántos brotes son productivos (con botones florales)
              </p>
            </div>
          </div>

          {/* Tabla de Conteos */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Registros de Yemas y Brotación por Cuartel</h3>
                <p className="text-xs text-stone-500">Evaluación de cargadores de invierno y brotes en primavera</p>
              </div>
              <button
                onClick={() => setIsModalBrotacionOpen(true)}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                + Nuevo Conteo
              </button>
            </div>

            {conteosBrotacion.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                No hay conteos de yemas registrados aún. Haz clic en <strong>"+ Nuevo Conteo"</strong> para registrar tu primera evaluación de cargadores e hileras.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {conteosBrotacion.map((b) => (
                  <div key={b.id} className="p-4 hover:bg-stone-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-stone-900">{b.parcelaNombre}</span>
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-700">
                            {b.hileraSector}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                            b.porcentajeBrotacion >= 70 ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                            b.porcentajeBrotacion >= 55 ? 'bg-amber-100 text-amber-950 border-amber-300' :
                            'bg-red-100 text-red-950 border-red-300'
                          }`}>
                            {b.porcentajeBrotacion}% Brotación
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 text-xs text-stone-600 mt-1">
                          <span>Fecha: {b.fecha}</span>
                          <span>Cargadores: <strong>{b.cargadoresMuestreados}</strong></span>
                          <span>Yemas Invierno: <strong>{b.yemasTotalesInvierno}</strong></span>
                          <span>Brotes Emergidos: <strong>{b.brotesEmergidos}</strong></span>
                          <span>Brotes Florales: <strong>{b.brotesFertilesFlorales} ({b.porcentajeFertilidad}%)</strong></span>
                          <span>Evaluador: {b.evaluador}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setConteosBrotacion(conteosBrotacion.filter(x => x.id !== b.id))}
                        className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg cursor-pointer ml-2 self-end md:self-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {b.observaciones && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg mt-2 italic">
                        "{b.observaciones}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB HORAS FRÍO */}
      {subTab === 'horas_frio' && (
        <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase text-sky-800">Modelo Weinberger (&lt; 7.2°C)</span>
              <div className="text-4xl font-extrabold text-sky-950 mt-1">
                {horasFrio.horasFrioAcumuladas} / {horasFrio.horasFrioMetaHayward} HF
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500">Cumplimiento</span>
              <div className="text-2xl font-bold text-emerald-800">{horasFrio.porcentajeCumplimiento}%</div>
            </div>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {horasFrio.observacionesAgronomicas}
          </p>
        </div>
      )}

      {/* SUBTAB FENOLOGÍA */}
      {subTab === 'fenologia' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
          {fenologia.map((f) => (
            <div key={f.id} className="p-4 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-stone-900">{f.parcelaNombre}</span>
                <span className="ml-2 font-mono text-emerald-800">[{f.codigoBBCH}]</span>
                <p className="text-stone-600">{f.nombreEstado}</p>
              </div>
              <span className="font-bold text-emerald-800 text-sm">{f.porcentajeAvance}%</span>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB POLINIZACIÓN */}
      {subTab === 'polinizacion' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
          {polinizacion.map((p) => (
            <div key={p.id} className="p-4 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-stone-900">{p.parcelaNombre}</span>
                <span className="ml-2 text-amber-800">({p.tipoPolinizador})</span>
                <p className="text-stone-600">Apiario: {p.proveedorApiario} · Sincronía: {p.sincroniaFloracion}</p>
              </div>
              <span className="font-bold text-amber-900 text-sm">{p.colmenasTotales} colmenas</span>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CONTEO DE YEMAS Y BROTACIÓN */}
      {isModalBrotacionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 bg-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Nuevo Conteo de Yemas y Brotación</h3>
              </div>
              <button onClick={() => setIsModalBrotacionOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBrotacion} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cuartel *</label>
                  <select
                    value={broParcelaId}
                    onChange={(e) => setBroParcelaId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    {parcelas.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                    {parcelas.length === 0 && <option value="general">Huerto General</option>}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={broFecha}
                    onChange={(e) => setBroFecha(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hilera o Sector Evaluado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Hilera 1 a 10 (20 cargadores muestreados)"
                  value={broHilera}
                  onChange={(e) => setBroHilera(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              {/* Conteo de Yemas */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">N° Cargadores</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={broCargadores}
                    onChange={(e) => setBroCargadores(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-lg border border-stone-300 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Yemas Invierno</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={broYemasInvierno}
                    onChange={(e) => setBroYemasInvierno(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-lg border border-stone-300 font-bold bg-white"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    ~{(broYemasInvierno / (broCargadores || 1)).toFixed(1)} yemas/cargador
                  </span>
                </div>
                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Brotes Vivos</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={broBrotesEmergidos}
                    onChange={(e) => setBroBrotesEmergidos(parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-emerald-300 font-bold bg-white text-emerald-950"
                  />
                </div>
              </div>

              {/* Resultados Calculados Automáticos */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                <div>
                  <span className="block text-[11px] font-bold text-emerald-900">% Brotación Calculado</span>
                  <div className="text-2xl font-extrabold text-emerald-950 mt-1">
                    {pctBrotacionCalculado}%
                  </div>
                  <span className="text-[10px] text-emerald-800 block">
                    {pctBrotacionCalculado >= 70 ? '✓ Nivel Óptimo' : '⚠ Nivel Bajo'}
                  </span>
                </div>
                <div>
                  <label className="block font-bold text-teal-950 mb-1">Brotes Florales (Fértiles)</label>
                  <input
                    type="number"
                    min="0"
                    value={broBrotesFertiles}
                    onChange={(e) => setBroBrotesFertiles(parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-teal-300 font-bold bg-white text-teal-950"
                  />
                  <span className="text-[10px] text-teal-800 block mt-0.5">
                    {pctFertilidadCalculado}% de fertilidad
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre vigor de brotes, efecto del rompedor de dormancia..."
                  value={broObservaciones}
                  onChange={(e) => setBroObservaciones(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalBrotacionOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Guardar Conteo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
