import React, { useState } from 'react';
import { 
  Snowflake, 
  Sprout, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Flower2, 
  X, 
  Trash2,
  Percent,
  Layers,
  Sparkles,
  Thermometer,
  ShieldCheck,
  Bug,
  Info
} from 'lucide-react';
import { 
  Parcela, 
  CondicionHorasFrio, 
  SeguimientoFenologico, 
  RegistroPolinizacion,
  ConteoYemasBrotacion,
  EtapaFenologicaSabaini,
  SeguimientoFenologicoSabaini
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
  const [subTab, setSubTab] = useState<'etapas_sabaini' | 'fenologia_bbch' | 'polinizacion' | 'brotacion' | 'horas_frio'>('etapas_sabaini');
  const [etapaSeleccionada, setEtapaSeleccionada] = useState<EtapaFenologicaSabaini>('E1');

  // MODALES
  const [isModalBrotacionOpen, setIsModalBrotacionOpen] = useState(false);
  const [isModalRegistroEtapaOpen, setIsModalRegistroEtapaOpen] = useState(false);
  const [isModalFenologiaOpen, setIsModalFenologiaOpen] = useState(false);
  const [isModalPolinizacionOpen, setIsModalPolinizacionOpen] = useState(false);

  // Estados Formulario Fenología BBCH
  const [bbchParcelaId, setBbchParcelaId] = useState(parcelas[0]?.id || '');
  const [bbchFecha, setBbchFecha] = useState(new Date().toISOString().slice(0, 10));
  const [bbchEstado, setBbchEstado] = useState('BBCH 65: Plena Floración (50% flores abiertas)');
  const [bbchPorcentaje, setBbchPorcentaje] = useState<number>(75);
  const [bbchObservaciones, setBbchObservaciones] = useState('');

  // Estados Formulario Polinización
  const [polParcelaId, setPolParcelaId] = useState(parcelas[0]?.id || '');
  const [polFechaEntrada, setPolFechaEntrada] = useState(new Date().toISOString().slice(0, 10));
  const [polFechaSalida, setPolFechaSalida] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );
  const [polTipo, setPolTipo] = useState<any>('Mixta (Abejas + Abejorros)');
  const [polColmenas, setPolColmenas] = useState<number>(40);
  const [polProveedor, setPolProveedor] = useState('Apícola Central');
  const [polSincronia, setPolSincronia] = useState<'Óptima (>90%)' | 'Aceptable (70-90%)' | 'Desfasada (<70%)'>('Óptima (>90%)');
  const [polFloresAbiertas, setPolFloresAbiertas] = useState<number>(70);
  const [polObservaciones, setPolObservaciones] = useState('');

  // Estados Conteo Yemas y Brotación
  const [conteosBrotacion, setConteosBrotacion] = useState<ConteoYemasBrotacion[]>([]);
  const [broParcelaId, setBroParcelaId] = useState(parcelas[0]?.id || '');
  const [broFecha, setBroFecha] = useState(new Date().toISOString().slice(0, 10));
  const [broHilera, setBroHilera] = useState('Hilera 1 a 10');
  const [broCargadores, setBroCargadores] = useState<number>(20);
  const [broYemasInvierno, setBroYemasInvierno] = useState<number>(360);
  const [broBrotesEmergidos, setBroBrotesEmergidos] = useState<number>(270);
  const [broBrotesFertiles, setBroBrotesFertiles] = useState<number>(215);
  const [broObservaciones, setBroObservaciones] = useState('');

  // Estados Registros Fenológicos de Etapas E1-E5 (Sabaini)
  const [registrosEtapas, setRegistrosEtapas] = useState<SeguimientoFenologicoSabaini[]>([]);
  const [regParcelaId, setRegParcelaId] = useState(parcelas[0]?.id || '');
  const [regFecha, setRegFecha] = useState(new Date().toISOString().slice(0, 10));
  const [regDiametroBrotes, setRegDiametroBrotes] = useState<number>(14);
  const [regCalibreSemanal, setRegCalibreSemanal] = useState<number>(1.0);
  const [regMateriaSeca, setRegMateriaSeca] = useState<number>(16.0);
  const [regFlashRaices, setRegFlashRaices] = useState<any>('Flash de primavera activo');
  const [regEnmienda, setRegEnmienda] = useState('Banda de Enmienda Orgánica (BEO) 8 t/ha');
  const [regObs, setRegObs] = useState('');

  // Cálculos de Brotación
  const pctBrotacionCalculado = broYemasInvierno > 0 
    ? Number(((broBrotesEmergidos / broYemasInvierno) * 100).toFixed(1)) 
    : 0;

  const pctFertilidadCalculado = broBrotesEmergidos > 0 
    ? Number(((broBrotesFertiles / broBrotesEmergidos) * 100).toFixed(1)) 
    : 0;

  // Guardar Conteo Brotación
  const handleSaveBrotacion = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parcelas.find(item => item.id === broParcelaId);
    const nuevo: ConteoYemasBrotacion = {
      id: `brot-${Date.now()}`,
      fecha: broFecha,
      parcelaId: p ? p.id : 'parc-1',
      parcelaNombre: p ? p.nombre : 'Cuartel Principal',
      hileraSector: broHilera,
      cargadoresMuestreados: Number(broCargadores),
      yemasTotalesInvierno: Number(broYemasInvierno),
      brotesEmergidos: Number(broBrotesEmergidos),
      brotesFertilesFlorales: Number(broBrotesFertiles),
      porcentajeBrotacion: pctBrotacionCalculado,
      porcentajeFertilidad: pctFertilidadCalculado,
      evaluador: activeUserName,
      observaciones: broObservaciones || undefined
    };

    setConteosBrotacion([nuevo, ...conteosBrotacion]);
    setIsModalBrotacionOpen(false);
    setBroObservaciones('');
  };

  // Guardar Observación Etapa Sabaini
  const handleSaveRegistroEtapa = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parcelas.find(item => item.id === regParcelaId);
    const etapaNombres: Record<EtapaFenologicaSabaini, string> = {
      E1: 'Etapa 1: Inicio Brotación a Plena Flor',
      E2: 'Etapa 2: Plena Flor a 50 DDPF (División celular y Calcio)',
      E3: 'Etapa 3: 50 DDPF a Cosecha (Acumulación Materia Seca)',
      E4: 'Etapa 4: Cosecha a Caída Hojas (Reservas y Flash Radicular)',
      E5: 'Etapa 5: Receso Invernal (Horas Frío y Enmiendas BEO/CHM)'
    };

    const nuevo: SeguimientoFenologicoSabaini = {
      id: `sab-${Date.now()}`,
      fecha: regFecha,
      parcelaId: p ? p.id : 'parc-1',
      parcelaNombre: p ? p.nombre : 'Cuartel Principal',
      etapa: etapaSeleccionada,
      nombreEtapa: etapaNombres[etapaSeleccionada],
      diametroBrotesBaseMm: Number(regDiametroBrotes),
      calibreFrutoPolarSemanalCm: Number(regCalibreSemanal),
      materiaSecaFruto: Number(regMateriaSeca),
      estadoRaicesFlash: regFlashRaices,
      enmiendaAplicada: regEnmienda,
      observaciones: regObs,
      evaluador: activeUserName
    };

    setRegistrosEtapas([nuevo, ...registrosEtapas]);
    setIsModalRegistroEtapaOpen(false);
    setRegObs('');
  };

  // Guardar Estado BBCH
  const handleSaveBBCH = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parcelas.find(item => item.id === bbchParcelaId);
    const codigo = bbchEstado.split(':')[0].trim();

    const nuevo: SeguimientoFenologico = {
      id: `bbch-${Date.now()}`,
      fecha: bbchFecha,
      parcelaId: p ? p.id : 'parc-1',
      parcelaNombre: p ? p.nombre : 'Cuartel Principal',
      variedad: 'Hayward',
      codigoBBCH: codigo,
      nombreEstado: bbchEstado,
      porcentajeAvance: Number(bbchPorcentaje),
      observaciones: bbchObservaciones || '',
      evaluador: activeUserName
    };

    onAddFenologia(nuevo);
    setIsModalFenologiaOpen(false);
    setBbchObservaciones('');
  };

  // Guardar Registro Polinización
  const handleSavePolinizacionModal = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parcelas.find(item => item.id === polParcelaId);
    const ha = p ? p.superficieHa : 4.0;
    const densidad = ha > 0 ? Number((polColmenas / ha).toFixed(1)) : 8.0;

    const nuevo: RegistroPolinizacion = {
      id: `pol-${Date.now()}`,
      temporada: '2026 - 2027',
      parcelaId: p ? p.id : 'parc-1',
      parcelaNombre: p ? p.nombre : 'Cuartel Principal',
      variedadPrincipal: 'Hayward (Hembra)',
      variedadPolinizadora: 'Tomuri / Chieftain (Macho)',
      fechaEntradaColmenas: polFechaEntrada,
      fechaSalidaColmenas: polFechaSalida,
      tipoPolinizador: polTipo,
      colmenasTotales: Number(polColmenas),
      colmenasPorHectarea: densidad,
      proveedorApiario: polProveedor || 'Apiario Local',
      sincroniaFloracion: polSincronia,
      porcentajeFloresAbiertas: Number(polFloresAbiertas),
      estadoPolinizacion: 'En curso',
      observaciones: polObservaciones || undefined
    };

    onAddPolinizacion(nuevo);
    setIsModalPolinizacionOpen(false);
    setPolObservaciones('');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-600/40">
            <Sprout className="w-3.5 h-3.5 text-emerald-300" />
            Kiwi Hayward · Ciclo Fenológico & Fructificación
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Fenología, Yemas, Frío & Polinización
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Gestión técnica integral: modelo de 5 etapas (Sabaini), escala BBCH oficial, conteo de yemas por cargador y control de apiarios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {subTab === 'polinizacion' && (
            <button
              onClick={() => setIsModalPolinizacionOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Flower2 className="w-4 h-4" />
              + Registrar Colmenas
            </button>
          )}

          {subTab === 'fenologia_bbch' && (
            <button
              onClick={() => setIsModalFenologiaOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              + Registrar Estado BBCH
            </button>
          )}

          {subTab === 'brotacion' && (
            <button
              onClick={() => setIsModalBrotacionOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Percent className="w-4 h-4" />
              + Conteo de Yemas
            </button>
          )}

          {subTab === 'etapas_sabaini' && (
            <button
              onClick={() => setIsModalRegistroEtapaOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              + Observación ({etapaSeleccionada})
            </button>
          )}
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('etapas_sabaini')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'etapas_sabaini' ? 'bg-emerald-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-300" />
          1. Las 5 Etapas Fenológicas (E1 a E5)
        </button>

        <button
          onClick={() => setSubTab('fenologia_bbch')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'fenologia_bbch' ? 'bg-emerald-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-300" />
          2. Estados BBCH ({fenologia.length})
        </button>

        <button
          onClick={() => setSubTab('polinizacion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'polinizacion' ? 'bg-amber-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Flower2 className="w-4 h-4 text-amber-300" />
          3. Polinización & Colmenas ({polinizacion.length})
        </button>

        <button
          onClick={() => setSubTab('brotacion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'brotacion' ? 'bg-teal-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Percent className="w-4 h-4 text-teal-300" />
          4. Conteo de Yemas & Brotación ({conteosBrotacion.length})
        </button>

        <button
          onClick={() => setSubTab('horas_frio')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === 'horas_frio' ? 'bg-sky-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Snowflake className="w-4 h-4 text-sky-300" />
          5. Horas Frío ({horasFrio.horasFrioAcumuladas} HF)
        </button>
      </div>

      {/* PESTAÑA 2: ESTADOS FENOLÓGICOS BBCH (ACTIVA AL 100%) */}
      {subTab === 'fenologia_bbch' && (
        <div className="space-y-6">
          {/* Cinta Educativa de la Escala BBCH del Kiwi */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs uppercase text-stone-600 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-700" />
                Escala Fenológica BBCH Oficial para Kiwi Hayward (Actinidia deliciosa)
              </span>
              <button
                onClick={() => setIsModalFenologiaOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
              >
                + Registrar Estado BBCH
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl border">
                <strong className="block text-stone-900">BBCH 00</strong>
                <span className="text-[11px] text-stone-500">Receso invernal</span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <strong className="block text-emerald-950">BBCH 09</strong>
                <span className="text-[11px] text-emerald-800">Punta verde / Yema hinchada</span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <strong className="block text-emerald-950">BBCH 15</strong>
                <span className="text-[11px] text-emerald-800">Primeras hojas expandidas</span>
              </div>
              <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200">
                <strong className="block text-teal-950">BBCH 55</strong>
                <span className="text-[11px] text-teal-800">Botón floral individual</span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <strong className="block text-amber-950">BBCH 65</strong>
                <span className="text-[11px] text-amber-800">Plena Floración (50%)</span>
              </div>
            </div>
          </div>

          {/* Listado de Registros BBCH */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Observaciones Fenológicas BBCH por Cuartel</h3>
                <p className="text-[11px] text-stone-500">Avance de brotación, floración y cuaja en terreno</p>
              </div>
              <span className="text-xs text-stone-500 font-semibold">{fenologia.length} registros</span>
            </div>

            <div className="divide-y divide-stone-100">
              {fenologia.map((f) => (
                <div key={f.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                        {f.codigoBBCH}
                      </span>
                      <strong className="text-stone-900 text-sm">{f.parcelaNombre}</strong>
                      <span className="text-stone-500 text-xs">· {f.nombreEstado}</span>
                    </div>

                    <div className="flex items-center gap-4 text-stone-600 text-xs mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {f.fecha}
                      </span>
                      <span>Evaluador: <strong>{f.evaluador}</strong></span>
                    </div>

                    {f.observaciones && (
                      <p className="text-stone-500 italic mt-1 bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                        "{f.observaciones}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-bold text-stone-400">Avance en Cuartel</span>
                      <span className="text-base font-extrabold text-emerald-800">{f.porcentajeAvance}%</span>
                    </div>

                    <button
                      onClick={() => onDeleteFenologia(f.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg cursor-pointer ml-2"
                      title="Eliminar observación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {fenologia.length === 0 && (
                <div className="p-10 text-center text-stone-400">
                  <Sprout className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="font-semibold text-stone-600">No hay observaciones BBCH registradas aún.</p>
                  <p className="text-[11px] text-stone-400 mt-1">Haz clic en <strong>"+ Registrar Estado BBCH"</strong> para ingresar la primera observación de tus cuarteles.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: POLINIZACIÓN & COLMENAS (ACTIVA AL 100%) */}
      {subTab === 'polinizacion' && (
        <div className="space-y-6">
          {/* Tarjeta Educativa */}
          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                  <Flower2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950">Polinización Cruzada en Kiwi Hayward (Planta Dioica)</h4>
                  <p className="text-[11px] text-amber-900/80">Requiere polinización masiva de machos Tomuri/Chieftain: más de 1.000 granos de polen por flor para calibre &gt;100g.</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalPolinizacionOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                + Registrar Colmenas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2 border-t border-amber-200">
              <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                <strong className="block text-amber-950 mb-0.5">Densidad Recomendada</strong>
                <p className="text-stone-700"><strong>8 a 10 colmenas/ha</strong> de <em>Apis mellifera</em> vigorosas.</p>
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                <strong className="block text-amber-950 mb-0.5">Abejorros Bombus</strong>
                <p className="text-stone-700">Vital para días nublados, frío o llovizna donde la abeja no vuela.</p>
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                <strong className="block text-amber-950 mb-0.5">Sincronía Floral</strong>
                <p className="text-stone-700">Apertura simultánea con machos Tomuri / Chieftain (&gt;90%).</p>
              </div>
            </div>
          </div>

          {/* Listado de Colmenas Registradas */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Registro de Colmenas Introducidas por Cuartel</h3>
                <p className="text-[11px] text-stone-500">Control de apiarios, fechas de postura y densidad por hectárea</p>
              </div>
              <span className="text-xs text-stone-500 font-semibold">{polinizacion.length} registros</span>
            </div>

            <div className="divide-y divide-stone-100">
              {polinizacion.map((p) => (
                <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-900 text-sm">{p.parcelaNombre}</strong>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                        {p.tipoPolinizador}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                        Sincronía: {p.sincroniaFloracion}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 text-xs text-stone-600">
                      <span>Apiario: <strong>{p.proveedorApiario}</strong></span>
                      <span>Entrada: <strong>{p.fechaEntradaColmenas}</strong> · Salida: <strong>{p.fechaSalidaColmenas}</strong></span>
                      <span>Flores Abiertas: <strong>{p.porcentajeFloresAbiertas}%</strong></span>
                    </div>

                    {p.observaciones && (
                      <p className="text-stone-500 italic text-[11px] bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                        "{p.observaciones}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-bold text-stone-400">Total Colmenas</span>
                      <span className="text-base font-extrabold text-amber-950">{p.colmenasTotales} colmenas</span>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-bold text-stone-400">Densidad / Ha</span>
                      <span className="text-base font-extrabold text-emerald-800">{p.colmenasPorHectarea} colm/ha</span>
                    </div>

                    <button
                      onClick={() => onDeletePolinizacion(p.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg cursor-pointer ml-2"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {polinizacion.length === 0 && (
                <div className="p-10 text-center text-stone-400">
                  <Flower2 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="font-semibold text-stone-600">No hay registros de polinización aún.</p>
                  <p className="text-[11px] text-stone-400 mt-1">Haz clic en <strong>"+ Registrar Colmenas"</strong> para anotar las colmenas y apiarios introducidos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 1: LAS 5 ETAPAS (SABAINI) */}
      {subTab === 'etapas_sabaini' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'E1', titulo: 'E1: Brotación a Plena Flor', meses: 'Sep - Nov (13-18°C)', icon: '🌱' },
              { id: 'E2', titulo: 'E2: Flor a 50 DDPF', meses: 'Nov - Ene (18-20°C)', icon: '🥝' },
              { id: 'E3', titulo: 'E3: 50 DDPF a Cosecha', meses: 'Ene - Abr (14-20°C)', icon: '📈' },
              { id: 'E4', titulo: 'E4: Cosecha a Caída Hojas', meses: 'Abr - Jun (8-14°C)', icon: '🍂' },
              { id: 'E5', titulo: 'E5: Receso Invernal', meses: 'Jun - Sep (7-10°C)', icon: '❄️' },
            ].map(et => (
              <button
                key={et.id}
                onClick={() => setEtapaSeleccionada(et.id as EtapaFenologicaSabaini)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  etapaSeleccionada === et.id 
                    ? 'bg-emerald-950 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30' 
                    : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="text-lg mb-1">{et.icon}</div>
                <strong className="block text-xs leading-tight">{et.titulo}</strong>
                <span className={`text-[10px] block mt-1 ${etapaSeleccionada === et.id ? 'text-emerald-300' : 'text-stone-500'}`}>
                  {et.meses}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            {etapaSeleccionada === 'E1' && (
              <div className="space-y-3">
                <strong className="text-sm block font-bold text-stone-900">Etapa 1: Inicio de Brotación a Plena Floración</strong>
                <p className="text-stone-600 leading-relaxed">Apriete de ápices en octubre, eliminación de brotes basitónicos y poda cero hoja en frutos cuajados.</p>
              </div>
            )}
            {etapaSeleccionada === 'E2' && (
              <div className="space-y-3">
                <strong className="text-sm block font-bold text-stone-900">Etapa 2: Plena Flor a 50 DDPF (División Celular y Calcio)</strong>
                <p className="text-stone-600 leading-relaxed">Crecimiento polar de 1 cm/semana. Máxima absorción de calcio xilemático en las primeras 6 semanas.</p>
              </div>
            )}
            {etapaSeleccionada === 'E3' && (
              <div className="space-y-3">
                <strong className="text-sm block font-bold text-stone-900">Etapa 3: 50 DDPF a Cosecha (Materia Seca y Calidad Interna)</strong>
                <p className="text-stone-600 leading-relaxed">Construcción de almidones, vitaminas y materia seca (&gt;15.5%). Evitar raleos tardíos.</p>
              </div>
            )}
            {etapaSeleccionada === 'E4' && (
              <div className="space-y-3">
                <strong className="text-sm block font-bold text-stone-900">Etapa 4: Cosecha a Caída de Hojas (Postcosecha y Flash Radicular)</strong>
                <p className="text-stone-600 leading-relaxed">Flash radicular de otoño y aplicación de Banda de Enmienda Orgánica (BEO) en camellón.</p>
              </div>
            )}
            {etapaSeleccionada === 'E5' && (
              <div className="space-y-3">
                <strong className="text-sm block font-bold text-stone-900">Etapa 5: Receso Invernal (Horas Frío y Enmiendas Agrícolas)</strong>
                <p className="text-stone-600 leading-relaxed">Madera en reposo, 800-1000 HF, y suelo vitalizado con enmiendas para activar bacterias PGPR.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 4: CONTEO DE YEMAS */}
      {subTab === 'brotacion' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border flex justify-between items-center">
            <div>
              <h3 className="font-bold text-stone-900">Conteo de Yemas de Invierno y % de Brotación</h3>
              <p className="text-stone-500">Evaluación en cargadores seleccionados para medir fertilidad</p>
            </div>
            <button onClick={() => setIsModalBrotacionOpen(true)} className="px-4 py-2 bg-teal-800 text-white font-bold rounded-xl cursor-pointer">
              + Nuevo Conteo
            </button>
          </div>

          <div className="bg-white rounded-2xl border divide-y">
            {conteosBrotacion.map((b) => (
              <div key={b.id} className="p-4 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-stone-900">{b.parcelaNombre} ({b.hileraSector})</strong>
                  <span className="ml-2 font-bold text-emerald-800">{b.porcentajeBrotacion}% Brotación</span>
                  <p className="text-stone-500">Cargadores: {b.cargadoresMuestreados} · Yemas: {b.yemasTotalesInvierno} · Brotes florales: {b.brotesFertilesFlorales}</p>
                </div>
                <button onClick={() => setConteosBrotacion(conteosBrotacion.filter(x => x.id !== b.id))} className="text-stone-400 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 5: HORAS FRÍO */}
      {subTab === 'horas_frio' && (
        <div className="p-6 bg-white rounded-2xl border space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-sky-800 uppercase">Modelo Weinberger (&lt; 7,2°C)</span>
              <div className="text-3xl font-extrabold text-sky-950">{horasFrio.horasFrioAcumuladas} / {horasFrio.horasFrioMetaHayward} HF</div>
            </div>
            <div className="text-2xl font-bold text-emerald-800">{horasFrio.porcentajeCumplimiento}% Cumplido</div>
          </div>
          <p className="text-stone-600">{horasFrio.observacionesAgronomicas}</p>
        </div>
      )}

      {/* MODAL NUEVO ESTADO BBCH */}
      {isModalFenologiaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border">
            <div className="px-5 py-4 border-b bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-300" />
                Registrar Estado Fenológico BBCH
              </h3>
              <button onClick={() => setIsModalFenologiaOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveBBCH} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cuartel *</label>
                  <select value={bbchParcelaId} onChange={(e) => setBbchParcelaId(e.target.value)} className="w-full p-2.5 rounded-lg border bg-white">
                    {parcelas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    {parcelas.length === 0 && <option value="general">Huerto General</option>}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha *</label>
                  <input type="date" required value={bbchFecha} onChange={(e) => setBbchFecha(e.target.value)} className="w-full p-2.5 rounded-lg border" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Estado Fenológico BBCH *</label>
                <select value={bbchEstado} onChange={(e) => setBbchEstado(e.target.value)} className="w-full p-2.5 rounded-lg border bg-white font-bold text-stone-900">
                  <option value="BBCH 00: Receso invernal (Yemas en reposo vegetativo)">BBCH 00: Receso invernal</option>
                  <option value="BBCH 09: Punta verde / Hinchazón de yemas">BBCH 09: Punta verde / Hinchazón de yemas</option>
                  <option value="BBCH 15: Primeras hojas expandidas">BBCH 15: Primeras hojas expandidas</option>
                  <option value="BBCH 55: Botón floral individual visible en axilas">BBCH 55: Botón floral visible</option>
                  <option value="BBCH 61: Inicio de floración (10% flores abiertas)">BBCH 61: Inicio de floración (10%)</option>
                  <option value="BBCH 65: Plena Floración (50% flores abiertas)">BBCH 65: Plena Floración (50%)</option>
                  <option value="BBCH 71: Caída de pétalos y cuaja de frutos">BBCH 71: Caída de pétalos y cuaja</option>
                  <option value="BBCH 79: Crecimiento rápido de fruto (1 cm/semana)">BBCH 79: Crecimiento rápido de fruto</option>
                  <option value="BBCH 85: Maduración inicial">BBCH 85: Maduración inicial</option>
                  <option value="BBCH 89: Madurez de Cosecha (>= 6.2° Brix)">BBCH 89: Madurez de Cosecha (&ge; 6.2° Brix)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Porcentaje de Avance en el Cuartel (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={bbchPorcentaje}
                  onChange={(e) => setBbchPorcentaje(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg border font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones Técnicas</label>
                <textarea rows={2} value={bbchObservaciones} onChange={(e) => setBbchObservaciones(e.target.value)} placeholder="Detalles de floración, vigor..." className="w-full p-2 rounded-lg border" />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalFenologiaOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg cursor-pointer">Guardar Estado BBCH</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR POLINIZACIÓN */}
      {isModalPolinizacionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border">
            <div className="px-5 py-4 border-b bg-amber-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Flower2 className="w-4 h-4 text-amber-300" />
                Registrar Colmenas de Polinización
              </h3>
              <button onClick={() => setIsModalPolinizacionOpen(false)} className="text-amber-200 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSavePolinizacionModal} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cuartel *</label>
                  <select value={polParcelaId} onChange={(e) => setPolParcelaId(e.target.value)} className="w-full p-2.5 rounded-lg border bg-white">
                    {parcelas.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.superficieHa} ha)</option>)}
                    {parcelas.length === 0 && <option value="general">Huerto General</option>}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tipo de Polinizador *</label>
                  <select value={polTipo} onChange={(e: any) => setPolTipo(e.target.value)} className="w-full p-2.5 rounded-lg border bg-white font-bold">
                    <option value="Mixta (Abejas + Abejorros)">Mixta (Abejas + Abejorros)</option>
                    <option value="Abejas melíferas (Apis mellifera)">Abejas melíferas (Apis mellifera)</option>
                    <option value="Abejorros (Bombus terrestris)">Abejorros (Bombus terrestris)</option>
                    <option value="Polen seco / asistido">Polen seco / asistido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-bold text-amber-950 mb-1">Total Colmenas *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={polColmenas}
                    onChange={(e) => setPolColmenas(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 rounded-lg border border-amber-300 bg-white font-bold text-amber-950"
                  />
                  <span className="text-[10px] text-amber-800 mt-0.5 block">Recomendado: 8 a 10 colm/ha</span>
                </div>
                <div>
                  <label className="block font-bold text-amber-950 mb-1">Sincronía Floral</label>
                  <select value={polSincronia} onChange={(e: any) => setPolSincronia(e.target.value)} className="w-full p-2.5 rounded-lg border border-amber-300 bg-white">
                    <option value="Óptima (>90%)">Óptima (&gt;90%)</option>
                    <option value="Aceptable (70-90%)">Aceptable (70-90%)</option>
                    <option value="Desfasada (<70%)">Desfasada (&lt;70%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha Entrada *</label>
                  <input type="date" required value={polFechaEntrada} onChange={(e) => setPolFechaEntrada(e.target.value)} className="w-full p-2 rounded-lg border" />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha Retiro *</label>
                  <input type="date" required value={polFechaSalida} onChange={(e) => setPolFechaSalida(e.target.value)} className="w-full p-2 rounded-lg border" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Proveedor Apiario</label>
                  <input type="text" value={polProveedor} onChange={(e) => setPolProveedor(e.target.value)} placeholder="Ej: Apícola Central" className="w-full p-2 rounded-lg border" />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">% Flores Abiertas</label>
                  <input type="number" min="0" max="100" value={polFloresAbiertas} onChange={(e) => setPolFloresAbiertas(parseInt(e.target.value) || 0)} className="w-full p-2 rounded-lg border" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones</label>
                <textarea rows={2} value={polObservaciones} onChange={(e) => setPolObservaciones(e.target.value)} placeholder="Piqueras, orientación al sol..." className="w-full p-2 rounded-lg border" />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalPolinizacionOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg cursor-pointer">Registrar Colmenas</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BROTACIÓN */}
      {isModalBrotacionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border overflow-hidden">
            <div className="px-5 py-4 border-b bg-teal-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Conteo de Yemas y % de Brotación</h3>
              <button onClick={() => setIsModalBrotacionOpen(false)} className="text-teal-200 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveBrotacion} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cuartel *</label>
                  <select value={broParcelaId} onChange={(e) => setBroParcelaId(e.target.value)} className="w-full p-2 rounded-lg border bg-white">
                    {parcelas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha *</label>
                  <input type="date" required value={broFecha} onChange={(e) => setBroFecha(e.target.value)} className="w-full p-2 rounded-lg border" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hilera / Muestra</label>
                <input type="text" value={broHilera} onChange={(e) => setBroHilera(e.target.value)} placeholder="Ej: Hilera 5 a 15" className="w-full p-2 rounded-lg border" />
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border">
                <div>
                  <label className="block font-bold mb-1">Cargadores</label>
                  <input type="number" value={broCargadores} onChange={(e) => setBroCargadores(parseInt(e.target.value) || 1)} className="w-full p-2 rounded border bg-white" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Yemas Invierno</label>
                  <input type="number" value={broYemasInvierno} onChange={(e) => setBroYemasInvierno(parseInt(e.target.value) || 1)} className="w-full p-2 rounded border bg-white" />
                </div>
                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Brotes Vivos</label>
                  <input type="number" value={broBrotesEmergidos} onChange={(e) => setBroBrotesEmergidos(parseInt(e.target.value) || 0)} className="w-full p-2 rounded border bg-white font-bold" />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex justify-between items-center">
                <span className="font-bold text-emerald-950">% Brotación Automático:</span>
                <span className="text-2xl font-extrabold text-emerald-950">{pctBrotacionCalculado}%</span>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalBrotacionOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-teal-800 text-white font-bold rounded-lg">Guardar Conteo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR OBSERVACIÓN ETAPA E1-E5 (SABAINI) */}
      {isModalRegistroEtapaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border">
            <div className="px-5 py-4 border-b bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Registrar Observación Fenológica ({etapaSeleccionada})</h3>
              <button onClick={() => setIsModalRegistroEtapaOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveRegistroEtapa} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cuartel *</label>
                  <select value={regParcelaId} onChange={(e) => setRegParcelaId(e.target.value)} className="w-full p-2.5 rounded-lg border bg-white">
                    {parcelas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    {parcelas.length === 0 && <option value="general">Huerto General</option>}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha *</label>
                  <input type="date" required value={regFecha} onChange={(e) => setRegFecha(e.target.value)} className="w-full p-2.5 rounded-lg border" />
                </div>
              </div>

              {etapaSeleccionada === 'E1' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Diámetro de Brotes a la Base (mm)</label>
                  <input type="number" step="0.5" value={regDiametroBrotes} onChange={(e) => setRegDiametroBrotes(parseFloat(e.target.value) || 0)} placeholder="Ej: 14 mm (> o < 15 mm)" className="w-full p-2.5 rounded-lg border" />
                </div>
              )}

              {etapaSeleccionada === 'E2' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crecimiento Polar Semanal de Fruto (cm/semana)</label>
                  <input type="number" step="0.1" value={regCalibreSemanal} onChange={(e) => setRegCalibreSemanal(parseFloat(e.target.value) || 0)} placeholder="Meta fruto grande: 1.0 cm/sem" className="w-full p-2.5 rounded-lg border font-bold" />
                </div>
              )}

              {etapaSeleccionada === 'E3' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Materia Seca en Fruto (% MS)</label>
                  <input type="number" step="0.1" value={regMateriaSeca} onChange={(e) => setRegMateriaSeca(parseFloat(e.target.value) || 0)} placeholder="Ej: 16.5%" className="w-full p-2.5 rounded-lg border font-bold" />
                </div>
              )}

              {(etapaSeleccionada === 'E4' || etapaSeleccionada === 'E5') && (
                <div className="space-y-3 p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">🌾 Enmienda Agrícola Aplicada (BEO / CHM)</label>
                    <input type="text" value={regEnmienda} onChange={(e) => setRegEnmienda(e.target.value)} placeholder="Ej: Banda de Enmienda Orgánica (BEO) 8 t/ha en camellón" className="w-full p-2.5 rounded-lg border border-emerald-300 bg-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Actividad de Raíces / Calicata</label>
                    <select value={regFlashRaices} onChange={(e) => setRegFlashRaices(e.target.value)} className="w-full p-2.5 rounded-lg border bg-white">
                      <option value="Flash de otoño activo">Flash radicular de otoño activo (raicillas blancas)</option>
                      <option value="Flash de primavera activo">Flash radicular de primavera activo</option>
                      <option value="En crecimiento">Raíces en crecimiento moderado</option>
                      <option value="Sin actividad">Sin actividad evidente</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones Técnicas</label>
                <textarea rows={2} value={regObs} onChange={(e) => setRegObs(e.target.value)} placeholder="Detalles de canopia, vigor o síntomas radiculares..." className="w-full p-2.5 rounded-lg border" />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalRegistroEtapaOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg cursor-pointer">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
