import React, { useState } from 'react';
import { 
  Apple, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Truck, 
  Layers, 
  Scale, 
  Award, 
  Calendar, 
  User, 
  Trash2, 
  Download, 
  Printer, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  X,
  Gauge
} from 'lucide-react';
import { Parcela, MuestreoMadurez, RegistroCosechaLote } from '../types/campo';

interface CosechaMadurezViewProps {
  parcelas: Parcela[];
  muestreos: MuestreoMadurez[];
  onAddMuestreo: (item: MuestreoMadurez) => void;
  onDeleteMuestreo: (id: string) => void;
  cosechas: RegistroCosechaLote[];
  onAddCosecha: (item: RegistroCosechaLote) => void;
  onDeleteCosecha: (id: string) => void;
  activeUserName?: string;
}

export const CosechaMadurezView: React.FC<CosechaMadurezViewProps> = ({
  parcelas,
  muestreos,
  onAddMuestreo,
  onDeleteMuestreo,
  cosechas,
  onAddCosecha,
  onDeleteCosecha,
  activeUserName = 'Administrador'
}) => {
  const [subTab, setSubTab] = useState<'madurez' | 'cosecha'>('madurez');
  
  // Modal states
  const [isModalMadurezOpen, setIsModalMadurezOpen] = useState(false);
  const [isModalCosechaOpen, setIsModalCosechaOpen] = useState(false);

  // Form states for Madurez
  const [madParcelaId, setMadParcelaId] = useState(parcelas[0]?.id || '');
  const [madFecha, setMadFecha] = useState(new Date().toISOString().slice(0, 10));
  const [madSector, setMadSector] = useState('');
  const [madBrix, setMadBrix] = useState<number>(6.4);
  const [madFirmeza, setMadFirmeza] = useState<number>(15.0);
  const [madMateriaSeca, setMadMateriaSeca] = useState<number>(16.2);
  const [madColorSemillas, setMadColorSemillas] = useState<'100% Negras' | '75% Pardo Oscuro' | 'Verdosas / Inmaduras'>('100% Negras');
  const [madTempAmbiente, setMadTempAmbiente] = useState<number>(18);
  const [madObservaciones, setMadObservaciones] = useState('');

  // Form states for Cosecha
  const [cosParcelaId, setCosParcelaId] = useState(parcelas[0]?.id || '');
  const [cosFecha, setCosFecha] = useState(new Date().toISOString().slice(0, 10));
  const [cosHilera, setCosHilera] = useState('Hileras 1 a 20');
  const [cosBins, setCosBins] = useState<number>(30);
  const [cosPesoBin, setCosPesoBin] = useState<number>(390);
  const [cosCuadrilla, setCosCuadrilla] = useState('Cuadrilla Los Espinos (15 personas)');
  const [cosNumCosecheros, setCosNumCosecheros] = useState<number>(15);
  const [cosCalibre, setCosCalibre] = useState<'Calibre 27-30 (Jumbo)' | 'Calibre 33-36 (Grande)' | 'Calibre 39-42 (Medio)' | 'Descarte / Agroindustria'>('Calibre 33-36 (Grande)');
  const [cosGuia, setCosGuia] = useState('GD-');
  const [cosPacking, setCosPacking] = useState('Frusan Central San Fernando');
  const [cosObservaciones, setCosObservaciones] = useState('');

  // Cálculos estadísticos
  const brixPromedio = muestreos.length 
    ? (muestreos.reduce((acc, m) => acc + m.solidosSolublesBrix, 0) / muestreos.length).toFixed(1) 
    : '0.0';
  
  const firmezaPromedio = muestreos.length 
    ? (muestreos.reduce((acc, m) => acc + m.firmezaLibras, 0) / muestreos.length).toFixed(1) 
    : '0.0';
  
  const materiaSecaPromedio = muestreos.length 
    ? (muestreos.reduce((acc, m) => acc + m.materiaSecaPorcentaje, 0) / muestreos.length).toFixed(1) 
    : '0.0';

  const totalBinsCosechados = cosechas.reduce((acc, c) => acc + c.cantidadBins, 0);
  const totalKilosCosechados = cosechas.reduce((acc, c) => acc + c.kilosTotales, 0);
  const totalHectareasPredio = parcelas.reduce((acc, p) => acc + p.superficieHa, 0);
  const rendimientoPromedioTonHa = totalHectareasPredio > 0 
    ? ((totalKilosCosechados / 1000) / totalHectareasPredio).toFixed(1) 
    : '0.0';

  // Autorización automática según °Brix
  const calcularAutorizacion = (brix: number): 'Autorizado Cosecha' | 'En Observación' | 'No Autorizado' => {
    if (brix >= 6.2) return 'Autorizado Cosecha';
    if (brix >= 5.8) return 'En Observación';
    return 'No Autorizado';
  };

  const handleSubmitMadurez = (e: React.FormEvent) => {
    e.preventDefault();
    const selParcela = parcelas.find(p => p.id === madParcelaId) || parcelas[0];
    const nuevoMuestreo: MuestreoMadurez = {
      id: `mad-${Date.now()}`,
      fecha: madFecha,
      parcelaId: selParcela.id,
      parcelaNombre: selParcela.nombre,
      variedad: 'Hayward',
      cuartelSector: madSector || undefined,
      solidosSolublesBrix: Number(madBrix),
      firmezaLibras: Number(madFirmeza),
      materiaSecaPorcentaje: Number(madMateriaSeca),
      colorSemillas: madColorSemillas,
      estadoAutorizacion: calcularAutorizacion(Number(madBrix)),
      temperaturaAmbienteMuestreoC: Number(madTempAmbiente),
      evaluadorNombre: activeUserName,
      observaciones: madObservaciones || undefined
    };

    onAddMuestreo(nuevoMuestreo);
    setIsModalMadurezOpen(false);
    setMadObservaciones('');
    setMadSector('');
  };

  const handleSubmitCosecha = (e: React.FormEvent) => {
    e.preventDefault();
    const selParcela = parcelas.find(p => p.id === cosParcelaId) || parcelas[0];
    const kilos = Math.round(Number(cosBins) * Number(cosPesoBin));
    
    const nuevaCosecha: RegistroCosechaLote = {
      id: `cos-${Date.now()}`,
      fecha: cosFecha,
      parcelaId: selParcela.id,
      parcelaNombre: selParcela.nombre,
      variedad: 'Hayward',
      cuartelHilera: cosHilera || undefined,
      cantidadBins: Number(cosBins),
      pesoPromedioBinKg: Number(cosPesoBin),
      kilosTotales: kilos,
      cuadrillaCosecheros: cosCuadrilla,
      numeroCosecheros: Number(cosNumCosecheros),
      calidadCalibrePredominante: cosCalibre,
      guiaDespachoNumero: cosGuia || undefined,
      packingDestino: cosPacking,
      responsableCosecha: activeUserName,
      observaciones: cosObservaciones || undefined
    };

    onAddCosecha(nuevaCosecha);
    setIsModalCosechaOpen(false);
    setCosObservaciones('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <Apple className="w-3.5 h-3.5 text-emerald-300" />
            Cultivar Exclusivo: Kiwi Hayward
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Control de Cosecha & Madurez de Fruta
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mt-1">
            Monitoreo agronómico de sólidos solubles (°Brix min. 6.2° SAG), presión de pulpa con penetrómetro, materia seca y control de bins cosechados por cuartel.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {subTab === 'madurez' ? (
            <button
              onClick={() => setIsModalMadurezOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nuevo Muestreo °Brix
            </button>
          ) : (
            <button
              onClick={() => setIsModalCosechaOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Registrar Bins Cosechados
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Toggle */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setSubTab('madurez')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            subTab === 'madurez'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Gauge className="w-4 h-4" />
          Muestreo de Madurez Pre-Cosecha (°Brix & Firmeza)
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-800 text-emerald-100">
            {muestreos.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('cosecha')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            subTab === 'cosecha'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          Registro Diario de Cosecha & Bins
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-800 text-emerald-100">
            {cosechas.length}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: MADUREZ PRE-COSECHA */}
      {subTab === 'madurez' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Sólidos Solubles Promedio
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
                  {brixPromedio}°
                </span>
                <span className="text-xs text-stone-600 font-medium">Brix</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                SAG Exportación: $\ge 6.2^\circ$
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Firmeza Promedio Pulpa
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-800">
                  {firmezaPromedio}
                </span>
                <span className="text-xs text-stone-600 font-medium">libras (lb)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Óptimo cosecha: 14.0 - 16.5 lb
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Materia Seca (% MS)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-teal-800">
                  {materiaSecaPromedio}%
                </span>
                <span className="text-xs text-stone-600 font-medium">MS</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Clave para guarda frigorífica prolongada
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Cuarteles Aptos para Corte
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                  {muestreos.filter(m => m.estadoAutorizacion === 'Autorizado Cosecha').length}
                </span>
                <span className="text-xs text-stone-600 font-medium">de {parcelas.length} cuarteles</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Cumplen protocolo SAG
              </p>
            </div>
          </div>

          {/* Semáforo Guía Agronómica de Madurez */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Protocolo de Cosecha SAG & Comité del Kiwi de Chile
                </h4>
                <p className="text-xs text-stone-600">
                  El cultivar <strong>Hayward</strong> no debe cosecharse bajo 6.2° Brix para evitar fruta desabrida o astringente en destino.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 border border-red-200">
                &lt; 5.8° Brix: Inmaduro
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
                5.8° - 6.1°: Observación
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
                $\ge$ 6.2°: Autorizado SAG
              </span>
            </div>
          </div>

          {/* Listado de Muestreos */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">
                Historial de Muestreos de Madurez en Kiwi Hayward
              </h3>
              <span className="text-xs text-stone-500">
                Total: {muestreos.length} muestreos
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {muestreos.map((m) => {
                const badgeColor = 
                  m.estadoAutorizacion === 'Autorizado Cosecha' 
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                    : m.estadoAutorizacion === 'En Observación' 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-red-100 text-red-900 border-red-300';

                return (
                  <div key={m.id} className="p-4 hover:bg-stone-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-stone-900">
                            {m.parcelaNombre}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                            {m.estadoAutorizacion}
                          </span>
                          {m.cuartelSector && (
                            <span className="text-xs text-stone-500 font-medium">
                              · {m.cuartelSector}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            {m.fecha}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            {m.evaluadorNombre}
                          </span>
                          <span>
                            Semillas: <strong>{m.colorSemillas}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Medidores */}
                      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-semibold text-stone-400">
                            °Brix
                          </span>
                          <span className={`text-base font-extrabold ${
                            m.solidosSolublesBrix >= 6.2 ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {m.solidosSolublesBrix}°
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-semibold text-stone-400">
                            Firmeza
                          </span>
                          <span className="text-base font-extrabold text-stone-800">
                            {m.firmezaLibras} lb
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-semibold text-stone-400">
                            Materia Seca
                          </span>
                          <span className="text-base font-extrabold text-teal-700">
                            {m.materiaSecaPorcentaje}%
                          </span>
                        </div>

                        <button
                          onClick={() => onDeleteMuestreo(m.id)}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2"
                          title="Eliminar muestreo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {m.observaciones && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg mt-2 border border-stone-200/60 italic">
                        "{m.observaciones}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: COSECHA DIARIA Y BINS */}
      {subTab === 'cosecha' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Total Bins Cosechados
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-900">
                  {totalBinsCosechados}
                </span>
                <span className="text-xs text-stone-600 font-medium">bins</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                ~390 kg netos por bin estándar
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Kilos Totales Cosechados
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
                  {(totalKilosCosechados / 1000).toFixed(1)}
                </span>
                <span className="text-xs text-stone-600 font-medium">toneladas</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {totalKilosCosechados.toLocaleString('es-CL')} kg registrados
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Rendimiento Predio
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-teal-800">
                  {rendimientoPromedioTonHa}
                </span>
                <span className="text-xs text-stone-600 font-medium">t/ha promedio</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Superficie evaluada: {totalHectareasPredio} ha
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Despachos a Packing
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-800">
                  {cosechas.length}
                </span>
                <span className="text-xs text-stone-600 font-medium">lotes / guías</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Con trazabilidad completa de origen
              </p>
            </div>
          </div>

          {/* Tabla de Cosechas */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Registros de Cosecha & Entrega de Bins
                </h3>
                <p className="text-xs text-stone-500">
                  Control de cosecha de cuadrillas y guías de despacho a centrales frutícolas
                </p>
              </div>
              <span className="text-xs text-stone-500">
                Total: {cosechas.length} lotes
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {cosechas.map((c) => (
                <div key={c.id} className="p-4 hover:bg-stone-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">
                          {c.parcelaNombre}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {c.calidadCalibrePredominante}
                        </span>
                        {c.guiaDespachoNumero && (
                          <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                            {c.guiaDespachoNumero}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {c.fecha}
                        </span>
                        <span>
                          Cuadrilla: <strong>{c.cuadrillaCosecheros}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-stone-400" />
                          Destino: <strong>{c.packingDestino}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-semibold text-stone-400">
                          Bins
                        </span>
                        <span className="text-base font-extrabold text-amber-900">
                          {c.cantidadBins} bins
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-semibold text-stone-400">
                          Kilos Totales
                        </span>
                        <span className="text-base font-extrabold text-emerald-800">
                          {c.kilosTotales.toLocaleString('es-CL')} kg
                        </span>
                      </div>

                      <button
                        onClick={() => onDeleteCosecha(c.id)}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {c.observaciones && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg mt-2 border border-stone-200/60 italic">
                      "{c.observaciones}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO MUESTREO DE MADUREZ */}
      {isModalMadurezOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-emerald-950 text-white">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm sm:text-base">Nuevo Muestreo de Madurez (°Brix)</h3>
              </div>
              <button 
                onClick={() => setIsModalMadurezOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMadurez} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cuartel (Kiwi Hayward) *
                  </label>
                  <select
                    value={madParcelaId}
                    onChange={(e) => setMadParcelaId(e.target.value)}
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
                    Fecha de Muestreo *
                  </label>
                  <input
                    type="date"
                    value={madFecha}
                    onChange={(e) => setMadFecha(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sector o Hileras Muestreadas
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sector Norte, hileras 1 a 15 (20 frutos por muestra)"
                  value={madSector}
                  onChange={(e) => setMadSector(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                />
              </div>

              {/* Medidas Clave */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    °Brix Refractómetro *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="18.0"
                    value={madBrix}
                    onChange={(e) => setMadBrix(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-extrabold p-2 rounded-lg border border-emerald-300 bg-white focus:outline-emerald-800 text-emerald-900"
                    required
                  />
                  <span className="text-[10px] text-emerald-800 font-medium block mt-0.5">
                    SAG min: 6.2°
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-1">
                    Firmeza (lb/cm²) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="5.0"
                    max="25.0"
                    value={madFirmeza}
                    onChange={(e) => setMadFirmeza(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-extrabold p-2 rounded-lg border border-stone-300 bg-white focus:outline-stone-800 text-stone-900"
                    required
                  />
                  <span className="text-[10px] text-stone-600 font-medium block mt-0.5">
                    Penetrómetro 7.9mm
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-teal-950 mb-1">
                    Materia Seca (% MS)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10.0"
                    max="25.0"
                    value={madMateriaSeca}
                    onChange={(e) => setMadMateriaSeca(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-extrabold p-2 rounded-lg border border-teal-300 bg-white focus:outline-teal-800 text-teal-900"
                  />
                  <span className="text-[10px] text-teal-800 font-medium block mt-0.5">
                    Ideal &gt; 15.5%
                  </span>
                </div>
              </div>

              {/* Semáforo visual en el modal */}
              <div className="p-3 rounded-xl border flex items-center justify-between text-xs font-semibold bg-white border-stone-200">
                <span className="text-stone-600">Diagnóstico de Aptitud SAG:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  madBrix >= 6.2 
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                    : madBrix >= 5.8 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}>
                  {calcularAutorizacion(madBrix)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Coloración de Semillas
                  </label>
                  <select
                    value={madColorSemillas}
                    onChange={(e: any) => setMadColorSemillas(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 bg-white"
                  >
                    <option value="100% Negras">100% Negras (Madurez Completa)</option>
                    <option value="75% Pardo Oscuro">75% Pardo Oscuro</option>
                    <option value="Verdosas / Inmaduras">Verdosas / Inmaduras</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    T° Ambiente al Muestreo (°C)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={madTempAmbiente}
                    onChange={(e) => setMadTempAmbiente(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Observaciones Agronómicas
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles de homogeneidad de pulpa, textura, sabor y recomendaciones para corte..."
                  value={madObservaciones}
                  onChange={(e) => setMadObservaciones(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalMadurezOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                >
                  Guardar Muestreo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVA COSECHA Y BINS */}
      {isModalCosechaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-amber-950 text-white">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm sm:text-base">Registrar Bins Cosechados</h3>
              </div>
              <button 
                onClick={() => setIsModalCosechaOpen(false)}
                className="p-1 text-amber-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCosecha} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cuartel Cosechado *
                  </label>
                  <select
                    value={cosParcelaId}
                    onChange={(e) => setCosParcelaId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800 bg-white"
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
                    Fecha de Cosecha *
                  </label>
                  <input
                    type="date"
                    value={cosFecha}
                    onChange={(e) => setCosFecha(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                    required
                  />
                </div>
              </div>

              {/* Bins y Kilos */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                <div>
                  <label className="block text-[11px] font-bold text-amber-950 mb-1">
                    Cantidad Bins *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={cosBins}
                    onChange={(e) => setCosBins(parseInt(e.target.value) || 0)}
                    className="w-full text-base font-extrabold p-2 rounded-lg border border-amber-300 bg-white focus:outline-amber-800 text-amber-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-1">
                    Peso Neto / Bin (kg)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="600"
                    value={cosPesoBin}
                    onChange={(e) => setCosPesoBin(parseInt(e.target.value) || 0)}
                    className="w-full text-base font-bold p-2 rounded-lg border border-stone-300 bg-white focus:outline-stone-800 text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    Kilos Calculados
                  </label>
                  <div className="w-full text-base font-extrabold p-2 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300">
                    {(cosBins * cosPesoBin).toLocaleString('es-CL')} kg
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cuadrilla de Cosecha
                  </label>
                  <input
                    type="text"
                    value={cosCuadrilla}
                    onChange={(e) => setCosCuadrilla(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    N° Cosecheros en Cuadrilla
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cosNumCosecheros}
                    onChange={(e) => setCosNumCosecheros(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Calibre Predominante
                  </label>
                  <select
                    value={cosCalibre}
                    onChange={(e: any) => setCosCalibre(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800 bg-white"
                  >
                    <option value="Calibre 27-30 (Jumbo)">Calibre 27-30 (Jumbo)</option>
                    <option value="Calibre 33-36 (Grande)">Calibre 33-36 (Grande)</option>
                    <option value="Calibre 39-42 (Medio)">Calibre 39-42 (Medio)</option>
                    <option value="Descarte / Agroindustria">Descarte / Agroindustria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    N° Guía de Despacho
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: GD-88415"
                    value={cosGuia}
                    onChange={(e) => setCosGuia(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Packing / Frigorífico de Destino *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Frusan San Fernando / David del Curto"
                  value={cosPacking}
                  onChange={(e) => setCosPacking(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Observaciones de Cosecha
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles del corte, cuidado con tijera de recolección, uso de guantes, etc..."
                  value={cosObservaciones}
                  onChange={(e) => setCosObservaciones(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalCosechaOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-700 hover:bg-amber-600 text-white rounded-lg shadow-sm"
                >
                  Registrar Cosecha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
