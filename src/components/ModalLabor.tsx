import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  CloudSun, 
  MapPin, 
  ShieldCheck, 
  Package, 
  Droplets,
  Edit2,
  Scissors,
  Bug,
  Apple,
  Layers,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { RegistroLabor, Parcela, TipoLabor, InsumoInventario, ClimaCondiciones, UsuarioPredio, DestinoAplicacion } from '../types/campo';

interface ModalLaborProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (labor: RegistroLabor) => void;
  parcelas: Parcela[];
  inventario: InsumoInventario[];
  climaActual?: ClimaCondiciones;
  usuarios?: UsuarioPredio[];
  activeUserId?: string;
  initialLabor?: RegistroLabor | null;
  defaultParcelaId?: string;
  defaultTipoLabor?: TipoLabor;
}

export const ModalLabor: React.FC<ModalLaborProps> = ({
  isOpen,
  onClose,
  onSave,
  parcelas,
  inventario,
  climaActual,
  usuarios = [],
  activeUserId,
  initialLabor,
  defaultParcelaId,
  defaultTipoLabor
}) => {
  const isEditing = Boolean(initialLabor);

  const [tipoLabor, setTipoLabor] = useState<TipoLabor>('fitosanitario');
  const [parcelaId, setParcelaId] = useState<string>('');
  const [destinoAplicacion, setDestinoAplicacion] = useState<DestinoAplicacion>('Huerto de Kiwi');
  const [fecha, setFecha] = useState<string>('');
  const [hora, setHora] = useState<string>('08:00');
  const [descripcionGeneral, setDescripcionGeneral] = useState<string>('');
  
  // Fitosanitarios & Insumo
  const [selectedInsumoId, setSelectedInsumoId] = useState<string>('');
  const [productoComercial, setProductoComercial] = useState<string>('');
  const [materiaActiva, setMateriaActiva] = useState<string>('');
  const [numeroRegistroSAG, setNumeroRegistroSAG] = useState<string>('');
  const [plagaObjetivo, setPlagaObjetivo] = useState<string>('');
  const [dosisPorHa, setDosisPorHa] = useState<number | ''>(0.8);
  const [unidadDosis, setUnidadDosis] = useState<'L/ha' | 'kg/ha' | 'cc/100L' | 'g/100L'>('kg/ha');
  const [volumenCaldoLHa, setVolumenCaldoLHa] = useState<number | ''>(1200);
  const [totalInsumoUtilizado, setTotalInsumoUtilizado] = useState<number | ''>('');
  const [plazoSeguridadDias, setPlazoSeguridadDias] = useState<number | ''>(14);
  const [plazoReingresoHoras, setPlazoReingresoHoras] = useState<number | ''>(12);
  const [maquinariaEquipo, setMaquinariaEquipo] = useState<string>('Nebulizadora Hardi 2000L');
  const [aplicadorNombre, setAplicadorNombre] = useState<string>('Carlos Morales Vega');
  const [carnetAplicador, setCarnetAplicador] = useState<string>('APL-SAG-8921');
  const [estadoFenologicoBBCH, setEstadoFenologicoBBCH] = useState<string>('BBCH 57');
  
  // Clima
  const [temperaturaC, setTemperaturaC] = useState<number | ''>(17.5);
  const [humedadRelativa, setHumedadRelativa] = useState<number | ''>(62);
  const [velocidadVientoKmH, setVelocidadVientoKmH] = useState<number | ''>(5.2);
  const [vientoDireccion, setVientoDireccion] = useState<string>('Sur-Suroeste');

  // Fertilización
  const [abonoProducto, setAbonoProducto] = useState<string>('');
  const [formulacionNPK, setFormulacionNPK] = useState<string>('');
  const [dosisAbonoKgHa, setDosisAbonoKgHa] = useState<number | ''>('');
  const [metodoAplicacionAbono, setMetodoAplicacionAbono] = useState<'Fertirriego' | 'Foliar' | 'Al voleo / Fondo' | 'Localizado en hilera'>('Fertirriego');

  // Riego
  const [duracionRiegoHoras, setDuracionRiegoHoras] = useState<number | ''>(4.5);
  const [volumenM3, setVolumenM3] = useState<number | ''>(380);
  const [fuenteAgua, setFuenteAgua] = useState<string>('Pozo Profundo N°1');

  // Cosecha
  const [kilosRecolectados, setKilosRecolectados] = useState<number | ''>('');
  const [calibreCalidad, setCalibreCalidad] = useState<string>('Exportación Calibre 30-33');
  const [destinoProducto, setDestinoProducto] = useState<'Exportación Fresco' | 'Mercado Interno' | 'Agroindustria / Proceso'>('Exportación Fresco');
  const [loteTrazabilidad, setLoteTrazabilidad] = useState<string>('');

  // Metadata
  const [observaciones, setObservaciones] = useState<string>('');
  const [registradoPor, setRegistradoPor] = useState<string>('Diego Pereira');

  useEffect(() => {
    if (isOpen) {
      if (initialLabor) {
        setTipoLabor(initialLabor.tipoLabor);
        setParcelaId(initialLabor.parcelaId || (parcelas[0]?.id ?? ''));
        setDestinoAplicacion(initialLabor.destinoAplicacion || 'Huerto de Kiwi');
        setFecha(initialLabor.fecha);
        setHora(initialLabor.hora || '08:00');
        setDescripcionGeneral(initialLabor.descripcionGeneral || '');
        setSelectedInsumoId(initialLabor.insumoId || '');
        setProductoComercial(initialLabor.productoComercial || '');
        setMateriaActiva(initialLabor.materiaActiva || '');
        setNumeroRegistroSAG(initialLabor.numeroRegistroSAG || '');
        setPlagaObjetivo(initialLabor.plagaObjetivo || '');
        setDosisPorHa(initialLabor.dosisPorHa ?? '');
        setUnidadDosis(initialLabor.unidadDosis || 'kg/ha');
        setVolumenCaldoLHa(initialLabor.volumenCaldoLHa ?? 1200);
        setTotalInsumoUtilizado(initialLabor.totalInsumoUtilizado ?? '');
        setPlazoSeguridadDias(initialLabor.plazoSeguridadDias ?? 14);
        setPlazoReingresoHoras(initialLabor.plazoReingresoHoras ?? 12);
        setMaquinariaEquipo(initialLabor.maquinariaEquipo || '');
        setAplicadorNombre(initialLabor.aplicadorNombre || '');
        setCarnetAplicador(initialLabor.carnetAplicador || '');
        setEstadoFenologicoBBCH(initialLabor.estadoFenologicoBBCH || '');
        setAbonoProducto(initialLabor.abonoProducto || '');
        setFormulacionNPK(initialLabor.formulacionNPK || '');
        setDosisAbonoKgHa(initialLabor.dosisAbonoKgHa ?? '');
        setMetodoAplicacionAbono(initialLabor.metodoAplicacionAbono || 'Fertirriego');
        setDuracionRiegoHoras(initialLabor.duracionRiegoHoras ?? 4.5);
        setVolumenM3(initialLabor.volumenM3 ?? 380);
        setFuenteAgua(initialLabor.fuenteAgua || 'Pozo Profundo N°1');
        setKilosRecolectados(initialLabor.kilosRecolectados ?? '');
        setCalibreCalidad(initialLabor.calibreCalidad || 'Exportación Calibre 30-33');
        setDestinoProducto(initialLabor.destinoProducto || 'Exportación Fresco');
        setLoteTrazabilidad(initialLabor.loteTrazabilidad || '');
        setObservaciones(initialLabor.observaciones || '');
        setRegistradoPor(initialLabor.registradoPor || 'Diego Pereira');
      } else {
        const defParcId = defaultParcelaId || parcelas[0]?.id || '';
        setTipoLabor(defaultTipoLabor || 'fitosanitario');
        setParcelaId(defParcId);
        setDestinoAplicacion('Huerto de Kiwi');
        setFecha(new Date().toISOString().slice(0, 10));
        setHora('08:00');
        setDescripcionGeneral('');
        setSelectedInsumoId('');
        setProductoComercial('');
        setMateriaActiva('');
        setNumeroRegistroSAG('');
        setPlagaObjetivo('');
        setDosisPorHa(0.8);
        setUnidadDosis('kg/ha');
        setVolumenCaldoLHa(1200);
        setTotalInsumoUtilizado('');
        setPlazoSeguridadDias(14);
        setPlazoReingresoHoras(12);
        setMaquinariaEquipo('Nebulizadora Hardi 2000L');
        setAbonoProducto('');
        setFormulacionNPK('');
        setDosisAbonoKgHa('');
        setDuracionRiegoHoras(4.5);
        setVolumenM3(380);
        setFuenteAgua('Pozo Profundo N°1');
        setKilosRecolectados('');
        setObservaciones('');
        const currentUser = usuarios.find(u => u.id === activeUserId);
        setRegistradoPor(currentUser?.nombre || 'Diego Pereira');
      }
    }
  }, [isOpen, initialLabor, defaultParcelaId, defaultTipoLabor, activeUserId]);

  if (!isOpen) return null;

  const currentParcela = parcelas.find(p => p.id === parcelaId) || parcelas[0];

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
      if (dosisPorHa !== '' && currentParcela) {
        setTotalInsumoUtilizado(Number((Number(dosisPorHa) * currentParcela.superficieHa).toFixed(2)));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parcelaNombre = currentParcela ? currentParcela.nombre : 'Sector General';

    const laborData: RegistroLabor = {
      id: initialLabor ? initialLabor.id : `lab-${Date.now()}`,
      fecha: fecha || new Date().toISOString().slice(0, 10),
      hora: hora || '08:00',
      parcelaId: currentParcela?.id || parcelaId,
      parcelaNombre,
      tipoLabor,
      destinoAplicacion,
      descripcionGeneral: descripcionGeneral.trim() || `${tipoLabor} en ${destinoAplicacion} (${parcelaNombre})`,
      insumoId: selectedInsumoId || undefined,
      productoComercial: productoComercial || undefined,
      materiaActiva: materiaActiva || undefined,
      numeroRegistroSAG: numeroRegistroSAG || undefined,
      plagaObjetivo: plagaObjetivo || undefined,
      dosisPorHa: dosisPorHa !== '' ? Number(dosisPorHa) : undefined,
      unidadDosis,
      volumenCaldoLHa: volumenCaldoLHa !== '' ? Number(volumenCaldoLHa) : undefined,
      totalInsumoUtilizado: totalInsumoUtilizado !== '' ? Number(totalInsumoUtilizado) : undefined,
      plazoSeguridadDias: plazoSeguridadDias !== '' ? Number(plazoSeguridadDias) : undefined,
      plazoReingresoHoras: plazoReingresoHoras !== '' ? Number(plazoReingresoHoras) : undefined,
      maquinariaEquipo: maquinariaEquipo || undefined,
      aplicadorNombre: aplicadorNombre || undefined,
      carnetAplicador: carnetAplicador || undefined,
      abonoProducto: abonoProducto || undefined,
      formulacionNPK: formulacionNPK || undefined,
      dosisAbonoKgHa: dosisAbonoKgHa !== '' ? Number(dosisAbonoKgHa) : undefined,
      metodoAplicacionAbono,
      duracionRiegoHoras: duracionRiegoHoras !== '' ? Number(duracionRiegoHoras) : undefined,
      volumenM3: volumenM3 !== '' ? Number(volumenM3) : undefined,
      litrosAgua: volumenM3 !== '' ? Number(volumenM3) * 1000 : undefined,
      fuenteAgua,
      kilosRecolectados: kilosRecolectados !== '' ? Number(kilosRecolectados) : undefined,
      calibreCalidad,
      destinoProducto,
      loteTrazabilidad,
      observaciones: observaciones || undefined,
      registradoPor: registradoPor || 'Diego Pereira'
    };

    onSave(laborData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto text-xs">
      <div className="relative w-full max-w-3xl my-6 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-emerald-950 text-white">
          <div>
            <h2 className="text-base font-bold">
              {isEditing ? 'Editar Labor Agrícola' : 'Registrar Nueva Labor / Aplicación'}
            </h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              Control de destino de aplicación, descuento automático de bodega y cuaderno SAG
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-emerald-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* Tipo de Labor */}
          <div>
            <label className="block font-bold text-stone-800 uppercase mb-1.5">
              Tipo de Actividad *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'fitosanitario', label: 'Fitosanitario', icon: ShieldCheck },
                { id: 'fertilizacion', label: 'Fertilización', icon: Layers },
                { id: 'riego', label: 'Riego Pozo', icon: Droplets },
                { id: 'cosecha', label: 'Cosecha Kiwis', icon: Apple },
                { id: 'labor_cultural', label: 'Poda / Cultural', icon: Scissors },
                { id: 'monitoreo', label: 'Monitoreo', icon: Bug },
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = tipoLabor === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTipoLabor(item.id as TipoLabor)}
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

          {/* DESTINO DE LA LABOR (NUEVO) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
            <div>
              <label className="block font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-700" />
                Destino de la Labor / Producto *
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
              <label className="block font-bold text-stone-800 mb-1">
                Cuartel Específico
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
          </div>

          {/* Fecha y Hora */}
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

          {/* Descripción */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Descripción de la Labor *</label>
            <input
              type="text"
              required
              placeholder="Ej: Control preventivo con bactericida de cobre en huerto de kiwi"
              value={descripcionGeneral}
              onChange={(e) => setDescripcionGeneral(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* FITOSANITARIO / INSUMO */}
          {tipoLabor === 'fitosanitario' && (
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
                  <label className="block font-semibold text-stone-700 mb-1">Producto Comercial *</label>
                  <input
                    type="text"
                    required
                    value={productoComercial}
                    onChange={(e) => setProductoComercial(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
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

              <div className="grid grid-cols-3 gap-3">
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
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Carencia (Días)</label>
                  <input
                    type="number"
                    value={plazoSeguridadDias}
                    onChange={(e) => setPlazoSeguridadDias(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Maquinaria / Equipo</label>
                  <input
                    type="text"
                    value={maquinariaEquipo}
                    onChange={(e) => setMaquinariaEquipo(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Aplicador Responsable</label>
                  <input
                    type="text"
                    value={aplicadorNombre}
                    onChange={(e) => setAplicadorNombre(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* RIEGO */}
          {tipoLabor === 'riego' && (
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-sky-50 rounded-xl border border-sky-200">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Horas de Riego</label>
                <input
                  type="number"
                  step="0.5"
                  value={duracionRiegoHoras}
                  onChange={(e) => setDuracionRiegoHoras(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-white font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Metros Cúbicos (m³)</label>
                <input
                  type="number"
                  value={volumenM3}
                  onChange={(e) => setVolumenM3(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-white font-mono"
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
