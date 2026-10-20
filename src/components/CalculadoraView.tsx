import React, { useState } from 'react';
import { 
  Calculator, 
  Droplet, 
  Sprout, 
  Wheat, 
  Layers, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export const CalculadoraView: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'caldo' | 'densidad' | 'npk' | 'lamina'>('caldo');

  // 1. Caldo Pulverización States
  const [tanqueLitros, setTanqueLitros] = useState<number>(2000);
  const [gastoCaldoHa, setGastoCaldoHa] = useState<number>(1200);
  const [dosisHa, setDosisHa] = useState<number>(0.8);
  const [superficieTratarHa, setSuperficieTratarHa] = useState<number>(4.8);
  const [unidadProducto, setUnidadProducto] = useState<'kg' | 'L'>('kg');

  // Cálculos Caldo
  const haPorTanque = gastoCaldoHa > 0 ? tanqueLitros / gastoCaldoHa : 0;
  const productoPorTanque = haPorTanque * dosisHa;
  const tanquesNecesarios = haPorTanque > 0 ? superficieTratarHa / haPorTanque : 0;
  const productoTotalLote = superficieTratarHa * dosisHa;

  // 2. Densidad Plantación States
  const [distEntreHileras, setDistEntreHileras] = useState<number>(4.0);
  const [distSobreHilera, setDistSobreHilera] = useState<number>(2.0);
  const [superficieLoteHa, setSuperficieLoteHa] = useState<number>(3.5);

  // Cálculos Densidad
  const areaPorPlanta = distEntreHileras * distSobreHilera;
  const plantasPorHa = areaPorPlanta > 0 ? Math.round(10000 / areaPorPlanta) : 0;
  const totalPlantasLote = Math.round(plantasPorHa * superficieLoteHa);

  // 3. NPK Nutrición States
  const [fertilizanteTipo, setFertilizanteTipo] = useState<string>('urea');
  const [dosisFertilizanteKgHa, setDosisFertilizanteKgHa] = useState<number>(150);
  const [areaFertHa, setAreaFertHa] = useState<number>(4.8);

  const getFertilizerGrades = (type: string) => {
    switch (type) {
      case 'urea': return { n: 0.46, p: 0, k: 0, label: 'Urea (46-0-0)' };
      case 'nitrato_calcio': return { n: 0.155, p: 0, k: 0, label: 'Nitrato de Calcio (15.5-0-0 + 26 CaO)' };
      case 'map': return { n: 0.12, p: 0.61, k: 0, label: 'Fosfato Monoamónico MAP (12-61-0)' };
      case 'dap': return { n: 0.18, p: 0.46, k: 0, label: 'Fosfato Diamónico DAP (18-46-0)' };
      case 'sulfato_potasio': return { n: 0, p: 0, k: 0.50, label: 'Sulfato de Potasio Soluble (0-0-50)' };
      case 'cloruro_potasio': return { n: 0, p: 0, k: 0.60, label: 'Cloruro de Potasio (0-0-60)' };
      case 'triple15': return { n: 0.15, p: 0.15, k: 0.15, label: 'Mezcla Completa (15-15-15)' };
      default: return { n: 0.20, p: 0.10, k: 0.10, label: 'Personalizado' };
    }
  };

  const currentGrade = getFertilizerGrades(fertilizanteTipo);
  const aporteN_ha = dosisFertilizanteKgHa * currentGrade.n;
  const aporteP_ha = dosisFertilizanteKgHa * currentGrade.p;
  const aporteK_ha = dosisFertilizanteKgHa * currentGrade.k;
  const aporteN_total = aporteN_ha * areaFertHa;
  const aporteP_total = aporteP_ha * areaFertHa;
  const aporteK_total = aporteK_ha * areaFertHa;

  // 4. Lámina de Riego States
  const [caudalGoteroLtsH, setCaudalGoteroLtsH] = useState<number>(2.0); // 2 L/h
  const [distGoterosM, setDistGoterosM] = useState<number>(0.5); // 0.5 m entre goteros
  const [distHilerasRiegoM, setDistHilerasRiegoM] = useState<number>(4.0); // 4 m entre hileras
  const [horasRiego, setHorasRiego] = useState<number>(4.0);

  // mm de agua = (caudal / área de cobertura por gotero) * horas
  // Área por gotero = distGoteros * distHileras (m²)
  const areaPorGotero = distGoterosM * distHilerasRiegoM;
  const intensidadPrecipitacionMmH = areaPorGotero > 0 ? caudalGoteroLtsH / areaPorGotero : 0;
  const laminaRiegoMm = intensidadPrecipitacionMmH * horasRiego;
  const m3PorHa = laminaRiegoMm * 10; // 1 mm = 10 m³/ha

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Calculadora Agronómica de Campo
          </h1>
          <p className="text-xs text-stone-500">
            Herramientas técnicas de calibración de pulverizador, densidad vegetal, nutrición NPK y lámina de riego
          </p>
        </div>
      </div>

      {/* Segmented Selector */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveCalc('caldo')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCalc === 'caldo'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Droplet className="w-3.5 h-3.5 text-emerald-800" />
          Caldo y Dosificación Pulverizador
        </button>

        <button
          onClick={() => setActiveCalc('densidad')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCalc === 'densidad'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sprout className="w-3.5 h-3.5 text-emerald-800" />
          Densidad de Plantación
        </button>

        <button
          onClick={() => setActiveCalc('npk')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCalc === 'npk'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Wheat className="w-3.5 h-3.5 text-emerald-800" />
          Aporte Nutricional N-P-K
        </button>

        <button
          onClick={() => setActiveCalc('lamina')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCalc === 'lamina'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-800" />
          Lámina de Riego (mm)
        </button>
      </div>

      {/* 1. CALDO PULVERIZADOR */}
      {activeCalc === 'caldo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Parámetros de Maquinaria y Lote
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Capacidad del Estanque del Pulverizador (Litros)
                </label>
                <input
                  type="number"
                  value={tanqueLitros}
                  onChange={(e) => setTanqueLitros(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
                <span className="text-[11px] text-stone-400">Valores típicos: 1000L, 1500L, 2000L, 3000L</span>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Volumen de Caldo Calibrado por Hectárea (L/ha)
                </label>
                <input
                  type="number"
                  value={gastoCaldoHa}
                  onChange={(e) => setGastoCaldoHa(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
                <span className="text-[11px] text-stone-400">Según calibración con tractor a velocidad constante</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Dosis Recomendada por Hectárea
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={dosisHa}
                    onChange={(e) => setDosisHa(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Unidad</label>
                  <select
                    value={unidadProducto}
                    onChange={(e) => setUnidadProducto(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  >
                    <option value="kg">kg/ha (Polvos mojables / granulados)</option>
                    <option value="L">L/ha (Líquidos / suspensiones)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Superficie del Cuartel / Lote a Tratar (ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={superficieTratarHa}
                  onChange={(e) => setSuperficieTratarHa(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Results Caldo */}
          <div className="lg:col-span-6 bg-stone-900 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                Resultado de Mezcla para Terreno
              </div>
              <h3 className="text-lg font-bold">
                Instrucciones para el Operador del Pulverizador
              </h3>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                  <span className="text-xs text-stone-300 block">Dosis a Disolver por Estanque Lleno</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-300 font-mono tabular-nums">
                      {productoPorTanque.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold">{unidadProducto} de producto</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    Cada estanque cubre exactamente {haPorTanque.toFixed(2)} hectáreas
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-stone-400 block">Estanques para el lote</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-white mt-1 block">
                      {tanquesNecesarios.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      ≈ {Math.floor(tanquesNecesarios)} llenos + {((tanquesNecesarios % 1) * 100).toFixed(0)}% remanente
                    </span>
                  </div>

                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-stone-400 block">Total Producto Requerido</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1 block">
                      {productoTotalLote.toFixed(2)} {unidadProducto}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Para {superficieTratarHa} hectáreas totales
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 rounded-lg border border-emerald-800/40 text-[11px] text-emerald-200">
              💡 <strong>Recomendación agronómica:</strong> Llenar el estanque hasta el 50% con agua limpia, poner el agitador en marcha, diluir el producto previamente en un balde (premezcla) y luego completar el volumen restante de agua.
            </div>
          </div>
        </div>
      )}

      {/* 2. DENSIDAD PLANTACIÓN */}
      {activeCalc === 'densidad' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Marco de Plantación y Superficie
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Distancia entre Hileras (metros)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={distEntreHileras}
                  onChange={(e) => setDistEntreHileras(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Distancia sobre la Hilera / entre Plantas (metros)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={distSobreHilera}
                  onChange={(e) => setDistSobreHilera(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Superficie del Cuartel (Hectáreas)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={superficieLoteHa}
                  onChange={(e) => setSuperficieLoteHa(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-900 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                Población Vegetal Calculada
              </div>
              <h3 className="text-lg font-bold">
                Densidad y Demanda de Plantas / Plantones
              </h3>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                  <span className="text-xs text-stone-300 block">Densidad por Hectárea</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-300 font-mono tabular-nums">
                      {plantasPorHa.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold">plantas / ha</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    Área asignada por planta: {areaPorPlanta.toFixed(2)} m²
                  </span>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-stone-400 block text-xs">Total Plantas Requeridas para el Cuartel</span>
                  <span className="text-2xl font-bold font-mono tabular-nums text-white mt-1 block">
                    {totalPlantasLote.toLocaleString()} plantas
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    Para {superficieLoteHa} ha (Se recomienda cotizar 5% extra para replante: {(totalPlantasLote * 1.05).toFixed(0)} plantas)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. APORTE NUTRICIONAL NPK */}
      {activeCalc === 'npk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Fertilizante y Dosis Aplicada
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Tipo de Fertilizante
                </label>
                <select
                  value={fertilizanteTipo}
                  onChange={(e) => setFertilizanteTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                >
                  <option value="urea">Urea Granulada (46-0-0)</option>
                  <option value="nitrato_calcio">Nitrato de Calcio (15.5-0-0 + 26 CaO)</option>
                  <option value="map">Fosfato Monoamónico MAP (12-61-0)</option>
                  <option value="dap">Fosfato Diamónico DAP (18-46-0)</option>
                  <option value="sulfato_potasio">Sulfato de Potasio Soluble (0-0-50)</option>
                  <option value="cloruro_potasio">Cloruro de Potasio (0-0-60)</option>
                  <option value="triple15">Mezcla Completa Triple 15 (15-15-15)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Dosis de Fertilizante por Hectárea (kg/ha)
                </label>
                <input
                  type="number"
                  value={dosisFertilizanteKgHa}
                  onChange={(e) => setDosisFertilizanteKgHa(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Superficie Total Fertilizada (ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={areaFertHa}
                  onChange={(e) => setAreaFertHa(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-900 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                Balance Nutricional
              </div>
              <h3 className="text-lg font-bold">
                Unidades Efectivas de Nutrientes Aportadas
              </h3>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="p-3 bg-white/10 rounded-lg border border-white/10 text-center">
                  <span className="text-xs text-stone-400 block font-bold">Nitrógeno (N)</span>
                  <span className="text-2xl font-extrabold text-emerald-300 font-mono tabular-nums block mt-1">
                    {aporteN_ha.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-stone-400">kg N / ha</span>
                  <span className="text-[10px] text-stone-300 block mt-1 border-t border-white/10 pt-1">
                    Total: {aporteN_total.toFixed(0)} kg
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-lg border border-white/10 text-center">
                  <span className="text-xs text-stone-400 block font-bold">Fósforo (P₂O₅)</span>
                  <span className="text-2xl font-extrabold text-sky-300 font-mono tabular-nums block mt-1">
                    {aporteP_ha.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-stone-400">kg P₂O₅ / ha</span>
                  <span className="text-[10px] text-stone-300 block mt-1 border-t border-white/10 pt-1">
                    Total: {aporteP_total.toFixed(0)} kg
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-lg border border-white/10 text-center">
                  <span className="text-xs text-stone-400 block font-bold">Potasio (K₂O)</span>
                  <span className="text-2xl font-extrabold text-amber-300 font-mono tabular-nums block mt-1">
                    {aporteK_ha.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-stone-400">kg K₂O / ha</span>
                  <span className="text-[10px] text-stone-300 block mt-1 border-t border-white/10 pt-1">
                    Total: {aporteK_total.toFixed(0)} kg
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-stone-800 rounded-lg border border-stone-700 text-[11px] text-stone-300">
              Total de fertilizante a comprar: <strong>{(dosisFertilizanteKgHa * areaFertHa).toLocaleString()} kg</strong> (aprox. {Math.ceil((dosisFertilizanteKgHa * areaFertHa) / 25)} sacos de 25 kg).
            </div>
          </div>
        </div>
      )}

      {/* 4. LÁMINA DE RIEGO */}
      {activeCalc === 'lamina' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Parámetros del Sistema de Riego Tecnificado
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Caudal por Emisor / Gotero (L/h)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={caudalGoteroLtsH}
                    onChange={(e) => setCaudalGoteroLtsH(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Distancia entre Goteros (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={distGoterosM}
                    onChange={(e) => setDistGoterosM(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Distancia entre Hileras de Riego (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={distHilerasRiegoM}
                  onChange={(e) => setDistHilerasRiegoM(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Tiempo de Riego Programado (Horas)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={horasRiego}
                  onChange={(e) => setHorasRiego(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-900 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
                Lámina Bruta de Agua Aplicada
              </div>
              <h3 className="text-lg font-bold">
                Aporte Hídrico y Volumen por Hectárea
              </h3>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                  <span className="text-xs text-stone-300 block">Lámina de Agua Bruta</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-sky-300 font-mono tabular-nums">
                      {laminaRiegoMm.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold">mm (Litros / m²)</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    Precipitación del equipo: {intensidadPrecipitacionMmH.toFixed(2)} mm/hora
                  </span>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-stone-400 block text-xs">Volumen de Agua por Hectárea</span>
                  <span className="text-2xl font-bold font-mono tabular-nums text-white mt-1 block">
                    {m3PorHa.toFixed(1)} m³ / ha
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
