import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  ShieldCheck, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Edit2, 
  Trash2,
  CheckCircle2,
  ArrowDownRight,
  X
} from 'lucide-react';
import { InsumoInventario } from '../types/campo';

interface InventarioViewProps {
  inventario: InsumoInventario[];
  onAddInsumo: (insumo: InsumoInventario) => void;
  onUpdateInsumo: (insumo: InsumoInventario) => void;
  onDeleteInsumo: (id: string) => void;
}

export const InventarioView: React.FC<InventarioViewProps> = ({
  inventario,
  onAddInsumo,
  onUpdateInsumo,
  onDeleteInsumo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
  const [onlyAlerts, setOnlyAlerts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<InsumoInventario | null>(null);
  const [insumoToDelete, setInsumoToDelete] = useState<InsumoInventario | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Form states
  const [nombreComercial, setNombreComercial] = useState('');
  const [materiaActiva, setMateriaActiva] = useState('');
  const [categoria, setCategoria] = useState<InsumoInventario['categoria']>('Fungicida');
  const [stockActual, setStockActual] = useState<number | ''>('');
  const [unidad, setUnidad] = useState<'kg' | 'L' | 'g' | 'cc'>('kg');
  const [stockMinimo, setStockMinimo] = useState<number | ''>('');
  const [numeroRegistroSAG, setNumeroRegistroSAG] = useState('');
  const [ubicacionBodega, setUbicacionBodega] = useState('Bodega Principal - Estante Químicos');
  const [fechaVencimiento, setFechaVencimiento] = useState('2028-12-31');
  const [costoPorUnidadCLP, setCostoPorUnidadCLP] = useState<number | ''>('');

  // Quick Restock Inline Modal/Prompt State
  const [quickRestockItem, setQuickRestockItem] = useState<InsumoInventario | null>(null);
  const [quickRestockAmount, setQuickRestockAmount] = useState<number | ''>('');

  const filteredInventario = inventario.filter((item) => {
    const matchesSearch = 
      item.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materiaActiva.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.numeroRegistroSAG && item.numeroRegistroSAG.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategoria === 'all' || item.categoria === selectedCategoria;
    const matchesAlert = !onlyAlerts || item.stockActual <= item.stockMinimo;
    return matchesSearch && matchesCat && matchesAlert;
  });

  const lowStockItems = inventario.filter(i => i.stockActual <= i.stockMinimo);

  const openNewModal = () => {
    setEditingInsumo(null);
    setNombreComercial('');
    setMateriaActiva('');
    setCategoria('Fungicida');
    setStockActual(10);
    setUnidad('kg');
    setStockMinimo(5);
    setNumeroRegistroSAG('SAG ');
    setUbicacionBodega('Bodega de Fitosanitarios - Estante A');
    setFechaVencimiento('2028-06-30');
    setCostoPorUnidadCLP(25000);
    setIsModalOpen(true);
  };

  const openEditModal = (item: InsumoInventario) => {
    setEditingInsumo(item);
    setNombreComercial(item.nombreComercial);
    setMateriaActiva(item.materiaActiva);
    setCategoria(item.categoria);
    setStockActual(item.stockActual);
    setUnidad(item.unidad);
    setStockMinimo(item.stockMinimo);
    setNumeroRegistroSAG(item.numeroRegistroSAG || '');
    setUbicacionBodega(item.ubicacionBodega);
    setFechaVencimiento(item.fechaVencimiento);
    setCostoPorUnidadCLP(item.costoPorUnidadCLP);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInsumo) {
      const updated: InsumoInventario = {
        ...editingInsumo,
        nombreComercial,
        materiaActiva,
        categoria,
        stockActual: Number(stockActual) || 0,
        unidad,
        stockMinimo: Number(stockMinimo) || 0,
        numeroRegistroSAG,
        ubicacionBodega,
        fechaVencimiento,
        costoPorUnidadCLP: Number(costoPorUnidadCLP) || 0
      };
      onUpdateInsumo(updated);
    } else {
      const nuevo: InsumoInventario = {
        id: `ins-${Date.now()}`,
        nombreComercial,
        materiaActiva,
        categoria,
        stockActual: Number(stockActual) || 0,
        unidad,
        stockMinimo: Number(stockMinimo) || 0,
        numeroRegistroSAG,
        ubicacionBodega,
        fechaVencimiento,
        costoPorUnidadCLP: Number(costoPorUnidadCLP) || 0,
        consumoHistoricoAcumulado: 0
      };
      onAddInsumo(nuevo);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Inventario y Bodega de Insumos (Fundo La Cabaña)
          </h1>
          <p className="text-xs text-stone-500">
            Control de existencias de fitosanitarios y fertilizantes con descuento automático por aplicación
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ingresar Nuevo Insumo
        </button>
      </div>

      {/* Low Stock Alert Box */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            Alertas de Stock Bajo / Próximo a Agotarse ({lowStockItems.length})
          </div>
          <p className="text-xs text-amber-900">
            Los siguientes productos fitosanitarios o fertilizantes se encuentran en o por debajo del umbral mínimo de seguridad. Realizar orden de compra para las próximas aplicaciones programadas en el huerto de kiwis.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {lowStockItems.map((item) => (
              <div key={item.id} className="p-2.5 bg-white rounded-lg border border-amber-300 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-stone-900">{item.nombreComercial}</div>
                  <div className="text-[11px] text-stone-500">{item.categoria}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-red-700 text-sm">
                    {item.stockActual} {item.unidad}
                  </span>
                  <div className="text-[10px] text-stone-400">Mín: {item.stockMinimo} {item.unidad}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white border border-stone-200 rounded-xl shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre comercial, materia activa o registro SAG..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyAlerts(!onlyAlerts)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              onlyAlerts
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Solo Alertas ({lowStockItems.length})
          </button>

          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
          >
          
            <option value="all">Todas las categorías ({inventario.length})</option>
  <option value="Fungicida">Fungicidas (Botrytis / Oídio)</option>
  <option value="Insecticida">Insecticidas</option>
  <option value="Acaricida">Acaricidas (Falsa Arañita)</option>
  <option value="Bactericida">Bactericidas (Cobres / Psa)</option>
  <option value="Herbicida">Herbicidas</option>
  <option value="Fitorregulador">Fitorreguladores / Rompedores de Dormancia</option>
  <option value="Bioestimulante">Bioestimulantes / Algas</option>
  <option value="Fertilizante">Fertilizantes & Nutrientes</option>
  <option value="Coadyuvante">Coadyuvantes & Adherentes</option>
  <option value="Desinfectante">Desinfectantes de Herramientas</option>
  <option value="Otro">Otros</option>
          </select>
        </div>
      </div>

      {/* Inventory Cards and Table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Producto & Categoría</th>
                <th className="py-3 px-4">Materia Activa & Registro</th>
                <th className="py-3 px-4">Stock en Bodega</th>
                <th className="py-3 px-4">Consumo Acumulado</th>
                <th className="py-3 px-4">Ubicación Bodega</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInventario.map((item) => {
                const isLow = item.stockActual <= item.stockMinimo;
                const isCritical = item.stockActual <= (item.stockMinimo * 0.4);

                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{item.nombreComercial}</div>
                      <span className="text-[11px] text-stone-500">{item.categoria}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-stone-800">{item.materiaActiva}</div>
                      {item.numeroRegistroSAG && (
                        <div className="font-mono text-[10px] text-stone-400">{item.numeroRegistroSAG}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-sm font-bold font-mono tabular-nums ${isCritical ? 'text-red-700' : isLow ? 'text-amber-700' : 'text-stone-900'}`}>
                          {item.stockActual} {item.unidad}
                        </span>
                        {isLow && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900">
                            Bajo Mínimo ({item.stockMinimo})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">
                        ${item.costoPorUnidadCLP.toLocaleString('es-CL')} / {item.unidad}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums text-stone-700">
                      <div className="flex items-center gap-1 text-emerald-800 font-medium">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        {item.consumoHistoricoAcumulado} {item.unidad}
                      </div>
                      <span className="text-[10px] text-stone-400">aplicados en kiwis</span>
                    </td>

                    <td className="py-3 px-4 text-stone-600">
                      {item.ubicacionBodega}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                      {item.fechaVencimiento}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {isLow && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuickRestockItem(item);
                              setQuickRestockAmount(Math.max(5, Number((item.stockMinimo * 2 - item.stockActual).toFixed(1))));
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
                            title="Reponer stock de este insumo"
                          >
                            + Reponer
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 text-stone-500 hover:text-emerald-800 rounded hover:bg-stone-100 transition-colors"
                          title="Modificar stock o datos"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setInsumoToDelete(item)}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar insumo de bodega"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Insumo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-sm font-bold text-stone-900">
                {editingInsumo ? 'Ajustar Insumo / Stock de Bodega' : 'Ingresar Insumo Fitosanitario o Fertilizante'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Switch 62.5 WG"
                    value={nombreComercial}
                    onChange={(e) => setNombreComercial(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Categoría</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Fungicida">Fungicida</option>
                    <option value="Bactericida">Bactericida (Cobre)</option>
                    <option value="Insecticida / Acaricida">Insecticida / Acaricida</option>
                    <option value="Fertilizante">Fertilizante</option>
                    <option value="Coadyuvante">Coadyuvante / Adherente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Materia Activa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cyprodinil + Fludioxonil"
                  value={materiaActiva}
                  onChange={(e) => setMateriaActiva(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Stock Actual *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={stockActual}
                    onChange={(e) => setStockActual(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Unidad</label>
                  <select
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="g">g</option>
                    <option value="cc">cc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Stock Mínimo (Alerta) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">N° Registro SAG</label>
                  <input
                    type="text"
                    value={numeroRegistroSAG}
                    onChange={(e) => setNumeroRegistroSAG(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Costo Unitario (CLP)</label>
                  <input
                    type="number"
                    value={costoPorUnidadCLP}
                    onChange={(e) => setCostoPorUnidadCLP(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Ubicación en Bodega</label>
                  <input
                    type="text"
                    value={ubicacionBodega}
                    onChange={(e) => setUbicacionBodega(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Fecha Vencimiento</label>
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
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
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                >
                  Guardar en Bodega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Restock Dialog */}
      {quickRestockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Reponer Stock</h4>
                <span className="text-[11px] text-stone-500">{quickRestockItem.nombreComercial}</span>
              </div>
              <button
                onClick={() => setQuickRestockItem(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex justify-between">
                <span>Stock Actual:</span>
                <span className="font-mono font-bold text-red-700">
                  {quickRestockItem.stockActual} {quickRestockItem.unidad}
                </span>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Cantidad a Ingresar ({quickRestockItem.unidad}) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  autoFocus
                  value={quickRestockAmount}
                  onChange={(e) => setQuickRestockAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setQuickRestockItem(null)}
                className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (quickRestockAmount && Number(quickRestockAmount) > 0) {
                    const added = Number(quickRestockAmount);
                    onUpdateInsumo({
                      ...quickRestockItem,
                      stockActual: Number((quickRestockItem.stockActual + added).toFixed(2))
                    });
                    showToast(`Se agregaron ${added} ${quickRestockItem.unidad} a ${quickRestockItem.nombreComercial}`);
                    setQuickRestockItem(null);
                    setQuickRestockAmount('');
                  }
                }}
                disabled={!quickRestockAmount || Number(quickRestockAmount) <= 0}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold rounded-lg text-xs"
              >
                Ingresar a Bodega
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IN-APP DE CONFIRMACIÓN DE ELIMINACIÓN DE INSUMO */}
      {insumoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-red-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm">Eliminar Insumo de Bodega</h3>
              </div>
              <button 
                onClick={() => setInsumoToDelete(null)}
                className="p-1 text-red-200 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="text-stone-800 text-sm font-medium">
                ¿Estás seguro de que deseas eliminar permanentemente este producto del inventario de bodega?
              </p>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-stone-700">
                <div><strong>Producto:</strong> {insumoToDelete.nombreComercial}</div>
                <div><strong>Materia Activa:</strong> {insumoToDelete.materiaActiva}</div>
                <div><strong>Categoría:</strong> {insumoToDelete.categoria}</div>
                <div><strong>Stock Actual en Bodega:</strong> {insumoToDelete.stockActual} {insumoToDelete.unidad}</div>
                {insumoToDelete.numeroRegistroSAG && (
                  <div><strong>N° Registro SAG:</strong> {insumoToDelete.numeroRegistroSAG}</div>
                )}
                <div><strong>Ubicación:</strong> {insumoToDelete.ubicacionBodega}</div>
              </div>

              <p className="text-[11px] text-stone-500">
                Esta acción dará de baja este producto del registro de insumos fitosanitarios y fertilizantes de Fundo La Cabaña.
              </p>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInsumoToDelete(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nombre = insumoToDelete.nombreComercial;
                    onDeleteInsumo(insumoToDelete.id);
                    setInsumoToDelete(null);
                    showToast(`Insumo "${nombre}" eliminado de bodega exitosamente`);
                  }}
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

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
