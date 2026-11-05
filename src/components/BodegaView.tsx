import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  CheckCircle2,
  X,
  FlaskConical
} from 'lucide-react';
import { 
  InsumoInventario, 
  CategoriaInsumo, 
  DestinoUso, 
  EstadoFormaFertilizante, 
  SolubilidadFertilizante 
} from '../types/campo';

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
  const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
  const [selectedDestino, setSelectedDestino] = useState<string>('all');
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
  const [numeroRegistroSAG, setNumeroRegistroSAG] = useState('');
  
  // Fechas y Destino
  const [fechaElaboracion, setFechaElaboracion] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [destinoEspecifico, setDestinoEspecifico] = useState<DestinoUso>('Kiwis');
  
  // Fertilizante Detalle
  const [composicionQuimica, setComposicionQuimica] = useState('');
  const [formaFertilizante, setFormaFertilizante] = useState<EstadoFormaFertilizante>('Líquido');
  const [solubilidad, setSolubilidad] = useState<SolubilidadFertilizante>('Soluble');
  
  // Observaciones
  const [observaciones, setObservaciones] = useState('');

  const filteredInventario = inventario.filter((item) => {
    const matchesSearch = 
      item.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materiaActiva.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategoria === 'all' || item.categoria === selectedCategoria;
    const matchesDest = selectedDestino === 'all' || item.destinoEspecifico === selectedDestino;
    return matchesSearch && matchesCat && matchesDest;
  });

  const lowStockItems = inventario.filter(i => i.stockActual <= 5);

  const openNewModal = () => {
    setEditingInsumo(null);
    setNombreComercial('');
    setMateriaActiva('');
    setCategoria('Fungicida');
    setStockActual(10);
    setUnidad('L');
    setNumeroRegistroSAG('');
    setFechaElaboracion(new Date().toISOString().slice(0, 10));
    setFechaVencimiento('');
    setDestinoEspecifico('Kiwis');
    setComposicionQuimica('');
    setFormaFertilizante('Líquido');
    setSolubilidad('Soluble');
    setObservaciones('');
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
    setFechaElaboracion(item.fechaElaboracion || '');
    setFechaVencimiento(item.fechaVencimiento || '');
    setDestinoEspecifico(item.destinoEspecifico || 'Kiwis');
    setComposicionQuimica(item.composicionQuimica || '');
    setFormaFertilizante(item.formaFertilizante || 'Líquido');
    setSolubilidad(item.solubilidad || 'Soluble');
    setObservaciones(item.observaciones || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const esFert = categoria === 'Fertilizante';

    const itemData: InsumoInventario = {
      id: editingInsumo ? editingInsumo.id : `ins-${Date.now()}`,
      nombreComercial,
      materiaActiva,
      categoria,
      stockActual: Number(stockActual) || 0,
      unidad,
      numeroRegistroSAG: numeroRegistroSAG || undefined,
      fechaElaboracion: fechaElaboracion || undefined,
      fechaVencimiento: fechaVencimiento || undefined,
      destinoEspecifico,
      composicionQuimica: esFert ? composicionQuimica : undefined,
      formaFertilizante: esFert ? formaFertilizante : undefined,
      solubilidad: esFert ? solubilidad : undefined,
      observaciones: observaciones || undefined
    };

    if (editingInsumo) {
      onUpdateInsumo(itemData);
      showToast('Insumo actualizado en bodega');
    } else {
      onAddInsumo(itemData);
      showToast('Nuevo producto registrado en bodega');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-xs">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2.5 text-xs font-semibold">
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
          <p className="text-stone-500 text-[11px]">
            Control de existencias con vencimientos, lotes, composición de fertilizantes y asignación por destino.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 rounded-xl hover:bg-emerald-900 shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Ingresar Nuevo Insumo a Bodega
        </button>
      </div>

      {/* Alerta de Stock Bajo */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950 uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            Stock Bajo Crítico ({lowStockItems.length} productos)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockItems.map((item) => (
              <div key={item.id} className="p-2.5 bg-white rounded-xl border border-amber-200 flex justify-between items-center shadow-2xs">
                <div>
                  <div className="font-bold text-stone-900">{item.nombreComercial}</div>
                  <span className="text-[10px] text-stone-500">{item.categoria} ({item.destinoEspecifico || 'General'})</span>
                </div>
                <div className="text-right font-mono font-bold text-red-700 text-sm">
                  {item.stockActual} {item.unidad}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white border border-stone-200 rounded-xl shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o ingrediente activo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
          />
        </div>

        <select
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg font-semibold text-stone-800"
        >
          <option value="all">Todas las Categorías ({inventario.length})</option>
          <option value="Fungicida">Fungicida</option>
          <option value="Bactericida">Bactericida</option>
          <option value="Fungicida y Bactericida">Fungicida y Bactericida</option>
          <option value="Elicitor PSA">Elicitor PSA</option>
          <option value="Insecticida">Insecticida</option>
          <option value="Acariicida">Acariicida</option>
          <option value="Herbicida">Herbicida</option>
          <option value="Fertilizante">Fertilizante</option>
          <option value="Bioestimulante">Bioestimulante</option>
          <option value="Adyuvante / Coadyuvante">Adyuvante / Coadyuvante</option>
          <option value="Insumo de Riego">Insumo de Riego</option>
          <option value="Otro">Otro</option>
        </select>

        <select
          value={selectedDestino}
          onChange={(e) => setSelectedDestino(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg font-semibold text-stone-800"
        >
          <option value="all">Todos los Destinos</option>
          <option value="Kiwis">Kiwis</option>
          <option value="Vivero">Vivero</option>
          <option value="Quinta frutal">Quinta frutal</option>
          <option value="Casa patronal">Casa patronal</option>
          <option value="Uso General">Uso General</option>
        </select>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Producto / Categoría</th>
                <th className="p-3">Materia Activa / Composición</th>
                <th className="p-3">Destino</th>
                <th className="p-3">Stock Disponible</th>
                <th className="p-3">Fechas (Elab / Venc)</th>
                <th className="p-3">Detalle Fertilizante</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInventario.map((item) => {
                const isFert = item.categoria === 'Fertilizante';
                const isLow = item.stockActual <= 5;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3">
                      <strong className="font-bold text-stone-900 block text-xs">{item.nombreComercial}</strong>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 mt-0.5">
                        {item.categoria}
                      </span>
                      {item.numeroRegistroSAG && (
                        <span className="block text-[10px] text-stone-400 font-mono mt-0.5">SAG: {item.numeroRegistroSAG}</span>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="text-stone-800 font-semibold">{item.materiaActiva}</div>
                      {item.observaciones && (
                        <p className="text-[10px] text-stone-500 italic mt-0.5">{item.observaciones}</p>
                      )}
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-1 bg-stone-100 text-stone-800 rounded-md font-bold text-[10px]">
                        {item.destinoEspecifico || 'Uso General'}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-bold text-sm whitespace-nowrap">
                      <span className={isLow ? 'text-red-700' : 'text-emerald-900'}>
                        {item.stockActual} {item.unidad}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-[11px] whitespace-nowrap">
                      <div>Elab: <span className="text-stone-700">{item.fechaElaboracion || 'N/R'}</span></div>
                      <div>Venc: <span className={item.fechaVencimiento ? 'text-amber-800 font-bold' : 'text-stone-400'}>{item.fechaVencimiento || 'N/R'}</span></div>
                    </td>

                    <td className="p-3">
                      {isFert ? (
                        <div className="space-y-0.5 text-[10px]">
                          <div><strong className="text-stone-700">Comp:</strong> {item.composicionQuimica || 'N/A'}</div>
                          <div className="text-stone-600 font-semibold">{item.formaFertilizante} • {item.solubilidad}</div>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic text-[10px]">Fitosanitario</span>
                      )}
                    </td>

                    <td className="p-3 text-center whitespace-nowrap">
                      <button onClick={() => openEditModal(item)} className="p-1 text-blue-700 hover:bg-blue-50 rounded cursor-pointer mr-1">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setInsumoToDelete(item)} className="p-1 text-red-700 hover:bg-red-50 rounded cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredInventario.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No hay productos registrados con este filtro. Haz clic en <strong>"+ Ingresar Nuevo Insumo a Bodega"</strong>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo / Editar Insumo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-stone-200">
            <div className="px-6 py-4 border-b bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-300" />
                {editingInsumo ? 'Editar Insumo de Bodega' : 'Ingresar Insumo a Bodega'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Categoría del Insumo *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaInsumo)}
                    className="w-full p-2.5 bg-white border rounded-lg font-bold text-stone-900"
                  >
                    <option value="Fungicida">Fungicida</option>
                    <option value="Bactericida">Bactericida</option>
                    <option value="Fungicida y Bactericida">Fungicida y Bactericida</option>
                    <option value="Elicitor PSA">Elicitor PSA</option>
                    <option value="Insecticida">Insecticida</option>
                    <option value="Acariicida">Acariicida</option>
                    <option value="Herbicida">Herbicida</option>
                    <option value="Fertilizante">Fertilizante</option>
                    <option value="Bioestimulante">Bioestimulante</option>
                    <option value="Adyuvante / Coadyuvante">Adyuvante / Coadyuvante</option>
                    <option value="Insumo de Riego">Insumo de Riego</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Destino Específico *</label>
                  <select
                    value={destinoEspecifico}
                    onChange={(e) => setDestinoEspecifico(e.target.value as DestinoUso)}
                    className="w-full p-2.5 bg-white border rounded-lg font-bold text-stone-900"
                  >
                    <option value="Kiwis">Kiwis</option>
                    <option value="Vivero">Vivero</option>
                    <option value="Quinta frutal">Quinta frutal</option>
                    <option value="Casa patronal">Casa patronal</option>
                    <option value="Uso General">Uso General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Cobre Hidróxido 50 WP"
                    value={nombreComercial}
                    onChange={(e) => setNombreComercial(e.target.value)}
                    className="w-full p-2 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Materia Activa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Hidróxido de Cobre"
                    value={materiaActiva}
                    onChange={(e) => setMateriaActiva(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
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
                    className="w-full p-2 border rounded-lg font-mono font-bold bg-emerald-50 text-emerald-950"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unidad *</label>
                  <select
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white font-bold"
                  >
                    <option value="L">Litros (L)</option>
                    <option value="kg">Kilos (kg)</option>
                    <option value="cc">cc</option>
                    <option value="g">Gramos (g)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">N° Registro SAG</label>
                  <input
                    type="text"
                    placeholder="Ej: SAG-1234"
                    value={numeroRegistroSAG}
                    onChange={(e) => setNumeroRegistroSAG(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha de Elaboración</label>
                  <input
                    type="date"
                    value={fechaElaboracion}
                    onChange={(e) => setFechaElaboracion(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono bg-white"
                  />
                </div>
              </div>

              {categoria === 'Fertilizante' && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 space-y-3">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-emerald-700" />
                    Propiedades Técnicas del Fertilizante
                  </div>
                  
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Composición Química / NPK *</label>
                    <input
                      type="text"
                      placeholder="Ej: NPK 15-15-15"
                      value={composicionQuimica}
                      onChange={(e) => setComposicionQuimica(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Forma Física</label>
                      <select
                        value={formaFertilizante}
                        onChange={(e) => setFormaFertilizante(e.target.value as EstadoFormaFertilizante)}
                        className="w-full p-2 border rounded-lg bg-white"
                      >
                        <option value="Líquido">Líquido</option>
                        <option value="Granulado">Granulado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Solubilidad</label>
                      <select
                        value={solubilidad}
                        onChange={(e) => setSolubilidad(e.target.value as SolubilidadFertilizante)}
                        className="w-full p-2 border rounded-lg bg-white"
                      >
                        <option value="Soluble">Soluble (Apto riego / foliar)</option>
                        <option value="No soluble">No soluble (Aplicación suelo)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones / Notas de Bodega</label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ej: Mantener en lugar fresco..."
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 border space-y-3">
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

export const InventarioView = BodegaView;
