import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Package, 
  TrendingDown, 
  Plus, 
  Check, 
  ArrowRight,
  ShieldAlert,
  Droplets
} from 'lucide-react';
import { InsumoInventario } from '../types/campo';

interface AlertasStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventario: InsumoInventario[];
  onUpdateInsumo: (insumo: InsumoInventario) => void;
  onNavigateToInventario: () => void;
}

export const AlertasStockModal: React.FC<AlertasStockModalProps> = ({
  isOpen,
  onClose,
  inventario,
  onUpdateInsumo,
  onNavigateToInventario
}) => {
  const [restockItemId, setRestockItemId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<number | ''>('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  if (!isOpen) return null;

  // Categorize alerts
  const alertItems = inventario.map((item) => {
    let alertLevel: 'agotado' | 'critico' | 'advertencia' | 'optimo' = 'optimo';
    if (item.stockActual <= 0) {
      alertLevel = 'agotado';
    } else if (item.stockActual <= item.stockMinimo) {
      alertLevel = 'critico';
    } else if (item.stockActual <= item.stockMinimo * 1.3) {
      alertLevel = 'advertencia';
    }
    return {
      item,
      alertLevel,
      pct: item.stockMinimo > 0 ? (item.stockActual / item.stockMinimo) * 100 : 100
    };
  }).filter(a => a.alertLevel !== 'optimo');

  const filteredAlerts = alertItems.filter(a => {
    if (filterCategory === 'todos') return true;
    if (filterCategory === 'fitosanitario') {
      return ['Fungicida', 'Insecticida / Acaricida', 'Bactericida', 'Herbicida', 'Coadyuvante'].includes(a.item.categoria);
    }
    if (filterCategory === 'fertilizante') {
      return a.item.categoria === 'Fertilizante';
    }
    return true;
  });

  const handleApplyRestock = (item: InsumoInventario) => {
    if (!restockAmount || Number(restockAmount) <= 0) return;
    const added = Number(restockAmount);
    const updated: InsumoInventario = {
      ...item,
      stockActual: Number((item.stockActual + added).toFixed(2))
    };
    onUpdateInsumo(updated);
    setRestockItemId(null);
    setRestockAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-stone-200 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                Centro de Alertas de Stock de Insumos
                <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 rounded-full">
                  {alertItems.length} {alertItems.length === 1 ? 'alerta' : 'alertas'}
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Insumos fitosanitarios y fertilizantes que han alcanzado el umbral mínimo de seguridad en Fundo La Cabaña.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4 text-xs">
          <button
            onClick={() => setFilterCategory('todos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'todos' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todas las Alertas ({alertItems.length})
          </button>
          <button
            onClick={() => setFilterCategory('fitosanitario')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'fitosanitario' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Fitosanitarios
          </button>
          <button
            onClick={() => setFilterCategory('fertilizante')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'fertilizante' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Fertilizantes
          </button>
        </div>

        {/* List of Alert Items */}
        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 space-y-2">
              <Package className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-stone-800 text-sm">¡Bodega en Niveles Óptimos!</h4>
              <p className="text-xs text-stone-500">
                No hay productos por debajo del umbral mínimo en esta categoría.
              </p>
            </div>
          ) : (
            filteredAlerts.map(({ item, alertLevel, pct }) => {
              const isRestocking = restockItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alertLevel === 'agotado'
                      ? 'bg-red-50/70 border-red-300'
                      : alertLevel === 'critico'
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-yellow-50/60 border-yellow-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          alertLevel === 'agotado'
                            ? 'bg-red-200 text-red-900 border border-red-300'
                            : alertLevel === 'critico'
                            ? 'bg-amber-200 text-amber-950 border border-amber-300'
                            : 'bg-yellow-200 text-yellow-950 border border-yellow-300'
                        }`}>
                          {alertLevel === 'agotado' ? 'Agotado (0)' : alertLevel === 'critico' ? 'Stock Crítico' : 'Próximo a Agotarse'}
                        </span>
                        <span className="text-stone-500 text-xs">·</span>
                        <span className="text-[11px] font-semibold text-stone-600">{item.categoria}</span>
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm mt-1">
                        {item.nombreComercial}
                      </h4>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {item.materiaActiva} {item.numeroRegistroSAG ? `(${item.numeroRegistroSAG})` : ''} · {item.ubicacionBodega}
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <div className="text-sm font-bold font-mono text-red-700">
                        {item.stockActual.toFixed(1)} {item.unidad}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Mínimo: {item.stockMinimo} {item.unidad}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar of current stock against minimum threshold */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono mb-1">
                      <span>Nivel respecto al umbral: {Math.min(100, Math.round(pct))}%</span>
                      <span>Consumo acum: {item.consumoHistoricoAcumulado} {item.unidad}</span>
                    </div>
                    <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          alertLevel === 'agotado' ? 'bg-red-600' : alertLevel === 'critico' ? 'bg-amber-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                      />
                    </div>
                  </div>

                  {/* Inline Quick Restock Bar */}
                  {isRestocking ? (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-amber-300 flex flex-col sm:flex-row items-center gap-2 text-xs">
                      <div className="w-full sm:flex-1">
                        <label className="block text-[10px] font-semibold text-stone-700 mb-0.5">
                          Cantidad a ingresar ({item.unidad}) *
                        </label>
                        <input
                          type="number"
                          step="any"
                          min="0.1"
                          autoFocus
                          value={restockAmount}
                          onChange={(e) => setRestockAmount(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder={`Ej: ${item.stockMinimo * 2}`}
                          className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-700"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 w-full sm:w-auto sm:self-end pt-1 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleApplyRestock(item)}
                          disabled={!restockAmount || Number(restockAmount) <= 0}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded font-semibold text-xs flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Ingresar
                        </button>
                        <button
                          type="button"
                          onClick={() => setRestockItemId(null)}
                          className="px-2.5 py-1.5 border border-stone-300 rounded text-stone-600 hover:bg-stone-100 text-xs"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-500">
                        Déficit: <strong className="font-mono text-stone-800">{Math.max(0, item.stockMinimo - item.stockActual).toFixed(1)} {item.unidad}</strong> para stock seguro
                      </span>
                      <button
                        onClick={() => {
                          setRestockItemId(item.id);
                          setRestockAmount(Math.max(0, item.stockMinimo - item.stockActual) * 2 || item.stockMinimo || 10);
                        }}
                        className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Reponer Stock Ahora
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-stone-500 text-center sm:text-left">
            💡 Cada aplicación registrada en el Cuaderno descuenta automáticamente el stock en bodega.
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onNavigateToInventario();
              }}
              className="w-full sm:w-auto px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-50 flex items-center justify-center gap-1.5"
            >
              Ir a Bodega Completa
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
