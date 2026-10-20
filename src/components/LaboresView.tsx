import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Edit2, 
  ShieldCheck, 
  Wind, 
  Droplet, 
  User, 
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  AlertTriangle,
  Clock,
  Layers,
  Sprout,
  Scissors,
  Apple,
  Bug,
  Droplets,
  RotateCcw
} from 'lucide-react';
import { RegistroLabor, Parcela, TipoLabor } from '../types/campo';
import { exportLaboresToCSV } from '../utils/storage';

interface LaboresViewProps {
  labores: RegistroLabor[];
  parcelas: Parcela[];
  onOpenNewLabor: () => void;
  onEditLabor: (labor: RegistroLabor) => void;
  onDeleteLabor: (id: string) => void;
}

export const LaboresView: React.FC<LaboresViewProps> = ({
  labores,
  parcelas,
  onOpenNewLabor,
  onEditLabor,
  onDeleteLabor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParcela, setSelectedParcela] = useState<string>('all');
  const [selectedTipo, setSelectedTipo] = useState<string>('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // In-app Modal Confirmation for Deletion (NO window.confirm!)
  const [laborToDelete, setLaborToDelete] = useState<RegistroLabor | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmDelete = () => {
    if (!laborToDelete) return;
    const desc = laborToDelete.descripcionGeneral || laborToDelete.tipoLabor;
    onDeleteLabor(laborToDelete.id);
    showToast(`Labor "${desc}" eliminada del registro oficial`);
    setLaborToDelete(null);
  };

  // Filtered and sorted labors with defensive checks against undefined/null
  const filteredLabores = useMemo(() => {
    return labores.filter((l) => {
      const desc = (l.descripcionGeneral || '').toLowerCase();
      const parc = (l.parcelaNombre || '').toLowerCase();
      const prod = (l.productoComercial || '').toLowerCase();
      const mat = (l.materiaActiva || '').toLowerCase();
      const plag = (l.plagaObjetivo || '').toLowerCase();
      const abono = (l.abonoProducto || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = 
        desc.includes(search) ||
        parc.includes(search) ||
        prod.includes(search) ||
        mat.includes(search) ||
        plag.includes(search) ||
        abono.includes(search);

      const matchesParcela = selectedParcela === 'all' || l.parcelaId === selectedParcela;
      const matchesTipo = selectedTipo === 'all' || l.tipoLabor === selectedTipo;

      return matchesSearch && matchesParcela && matchesTipo;
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [labores, searchTerm, selectedParcela, selectedTipo]);

  const toggleExpand = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const getTipoLaborBadge = (tipo: TipoLabor) => {
    switch (tipo) {
      case 'fitosanitario':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300"><ShieldCheck className="w-3 h-3 text-amber-700" /> Fitosanitario</span>;
      case 'fertilizacion':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300"><Layers className="w-3 h-3 text-emerald-700" /> Fertilización</span>;
      case 'riego':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-300"><Droplets className="w-3 h-3 text-sky-700" /> Riego Pozo</span>;
      case 'cosecha':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300"><Apple className="w-3 h-3 text-purple-700" /> Cosecha</span>;
      case 'labor_cultural':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-800 border border-stone-300"><Scissors className="w-3 h-3 text-stone-700" /> Poda / Cultural</span>;
      case 'monitoreo':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300"><Bug className="w-3 h-3 text-indigo-700" /> Monitoreo</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-300">Labor</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Title, CSV export and New Labor action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-800" />
            Cuaderno Oficial de Labores Agrícolas
          </h1>
          <p className="text-xs text-stone-500">
            Registro cronológico oficial de labores en Fundo La Cabaña (100% Kiwi Hayward). Permite editar y eliminar registros en cualquier momento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportLaboresToCSV(filteredLabores)}
            className="px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
            title="Exportar a Excel / CSV para fiscalización SAG"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            Exportar CSV
          </button>

          <button
            onClick={onOpenNewLabor}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 active:scale-95 transition-all rounded-xl shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nueva Labor
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-white border border-stone-200 rounded-xl shadow-2xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por labor, producto comercial, plaga, materia activa o cuartel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div>
          <select
            value={selectedParcela}
            onChange={(e) => setSelectedParcela(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
          >
            <option value="all">Todos los Cuarteles ({parcelas.length})</option>
            {parcelas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.superficieHa} ha)
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
          >
            <option value="all">Todos los Tipos de Labor</option>
            <option value="fitosanitario">Tratamiento Fitosanitario</option>
            <option value="fertilizacion">Fertilización / Nutrición</option>
            <option value="riego">Riego (Pozo Profundo)</option>
            <option value="cosecha">Cosecha de Kiwis</option>
            <option value="labor_cultural">Poda / Labor Cultural</option>
            <option value="monitoreo">Monitoreo / Scouting</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-2xs overflow-hidden">
        {filteredLabores.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-stone-800">No se encontraron labores con estos filtros</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Ajusta los filtros o registra una nueva labor para llevar la trazabilidad del Fundo La Cabaña.
            </p>
            <button
              onClick={onOpenNewLabor}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Registrar Labor
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Fecha & Hora</th>
                  <th className="py-3 px-4">Cuartel (Hayward)</th>
                  <th className="py-3 px-4">Tipo de Labor</th>
                  <th className="py-3 px-4">Descripción / Insumo</th>
                  <th className="py-3 px-4">Dosis / Caldo / Kilos</th>
                  <th className="py-3 px-4">Carencia</th>
                  <th className="py-3 px-4">Responsable</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLabores.map((labor) => {
                  const isExpanded = expandedRowId === labor.id;
                  return (
                    <React.Fragment key={labor.id}>
                      <tr className="hover:bg-stone-50/80 transition-colors group">
                        <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap text-stone-800">
                          <div className="font-semibold">{labor.fecha}</div>
                          <div className="text-[10px] text-stone-400">{labor.hora || '08:00'}</div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-semibold text-stone-900">{labor.parcelaNombre}</span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {getTipoLaborBadge(labor.tipoLabor)}
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-stone-800 truncate" title={labor.descripcionGeneral}>
                            {labor.descripcionGeneral}
                          </div>
                          {(labor.productoComercial || labor.abonoProducto) && (
                            <div className="text-[11px] text-stone-500 truncate">
                              {labor.productoComercial || labor.abonoProducto} 
                              {labor.materiaActiva && ` (${labor.materiaActiva})`}
                            </div>
                          )}
                          {labor.tipoLabor === 'riego' && labor.volumenM3 && (
                            <div className="text-[11px] text-sky-700 font-mono">
                              {labor.volumenM3} m³ extraídos ({labor.duracionRiegoHoras || 4} hrs)
                            </div>
                          )}
                          {labor.tipoLabor === 'cosecha' && labor.kilosRecolectados && (
                            <div className="text-[11px] text-purple-700 font-mono">
                              {labor.kilosRecolectados.toLocaleString()} kg cosechados ({labor.calibreCalidad || 'Exportación'})
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap text-stone-700">
                          {labor.dosisPorHa !== undefined && (
                            <div>{labor.dosisPorHa} {labor.unidadDosis}</div>
                          )}
                          {labor.dosisAbonoKgHa !== undefined && (
                            <div>{labor.dosisAbonoKgHa} kg/ha</div>
                          )}
                          {labor.kilosRecolectados !== undefined && (
                            <div className="font-bold text-purple-900">{labor.kilosRecolectados.toLocaleString()} kg</div>
                          )}
                          {labor.volumenCaldoLHa !== undefined && (
                            <div className="text-[10px] text-stone-400">{labor.volumenCaldoLHa} L caldo/ha</div>
                          )}
                          {labor.totalInsumoUtilizado !== undefined && (
                            <div className="text-[10px] text-emerald-800 font-semibold">
                              Total: {labor.totalInsumoUtilizado} {labor.unidadDosis?.split('/')[0]}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {labor.plazoSeguridadDias !== undefined ? (
                            <span className="font-mono tabular-nums font-semibold px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-900 border border-amber-200">
                              {labor.plazoSeguridadDias} días
                            </span>
                          ) : (
                            <span className="text-stone-300">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-stone-600">
                          {labor.registradoPor || 'Diego Pereira'}
                        </td>

                        {/* Direct, prominent Actions */}
                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <div className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200 p-1 rounded-xl shadow-2xs">
                            <button
                              onClick={() => onEditLabor(labor)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:text-white hover:bg-emerald-800 rounded-lg transition-all flex items-center gap-1 active:scale-95"
                              title="Editar labor"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>

                            <button
                              onClick={() => setLaborToDelete(labor)}
                              className="px-2.5 py-1 text-xs font-semibold text-red-700 hover:text-white hover:bg-red-700 rounded-lg transition-all flex items-center gap-1 active:scale-95"
                              title="Eliminar labor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar</span>
                            </button>

                            <button
                              onClick={() => toggleExpand(labor.id)}
                              className="p-1 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
                              title={isExpanded ? "Ocultar detalles" : "Ver detalles completos"}
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detailed drawer */}
                      {isExpanded && (
                        <tr className="bg-stone-50/90 border-b border-stone-200">
                          <td colSpan={8} className="p-4 sm:p-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              {/* Card 1: Fitosanitario y Dosis */}
                              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5 shadow-2xs">
                                <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                                  Parámetros Técnicos
                                </h4>
                                {labor.productoComercial && (
                                  <div>
                                    <span className="text-stone-500">Producto:</span>{' '}
                                    <strong className="text-stone-900">{labor.productoComercial}</strong>
                                  </div>
                                )}
                                {labor.materiaActiva && (
                                  <div>
                                    <span className="text-stone-500">Materia Activa:</span>{' '}
                                    <span className="text-stone-800">{labor.materiaActiva}</span>
                                  </div>
                                )}
                                {labor.numeroRegistroSAG && (
                                  <div>
                                    <span className="text-stone-500">N° Registro SAG:</span>{' '}
                                    <span className="font-mono text-stone-800">{labor.numeroRegistroSAG}</span>
                                  </div>
                                )}
                                {labor.plagaObjetivo && (
                                  <div>
                                    <span className="text-stone-500">Objetivo / Plaga:</span>{' '}
                                    <span className="text-stone-800">{labor.plagaObjetivo}</span>
                                  </div>
                                )}
                                {labor.totalInsumoUtilizado && (
                                  <div>
                                    <span className="text-stone-500">Total Descontado Bodega:</span>{' '}
                                    <strong className="text-emerald-900">{labor.totalInsumoUtilizado} {labor.unidadDosis?.split('/')[0] || ''}</strong>
                                  </div>
                                )}
                                {labor.plazoReingresoHoras !== undefined && (
                                  <div>
                                    <span className="text-stone-500">Reingreso seguro (REI):</span>{' '}
                                    <span className="font-mono text-stone-800">{labor.plazoReingresoHoras} horas</span>
                                  </div>
                                )}
                                {labor.estadoFenologicoBBCH && (
                                  <div>
                                    <span className="text-stone-500">Estado Fenológico:</span>{' '}
                                    <span className="text-stone-800">{labor.estadoFenologicoBBCH}</span>
                                  </div>
                                )}
                              </div>

                              {/* Card 2: Clima y Maquinaria */}
                              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5 shadow-2xs">
                                <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                                  <Wind className="w-3.5 h-3.5 text-sky-800" />
                                  Condiciones y Maquinaria
                                </h4>
                                {labor.maquinariaEquipo && (
                                  <div>
                                    <span className="text-stone-500">Equipo / Maquinaria:</span>{' '}
                                    <span className="text-stone-800">{labor.maquinariaEquipo}</span>
                                  </div>
                                )}
                                {labor.aplicadorNombre && (
                                  <div>
                                    <span className="text-stone-500">Aplicador:</span>{' '}
                                    <span className="text-stone-800 font-semibold">{labor.aplicadorNombre}</span>{' '}
                                    {labor.carnetAplicador && (
                                      <span className="font-mono text-[10px] text-stone-500">({labor.carnetAplicador})</span>
                                    )}
                                  </div>
                                )}
                                {labor.condicionesClima && (
                                  <div className="pt-1 text-stone-600 font-mono text-[11px]">
                                    Temp: {labor.condicionesClima.temperaturaC}°C · Humedad: {labor.condicionesClima.humedadRelativa}% · Viento: {labor.condicionesClima.velocidadVientoKmH} km/h ({labor.condicionesClima.vientoDireccion || 'Sur'})
                                  </div>
                                )}
                                {labor.costoEstimadoCLP && (
                                  <div className="text-stone-700">
                                    <span className="text-stone-500">Costo Estimado:</span>{' '}
                                    <span className="font-mono font-bold">${labor.costoEstimadoCLP.toLocaleString()} CLP</span>
                                  </div>
                                )}
                              </div>

                              {/* Card 3: Observaciones y Acciones Rápidas */}
                              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs flex flex-col justify-between">
                                <div>
                                  <h4 className="font-bold text-stone-900 text-[11px] uppercase tracking-wide mb-1">
                                    Observaciones de Terreno
                                  </h4>
                                  <p className="text-stone-700 italic text-[11px] leading-relaxed">
                                    {labor.observaciones || 'Sin observaciones adicionales registradas.'}
                                  </p>
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                                  <button
                                    onClick={() => onEditLabor(labor)}
                                    className="px-3 py-1.5 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 text-xs shadow-xs active:scale-95 transition-all"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Editar Labor
                                  </button>
                                  <button
                                    onClick={() => setLaborToDelete(labor)}
                                    className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 font-semibold rounded-lg hover:bg-red-600 hover:text-white flex items-center gap-1.5 text-xs active:scale-95 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL IN-APP DE CONFIRMACIÓN DE ELIMINACIÓN DE LABOR (Sin window.confirm) */}
      {laborToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-red-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm">Eliminar Registro de Labor</h3>
              </div>
              <button 
                onClick={() => setLaborToDelete(null)}
                className="p-1 text-red-200 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="text-stone-800 text-sm font-medium">
                ¿Estás seguro de que deseas eliminar permanentemente esta labor del cuaderno oficial de campo?
              </p>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-stone-700">
                <div><strong>Labor:</strong> {laborToDelete.descripcionGeneral}</div>
                <div><strong>Cuartel:</strong> {laborToDelete.parcelaNombre}</div>
                <div><strong>Fecha:</strong> {laborToDelete.fecha} {laborToDelete.hora || ''}</div>
                {laborToDelete.productoComercial && (
                  <div><strong>Producto:</strong> {laborToDelete.productoComercial}</div>
                )}
                {laborToDelete.totalInsumoUtilizado && (
                  <div className="text-emerald-800 font-semibold">
                    <strong>Stock a reintegrar a bodega:</strong> +{laborToDelete.totalInsumoUtilizado} {laborToDelete.unidadDosis?.split('/')[0]}
                  </div>
                )}
                {laborToDelete.registroPozoId && (
                  <div className="text-sky-800 font-semibold">
                    <strong>Pozo:</strong> Se anulará la extracción vinculada de agua.
                  </div>
                )}
              </div>

              <p className="text-[11px] text-stone-500">
                Esta acción retirará la labor del registro cronológico del predio y restablecerá el stock descontado de bodega si corresponde.
              </p>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLaborToDelete(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 active:scale-95 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
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
