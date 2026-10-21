import React, { useState } from 'react';
import { 
  Apple, 
  Plus, 
  Truck, 
  Calendar, 
  User, 
  Trash2, 
  X,
  Gauge,
  Award
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
  
  const [isModalMadurezOpen, setIsModalMadurezOpen] = useState(false);
  const [isModalCosechaOpen, setIsModalCosechaOpen] = useState(false);

  // Form states Madurez (SIN FIRMEZA)
  const [madParcelaId, setMadParcelaId] = useState(parcelas[0]?.id || '');
  const [madFecha, setMadFecha] = useState(new Date().toISOString().slice(0, 10));
  const [madSector, setMadSector] = useState('');
  const [madBrix, setMadBrix] = useState<number>(6.5);
  const [madMateriaSeca, setMadMateriaSeca] = useState<number>(16.0);
  const [madColorSemillas, setMadColorSemillas] = useState<'100% Negras' | '75% Pardo Oscuro' | 'Verdosas / Inmaduras'>('100% Negras');
  const [madTempAmbiente, setMadTempAmbiente] = useState<number>(18);
  const [madObservaciones, setMadObservaciones] = useState('');

  // Form states Cosecha
  const [cosParcelaId, setCosParcelaId] = useState(parcelas[0]?.id || '');
  const [cosFecha, setCosFecha] = useState(new Date().toISOString().slice(0, 10));
  const [cosHilera, setCosHilera] = useState('Hileras 1 a 20');
  const [cosBins, setCosBins] = useState<number>(20);
  const [cosPesoBin, setCosPesoBin] = useState<number>(390);
  const [cosCuadrilla, setCosCuadrilla] = useState('Cuadrilla Los Espinos');
  const [cosNumCosecheros, setCosNumCosecheros] = useState<number>(12);
  const [cosCalibre, setCosCalibre] = useState<'Calibre 27-30 (Jumbo)' | 'Calibre 33-36 (Grande)' | 'Calibre 39-42 (Medio)' | 'Descarte / Agroindustria'>('Calibre 33-36 (Grande)');
  const [cosGuia, setCosGuia] = useState('');
  const [cosPacking, setCosPacking] = useState('Frusan / Packing Central');
  const [cosObservaciones, setCosObservaciones] = useState('');

  const brixPromedio = muestreos.length 
    ? (muestreos.reduce((acc, m) => acc + m.solidosSolublesBrix, 0) / muestreos.length).toFixed(1) 
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
      parcelaId: selParcela ? selParcela.id : 'parc-general',
      parcelaNombre: selParcela ? selParcela.nombre : 'Sector General',
      variedad: 'Hayward',
      cuartelSector: madSector || undefined,
      solidosSolublesBrix: Number(madBrix),
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
      parcelaId: selParcela ? selParcela.id : 'parc-general',
      parcelaNombre: selParcela ? selParcela.nombre : 'Sector General',
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-2xl text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-600/40">
            <Apple className="w-3.5 h-3.5 text-emerald-300" />
            Control de Cosecha & Madurez de Fruta
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Muestreo de Azúcar (°Brix), Materia Seca y Bins
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mt-1">
            Monitoreo agronómico de sólidos solubles (°Brix min. 6.2° SAG), materia seca (% MS) y control diario de bins cosechados por cuartel.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {subTab === 'madurez' ? (
            <button
              onClick={() => setIsModalMadurezOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nuevo Muestreo °Brix
            </button>
          ) : (
            <button
              onClick={() => setIsModalCosechaOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Registrar Bins Cosechados
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setSubTab('madurez')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'madurez'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Gauge className="w-4 h-4" />
          Muestreo de Azúcar (°Brix y % Materia Seca)
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-800 text-emerald-100">
            {muestreos.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('cosecha')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'cosecha'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          Registro Diario de Bins y Kilos
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-800 text-emerald-100">
            {cosechas.length}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: MADUREZ (SIN FIRMEZA) */}
      {subTab === 'madurez' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                Norma SAG Exportación: &ge; 6.2°
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-800">
                Materia Seca Promedio (% MS)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-teal-800">
                  {materiaSecaPromedio}%
                </span>
                <span className="text-xs text-stone-600 font-medium">MS</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Óptimo guarda frigorífica: &gt; 15.5%
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Cuarteles Aptos para Corte
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                  {muestreos.filter(m => m.estadoAutorizacion === 'Autorizado Cosecha').length}
                </span>
                <span className="text-xs text-stone-600 font-medium">muestreos sobre 6.2°</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Cumplen protocolo de cosecha
              </p>
            </div>
          </div>

          {/* Listado de Muestreos */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">
                Muestreos de Madurez Registrados
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

                      <div className="flex items-center gap-4 shrink-0">
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
                            Materia Seca
                          </span>
                          <span className="text-base font-extrabold text-teal-700">
                            {m.materiaSecaPorcentaje}%
                          </span>
                        </div>

                        <button
                          onClick={() => onDeleteMuestreo(m.id)}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2 cursor-pointer"
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

      {/* SUBTAB 2: COSECHA */}
      {subTab === 'cosecha' && (
        <div className="space-y-6">
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
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Kilos Totales
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
                  {totalKilosCosechados.toLocaleString('es-CL')}
                </span>
                <span className="text-xs text-stone-600 font-medium">kg</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Rendimiento
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-teal-800">
                  {rendimientoPromedioTonHa}
                </span>
                <span className="text-xs text-stone-600 font-medium">t/ha</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Lotes / Despachos
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-800">
                  {cosechas.length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="divide-y divide-stone-100">
              {cosechas.map((c) => (
                <div key={c.id} className="p-4 hover:bg-stone-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">{c.parcelaNombre}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {c.calidadCalibrePredominante}
                        </span>
                        {c.guiaDespachoNumero && (
                          <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                            {c.guiaDespachoNumero}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 text-xs text-stone-600">
                        <span>Fecha: {c.fecha}</span>
                        <span>Cuadrilla: {c.cuadrillaCosecheros}</span>
                        <span>Destino: {c.packingDestino}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-semibold text-stone-400">Bins</span>
                        <span className="text-base font-extrabold text-amber-900">{c.cantidadBins}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-semibold text-stone-400">Kilos</span>
                        <span className="text-base font-extrabold text-emerald-800">{c.kilosTotales.toLocaleString('es-CL')} kg</span>
                      </div>
                      <button
                        onClick={() => onDeleteCosecha(c.id)}
                        className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg cursor-pointer ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL MUESTREO MADUREZ (SIN FIRMEZA) */}
      {isModalMadurezOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-emerald-950 text-white">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Nuevo Muestreo de Azúcar (°Brix)</h3>
              </div>
              <button onClick={() => setIsModalMadurezOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMadurez} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cuartel *</label>
                  <select
                    value={madParcelaId}
                    onChange={(e) => setMadParcelaId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    {parcelas.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                    {parcelas.length === 0 && <option value="general">Huerto General</option>}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={madFecha}
                    onChange={(e) => setMadFecha(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Sector o Hilera Muestreada</label>
                <input
                  type="text"
                  placeholder="Ej: Hilera 12 a 25"
                  value={madSector}
                  onChange={(e) => setMadSector(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div>
                  <label className="block font-bold text-emerald-950 mb-1">°Brix Refractómetro *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="18.0"
                    required
                    value={madBrix}
                    onChange={(e) => setMadBrix(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-extrabold p-2 rounded-lg border border-emerald-300 bg-white text-emerald-900"
                  />
                  <span className="text-[10px] text-emerald-800 font-medium block mt-0.5">Norma SAG: &ge; 6.2°</span>
                </div>

                <div>
                  <label className="block font-bold text-teal-950 mb-1">Materia Seca (% MS)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="10.0"
                    max="25.0"
                    value={madMateriaSeca}
                    onChange={(e) => setMadMateriaSeca(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-extrabold p-2 rounded-lg border border-teal-300 bg-white text-teal-900"
                  />
                  <span className="text-[10px] text-teal-800 font-medium block mt-0.5">Ideal: &gt; 15.5%</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Coloración de Semillas</label>
                <select
                  value={madColorSemillas}
                  onChange={(e: any) => setMadColorSemillas(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="100% Negras">100% Negras (Madurez Óptima)</option>
                  <option value="75% Pardo Oscuro">75% Pardo Oscuro</option>
                  <option value="Verdosas / Inmaduras">Verdosas / Inmaduras</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={madObservaciones}
                  onChange={(e) => setMadObservaciones(e.target.value)}
                  placeholder="Detalles sobre sabor, homogeneidad de pulpa..."
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalMadurezOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Guardar Muestreo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL COSECHA */}
      {isModalCosechaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-amber-950 text-white">
              <h3 className="font-bold text-sm">Registrar Bins Cosechados</h3>
              <button onClick={() => setIsModalCosechaOpen(false)} className="text-amber-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCosecha} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cuartel *</label>
                  <select
                    value={cosParcelaId}
                    onChange={(e) => setCosParcelaId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    {parcelas.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                    {parcelas.length === 0 && <option value="general">Huerto General</option>}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={cosFecha}
                    onChange={(e) => setCosFecha(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-bold text-amber-950 mb-1">Cantidad Bins *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={cosBins}
                    onChange={(e) => setCosBins(parseInt(e.target.value) || 0)}
                    className="w-full text-base font-extrabold p-2 rounded-lg border border-amber-300 bg-white text-amber-950"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-900 mb-1">Peso / Bin (kg)</label>
                  <input
                    type="number"
                    value={cosPesoBin}
                    onChange={(e) => setCosPesoBin(parseInt(e.target.value) || 0)}
                    className="w-full text-base font-bold p-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Total Kilos</label>
                  <div className="text-base font-extrabold p-2 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300">
                    {(cosBins * cosPesoBin).toLocaleString('es-CL')} kg
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cuadrilla Cosecheros</label>
                  <input
                    type="text"
                    value={cosCuadrilla}
                    onChange={(e) => setCosCuadrilla(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Packing de Destino</label>
                  <input
                    type="text"
                    value={cosPacking}
                    onChange={(e) => setCosPacking(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalCosechaOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg cursor-pointer"
                >
                  Registrar Bins
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
