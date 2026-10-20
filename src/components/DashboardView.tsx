import React from 'react';
import { 
  Sprout, 
  MapPin, 
  AlertOctagon, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Droplet, 
  Package, 
  AlertTriangle, 
  CloudSun, 
  Wind, 
  Edit3, 
  Edit2,
  Trash2,
  X,
  ArrowRight,
  TrendingDown,
  Gauge,
  Thermometer,
  Snowflake,
  Users,
  UserCheck
} from 'lucide-react';
import { 
  ExplotacionAgricola, 
  Parcela, 
  RegistroLabor, 
  TipoLabor, 
  InsumoInventario, 
  RegistroExtraccionPozo,
  ClimaCondiciones,
  UsuarioPredio 
} from '../types/campo';
import { ActiveTab } from './Navbar';

interface DashboardViewProps {
  explotacion: ExplotacionAgricola;
  parcelas: Parcela[];
  labores: RegistroLabor[];
  inventario: InsumoInventario[];
  registrosPozo: RegistroExtraccionPozo[];
  clima: ClimaCondiciones;
  usuarios?: UsuarioPredio[];
  activeUserId?: string;
  onOpenNewLaborWithDefaults: (parcelaId?: string, tipoLabor?: TipoLabor) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onEditExplotacion: () => void;
  onOpenAlertsModal?: () => void;
  onEditLabor?: (labor: RegistroLabor) => void;
  onDeleteLabor?: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  explotacion,
  parcelas,
  labores,
  inventario,
  registrosPozo,
  clima,
  usuarios = [],
  activeUserId,
  onOpenNewLaborWithDefaults,
  onNavigateTab,
  onEditExplotacion,
  onOpenAlertsModal,
  onEditLabor,
  onDeleteLabor
}) => {
  const [laborToDelete, setLaborToDelete] = React.useState<RegistroLabor | null>(null);
  const totalHectareas = parcelas.reduce((acc, p) => acc + p.superficieHa, 0);

  // Active phytosanitary safety periods (Carencia)
  const today = new Date();
  const activeCarencias = labores.filter((lab) => {
    if (lab.tipoLabor !== 'fitosanitario' || !lab.plazoSeguridadDias) return false;
    const applicationDate = new Date(lab.fecha);
    const harvestSafeDate = new Date(applicationDate);
    harvestSafeDate.setDate(harvestSafeDate.getDate() + lab.plazoSeguridadDias);
    return harvestSafeDate >= today;
  }).map((lab) => {
    const applicationDate = new Date(lab.fecha);
    const harvestSafeDate = new Date(applicationDate);
    harvestSafeDate.setDate(harvestSafeDate.getDate() + (lab.plazoSeguridadDias || 0));
    const diffTime = harvestSafeDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return {
      labor: lab,
      harvestSafeDate: harvestSafeDate.toISOString().slice(0, 10),
      daysRemaining
    };
  });

  // Low stock inventory alerts
  const lowStockItems = inventario.filter(i => i.stockActual <= i.stockMinimo);
  const criticalItems = inventario.filter(i => i.stockActual <= (i.stockMinimo * 0.4));

  // Well water totals
  const totalM3Pozo = registrosPozo.reduce((acc, r) => acc + r.metrosCubicosExtraidos, 0);
  const totalLitrosPozo = totalM3Pozo * 1000;

  // Recent activities
  const recentLabores = [...labores]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  const getLaborTypeLabel = (tipo: TipoLabor) => {
    switch (tipo) {
      case 'fitosanitario': return 'Fitosanitario';
      case 'fertilizacion': return 'Fertilización';
      case 'riego': return 'Riego';
      case 'cosecha': return 'Cosecha Kiwis';
      case 'siembra': return 'Siembra';
      case 'labor_cultural': return 'Poda / Labor Cultural';
      case 'monitoreo': return 'Monitoreo';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Farm Header */}
      <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 text-white shadow-sm">
        <div className="absolute inset-0">
          <img 
            src="/src/assets/images/agro_field_orchard_1792419621189.jpg" 
            alt="Huertos de Kiwis en Fundo La Cabaña" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
              Explotación Monocultivo de Kiwis · Buenas Prácticas Agrícolas
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {explotacion.nombreFundo}
            </h1>
            
            {/* Clean unboxed metadata with bullet separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-300 pt-1">
              <span>{explotacion.titular}</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="font-mono">{explotacion.identificacionFiscal}</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span>{explotacion.comunaRegion}</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="font-mono">{explotacion.numeroRegistroAgricola}</span>
            </div>

            <p className="text-xs text-stone-300 pt-1">
              Cultivo Exclusivo: <span className="font-semibold text-emerald-300">Kiwi Hayward (100% Monocultivo)</span> · {totalHectareas.toFixed(1)} ha en producción · Temporada {explotacion.temporada}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onEditExplotacion}
              className="px-3.5 py-2 text-xs font-medium text-stone-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Fundo
            </button>
            <button
              onClick={() => onNavigateTab('informe')}
              className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              Informe Oficial SAG
            </button>
          </div>
        </div>
      </div>

      {/* ALERTAS CRÍTICAS: STOCK BAJO EN BODEGA */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Alerta de Bodega: {lowStockItems.length} Insumos Fitosanitarios / Fertilizantes con Stock Bajo
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-950 rounded-full border border-amber-300">
                    Acción Requerida
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-0.5">
                  El inventario se descuenta automáticamente con cada aplicación en los cuarteles de kiwi. Los siguientes productos están próximos a agotarse:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenAlertsModal && (
                <button
                  type="button"
                  onClick={onOpenAlertsModal}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  Reponer / Ver Alertas
                </button>
              )}
              <button
                onClick={() => onNavigateTab('inventario')}
                className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 hover:underline"
              >
                Ver Bodega
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
            {lowStockItems.map((item) => (
              <div 
                key={item.id} 
                onClick={onOpenAlertsModal ? onOpenAlertsModal : () => onNavigateTab('inventario')}
                className="p-2.5 bg-white rounded-lg border border-amber-200 flex items-center justify-between text-xs cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="font-bold text-stone-900 truncate max-w-[130px]">{item.nombreComercial}</div>
                  <div className="text-[10px] text-stone-500">{item.categoria}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-red-700">
                    {item.stockActual} {item.unidad}
                  </div>
                  <div className="text-[10px] text-stone-400">Mín: {item.stockMinimo} {item.unidad}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EQUIPO TÉCNICO Y USUARIOS DEL PREDIO STRIP */}
      {usuarios.length > 0 && (
        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-800" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                Equipo Técnico & Responsables de Fundo La Cabaña
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('usuarios')}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline"
            >
              Gestionar Usuarios & Asesores ({usuarios.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
            {usuarios.slice(0, 3).map((u) => (
              <div 
                key={u.id}
                onClick={() => onNavigateTab('usuarios')}
                className="p-2.5 bg-stone-50 hover:bg-stone-100/80 rounded-lg border border-stone-200 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${u.avatarColor || 'bg-stone-700 text-white'}`}>
                  {u.nombre.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <div className="font-bold text-stone-900 truncate">{u.nombre}</div>
                  <div className="text-[11px] text-stone-500 truncate">
                    {u.tituloProfesional || u.rol.replace('_', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLIMA & CONDICIONES DE PULVERIZACIÓN (Weather Widget for Kiwi Orchard) */}
      <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Estación Meteorológica Fundo La Cabaña
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 ${
              clima.aptoPulverizacion === 'Optimo'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : clima.aptoPulverizacion === 'Precaucion'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {clima.aptoPulverizacion === 'Optimo' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {clima.aptoPulverizacion !== 'Optimo' && <AlertTriangle className="w-3.5 h-3.5" />}
              Pulverización: {clima.aptoPulverizacion || 'Optimo'}
            </span>
            <button
              onClick={() => onNavigateTab('clima')}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline"
            >
              Configurar Clima
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-stone-500 block text-[11px]">Temperatura Actual</span>
            <span className="font-mono font-bold text-base text-stone-900">
              {clima.temperaturaC.toFixed(1)}°C
            </span>
            {clima.alertaHelada && (
              <span className="text-[10px] text-red-700 font-bold block">¡Riesgo Helada!</span>
            )}
          </div>

          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-stone-500 block text-[11px]">Viento y Deriva</span>
            <span className="font-mono font-bold text-base text-stone-900">
              {clima.velocidadVientoKmH.toFixed(1)} km/h
            </span>
            <span className="text-[10px] text-stone-500 block">{clima.vientoDireccion || 'Sur'}</span>
          </div>

          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-stone-500 block text-[11px]">Humedad Relativa</span>
            <span className="font-mono font-bold text-base text-stone-900">
              {clima.humedadRelativa}%
            </span>
            <span className="text-[10px] text-stone-500 block">Rocío: {clima.puntoRocioC || 9.5}°C</span>
          </div>

          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-stone-500 block text-[11px]">Precipitación</span>
            <span className="font-mono font-bold text-base text-stone-900">
              {clima.precipitacionMm || 0} mm
            </span>
            <span className="text-[10px] text-stone-500 block">Condición seca</span>
          </div>
        </div>
      </div>

      {/* KPI STRIP: Cuarteles de kiwi, Litros de Pozo, Stock y Carencia */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pozo Profundo Metric */}
        <div 
          onClick={() => onNavigateTab('pozo')}
          className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs cursor-pointer hover:border-sky-500 transition-colors"
        >
          <div className="text-xs text-stone-500 font-medium flex items-center justify-between">
            <span>Litros del Pozo Extraídos</span>
            <Droplet className="w-3.5 h-3.5 text-sky-700" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-sky-950 font-mono tabular-nums">
              {totalLitrosPozo.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500">Litros</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500">
            {totalM3Pozo.toLocaleString()} m³ registrados en pozo
          </div>
        </div>

        {/* Superficie Kiwis */}
        <div 
          onClick={() => onNavigateTab('parcelas')}
          className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs cursor-pointer hover:border-emerald-600 transition-colors"
        >
          <div className="text-xs text-stone-500 font-medium">Superficie de Kiwis</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-stone-900 tabular-nums">
              {totalHectareas.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">hectáreas</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400">
            {parcelas.length} cuarteles (100% Kiwi Hayward)
          </div>
        </div>

        {/* Insumos en Bodega */}
        <div 
          onClick={() => onNavigateTab('inventario')}
          className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs cursor-pointer hover:border-amber-600 transition-colors"
        >
          <div className="text-xs text-stone-500 font-medium flex items-center justify-between">
            <span>Insumos en Bodega</span>
            <Package className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-stone-900 tabular-nums">
              {inventario.length}
            </span>
            <span className="text-xs text-stone-500">productos</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400">
            {lowStockItems.length > 0 ? (
              <span className="text-amber-800 font-semibold">{lowStockItems.length} con stock bajo</span>
            ) : (
              'Stock saludable'
            )}
          </div>
        </div>

        {/* Carencias activas */}
        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 font-medium flex items-center justify-between">
            <span>Periodos de Carencia</span>
            {activeCarencias.length > 0 && (
              <span className="text-amber-700 text-[11px] font-semibold">Atención</span>
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight tabular-nums ${activeCarencias.length > 0 ? 'text-amber-800' : 'text-stone-900'}`}>
              {activeCarencias.length}
            </span>
            <span className="text-xs text-stone-500">carencias activas</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400">
            {activeCarencias.length > 0 ? 'No cosechar antes de fecha fin' : 'Sin restricciones'}
          </div>
        </div>
      </div>

      {/* Carencia Notice */}
      {activeCarencias.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Alerta de Plazo de Carencia Fitosanitaria en Kiwis
              </h3>
              <div className="mt-2 space-y-2">
                {activeCarencias.map(({ labor, harvestSafeDate, daysRemaining }) => (
                  <div key={labor.id} className="p-2.5 bg-white rounded-lg border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-stone-900">{labor.parcelaNombre}</span>
                      <span className="text-stone-500 ml-2">· {labor.productoComercial} ({labor.materiaActiva})</span>
                    </div>
                    <div className="flex items-center gap-3 text-stone-600">
                      <span>Cosecha autorizada a partir de: <strong className="text-stone-900 font-mono">{harvestSafeDate}</strong></span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-medium rounded text-[11px] font-mono">
                        {daysRemaining} días restantes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Hub */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-3">
          Acciones Frecuentes en Fundo La Cabaña
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onOpenNewLaborWithDefaults(undefined, 'fitosanitario')}
            className="p-3 text-left border border-stone-200 rounded-lg hover:border-emerald-700 hover:bg-emerald-50/30 transition-all group"
          >
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-stone-900">Tratamiento Fitosanitario</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Descuenta stock de bodega</div>
          </button>

          <button
            onClick={() => onOpenNewLaborWithDefaults(undefined, 'riego')}
            className="p-3 text-left border border-stone-200 rounded-lg hover:border-sky-700 hover:bg-sky-50/30 transition-all group"
          >
            <div className="w-8 h-8 rounded bg-sky-100 text-sky-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Droplet className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-stone-900">Riego y Pozo Profundo</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Registra litros del pozo</div>
          </button>

          <button
            onClick={() => onNavigateTab('inventario')}
            className="p-3 text-left border border-stone-200 rounded-lg hover:border-amber-700 hover:bg-amber-50/30 transition-all group"
          >
            <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-stone-900">Bodega de Insumos</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Gestión de existencias</div>
          </button>

          <button
            onClick={() => onOpenNewLaborWithDefaults(undefined, 'cosecha')}
            className="p-3 text-left border border-stone-200 rounded-lg hover:border-purple-700 hover:bg-purple-50/30 transition-all group"
          >
            <div className="w-8 h-8 rounded bg-purple-100 text-purple-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-stone-900">Cosecha de Kiwis</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Kilos recolectados y bins</div>
          </button>
        </div>
      </div>

      {/* Two columns: Recent Activities & Kiwi Plots Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Últimas Labores en Huerto de Kiwis</h3>
                <p className="text-xs text-stone-500">Historial cronológico de aplicaciones y riegos</p>
              </div>
              <button
                onClick={() => onNavigateTab('labores')}
                className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline"
              >
                Ver todas ({labores.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {recentLabores.map((labor) => (
                <div key={labor.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        {labor.descripcionGeneral}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-medium text-stone-700">{labor.parcelaNombre}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{labor.fecha}</span>
                      <span aria-hidden="true">·</span>
                      <span>{getLaborTypeLabel(labor.tipoLabor)}</span>
                      {labor.totalInsumoUtilizado && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-800 font-medium">-{labor.totalInsumoUtilizado} {labor.unidadDosis?.split('/')[0]} bodega</span>
                        </>
                      )}
                      {labor.litrosAgua && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-sky-800 font-medium">{(labor.litrosAgua).toLocaleString()} L pozo</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                    <div>
                      <span className="text-xs text-stone-400 block font-mono">
                        {labor.hora || '08:00'}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {labor.registradoPor}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {onEditLabor && (
                        <button
                          onClick={() => onEditLabor(labor)}
                          className="p-1 text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Editar labor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteLabor && (
                        <button
                          onClick={() => setLaborToDelete(labor)}
                          className="p-1 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar labor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kiwi Plots Status */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Cuarteles de Kiwis</h3>
                <p className="text-xs text-stone-500">Fundo La Cabaña (100% Kiwis)</p>
              </div>
              <button
                onClick={() => onNavigateTab('parcelas')}
                className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline"
              >
                Mapa
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {parcelas.map((parcela) => (
                <div 
                  key={parcela.id} 
                  className="p-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-emerald-600 transition-colors cursor-pointer"
                  onClick={() => onNavigateTab('parcelas')}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900">{parcela.nombre}</h4>
                    <span className="text-xs font-semibold text-stone-800 font-mono tabular-nums">
                      {parcela.superficieHa} ha
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                    <span className="text-stone-800 font-medium">Kiwi {parcela.variedad}</span>
                    <span aria-hidden="true">·</span>
                    <span>{parcela.sistemaConduccion || 'Parrón Español'}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-stone-600 flex items-center justify-between">
                    <span>{parcela.sistemaRiego}</span>
                    <span className="text-emerald-800 font-medium">{parcela.estadoActual}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal for labor deletion from Dashboard */}
      {laborToDelete && onDeleteLabor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-red-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm">Eliminar Registro de Labor</h3>
              </div>
              <button 
                onClick={() => setLaborToDelete(null)}
                className="p-1 text-red-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="text-stone-800 text-sm font-medium">
                ¿Deseas eliminar permanentemente esta labor del cuaderno de campo?
              </p>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-stone-700">
                <div><strong>Labor:</strong> {laborToDelete.descripcionGeneral}</div>
                <div><strong>Cuartel:</strong> {laborToDelete.parcelaNombre}</div>
                <div><strong>Fecha:</strong> {laborToDelete.fecha} {laborToDelete.hora || ''}</div>
                {laborToDelete.productoComercial && (
                  <div><strong>Producto:</strong> {laborToDelete.productoComercial}</div>
                )}
                {laborToDelete.totalInsumoUtilizado && (
                  <div className="text-emerald-800 font-semibold">
                    Se reintegrará el stock descontado ({laborToDelete.totalInsumoUtilizado} {laborToDelete.unidadDosis?.split('/')[0]}) a bodega.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLaborToDelete(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteLabor(laborToDelete.id);
                    setLaborToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5"
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
