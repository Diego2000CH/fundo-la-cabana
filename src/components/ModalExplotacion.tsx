import React, { useState } from 'react';
import { X, Building2, Check } from 'lucide-react';
import { ExplotacionAgricola } from '../types/campo';

interface ModalExplotacionProps {
  isOpen: boolean;
  onClose: () => void;
  explotacion: ExplotacionAgricola;
  onSave: (data: ExplotacionAgricola) => void;
}

export const ModalExplotacion: React.FC<ModalExplotacionProps> = ({
  isOpen,
  onClose,
  explotacion,
  onSave
}) => {
  const [formData, setFormData] = useState<ExplotacionAgricola>(explotacion);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-800" />
            <h3 className="text-sm font-bold text-stone-900">
              Datos de la Explotación Agrícola
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Nombre del Fundo / Finca *</label>
              <input
                type="text"
                required
                value={formData.nombreFundo}
                onChange={(e) => setFormData({ ...formData, nombreFundo: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">Titular / Razón Social *</label>
              <input
                type="text"
                required
                value={formData.titular}
                onChange={(e) => setFormData({ ...formData, titular: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">RUT / Identificación Fiscal *</label>
              <input
                type="text"
                required
                value={formData.identificacionFiscal}
                onChange={(e) => setFormData({ ...formData, identificacionFiscal: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">N° Registro Agrícola Oficial</label>
              <input
                type="text"
                value={formData.numeroRegistroAgricola}
                onChange={(e) => setFormData({ ...formData, numeroRegistroAgricola: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Comuna / Región</label>
              <input
                type="text"
                value={formData.comunaRegion}
                onChange={(e) => setFormData({ ...formData, comunaRegion: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">Temporada Agrícola</label>
              <input
                type="text"
                value={formData.temporada}
                onChange={(e) => setFormData({ ...formData, temporada: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Dirección del Predio</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Asesor Agrónomo Responsable</label>
              <input
                type="text"
                value={formData.asesorAgronomo}
                onChange={(e) => setFormData({ ...formData, asesorAgronomo: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">Teléfono / Contacto</label>
              <input
                type="text"
                value={formData.telefonoContacto}
                onChange={(e) => setFormData({ ...formData, telefonoContacto: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
