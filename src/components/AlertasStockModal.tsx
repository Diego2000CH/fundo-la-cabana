import React, { useState } from 'react';
import { InsumoInventario } from '../types/campo';
import { X, AlertTriangle, Plus, Package, ArrowRight, CheckCircle2 } from 'lucide-react';

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
  if (!isOpen) return null;

  const lowStockItems = inventario.filter((i) => (i.stockMinimo || 0) > 0 && i.stockActual <= (i.stockMinimo || 0));

  const handleQuickAdd = (item: InsumoInventario, amount: number) => {
    onUpdateInsumo({
      ...item,
      stockActual: Number((item.stockActual + amount).toFixed(2))
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 to-stone-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-700/80 border border-rose-500/50 flex items-center justify-center font-bold text-white text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h2 className="font-bold text-base">Alertas de Stock en Bodega</h2>
              <p className="text-xs text-rose-200">
                {inventario.length === 0 ? 'Sin productos registrados en bodega' : `${lowStockItems.length} insumos bajo el umbral mínimo`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1 text-xs">
          {inventario.length === 0 ? (
            <div className="p-8 text-center text-stone-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm text-stone-800">Bodega sin productos</p>
              <p className="text-xs text-stone-500">
                No tienes productos registrados en bodega, por lo que no existen alertas de faltantes.
              </p>
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className="p-8 text-center text-stone-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm text-stone-800">¡Inventario en Niveles Óptimos!</p>
              <p className="text-xs text-stone-500">
                Todos los productos de la bodega superan el umbral mínimo de seguridad.
              </p>
            </div>
          ) : (
            lowStockItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-stone-900">{item.nombreComercial}</div>
                  <div className="text-[11px] text-stone-500">{item.ingredienteActivo} ({item.numeroRegistroSAG})</div>
                  <div className="text-[11px] text-rose-900 font-bold">
                    Stock actual: {item.stockActual} {item.unidad} · <span className="font-normal text-stone-500">Mínimo: {item.stockMinimo} {item.unidad}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleQuickAdd(item, item.stockMinimo || 10)}
                    className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                    title={`Reponer +${item.stockMinimo || 10} ${item.unidad}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    +{item.stockMinimo || 10} {item.unidad}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onNavigateToInventario();
              onClose();
            }}
            className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            Ir a la Bodega Completa →
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
