import React, { useState } from 'react';
import { 
  Droplet, 
  Plus, 
  Gauge, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  X
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
    : 41630;

  const [lecturaInicialM3, setLecturaInicialM3] = useState<number | ''>(latestReading);
  const [lecturaFinalM3, setLecturaFinalM3] = useState<number | ''>(latestReading + 350);
  const [horasBombeo, setHorasBombeo] = useState<number | ''>(4.0);
  const [nivelEstaticoMetros, setNivelEstaticoMetros] = useState<number | ''>(14.1);
  const [nivelDinamicoMetros, setNivelDinamicoMetros] = useState<number | ''>(22.5);
  const [sectorDestino, setSectorDestino] = useState('Cuartel 1 y 2 - Kiwis Hayward');
  const [operadorBomba, setOperadorBomba] = useState('Carlos Morales Vega');
  const [observaciones, setObservaciones] = useState('Bomba 30 HP operando a 3.2 bar constante');

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
    setLecturaFinalM3(latestReading + 350);
    setHorasBombeo(4.0);
    setNivelEstaticoMetros(14.1);
    setNivelDinamicoMetros(22.5);
    setSectorDestino('Cuartel 1 y 2 - Kiwis Hayward');
    setOperadorBomba('Carlos Morales Vega');
    setObservaciones('Bomba 30 HP operando a 3.2 bar constante');
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
    setSectorDestino(r.sectorDestino);
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
        sectorDestino,
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
        sectorDestino,
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Control de Pozo Profundo y Litros de Riego
          </h1>
          <p className="text-xs text-stone-500">
            Monitoreo oficial de extracciones hídricas efectivas, flujómetro y cuota de agua para kiwis
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-800 rounded-lg hover:bg-sky-900 shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Lectura de Bombeo
        </button>
      </div>

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
          <div className="mt-1 text-[11px] text-stone-400">
            {registrosPozo.length} eventos de extracción
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
          <div className="mt-1 text-[11px] text-stone-400">
            Autorizado DGA: hasta 25 L/s
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
          <div className="mt-1 text-[11px] text-stone-400">
            {totalM3} de {cuotaAutorizadaM3.toLocaleString()} m³
          </div>
        </div>
      </div>

      <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-sky-950 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-sky-800" />
            Pozo Profundo N°1 - Fundo La Cabaña (Resolución DGA N° 412/2016)
          </div>
          <p className="text-sky-900">
            Profundidad: 64 metros · Diámetro: 12 pulgadas · Bomba 30 HP · Medidor homologado DGA.
          </p>
        </div>
        <div className="shrink-0 font-mono text-[11px] text-sky-900 bg-white/80 p-2 rounded border border-sky-200">
          Última lectura: <strong className="text-sky-950">{latestReading.toLocaleString()} m³</strong>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Fecha & Hora</th>
                <th className="py-3 px-4">Lectura Flujómetro (m³)</th>
                <th className="py-3 px-4">Volumen Extraído</th>
                <th className="py-3 px-4">Litros Totales</th>
                <th className="py-3 px-4">Horas / Caudal</th>
                <th className="py-3 px-4">Sector Huerto Kiwi</th>
                <th className="py-3 px-4">Operador</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {registrosPozo.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap text-stone-800">
                    <div className="font-semibold">{r.fecha}</div>
                    <div className="text-[10px] text-stone-400">{r.hora}</div>
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap text-stone-700">
                    <div>Ini: {r.lecturaInicialM3.toLocaleString()} m³</div>
                    <div>Fin: {r.lecturaFinalM3.toLocaleString()} m³</div>
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap font-bold text-sky-950">
                    {r.metrosCubicosExtraidos.toLocaleString()} m³
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap font-semibold text-emerald-800">
                    {r.litrosTotales.toLocaleString()} L
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums text-stone-600">
                    <div>{r.horasBombeo} horas</div>
                    <div className="text-[10px] text-stone-400">{r.caudalPromedioLs} L/s promedio</div>
                  </td>

                  <td className="py-3 px-4 font-medium text-stone-800">
                    {r.sectorDestino}
                  </td>

                  <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                    {r.operadorBomba}
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200 p-1 rounded-xl shadow-2xs">
                      <button
                        type="button"
                        onClick={() => openEditModal(r)}
                        className="px-2 py-1 text-xs font-semibold text-sky-800 hover:text-white hover:bg-sky-800 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        title="Editar extracción"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegistroToDelete(r)}
                        className="px-2 py-1 text-xs font-semibold text-red-700 hover:text-white hover:bg-red-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        title="Eliminar extracción"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-sky-950 text-white">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-300" />
                {editingRegistro ? 'Editar Registro de Bombeo' : 'Registrar Lectura y Bombeo de Pozo Profundo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-sky-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Fecha de Extracción *</label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Lectura Inicial Flujómetro (m³) *</label>
                  <input
                    type="number"
                    required
                    value={lecturaInicialM3}
                    onChange={(e) => setLecturaInicialM3(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Lectura Final Flujómetro (m³) *</label>
                  <input
                    type="number"
                    required
                    value={lecturaFinalM3}
                    onChange={(e) => setLecturaFinalM3(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 flex items-center justify-between">
                <span className="text-stone-700 font-semibold">Cálculo de Extracción:</span>
                <span className="font-mono font-bold text-sky-950">
                  {Math.max(0, (Number(lecturaFinalM3) || 0) - (Number(lecturaInicialM3) || 0))} m³ = {((Math.max(0, (Number(lecturaFinalM3) || 0) - (Number(lecturaInicialM3) || 0))) * 1000).toLocaleString()} Litros
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Horas Bombeo</label>
                  <input
                    type="number"
                    step="0.1"
                    value={horasBombeo}
                    onChange={(e) => setHorasBombeo(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Nivel Estático (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={nivelEstaticoMetros}
                    onChange={(e) => setNivelEstaticoMetros(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Nivel Dinámico (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={nivelDinamicoMetros}
                    onChange={(e) => setNivelDinamicoMetros(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Sector / Cuartel Regado</label>
                <input
                  type="text"
                  value={sectorDestino}
                  onChange={(e) => setSectorDestino(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Operador Responsable de Bomba</label>
                <input
                  type="text"
                  value={operadorBomba}
                  onChange={(e) => setOperadorBomba(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-800 text-white rounded-xl font-bold hover:bg-sky-900 cursor-pointer"
                >
                  {editingRegistro ? 'Guardar Cambios' : 'Guardar Registro de Pozo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {registroToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-red-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm">Eliminar Registro de Extracción</h3>
              </div>
              <button onClick={() => setRegistroToDelete(null)} className="p-1 text-red-200 hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="text-stone-800 text-sm font-medium">
                ¿Estás seguro de que deseas eliminar este registro de extracción de agua?
              </p>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-stone-700">
                <div><strong>Fecha:</strong> {registroToDelete.fecha} ({registroToDelete.hora})</div>
                <div><strong>Volumen:</strong> {registroToDelete.metrosCubicosExtraidos.toLocaleString()} m³ ({registroToDelete.litrosTotales.toLocaleString()} Litros)</div>
                <div><strong>Sector:</strong> {registroToDelete.sectorDestino}</div>
                <div><strong>Operador:</strong> {registroToDelete.operadorBomba}</div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRegistroToDelete(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteRegistroPozo(registroToDelete.id);
                    showToast('Registro de extracción eliminado');
                    setRegistroToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar Definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
