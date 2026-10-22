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
  Info,
  Droplet,
  Sun,
  ShieldCheck
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
  const [subTab, setSubTab] = useState<'etapas_sabaini' | 'brotacion' | 'horas_frio' | 'polinizacion'>('etapas_sabaini');
  const [etapaSeleccionada, setEtapaSeleccionada] = useState<EtapaFenologicaSabaini>('E1');

  // Modales
  const [isModalBrotacionOpen, setIsModalBrotacionOpen] = useState(false);
  const [isModalRegistroEtapaOpen, setIsModalRegistroEtapaOpen] = useState(false);

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

  // Estados Registros Fenológicos de Etapas E1-E5
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

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-600/40">
            <Sprout className="w-3.5 h-3.5 text-emerald-300" />
            Modelo Fenológico 5 Etapas (Sabaini / Comité del Kiwi)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Fenología del Kiwi y Momentos Clave de Gestión
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Sincronización de manejos aéreos y vitalización de suelos con enmiendas agrícolas (BEO/CHM), conteo de yemas y fertilidad.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsModalRegistroEtapaOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            + Registrar Observación Etapa ({etapaSeleccionada})
          </button>
          <button
            onClick={() => setIsModalBrotacionOpen(true)}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <Percent className="w-4 h-4" />
            + Conteo Yemas
          </button>
        </div>
      </div>

      {/* Sub-Tabs de Navegación */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('etapas_sabaini')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'etapas_sabaini' ? 'bg-emerald-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-300" />
          Las 5 Etapas Fenológicas Anuales (E1 - E5)
        </button>

        <button
          onClick={() => setSubTab('brotacion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'brotacion' ? 'bg-emerald-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Percent className="w-4 h-4 text-teal-300" />
          Conteo de Yemas & % Brotación ({conteosBrotacion.length})
        </button>

        <button
          onClick={() => setSubTab('horas_frio')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'horas_frio' ? 'bg-sky-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Snowflake className="w-4 h-4 text-sky-300" />
          Horas Frío & Rompedor ({horasFrio.horasFrioAcumuladas} HF)
        </button>

        <button
          onClick={() => setSubTab('polinizacion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'polinizacion' ? 'bg-amber-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Flower2 className="w-4 h-4 text-amber-300" />
          Polinización & Colmenas ({polinizacion.length})
        </button>
      </div>

      {/* SUBTAB 1: LAS 5 ETAPAS FENOLÓGICAS DE SABAINI */}
      {subTab === 'etapas_sabaini' && (
        <div className="space-y-6">
          {/* Selector de las 5 Etapas */}
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

          {/* FICHA TÉCNICA DINÁMICA DE LA ETAPA SELECCIONADA */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            
            {etapaSeleccionada === 'E1' && (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-950">ETAPA 1 (Septiembre - Noviembre)</span>
                    <h2 className="text-base font-bold text-stone-900 mt-1">Inicio de Brotación a Plena Floración</h2>
                    <p className="text-xs text-stone-500">Diferenciación floral 10 días antes de brotación. Los brotes y flores crecen a expensas de las reservas de la temporada pasada.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    T° Media: 13,2°C a 18,6°C
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-stone-50 rounded-xl border space-y-1">
                    <strong className="text-stone-900 block">🌿 Brotes y Yemas (E1)</strong>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Medir diámetro a la base (> o < 1,5 cm), largo de brotes, yemas/metro y yemas/cuadrante. Distinguir brotes con y sin hojas.
                    </p>
                    <div className="p-2 bg-white rounded border text-[10px] font-mono font-bold text-emerald-900 mt-1">
                      % Brotación &times; Botones/Brote = Fertilidad
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border space-y-1">
                    <strong className="text-stone-900 block">🌸 Flores y Pedúnculo (E1)</strong>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      El pedúnculo floral se engruesa con buenos niveles de citoquininas biosintetizadas en raíces vigorosas. Predecir calibre final midiendo diámetro ecuatorial en antesis.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1 text-amber-950">
                    <strong className="block">✂️ Manejos Agrícolas Clave (E1)</strong>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      <li><strong>Apriete de ápices</strong> desde inicios de octubre.</li>
                      <li><strong>Eliminación de brotes basitónicos</strong> en noviembre antes de plena flor.</li>
                      <li><strong>Poda cero hoja</strong> en frutos recién cuajados.</li>
                      <li><strong>Polinización</strong>: Semillas como sumidero prioritario.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {etapaSeleccionada === 'E2' && (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-950">ETAPA 2 (Noviembre - Enero)</span>
                    <h2 className="text-base font-bold text-stone-900 mt-1">Plena Flor a 50 DDPF (Días Después de Plena Flor)</h2>
                    <p className="text-xs text-stone-500">Etapa de máxima división celular, absorción masiva de Calcio y definición de calibre.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    T° Media: 18,6°C a 20,0°C
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1 text-blue-950">
                    <strong className="block">⚡ Tasa Explosiva de Fruto (E2)</strong>
                    <p className="text-[11px] leading-relaxed">
                      En Hayward los primeros 35 DDPF el fruto crece a <strong>1,6 g/día</strong>. Potencial de crecimiento para frutos grandes: <strong>1 cm polar/semana</strong>. Logra el 50% de su peso y 70% de su volumen final.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border space-y-1">
                    <strong className="text-stone-900 block">🥛 Absorción Crítica de Calcio</strong>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Las frutas absorben en las <strong>primeras 6 semanas</strong> un alto porcentaje del calcio total directamente desde reservas de raíces mediante flujo xilemático.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1 text-amber-950">
                    <strong className="block">🌊 Manejos Agrícolas Clave (E2)</strong>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      <li><strong>Máxima sensibilidad hídrica</strong> con demandas crecientes a niveles máximos.</li>
                      <li><strong>Manejo de brotes indeterminados</strong> para derivar vigor y carbohidratos a frutos.</li>
                      <li><strong>Anillado</strong> de ramas para respuesta en calibres y materia seca.</li>
                      <li>Aplicación exógena de citoquininas.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {etapaSeleccionada === 'E3' && (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-950">ETAPA 3 (Enero - Abril)</span>
                    <h2 className="text-base font-bold text-stone-900 mt-1">50 DDPF hasta Inicio de Cosecha</h2>
                    <p className="text-xs text-stone-500">Construcción de calidad bioquímica interna, acumulación de almidones, vitaminas y materia seca final.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    T° Media: 19,5°C a 14,0°C
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 space-y-1 text-teal-950">
                    <strong className="block">📈 Curva de Materia Seca (% MS)</strong>
                    <p className="text-[11px] leading-relaxed">
                      Lento crecimiento del fruto pero máxima síntesis de nutrientes complejos: polifenoles, carotenoides (luteína/zeaxantina), vitamina C y E, minerales quelatados orgánicos.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border space-y-1">
                    <strong className="text-stone-900 block">☀️ Manejo de Luz en Parrón</strong>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Las áreas de sombra provocan desuniformidad en madurez y menores calibres. Hojas en sombra pasan a tener fotosíntesis neta negativa.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1 text-amber-950">
                    <strong className="block">⚠️ Alertas de Manejo (E3)</strong>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      <li><strong>Prohibido ralear grandes cantidades en E3</strong>: Alto riesgo productivo por pérdida energética ya invertida.</li>
                      <li><strong>Anillado en plantas sanas</strong> para aumentar fertilidad de yemas del año siguiente.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {etapaSeleccionada === 'E4' && (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-950">ETAPA 4 (Abril - Junio)</span>
                    <h2 className="text-base font-bold text-stone-900 mt-1">Cosecha a Caída de Hojas (Postcosecha)</h2>
                    <p className="text-xs text-stone-500">Repone reservas de carbohidratos (CHO) para la próxima temporada. Órgano sumidero clave: yemas axilares.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                    T° Media: 14,0°C a 8,0°C
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-stone-50 rounded-xl border space-y-1">
                    <strong className="text-stone-900 block">🪵 Lignificación de Brotes</strong>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Transición de epidermis a peridermis (color verde a café plateado). Maduración de maderas y yemas de invierno.
                    </p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 space-y-1 text-orange-950">
                    <strong className="block">🌱 Flash Radicular de Otoño</strong>
                    <p className="text-[11px] leading-relaxed">
                      Intensa emisión de raicillas y pelos radiculares en torno y posterior a la cosecha. Evaluar mediante calicatas o rhizotrones.
                    </p>
                  </div>

                  {/* ENMIENDA AGRÍCOLA CLAVE EN E4 */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1 text-emerald-950">
                    <strong className="block flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      🌾 Enmienda Agrícola en E4 (BEO / CHM)
                    </strong>
                    <p className="text-[11px] leading-relaxed">
                      Momento oportuno para aplicar la <strong>Banda de Enmienda Orgánica (BEO)</strong> sobre el camellón y sembrar <strong>Cubiertas Herbáceas Multiespecies (CHM)</strong> para aportar sustancias húmicas y cubrir el suelo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {etapaSeleccionada === 'E5' && (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-950">ETAPA 5 (Junio - Septiembre)</span>
                    <h2 className="text-base font-bold text-stone-900 mt-1">Receso Invernal a Inicio de Brotación</h2>
                    <p className="text-xs text-stone-500">Madera en total receso, acumulación de Horas Frío, conversión de almidones a azúcares protectores contra heladas y biología del suelo.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    T° Media: 7,1°C a 10,5°C
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-1 text-sky-950">
                    <strong className="block">❄️ Horas Frío & Rompedor</strong>
                    <p className="text-[11px] leading-relaxed">
                      Requerimiento: <strong>800 a 1.000 HF</strong> (&lt; 7,2°C). Los almidones se transforman en azúcares para bajar el punto de congelamiento celular. Al final de E5, nuevo flash radicular emite exudados azucarados hacia E1.
                    </p>
                  </div>

                  {/* ENMIENDA Y SUELO EN E5 */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1 text-emerald-950">
                    <strong className="block flex items-center gap-1">
                      <Sprout className="w-4 h-4 text-emerald-700" />
                      🦠 Enmiendas y Rizobacterias PGPR
                    </strong>
                    <p className="text-[11px] leading-relaxed">
                      Suelos con <strong>enmiendas orgánicas y cubiertas vegetales</strong> extienden el flash radicular hacia el invierno, promoviendo bacterias PGPR que sintetizan auxinas, citoquininas y giberelinas naturales.
                    </p>
                  </div>

                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1 text-red-950">
                    <strong className="block">⚠️ Alerta: Compactación del Suelo</strong>
                    <p className="text-[11px] leading-relaxed">
                      Suelos compactados generan asfixia y estrés radicular que desencadenan senescencia prematura de flores, aborto de semillas y <strong>alta proporción de frutos achatados o deformes</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* TABLA DE OBSERVACIONES REGISTRADAS EN ESTA ETAPA */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-stone-900 text-xs">Historial de Observaciones Fenológicas ({etapaSeleccionada})</h3>
                <p className="text-[11px] text-stone-500">Morfología de brotes, flash radicular y enmiendas aplicadas</p>
              </div>
              <button
                onClick={() => setIsModalRegistroEtapaOpen(true)}
                className="px-3 py-1.5 bg-emerald-800 text-white font-bold rounded-lg cursor-pointer"
              >
                + Nueva Observación
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {registrosEtapas.filter(r => r.etapa === etapaSeleccionada).map((reg) => (
                <div key={reg.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{reg.parcelaNombre}</span>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-950">
                        {reg.etapa}
                      </span>
                      <span className="text-stone-500">· {reg.fecha}</span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 text-[11px] text-stone-600 mt-1">
                      {reg.diametroBrotesBaseMm && <span>Diám. brote base: <strong>{reg.diametroBrotesBaseMm} mm</strong></span>}
                      {reg.calibreFrutoPolarSemanalCm && <span>Crec. polar: <strong>{reg.calibreFrutoPolarSemanalCm} cm/sem</strong></span>}
                      {reg.materiaSecaFruto && <span>Materia Seca: <strong>{reg.materiaSecaFruto}%</strong></span>}
                      {reg.estadoRaicesFlash && <span>Raíces: <strong>{reg.estadoRaicesFlash}</strong></span>}
                      {reg.enmiendaAplicada && <span className="text-emerald-800 font-bold">🌾 Enmienda: {reg.enmiendaAplicada}</span>}
                    </div>

                    {reg.observaciones && (
                      <p className="text-stone-500 italic mt-1 text-[11px]">"{reg.observaciones}"</p>
                    )}
                  </div>

                  <button
                    onClick={() => setRegistrosEtapas(registrosEtapas.filter(x => x.id !== reg.id))}
                    className="p-1.5 text-stone-400 hover:text-red-700 cursor-pointer self-end md:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {registrosEtapas.filter(r => r.etapa === etapaSeleccionada).length === 0 && (
                <div className="p-6 text-center text-stone-400">
                  No hay observaciones registradas para la etapa {etapaSeleccionada}. Haz clic en <strong>"+ Nueva Observación"</strong> para agregar mediciones de campo.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: BROTACIÓN */}
      {subTab === 'brotacion' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border flex justify-between items-center">
            <div>
              <h3 className="font-bold text-stone-900">Conteo de Yemas de Invierno y % de Brotación</h3>
              <p className="text-stone-500">Evaluación en cargadores seleccionados para medir fertilidad y respuesta al rompedor</p>
            </div>
            <button
              onClick={() => setIsModalBrotacionOpen(true)}
              className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
            >
              + Nuevo Conteo
            </button>
          </div>

          <div className="bg-white rounded-2xl border divide-y">
            {conteosBrotacion.map((b) => (
              <div key={b.id} className="p-4 flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-stone-900">{b.parcelaNombre}</strong>
                    <span className="text-stone-500">({b.hileraSector})</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-950">
                      {b.porcentajeBrotacion}% Brotación
                    </span>
                  </div>
                  <div className="flex gap-4 text-stone-600 mt-1">
                    <span>Cargadores: {b.cargadoresMuestreados}</span>
                    <span>Yemas totales: {b.yemasTotalesInvierno}</span>
                    <span>Brotes fértiles: {b.brotesFertilesFlorales} ({b.porcentajeFertilidad}%)</span>
                  </div>
                </div>
                <button onClick={() => setConteosBrotacion(conteosBrotacion.filter(x => x.id !== b.id))} className="text-stone-400 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: HORAS FRÍO */}
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

      {/* SUBTAB 4: POLINIZACIÓN */}
      {subTab === 'polinizacion' && (
        <div className="bg-white rounded-2xl border divide-y">
          {polinizacion.map(p => (
            <div key={p.id} className="p-4 flex justify-between items-center text-xs">
              <div>
                <strong className="text-stone-900">{p.parcelaNombre}</strong>
                <span className="text-amber-800 ml-2 font-semibold">({p.tipoPolinizador})</span>
                <p className="text-stone-500 mt-0.5">Colmenas totales: {p.colmenasTotales} ({p.colmenasPorHectarea} colm/ha) · Sincronía: {p.sincroniaFloracion}</p>
              </div>
              <button onClick={() => onDeletePolinizacion(p.id)} className="text-stone-400 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL REGISTRAR OBSERVACIÓN ETAPA E1-E5 */}
      {isModalRegistroEtapaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border">
            <div className="px-5 py-4 border-b bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Registrar Observación Fenológica ({etapaSeleccionada})</h3>
              <button onClick={() => setIsModalRegistroEtapaOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRegistroEtapa} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cuartel *</label>
                  <select
                    value={regParcelaId}
                    onChange={(e) => setRegParcelaId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-white"
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
                    value={regFecha}
                    onChange={(e) => setRegFecha(e.target.value)}
                    className="w-full p-2.5 rounded-lg border"
                  />
                </div>
              </div>

              {/* Parámetros Específicos según Etapa */}
              {etapaSeleccionada === 'E1' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Diámetro de Brotes a la Base (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={regDiametroBrotes}
                    onChange={(e) => setRegDiametroBrotes(parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 14 mm (comparar > o < 15 mm)"
                    className="w-full p-2.5 rounded-lg border"
                  />
                </div>
              )}

              {etapaSeleccionada === 'E2' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crecimiento Polar Semanal de Fruto (cm/semana)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={regCalibreSemanal}
                    onChange={(e) => setRegCalibreSemanal(parseFloat(e.target.value) || 0)}
                    placeholder="Meta fruto grande: 1.0 cm/sem"
                    className="w-full p-2.5 rounded-lg border font-bold"
                  />
                </div>
              )}

              {etapaSeleccionada === 'E3' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Materia Seca en Fruto (% MS)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={regMateriaSeca}
                    onChange={(e) => setRegMateriaSeca(parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 16.5%"
                    className="w-full p-2.5 rounded-lg border font-bold"
                  />
                </div>
              )}

              {(etapaSeleccionada === 'E4' || etapaSeleccionada === 'E5') && (
                <div className="space-y-3 p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">🌾 Enmienda Agrícola Aplicada (BEO / CHM)</label>
                    <input
                      type="text"
                      value={regEnmienda}
                      onChange={(e) => setRegEnmienda(e.target.value)}
                      placeholder="Ej: Banda de Enmienda Orgánica (BEO) 8 t/ha en camellón"
                      className="w-full p-2.5 rounded-lg border border-emerald-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Actividad de Raíces / Calicata</label>
                    <select
                      value={regFlashRaices}
                      onChange={(e) => setRegFlashRaices(e.target.value)}
                      className="w-full p-2.5 rounded-lg border bg-white"
                    >
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
                <textarea
                  rows={2}
                  value={regObs}
                  onChange={(e) => setRegObs(e.target.value)}
                  placeholder="Detalles sobre canopia, luz, vigor o síntomas radiculares..."
                  className="w-full p-2.5 rounded-lg border"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalRegistroEtapaOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg">Guardar Registro</button>
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
    </div>
  );
};
