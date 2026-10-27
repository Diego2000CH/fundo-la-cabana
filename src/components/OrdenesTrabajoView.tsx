import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Calendar, 
  Trash2, 
  Check, 
  X, 
  Award,
  Edit2,
  Compass,
  Tractor,
  Package
} from 'lucide-react';
import { 
  Parcela, 
  InsumoInventario, 
  UsuarioPredio, 
  OrdenTrabajoFitosanitaria,
  DestinoAplicacion 
} from '../types/campo';

interface OrdenesTrabajoViewProps {
  ordenes: OrdenTrabajoFitosanitaria[];
  parcelas: Parcela[];
  inventario: InsumoInventario[];
  usuarios: UsuarioPredio[];
  activeUser?: UsuarioPredio;
  onAddOrden: (orden: OrdenTrabajoFitosanitaria) => void;
  onUpdateOrden?: (orden: OrdenTrabajoFitosanitaria) => void;
  onExecuteOrden: (ordenId: string, aplicadorNombre: string, firma: string) => void;
  onDeleteOrden: (ordenId: string) => void;
}

export const OrdenesTrabajoView: React.FC<OrdenesTrabajoViewProps> = ({
  ordenes = [],
  parcelas = [],
  inventario = [],
  usuarios = [],
  activeUser,
  onAddOrden,
  onUpdateOrden,
  onExecuteOrden,
  onDeleteOrden
}) => {
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrdenItem, setEditingOrdenItem] = useState<OrdenTrabajoFitosanitaria | null>(null);

  // Estados del Formulario (MAQUINARIA TOTALMENTE VACÍA POR DEFECTO)
  const [parcelaId, setParcelaId] = useState(parcelas[0]?.id || '');
  const [destinoAplicacion, setDestinoAplicacion] = useState<DestinoAplicacion>('Huerto de Kiwi');
  const [fechaProgramada, setFechaProgramada] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [plagaObjetivo, setPlagaObjetivo] = useState('Control Fitosanitario / Preventivo');
  
  // Producto
  const [insumoId, setInsumoId] = useState(inventario[0]?.id || '');
  const [productoManual, setProductoManual] = useState('');
  const [materiaActivaManual, setMateriaActivaManual] = useState('');
  const [registroSAGManual, setRegistroSAGManual] = useState('');

  const [dosisPorHa, setDosisPorHa] = useState<number>(1.5);
  const [unidadDosis, setUnidadDosis] = useState<'L/ha' | 'kg/ha' | 'cc/100L' | 'g/100L'>('kg/ha');
  const [mojamientoLHa, setMojamientoLHa] = useState<number>(1200);
  const [plazoReingreso, setPlazoReingreso] = useState<number>(24);
  const [plazoCarencia, setPlazoCarencia] = useState<number>(14);

  // MAQUINARIA / TRACTOR VACÍO POR DEFECTO
  const [maquinaria, setMaquinaria] = useState('');

  const [condicionesClima, setCondicionesClima] = useState('Viento menor a 8 km/h, sin pronóstico de lluvia');
  const [observaciones, setObservaciones] = useState('');
  const [aplicadorId, setAplicadorId] = useState(usuarios[0]?.id || '');

  // Modal para confirmar ejecución
  const [executingOrden, setExecutingOrden] = useState<OrdenTrabajoFitosanitaria | null>(null);
  const [execFirmaAplicador, setExecFirmaAplicador] = useState('');

  // Cuartel y Hectáreas seguras
  const selectedParcela = parcelas.find(p => p.id === parcelaId);
  const ha = selectedParcela ? (selectedParcela.superficieHa || 1) : 1;
  const caldoTotal = Math.round(Number(mojamientoLHa || 1000) * ha);
  const totalProducto = Number((Number(dosisPorHa || 0) * ha).toFixed(2));
  const selectedInsumo = inventario.find(i => i.id === insumoId);

  // Filtrado
  const filteredOrdenes = (ordenes || []).filter(o => {
    if (filterEstado === 'all') return true;
    return o.estado === filterEstado;
  });

  const ordenesPendientes = (ordenes || []).filter(o => o.estado === 'emitida' || o.estado === 'en_ejecucion').length;
  const ordenesCompletadas = (ordenes || []).filter(o => o.estado === 'completada').length;

  const openNewModal = () => {
    setEditingOrdenItem(null);
    setParcelaId(parcelas[0]?.id || '');
    setDestinoAplicacion('Huerto de Kiwi');
    setFechaProgramada(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
    setPlagaObjetivo('Control Fitosanitario / Preventivo');
    setInsumoId(inventario[0]?.id || '');
    setProductoManual('');
    setMateriaActivaManual('');
    setRegistroSAGManual('');
    setDosisPorHa(1.5);
    setUnidadDosis('kg/ha');
    setMojamientoLHa(1200);
    setPlazoReingreso(24);
    setPlazoCarencia(14);
    setMaquinaria(''); // Vacío por defecto
    setCondicionesClima('Viento menor a 8 km/h, sin pronóstico de lluvia');
    setObservaciones('');
    setAplicadorId(usuarios[0]?.id || '');
    setIsModalOpen(true);
  };

  const openEditModal = (o: OrdenTrabajoFitosanitaria) => {
    setEditingOrdenItem(o);
    setParcelaId(o.parcelaId || parcelas[0]?.id || '');
    setDestinoAplicacion(o.destinoAplicacion || 'Huerto de Kiwi');
    setFechaProgramada(o.fechaProgramada);
    setPlagaObjetivo(o.plagaObjetivo);
    setInsumoId(o.insumoId || '');
    setProductoManual(o.productoComercial || '');
    setMateriaActivaManual(o.materiaActiva || '');
    setRegistroSAGManual(o.numeroRegistroSAG || '');
    setDosisPorHa(o.dosisPorHa);
    setUnidadDosis(o.unidadDosis);
    setMojamientoLHa(o.mojamientoLHa);
    setPlazoReingreso(o.plazoReingresoHoras);
    setPlazoCarencia(o.plazoCarenciaDias);
    setMaquinaria(o.maquinariaTractor || ''); // Mantiene lo que tú escribiste
    setCondicionesClima(o.condicionesClimaticasRequeridas || '');
    setObservaciones(o.observacionesTecnicas || '');
    setAplicadorId(o.aplicadorAsignadoId || usuarios[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parcelas.find(item => item.id === parcelaId);
    const ins = inventario.find(item => item.id === insumoId);
    const apl = usuarios.find(u => u.id === aplicadorId);

    const prodNombre = ins ? ins.nombreComercial : (productoManual.trim() || 'Producto Fitosanitario');
    const matActiva = ins ? ins.materiaActiva : (materiaActivaManual.trim() || 'Materia activa');
    const regSAG = ins ? (ins.numeroRegistroSAG || 'SAG') : (registroSAGManual.trim() || 'SAG');
    const uniProd = ins ? ins.unidad : (unidadDosis.startsWith('kg') ? 'kg' : 'L');

    const numOrden = editingOrdenItem 
      ? editingOrdenItem.numeroOrden 
      : `OT-2026-${(ordenes.length + 1).toString().padStart(3, '0')}`;

    const nuevaOrden: OrdenTrabajoFitosanitaria = {
      id: editingOrdenItem ? editingOrdenItem.id : `ot-${Date.now()}`,
      numeroOrden: numOrden,
      fechaEmision: editingOrdenItem ? editingOrdenItem.fechaEmision : new Date().toISOString().slice(0, 10),
      fechaProgramada,
      parcelaId: p ? p.id : 'parc-1',
      parcelaNombre: p ? p.nombre : 'Sector General',
      superficieTratarHa: ha,
      destinoAplicacion,
      estado: editingOrdenItem ? editingOrdenItem.estado : 'emitida',
      plagaObjetivo,
      insumoId: ins ? ins.id : undefined,
      productoComercial: prodNombre,
      materiaActiva: matActiva,
      numeroRegistroSAG: regSAG,
      dosisPorHa: Number(dosisPorHa),
      unidadDosis,
      mojamientoLHa: Number(mojamientoLHa),
      caldoTotalLitros: caldoTotal,
      totalProductoRequerido: totalProducto,
      unidadProducto: uniProd as any,
      plazoReingresoHoras: Number(plazoReingreso),
      plazoCarenciaDias: Number(plazoCarencia),
      eppObligatorio: [
        'Máscara respiratoria con filtro químico',
        'Buzo impermeable tipo Tyvek',
        'Guantes de nitrilo puño largo',
        'Botas de goma caña alta'
      ],
      condicionesClimaticasRequeridas: condicionesClima,
      agronomoEmisorId: activeUser?.id || 'usr-1',
      agronomoEmisorNombre: activeUser?.nombre || 'Ing. Agrónomo Fundo La Cabaña',
      agronomoRegistroSAG: activeUser?.numeroRegistroSAG || 'SAG-OFICIAL',
      agronomoFirmaDigital: `FIRMADO - ${activeUser?.nombre || 'Agrónomo'} (${new Date().toLocaleDateString('es-CL')})`,
      aplicadorAsignadoId: apl?.id,
      aplicadorAsignadoNombre: apl?.nombre || 'Aplicador Predio',
      maquinariaTractor: maquinaria.trim() || 'No especificada',
      descontadoInventario: editingOrdenItem ? editingOrdenItem.descontadoInventario : false,
      observacionesTecnicas: observaciones || undefined
    };

    if (editingOrdenItem && onUpdateOrden) {
      onUpdateOrden(nuevaOrden);
    } else if (editingOrdenItem) {
      onDeleteOrden(editingOrdenItem.id);
      onAddOrden(nuevaOrden);
    } else {
      onAddOrden(nuevaOrden);
    }

    setIsModalOpen(false);
  };

  const handleConfirmExecution = () => {
    if (!executingOrden) return;
    const firmaTexto = execFirmaAplicador.trim() 
      ? execFirmaAplicador 
      : `APLICACIÓN CONFORME - ${executingOrden.aplicadorAsignadoNombre || 'Carlos Manqui'} (${new Date().toLocaleDateString('es-CL')})`;
    
    onExecuteOrden(
      executingOrden.id, 
      executingOrden.aplicadorAsignadoNombre || 'Aplicador Predio', 
      firmaTexto
    );
    setExecutingOrden(null);
    setExecFirmaAplicador('');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-2xl text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-600/40">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            Recetas Agronómicas SAG · Buenas Prácticas
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Órdenes de Trabajo Fitosanitarias
          </h1>
          <p className="text-stone-300 max-w-2xl mt-1 text-[11px]">
            Prescripciones fitosanitarias con destino (Huerto, Casa patronal, Quinta frutal, Praderas), maquinaria libremente editable, carencias y descuento automático de bodega.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          + Emitir Nueva Receta Fitosanitaria
        </button>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-500">Total Recetas</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{ordenes.length}</div>
          <span className="text-[10px] text-stone-400">Temporada actual</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-amber-700">Pendientes</span>
          <div className="text-2xl font-extrabold text-amber-800 mt-1">{ordenesPendientes}</div>
          <span className="text-[10px] text-amber-700 font-semibold">Por aplicar en terreno</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-emerald-700">Completadas</span>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">{ordenesCompletadas}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Descontadas de bodega</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-500">Fundo</span>
          <div className="text-lg font-bold text-stone-900 mt-1 truncate">La Cabaña</div>
          <span className="text-[10px] text-stone-400">Kiwi Hayward</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex justify-between items-center p-3 bg-white rounded-xl border">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterEstado('all')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${filterEstado === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
          >
            Todas ({ordenes.length})
          </button>
          <button
            onClick={() => setFilterEstado('emitida')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center gap-1 ${filterEstado === 'emitida' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-900'}`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pendientes ({ordenesPendientes})
          </button>
          <button
            onClick={() => setFilterEstado('completada')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center gap-1 ${filterEstado === 'completada' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900'}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completadas ({ordenesCompletadas})
          </button>
        </div>

        <span className="text-stone-500">{filteredOrdenes.length} órdenes</span>
      </div>

      {/* Listado de Órdenes */}
      <div className="space-y-4">
        {filteredOrdenes.map((orden) => {
          const isCompleted = orden.estado === 'completada';

          return (
            <div 
              key={orden.id} 
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs p-5 space-y-4 ${
                isCompleted ? 'border-emerald-200' : 'border-amber-300 bg-amber-50/10'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg font-mono font-bold bg-stone-900 text-white text-xs">
                    {orden.numeroOrden}
                  </span>
                  <strong className="text-base text-stone-900">{orden.parcelaNombre}</strong>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-900 text-[11px] border border-blue-200">
                    📍 {orden.destinoAplicacion || 'Huerto de Kiwi'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    isCompleted ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {isCompleted ? '✓ Aplicación Realizada' : '⏳ Pendiente'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-500 flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    Fecha: <strong>{orden.fechaProgramada}</strong>
                  </span>

                  {/* BOTÓN EDITAR RECETA */}
                  <button
                    onClick={() => openEditModal(orden)}
                    className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer ml-1"
                    title="Editar receta fitosanitaria"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteOrden(orden.id)}
                    className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg cursor-pointer"
                    title="Eliminar orden"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detalles Agronómicos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-xl border text-xs">
                <div>
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Objetivo / Plaga</span>
                  <strong className="text-stone-900 text-sm block mt-0.5">{orden.plagaObjetivo}</strong>
                  <span className="text-stone-600 font-medium block mt-1 flex items-center gap-1">
                    <Tractor className="w-3.5 h-3.5 text-stone-500" />
                    <strong>Maquinaria:</strong> {orden.maquinariaTractor || 'No especificada'}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Producto Prescrito</span>
                  <strong className="text-emerald-950 text-sm block mt-0.5">{orden.productoComercial}</strong>
                  <span className="text-stone-600 block">{orden.materiaActiva}</span>
                  <span className="text-stone-400 font-mono text-[10px]">Reg: {orden.numeroRegistroSAG}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Dosis prescrita:</span>
                    <strong className="text-stone-900">{orden.dosisPorHa} {orden.unidadDosis}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Mojamiento:</span>
                    <strong>{orden.mojamientoLHa} L/ha</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-200 text-emerald-950 font-bold">
                    <span>Total a preparar:</span>
                    <span className="text-sm font-extrabold">{orden.totalProductoRequerido} {orden.unidadProducto} ({orden.caldoTotalLitros} L caldo)</span>
                  </div>
                </div>
              </div>

              {/* Botón de Ejecutar */}
              <div className="flex justify-between items-center pt-1">
                <div className="text-[11px] text-stone-500">
                  Carencia: <strong>{orden.plazoCarenciaDias} días</strong> · Reingreso (REI): <strong>{orden.plazoReingresoHoras} hrs</strong>
                </div>

                {!isCompleted ? (
                  <button
                    onClick={() => {
                      setExecutingOrden(orden);
                      setExecFirmaAplicador(`CONFORME - ${orden.aplicadorAsignadoNombre || 'Aplicador'} (${new Date().toLocaleDateString('es-CL')})`);
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    Confirmar Aplicación & Descontar Bodega
                  </button>
                ) : (
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {orden.aplicadorFirma || 'Aplicación Conforme Realizada'}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredOrdenes.length === 0 && (
          <div className="p-10 text-center bg-white rounded-2xl border text-stone-400">
            <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-stone-600">No hay recetas fitosanitarias en este estado.</p>
            <p className="text-[11px] mt-1">Haz clic en <strong>"+ Emitir Nueva Receta Fitosanitaria"</strong> para prescribir una labor.</p>
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR RECETA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border">
            <div className="px-6 py-4 border-b bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-300" />
                {editingOrdenItem ? `Editar Receta: ${editingOrdenItem.numeroOrden}` : 'Emitir Receta Fitosanitaria / Orden de Trabajo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              
              {/* DESTINO DE LA LABOR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-700" />
                    Destino de la Aplicación *
                  </label>
                  <select
                    value={destinoAplicacion}
                    onChange={(e) => setDestinoAplicacion(e.target.value as DestinoAplicacion)}
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-bold text-stone-900"
                  >
                    <option value="Huerto de Kiwi">🥝 Huerto de Kiwi (Cuarteles)</option>
                    <option value="Casa patronal">🏡 Casa patronal / Jardines</option>
                    <option value="Quinta frutal">🍎 Quinta frutal</option>
                    <option value="Control de praderas">🌾 Control de praderas / Cercos</option>
                    <option value="Vivero">🌱 Vivero de plantas</option>
                    <option value="Caminos y cercos">🚜 Caminos / Canales</option>
                    <option value="Otro destino">📍 Otro destino</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Cuartel Específico</label>
                  <select
                    value={parcelaId}
                    onChange={(e) => setParcelaId(e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-lg font-medium"
                  >
                    {parcelas.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} ({p.superficieHa} ha)</option>
                    ))}
                    {parcelas.length === 0 && <option value="general">Sector General (4.0 ha)</option>}
                  </select>
                </div>
              </div>

              {/* PRODUCTO (DESDE BODEGA O MANUAL) */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 space-y-3">
                <div>
                  <label className="block font-bold text-emerald-950 mb-1 flex items-center gap-1">
                    <Package className="w-4 h-4 text-emerald-700" />
                    Seleccionar Producto desde Bodega (Opcional)
                  </label>
                  <select
                    value={insumoId}
                    onChange={(e) => {
                      setInsumoId(e.target.value);
                      const ins = inventario.find(i => i.id === e.target.value);
                      if (ins) {
                        setProductoManual(ins.nombreComercial);
                        setMateriaActivaManual(ins.materiaActiva);
                        setRegistroSAGManual(ins.numeroRegistroSAG || '');
                        if (ins.unidad === 'kg' || ins.unidad === 'g') setUnidadDosis('kg/ha');
                        else setUnidadDosis('L/ha');
                      }
                    }}
                    className="w-full p-2.5 border border-emerald-300 rounded-lg bg-white"
                  >
                    <option value="">-- Seleccionar producto de bodega o escribir abajo --</option>
                    {inventario.map(i => (
                      <option key={i.id} value={i.id}>
                        [{i.categoria}] {i.nombreComercial} (Stock: {i.stockActual} {i.unidad})
                      </option>
                    ))}
                  </select>
                </div>

                {(!insumoId || inventario.length === 0) && (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold mb-0.5">Producto Comercial *</label>
                      <input
                        type="text"
                        required
                        value={productoManual}
                        onChange={(e) => setProductoManual(e.target.value)}
                        placeholder="Ej: Switch 62.5 WG"
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-0.5">Materia Activa</label>
                      <input
                        type="text"
                        value={materiaActivaManual}
                        onChange={(e) => setMateriaActivaManual(e.target.value)}
                        placeholder="Ej: Cyprodinil + Fludioxonil"
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-0.5">Reg. SAG</label>
                      <input
                        type="text"
                        value={registroSAGManual}
                        onChange={(e) => setRegistroSAGManual(e.target.value)}
                        placeholder="Ej: SAG-1944"
                        className="w-full p-2 border rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* DOSIS Y MOJAMIENTO */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dosis / Ha *</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={dosisPorHa}
                      onChange={(e) => setDosisPorHa(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border rounded-lg font-mono font-bold"
                    />
                    <select
                      value={unidadDosis}
                      onChange={(e: any) => setUnidadDosis(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                    >
                      <option value="kg/ha">kg/ha</option>
                      <option value="L/ha">L/ha</option>
                      <option value="cc/100L">cc/100L</option>
                      <option value="g/100L">g/100L</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mojamiento (L/ha) *</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={mojamientoLHa}
                    onChange={(e) => setMojamientoLHa(parseInt(e.target.value) || 1000)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Total a Preparar</label>
                  <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-lg font-extrabold text-emerald-950 text-center font-mono">
                    {totalProducto} {selectedInsumo?.unidad || (unidadDosis.startsWith('kg') ? 'kg' : 'L')} ({caldoTotal} L caldo)
                  </div>
                </div>
              </div>

              {/* MAQUINARIA / TRACTOR (SIN DATOS PREESTABLECIDOS - 100% LIBRE Y EDITABLE) */}
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                <label className="block font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                  <Tractor className="w-4 h-4 text-blue-700" />
                  Maquinaria / Tractor Utilizado (Opcional - Escribe tu equipo aquí)
                </label>
                <input
                  type="text"
                  value={maquinaria}
                  onChange={(e) => setMaquinaria(e.target.value)}
                  placeholder="Ej: Tractor John Deere + Nebulizadora 2000L (o dejar vacío)"
                  className="w-full p-2.5 border border-blue-300 rounded-lg text-xs bg-white text-stone-900 font-medium"
                />
                <span className="text-[10px] text-blue-800 mt-1 block">
                  *(Puedes escribir el tractor o pulverizador que utilizaste)*
                </span>
              </div>

              {/* PLAGA Y FECHA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Plaga o Motivo Agronómico *</label>
                  <input
                    type="text"
                    required
                    value={plagaObjetivo}
                    onChange={(e) => setPlagaObjetivo(e.target.value)}
                    placeholder="Ej: Botrytis / Psa / Polinización"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha Programada *</label>
                  <input
                    type="date"
                    required
                    value={fechaProgramada}
                    onChange={(e) => setFechaProgramada(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* SEGURIDAD */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Días de Carencia (Días)</label>
                  <input
                    type="number"
                    value={plazoCarencia}
                    onChange={(e) => setPlazoCarencia(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tiempo Reingreso REI (Horas)</label>
                  <input
                    type="number"
                    value={plazoReingreso}
                    onChange={(e) => setPlazoReingreso(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones Técnicas</label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Instrucciones de mezcla, velocidad tractor, calibración..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer">
                  {editingOrdenItem ? 'Guardar Cambios' : 'Emitir & Firmar Receta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EJECUTAR CON FIRMA */}
      {executingOrden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Confirmar Aplicación Fitosanitaria</h3>
            <p className="text-stone-600">
              Se registrará la aplicación de <strong>{executingOrden.productoComercial}</strong> en {executingOrden.destinoAplicacion} ({executingOrden.parcelaNombre}) y se descontará de bodega.
            </p>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Firma / Acreditación del Aplicador</label>
              <input
                type="text"
                value={execFirmaAplicador}
                onChange={(e) => setExecFirmaAplicador(e.target.value)}
                className="w-full p-2.5 border rounded-lg font-mono text-xs"
              />
            </div>

            <div className="pt-2 border-t flex justify-end gap-2">
              <button onClick={() => setExecutingOrden(null)} className="px-4 py-2 border rounded-lg cursor-pointer">
                Cancelar
              </button>
              <button onClick={handleConfirmExecution} className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg cursor-pointer">
                Confirmar & Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
