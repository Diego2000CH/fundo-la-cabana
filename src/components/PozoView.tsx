import React, { useState } from 'react';
import { 
  Droplet, 
  Plus, 
  Gauge, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  X,
  Layers,
  Clock,
  Compass
} from 'lucide-react';
import { RegistroExtraccionPozo } from '../types/campo';

interface PozoViewProps {
  registrosPozo: RegistroExtraccionPozo[];
  onAddRegistroPozo: (reg: RegistroExtraccionPozo) => void;
  onUpdateRegistroPozo?: (reg: RegistroExtraccionPozo) => void;
  onDeleteRegistroPozo: (id: string) => void;
}

export const PozoView: React.FC<PozoViewProps> = ({
  registrosPozo,
  onAddRegistroPozo,
  onUpdateRegistroPozo,
  onDeleteRegistroPozo
}) => {
  const [activeTabPozo, setActiveTabPozo] = useState<'pozo' | 'riego'>('pozo');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState<RegistroExtraccionPozo | null>(null);
  const [registroToDelete, setRegistroToDelete] = useState<RegistroExtraccionPozo | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState('07:00');
  
  const latestReading = registrosPozo.length > 0 
    ? Math.max(...registrosPozo.map((r) => r.lecturaFinalM3)) 
    : 0;

  const [lecturaInicialM3, setLecturaInicialM3] = useState<number | ''>(latestReading);
  const [lecturaFinalM3, setLecturaFinalM3] = useState<number | ''>(latestReading + 100);
  const [horasBombeo, setHorasBombeo] = useState<number | ''>(4.0);
  const [nivelEstaticoMetros, setNivelEstaticoMetros] = useState<number | ''>(14.0);
  const [nivelDinamicoMetros, setNivelDinamicoMetros] = useState<number | ''>(22.0);
  const [operadorBomba, setOperadorBomba] = useState('Operador');
  const [observaciones, setObservaciones] = useState('');

  const totalM3 = registrosPozo.reduce((acc, r) => acc + r.metrosCubicosExtraidos, 0);
  const totalLitros = totalM3 * 1000;
  const totalHoras = registrosPozo.reduce((acc, r) => acc + r.horasBombeo, 0);
  const caudalPromedio = totalHoras > 0 ? (totalLitros / (totalHoras * 3600)) : 0;
  const cuotaAutorizadaM3 = 85000;
  const porcentajeCuotaUtilizada = (totalM3 / cuotaAutorizadaM3) * 100;

  const openNewModal = () => {
    setEditingRegistro(null);
    setFecha(new Date().toISOString().slice(0, 10));
    setHora('07:00');
    setLecturaInicialM3(latestReading);
    setLecturaFinalM3(latestReading + 100);
    setHorasBombeo(4.0);
    setObservaciones('');
    setIsModalOpen(true);
  };

  const openEditModal = (r: RegistroExtraccionPozo) => {
    setEditingRegistro(r);
    setFecha(r.fecha);
    setHora(r.hora);
    setLecturaInicialM3(r.lecturaInicialM3);
    setLecturaFinalM3(r.lecturaFinalM3);
    setHorasBombeo(r.horasBombeo);
    setNivelEstaticoMetros(r.nivelEstaticoMetros ?? '');
    setNivelDinamicoMetros(r.nivelDinamicoMetros ?? '');
    setOperadorBomba(r.operadorBomba);
    setObservaciones(r.observaciones || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ini = Number(lecturaInicialM3) || 0;
    const fin = Number(lecturaFinalM3) || ini;
    const m3 = Math.max(0, fin - ini);
    const lts = m3 * 1000;
    const hrs = Number(horasBombeo) || 1;
    const caudal = hrs > 0 ? lts / (hrs * 3600) : 0;

    if (editingRegistro) {
      const actualizado: RegistroExtraccionPozo = {
        ...editingRegistro,
        fecha,
        hora,
        lecturaInicialM3: ini,
        lecturaFinalM3: fin,
        metrosCubicosExtraidos: m3,
        litrosTotales: lts,
        horasBombeo: hrs,
        caudalPromedioLs: Number(caudal.toFixed(1)),
        nivelEstaticoMetros: nivelEstaticoMetros !== '' ? Number(nivelEstaticoMetros) : undefined,
        nivelDinamicoMetros: nivelDinamicoMetros !== '' ? Number(nivelDinamicoMetros) : undefined,
        operadorBomba,
        observaciones
      };

      if (onUpdateRegistroPozo) {
        onUpdateRegistroPozo(actualizado);
      } else {
        onDeleteRegistroPozo(editingRegistro.id);
        onAddRegistroPozo(actualizado);
      }
      showToast('Registro de pozo actualizado');
    } else {
      const nuevo: RegistroExtraccionPozo = {
        id: `pz-${Date.now()}`,
        fecha,
        hora,
        lecturaInicialM3: ini,
        lecturaFinalM3: fin,
        metrosCubicosExtraidos: m3,
        litrosTotales: lts,
        horasBombeo: hrs,
        caudalPromedioLs: Number(caudal.toFixed(1)),
        nivelEstaticoMetros: nivelEstaticoMetros !== '' ? Number(nivelEstaticoMetros) : undefined,
        nivelDinamicoMetros: nivelDinamicoMetros !== '' ? Number(nivelDinamicoMetros) : undefined,
        operadorBomba,
        observaciones
      };
      onAddRegistroPozo(nuevo);
      showToast('Nueva extracción registrada');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Gestión Hídrica: Pozo Profundo y Riego
          </h1>
          <p className="text-xs text-stone-500">
            Control separado de extracciones desde el pozo profundo (DGA) y de distribución de riego por cuartel
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-800 rounded-lg hover:bg-sky-900 shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Lectura de Pozo
        </button>
      </div>

      {/* DOS PESTAÑAS SEPARADAS */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTabPozo('pozo')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTabPozo === 'pozo' ? 'bg-sky-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Droplet className="w-4 h-4 text-sky-400" />
          1. Pozo Profundo (Extracciones & Flujómetro DGA)
        </button>

        <button
          onClick={() => setActiveTabPozo('riego')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTabPozo === 'riego' ? 'bg-emerald-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Gauge className="w-4 h-4 text-emerald-400" />
          2. Riego (Distribución de Agua por Sectores)
        </button>
      </div>

      {/* VISTA 1: POZO PROFUNDO */}
      {activeTabPozo === 'pozo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Volumen Total Extraído</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-sky-950 tabular-nums">
                  {totalM3.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500">m³</span>
              </div>
              <div className="mt-1 text-[11px] text-sky-800 font-bold font-mono">
                {totalLitros.toLocaleString()} Litros
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Horas de Bombeo</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-stone-900 tabular-nums">
                  {totalHoras.toFixed(1)}
                </span>
                <span className="text-xs text-stone-500">horas</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Caudal Promedio Medido</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-emerald-800 tabular-nums">
                  {caudalPromedio.toFixed(1)}
                </span>
                <span className="text-xs text-stone-500">L/s</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Consumo Cuota Hídrica</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-stone-900 tabular-nums">
                  {porcentajeCuotaUtilizada.toFixed(1)}%
                </span>
                <span className="text-xs text-stone-500">de cuota anual</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Fecha & Hora</th>
                    <th className="py-3 px-4">Flujómetro Inicial / Final</th>
                    <th className="py-3 px-4">Metros Cúbicos</th>
                    <th className="py-3 px-4">Litros Totales</th>
                    <th className="py-3 px-4">Horas / Caudal</th>
                    <th className="py-3 px-4">Operador Bomba</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {registrosPozo.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="font-semibold text-stone-900">{r.fecha}</div>
                        <div className="text-[10px] text-stone-400">{r.hora}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-700">
                        <div>Ini: {r.lecturaInicialM3.toLocaleString()} m³</div>
                        <div>Fin: {r.lecturaFinalM3.toLocaleString()} m³</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-sky-950">
                        {r.metrosCubicosExtraidos.toLocaleString()} m³
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-800">
                        {r.litrosTotales.toLocaleString()} L
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div>{r.horasBombeo} hrs</div>
                        <div className="text-[10px] text-stone-400">{r.caudalPromedioLs} L/s</div>
                      </td>
                      <td className="py-3 px-4">{r.operadorBomba}</td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(r)}
                            className="p-1.5 text-sky-800 hover:bg-sky-50 rounded cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setRegistroToDelete(r)}
                            className="p-1.5 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {registrosPozo.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-stone-400">
                        No hay lecturas registradas. Haz clic en <strong>"+ Registrar Lectura de Pozo"</strong> para ingresar la primera.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: RIEGO */}
      {activeTabPozo === 'riego' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
            <h4 className="font-bold text-emerald-950 mb-1">Distribución de Riego Tecnificado</h4>
            <p className="text-emerald-900">
              Registra los riegos aplicados a los cuarteles de kiwi o a las demás zonas del fundo (casa patronal, quinta frutal, praderas).
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
            💡 Puedes registrar un nuevo riego hacia cualquier cuartel o sector directamente desde el botón verde <strong>"+ Nueva Labor"</strong> arriba a la derecha, seleccionando el tipo <strong>"Riego Pozo"</strong> y especificando el destino (Huerto, Casa patronal, Quinta frutal, etc.).
          </div>
        </div>
      )}

      {/* MODAL POZO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200 bg-sky-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-300" />
                {editingRegistro ? 'Editar Lectura de Bomba' : 'Nueva Lectura de Pozo Profundo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-sky-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Flujómetro Inicial (m³) *</label>
                  <input
                    type="number"
                    required
                    value={lecturaInicialM3}
                    onChange={(e) => setLecturaInicialM3(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Flujómetro Final (m³) *</label>
                  <input
                    type="number"
                    required
                    value={lecturaFinalM3}
                    onChange={(e) => setLecturaFinalM3(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 flex justify-between font-bold text-sky-950">
                <span>Volumen Extraído:</span>
                <span>
                  {Math.max(0, (Number(lecturaFinalM3) || 0) - (Number(lecturaInicialM3) || 0))} m³ = {((Math.max(0, (Number(lecturaFinalM3) || 0) - (Number(lecturaInicialM3) || 0))) * 1000).toLocaleString()} Litros
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Horas de Bombeo</label>
                  <input
                    type="number"
                    step="0.1"
                    value={horasBombeo}
                    onChange={(e) => setHorasBombeo(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Operador Bomba</label>
                  <input
                    type="text"
                    value={operadorBomba}
                    onChange={(e) => setOperadorBomba(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-800 text-white font-bold rounded-lg cursor-pointer hover:bg-sky-900"
                >
                  Guardar Lectura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {registroToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 border border-stone-200 space-y-3">
            <h3 className="font-bold text-sm text-stone-900">¿Eliminar lectura de pozo?</h3>
            <p className="text-stone-600">
              Se eliminará la extracción de <strong>{registroToDelete.metrosCubicosExtraidos} m³</strong> ({registroToDelete.fecha}).
            </p>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setRegistroToDelete(null)} className="px-4 py-2 border rounded-lg cursor-pointer">
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteRegistroPozo(registroToDelete.id);
                  showToast('Extracción eliminada');
                  setRegistroToDelete(null);
                }}
                className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
