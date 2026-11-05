import React, { useState } from 'react';
import { 
  FileText, Plus, CheckCircle2, Clock, Trash2, Check, X, Award, Edit2, Compass, Tractor, Package, MapPin, Calculator
} from 'lucide-react';
import { 
  Parcela, InsumoInventario, UsuarioPredio, OrdenTrabajoFitosanitaria, DestinoAplicacion, ProductoOrden 
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

  // Estados del Formulario
  const [parcelaIds, setParcelaIds] = useState<string[]>([]); // Múltiples cuarteles
  const [destinoAplicacion, setDestinoAplicacion] = useState<DestinoAplicacion>('Huerto de Kiwi');
  const [fechaProgramada, setFechaProgramada] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [plagaObjetivo, setPlagaObjetivo] = useState('Control Fitosanitario / Preventivo');
  
  // Múltiples Productos
  const [productos, setProductos] = useState<ProductoOrden[]>([]);

  // Otros campos
  const [mojamientoLHa, setMojamientoLHa] = useState<number>(1200);
  const [plazoReingreso, setPlazoReingreso] = useState<number>(24);
  const [plazoCarencia, setPlazoCarencia] = useState<number>(14);
  const [maquinaria, setMaquinaria] = useState('');
  const [condicionesClima, setCondicionesClima] = useState('Viento menor a 8 km/h, sin pronóstico de lluvia');
  const [observaciones, setObservaciones] = useState('');
  const [aplicadorId, setAplicadorId] = useState(usuarios[0]?.id || '');

  // Modal para confirmar ejecución
  const [executingOrden, setExecutingOrden] = useState<OrdenTrabajoFitosanitaria | null>(null);
  const [execFirmaAplicador, setExecFirmaAplicador] = useState('');

  // Cálculos de Hectáreas (Suma de múltiples cuarteles)
  const selectedParcelas = parcelas.filter(p => parcelaIds.includes(p.id));
  const ha = selectedParcelas.reduce((sum, p) => sum + (p.superficieHa || 0), 0) || 1;
  const caldoTotal = Math.round(Number(mojamientoLHa || 1000) * ha);

  // Funciones para manejar el arreglo de productos
  const agregarProducto = () => {
    setProductos([...productos, {
      productoComercial: '', materiaActiva: '', numeroRegistroSAG: '', dosisPorHa: 1, unidadDosis: 'kg/ha', totalProductoRequerido: 0, unidadProducto: 'kg'
    }]);
  };

  const eliminarProducto = (index: number) => {
    const nuevos = [...productos];
    nuevos.splice(index, 1);
    setProductos(nuevos);
  };

  const actualizarProducto = (index: number, campo: keyof ProductoOrden, valor: any) => {
    const nuevos = [...productos];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    
    // Autocompletar si se selecciona de bodega
    if (campo === 'insumoId') {
      const ins = inventario.find(i => i.id === valor);
      if (ins) {
        nuevos[index].productoComercial = ins.nombreComercial;
        nuevos[index].materiaActiva = ins.materiaActiva;
        nuevos[index].numeroRegistroSAG = ins.numeroRegistroSAG || '';
        nuevos[index].unidadDosis = ins.unidad === 'kg' || ins.unidad === 'g' ? 'kg/ha' : 'L/ha';
        nuevos[index].unidadProducto = ins.unidad;
      }
    }
    
    // Calcular total requerido dinámicamente
    nuevos[index].totalProductoRequerido = Number((nuevos[index].dosisPorHa * ha).toFixed(2));
    setProductos(nuevos);
  };

  const toggleParcela = (id: string) => {
    if (parcelaIds.includes(id)) {
      setParcelaIds(parcelaIds.filter(pId => pId !== id));
    } else {
      setParcelaIds([...parcelaIds, id]);
    }
  };

  const filteredOrdenes = (ordenes || []).filter(o => filterEstado === 'all' || o.estado === filterEstado);
  const ordenesPendientes = (ordenes || []).filter(o => o.estado === 'emitida' || o.estado === 'en_ejecucion').length;
  const ordenesCompletadas = (ordenes || []).filter(o => o.estado === 'completada').length;

  const openNewModal = () => {
    setEditingOrdenItem(null);
    setParcelaIds(parcelas.length > 0 ? [parcelas[0].id] : []);
    setDestinoAplicacion('Huerto de Kiwi');
    setFechaProgramada(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
    setPlagaObjetivo('Control Fitosanitario / Preventivo');
    setProductos([{ productoComercial: '', materiaActiva: '', numeroRegistroSAG: '', dosisPorHa: 1.5, unidadDosis: 'kg/ha', totalProductoRequerido: 0, unidadProducto: 'kg' }]);
    setMojamientoLHa(1200);
    setPlazoReingreso(24);
    setPlazoCarencia(14);
    setMaquinaria('');
    setCondicionesClima('Viento menor a 8 km/h, sin pronóstico de lluvia');
    setObservaciones('');
    setAplicadorId(usuarios[0]?.id || '');
    setIsModalOpen(true);
  };

  const openEditModal = (o: OrdenTrabajoFitosanitaria) => {
    setEditingOrdenItem(o);
    setParcelaIds(o.parcelaIds || []);
    setDestinoAplicacion(o.destinoAplicacion || 'Huerto de Kiwi');
    setFechaProgramada(o.fechaProgramada);
    setPlagaObjetivo(o.plagaObjetivo);
    setProductos(o.productos || []);
    setMojamientoLHa(o.mojamientoLHa);
    setPlazoReingreso(o.plazoReingresoHoras);
    setPlazoCarencia(o.plazoCarenciaDias);
    setMaquinaria(o.maquinariaTractor || '');
    setCondicionesClima(o.condicionesClimaticasRequeridas || '');
    setObservaciones(o.observacionesTecnicas || '');
    setAplicadorId(o.aplicadorAsignadoId || usuarios[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parcelaIds.length === 0) return alert("Selecciona al menos un cuartel.");
    if (productos.length === 0 || !productos[0].productoComercial) return alert("Agrega al menos un producto.");

    const apl = usuarios.find(u => u.id === aplicadorId);
    const nombresParcelas = selectedParcelas.map(p => p.nombre).join(', ');
    const numOrden = editingOrdenItem ? editingOrdenItem.numeroOrden : `OT-2026-${(ordenes.length + 1).toString().padStart(3, '0')}`;

    const nuevaOrden: OrdenTrabajoFitosanitaria = {
      id: editingOrdenItem ? editingOrdenItem.id : `ot-${Date.now()}`,
      numeroOrden: numOrden,
      fechaEmision: editingOrdenItem ? editingOrdenItem.fechaEmision : new Date().toISOString().slice(0, 10),
      fechaProgramada,
      parcelaIds,
      parcelaNombres: nombresParcelas,
      superficieTratarHa: ha,
      destinoAplicacion,
      estado: editingOrdenItem ? editingOrdenItem.estado : 'emitida',
      plagaObjetivo,
      productos,
      mojamientoLHa: Number(mojamientoLHa),
      caldoTotalLitros: caldoTotal,
      plazoReingresoHoras: Number(plazoReingreso),
      plazoCarenciaDias: Number(plazoCarencia),
      eppObligatorio: ['Máscara respiratoria con filtro químico', 'Buzo impermeable tipo Tyvek', 'Guantes de nitrilo puño largo', 'Botas de goma caña alta'],
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
    const firmaTexto = execFirmaAplicador.trim() || `APLICACIÓN CONFORME - ${executingOrden.aplicadorAsignadoNombre || 'Aplicador'} (${new Date().toLocaleDateString('es-CL')})`;
    onExecuteOrden(executingOrden.id, executingOrden.aplicadorAsignadoNombre || 'Aplicador', firmaTexto);
    setExecutingOrden(null);
    setExecFirmaAplicador('');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-2xl text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-600/40">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            Recetas Agronómicas SAG · Multi-Producto
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Órdenes de Trabajo</h1>
          <p className="text-stone-300 max-w-2xl mt-1 text-[11px]">
            Prescripciones fitosanitarias con múltiples cuarteles, múltiples productos por aplicación y descuento automático de bodega.
          </p>
        </div>
        <button onClick={openNewModal} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer">
          <Plus className="w-4 h-4" /> + Emitir Nueva Receta
        </button>
      </div>

      {/* TARJETAS KPI Y FILTROS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-xl border shadow-2xs"><span className="text-[10px] font-bold uppercase text-stone-500">Total Recetas</span><div className="text-2xl font-extrabold text-stone-900">{ordenes.length}</div></div>
        <div className="p-4 bg-white rounded-xl border shadow-2xs"><span className="text-[10px] font-bold uppercase text-amber-700">Pendientes</span><div className="text-2xl font-extrabold text-amber-800">{ordenesPendientes}</div></div>
        <div className="p-4 bg-white rounded-xl border shadow-2xs"><span className="text-[10px] font-bold uppercase text-emerald-700">Completadas</span><div className="text-2xl font-extrabold text-emerald-800">{ordenesCompletadas}</div></div>
        <div className="p-4 bg-white rounded-xl border shadow-2xs"><span className="text-[10px] font-bold uppercase text-stone-500">Fundo</span><div className="text-lg font-bold text-stone-900 mt-1 truncate">La Cabaña</div></div>
      </div>

      <div className="flex justify-between items-center p-3 bg-white rounded-xl border">
        <div className="flex gap-2">
          <button onClick={() => setFilterEstado('all')} className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${filterEstado === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}>Todas ({ordenes.length})</button>
          <button onClick={() => setFilterEstado('emitida')} className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center gap-1 ${filterEstado === 'emitida' ? 'bg-amber-700 text-white' : 'bg-amber-50'}`}><Clock className="w-3.5 h-3.5" /> Pendientes ({ordenesPendientes})</button>
          <button onClick={() => setFilterEstado('completada')} className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center gap-1 ${filterEstado === 'completada' ? 'bg-emerald-800 text-white' : 'bg-emerald-50'}`}><CheckCircle2 className="w-3.5 h-3.5" /> Completadas ({ordenesCompletadas})</button>
        </div>
      </div>

      {/* LISTADO DE ORDENES */}
      <div className="space-y-4">
        {filteredOrdenes.map((orden) => {
          const isCompleted = orden.estado === 'completada';
          return (
            <div key={orden.id} className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs p-5 space-y-4 ${isCompleted ? 'border-emerald-200' : 'border-amber-300 bg-amber-50/10'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg font-mono font-bold bg-stone-900 text-white">{orden.numeroOrden}</span>
                  <strong className="text-base text-stone-900 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-stone-500"/> {orden.parcelaNombres || 'Sin cuartel'}
                  </strong>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-900 border border-blue-200">📍 {orden.destinoAplicacion}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${isCompleted ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>{isCompleted ? '✓ Aplicación Realizada' : '⏳ Pendiente'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(orden)} className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDeleteOrden(orden.id)} className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-xl border text-xs">
                <div>
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Objetivo</span>
                  <strong className="text-stone-900 text-sm block mt-0.5">{orden.plagaObjetivo}</strong>
                  <span className="text-stone-600 font-medium mt-1 block"><Tractor className="w-3.5 h-3.5 inline mr-1"/> {orden.maquinariaTractor}</span>
                  <span className="text-stone-600 font-medium block mt-1">Sup. Total: <strong>{orden.superficieTratarHa} ha</strong></span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-stone-400 uppercase font-bold text-[10px] block mb-1">Productos a Aplicar ({orden.productos.length})</span>
                  <div className="space-y-1">
                    {orden.productos.map((prod, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-1.5 rounded border border-stone-200">
                        <div>
                          <strong className="text-emerald-900">{prod.productoComercial}</strong>
                          <span className="text-[10px] text-stone-500 ml-2">({prod.materiaActiva})</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs block font-bold">{prod.totalProductoRequerido} {prod.unidadProducto}</span>
                          <span className="text-[10px] text-stone-400">Dosis: {prod.dosisPorHa} {prod.unidadDosis}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right text-emerald-950 font-bold pt-1 border-t border-stone-200">
                    Caldo Total Estimado: {orden.caldoTotalLitros} L (Mojamiento: {orden.mojamientoLHa} L/ha)
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div className="text-[11px] text-stone-500">Carencia: <strong>{orden.plazoCarenciaDias} días</strong> · Reingreso: <strong>{orden.plazoReingresoHoras} hrs</strong></div>
                {!isCompleted ? (
                  <button onClick={() => { setExecutingOrden(orden); setExecFirmaAplicador(`CONFORME - ${orden.aplicadorAsignadoNombre}`); }} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"><Check className="w-4 h-4" /> Confirmar & Descontar</button>
                ) : (
                  <span className="text-emerald-800 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> {orden.aplicadorFirma || 'Realizada'}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CREAR / EDITAR RECETA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border">
            <div className="px-6 py-4 border-b bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-300" /> {editingOrdenItem ? 'Editar Receta' : 'Emitir Receta Fitosanitaria'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              
              {/* DESTINO Y CUARTELES MÚLTIPLES */}
              <div className="grid grid-cols-1 gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-bold text-amber-950 mb-1 flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-amber-700" /> Destino de la Aplicación *</label>
                  <select value={destinoAplicacion} onChange={(e) => setDestinoAplicacion(e.target.value as DestinoAplicacion)} className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-bold text-stone-900">
                    <option value="Huerto de Kiwi">🥝 Huerto de Kiwi</option>
                    <option value="Casa patronal">🏡 Casa patronal / Jardines</option>
                    <option value="Quinta frutal">🍎 Quinta frutal</option>
                    <option value="Control de praderas">🌾 Control de praderas / Cercos</option>
                    <option value="Vivero">🌱 Vivero de plantas</option>
                    <option value="Caminos y cercos">🚜 Caminos / Canales</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-2">Selecciona los Cuarteles *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {parcelas.map(p => (
                      <label key={p.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${parcelaIds.includes(p.id) ? 'bg-amber-100 border-amber-400' : 'bg-white hover:bg-stone-50'}`}>
                        <input type="checkbox" checked={parcelaIds.includes(p.id)} onChange={() => toggleParcela(p.id)} className="w-4 h-4 text-amber-600 rounded" />
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px]">{p.nombre}</span>
                          <span className="text-[10px] text-stone-500">{p.superficieHa} ha</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 text-right text-amber-900 font-bold">
                    Superficie Total Seleccionada: <span className="text-sm font-extrabold">{ha.toFixed(2)} ha</span>
                  </div>
                </div>
              </div>

              {/* MÚLTIPLES PRODUCTOS */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block font-bold text-emerald-950 flex items-center gap-1"><Package className="w-4 h-4 text-emerald-700" /> Productos a Aplicar *</label>
                  <button type="button" onClick={agregarProducto} className="px-3 py-1 bg-emerald-700 text-white rounded font-bold hover:bg-emerald-600 cursor-pointer">+ Añadir Producto</button>
                </div>

                {productos.map((prod, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-emerald-200 space-y-2 relative">
                    <button type="button" onClick={() => eliminarProducto(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold mb-0.5">Seleccionar de Bodega</label>
                        <select 
                          value={prod.insumoId || ''} 
                          onChange={(e) => actualizarProducto(index, 'insumoId', e.target.value)}
                          className="w-full p-2 border rounded-lg bg-stone-50 text-xs"
                        >
                          <option value="">-- Producto Manual --</option>
                          {inventario.map(i => <option key={i.id} value={i.id}>[{i.categoria}] {i.nombreComercial} (Stock: {i.stockActual} {i.unidad})</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold mb-0.5">Nombre Comercial *</label>
                        <input type="text" required value={prod.productoComercial} onChange={(e) => actualizarProducto(index, 'productoComercial', e.target.value)} className="w-full p-2 border rounded-lg font-bold" placeholder="Ej: Cobre Hidróxido 50 WP" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold mb-0.5">Dosis / Ha *</label>
                        <div className="flex gap-1">
                          <input type="number" step="0.01" required value={prod.dosisPorHa} onChange={(e) => actualizarProducto(index, 'dosisPorHa', parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded-lg font-mono font-bold" />
                          <select value={prod.unidadDosis} onChange={(e) => actualizarProducto(index, 'unidadDosis', e.target.value)} className="p-1 border rounded-lg bg-white text-[10px]">
                            <option value="kg/ha">kg/ha</option>
                            <option value="L/ha">L/ha</option>
                            <option value="cc/100L">cc/100L</option>
                            <option value="g/100L">g/100L</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold mb-0.5">Materia Activa</label>
                        <input type="text" value={prod.materiaActiva} onChange={(e) => actualizarProducto(index, 'materiaActiva', e.target.value)} className="w-full p-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold mb-0.5 text-emerald-800 flex items-center gap-1"><Calculator className="w-3 h-3"/> Total a Preparar</label>
                        <div className="p-2 bg-emerald-100 rounded-lg font-bold text-center border border-emerald-300">
                          {(prod.dosisPorHa * ha).toFixed(2)} {prod.unidadProducto}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MOJAMIENTO Y CALDO */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mojamiento (L/ha) *</label>
                  <input type="number" step="50" required value={mojamientoLHa} onChange={(e) => setMojamientoLHa(parseInt(e.target.value) || 1000)} className="w-full p-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-blue-950 mb-1">Volumen de Caldo Total</label>
                  <div className="p-2 bg-blue-100 border border-blue-300 rounded-lg font-extrabold text-blue-950 text-center font-mono">{caldoTotal} Litros</div>
                </div>
              </div>

              {/* OTROS CAMPOS */}
              <div className="p-3.5 bg-stone-50 rounded-xl border space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Plaga / Motivo *</label>
                    <input type="text" required value={plagaObjetivo} onChange={(e) => setPlagaObjetivo(e.target.value)} className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Fecha Programada *</label>
                    <input type="date" required value={fechaProgramada} onChange={(e) => setFechaProgramada(e.target.value)} className="w-full p-2 border rounded-lg font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Maquinaria / Tractor</label>
                  <input type="text" value={maquinaria} onChange={(e) => setMaquinaria(e.target.value)} placeholder="Ej: Tractor John Deere + Pulverizadora 2000L" className="w-full p-2 border rounded-lg" />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-stone-50 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm cursor-pointer">Guardar Receta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EJECUTAR */}
      {executingOrden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Confirmar Aplicación & Descontar Bodega</h3>
            <p className="text-stone-600">Se descontarán automáticamente los <strong>{executingOrden.productos.length} producto(s)</strong> del inventario para <strong>{executingOrden.parcelaNombres}</strong>.</p>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Firma / Registro del Aplicador</label>
              <input type="text" value={execFirmaAplicador} onChange={(e) => setExecFirmaAplicador(e.target.value)} className="w-full p-2.5 border rounded-lg font-mono" />
            </div>
            <div className="pt-2 border-t flex justify-end gap-2">
              <button onClick={() => setExecutingOrden(null)} className="px-4 py-2 border rounded-lg cursor-pointer">Cancelar</button>
              <button onClick={handleConfirmExecution} className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg cursor-pointer">Confirmar & Descontar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
