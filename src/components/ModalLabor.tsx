import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  CloudSun, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Package, 
  Droplets,
  Edit2,
  Calendar,
  Sparkles,
  Scissors,
  Bug,
  Apple,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { RegistroLabor, Parcela, TipoLabor, InsumoInventario, ClimaCondiciones, UsuarioPredio } from '../types/campo';

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
  const [maquinariaEquipo, setMaquinariaEquipo] = useState<string>('Nebulizadora para parrón Hardi 2000L');
  const [aplicadorNombre, setAplicadorNombre] = useState<string>('Carlos Morales Vega');
  const [carnetAplicador, setCarnetAplicador] = useState<string>('APL-SAG-8921');
  const [estadoFenologicoBBCH, setEstadoFenologicoBBCH] = useState<string>('BBCH 57 (Botones florales visibles en kiwi)');
  
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
  const [fuenteAgua, setFuenteAgua] = useState<string>('Pozo Profundo N°1 Fundo La Cabaña');
  const [descontarDePozo, setDescontarDePozo] = useState<boolean>(true);

  // Cosecha
  const [kilosRecolectados, setKilosRecolectados] = useState<number | ''>('');
  const [calibreCalidad, setCalibreCalidad] = useState<string>('Exportación Calibre 30-33');
  const [destinoProducto, setDestinoProducto] = useState<'Exportación Fresco' | 'Mercado Interno' | 'Agroindustria / Proceso'>('Exportación Fresco');
  const [loteTrazabilidad, setLoteTrazabilidad] = useState<string>('');
  const [binsCosechados, setBinsCosechados] = useState<number | ''>('');

  // Labor Cultural / Poda
  const [tipoLaborCultural, setTipoLaborCultural] = useState<string>('Poda en verde y deschuponado');
  const [cuadrillaPersonas, setCuadrillaPersonas] = useState<number | ''>(4);

  // Monitoreo
  const [nivelInfestacion, setNivelInfestacion] = useState<'Bajo (<5%)' | 'Medio (5-15%)' | 'Crítico (>15%)' | 'No detectado'>('Bajo (<5%)');
  const [umbralSuperado, setUmbralSuperado] = useState<boolean>(false);
  const [accionSugerida, setAccionSugerida] = useState<string>('');

  // Metadata
  const [costoEstimadoCLP, setCostoEstimadoCLP] = useState<number | ''>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [registradoPor, setRegistradoPor] = useState<string>('Diego Pereira');

  // GPS state
  const [gpsStatus, setGpsStatus] = useState<string>('');

  // Synchronize form state whenever modal opens or initialLabor changes
  useEffect(() => {
    if (isOpen) {
      if (initialLabor) {
        // Populating from existing labor
        setTipoLabor(initialLabor.tipoLabor);
        setParcelaId(initialLabor.parcelaId || (parcelas[0]?.id ?? ''));
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
        setFuenteAgua(initialLabor.fuenteAgua || 'Pozo Profundo N°1 Fundo La Cabaña');
        setDescontarDePozo(Boolean(initialLabor.registroPozoId));
        setKilosRecolectados(initialLabor.kilosRecolectados ?? '');
        setCalibreCalidad(initialLabor.calibreCalidad || 'Exportación Calibre 30-33');
        setDestinoProducto(initialLabor.destinoProducto || 'Exportación Fresco');
        setLoteTrazabilidad(initialLabor.loteTrazabilidad || '');
        setBinsCosechados(initialLabor.kilosRecolectados ? Math.round(Number(initialLabor.kilosRecolectados) / 400) : '');
        setNivelInfestacion(initialLabor.nivelInfestacion || 'Bajo (<5%)');
        setUmbralSuperado(initialLabor.umbralSuperado ?? false);
        setAccionSugerida(initialLabor.accionSugerida || '');
        setCostoEstimadoCLP(initialLabor.costoEstimadoCLP ?? '');
        setObservaciones(initialLabor.observaciones || '');
        setRegistradoPor(initialLabor.registradoPor || 'Diego Pereira');
        if (initialLabor.condicionesClima) {
          setTemperaturaC(initialLabor.condicionesClima.temperaturaC ?? 17.5);
          setHumedadRelativa(initialLabor.condicionesClima.humedadRelativa ?? 62);
          setVelocidadVientoKmH(initialLabor.condicionesClima.velocidadVientoKmH ?? 5.2);
          setVientoDireccion(initialLabor.condicionesClima.vientoDireccion ?? 'Sur-Suroeste');
        }
      } else {
        // Resetting completely to clean defaults for a new labor
        const defParcId = defaultParcelaId || parcelas[0]?.id || '';
        const defTipo = defaultTipoLabor || 'fitosanitario';
        setTipoLabor(defTipo);
        setParcelaId(defParcId);
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
        setMaquinariaEquipo('Nebulizadora para parrón Hardi 2000L');
        setAplicadorNombre('Carlos Morales Vega');
        setCarnetAplicador('APL-SAG-8921');
        setEstadoFenologicoBBCH('BBCH 57 (Botones florales visibles en kiwi)');
        setAbonoProducto('');
        setFormulacionNPK('');
        setDosisAbonoKgHa('');
        setMetodoAplicacionAbono('Fertirriego');
        setDuracionRiegoHoras(4.5);
        setVolumenM3(380);
        setFuenteAgua('Pozo Profundo N°1 Fundo La Cabaña');
        setDescontarDePozo(true);
        setKilosRecolectados('');
        setCalibreCalidad('Exportación Calibre 30-33');
        setDestinoProducto('Exportación Fresco');
        setLoteTrazabilidad('');
        setBinsCosechados('');
        setTipoLaborCultural('Poda en verde y deschuponado');
        setCuadrillaPersonas(4);
        setNivelInfestacion('Bajo (<5%)');
        setUmbralSuperado(false);
        setAccionSugerida('');
        setCostoEstimadoCLP('');
        setObservaciones('');
        const currentUser = usuarios.find(u => u.id === activeUserId);
        setRegistradoPor(currentUser?.nombre || 'Diego Pereira');
        setTemperaturaC(climaActual?.temperaturaC ?? 17.5);
        setHumedadRelativa(climaActual?.humedadRelativa ?? 62);
        setVelocidadVientoKmH(climaActual?.velocidadVientoKmH ?? 5.2);
        setVientoDireccion(climaActual?.vientoDireccion ?? 'Sur-Suroeste');
      }
      setGpsStatus('');
    }
  }, [isOpen, initialLabor, defaultParcelaId, defaultTipoLabor, activeUserId]);

  if (!isOpen) return null;

  // Selected parcela object
  const currentParcela = parcelas.find(p => p.id === parcelaId) || parcelas[0];

  // Handle inventory selection
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

  const handleDosisChange = (val: number | '') => {
    setDosisPorHa(val);
    if (val !== '' && currentParcela) {
      setTotalInsumoUtilizado(Number((Number(val) * currentParcela.superficieHa).toFixed(2)));
    }
  };

  const handleParcelaChange = (newParcId: string) => {
    setParcelaId(newParcId);
    const p = parcelas.find(x => x.id === newParcId);
    if (p && dosisPorHa !== '') {
      setTotalInsumoUtilizado(Number((Number(dosisPorHa) * p.superficieHa).toFixed(2)));
    }
  };

  const selectedInsumo = inventario.find(i => i.id === selectedInsumoId);

  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocalización no soportada en este navegador');
      return;
    }
    setGpsStatus('Obteniendo coordenadas satelitales...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)} (±${Math.round(pos.coords.accuracy)}m)`;
        setGpsStatus(`GPS fijado: ${coords}`);
        setObservaciones((prev) => prev ? `${prev} | Coordenadas: ${coords}` : `Coordenadas: ${coords}`);
      },
      (err) => {
        setGpsStatus(`Aviso GPS: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parcelaNombre = currentParcela ? currentParcela.nombre : 'Cuartel General';

    let defaultDesc = '';
    switch (tipoLabor) {
      case 'fitosanitario':
        defaultDesc = `Aplicación fitosanitaria de ${productoComercial || 'producto'} en ${parcelaNombre}`;
        break;
      case 'fertilizacion':
        defaultDesc = `Fertilización con ${abonoProducto || 'nutrientes'} en ${parcelaNombre}`;
        break;
      case 'riego':
        defaultDesc = `Riego de mantención (${volumenM3 || 0} m³) en ${parcelaNombre}`;
        break;
      case 'cosecha':
        defaultDesc = `Cosecha de Kiwi Hayward (${kilosRecolectados || 0} kg) en ${parcelaNombre}`;
        break;
      case 'labor_cultural':
        defaultDesc = `${tipoLaborCultural || 'Labor cultural / Poda'} en ${parcelaNombre}`;
        break;
      case 'monitoreo':
        defaultDesc = `Monitoreo sanitario de ${plagaObjetivo || 'plagas'} en ${parcelaNombre}`;
        break;
      default:
        defaultDesc = `Labor agrícola en ${parcelaNombre}`;
    }

    const laborData: RegistroLabor = {
      id: initialLabor ? initialLabor.id : `lab-${Date.now()}`,
      fecha: fecha || new Date().toISOString().slice(0, 10),
      hora: hora || '08:00',
      parcelaId: currentParcela?.id || parcelaId,
      parcelaNombre,
      tipoLabor,
      descripcionGeneral: descripcionGeneral.trim() || defaultDesc,
      insumoId: tipoLabor === 'fitosanitario' || tipoLabor === 'fertilizacion' ? (selectedInsumoId || undefined) : undefined,
      productoComercial: tipoLabor === 'fitosanitario' ? (productoComercial || undefined) : undefined,
      materiaActiva: tipoLabor === 'fitosanitario' ? (materiaActiva || undefined) : undefined,
      numeroRegistroSAG: tipoLabor === 'fitosanitario' ? (numeroRegistroSAG || undefined) : undefined,
      plagaObjetivo: tipoLabor === 'fitosanitario' || tipoLabor === 'monitoreo' ? (plagaObjetivo || undefined) : undefined,
      dosisPorHa: tipoLabor === 'fitosanitario' && dosisPorHa !== '' ? Number(dosisPorHa) : undefined,
      unidadDosis: tipoLabor === 'fitosanitario' ? unidadDosis : undefined,
      volumenCaldoLHa: (tipoLabor === 'fitosanitario' || tipoLabor === 'fertilizacion') && volumenCaldoLHa !== '' ? Number(volumenCaldoLHa) : undefined,
      totalInsumoUtilizado: tipoLabor === 'fitosanitario' && totalInsumoUtilizado !== '' ? Number(totalInsumoUtilizado) : undefined,
      plazoSeguridadDias: tipoLabor === 'fitosanitario' && plazoSeguridadDias !== '' ? Number(plazoSeguridadDias) : undefined,
      plazoReingresoHoras: tipoLabor === 'fitosanitario' && plazoReingresoHoras !== '' ? Number(plazoReingresoHoras) : undefined,
      maquinariaEquipo: maquinariaEquipo || undefined,
      aplicadorNombre: aplicadorNombre || undefined,
      carnetAplicador: carnetAplicador || undefined,
      estadoFenologicoBBCH: estadoFenologicoBBCH || undefined,
      condicionesClima: {
        temperaturaC: temperaturaC !== '' ? Number(temperaturaC) : 17.5,
        humedadRelativa: humedadRelativa !== '' ? Number(humedadRelativa) : 62,
        velocidadVientoKmH: velocidadVientoKmH !== '' ? Number(velocidadVientoKmH) : 5.2,
        vientoDireccion: vientoDireccion || 'Sur'
      },
      abonoProducto: tipoLabor === 'fertilizacion' ? (abonoProducto || undefined) : undefined,
      formulacionNPK: tipoLabor === 'fertilizacion' ? (formulacionNPK || undefined) : undefined,
      dosisAbonoKgHa: tipoLabor === 'fertilizacion' && dosisAbonoKgHa !== '' ? Number(dosisAbonoKgHa) : undefined,
      metodoAplicacionAbono: tipoLabor === 'fertilizacion' ? metodoAplicacionAbono : undefined,
      duracionRiegoHoras: tipoLabor === 'riego' && duracionRiegoHoras !== '' ? Number(duracionRiegoHoras) : undefined,
      volumenM3: tipoLabor === 'riego' && volumenM3 !== '' ? Number(volumenM3) : undefined,
      litrosAgua: tipoLabor === 'riego' && volumenM3 !== '' ? Number(volumenM3) * 1000 : undefined,
      fuenteAgua: tipoLabor === 'riego' ? fuenteAgua : undefined,
      registroPozoId: initialLabor?.registroPozoId,
      kilosRecolectados: tipoLabor === 'cosecha' && kilosRecolectados !== '' ? Number(kilosRecolectados) : undefined,
      calibreCalidad: tipoLabor === 'cosecha' ? calibreCalidad : undefined,
      destinoProducto: tipoLabor === 'cosecha' ? destinoProducto : undefined,
      loteTrazabilidad: tipoLabor === 'cosecha' ? loteTrazabilidad : undefined,
      nivelInfestacion: tipoLabor === 'monitoreo' ? nivelInfestacion : undefined,
      umbralSuperado: tipoLabor === 'monitoreo' ? umbralSuperado : undefined,
      accionSugerida: tipoLabor === 'monitoreo' ? accionSugerida : undefined,
      costoEstimadoCLP: costoEstimadoCLP !== '' ? Number(costoEstimadoCLP) : undefined,
      observaciones: observaciones || undefined,
      registradoPor: registradoPor || 'Diego Pereira'
    };

    onSave(laborData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isEditing 
            ? 'bg-emerald-950 text-white border-emerald-900' 
            : 'bg-stone-50 border-stone-200 text-stone-900'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isEditing ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-900'
              }`}>
                {isEditing ? 'Modo Edición' : 'Nueva Entrada'}
              </span>
              <h2 className="text-base font-bold">
                {isEditing ? 'Editar Labor Agrícola' : 'Registrar Nueva Labor en Cuaderno Oficial'}
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isEditing ? 'text-emerald-200' : 'text-stone-500'}`}>
              {isEditing 
                ? `Editando registro de ${initialLabor?.fecha} · ${initialLabor?.parcelaNombre}` 
                : 'Fundo La Cabaña · Trazabilidad oficial SAG / GlobalGAP para Kiwi Hayward'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isEditing ? 'text-emerald-200 hover:text-white hover:bg-emerald-800' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          
          {/* Tipo de Labor Buttons */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide mb-2">
              Tipo de Actividad / Labor *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { id: 'fitosanitario', label: 'Fitosanitario', icon: ShieldCheck, color: 'hover:border-amber-500' },
                { id: 'fertilizacion', label: 'Fertilización', icon: Layers, color: 'hover:border-emerald-500' },
                { id: 'riego', label: 'Riego Pozo', icon: Droplets, color: 'hover:border-sky-500' },
                { id: 'cosecha', label: 'Cosecha Kiwis', icon: Apple, color: 'hover:border-purple-500' },
                { id: 'labor_cultural', label: 'Poda / Cultural', icon: Scissors, color: 'hover:border-stone-500' },
                { id: 'monitoreo', label: 'Monitoreo / Psa', icon: Bug, color: 'hover:border-indigo-500' },
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = tipoLabor === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTipoLabor(item.id as TipoLabor)}
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all flex flex-col items-start gap-1 font-semibold ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-600/30'
                        : `bg-stone-50 text-stone-700 border-stone-200 ${item.color} hover:bg-white`
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`} />
                    <span className="text-[11px] leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cuartel, Fecha, Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Cuartel de Kiwis *
              </label>
              <select
                required
                value={parcelaId}
                onChange={(e) => handleParcelaChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 font-medium focus:ring-1 focus:ring-emerald-700"
              >
                {parcelas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.variedad} - {p.superficieHa} ha)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Fecha de Ejecución *
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Hora de Inicio
              </label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Descripción General */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Descripción de la labor agrícola *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Aplicación preventiva de Switch para Botrytis en floración de Kiwi Hayward"
              value={descripcionGeneral}
              onChange={(e) => setDescripcionGeneral(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 text-stone-900"
            />
          </div>

          {/* 1. SECCIÓN FITOSANITARIO CON INVENTARIO INTEGRADO */}
          {tipoLabor === 'fitosanitario' && (
            <div className="space-y-3.5 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Parámetros Fitosanitarios & Insumo de Bodega
                </span>
                <span className="text-[11px] text-amber-800 font-normal">
                  Superficie a tratar: <strong className="font-mono">{currentParcela?.superficieHa} ha</strong>
                </span>
              </div>

              {/* Selector de Insumo de Bodega */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-800 mb-1">
                  Vincular Insumo de Bodega Fundo La Cabaña (Descuento automático)
                </label>
                <select
                  value={selectedInsumoId}
                  onChange={(e) => handleSelectInsumo(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg font-medium text-stone-900"
                >
                  <option value="">-- Seleccionar producto de bodega o escribir manual abajo --</option>
                  {inventario.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombreComercial} ({item.categoria}) · Stock: {item.stockActual} {item.unidad} (Mín: {item.stockMinimo})
                    </option>
                  ))}
                </select>
                {selectedInsumo && (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-stone-600 bg-white p-2 rounded border border-amber-200">
                    <span>Materia Activa: <strong>{selectedInsumo.materiaActiva}</strong></span>
                    <span>
                      Stock Disponible: <strong className={selectedInsumo.stockActual <= selectedInsumo.stockMinimo ? 'text-red-700 font-mono' : 'text-emerald-800 font-mono'}>
                        {selectedInsumo.stockActual} {selectedInsumo.unidad}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Producto Comercial *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Switch 62.5 WG"
                    value={productoComercial}
                    onChange={(e) => setProductoComercial(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Materia Activa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Cyprodinil + Fludioxonil"
                    value={materiaActiva}
                    onChange={(e) => setMateriaActiva(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    N° Registro SAG
                  </label>
                  <input
                    type="text"
                    placeholder="SAG 2481"
                    value={numeroRegistroSAG}
                    onChange={(e) => setNumeroRegistroSAG(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Plaga o Enfermedad
                  </label>
                  <input
                    type="text"
                    placeholder="Botrytis / Psa / Brevipalpus"
                    value={plagaObjetivo}
                    onChange={(e) => setPlagaObjetivo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Dosis / Hectárea
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.01"
                      value={dosisPorHa}
                      onChange={(e) => handleDosisChange(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                    />
                    <select
                      value={unidadDosis}
                      onChange={(e) => setUnidadDosis(e.target.value as any)}
                      className="px-1.5 py-1.5 text-[11px] bg-white border border-stone-300 rounded-lg"
                    >
                      <option value="kg/ha">kg/ha</option>
                      <option value="L/ha">L/ha</option>
                      <option value="cc/100L">cc/100L</option>
                      <option value="g/100L">g/100L</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-950 mb-1">
                    Total Insumo Bodega
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalInsumoUtilizado}
                    onChange={(e) => setTotalInsumoUtilizado(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-emerald-50 border border-emerald-400 font-bold font-mono rounded-lg text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Carencia (Días) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={plazoSeguridadDias}
                    onChange={(e) => setPlazoSeguridadDias(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Maquinaria / Nebulizadora
                  </label>
                  <input
                    type="text"
                    value={maquinariaEquipo}
                    onChange={(e) => setMaquinariaEquipo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Aplicador Calificado
                  </label>
                  <input
                    type="text"
                    value={aplicadorNombre}
                    onChange={(e) => setAplicadorNombre(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Carnet Aplicador SAG
                  </label>
                  <input
                    type="text"
                    value={carnetAplicador}
                    onChange={(e) => setCarnetAplicador(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. SECCIÓN FERTILIZACIÓN */}
          {tipoLabor === 'fertilizacion' && (
            <div className="space-y-3.5 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
              <div className="text-xs font-bold text-emerald-950 flex items-center justify-between">
                <span>Plan de Fertilización y Nutrición en Kiwis Hayward</span>
                <span className="text-[11px] font-normal text-emerald-800">
                  Cuartel: {currentParcela?.nombre} ({currentParcela?.superficieHa} ha)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Fertilizante en Bodega
                  </label>
                  <select
                    value={selectedInsumoId}
                    onChange={(e) => {
                      setSelectedInsumoId(e.target.value);
                      const item = inventario.find(i => i.id === e.target.value);
                      if (item) {
                        setAbonoProducto(item.nombreComercial);
                        setFormulacionNPK(item.materiaActiva);
                      }
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  >
                    <option value="">-- Seleccionar o escribir manual --</option>
                    {inventario.filter(i => i.categoria === 'Fertilizante').map(i => (
                      <option key={i.id} value={i.id}>
                        {i.nombreComercial} (Stock: {i.stockActual} {i.unidad})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Producto / Abono *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nitrato de Calcio Soluble"
                    value={abonoProducto}
                    onChange={(e) => setAbonoProducto(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Dosis (kg o L/ha)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="45"
                    value={dosisAbonoKgHa}
                    onChange={(e) => setDosisAbonoKgHa(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Método de Aplicación
                </label>
                <select
                  value={metodoAplicacionAbono}
                  onChange={(e) => setMetodoAplicacionAbono(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                >
                  <option value="Fertirriego">Fertirriego automatizado con inyector Venturi</option>
                  <option value="Foliar">Foliar con nebulizadora</option>
                  <option value="Al voleo / Fondo">Al voleo en camellón</option>
                  <option value="Localizado en hilera">Localizado en la hilera de plantas</option>
                </select>
              </div>
            </div>
          )}

          {/* 3. SECCIÓN RIEGO Y POZO PROFUNDO */}
          {tipoLabor === 'riego' && (
            <div className="space-y-3.5 bg-sky-50/50 p-4 rounded-xl border border-sky-200">
              <div className="text-xs font-bold text-sky-950 flex items-center justify-between">
                <span>Riego Tecnificado y Extracción de Pozo Profundo</span>
                <span className="text-sky-800 font-mono text-[11px]">Fundo La Cabaña</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Duración (Horas)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={duracionRiegoHoras}
                    onChange={(e) => setDuracionRiegoHoras(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Volumen Extraído (m³)
                  </label>
                  <input
                    type="number"
                    value={volumenM3}
                    onChange={(e) => setVolumenM3(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Litros Totales de Agua
                  </label>
                  <div className="px-3 py-1.5 bg-sky-100 border border-sky-300 rounded-lg text-xs font-bold font-mono text-sky-950">
                    {volumenM3 !== '' ? (Number(volumenM3) * 1000).toLocaleString() : 0} L
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Fuente de Agua
                </label>
                <input
                  type="text"
                  value={fuenteAgua}
                  onChange={(e) => setFuenteAgua(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <input
                  type="checkbox"
                  id="descontarPozo"
                  checked={descontarDePozo}
                  onChange={(e) => setDescontarDePozo(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-700"
                />
                <label htmlFor="descontarPozo" className="font-semibold text-stone-800">
                  Registrar / Sincronizar automáticamente en el libro oficial de extracción del Pozo Profundo
                </label>
              </div>
            </div>
          )}

          {/* 4. SECCIÓN COSECHA DE KIWIS */}
          {tipoLabor === 'cosecha' && (
            <div className="space-y-3.5 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
              <div className="text-xs font-bold text-purple-950 flex items-center justify-between">
                <span>Registro de Cosecha de Kiwi Hayward (Bins y Kilos)</span>
                <span className="text-[11px] font-normal text-purple-800">
                  Cuartel: {currentParcela?.nombre}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Bins Cosechados (aprox. 400 kg/bin)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="25"
                    value={binsCosechados}
                    onChange={(e) => {
                      const b = e.target.value === '' ? '' : Number(e.target.value);
                      setBinsCosechados(b);
                      if (b !== '') setKilosRecolectados(Number(b) * 400);
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Kilos Totales Cosechados *
                  </label>
                  <input
                    type="number"
                    required
                    step="10"
                    placeholder="10000"
                    value={kilosRecolectados}
                    onChange={(e) => setKilosRecolectados(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono font-bold text-purple-950"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Calibre Comercial
                  </label>
                  <select
                    value={calibreCalidad}
                    onChange={(e) => setCalibreCalidad(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  >
                    <option value="Exportación Calibre 27-30 (Grande)">Exportación Calibre 27-30 (Grande)</option>
                    <option value="Exportación Calibre 30-33 (Estándar)">Exportación Calibre 30-33 (Estándar)</option>
                    <option value="Exportación Calibre 36-39">Exportación Calibre 36-39</option>
                    <option value="Mercado Nacional / Cat II">Mercado Nacional / Cat II</option>
                    <option value="Agroindustria / Pulpa">Agroindustria / Pulpa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Destino Comercial
                  </label>
                  <select
                    value={destinoProducto}
                    onChange={(e) => setDestinoProducto(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  >
                    <option value="Exportación Fresco">Exportación Fresco (Packing)</option>
                    <option value="Mercado Interno">Mercado Interno Mayorista</option>
                    <option value="Agroindustria / Proceso">Agroindustria / Proceso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Código Lote de Trazabilidad
                  </label>
                  <input
                    type="text"
                    placeholder="LOT-2026-HAY-01"
                    value={loteTrazabilidad}
                    onChange={(e) => setLoteTrazabilidad(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. SECCIÓN LABOR CULTURAL / PODA */}
          {tipoLabor === 'labor_cultural' && (
            <div className="space-y-3.5 bg-stone-100/70 p-4 rounded-xl border border-stone-300">
              <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
                <span>Labor Cultural, Poda y Manejo de Canopia en Kiwi</span>
                <span className="text-[11px] text-stone-600">Cuartel: {currentParcela?.nombre}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Tipo de Labor Cultural
                  </label>
                  <select
                    value={tipoLaborCultural}
                    onChange={(e) => setTipoLaborCultural(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  >
                    <option value="Poda en verde y deschuponado">Poda en verde y deschuponado</option>
                    <option value="Poda invernal de producción">Poda invernal de producción</option>
                    <option value="Amarre y arqueo de cargadores">Amarre y arqueo de cargadores</option>
                    <option value="Raleo de flores / botones">Raleo de flores / botones</option>
                    <option value="Raleo de frutos planos / deformes">Raleo de frutos planos / deformes</option>
                    <option value="Desmalezado mecánico entre hileras">Desmalezado mecánico entre hileras</option>
                    <option value="Mantenimiento de parrón y alambres">Mantenimiento de parrón y alambres</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Dotación de Cuadrilla (Operarios)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="4"
                    value={cuadrillaPersonas}
                    onChange={(e) => setCuadrillaPersonas(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Herramientas / Maquinaria
                  </label>
                  <input
                    type="text"
                    placeholder="Tijeras de poda Felco desinfectadas con alcohol 70°"
                    value={maquinariaEquipo}
                    onChange={(e) => setMaquinariaEquipo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Jefe de Cuadrilla / Supervisor
                  </label>
                  <input
                    type="text"
                    placeholder="Carlos Morales Vega"
                    value={aplicadorNombre}
                    onChange={(e) => setAplicadorNombre(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. SECCIÓN MONITOREO Y SCOUTING */}
          {tipoLabor === 'monitoreo' && (
            <div className="space-y-3.5 bg-indigo-50/50 p-4 rounded-xl border border-indigo-200">
              <div className="text-xs font-bold text-indigo-950 flex items-center justify-between">
                <span>Monitoreo Sanitario, Detección de Plagas y Scouting</span>
                <span className="text-[11px] text-indigo-800">Cuartel: {currentParcela?.nombre}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Plaga o Enfermedad Monitoreada
                  </label>
                  <input
                    type="text"
                    placeholder="Brevipalpus chilensis / Psa / Botrytis"
                    value={plagaObjetivo}
                    onChange={(e) => setPlagaObjetivo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Nivel de Infestación Detectado
                  </label>
                  <select
                    value={nivelInfestacion}
                    onChange={(e) => setNivelInfestacion(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                  >
                    <option value="No detectado">No detectado (0%)</option>
                    <option value="Bajo (<5%)">Bajo (&lt;5% de órganos)</option>
                    <option value="Medio (5-15%)">Medio (5-15% de órganos)</option>
                    <option value="Crítico (>15%)">Crítico (&gt;15% de órganos)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    ¿Supera Umbral Económico?
                  </label>
                  <select
                    value={umbralSuperado ? 'si' : 'no'}
                    onChange={(e) => setUmbralSuperado(e.target.value === 'si')}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg font-bold ${
                      umbralSuperado ? 'bg-red-50 text-red-900 border border-red-300' : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    <option value="no">NO - Bajo Umbral (Monitoreo regular)</option>
                    <option value="si">SÍ - Supera Umbral (Requiere Tratamiento)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Recomendación Agronómica Sugerida
                </label>
                <input
                  type="text"
                  placeholder="Ej: Mantener monitoreo en 7 días / Programar aplicación de acaricida por presencia en envés"
                  value={accionSugerida}
                  onChange={(e) => setAccionSugerida(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* CONDICIONES CLIMÁTICAS & TERRENO */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-amber-600" />
                Condiciones Climáticas al Momento de la Labor
              </span>
              <button
                type="button"
                onClick={handleCaptureGPS}
                className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                Capturar Coordenadas GPS
              </button>
            </div>

            {gpsStatus && (
              <p className="text-[11px] text-emerald-800 mb-2 font-mono bg-emerald-50 p-1.5 rounded border border-emerald-200">{gpsStatus}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] text-stone-500 mb-1 font-medium">Temperatura (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={temperaturaC}
                  onChange={(e) => setTemperaturaC(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-500 mb-1 font-medium">Humedad Relativa (%)</label>
                <input
                  type="number"
                  value={humedadRelativa}
                  onChange={(e) => setHumedadRelativa(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-500 mb-1 font-medium">Viento (km/h)</label>
                <input
                  type="number"
                  step="0.5"
                  value={velocidadVientoKmH}
                  onChange={(e) => setVelocidadVientoKmH(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-500 mb-1 font-medium">Dirección Viento</label>
                <input
                  type="text"
                  value={vientoDireccion}
                  onChange={(e) => setVientoDireccion(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Observaciones y Responsable */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-200">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Observaciones técnicas / Notas de campo
              </label>
              <textarea
                rows={2}
                placeholder="Detalles sobre presión de boquillas, calibración de parrón de kiwis, tarjetas hidrosensibles..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Registrado por (Responsable)
              </label>
              <input
                type="text"
                value={registradoPor}
                onChange={(e) => setRegistradoPor(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            <div className="text-[11px] text-stone-500">
              {isEditing ? 'Los cambios sobrescribirán el registro existente' : 'Se actualizará el stock de bodega y pozo si corresponde'}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                {isEditing ? <Check className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {isEditing ? 'Actualizar Registro de Labor' : 'Registrar Labor en Cuaderno'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
