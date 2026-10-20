import React, { useState } from 'react';
import { 
  Snowflake, 
  Sprout, 
  Bug, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  Clock, 
  Thermometer, 
  Flower2, 
  Info, 
  X, 
  Trash2, 
  Award,
  Layers
} from 'lucide-react';
import { 
  Parcela, 
  CondicionHorasFrio, 
  SeguimientoFenologico, 
  RegistroPolinizacion 
} from '../types/campo';

interface HorasFrioFenologiaViewProps {
  parcelas: Parcela[];
  horasFrio: CondicionHorasFrio;
  onUpdateHorasFrio: (hf: CondicionHorasFrio) => void;
  fenologia: SeguimientoFenologico[];
  onAddFenologia: (item: SeguimientoFenologico) => void;
  onDeleteFenologia: (id: string) => void;
  polinizacion: RegistroPolinizacion[];
  onAddPolinizacion: (item: RegistroPolinizacion) => void;
  onDeletePolinizacion: (id: string) => void;
  activeUserName?: string;
}

export const HorasFrioFenologiaView: React.FC<HorasFrioFenologiaViewProps> = ({
  parcelas,
  horasFrio,
  onUpdateHorasFrio,
  fenologia,
  onAddFenologia,
  onDeleteFenologia,
  polinizacion,
  onAddPolinizacion,
  onDeletePolinizacion,
  activeUserName = 'Ing. Agrónomo'
}) => {
  const [subTab, setSubTab] = useState<'horas_frio' | 'fenologia' | 'polinizacion'>('horas_frio');

  // Modals state
  const [isModalFenologiaOpen, setIsModalFenologiaOpen] = useState(false);
  const [isModalPolinizacionOpen, setIsModalPolinizacionOpen] = useState(false);
  const [isEditHFOpen, setIsEditHFOpen] = useState(false);

  // Form states for HF Edit
  const [inputHF, setInputHF] = useState(horasFrio.horasFrioAcumuladas);
  const [inputTempMin, setInputTempMin] = useState(horasFrio.temperaturaMinimaRegistradaC);

  // Form states for Fenología
  const [fenParcelaId, setFenParcelaId] = useState(parcelas[0]?.id || '');
  const [fenFecha, setFenFecha] = useState(new Date().toISOString().slice(0, 10));
  const [fenEstadoBBCH, setFenEstadoBBCH] = useState('BBCH 65: Plena Floración');
  const [fenPorcentaje, setFenPorcentaje] = useState(70);
  const [fenObservaciones, setFenObservaciones] = useState('');

  // Form states for Polinización
  const [polParcelaId, setPolParcelaId] = useState(parcelas[0]?.id || '');
  const [polFechaEntrada, setPolFechaEntrada] = useState(new Date().toISOString().slice(0, 10));
  const [polFechaSalida, setPolFechaSalida] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );
  const [polTipo, setPolTipo] = useState<'Abejas melíferas (Apis mellifera)' | 'Abejorros (Bombus terrestris)' | 'Mixta (Abejas + Abejorros)' | 'Polen seco / asistido'>('Mixta (Abejas + Abejorros)');
  const [polColmenas, setPolColmenas] = useState(40);
  const [polProveedor, setPolProveedor] = useState('Apícola Los Quillayes del Maule');
  const [polSincronia, setPolSincronia] = useState<'Óptima (>90%)' | 'Aceptable (70-90%)' | 'Desfasada (<70%)'>('Óptima (>90%)');
  const [polObservaciones, setPolObservaciones] = useState('');

  const pctCumplimiento = Math.min(
    100,
    Math.round((horasFrio.horasFrioAcumuladas / horasFrio.horasFrioMetaHayward) * 100)
  );

  const handleSaveHF = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CondicionHorasFrio = {
      ...horasFrio,
      horasFrioAcumuladas: Number(inputHF),
      temperaturaMinimaRegistradaC: Number(inputTempMin),
      porcentajeCumplimiento: Math.min(100, Math.round((Number(inputHF) / horasFrio.horasFrioMetaHayward) * 100)),
      fechaUltimaActualizacion: new Date().toISOString().slice(0, 10),
      estadoDormancia: Number(inputHF) >= 800 ? 'Cumplimiento óptimo' : 'En acumulación'
    };
    onUpdateHorasFrio(updated);
    setIsEditHFOpen(false);
  };

  const handleSaveFenologia = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parcelas.find(item => item.id === fenParcelaId) || parcelas[0];
    const codigo = fenEstadoBBCH.split(':')[0].trim();

    const nuevo: SeguimientoFenologico = {
      id: `fen-${Date.now()}`,
      fecha: fenFecha,
      parcelaId: p.id,
      parcelaNombre: p.nombre,
      variedad: 'Hayward',
      codigoBBCH: codigo,
      nombreEstado: fenEstadoBBCH,
      porcentajeAvance: Number(fenPorcentaje),
      observaciones: fenObservaciones,
      evaluador: activeUserName
    };

    onAddFenologia(nuevo);
    setIsModalFenologiaOpen(false);
    setFenObservaciones('');
  };

  const handleSavePolinizacion = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parcelas.find(item => item.id === polParcelaId) || parcelas[0];
    const colmPorHa = Number((polColmenas / p.superficieHa).toFixed(1));

    const nuevo: RegistroPolinizacion = {
      id: `pol-${Date.now()}`,
      temporada: '2026 - 2027',
      parcelaId: p.id,
      parcelaNombre: p.nombre,
      variedadPrincipal: 'Hayward (Hembra)',
      variedadPolinizadora: 'Tomuri / Chieftain (Macho)',
      fechaEntradaColmenas: polFechaEntrada,
      fechaSalidaColmenas: polFechaSalida,
      tipoPolinizador: polTipo,
      colmenasTotales: Number(polColmenas),
      colmenasPorHectarea: colmPorHa,
      proveedorApiario: polProveedor,
      sincroniaFloracion: polSincronia,
      porcentajeFloresAbiertas: 75,
      estadoPolinizacion: 'En curso',
      observaciones: polObservaciones || undefined
    };

    onAddPolinizacion(nuevo);
    setIsModalPolinizacionOpen(false);
    setPolObservaciones('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-sky-950 via-emerald-950 to-teal-950 rounded-2xl text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-800/60 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-sky-600/30">
            <Snowflake className="w-3.5 h-3.5 text-sky-300" />
            Exclusivo Kiwi Hayward · Requerimiento: 800 - 1.000 HF
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Horas Frío & Monitoreo Fenológico / Polinización
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl mt-1">
            Seguimiento agronómico de acumulación de frío invernal (&lt; 7.2°C), necesidad de rompedores de dormancia, estados fenológicos BBCH y manejo de colmenas polinizadoras.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {subTab === 'horas_frio' && (
            <button
              onClick={() => setIsEditHFOpen(true)}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-sky-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Thermometer className="w-4 h-4" />
              Actualizar Horas Frío
            </button>
          )}

          {subTab === 'fenologia' && (
            <button
              onClick={() => setIsModalFenologiaOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nuevo Registro Fenológico
            </button>
          )}

          {subTab === 'polinizacion' && (
            <button
              onClick={() => setIsModalPolinizacionOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Registrar Colmenas
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setSubTab('horas_frio')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            subTab === 'horas_frio'
              ? 'bg-sky-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Snowflake className="w-4 h-4" />
          Horas Frío & Rompedor de Dormancia
        </button>

        <button
          onClick={() => setSubTab('fenologia')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            subTab === 'fenologia'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Sprout className="w-4 h-4" />
          Estados Fenológicos BBCH
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-800 text-emerald-100">
            {fenologia.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('polinizacion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            subTab === 'polinizacion'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Flower2 className="w-4 h-4" />
          Polinización & Colmenas (Macho / Hembra)
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-800 text-amber-100">
            {polinizacion.length}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: HORAS FRÍO */}
      {subTab === 'horas_frio' && (
        <div className="space-y-6">
          {/* Termómetro y KPI Principal */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  Modelo Weinberger (&lt; 7.2°C) · Temporada {horasFrio.temporada}
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-sky-950">
                    {horasFrio.horasFrioAcumuladas}
                  </span>
                  <span className="text-stone-500 font-semibold text-lg">
                    / {horasFrio.horasFrioMetaHayward} HF Meta Hayward
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-right">
                  <span className="block text-[10px] uppercase font-bold text-sky-800">
                    T° Mínima del Invierno
                  </span>
                  <span className="text-xl font-extrabold text-sky-950">
                    {horasFrio.temperaturaMinimaRegistradaC}°C
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
                  <span className="block text-[10px] uppercase font-bold text-emerald-800">
                    Cumplimiento
                  </span>
                  <span className="text-xl font-extrabold text-emerald-900">
                    {pctCumplimiento}%
                  </span>
                </div>
              </div>
            </div>

            {/* Barra de progreso interactiva */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-stone-600">
                <span>0 HF</span>
                <span>500 HF</span>
                <span className="text-sky-800 font-bold">850 HF (Meta Hayward)</span>
                <span>1000 HF</span>
              </div>
              <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-200 relative">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 via-sky-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${pctCumplimiento}%` }}
                />
                {/* Marcador de meta 850 */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: '85%' }}
                  title="Meta Hayward (850 HF)"
                />
              </div>
            </div>

            {/* Estado de Dormancia y Recomendación */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Diagnóstico de Dormancia: {horasFrio.estadoDormancia}
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  {horasFrio.observacionesAgronomicas}
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-bold text-sky-950 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Prescripción de Rompedor de Dormancia
                </h4>
                <p className="text-stone-800 font-semibold">
                  {horasFrio.rompedorDormanciaRecomendado}
                </p>
                <p className="text-stone-500 mt-1">
                  Ventana de aplicación: <strong>{horasFrio.fechaSugeridaRompedor}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FENOLOGÍA BBCH */}
      {subTab === 'fenologia' && (
        <div className="space-y-6">
          {/* Cronología de la Escala BBCH del Kiwi Hayward */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Escala Fenológica BBCH para Kiwi (Actinidia deliciosa cv. Hayward)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block">BBCH 00</span>
                <span className="text-[11px] text-stone-500">Receso invernal</span>
              </div>
              <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-200">
                <span className="font-bold text-sky-950 block">BBCH 09</span>
                <span className="text-[11px] text-sky-800">Punta verde / Yema hinchada</span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="font-bold text-emerald-950 block">BBCH 15</span>
                <span className="text-[11px] text-emerald-800">Primeras hojas expandidas</span>
              </div>
              <div className="p-2.5 bg-teal-50 rounded-lg border border-teal-200">
                <span className="font-bold text-teal-950 block">BBCH 55</span>
                <span className="text-[11px] text-teal-800">Botón floral individual</span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-950 block">BBCH 65</span>
                <span className="text-[11px] text-amber-800">Plena Floración (Hembras)</span>
              </div>
            </div>
          </div>

          {/* Historial de Observaciones Fenológicas */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Seguimiento de Estados Fenológicos por Cuartel
                </h3>
                <p className="text-xs text-stone-500">
                  Observaciones de terreno en cargadores y brotes fértiles
                </p>
              </div>
              <span className="text-xs text-stone-500">
                Total: {fenologia.length} registros
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {fenologia.map((f) => (
                <div key={f.id} className="p-4 hover:bg-stone-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                          {f.codigoBBCH}
                        </span>
                        <span className="text-sm font-bold text-stone-900">
                          {f.parcelaNombre}
                        </span>
                        <span className="text-xs text-stone-500">
                          · {f.nombreEstado}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-stone-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {f.fecha}
                        </span>
                        <span>
                          Evaluador: <strong>{f.evaluador}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-semibold text-stone-400">
                          Avance en Cuartel
                        </span>
                        <span className="text-sm font-extrabold text-emerald-800">
                          {f.porcentajeAvance}%
                        </span>
                      </div>

                      <button
                        onClick={() => onDeleteFenologia(f.id)}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        title="Eliminar observación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {f.observaciones && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg mt-2 border border-stone-200/60 italic">
                      "{f.observaciones}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: POLINIZACIÓN & COLMENAS */}
      {subTab === 'polinizacion' && (
        <div className="space-y-6">
          {/* Tarjeta Educativa y Técnica sobre Polinización en Kiwi */}
          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                <Flower2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950">
                  Polinización Cruzada en Kiwi Hayward (Planta Dioica)
                </h4>
                <p className="text-xs text-amber-900/80">
                  El cultivar <strong>Hayward</strong> posee flores exclusivamente pistiladas (hembras). Requiere polen de machos polinizadores (Tomuri, Chieftain o Matua) y una carga masiva de polinizadores.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2 border-t border-amber-200/80">
              <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950 block mb-0.5">
                  Dosis Recomendada de Colmenas
                </span>
                <p className="text-stone-700">
                  <strong>8 a 10 colmenas/ha</strong> de <em>Apis mellifera</em> con alzas de alta postura y vigor.
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950 block mb-0.5">
                  Uso de Abejorros (Bombus)
                </span>
                <p className="text-stone-700">
                  Clave para polinización en días nublados, frío o llovizna ligera donde la abeja no vuela.
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950 block mb-0.5">
                  Requisito para Calibre Exportable
                </span>
                <p className="text-stone-700">
                  Se necesitan más de <strong>1.000 granos de polen</strong> y 800+ semillas viables por fruto para superar los 100g.
                </p>
              </div>
            </div>
          </div>

          {/* Registros de Colmenas */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Colmenas Introducidas en Cuarteles Hayward
                </h3>
                <p className="text-xs text-stone-500">
                  Control de apiarios, fechas de piquera y sincronía floral
                </p>
              </div>
              <span className="text-xs text-stone-500">
                Total: {polinizacion.length} registros
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {polinizacion.map((pol) => (
                <div key={pol.id} className="p-4 hover:bg-stone-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">
                          {pol.parcelaNombre}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {pol.tipoPolinizador}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Sincronía: {pol.sincroniaFloracion}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                        <span>
                          Apiario: <strong>{pol.proveedorApiario}</strong>
                        </span>
                        <span>
                          Entrada: <strong>{pol.fechaEntradaColmenas}</strong> · Salida: <strong>{pol.fechaSalidaColmenas}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-semibold text-stone-400">
                          Colmenas Totales
                        </span>
                        <span className="text-base font-extrabold text-amber-900">
                          {pol.colmenasTotales} colmenas
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-semibold text-stone-400">
                          Densidad
                        </span>
                        <span className="text-base font-extrabold text-emerald-800">
                          {pol.colmenasPorHectarea} colm/ha
                        </span>
                      </div>

                      <button
                        onClick={() => onDeletePolinizacion(pol.id)}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {pol.observaciones && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg mt-2 border border-stone-200/60 italic">
                      "{pol.observaciones}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR HORAS FRÍO */}
      {isEditHFOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-sky-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-sky-300" />
                <h3 className="font-bold text-sm">Actualizar Horas Frío Acumuladas</h3>
              </div>
              <button 
                onClick={() => setIsEditHFOpen(false)}
                className="p-1 text-sky-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHF} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Horas Frío Acumuladas (&lt; 7.2°C) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="1500"
                  value={inputHF}
                  onChange={(e) => setInputHF(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-extrabold p-2.5 rounded-lg border border-stone-300 focus:outline-sky-800 text-sky-950"
                  required
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Meta para Kiwi Hayward: 850 HF
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Temperatura Mínima Registrada (°C) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputTempMin}
                  onChange={(e) => setInputTempMin(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-bold p-2.5 rounded-lg border border-stone-300 focus:outline-sky-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditHFOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-sky-800 hover:bg-sky-700 text-white rounded-lg shadow-sm"
                >
                  Guardar Horas Frío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVO REGISTRO FENOLÓGICO */}
      {isModalFenologiaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Nuevo Registro Fenológico (Kiwi Hayward)</h3>
              </div>
              <button 
                onClick={() => setIsModalFenologiaOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFenologia} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cuartel *
                  </label>
                  <select
                    value={fenParcelaId}
                    onChange={(e) => setFenParcelaId(e.target.value)}
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
                    Fecha de Observación *
                  </label>
                  <input
                    type="date"
                    value={fenFecha}
                    onChange={(e) => setFenFecha(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Estado Fenológico BBCH *
                </label>
                <select
                  value={fenEstadoBBCH}
                  onChange={(e) => setFenEstadoBBCH(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 bg-white"
                  required
                >
                  <option value="BBCH 00: Receso invernal (Yemas en reposo vegetativo)">BBCH 00: Receso invernal</option>
                  <option value="BBCH 09: Punta verde / Hinchazón de yemas">BBCH 09: Punta verde / Hinchazón de yemas</option>
                  <option value="BBCH 15: Primeras hojas expandidas">BBCH 15: Primeras hojas expandidas</option>
                  <option value="BBCH 55: Botón floral individual en axilas de hojas">BBCH 55: Botón floral visible</option>
                  <option value="BBCH 61: Inicio de Floración (10% de flores abiertas)">BBCH 61: Inicio de Floración (10%)</option>
                  <option value="BBCH 65: Plena Floración (50% de flores abiertas)">BBCH 65: Plena Floración (50%)</option>
                  <option value="BBCH 71: Caída de pétalos y cuaja">BBCH 71: Caída de pétalos y cuaja</option>
                  <option value="BBCH 79: Crecimiento rápido de fruto">BBCH 79: Crecimiento rápido de fruto</option>
                  <option value="BBCH 85: Maduración inicial">BBCH 85: Maduración inicial</option>
                  <option value="BBCH 89: Madurez de Cosecha (°Brix >= 6.2)">BBCH 89: Madurez de Cosecha (°Brix &gt;= 6.2)</option>
                  <option value="BBCH 93: Senescencia y caída de hojas">BBCH 93: Senescencia y caída de hojas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Porcentaje de Avance en el Cuartel (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={fenPorcentaje}
                  onChange={(e) => setFenPorcentaje(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Observaciones Técnicas
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre vigor de brotes, sincronía de floración de machos Tomuri, etc..."
                  value={fenObservaciones}
                  onChange={(e) => setFenObservaciones(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalFenologiaOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                >
                  Guardar Estado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR COLMENAS */}
      {isModalPolinizacionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-amber-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flower2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Registrar Colmenas de Polinización</h3>
              </div>
              <button 
                onClick={() => setIsModalPolinizacionOpen(false)}
                className="p-1 text-amber-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolinizacion} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cuartel de Kiwi Hayward *
                  </label>
                  <select
                    value={polParcelaId}
                    onChange={(e) => setPolParcelaId(e.target.value)}
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
                    Tipo de Polinizador *
                  </label>
                  <select
                    value={polTipo}
                    onChange={(e: any) => setPolTipo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800 bg-white"
                  >
                    <option value="Mixta (Abejas + Abejorros)">Mixta (Abejas + Abejorros)</option>
                    <option value="Abejas melíferas (Apis mellifera)">Abejas melíferas (Apis mellifera)</option>
                    <option value="Abejorros (Bombus terrestris)">Abejorros (Bombus terrestris)</option>
                    <option value="Polen seco / asistido">Polen seco / asistido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cantidad Total de Colmenas *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={polColmenas}
                    onChange={(e) => setPolColmenas(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                    required
                  />
                  <span className="text-[10px] text-amber-900 font-medium block mt-0.5">
                    Recomendado: 8 a 10 colm/ha
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sincronía Floración Macho/Hembra
                  </label>
                  <select
                    value={polSincronia}
                    onChange={(e: any) => setPolSincronia(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800 bg-white"
                  >
                    <option value="Óptima (>90%)">Óptima (&gt;90%)</option>
                    <option value="Aceptable (70-90%)">Aceptable (70-90%)</option>
                    <option value="Desfasada (<70%)">Desfasada (&lt;70%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Fecha Entrada a Campo *
                  </label>
                  <input
                    type="date"
                    value={polFechaEntrada}
                    onChange={(e) => setPolFechaEntrada(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Fecha Retiro Estimada *
                  </label>
                  <input
                    type="date"
                    value={polFechaSalida}
                    onChange={(e) => setPolFechaSalida(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Proveedor de Apiario / Empresa
                </label>
                <input
                  type="text"
                  value={polProveedor}
                  onChange={(e) => setPolProveedor(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Observaciones de Piquera y Vuelo
                </label>
                <textarea
                  rows={2}
                  placeholder="Distribución de piqueras, protección contra el viento, número de marcos con cría..."
                  value={polObservaciones}
                  onChange={(e) => setPolObservaciones(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-amber-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalPolinizacionOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-800 hover:bg-amber-700 text-white rounded-lg shadow-sm"
                >
                  Registrar Colmenas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
