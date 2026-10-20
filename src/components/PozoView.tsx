import React, { useState } from 'react';
import { 
  Droplet, 
  Activity, 
  Plus, 
  Gauge, 
  Clock, 
  Calendar, 
  User, 
  Trash2, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { RegistroExtraccionPozo } from '../types/campo';

interface PozoViewProps {
  registrosPozo: RegistroExtraccionPozo[];
  onAddRegistroPozo: (reg: RegistroExtraccionPozo) => void;
  onDeleteRegistroPozo: (id: string) => void;
}

export const PozoView: React.FC<PozoViewProps> = ({
  registrosPozo,
  onAddRegistroPozo,
  onDeleteRegistroPozo
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registroToDelete, setRegistroToDelete] = useState<RegistroExtraccionPozo | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Form states
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState('07:00');
  
  // Calculate latest flujometer reading as default initial reading
  const latestReading = registrosPozo.length > 0 
    ? Math.max(...registrosPozo.map(r => r.lecturaFinalM3)) 
    : 41630;

  const [lecturaInicialM3, setLecturaInicialM3] = useState<number | ''>(latestReading);
  const [lecturaFinalM3, setLecturaFinalM3] = useState<number | ''>(latestReading + 350);
  const [horasBombeo, setHorasBombeo] = useState<number | ''>(4.0);
  const [nivelEstaticoMetros, setNivelEstaticoMetros] = useState<number | ''>(14.1);
  const [nivelDinamicoMetros, setNivelDinamicoMetros] = useState<number | ''>(22.5);
  const [sectorDestino, setSectorDestino] = useState('Cuartel 1 y 2 - Kiwis Hayward');
  const [operadorBomba, setOperadorBomba] = useState('Carlos Morales Vega');
  const [observaciones, setObservaciones] = useState('Bomba 30 HP operando a 3.2 bar constante');

  // Aggregated totals
  const totalM3 = registrosPozo.reduce((acc, r) => acc + r.metrosCubicosExtraidos, 0);
  const totalLitros = totalM3 * 1000;
  const totalHoras = registrosPozo.reduce((acc, r) => acc + r.horasBombeo, 0);
  const caudalPromedio = totalHoras > 0 ? (totalLitros / (totalHoras * 3600)) : 0;

  // Cuota anual de extracción autorizada DGA (ej: 120.000 m3 anuales)
  const cuotaAutorizadaM3 = 85000;
  const porcentajeCuotaUtilizada = (totalM3 / cuotaAutorizadaM3) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ini = Number(lecturaInicialM3) || 0;
    const fin = Number(lecturaFinalM3) || ini;
    const m3 = Math.max(0, fin - ini);
    const lts = m3 * 1000;
    const hrs = Number(horasBombeo) || 1;
    const caudal = hrs > 0 ? lts / (hrs * 3600) : 0;

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
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-800 rounded-lg hover:bg-sky-900 shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Registrar Lectura de Bombeo
        </button>
      </div>

      {/* KPI Cards: Water Extraction Metrics */}
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

      {/* Well Technical Specification Banner */}
      <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-sky-950 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-sky-800" />
            Pozo Profundo N°1 - Fundo La Cabaña (Resolución DGA N° 412/2016)
          </div>
          <p className="text-sky-900">
            Profundidad total: 64 metros · Diámetro entubado: 12 pulgadas · Bomba sumergible Franklin 30 HP · Medidor electromagnético tipo flujómetro homologado.
          </p>
        </div>
        <div className="shrink-0 font-mono text-[11px] text-sky-900 bg-white/80 p-2 rounded border border-sky-200">
          Última lectura: <strong className="text-sky-950">{latestReading.toLocaleString()} m³</strong>
        </div>
      </div>

      {/* Table of Well Extractions */}
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
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {registrosPozo.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap text-stone-800">
                    <div>{r.fecha}</div>
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

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setRegistroToDelete(r)}
                      className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar registro de extracción"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Flujometer Reading */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-700" />
                Registrar Lectura y Bombeo de Pozo Profundo
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
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
                  <label className="block text-stone-700 font-medium mb-1">Horas de Bombeo</label>
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
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-800 text-white rounded-lg font-semibold hover:bg-sky-900"
                >
                  Guardar Registro de Pozo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
