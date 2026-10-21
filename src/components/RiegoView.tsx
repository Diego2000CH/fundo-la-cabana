import React, { useState } from 'react';
import { 
  Waves, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  X,
  Droplet,
  Wheat,
  Clock,
  Compass
} from 'lucide-react';
import { RegistroRiegoSector, Parcela, TipoRiego, FuenteAguaRiego } from '../types/campo';

interface RiegoViewProps {
  riegos: RegistroRiegoSector[];
  parcelas: Parcela[];
  onAddRiego: (riego: RegistroRiegoSector) => void;
  onUpdateRiego: (riego: RegistroRiegoSector) => void;
  onDeleteRiego: (id: string) => void;
  activeUserName?: string;
}

export const RiegoView: React.FC<RiegoViewProps> = ({
  riegos,
  parcelas,
  onAddRiego,
  onUpdateRiego,
  onDeleteRiego,
  activeUserName = 'Regador'
}) => {
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRiego, setEditingRiego] = useState<RegistroRiegoSector | null>(null);
  const [riegoToDelete, setRiegoToDelete] = useState<RegistroRiegoSector | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form states
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [sectorDestino, setSectorDestino] = useState(parcelas[0]?.nombre || 'Huerto de Kiwi (Cuartel 1)');
  const [tipoRiego, setTipoRiego] = useState<TipoRiego>('Solo Riego por Goteo');
  const [fuenteAgua, setFuenteAgua] = useState<FuenteAguaRiego>('Tranque acumulador');
  const [duracionHoras, setDuracionHoras] = useState<number | ''>(4.0);
  const [volumenM3, setVolumenM3] = useState<number | ''>(250);
  
  // Campos exclusivos Fertirriego
  const [productoFertilizante, setProductoFertilizante] = useState('Nitrato de Calcio');
  const [dosisKgHa, setDosisKgHa] = useState<number | ''>(35);
  const [conductividadElectrica, setConductividadElectrica] = useState<number | ''>(1.4);
  const [phSolucion, setPhSolucion] = useState<number | ''>(5.8);
  
  const [operador, setOperador] = useState(activeUserName);
  const [observaciones, setObservaciones] = useState('');

  // Totales
  const totalHoras = riegos.reduce((acc, r) => acc + Number(r.duracionHoras || 0), 0);
  const totalM3 = riegos.reduce((acc, r) => acc + Number(r.volumenM3 || 0), 0);
  const totalLitros = totalM3 * 1000;
  const countFertirriego = riegos.filter(r => r.tipoRiego === 'Fertirriego').length;
  const countSoloGoteo = riegos.filter(r => r.tipoRiego === 'Solo Riego por Goteo').length;

  const filteredRiegos = riegos.filter(r => {
    if (filterTipo === 'all') return true;
    return r.tipoRiego === filterTipo;
  });

  const openNewModal = () => {
    setEditingRiego(null);
    setFecha(new Date().toISOString().slice(0, 10));
    setHoraInicio('08:00');
    setSectorDestino(parcelas[0]?.nombre || 'Huerto de Kiwi (Cuartel 1)');
    setTipoRiego('Solo Riego por Goteo');
    setFuenteAgua('Tranque acumulador');
    setDuracionHoras(4.0);
    setVolumenM3(250);
    setProductoFertilizante('Nitrato de Calcio');
    setDosisKgHa(35);
    setConductividadElectrica(1.4);
    setPhSolucion(5.8);
    setOperador(activeUserName);
    setObservaciones('');
    setIsModalOpen(true);
  };

  const openEditModal = (r: RegistroRiegoSector) => {
    setEditingRiego(r);
    setFecha(r.fecha);
    setHoraInicio(r.horaInicio);
    setSectorDestino(r.sectorDestino);
    setTipoRiego(r.tipoRiego);
    setFuenteAgua(r.fuenteAgua);
    setDuracionHoras(r.duracionHoras);
    setVolumenM3(r.volumenM3);
    setProductoFertilizante(r.productoFertilizante || '');
    setDosisKgHa(r.dosisKgHa ?? '');
    setConductividadElectrica(r.conductividadElectrica ?? '');
    setPhSolucion(r.phSolucion ?? '');
    setOperador(r.operador);
    setObservaciones(r.observaciones || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const m3 = Number(volumenM3) || 0;
    const lts = m3 * 1000;

    const data: RegistroRiegoSector = {
      id: editingRiego ? editingRiego.id : `rieg-${Date.now()}`,
      fecha,
      horaInicio,
      sectorDestino,
      tipoRiego,
      fuenteAgua,
      duracionHoras: Number(duracionHoras) || 0,
      volumenM3: m3,
      litrosTotales: lts,
      productoFertilizante: tipoRiego === 'Fertirriego' ? productoFertilizante : undefined,
      dosisKgHa: tipoRiego === 'Fertirriego' && dosisKgHa !== '' ? Number(dosisKgHa) : undefined,
      conductividadElectrica: tipoRiego === 'Fertirriego' && conductividadElectrica !== '' ? Number(conductividadElectrica) : undefined,
      phSolucion: tipoRiego === 'Fertirriego' && phSolucion !== '' ? Number(phSolucion) : undefined,
      operador: operador || activeUserName,
      observaciones: observaciones || undefined
    };

    if (editingRiego) {
      onUpdateRiego(data);
      showToast('Riego actualizado con éxito');
    } else {
      onAddRiego(data);
      showToast('Nuevo riego registrado con éxito');
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
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-1 border border-blue-200">
            <Waves className="w-3.5 h-3.5 text-blue-700" />
            Distribución Hídrica del Predio
          </div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Control de Riego y Fertirriego
          </h1>
          <p className="text-xs text-stone-500">
            Registro separado de riegos por goteo, fertirriego con nutrientes y fuentes de agua (tranque acumulador, canal o red)
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          + Registrar Riego / Fertirriego
        </button>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Horas Totales de Riego
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            {totalHoras.toFixed(1)} <span className="text-xs text-stone-500 font-normal">hrs</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">{riegos.length} eventos registrados</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
            Agua Distribuida
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-1">
            {totalM3.toLocaleString()} <span className="text-xs text-stone-500 font-normal">m³</span>
          </div>
          <p className="text-[11px] text-blue-700 font-mono font-bold mt-1">
            {totalLitros.toLocaleString()} Litros
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            Eventos con Fertirriego
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">
            {countFertirriego}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Con inyección de nutrientes</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
            Solo Riego por Goteo
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-800 mt-1">
            {countSoloGoteo}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Hidratación de mantención</p>
        </div>
      </div>

      {/* Filtros de Tipo de Riego */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-stone-200 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterTipo('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterTipo === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos los Riegos ({riegos.length})
          </button>
          <button
            onClick={() => setFilterTipo('Solo Riego por Goteo')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              filterTipo === 'Solo Riego por Goteo' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            Solo Goteo ({countSoloGoteo})
          </button>
          <button
            onClick={() => setFilterTipo('Fertirriego')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              filterTipo === 'Fertirriego' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Wheat className="w-3.5 h-3.5" />
            Fertirriego ({countFertirriego})
          </button>
        </div>

        <span className="text-xs text-stone-500">Mostrando {filteredRiegos.length} registros</span>
      </div>

      {/* Tabla de Riegos */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Fecha & Hora</th>
                <th className="py-3 px-4">Sector / Destino</th>
                <th className="py-3 px-4">Tipo de Riego</th>
                <th className="py-3 px-4">Fuente de Agua</th>
                <th className="py-3 px-4">Duración & Volumen</th>
                <th className="py-3 px-4">Nutrientes / Fertirriego</th>
                <th className="py-3 px-4">Regador</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRiegos.map((r) => {
                const esFertirriego = r.tipoRiego === 'Fertirriego';
                return (
                  <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      <div className="font-semibold text-stone-900">{r.fecha}</div>
                      <div className="text-[10px] text-stone-400">{r.horaInicio}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-800">
                      {r.sectorDestino}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        esFertirriego 
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                          : 'bg-blue-100 text-blue-900 border-blue-200'
                      }`}>
                        {r.tipoRiego}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {r.fuenteAgua}
                    </td>

                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      <div><strong>{r.duracionHoras} hrs</strong></div>
                      <div className="text-blue-900 font-bold">{r.volumenM3} m³ ({r.litrosTotales.toLocaleString()} L)</div>
                    </td>

                    <td className="py-3 px-4">
                      {esFertirriego ? (
                        <div className="space-y-0.5">
                          <strong className="text-emerald-900 block">{r.productoFertilizante}</strong>
                          <span className="text-[11px] text-stone-500 block">{r.dosisKgHa} kg/ha</span>
                          {r.conductividadElectrica && (
                            <span className="text-[10px] text-stone-400 block font-mono">CE: {r.conductividadElectrica} mS/cm · pH: {r.phSolucion}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Solo agua</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-stone-600">{r.operador}</td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                          title="Editar riego"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setRiegoToDelete(r)}
                          className="p-1.5 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                          title="Eliminar riego"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRiegos.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-stone-400">
                    No hay riegos registrados en esta categoría. Haz clic en <strong>"+ Registrar Riego / Fertirriego"</strong> para agregar el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NUEVO / EDITAR RIEGO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200 bg-blue-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-300" />
                {editingRiego ? 'Editar Registro de Riego' : 'Registrar Riego / Fertirriego'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              
              {/* TIPO DE RIEGO (TOGGLE DESTACADO) */}
              <div>
                <label className="block font-bold text-stone-800 mb-1.5 uppercase tracking-wide">
                  Modalidad de Riego *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoRiego('Solo Riego por Goteo')}
                    className={`p-3 rounded-xl border text-left font-bold cursor-pointer transition-all ${
                      tipoRiego === 'Solo Riego por Goteo'
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-400" />
                      <span>Solo Riego por Goteo</span>
                    </div>
                    <span className="text-[10px] font-normal block mt-1 opacity-80">
                      Hidratación con agua limpia
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoRiego('Fertirriego')}
                    className={`p-3 rounded-xl border text-left font-bold cursor-pointer transition-all ${
                      tipoRiego === 'Fertirriego'
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wheat className="w-4 h-4 text-emerald-300" />
                      <span>Fertirriego</span>
                    </div>
                    <span className="text-[10px] font-normal block mt-1 opacity-80">
                      Con inyección de fertilizantes / abonos
                    </span>
                  </button>
                </div>
              </div>

              {/* SECTOR DESTINO Y FUENTE DE AGUA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Sector / Cuartel Regado *
                  </label>
                  <select
                    value={sectorDestino}
                    onChange={(e) => setSectorDestino(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-lg font-bold text-stone-900"
                  >
                    {parcelas.map((p) => (
                      <option key={p.id} value={p.nombre}>{p.nombre} ({p.superficieHa} ha)</option>
                    ))}
                    <option value="Huerto de Kiwi (General)">Huerto de Kiwi (General)</option>
                    <option value="Casa patronal / Jardines">🏡 Casa patronal / Jardines</option>
                    <option value="Quinta frutal">🍎 Quinta frutal</option>
                    <option value="Control de praderas">🌾 Control de praderas</option>
                    <option value="Vivero">🌱 Vivero de plantas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Fuente del Agua *
                  </label>
                  <select
                    value={fuenteAgua}
                    onChange={(e) => setFuenteAgua(e.target.value as FuenteAguaRiego)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-lg font-medium text-stone-900"
                  >
                    <option value="Tranque acumulador">🌊 Tranque acumulador</option>
                    <option value="Canal de regadío">💧 Canal de regadío / Canalistas</option>
                    <option value="Red presurizada">⚙️ Red presurizada / Matriz</option>
                    <option value="Pozo profundo">🏗️ Pozo profundo</option>
                    <option value="Otra fuente">📍 Otra fuente</option>
                  </select>
                </div>
              </div>

              {/* CAMPOS SI ELIGIÓ FERTIRRIEGO */}
              {tipoRiego === 'Fertirriego' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 space-y-3">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Wheat className="w-4 h-4 text-emerald-700" />
                    Detalle de Fertilizantes Inyectados
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Producto Fertilizante / Nutriente *
                      </label>
                      <input
                        type="text"
                        required
                        value={productoFertilizante}
                        onChange={(e) => setProductoFertilizante(e.target.value)}
                        placeholder="Ej: Nitrato de Calcio / Sulfato de Potasio"
                        className="w-full p-2 border border-emerald-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Dosis (kg/ha o L/ha) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={dosisKgHa}
                        onChange={(e) => setDosisKgHa(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 border border-emerald-300 rounded-lg bg-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Conductividad (CE mS/cm)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={conductividadElectrica}
                        onChange={(e) => setConductividadElectrica(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 border border-stone-300 rounded-lg bg-white font-mono"
                        placeholder="Ej: 1.4"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">pH Solución</label>
                      <input
                        type="number"
                        step="0.1"
                        value={phSolucion}
                        onChange={(e) => setPhSolucion(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 border border-stone-300 rounded-lg bg-white font-mono"
                        placeholder="Ej: 5.8"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* HORAS Y VOLUMEN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duración del Riego (Horas) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={duracionHoras}
                    onChange={(e) => setDuracionHoras(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Volumen Estimado (m³) *</label>
                  <input
                    type="number"
                    required
                    value={volumenM3}
                    onChange={(e) => setVolumenM3(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    = {(Number(volumenM3 || 0) * 1000).toLocaleString()} Litros
                  </span>
                </div>
              </div>

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
                  <label className="block font-semibold text-stone-700 mb-1">Regador / Operador</label>
                  <input
                    type="text"
                    value={operador}
                    onChange={(e) => setOperador(e.target.value)}
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
                  placeholder="Detalles sobre presión de goteros, lavado de matriz..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg cursor-pointer hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800 text-white font-bold rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Guardar Riego
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {riegoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 border border-stone-200 space-y-3">
            <h3 className="font-bold text-sm text-stone-900">¿Eliminar registro de riego?</h3>
            <p className="text-stone-600">
              Se eliminará el riego de <strong>{riegoToDelete.duracionHoras} hrs ({riegoToDelete.volumenM3} m³)</strong> en {riegoToDelete.sectorDestino}.
            </p>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setRiegoToDelete(null)} className="px-4 py-2 border rounded-lg cursor-pointer">
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteRiego(riegoToDelete.id);
                  showToast('Riego eliminado');
                  setRiegoToDelete(null);
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
