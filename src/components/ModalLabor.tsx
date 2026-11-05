import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Scissors, 
  Bug, 
  Apple, 
  Layers, 
  Compass, 
  Sprout
} from 'lucide-react';
import { RegistroLabor, Parcela, TipoLabor, InsumoInventario, UsuarioPredio, DestinoAplicacion } from '../types/campo';

interface ModalLaborProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (labor: RegistroLabor) => void;
  labor?: RegistroLabor | null;
  parcelas: Parcela[];
  inventario: InsumoInventario[];
  usuarios?: UsuarioPredio[];
  activeUserId?: string;
}

export const ModalLabor: React.FC<ModalLaborProps> = ({
  isOpen,
  onClose,
  onSave,
  labor,
  parcelas = [],
  inventario = [],
  usuarios = [],
  activeUserId
}) => {
  const isEditing = Boolean(labor);

  const [tipoLabor, setTipoLabor] = useState<TipoLabor>('Aplicacion Fitosanitaria');
  const [parcelaId, setParcelaId] = useState<string>('');
  const [destinoAplicacion, setDestinoAplicacion] = useState<DestinoAplicacion>('Huerto de Kiwi');
  const [superficieManual, setSuperficieManual] = useState<number>(0.5);
  const [fecha, setFecha] = useState<string>('');
  const [hora, setHora] = useState<string>('08:00');
  const [descripcionGeneral, setDescripcionGeneral] = useState<string>('');
  
  // Fitosanitarios & Insumo
  const [selectedInsumoId, setSelectedInsumoId] = useState<string>('');
  const [productoComercial, setProductoComercial] = useState<string>('');
  const [materiaActiva, setMateriaActiva] = useState<string>('');
  const [numeroRegistroSAG, setNumeroRegistroSAG] = useState<string>('');
  const [dosisPorHa, setDosisPorHa] = useState<number | ''>(0.8);
  const [unidadDosis, setUnidadDosis] = useState<'L/ha' | 'kg/ha' | 'cc/100L' | 'g/100L'>('kg/ha');
  const [totalInsumoUtilizado, setTotalInsumoUtilizado] = useState<number | ''>('');
  
  // Fertilización
  const [abonoProducto, setAbonoProducto] = useState<string>('');
  const [dosisAbonoKgHa, setDosisAbonoKgHa] = useState<number | ''>('');

  // Cosecha
  const [kilosRecolectados, setKilosRecolectados] = useState<number | ''>('');
  const [calibreCalidad, setCalibreCalidad] = useState<string>('Exportación Calibre 30-33');

  // Metadata
  const [observaciones, setObservaciones] = useState<string>('');
  const [registradoPor, setRegistradoPor] = useState<string>('');

  const esHuerto = destinoAplicacion === 'Huerto de Kiwi';

  useEffect(() => {
    if (isOpen) {
      const currentUser = usuarios.find(u => u.id === activeUserId);
      const defaultUserNombre = currentUser?.nombre || 'Diego Pereira Ramirez';

      if (labor) {
        setTipoLabor(labor.tipoLabor);
        setParcelaId(labor.parcelaId || (parcelas[0]?.id ?? ''));
        setFecha(labor.fecha);
        setDescripcionGeneral(labor.descripcion || '');
        setSelectedInsumoId(labor.insumoId || '');
        setProductoComercial(labor.insumoNombre || '');
        setDosisPorHa(labor.dosisPorHa ?? '');
        setTotalInsumoUtilizado(labor.totalInsumoUtilizado ?? '');
        setObservaciones(labor.observaciones || '');
        setRegistradoPor(labor.operadorNombre || defaultUserNombre);
      } else {
        setTipoLabor('Aplicacion Fitosanitaria');
        setParcelaId(parcelas[0]?.id || '');
        setDestinoAplicacion('Huerto de Kiwi');
        setSuperficieManual(0.5);
        setFecha(new Date().toISOString().slice(0, 10));
        setHora('08:00');
        setDescripcionGeneral('');
        setSelectedInsumoId('');
        setProductoComercial('');
        setMateriaActiva('');
        setNumeroRegistroSAG('');
        setDosisPorHa(0.8);
        setUnidadDosis('kg/ha');
        setTotalInsumoUtilizado('');
        setAbonoProducto('');
        setDosisAbonoKgHa('');
        setKilosRecolectados('');
        setObservaciones('');
        setRegistradoPor(defaultUserNombre);
      }
    }
  }, [isOpen, labor, activeUserId, parcelas, usuarios]);

  if (!isOpen) return null;

  const currentParcela = parcelas.find(p => p.id === parcelaId) || parcelas[0];
  const haEfectiva = esHuerto ? (currentParcela?.superficieHa || 1) : Number(superficieManual || 0.1);

  const handleSelectInsumo = (insumoId: string) => {
    setSelectedInsumoId(insumoId);
    const item = inventario.find(i => i.id === insumoId);
    if (item) {
      setProductoComercial(item.nombreComercial);
      setMateriaActiva(item.materiaActiva);
      setNumeroRegistroSAG(item.numeroRegistroSAG || '');
      if (item.unidad === 'kg') setUnidadDosis('kg/ha');
      if (item.unidad === 'L') setUnidadDosis('L/ha');
      if (item.unidad === 'g') setUnidadDosis('g/100L');
      if (item.unidad === 'cc') setUnidadDosis('cc/100L');
      if (dosisPorHa !== '') {
        setTotalInsumoUtilizado(Number((Number(dosisPorHa) * haEfectiva).toFixed(2)));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parcelaNombre = esHuerto ? (currentParcela ? currentParcela.nombre : 'Cuartel Kiwi') : destinoAplicacion;
    const insumoNombreFinal = productoComercial || (inventario.find(i => i.id === selectedInsumoId)?.nombreComercial) || abonoProducto;

    const laborData: RegistroLabor = {
      id: labor ? labor.id : `lab-${Date.now()}`,
      fecha: fecha || new Date().toISOString().slice(0, 10),
      parcelaId: esHuerto ? (currentParcela?.id || parcelaId || 'c1') : 'general',
      parcelaNombre,
      tipoLabor,
      descripcion: descripcionGeneral.trim() || `${tipoLabor} en ${parcelaNombre}`,
      operadorNombre: registradoPor || 'Operador Predio',
      insumoId: selectedInsumoId || undefined,
      insumoNombre: insumoNombreFinal || undefined,
      dosisPorHa: dosisPorHa !== '' ? Number(dosisPorHa) : undefined,
      totalInsumoUtilizado: totalInsumoUtilizado !== '' ? Number(totalInsumoUtilizado) : undefined,
      unidadInsumo: unidadDosis,
      observaciones: observaciones || undefined
    };

    onSave(laborData);
    onClose();
  };

  const tiposOpciones: { id: TipoLabor; label: string; icon: any }[] = [
    { id: 'Aplicacion Fitosanitaria', label: 'Fitosanitario', icon: ShieldCheck },
    { id: 'Fertilizacion', label: 'Fertilización', icon: Layers },
    { id: 'Poda', label: 'Poda / Cultural', icon: Scissors },
    { id: 'Cosecha', label: 'Cosecha Kiwis', icon: Apple },
    { id: 'Desmalezado', label: 'Desmalezado', icon: Sprout },
    { id: 'Otra', label: 'Otra / Monitoreo', icon: Bug }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto text-xs">
      <div className="relative w-full max-w-3xl my-6 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-emerald-950 text-white">
          <div>
            <h2 className="text-base font-bold">
              {isEditing ? 'Editar Labor Agrícola' : 'Registrar Nueva Labor / Aplicación'}
            </h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              Registro de labores del predio y descuento de insumos en inventario
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-emerald-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4">
          <div>
            <label className="block font-bold text-stone-800 uppercase mb-1.5">
              Tipo de Labor Agrícola *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {tiposOpciones.map((item) => {
                const IconComponent = item.icon;
                const isSelected = tipoLabor === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTipoLabor(item.id)}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 font-semibold cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
            <div>
              <label className="block font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-700" />
                Destino de la Labor / Aplicación *
              </label>
              <select
                value={destinoAplicacion}
                onChange={(e) => setDestinoAplicacion(e.target.value as DestinoAplicacion)}
                className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-bold text-stone-900"
              >
                <option value="Huerto de Kiwi">🥝 Huerto de Kiwi</option>
                <option value="Casa patronal">🏡 Casa patronal / Jardines</option>
                <option value="Quinta frutal">🍎 Quinta frutal</option>
                <option value="Control de praderas">🌾 Control de praderas / Cercos</option>
                <option value="Vivero">🌱 Vivero de plantas</option>
                <option value="Caminos y cercos">🚜 Caminos / Canales</option>
                <option value="Otro destino">📍 Otro destino</option>
              </select>
            </div>

            {esHuerto ? (
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Cuartel Específico *
                </label>
                <select
                  value={parcelaId}
                  onChange={(e) => setParcelaId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-medium"
                >
                  {parcelas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.superficieHa} ha)
                    </option>
                  ))}
                  {parcelas.length === 0 && <option value="general">Sector General</option>}
                </select>
              </div>
            ) : (
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Superficie Aproximada (ha) *
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.01"
                  required
                  value={superficieManual}
                  onChange={(e) => setSuperficieManual(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-mono font-bold"
                  placeholder="Ej: 0.5 ha"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Fecha de Ejecución *</label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full p-2 border rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Hora Inicio</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full p-2 border rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Descripción de la Labor *</label>
            <input
              type="text"
              required
              placeholder="Ej: Aplicación foliar preventiva en follaje"
              value={descripcionGeneral}
              onChange={(e) => setDescripcionGeneral(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {tipoLabor === 'Aplicacion Fitosanitaria' && (
            <div className="space-y-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Seleccionar Producto desde Bodega (Descuento automático)
                </label>
                <select
                  value={selectedInsumoId}
                  onChange={(e) => handleSelectInsumo(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="">-- Seleccionar insumo de bodega o escribir abajo --</option>
                  {inventario.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.categoria}] {item.nombreComercial} · Stock: {item.stockActual} {item.unidad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Producto Comercial</label>
                  <input
                    type="text"
                    value={productoComercial}
                    onChange={(e) => setProductoComercial(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Materia Activa</label>
                  <input
                    type="text"
                    value={materiaActiva}
                    onChange={(e) => setMateriaActiva(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">N° Registro SAG</label>
                  <input
                    type="text"
                    value={numeroRegistroSAG}
                    onChange={(e) => setNumeroRegistroSAG(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dosis / Ha</label>
                  <input
                    type="number"
                    step="0.01"
                    value={dosisPorHa}
                    onChange={(e) => setDosisPorHa(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Total Descontado</label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalInsumoUtilizado}
                    onChange={(e) => setTotalInsumoUtilizado(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-emerald-300 rounded-lg bg-emerald-50 font-bold font-mono text-emerald-950"
                  />
                </div>
              </div>
            </div>
          )}

          {tipoLabor === 'Fertilizacion' && (
            <div className="space-y-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Producto / Abono *</label>
                  <input
                    type="text"
                    required
                    value={abonoProducto}
                    onChange={(e) => setAbonoProducto(e.target.value)}
                    placeholder="Ej: Nitrato de Calcio"
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dosis (kg o L/ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dosisAbonoKgHa}
                    onChange={(e) => setDosisAbonoKgHa(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {tipoLabor === 'Cosecha' && (
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-purple-50 rounded-xl border border-purple-200">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kilos Cosechados *</label>
                <input
                  type="number"
                  required
                  value={kilosRecolectados}
                  onChange={(e) => setKilosRecolectados(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Calibre / Calidad</label>
                <input
                  type="text"
                  value={calibreCalidad}
                  onChange={(e) => setCalibreCalidad(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Observaciones</label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg cursor-pointer hover:bg-stone-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg cursor-pointer hover:bg-emerald-700"
            >
              Guardar Labor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
