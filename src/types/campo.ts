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
  Sliders,
  Settings2
} from 'lucide-react';
import { RegistroRiegoSector, SectorRiegoConfig, TipoRiego, FuenteAguaRiego } from '../types/campo';

interface RiegoViewProps {
  riegos: RegistroRiegoSector[];
  sectoresConfig?: SectorRiegoConfig[];
  onUpdateSectoresConfig?: (sectores: SectorRiegoConfig[]) => void;
  onAddRiego: (riego: RegistroRiegoSector) => void;
  onUpdateRiego: (riego: RegistroRiegoSector) => void;
  onDeleteRiego: (id: string) => void;
  activeUserName?: string;
}

// LOS 4 SECTORES DE RIEGO OFICIALES (SUMAN 13.1 HA)
const SECTORES_INICIALES: SectorRiegoConfig[] = [
  { id: 'sec-1', nombre: 'Sector de Riego 1', superficieHa: 3.8, descripcion: 'Lado Norte (3.8 ha)' },
  { id: 'sec-2', nombre: 'Sector de Riego 2', superficieHa: 3.2, descripcion: 'Lado Este (3.2 ha)' },
  { id: 'sec-3', nombre: 'Sector de Riego 3', superficieHa: 3.5, descripcion: 'Lado Sur (3.5 ha)' },
  { id: 'sec-4', nombre: 'Sector de Riego 4', superficieHa: 2.6, descripcion: 'Lado Poniente (2.6 ha)' }
];

