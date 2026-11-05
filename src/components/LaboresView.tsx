import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  User, 
  Edit2, 
  Trash2, 
  FileSpreadsheet, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { RegistroLabor, Parcela, InsumoInventario, UsuarioPredio } from '../types/campo';

interface LaboresViewProps {
  labores: RegistroLabor[];
  parcelas: Parcela[];
  inventario: InsumoInventario[];
  usuarios?: UsuarioPredio[];
  onOpenNewLabor: () => void;
  onEditLabor: (labor: RegistroLabor) => void;
  onDeleteLabor: (id: string) => void;
}

export const LaboresView: React.FC<LaboresViewProps> = ({
  labores = [],
  parcelas = [],
  inventario = [],
  usuarios = [],
  onOpenNewLabor,
  onEditLabor,
  onDeleteLabor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParcelaFilter, setSelectedParcelaFilter] = useState<string>('all');
  const [selectedTipoFilter, setSelectedTipoFilter] = useState<string>('all');

  // Filtrado de labores
  const filteredLabores = labores.filter((labor) => {
    const matchesSearch = 
      (labor.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (labor.insumoNombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (labor.operadorNombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (labor.parcelaNombre || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesParcela = 
      selectedParcelaFilter === 'all' || labor.parcelaId === selectedParcelaFilter;

    const matchesTipo = 
      selectedTipoFilter === 'all' || labor.tipoLabor === selectedTipoFilter;

    return matchesSearch && matchesParcela && matchesTipo;
  });

  // Exportar a CSV
  const handleExportCSV = () => {
    if (labores.length === 0) return alert('No hay labores para exportar.');
    
    const headers = ['ID', 'Fecha', 'Cuartel', 'Tipo Labor', 'Descripción', 'Operador', 'Insumo', 'Dosis/Ha', 'Total Utilizado'];
    const rows = labores.map(l => [
      l.id,
      l.fecha,
      `"${l.parcelaNombre || ''}"`,
      `"${l.tipoLabor || ''}"`,
      `"${l.descripcion || ''}"`,
      `"${l.operadorNombre || ''}"`,
      `"${l.insumoNombre || 'N/A'}"`,
      l.dosisPorHa || '',
      l.totalInsumoUtilizado || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cuaderno_Labores_La_Cabana_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-800" />
            Cuaderno Oficial de Labores Agrícolas
          </h1>
          <p className="text-stone-500 text-[11px] mt-0.5">
            Registro cronológico oficial de labores en Fundo La Cabaña (100% Kiwi Hayward). Permite editar y eliminar registros en cualquier momento.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            Exportar CSV
          </button>
          
          <button
            onClick={onOpenNewLabor}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nueva Labor
          </button>
        </div>
      </div>

      {/* FILTROS DE BÚSQUEDA */}
      <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por labor, producto comercial, plaga, materia activa o cuartel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedParcelaFilter}
            onChange={(e) => setSelectedParcelaFilter(e.target.value)}
            className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-800 focus:outline-none"
          >
            <option value="all">Todos los Cuarteles ({parcelas.length})</option>
            {parcelas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.superficieHa} ha)
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedTipoFilter}
            onChange={(e) => setSelectedTipoFilter(e.target.value)}
            className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-800 focus:outline-none"
          >
            <option value="all">Todos los Tipos de Labor</option>
            <option value="Aplicacion Fitosanitaria">Fitosanitario</option>
            <option value="Fertilizacion">Fertilización</option>
            <option value="Poda">Poda / Cultural</option>
            <option value="Cosecha">Cosecha Kiwis</option>
            <option value="Desmalezado">Desmalezado</option>
            <option value="Riego">Riego</option>
            <option value="Otra">Otra</option>
          </select>
        </div>
      </div>

      {/* LISTADO O ESTADO VACÍO */}
      {filteredLabores.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-sm">No se encontraron labores con estos filtros</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            Ajusta los filtros o registra una nueva labor para llevar la trazabilidad del Fundo La Cabaña.
          </p>
          <button
            onClick={onOpenNewLabor}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Registrar Labor
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLabores.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold rounded-md text-[10px]">
                    {item.tipoLabor}
                  </span>
                  <span className="font-bold text-stone-900 text-sm">
                    {item.parcelaNombre}
                  </span>
                  <span className="text-stone-400 font-mono text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.fecha}
                  </span>
                </div>

                <p className="text-stone-700 font-medium text-xs">
                  {item.descripcion}
                </p>

                {item.insumoNombre && (
                  <div className="flex items-center gap-3 text-[11px] text-stone-600 font-mono bg-stone-50 p-2 rounded-lg border border-stone-100 w-fit">
                    <span>Insumo: <strong className="text-emerald-900">{item.insumoNombre}</strong></span>
                    {item.dosisPorHa && <span>Dosis: <strong>{item.dosisPorHa} {item.unidadInsumo || 'kg/ha'}</strong></span>}
                    {item.totalInsumoUtilizado && <span>Total: <strong>{item.totalInsumoUtilizado}</strong></span>}
                  </div>
                )}

                {item.observaciones && (
                  <p className="text-[11px] text-stone-500 italic">
                    Obs: {item.observaciones}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Responsable</span>
                  <span className="font-semibold text-stone-800 text-[11px] flex items-center gap-1">
                    <User className="w-3 h-3 text-stone-400" /> {item.operadorNombre || 'Operador'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditLabor(item)}
                    className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                    title="Editar labor"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteLabor(item.id)}
                    className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="Eliminar labor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
