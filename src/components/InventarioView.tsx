import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  CheckCircle2,
  ArrowDownRight,
  X
} from 'lucide-react';
import { InsumoInventario, CategoriaInsumo } from '../types/campo';

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

  // Estados del Formulario
  const [nombreComercial, setNombreComercial] = useState('');
  const [materiaActiva, setMateriaActiva] = useState('');
  const [categoria, setCategoria] = useState<CategoriaInsumo>('Fungicida');
  const [stockActual, setStockActual] = useState<number | ''>(10);
  const [unidad, setUnidad] = useState<'kg' | 'L' | 'g' | 'cc'>('L');
  const [stockMinimo, setStockMinimo] = useState<number | ''>(5);
  const [numeroRegistroSAG, setNumeroRegistroSAG] = useState('');
  const [ubicacionBodega, setUbicacionBodega] = useState('Bodega Principal');
  const [fechaVencimiento, setFechaVencimiento] = useState('2028-12-31');
  const [costoPorUnidadCLP, setCostoPorUnidadCLP] = useState<number | ''>(0);

  const filteredInventario = inventario.filter((item) => {
    const matchesSearch = 
      item.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materiaActiva.toLowerCase().includes(searchTerm.toLowerCase());
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
    setUnidad('L');
    setStockMinimo(5);
    setNumeroRegistroSAG('');
    setUbicacionBodega('Bodega Principal');
    setFechaVencimiento('2028-12-31');
    setCostoPorUnidadCLP(0);
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
      showToast('Insumo actualizado');
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
      showToast('Nuevo producto ingresado a bodega');
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
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Bodega de Insumos Fitosanitarios & Fertilizantes
          </h1>
          <p className="text-xs text-stone-500">
            Control de existencias con categorías separadas y descuento automático por aplicación
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Ingresar Nuevo Insumo
        </button>
      </div>

      {/* Alerta de Stock Bajo */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-950 uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            Alertas de Stock Bajo ({lowStockItems.length} productos)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockItems.map((item) => (
              <div key={item.id} className="p-2.5 bg-white rounded-lg border border-amber-300 flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-900">{item.nombreComercial}</div>
                  <span className="text-[10px] text-stone-500">{item.categoria}</span>
                </div>
                <div className="text-right font-mono font-bold text-red-700">
                  {item.stockActual} {item.unidad}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barra de Búsqueda y Filtros de Categoría */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white border border-stone-200 rounded-xl shadow-xs text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre comercial o materia activa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg"
          />
        </div>

        {/* SELECTOR EXPANDIDO CON TODAS LAS CATEGORÍAS */}
        <select
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg font-medium text-stone-800"
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

      {/* Tabla de Productos */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Producto & Categoría</th>
                <th className="py-3 px-4">Materia Activa & Registro SAG</th>
                <th className="py-3 px-4">Stock Actual</th>
                <th className="py-3 px-4">Consumo Acumulado</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInventario.map((item) => {
                const isLow = item.stockActual <= item.stockMinimo;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{item.nombreComercial}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>{item.materiaActiva}</div>
                      <span className="text-[10px] text-stone-400 font-mono">{item.numeroRegistroSAG}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-sm">
                      <span className={isLow ? 'text-red-700' : 'text-stone-900'}>
                        {item.stockActual} {item.unidad}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-emerald-800">
                      {item.consumoHistoricoAcumulado} {item.unidad}
                    </td>
                    <td className="py-3 px-4 text-stone-600">{item.ubicacionBodega}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-stone-600 hover:text-emerald-900 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setInsumoToDelete(item)}
                          className="p-1.5 text-stone-400 hover:text-red-700 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInventario.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-stone-400">
                    No hay productos con este filtro. Haz clic en <strong>"+ Ingresar Nuevo Insumo"</strong> para agregar el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo / Editar Insumo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-300" />
                {editingInsumo ? 'Editar Insumo de Bodega' : 'Ingresar Insumo a Bodega'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Kasumin / Podastik MAX"
                    value={nombreComercial}
                    onChange={(e) => setNombreComercial(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Categoría Específica *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaInsumo)}
                    className="w-full p-2 border rounded-lg bg-white font-semibold text-stone-800"
                  >
                    <option value="Fungicida">Fungicida (Botrytis / Oídio)</option>
                    <option value="Insecticida">Insecticida</option>
                    <option value="Acaricida">Acaricida (Falsa Arañita)</option>
                    <option value="Bactericida">Bactericida (Cobres / Psa)</option>
                    <option value="Herbicida">Herbicida</option>
                    <option value="Fitorregulador">Fitorregulador / Dormancia</option>
                    <option value="Bioestimulante">Bioestimulante / Algas</option>
                    <option value="Fertilizante">Fertilizante</option>
                    <option value="Coadyuvante">Coadyuvante / Adherente</option>
                    <option value="Desinfectante">Desinfectante de Herramientas</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Materia Activa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Kasugamicina / Oxido Cuproso"
                  value={materiaActiva}
                  onChange={(e) => setMateriaActiva(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Stock Actual *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={stockActual}
                    onChange={(e) => setStockActual(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unidad</label>
                  <select
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="L">Litros (L)</option>
                    <option value="kg">Kilos (kg)</option>
                    <option value="cc">cc</option>
                    <option value="g">Gramos (g)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">N° Registro SAG</label>
                  <input
                    type="text"
                    value={numeroRegistroSAG}
                    onChange={(e) => setNumeroRegistroSAG(e.target.value)}
                    placeholder="Ej: SAG-1944"
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ubicación Bodega</label>
                  <input
                    type="text"
                    value={ubicacionBodega}
                    onChange={(e) => setUbicacionBodega(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
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
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg cursor-pointer hover:bg-emerald-700"
                >
                  Guardar en Bodega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {insumoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 border border-stone-200 space-y-3">
            <h3 className="font-bold text-sm text-stone-900">¿Eliminar insumo de bodega?</h3>
            <p className="text-stone-600">
              Se eliminará <strong>{insumoToDelete.nombreComercial}</strong> ({insumoToDelete.categoria}).
            </p>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setInsumoToDelete(null)} className="px-4 py-2 border rounded-lg cursor-pointer">
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteInsumo(insumoToDelete.id);
                  setInsumoToDelete(null);
                  showToast('Insumo eliminado');
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