export const RiegoView: React.FC<RiegoViewProps> = ({
  riegos,
  sectoresConfig = SECTORES_INICIALES,
  onUpdateSectoresConfig,
  onAddRiego,
  onUpdateRiego,
  onDeleteRiego,
  activeUserName = 'Regador'
}) => {
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [sectores, setSectores] = useState<SectorRiegoConfig[]>(sectoresConfig);

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingRiego, setEditingRiego] = useState<RegistroRiegoSector | null>(null);
  const [riegoToDelete, setRiegoToDelete] = useState<RegistroRiegoSector | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Estados del Formulario de Riego
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [selectedSectorId, setSelectedSectorId] = useState<string>(sectores[0]?.id || 'sec-1');
  const [tipoRiego, setTipoRiego] = useState<TipoRiego>('Solo Riego por Goteo');
  const [fuenteAgua, setFuenteAgua] = useState<FuenteAguaRiego>('Tranque acumulador');
  const [duracionHoras, setDuracionHoras] = useState<number | ''>(4.0);
  const [volumenM3, setVolumenM3] = useState<number | ''>(250);
  
  // Campos Fertirriego
  const [productoFertilizante, setProductoFertilizante] = useState('Nitrato de Calcio');
  const [dosisKgHa, setDosisKgHa] = useState<number | ''>(35);
  const [conductividadElectrica, setConductividadElectrica] = useState<number | ''>(1.4);
  const [phSolucion, setPhSolucion] = useState<number | ''>(5.8);
  const [operador, setOperador] = useState(activeUserName);
  const [observaciones, setObservaciones] = useState('');

  // Sector seleccionado actual
  const currentSector = sectores.find(s => s.id === selectedSectorId) || sectores[0];
  const sectorHa = currentSector ? currentSector.superficieHa : 3.8;

  // CÁLCULOS AUTOMÁTICOS
  // 1. Lámina de agua (mm): m³ / (10 * ha)
  const laminaCalculadaMm = (volumenM3 !== '' && sectorHa > 0) 
    ? Number((Number(volumenM3) / (10 * sectorHa)).toFixed(2)) 
    : 0;

  // 2. Total kilos fertilizante en fertirriego: dosisKgHa * ha
  const totalKilosFertilizante = (dosisKgHa !== '' && sectorHa > 0) 
    ? Number((Number(dosisKgHa) * sectorHa).toFixed(1)) 
    : 0;

  // Totales generales
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
    setSelectedSectorId(sectores[0]?.id || 'sec-1');
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
    setSelectedSectorId(r.sectorId || sectores[0]?.id || 'sec-1');
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
      sectorId: currentSector.id,
      sectorDestino: currentSector.nombre,
      superficieHa: sectorHa,
      tipoRiego,
      fuenteAgua,
      duracionHoras: Number(duracionHoras) || 0,
      volumenM3: m3,
      litrosTotales: lts,
      laminaMm: laminaCalculadaMm,
      productoFertilizante: tipoRiego === 'Fertirriego' ? productoFertilizante : undefined,
      dosisKgHa: tipoRiego === 'Fertirriego' && dosisKgHa !== '' ? Number(dosisKgHa) : undefined,
      totalFertilizanteKg: tipoRiego === 'Fertirriego' ? totalKilosFertilizante : undefined,
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
      showToast('Nuevo riego registrado en el sector');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-xs">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-1 border border-blue-200">
            <Waves className="w-3.5 h-3.5 text-blue-700" />
            4 Sectores de Riego
          </div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Control de Riego y Fertirriego por Sectores
          </h1>
          <p className="text-stone-500">
            El riego se realiza hacia 4 sectores con hectariaje diferenciado. Cálculo automático de lámina (mm) y fertilizantes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-stone-300"
            title="Ajustar hectáreas de los 4 sectores de riego"
          >
            <Sliders className="w-3.5 h-3.5 text-stone-600" />
            <span>Dimensiones de los 4 Sectores</span>
          </button>

          <button
            onClick={openNewModal}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            + Registrar Riego al Sector
          </button>
        </div>
      </div>

      {/* TARJETAS RESUMEN DE LOS 4 SECTORES DE RIEGO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sectores.map((sec, idx) => {
          const riegosDelSector = riegos.filter(r => r.sectorId === sec.id || r.sectorDestino.includes(sec.nombre));
          const m3Sector = riegosDelSector.reduce((a, b) => a + Number(b.volumenM3 || 0), 0);

          return (
            <div key={sec.id} className="p-4 bg-white rounded-2xl border border-blue-200/80 shadow-2xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-950 text-xs">{sec.nombre}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                  {sec.superficieHa} ha
                </span>
              </div>
              <div className="text-xl font-extrabold text-stone-900 font-mono mt-1">
                {m3Sector.toLocaleString()} <span className="text-xs text-stone-500 font-normal">m³</span>
              </div>
              <p className="text-[10px] text-stone-400">
                {riegosDelSector.length} riegos registrados
              </p>
            </div>
          );
        })}
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
          <span className="text-stone-500 font-bold block text-[10px] uppercase">Horas Totales Riego</span>
          <span className="text-xl font-bold font-mono text-stone-900">{totalHoras.toFixed(1)} hrs</span>
        </div>
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
          <span className="text-stone-500 font-bold block text-[10px] uppercase">Volumen Total</span>
          <span className="text-xl font-bold font-mono text-blue-900">{totalM3.toLocaleString()} m³ ({totalLitros.toLocaleString()} L)</span>
        </div>
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
          <span className="text-stone-500 font-bold block text-[10px] uppercase">Eventos Fertirriego</span>
          <span className="text-xl font-bold font-mono text-emerald-800">{countFertirriego} eventos</span>
        </div>
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
          <span className="text-stone-500 font-bold block text-[10px] uppercase">Solo Goteo (Agua)</span>
          <span className="text-xl font-bold font-mono text-sky-800">{countSoloGoteo} eventos</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex justify-between items-center p-3 bg-white rounded-xl border">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterTipo('all')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${filterTipo === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
          >
            Todos ({riegos.length})
          </button>
          <button
            onClick={() => setFilterTipo('Solo Riego por Goteo')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center gap-1 ${filterTipo === 'Solo Riego por Goteo' ? 'bg-blue-800 text-white' : 'bg-blue-50 text-blue-900'}`}
          >
            <Droplet className="w-3.5 h-3.5" />
            Solo Goteo ({countSoloGoteo})
          </button>
          <button
            onClick={() => setFilterTipo('Fertirriego')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center gap-1 ${filterTipo === 'Fertirriego' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900'}`}
          >
            <Wheat className="w-3.5 h-3.5" />
            Fertirriego ({countFertirriego})
          </button>
        </div>
        <span className="text-stone-500">{filteredRiegos.length} registros</span>
      </div>

      {/* Tabla de Riegos por Sector */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b text-stone-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Fecha & Hora</th>
                <th className="p-3">Sector de Riego</th>
                <th className="p-3">Superficie</th>
                <th className="p-3">Modalidad</th>
                <th className="p-3">Fuente Agua</th>
                <th className="p-3">Horas / m³</th>
                <th className="p-3">Lámina mm</th>
                <th className="p-3">Fertirriego (Nutrientes)</th>
                <th className="p-3">Regador</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRiegos.map((r) => {
                const esFertirriego = r.tipoRiego === 'Fertirriego';
                return (
                  <tr key={r.id} className="hover:bg-stone-50/70">
                    <td className="p-3 font-mono">{r.fecha} {r.horaInicio}</td>
                    <td className="p-3 font-bold text-stone-900">{r.sectorDestino}</td>
                    <td className="p-3 font-mono">{r.superficieHa} ha</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        esFertirriego ? 'bg-emerald-100 text-emerald-950' : 'bg-blue-100 text-blue-950'
                      }`}>
                        {r.tipoRiego}
                      </span>
                    </td>
                    <td className="p-3 text-stone-600">{r.fuenteAgua}</td>
                    <td className="p-3 font-mono font-bold text-blue-950">{r.duracionHoras} hrs ({r.volumenM3} m³)</td>
                    <td className="p-3 font-mono font-bold text-sky-800">{r.laminaMm || '-'} mm</td>
                    <td className="p-3">
                      {esFertirriego ? (
                        <div>
                          <strong className="text-emerald-950 block">{r.productoFertilizante}</strong>
                          <span className="text-[10px] text-stone-500 font-mono">Dosis: {r.dosisKgHa} kg/ha (Total: {r.totalFertilizanteKg} kg)</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Solo agua</span>
                      )}
                    </td>
                    <td className="p-3 text-stone-700">{r.operador}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button onClick={() => openEditModal(r)} className="p-1 text-blue-700 hover:bg-blue-50 rounded cursor-pointer mr-1">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setRiegoToDelete(r)} className="p-1 text-red-700 hover:bg-red-50 rounded cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredRiegos.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-stone-400">
                    No hay riegos registrados. Haz clic en <strong>"+ Registrar Riego al Sector"</strong> para ingresar el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NUEVO / EDITAR RIEGO AL SECTOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border">
            <div className="px-6 py-4 border-b bg-blue-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-300" />
                {editingRiego ? 'Editar Riego del Sector' : 'Registrar Riego a Sector Específico'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-200 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              
              {/* SELECTOR DE LOS 4 SECTORES DE RIEGO */}
              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                <label className="block font-bold text-blue-950 uppercase">
                  Sector de Riego Destino *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sectores.map((sec) => (
                    <button
                      type="button"
                      key={sec.id}
                      onClick={() => setSelectedSectorId(sec.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedSectorId === sec.id 
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs' 
                          : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <strong className="block text-xs">{sec.nombre}</strong>
                      <span className={`text-[10px] block mt-0.5 ${selectedSectorId === sec.id ? 'text-blue-200' : 'text-stone-500'}`}>
                        Superficie: <strong>{sec.superficieHa} ha</strong>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* MODALIDAD */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">Modalidad de Riego *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoRiego('Solo Riego por Goteo')}
                    className={`p-3 rounded-xl border text-left font-bold cursor-pointer ${
                      tipoRiego === 'Solo Riego por Goteo' ? 'bg-blue-900 text-white border-blue-900' : 'bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-400" />
                      <span>Solo Riego por Goteo</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoRiego('Fertirriego')}
                    className={`p-3 rounded-xl border text-left font-bold cursor-pointer ${
                      tipoRiego === 'Fertirriego' ? 'bg-emerald-900 text-white border-emerald-900' : 'bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wheat className="w-4 h-4 text-emerald-300" />
                      <span>Fertirriego (Con Abono)</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* FUENTE DE AGUA Y DURACIÓN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fuente del Agua *</label>
                  <select value={fuenteAgua} onChange={(e) => setFuenteAgua(e.target.value as FuenteAguaRiego)} className="w-full p-2.5 bg-white border rounded-lg">
                    <option value="Tranque acumulador">🌊 Tranque acumulador</option>
                    <option value="Canal de regadío">💧 Canal de regadío / Canalistas</option>
                    <option value="Red presurizada">⚙️ Red presurizada / Matriz</option>
                    <option value="Pozo profundo">🏗️ Pozo profundo</option>
                    <option value="Otra fuente">📍 Otra fuente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duración (Horas) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={duracionHoras}
                    onChange={(e) => setDuracionHoras(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg font-bold"
                  />
                </div>
              </div>

              {/* VOLUMEN Y LÁMINA CALCULADA */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Volumen Estimado (m³) *</label>
                  <input
                    type="number"
                    required
                    value={volumenM3}
                    onChange={(e) => setVolumenM3(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-bold bg-white"
                  />
                </div>

                <div>
                  <span className="block font-semibold text-stone-500 mb-1">Lámina de Agua Calculada:</span>
                  <div className="text-xl font-extrabold text-blue-900 font-mono mt-1">
                    {laminaCalculadaMm} mm
                  </div>
                  <span className="text-[10px] text-stone-500">Para {sectorHa} hectáreas del sector</span>
                </div>
              </div>

              {/* DETALLE FERTIRRIEGO */}
              {tipoRiego === 'Fertirriego' && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 space-y-3">
                  <strong className="text-emerald-950 block">Inyección de Fertilizante en {currentSector.nombre}</strong>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Producto / Abono *</label>
                      <input
                        type="text"
                        required
                        value={productoFertilizante}
                        onChange={(e) => setProductoFertilizante(e.target.value)}
                        placeholder="Ej: Nitrato de Calcio"
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Dosis (kg/ha) *</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={dosisKgHa}
                        onChange={(e) => setDosisKgHa(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 border rounded-lg bg-white font-bold"
                      />
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded border border-emerald-200 text-[11px] text-emerald-900 flex justify-between items-center font-bold">
                    <span>Abono Total a Disolver en Estanque:</span>
                    <span className="text-sm font-extrabold font-mono text-emerald-950">{totalKilosFertilizante} kg</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha *</label>
                  <input type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full p-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Regador / Operador</label>
                  <input type="text" value={operador} onChange={(e) => setOperador(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones</label>
                <textarea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Presión de goteros, lavado de matriz..." className="w-full p-2 border rounded-lg" />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-blue-800 text-white font-bold rounded-lg cursor-pointer">Guardar Riego</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURAR DIMENSIONES DE LOS 4 SECTORES */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <Settings2 className="w-4 h-4 text-blue-700" />
                Hectáreas de los 4 Sectores de Riego
              </h3>
              <button onClick={() => setIsConfigModalOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-stone-500 text-[11px]">
              Ajusta el hectariaje exacto de cada sector. Se usarán para calcular las dosis de fertilizante y la lámina de agua ($mm$).
            </p>

            <div className="space-y-3">
              {sectores.map((sec, i) => (
                <div key={sec.id} className="flex justify-between items-center p-2.5 bg-stone-50 rounded-xl border">
                  <div>
                    <strong className="block text-stone-900">{sec.nombre}</strong>
                    <span className="text-[10px] text-stone-400">{sec.descripcion || ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={sec.superficieHa}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0.1;
                        const copy = [...sectores];
                        copy[i].superficieHa = val;
                        setSectores(copy);
                        if (onUpdateSectoresConfig) onUpdateSectoresConfig(copy);
                      }}
                      className="w-20 p-1.5 border rounded font-mono font-bold text-right bg-white"
                    />
                    <span className="font-bold">ha</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50 rounded-xl flex justify-between items-center font-bold text-blue-950">
              <span>Superficie Total Regada:</span>
              <span className="font-mono text-sm">{sectores.reduce((a, b) => a + Number(b.superficieHa), 0).toFixed(1)} ha</span>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setIsConfigModalOpen(false)} className="px-4 py-2 bg-stone-900 text-white font-bold rounded-lg cursor-pointer">
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {riegoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 border space-y-3">
            <h3 className="font-bold text-sm text-stone-900">¿Eliminar registro de riego?</h3>
            <p className="text-stone-600">Se eliminará el riego de <strong>{riegoToDelete.duracionHoras} hrs ({riegoToDelete.volumenM3} m³)</strong> en {riegoToDelete.sectorDestino}.</p>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setRiegoToDelete(null)} className="px-4 py-2 border rounded-lg cursor-pointer">Cancelar</button>
              <button onClick={() => { onDeleteRiego(riegoToDelete.id); showToast('Riego eliminado'); setRiegoToDelete(null); }} className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg cursor-pointer">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
