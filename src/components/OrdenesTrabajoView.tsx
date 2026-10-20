import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Droplet, 
  UserCheck, 
  Calendar, 
  Trash2, 
  Printer, 
  Download, 
  Sparkles,
  ArrowRight,
  Package,
  Wind,
  Check,
  X,
  Layers,
  Award
} from 'lucide-react';
import { 
  Parcela, 
  InsumoInventario, 
  UsuarioPredio, 
  OrdenTrabajoFitosanitaria 
} from '../types/campo';

interface OrdenesTrabajoViewProps {
  ordenes: OrdenTrabajoFitosanitaria[];
  parcelas: Parcela[];
  inventario: InsumoInventario[];
  usuarios: UsuarioPredio[];
  activeUser?: UsuarioPredio;
  onAddOrden: (orden: OrdenTrabajoFitosanitaria) => void;
  onExecuteOrden: (ordenId: string, aplicadorNombre: string, firma: string) => void;
  onDeleteOrden: (ordenId: string) => void;
}

export const OrdenesTrabajoView: React.FC<OrdenesTrabajoViewProps> = ({
  ordenes,
  parcelas,
  inventario,
  usuarios,
  activeUser,
  onAddOrden,
  onExecuteOrden,
  onDeleteOrden
}) => {
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrdenToPrint, setSelectedOrdenToPrint] = useState<OrdenTrabajoFitosanitaria | null>(null);

  // Form states for creating a new work order
  const [parcelaId, setParcelaId] = useState(parcelas[0]?.id || '');
  const [fechaProgramada, setFechaProgramada] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [plagaObjetivo, setPlagaObjetivo] = useState('Pseudomonas syringae pv. actinidiae (Psa)');
  const [insumoId, setInsumoId] = useState(inventario[0]?.id || '');
  const [dosisPorHa, setDosisPorHa] = useState<number>(1.5);
  const [unidadDosis, setUnidadDosis] = useState<'L/ha' | 'kg/ha' | 'cc/100L' | 'g/100L'>('kg/ha');
  const [mojamientoLHa, setMojamientoLHa] = useState<number>(1500);
  const [plazoReingreso, setPlazoReingreso] = useState<number>(24);
  const [plazoCarencia, setPlazoCarencia] = useState<number>(14);
  const [maquinaria, setMaquinaria] = useState('Tractor New Holland TN75F + Nebulizadora Hardi 2000L');
  const [condicionesClima, setCondicionesClima] = useState('Viento < 8 km/h, HR > 50%, Temp entre 12°C y 22°C. Sin pronóstico de lluvia en 24h.');
  const [observaciones, setObservaciones] = useState('');
  const [aplicadorId, setAplicadorId] = useState(
    usuarios.find(u => u.rol === 'aplicador_calificado' || u.rol === 'jefe_campo')?.id || ''
  );

  // Modal execution prompt
  const [executingOrden, setExecutingOrden] = useState<OrdenTrabajoFitosanitaria | null>(null);
  const [execFirmaAplicador, setExecFirmaAplicador] = useState('');

  // Selected insumo details
  const selectedInsumo = inventario.find(i => i.id === insumoId);
  const selectedParcela = parcelas.find(p => p.id === parcelaId);
  const ha = selectedParcela ? selectedParcela.superficieHa : 1;

  // Auto-cálculo de producto total y caldo total
  const caldoTotal = Math.round(mojamientoLHa * ha);
  const totalProducto = Number((dosisPorHa * ha).toFixed(2));

  // Filtrado
  const filteredOrdenes = ordenes.filter(o => {
    if (filterEstado === 'all') return true;
    return o.estado === filterEstado;
  });

  const ordenesPendientes = ordenes.filter(o => o.estado === 'emitida' || o.estado === 'en_ejecucion').length;
  const ordenesCompletadas = ordenes.filter(o => o.estado === 'completada').length;

  // Manejo de cambio de insumo
  const handleInsumoChange = (newInsumoId: string) => {
    setInsumoId(newInsumoId);
    const ins = inventario.find(i => i.id === newInsumoId);
    if (ins) {
      if (ins.unidad === 'kg' || ins.unidad === 'g') {
        setUnidadDosis('kg/ha');
      } else {
        setUnidadDosis('L/ha');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parcelas.find(item => item.id === parcelaId) || parcelas[0];
    const ins = inventario.find(item => item.id === insumoId) || inventario[0];
    const apl = usuarios.find(u => u.id === aplicadorId);

    const agronomoResponsable = usuarios.find(u => u.rol === 'agronomo_predio' || u.rol === 'asesor_externo') || activeUser;
    const agronomoNombre: string = agronomoResponsable?.nombre || activeUser?.nombre || 'Ing. Agrónomo Fundo La Cabaña';
    const agronomoSag: string = agronomoResponsable?.numeroRegistroSAG || 'SAG-AGR-4491-RM';

    const count = ordenes.length + 1;
    const pad = count.toString().padStart(3, '0');
    const numOrden = `OT-2026-${pad}`;

    const nuevaOrden: OrdenTrabajoFitosanitaria = {
      id: `ot-${Date.now()}`,
      numeroOrden: numOrden,
      fechaEmision: new Date().toISOString().slice(0, 10),
      fechaProgramada,
      parcelaId: p.id,
      parcelaNombre: p.nombre,
      superficieTratarHa: p.superficieHa,
      estado: 'emitida',
      plagaObjetivo,
      insumoId: ins.id,
      productoComercial: ins.nombreComercial,
      materiaActiva: ins.materiaActiva,
      numeroRegistroSAG: ins.numeroRegistroSAG || 'SAG-OFICIAL',
      dosisPorHa: Number(dosisPorHa),
      unidadDosis,
      mojamientoLHa: Number(mojamientoLHa),
      caldoTotalLitros: caldoTotal,
      totalProductoRequerido: totalProducto,
      unidadProducto: ins.unidad,
      plazoReingresoHoras: Number(plazoReingreso),
      plazoCarenciaDias: Number(plazoCarencia),
      eppObligatorio: [
        'Máscara respiratoria con filtro para polvos y vapores químicos',
        'Buzo impermeable tipo Tyvek completo con capucha',
        'Guantes de nitrilo puño largo homologados',
        'Botas de goma caña alta sin perforaciones',
        'Antiparras o visor envolvente con sello facial'
      ],
      condicionesClimaticasRequeridas: condicionesClima,
      agronomoEmisorId: agronomoResponsable?.id || 'usr-2',
      agronomoEmisorNombre: agronomoNombre,
      agronomoRegistroSAG: agronomoSag,
      agronomoFirmaDigital: `FIRMADO DIGITALMENTE - ${agronomoNombre} · ${agronomoSag} (${new Date().toLocaleDateString('es-CL')})`,
      aplicadorAsignadoId: apl?.id,
      aplicadorAsignadoNombre: apl?.nombre || 'Marcos Benítez T.',
      maquinariaTractor: maquinaria,
      descontadoInventario: false,
      observacionesTecnicas: observaciones || undefined
    };

    onAddOrden(nuevaOrden);
    setIsModalOpen(false);
    setObservaciones('');
  };

  const handleConfirmExecution = () => {
    if (!executingOrden) return;
    const firmaTexto = execFirmaAplicador.trim() 
      ? execFirmaAplicador 
      : `APLICACIÓN CONFORME - ${executingOrden.aplicadorAsignadoNombre || 'Aplicador'} (Carnet SAG Vigente) - ${new Date().toLocaleDateString('es-CL')}`;
    
    onExecuteOrden(
      executingOrden.id, 
      executingOrden.aplicadorAsignadoNombre || 'Aplicador Predio', 
      firmaTexto
    );
    setExecutingOrden(null);
    setExecFirmaAplicador('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-2xl text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-600/40">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            Buenas Prácticas Agrícolas · SAG
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Órdenes de Trabajo Fitosanitarias (Recetas Agronómicas)
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Prescripción fitosanitaria oficial emitida por el Ingeniero Agrónomo a cargo para cuarteles de Kiwi Hayward. Control de EPP, carencias, reingreso y firmas digitales.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Emitir Nueva Receta Fitosanitaria
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Total Órdenes Emitidas
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {ordenes.length}
            </span>
            <span className="text-xs text-stone-600 font-medium">recetas</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Temporada 2026 - 2027
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            Pendientes de Ejecución
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">
              {ordenesPendientes}
            </span>
            <span className="text-xs text-amber-900 font-medium">por aplicar</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Revisar ventana de clima
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            Aplicaciones Completadas
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
              {ordenesCompletadas}
            </span>
            <span className="text-xs text-emerald-950 font-medium">ejecutadas</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Descontadas de bodega
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Variedad Bajo Prescripción
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-stone-800">
              Kiwi Hayward
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            100% de cuarteles del predio
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterEstado('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterEstado === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todas ({ordenes.length})
          </button>
          <button
            onClick={() => setFilterEstado('emitida')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              filterEstado === 'emitida'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Emitidas / Pendientes ({ordenes.filter(o => o.estado === 'emitida').length})
          </button>
          <button
            onClick={() => setFilterEstado('completada')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              filterEstado === 'completada'
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completadas ({ordenes.filter(o => o.estado === 'completada').length})
          </button>
        </div>

        <span className="text-xs text-stone-500">
          Mostrando {filteredOrdenes.length} órdenes
        </span>
      </div>

      {/* List of Work Orders (Official agronomic prescription cards) */}
      <div className="space-y-4">
        {filteredOrdenes.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
            <FileText className="w-12 h-12 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No hay órdenes de trabajo en este estado</h3>
            <p className="text-xs text-stone-500 mt-1">
              Emite una nueva orden fitosanitaria para programar aplicaciones en los cuarteles de kiwi.
            </p>
          </div>
        ) : (
          filteredOrdenes.map((orden) => {
            const isCompleted = orden.estado === 'completada';
            return (
              <div 
                key={orden.id} 
                className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs ${
                  isCompleted ? 'border-emerald-200/80 bg-white' : 'border-amber-300/80 bg-amber-50/20'
                }`}
              >
                {/* Header card */}
                <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-stone-50/50">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-stone-900 text-white">
                      {orden.numeroOrden}
                    </span>
                    <h2 className="text-base font-bold text-stone-900">
                      {orden.parcelaNombre}
                    </h2>
                    <span className="text-xs text-stone-500 font-semibold">
                      ({orden.superficieTratarHa} ha) · Kiwi Hayward
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {isCompleted ? 'Aplicación Ejecutada' : 'Orden Emitida / Pendiente'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      Programada: <strong>{orden.fechaProgramada}</strong>
                    </span>

                    <button
                      onClick={() => onDeleteOrden(orden.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2"
                      title="Eliminar orden"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body of Prescription */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Grid of agronomic details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Objetivo Fitosanitario
                      </span>
                      <span className="text-sm font-bold text-stone-900 mt-0.5 block">
                        {orden.plagaObjetivo}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        Maquinaria: {orden.maquinariaTractor || 'Nebulizadora hidroneumática'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Insumo Prescrito & Registro SAG
                      </span>
                      <span className="text-sm font-bold text-emerald-900 mt-0.5 block">
                        {orden.productoComercial}
                      </span>
                      <span className="text-[11px] text-stone-600 block">
                        {orden.materiaActiva}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        Reg: {orden.numeroRegistroSAG}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Dosis prescrita:</span>
                        <span className="font-bold text-stone-900">{orden.dosisPorHa} {orden.unidadDosis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Mojamiento:</span>
                        <span className="font-bold text-stone-900">{orden.mojamientoLHa} L/ha ({orden.caldoTotalLitros} L caldo)</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-stone-200">
                        <span className="font-bold text-emerald-950">Producto total a preparar:</span>
                        <span className="font-extrabold text-emerald-900 text-sm">
                          {orden.totalProductoRequerido} {orden.unidadProducto}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security & Good Agricultural Practices */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-red-50/60 rounded-xl border border-red-200/80">
                      <div className="flex items-center gap-1.5 text-red-900 font-bold mb-1">
                        <ShieldAlert className="w-4 h-4 text-red-700" />
                        Reingreso & Carencia
                      </div>
                      <p className="text-stone-700">
                        Reingreso al cuartel (REI): <strong>{orden.plazoReingresoHoras} horas</strong>
                      </p>
                      <p className="text-stone-700">
                        Período de carencia: <strong>{orden.plazoCarenciaDias} días pre-cosecha</strong>
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                      <div className="flex items-center gap-1.5 text-amber-950 font-bold mb-1">
                        <Wind className="w-4 h-4 text-amber-700" />
                        Condiciones Meteorológicas
                      </div>
                      <p className="text-stone-700 text-[11px] leading-relaxed">
                        {orden.condicionesClimaticasRequeridas}
                      </p>
                    </div>

                    <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-900 block mb-1">
                        EPP Obligatorio
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {orden.eppObligatorio.slice(0, 3).map((epp, idx) => (
                          <span key={idx} className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-300 text-stone-700">
                            ✓ {epp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Signatures & Execution Section */}
                  <div className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-800" />
                        <span className="text-stone-500">Emitido por:</span>
                        <strong className="text-stone-900">{orden.agronomoEmisorNombre}</strong>
                        {orden.agronomoRegistroSAG && (
                          <span className="text-[11px] text-stone-500 font-mono">
                            ({orden.agronomoRegistroSAG})
                          </span>
                        )}
                      </div>

                      {orden.agronomoFirmaDigital && (
                        <p className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          {orden.agronomoFirmaDigital}
                        </p>
                      )}

                      {isCompleted && orden.aplicadorFirma && (
                        <p className="text-[10px] font-mono text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          {orden.aplicadorFirma}
                        </p>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!isCompleted ? (
                        <button
                          onClick={() => {
                            setExecutingOrden(orden);
                            setExecFirmaAplicador(`APLICACIÓN CONFORME - ${orden.aplicadorAsignadoNombre || 'Marcos Benítez T.'} (Carnet SAG Aplicador #08-4122)`);
                          }}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          Confirmar Aplicación & Descontar Bodega
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-950 font-bold rounded-lg text-xs border border-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                            Aplicado & Cuaderno Actualizado
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL CREAR NUEVA ORDEN DE TRABAJO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base">Emitir Receta Fitosanitaria / Orden de Trabajo</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cuartel de Destino (Kiwi Hayward) *
                  </label>
                  <select
                    value={parcelaId}
                    onChange={(e) => setParcelaId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 bg-white"
                    required
                  >
                    {parcelas.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} ({p.superficieHa} ha)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Fecha Programada de Aplicación *
                  </label>
                  <input
                    type="date"
                    value={fechaProgramada}
                    onChange={(e) => setFechaProgramada(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Plaga, Enfermedad o Motivo Agronómico *
                </label>
                <select
                  value={plagaObjetivo}
                  onChange={(e) => setPlagaObjetivo(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 bg-white"
                >
                  <option value="Pseudomonas syringae pv. actinidiae (Psa) - Protección herida">Pseudomonas syringae pv. actinidiae (Psa) - Protección herida</option>
                  <option value="Botrytis cinerea (Moho Gris de flor y fruto)">Botrytis cinerea (Moho Gris de flor y fruto)</option>
                  <option value="Escama de San José (Diaspidiotus perniciosus)">Escama de San José (Diaspidiotus perniciosus)</option>
                  <option value="Trips de California (Frankliniella occidentalis)">Trips de California (Frankliniella occidentalis)</option>
                  <option value="Tizón de la Flor y Pudrición Peduncular">Tizón de la Flor y Pudrición Peduncular</option>
                  <option value="Fertilización Foliar de Cuaje y Calibre (Calcio + Boro + Zinc)">Fertilización Foliar de Cuaje y Calibre (Calcio + Boro + Zinc)</option>
                  <option value="Rompedor de Dormancia Invernal">Rompedor de Dormancia Invernal (Cianamida / Erger)</option>
                </select>
              </div>

              {/* Selector de Producto de Inventario */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <label className="block text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-emerald-800" />
                  Seleccionar Producto desde Bodega de Insumos *
                </label>
                <select
                  value={insumoId}
                  onChange={(e) => handleInsumoChange(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 focus:outline-emerald-800 bg-white"
                  required
                >
                  {inventario.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.nombreComercial} ({i.materiaActiva}) - Stock: {i.stockActual} {i.unidad}
                    </option>
                  ))}
                </select>

                {selectedInsumo && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-900 mt-2 font-medium">
                    <span>Materia Activa: <strong>{selectedInsumo.materiaActiva}</strong></span>
                    <span>Stock Disponible: <strong>{selectedInsumo.stockActual} {selectedInsumo.unidad}</strong></span>
                  </div>
                )}
              </div>

              {/* Dosis y Mojamiento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dosis por Ha *
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={dosisPorHa}
                      onChange={(e) => setDosisPorHa(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                      required
                    />
                    <select
                      value={unidadDosis}
                      onChange={(e: any) => setUnidadDosis(e.target.value)}
                      className="text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="kg/ha">kg/ha</option>
                      <option value="L/ha">L/ha</option>
                      <option value="cc/100L">cc/100L</option>
                      <option value="g/100L">g/100L</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mojamiento (L/ha) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={mojamientoLHa}
                    onChange={(e) => setMojamientoLHa(parseInt(e.target.value) || 1000)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Total Insumo a Preparar
                  </label>
                  <div className="text-xs p-2.5 rounded-lg bg-emerald-100 font-extrabold text-emerald-950 border border-emerald-300">
                    {totalProducto} {selectedInsumo?.unidad || 'kg'} ({caldoTotal} L caldo)
                  </div>
                </div>
              </div>

              {/* Seguridad: Carencia y Reingreso */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Plazo Reingreso al Cuartel (Horas REI) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={plazoReingreso}
                    onChange={(e) => setPlazoReingreso(parseInt(e.target.value) || 24)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Días de Carencia Pre-Cosecha (Días) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={plazoCarencia}
                    onChange={(e) => setPlazoCarencia(parseInt(e.target.value) || 14)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Aplicador / Tractorista Asignado
                  </label>
                  <select
                    value={aplicadorId}
                    onChange={(e) => setAplicadorId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 bg-white"
                  >
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.rol.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Maquinaria / Equipo Pulverizador
                  </label>
                  <input
                    type="text"
                    value={maquinaria}
                    onChange={(e) => setMaquinaria(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Condiciones Climáticas Requeridas
                </label>
                <input
                  type="text"
                  value={condicionesClima}
                  onChange={(e) => setCondicionesClima(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Observaciones Técnicas de Calibración y Mezcla
                </label>
                <textarea
                  rows={2}
                  placeholder="Instrucciones para llenado del estanque, orden de adición de productos, calibración de boquillas..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-emerald-300" />
                  Emitir & Firmar Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE EJECUCIÓN CON FIRMA */}
      {executingOrden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Confirmar Aplicación Fitosanitaria</h3>
              </div>
              <button 
                onClick={() => setExecutingOrden(null)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                <p className="font-bold text-emerald-950">
                  {executingOrden.numeroOrden} · {executingOrden.parcelaNombre}
                </p>
                <p className="text-stone-700">
                  Producto: <strong>{executingOrden.productoComercial}</strong>
                </p>
                <p className="text-stone-700">
                  Cantidad a descontar de bodega: <strong>{executingOrden.totalProductoRequerido} {executingOrden.unidadProducto}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Firma / Carnet de Aplicador Homologado SAG
                </label>
                <input
                  type="text"
                  value={execFirmaAplicador}
                  onChange={(e) => setExecFirmaAplicador(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 font-mono"
                  placeholder="APLICACIÓN CONFORME - Nombre aplicador (Carnet SAG)"
                />
              </div>

              <p className="text-[11px] text-stone-500">
                Al confirmar, se descontarán <strong>{executingOrden.totalProductoRequerido} {executingOrden.unidadProducto}</strong> automáticamente del inventario y se añadirá el registro en el Cuaderno de Campo (Labores).
              </p>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setExecutingOrden(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExecution}
                  className="px-4 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                >
                  Confirmar & Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
