import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  Edit2, 
  Trash2, 
  X, 
  ShieldCheck, 
  Calendar, 
  Tag 
} from 'lucide-react';
import { InsumoInventario, CategoriaInsumo } from '../types/campo';

interface BodegaViewProps {
  inventario: InsumoInventario[];
  onAddInsumo: (insumo: InsumoInventario) => void;
  onUpdateInsumo: (insumo: InsumoInventario) => void;
  onDeleteInsumo: (id: string) => void;
}

export const BodegaView: React.FC<BodegaViewProps> = ({
  inventario = [],
  onAddInsumo,
  onUpdateInsumo,
  onDeleteInsumo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<InsumoInventario | null>(null);

  // Campos del Formulario
  const [nombreComercial, setNombreComercial] = useState('');
  const [materiaActiva, setMateriaActiva] = useState('');
  const [categoria, setCategoria] = useState<CategoriaInsumo>('Fungicida y Bactericida');
  const [stockActual, setStockActual] = useState<number>(0);
  const [unidad, setUnidad] = useState<'kg' | 'L' | 'g' | 'cc'>('kg');
  const [numeroRegistroSAG, setNumeroRegistroSAG] = useState('');
  const [ubicacionBodega, setUbicacionBodega] = useState('');

  const filteredInventario = inventario.filter(item => {
    const matchesSearch = 
      item.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materiaActiva.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.numeroRegistroSAG || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.categoria === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const openNewModal = () => {
    setEditingInsumo(null);
    setNombreComercial('');
    setMateriaActiva('');
    setCategoria('Fungicida y Bactericida');
    setStockActual(0);
    setUnidad('kg');
    setNumeroRegistroSAG('');
    setUbicacionBodega('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InsumoInventario) => {
    setEditingInsumo(item);
    setNombreComercial(item.nombreComercial);
    setMateriaActiva(item.materiaActiva);
    setCategoria(item.categoria);
    setStockActual(item.stockActual);
    setUnidad(item.unidad);
    setNumeroRegistroSAG(item.numeroRegistroSAG || '');
    setUbicacionBodega(item.ubicacionBodega || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const insumoData: InsumoInventario = {
      id: editingInsumo ? editingInsumo.id : `ins-${Date.now()}`,
      nombreComercial,
      materiaActiva,
      categoria,
      stockActual: Number(stockActual),
      unidad,
      numeroRegistroSAG: numeroRegistroSAG || undefined,
      ubicacionBodega: ubicacionBodega || undefined
    };

    if (editingInsumo) {
      onUpdateInsumo(insumoData);
    } else {
      onAddInsumo(insumoData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* HEADER DE BODEGA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-800" />
            Control de Inventario & Bodega de Insumos
          </h1>
          <p className="text-stone-500 text-[11px] mt-0.5">
            Gestión de stock de fitosanitarios, fertilizantes y productos agrícolas con trazabilidad de registros SAG.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> + Añadir Insumo
        </button>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre comercial, ingrediente activo o registro SAG..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="md:col-span-5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-800 focus:outline-none"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Fungicida y Bactericida">Fungicida y Bactericida</option>
            <option value="Insecticida">Insecticida</option>
            <option value="Fertilizante">Fertilizante</option>
            <option value="Herbicida">Herbicida</option>
            <option value="Fitorregulador">Fitorregulador</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      {/* LISTADO DE PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventario.map((item) => {
          const isLowStock = item.stockActual <= 5;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-3 flex flex-col justify-between transition-all ${
                isLowStock ? 'border-amber-300 bg-amber-50/10' : 'border-stone-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 font-bold rounded-md text-[10px] border border-stone-200">
                    {item.categoria}
                  </span>
                  {isLowStock && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-md text-[10px] flex items-center gap-1 border border-amber-300">
                      <AlertTriangle className="w-3 h-3 text-amber-700" /> Stock Bajo
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-stone-900 text-sm leading-tight">
                    {item.nombreComercial}
                  </h3>
                  <p className="text-stone-500 text-[11px] font-medium mt-0.5">
                    Materia Activa: <strong className="text-stone-700">{item.materiaActiva}</strong>
                  </p>
                </div>

                {item.numeroRegistroSAG && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 w-fit">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" /> Reg. SAG: {item.numeroRegistroSAG}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Disponible en Bodega</span>
                  <span className={`text-lg font-black font-mono ${isLowStock ? 'text-amber-800' : 'text-emerald-950'}`}>
                    {item.stockActual} <span className="text-xs font-semibold">{item.unidad}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                    title="Editar producto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteInsumo(item.id)}
                    className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CREAR / EDITAR INSUMO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-stone-200">
            <div className="px-6 py-4 border-b bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-300" />
                {editingInsumo ? 'Editar Producto de Bodega' : 'Ingresar Nuevo Insumo a Bodega'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nombre Comercial *</label>
                <input
                  type="text"
                  required
                  value={nombreComercial}
                  onChange={(e) => setNombreComercial(e.target.value)}
                  placeholder="Ej: Cobre Hidróxido 50 WP"
                  className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Materia / Ingrediente Activo *</label>
                <input
                  type="text"
                  required
                  value={materiaActiva}
                  onChange={(e) => setMateriaActiva(e.target.value)}
                  placeholder="Ej: Hidróxido de Cobre"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Categoría *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaInsumo)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white font-medium"
                  >
                    <option value="Fungicida y Bactericida">Fungicida / Bactericida</option>
                    <option value="Insecticida">Insecticida</option>
                    <option value="Fertilizante">Fertilizante</option>
                    <option value="Herbicida">Herbicida</option>
                    <option value="Fitorregulador">Fitorregulador</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Registro SAG</label>
                  <input
                    type="text"
                    value={numeroRegistroSAG}
                    onChange={(e) => setNumeroRegistroSAG(e.target.value)}
                    placeholder="Ej: 1234-SAG"
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Stock Inicial / Actual *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={stockActual}
                    onChange={(e) => setStockActual(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Unidad de Medida *</label>
                  <select
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white font-bold"
                  >
                    <option value="kg">Kilos (kg)</option>
                    <option value="L">Litros (L)</option>
                    <option value="g">Gramos (g)</option>
                    <option value="cc">Centímetros cúbicos (cc)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg cursor-pointer hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer shadow-sm"
                >
                  Guardar en Bodega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
