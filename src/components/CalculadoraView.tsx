import React, { useState } from 'react';
import { 
  Calculator, 
  Droplet, 
  Sprout, 
  Wheat, 
  Layers, 
  HelpCircle,
  Info,
  Package,
  CheckCircle2
} from 'lucide-react';
import { Parcela, InsumoInventario } from '../types/campo';

interface CalculadoraViewProps {
  parcelas?: Parcela[];
  inventario?: InsumoInventario[];
}

export const CalculadoraView: React.FC<CalculadoraViewProps> = ({ 
  parcelas = [], 
  inventario = [] 
}) => {
  const [activeCalc, setActiveCalc] = useState<'caldo' | 'densidad' | 'npk' | 'lamina'>('caldo');

  // -------------------------------------------------------------
  // 1. ESTADOS Y LÓGICA DE CALDO Y DOSIFICACIÓN
  // -------------------------------------------------------------
  const [selectedParcelaId, setSelectedParcelaId] = useState<string>(parcelas[0]?.id || '');
  const [superficieTratarHa, setSuperficieTratarHa] = useState<number>(parcelas[0]?.superficieHa || 4.8);
  const [tanqueLitros, setTanqueLitros] = useState<number>(2000);
  const [gastoCaldoHa, setGastoCaldoHa] = useState<number>(1200);
  
  const [selectedInsumoId, setSelectedInsumoId] = useState<string>('');
  const [nombreProducto, setNombreProducto] = useState<string>('Cobre Hidróxido 50 WP');
  const [dosisHa, setDosisHa] = useState<number>(2.0);
  const [unidadDosis, setUnidadDosis] = useState<'kg/ha' | 'L/ha' | 'cc/100L' | 'g/100L'>('kg/ha');

  // Manejo de cambio de parcela
  const handleParcelaChange = (id: string) => {
    setSelectedParcelaId(id);
    const p = parcelas.find(item => item.id === id);
    if (p) {
      setSuperficieTratarHa(p.superficieHa);
    }
  };

  // Manejo de cambio de insumo desde Bodega
  const handleInsumoChange = (id: string) => {
    setSelectedInsumoId(id);
    const ins = inventario.find(i => i.id === id);
    if (ins) {
      setNombreProducto(ins.nombreComercial);
      if (ins.unidad === 'kg') setUnidadDosis('kg/ha');
      else if (ins.unidad === 'L') setUnidadDosis('L/ha');
      else if (ins.unidad === 'g') setUnidadDosis('g/100L');
      else if (ins.unidad === 'cc') setUnidadDosis('cc/100L');
    }
  };

  // Cálculos de Caldo
  const ha = Number(superficieTratarHa) || 0;
  const mojamiento = Number(gastoCaldoHa) || 0;
  const dosisVal = Number(dosisHa) || 0;
  const estanqueVal = Number(tanqueLitros) || 2000;

  const aguaTotalLitros = Math.round(ha * mojamiento);
  const tanquesNecesarios = mojamiento > 0 && estanqueVal > 0 ? (aguaTotalLitros / estanqueVal) : 0;
  const haPorTanque = mojamiento > 0 ? estanqueVal / mojamiento : 0;

  let productoTotalLote = 0;
  let unidadProductoTotal = 'kg';

  if (unidadDosis === 'kg/ha' || unidadDosis === 'L/ha') {
    productoTotalLote = ha * dosisVal;
    unidadProductoTotal = unidadDosis === 'kg/ha' ? 'kg' : 'L';
  } else {
    productoTotalLote = (aguaTotalLitros / 100) * dosisVal;
    if (unidadDosis === 'cc/100L') {
      unidadProductoTotal = productoTotalLote >= 1000 ? 'L' : 'cc';
      if (productoTotalLote >= 1000) productoTotalLote /= 1000;
    } else {
      unidadProductoTotal = productoTotalLote >= 1000 ? 'kg' : 'g';
      if (productoTotalLote >= 1000) productoTotalLote /= 1000;
    }
  }

  let productoPorTanque = 0;
  if (unidadDosis === 'kg/ha' || unidadDosis === 'L/ha') {
    productoPorTanque = haPorTanque * dosisVal;
  } else {
    productoPorTanque = (estanqueVal / 100) * dosisVal;
    if (unidadDosis === 'cc/100L' && productoPorTanque >= 1000) productoPorTanque /= 1000;
    if (unidadDosis === 'g/100L' && productoPorTanque >= 1000) productoPorTanque /= 1000;
  }

  // -------------------------------------------------------------
  // 2. ESTADOS Y LÓGICA DE DENSIDAD DE PLANTACIÓN
  // -------------------------------------------------------------
  const [distEntreHileras, setDistEntreHileras] = useState<number>(4.0);
  const [distSobreHilera, setDistSobreHilera] = useState<number>(2.0);
  const [superficieLoteHa, setSuperficieLoteHa] = useState<number>(3.5);

  const areaPorPlanta = distEntreHileras * distSobreHilera;
  const plantasPorHa = areaPorPlanta > 0 ? Math.round(10000 / areaPorPlanta) : 0;
  const totalPlantasLote = Math.round(plantasPorHa * superficieLoteHa);

  // -------------------------------------------------------------
  // 3. ESTADOS Y LÓGICA DE APORTE NUTRICIONAL NPK
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // 4. ESTADOS Y LÓGICA DE LÁMINA DE RIEGO
  // -------------------------------------------------------------
  const [caudalGoteroLtsH, setCaudalGoteroLtsH] = useState<number>(2.0);
  const [distGoterosM, setDistGoterosM] = useState<number>(0.5);
  const [distHilerasRiegoM, setDistHilerasRiegoM] = useState<number>(4.0);
  const [horasRiego, setHorasRiego] = useState<number>(4.0);

  const areaPorGotero = distGoterosM * distHilerasRiegoM;
  const intensidadPrecipitacionMmH = areaPorGotero > 0 ? caudalGoteroLtsH / areaPorGotero : 0;
  const laminaRiegoMm = intensidadPrecipitacionMmH * horasRiego;
  const m3PorHa = laminaRiegoMm * 10;

  return (
    <div className="space-y-6 text-xs">
      {/* Header General */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-700" />
            Calculadora Agronómica de Campo
          </h1>
          <p className="text-xs text-stone-500">
            Herramientas técnicas de calibración de pulverizador, densidad vegetal, nutrición NPK y lámina de riego
          </p>
        </div>
      </div>

      {/* Selector de Pestaña */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveCalc('caldo')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
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
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
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
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
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
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeCalc === 'lamina'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-800" />
          Lámina de Riego (mm)
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. SECCIÓN: CALDO Y DOSIFICACIÓN PULVERIZADOR */}
      {/* ------------------------------------------------------------- */}
      {activeCalc === 'caldo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Formulario de Entrada (Col 6) */}
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b pb-2">
              <Info className="w-4 h-4 text-emerald-700" /> Parámetros de Maquinaria y Lote
            </h3>

            {/* Parcela o Hectáreas */}
            {parcelas.length > 0 && (
              <div>
                <label className="block text-stone-700 font-medium mb-1">Cargar Cuartel / Parcela</label>
                <select 
                  value={selectedParcelaId} 
                  onChange={(e) => handleParcelaChange(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-medium bg-stone-50"
                >
                  {parcelas.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} ({p.superficieHa} ha)</option>
                  ))}
                  <option value="manual">-- Definir Superficie Manual --</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Superficie a Tratar (ha)</label>
                <input
                  type="number"
                  step="0.1"
                  value={superficieTratarHa}
                  onChange={(e) => setSuperficieTratarHa(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1">Capacidad Estanque (L)</label>
                <input
                  type="number"
                  value={tanqueLitros}
                  onChange={(e) => setTanqueLitros(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Volumen Caldo Calibrado (L/ha)
              </label>
              <input
                type="number"
                value={gastoCaldoHa}
                onChange={(e) => setGastoCaldoHa(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Agua requerida por hectárea según calibración del tractor.
              </span>
            </div>

            <hr className="border-stone-100" />

            {/* Insumos de Bodega y Dosis */}
            <div className="space-y-3">
              <label className="block text-stone-700 font-bold">Producto y Dosis</label>

              {inventario.length > 0 && (
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Cargar de Bodega</label>
                  <select
                    value={selectedInsumoId}
                    onChange={(e) => handleInsumoChange(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-emerald-50/50 text-emerald-950 font-medium"
                  >
                    <option value="">-- Seleccionar de Bodega --</option>
                    {inventario.map(i => (
                      <option key={i.id} value={i.id}>[{i.categoria}] {i.nombreComercial}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={nombreProducto}
                  onChange={(e) => setNombreProducto(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Dosis Recomendada</label>
                  <input
                    type="number"
                    step="0.05"
                    value={dosisHa}
                    onChange={(e) => setDosisHa(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Unidad Dosis</label>
                  <select
                    value={unidadDosis}
                    onChange={(e) => setUnidadDosis(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white font-medium"
                  >
                    <option value="kg/ha">kg / ha</option>
                    <option value="L/ha">L / ha</option>
                    <option value="cc/100L">cc / 100 Litros</option>
                    <option value="g/100L">g / 100 Litros</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Resultados y Explicación (Col 6) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Tarjetas Principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-stone-900 text-white rounded-xl shadow-xs space-y-1">
                <span className="text-stone-400 uppercase font-bold text-[10px] flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-blue-400" /> Agua Total Necesaria
                </span>
                <div className="text-2xl font-black font-mono text-blue-300">
                  {aguaTotalLitros.toLocaleString('es-CL')} <span className="text-xs font-normal">Litros</span>
                </div>
                <span className="text-[11px] text-stone-300 block">
                  Para {ha} ha con {mojamiento} L/ha
                </span>
              </div>

              <div className="p-4 bg-emerald-950 text-white rounded-xl shadow-xs space-y-1">
                <span className="text-emerald-300 uppercase font-bold text-[10px] flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-emerald-400" /> Producto Total Requerido
                </span>
                <div className="text-2xl font-black font-mono text-emerald-300">
                  {productoTotalLote.toFixed(2)} <span className="text-xs font-normal">{unidadProductoTotal}</span>
                </div>
                <span className="text-[11px] text-emerald-200 block truncate">
                  Total de {nombreProducto}
                </span>
              </div>
            </div>

            {/* Receta por Estanque Lleno */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-2">
              <h4 className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-4 h-4 text-amber-700" /> Receta por Estanque Lleno ({estanqueVal} L)
              </h4>
              <div className="p-3 bg-white rounded-lg border border-amber-200 flex justify-between items-center">
                <div>
                  <span className="text-stone-500 font-semibold block">Dosis a Disolver:</span>
                  <strong className="text-stone-900 text-sm">{nombreProducto}</strong>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-amber-900">
                    {productoPorTanque.toFixed(2)} {unidadDosis === 'cc/100L' || unidadDosis === 'g/100L' ? (productoPorTanque >= 1000 ? (unidadDosis === 'cc/100L' ? 'L' : 'kg') : (unidadDosis === 'cc/100L' ? 'cc' : 'g')) : (unidadDosis === 'kg/ha' ? 'kg' : 'L')}
                  </span>
                  <span className="block text-[10px] text-stone-400">cubre {haPorTanque.toFixed(2)} ha</span>
                </div>
              </div>
              <div className="text-[10px] text-amber-900">
                Se requieren <strong>{tanquesNecesarios.toFixed(2)} estanques</strong> para cubrir la superficie total ({Math.floor(tanquesNecesarios)} llenos + {((tanquesNecesarios % 1) * 100).toFixed(0)}% remanente).
              </div>
            </div>

            {/* Desglose Explicativo Paso a Paso */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2.5">
              <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5 border-b pb-1.5">
                <HelpCircle className="w-4 h-4 text-stone-500" /> Explicación Matemática del Cálculo
              </h4>

              <div className="space-y-2 text-stone-700 text-[11px]">
                <div className="p-2 bg-stone-50 rounded border">
                  <strong className="text-stone-900 block font-bold">1. Agua Total:</strong>
                  <span>{ha} ha × {mojamiento} L/ha = <strong>{aguaTotalLitros.toLocaleString('es-CL')} Litros</strong>.</span>
                </div>

                <div className="p-2 bg-stone-50 rounded border">
                  <strong className="text-stone-900 block font-bold">2. Producto Total:</strong>
                  {unidadDosis === 'kg/ha' || unidadDosis === 'L/ha' ? (
                    <span>{ha} ha × {dosisVal} {unidadDosis} = <strong>{productoTotalLote.toFixed(2)} {unidadProductoTotal}</strong>.</span>
                  ) : (
                    <span>({aguaTotalLitros} L / 100) × {dosisVal} = <strong>{productoTotalLote.toFixed(2)} {unidadProductoTotal}</strong>.</span>
                  )}
                </div>

                <div className="p-2 bg-stone-50 rounded border">
                  <strong className="text-stone-900 block font-bold">3. Mezcla por Estanque:</strong>
                  <span>Para 1 estanque de {estanqueVal}L echar <strong>{productoPorTanque.toFixed(2)}</strong> del producto.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. SECCIÓN: DENSIDAD DE PLANTACIÓN */}
      {/* ------------------------------------------------------------- */}
      {activeCalc === 'densidad' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b pb-2">
              Marco de Plantación y Superficie
            </h3>

            <div className="space-y-3">
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
                    Para {superficieLoteHa} ha (Cotizar 5% extra para replante: {(totalPlantasLote * 1.05).toFixed(0)} plantas)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. SECCIÓN: APORTE NUTRICIONAL NPK */}
      {/* ------------------------------------------------------------- */}
      {activeCalc === 'npk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b pb-2">
              Fertilizante y Dosis Aplicada
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Tipo de Fertilizante
                </label>
                <select
                  value={fertilizanteTipo}
                  onChange={(e) => setFertilizanteTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white font-medium"
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

      {/* ------------------------------------------------------------- */}
      {/* 4. SECCIÓN: LÁMINA DE RIEGO */}
      {/* ------------------------------------------------------------- */}
      {activeCalc === 'lamina' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b pb-2">
              Parámetros del Sistema de Riego Tecnificado
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Caudal Gotero (L/h)
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
                    Dist. Goteros (m)
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
