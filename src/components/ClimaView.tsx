import React, { useState } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Compass, 
  Sun,
  Flame,
  Snowflake
} from 'lucide-react';
import { ClimaCondiciones } from '../types/campo';

interface ClimaViewProps {
  clima: ClimaCondiciones;
  onUpdateClima: (clima: ClimaCondiciones) => void;
}

export const ClimaView: React.FC<ClimaViewProps> = ({
  clima,
  onUpdateClima
}) => {
  const [temperaturaC, setTemperaturaC] = useState<number>(clima.temperaturaC);
  const [humedadRelativa, setHumedadRelativa] = useState<number>(clima.humedadRelativa);
  const [velocidadVientoKmH, setVelocidadVientoKmH] = useState<number>(clima.velocidadVientoKmH);
  const [vientoDireccion, setVientoDireccion] = useState<string>(clima.vientoDireccion || 'Sur-Suroeste');
  const [precipitacionMm, setPrecipitacionMm] = useState<number>(clima.precipitacionMm || 0);

  // Compute spraying suitability & frost risk
  const evaluateConditions = (temp: number, hum: number, wind: number, rain: number): {
    apto: 'Optimo' | 'Precaucion' | 'No Apto';
    motivo: string;
    alertaHelada: boolean;
  } => {
    const alertaHelada = temp <= 2.0;

    if (rain > 0) {
      return {
        apto: 'No Apto',
        motivo: 'Lluvia registrada: El producto fitosanitario se lavará del follaje del kiwi.',
        alertaHelada
      };
    }
    if (wind > 10.0) {
      return {
        apto: 'No Apto',
        motivo: `Viento excesivo (${wind} km/h): Alto riesgo de deriva fuera del huerto de kiwis según norma técnica.`,
        alertaHelada
      };
    }
    if (temp > 25.0) {
      return {
        apto: 'No Apto',
        motivo: `Temperatura alta (${temp}°C): Evaporación rápida de la gota de pulverización y riesgo de fitotoxicidad.`,
        alertaHelada
      };
    }
    if (wind < 2.0) {
      return {
        apto: 'Precaucion',
        motivo: 'Viento casi nulo (<2 km/h): Posible inversión térmica con suspensión y deriva de gotas finas.',
        alertaHelada
      };
    }
    if (temp < 6.0) {
      return {
        apto: 'Precaucion',
        motivo: 'Temperatura baja (<6°C): Menor absorción sistémica y translocación en las plantas de kiwi.',
        alertaHelada
      };
    }

    return {
      apto: 'Optimo',
      motivo: 'Condiciones ideales: Viento suave (3-8 km/h), humedad adecuada y temperatura favorable.',
      alertaHelada
    };
  };

  const currentEval = evaluateConditions(temperaturaC, humedadRelativa, velocidadVientoKmH, precipitacionMm);

  const handleApplyChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const puntoRocio = Number((temperaturaC - ((100 - humedadRelativa) / 5)).toFixed(1));
    const newClima: ClimaCondiciones = {
      temperaturaC,
      humedadRelativa,
      velocidadVientoKmH,
      vientoDireccion,
      precipitacionMm,
      puntoRocioC: puntoRocio,
      presionHpa: 1016,
      radiacionUv: 5,
      alertaHelada: currentEval.alertaHelada,
      aptoPulverizacion: currentEval.apto,
      motivoNoApto: currentEval.motivo
    };
    onUpdateClima(newClima);
  };

  const handlePresetScenario = (scenario: 'optimo' | 'deriva' | 'helada' | 'calor') => {
    if (scenario === 'optimo') {
      setTemperaturaC(17.5);
      setHumedadRelativa(65);
      setVelocidadVientoKmH(4.5);
      setPrecipitacionMm(0);
      setVientoDireccion('Sur');
    } else if (scenario === 'deriva') {
      setTemperaturaC(21.0);
      setHumedadRelativa(48);
      setVelocidadVientoKmH(14.5);
      setPrecipitacionMm(0);
      setVientoDireccion('Oeste');
    } else if (scenario === 'helada') {
      setTemperaturaC(0.8);
      setHumedadRelativa(88);
      setVelocidadVientoKmH(1.5);
      setPrecipitacionMm(0);
      setVientoDireccion('Calma');
    } else if (scenario === 'calor') {
      setTemperaturaC(28.5);
      setHumedadRelativa(35);
      setVelocidadVientoKmH(6.0);
      setPrecipitacionMm(0);
      setVientoDireccion('Norte');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Estación Meteorológica y Clima de Campo
          </h1>
          <p className="text-xs text-stone-500">
            Evaluación técnica de condiciones de pulverización fitosanitaria y alerta de heladas para Fundo La Cabaña
          </p>
        </div>
      </div>

      {/* Spraying Suitability Banner */}
      <div className={`p-5 rounded-xl border shadow-xs ${
        currentEval.apto === 'Optimo'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : currentEval.apto === 'Precaucion'
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : 'bg-red-50 border-red-200 text-red-950'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {currentEval.apto === 'Optimo' && <CheckCircle2 className="w-5 h-5 text-emerald-700" />}
              {currentEval.apto === 'Precaucion' && <AlertTriangle className="w-5 h-5 text-amber-700" />}
              {currentEval.apto === 'No Apto' && <AlertTriangle className="w-5 h-5 text-red-700" />}
              <span className="text-sm font-bold uppercase tracking-wide">
                Condición para Aplicaciones Fitosanitarias: {currentEval.apto.toUpperCase()}
              </span>
            </div>
            <p className="text-xs max-w-2xl leading-relaxed">
              {currentEval.motivo}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs block font-medium">Estación Local</span>
            <span className="text-[11px] font-mono text-stone-600">Fundo La Cabaña (Sector Kiwis)</span>
          </div>
        </div>
      </div>

      {/* Frost Alert for Kiwi buds */}
      {currentEval.alertaHelada && (
        <div className="p-4 bg-sky-100 border border-sky-300 rounded-xl flex items-center gap-3 text-sky-950 text-xs">
          <Snowflake className="w-6 h-6 text-sky-700 shrink-0 animate-pulse" />
          <div>
            <strong className="block text-sm">¡Alerta Crítica de Helada para Kiwis ({temperaturaC}°C)!</strong>
            <span>
              Los brotes y flores de kiwi son extremadamente sensibles a temperaturas bajo 1.5°C. Se recomienda activar el sistema de control de heladas (microaspersores o torres de viento).
            </span>
          </div>
        </div>
      )}

      {/* Weather Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-stone-400" />
            Temperatura
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {temperaturaC.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">°C</span>
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            Punto de Rocío: {clima.puntoRocioC || 9.5}°C
          </div>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-stone-400" />
            Humedad Relativa
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {humedadRelativa}
            </span>
            <span className="text-xs text-stone-500">%</span>
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            {humedadRelativa >= 70 ? 'Humedad favorable para Botrytis' : 'Humedad óptima'}
          </div>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-stone-400" />
            Velocidad del Viento
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight font-mono tabular-nums ${velocidadVientoKmH > 10 ? 'text-red-700' : 'text-stone-900'}`}>
              {velocidadVientoKmH.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">km/h</span>
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            Dirección: {vientoDireccion}
          </div>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-stone-400" />
            Precipitación
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {precipitacionMm}
            </span>
            <span className="text-xs text-stone-500">mm</span>
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            {precipitacionMm === 0 ? 'Sin lluvia (Seco)' : 'Lluvia activa'}
          </div>
        </div>
      </div>

      {/* Adjust Field Station Controls */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Ajustar Lecturas de la Estación en Terreno
            </h3>
            <p className="text-xs text-stone-500">
              Registra las mediciones de tu anemómetro o termohigrómetro de campo
            </p>
          </div>

          {/* Quick presets for testing conditions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-500 font-medium mr-1">Simular:</span>
            <button
              type="button"
              onClick={() => handlePresetScenario('optimo')}
              className="px-2 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-900 hover:bg-emerald-100 rounded border border-emerald-200"
            >
              Óptimo Pulverización
            </button>
            <button
              type="button"
              onClick={() => handlePresetScenario('deriva')}
              className="px-2 py-1 text-[11px] font-medium bg-amber-50 text-amber-900 hover:bg-amber-100 rounded border border-amber-200"
            >
              Viento / Deriva
            </button>
            <button
              type="button"
              onClick={() => handlePresetScenario('helada')}
              className="px-2 py-1 text-[11px] font-medium bg-sky-50 text-sky-900 hover:bg-sky-100 rounded border border-sky-200"
            >
              Riesgo Helada
            </button>
            <button
              type="button"
              onClick={() => handlePresetScenario('calor')}
              className="px-2 py-1 text-[11px] font-medium bg-rose-50 text-rose-900 hover:bg-rose-100 rounded border border-rose-200"
            >
              Calor Excesivo
            </button>
          </div>
        </div>

        <form onSubmit={handleApplyChanges} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Temperatura (°C)</label>
              <input
                type="number"
                step="0.1"
                value={temperaturaC}
                onChange={(e) => setTemperaturaC(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">Humedad Relativa (%)</label>
              <input
                type="number"
                value={humedadRelativa}
                onChange={(e) => setHumedadRelativa(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">Viento (km/h)</label>
              <input
                type="number"
                step="0.1"
                value={velocidadVientoKmH}
                onChange={(e) => setVelocidadVientoKmH(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">Dirección Viento</label>
              <select
                value={vientoDireccion}
                onChange={(e) => setVientoDireccion(e.target.value)}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-sm"
              >
                <option value="Sur">Sur</option>
                <option value="Sur-Suroeste">Sur-Suroeste</option>
                <option value="Suroeste">Suroeste</option>
                <option value="Oeste">Oeste</option>
                <option value="Norte">Norte</option>
                <option value="Noreste">Noreste</option>
                <option value="Calma">Calma</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Guardar Condiciones en el Cuaderno
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
