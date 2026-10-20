import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  ShieldCheck, 
  Calendar, 
  CheckCircle, 
  Building2 
} from 'lucide-react';
import { ExplotacionAgricola, Parcela, RegistroLabor } from '../types/campo';
import { exportLaboresToCSV, exportDataAsJSON } from '../utils/storage';

interface InformeOficialViewProps {
  explotacion: ExplotacionAgricola;
  parcelas: Parcela[];
  labores: RegistroLabor[];
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InformeOficialView: React.FC<InformeOficialViewProps> = ({
  explotacion,
  parcelas,
  labores,
  onImportJSON
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const totalHa = parcelas.reduce((a, b) => a + b.superficieHa, 0);

  const fitosanitarios = labores.filter(l => l.tipoLabor === 'fitosanitario');
  const otrasLabores = labores.filter(l => l.tipoLabor !== 'fitosanitario');

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-bold text-stone-900">
            Cuaderno Oficial de Explotación Agrícola
          </h2>
          <p className="text-xs text-stone-500">
            Formato normalizado para inspecciones fitosanitarias (SAG, GlobalGAP, BPA)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={onImportJSON}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Restaurar copia de respaldo"
          >
            <Upload className="w-3.5 h-3.5" />
            Importar JSON
          </button>

          <button
            onClick={() => exportDataAsJSON(explotacion, parcelas, labores)}
            className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Descargar respaldo completo del cuaderno"
          >
            <Download className="w-3.5 h-3.5" />
            Copia Respaldo JSON
          </button>

          <button
            onClick={() => exportLaboresToCSV(labores)}
            className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
            Exportar CSV
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Imprimir Cuaderno Oficial
          </button>
        </div>
      </div>

      {/* Printable Document Paper */}
      <div className="print-page bg-white border border-stone-300 rounded-xl p-8 sm:p-12 shadow-sm space-y-8 text-stone-900">
        {/* Document Header */}
        <div className="border-b-2 border-stone-900 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
              Registro Agronómico Oficial
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              Cuaderno de Campo y Explotación Agrícola
            </h1>
            <p className="text-xs text-stone-600">
              Conforme a las Buenas Prácticas Agrícolas y Normativa Sanitaria
            </p>
          </div>

          <div className="text-right text-xs font-mono">
            <div className="font-bold text-stone-900">Temporada: {explotacion.temporada}</div>
            <div className="text-stone-500">Fecha Emisión: {new Date().toLocaleDateString('es-CL')}</div>
            <div className="text-stone-500">Reg. Predial: {explotacion.numeroRegistroAgricola}</div>
          </div>
        </div>

        {/* 1. Datos Generales de la Explotación */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-2 border-stone-800">
            1. Identificación del Predio y Titular
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50/50 border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block text-[11px]">Nombre del Fundo:</span>
              <strong className="text-stone-900">{explotacion.nombreFundo}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Titular / Razón Social:</span>
              <span className="text-stone-900">{explotacion.titular}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">RUT / Identificación Fiscal:</span>
              <span className="font-mono text-stone-900">{explotacion.identificacionFiscal}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Comuna / Región:</span>
              <span className="text-stone-900">{explotacion.comunaRegion}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-stone-500 block text-[11px]">Dirección Predial:</span>
              <span className="text-stone-900">{explotacion.direccion}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Asesor Técnico Responsable:</span>
              <span className="font-medium text-stone-900">{explotacion.asesorAgronomo}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Superficie Total Registrada:</span>
              <span className="font-mono font-bold text-stone-900">{totalHa.toFixed(1)} ha</span>
            </div>
          </div>
        </div>

        {/* 2. Catastro de Parcelas */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-2 border-stone-800">
            2. Catastro de Parcelas y Cuarteles
          </h3>
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-[11px] font-semibold">
                <tr>
                  <th className="p-2">Lote / Cuartel</th>
                  <th className="p-2">Superficie</th>
                  <th className="p-2">Especie / Cultivo</th>
                  <th className="p-2">Variedad</th>
                  <th className="p-2">Marco</th>
                  <th className="p-2">Sistema Riego</th>
                  <th className="p-2">Coordenadas GPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {parcelas.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 font-medium">{p.nombre} ({p.codigoLote})</td>
                    <td className="p-2 font-mono tabular-nums">{p.superficieHa} ha</td>
                    <td className="p-2 font-semibold">{p.cultivo}</td>
                    <td className="p-2">{p.variedad}</td>
                    <td className="p-2">{p.marcoPlantacion}</td>
                    <td className="p-2">{p.sistemaRiego}</td>
                    <td className="p-2 font-mono text-[11px]">{p.latitud.toFixed(4)}, {p.longitud.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Registro Oficial de Tratamientos Fitosanitarios */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-2 border-stone-800">
            3. Registro Cronológico de Aplicaciones Fitosanitarias (Requisito Legal)
          </h3>
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-[10px] font-semibold">
                <tr>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Parcela</th>
                  <th className="p-2">Plaga / Motivo</th>
                  <th className="p-2">Producto Comercial</th>
                  <th className="p-2">Materia Activa</th>
                  <th className="p-2">N° Reg. SAG</th>
                  <th className="p-2">Dosis / Ha</th>
                  <th className="p-2">Carencia</th>
                  <th className="p-2">Aplicador / Carnet</th>
                  <th className="p-2">Firma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {fitosanitarios.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-4 text-center text-stone-400 italic">
                      No se han registrado aplicaciones de productos fitosanitarios.
                    </td>
                  </tr>
                ) : (
                  fitosanitarios.map((f) => {
                    const appDate = new Date(f.fecha);
                    const safeDate = new Date(appDate);
                    safeDate.setDate(safeDate.getDate() + (f.plazoSeguridadDias || 0));
                    return (
                      <tr key={f.id}>
                        <td className="p-2 font-mono tabular-nums whitespace-nowrap">{f.fecha}</td>
                        <td className="p-2 font-medium">{f.parcelaNombre}</td>
                        <td className="p-2">{f.plagaObjetivo || 'Tratamiento preventivo'}</td>
                        <td className="p-2 font-semibold">{f.productoComercial}</td>
                        <td className="p-2 text-stone-600">{f.materiaActiva}</td>
                        <td className="p-2 font-mono text-[11px]">{f.numeroRegistroSAG || '-'}</td>
                        <td className="p-2 font-mono">{f.dosisPorHa} {f.unidadDosis}</td>
                        <td className="p-2 font-mono tabular-nums font-semibold text-amber-950">
                          {f.plazoSeguridadDias ? `${f.plazoSeguridadDias} días` : '-'}
                        </td>
                        <td className="p-2 text-[11px]">
                          <div>{f.aplicadorNombre || f.registradoPor}</div>
                          {f.carnetAplicador && (
                            <div className="font-mono text-stone-500">{f.carnetAplicador}</div>
                          )}
                        </td>
                        <td className="p-2 text-[10px] text-stone-400 border-b border-dashed border-stone-300 w-20">
                          Conforme
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Otras Labores Culturales, Riegos y Cosechas */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-2 border-stone-800">
            4. Otras Labores Agrícolas, Riegos, Fertilización y Cosechas
          </h3>
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-[10px] font-semibold">
                <tr>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Parcela</th>
                  <th className="p-2">Labor</th>
                  <th className="p-2">Detalles Técnicos</th>
                  <th className="p-2">Cantidades / Rendimiento</th>
                  <th className="p-2">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {otrasLabores.map((l) => (
                  <tr key={l.id}>
                    <td className="p-2 font-mono tabular-nums">{l.fecha}</td>
                    <td className="p-2 font-medium">{l.parcelaNombre}</td>
                    <td className="p-2 uppercase text-[11px] font-semibold text-emerald-950">{l.tipoLabor}</td>
                    <td className="p-2">
                      <div>{l.descripcionGeneral}</div>
                      {l.abonoProducto && <div className="text-stone-500">{l.abonoProducto} ({l.formulacionNPK})</div>}
                      {l.observaciones && <div className="text-stone-500 italic text-[11px]">{l.observaciones}</div>}
                    </td>
                    <td className="p-2 font-mono">
                      {l.dosisAbonoKgHa && `${l.dosisAbonoKgHa} kg/ha`}
                      {l.kilosRecolectados && `${l.kilosRecolectados} kg cosecha`}
                      {l.duracionRiegoHoras && `${l.duracionRiegoHoras}h riego (${l.volumenM3} m³)`}
                    </td>
                    <td className="p-2 text-stone-600">{l.registradoPor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures footer */}
        <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs">
          <div className="border-t border-stone-400 pt-3">
            <div className="font-bold text-stone-900">{explotacion.asesorAgronomo}</div>
            <div className="text-stone-500 text-[11px]">Asesor Agronómico Responsable</div>
          </div>
          <div className="border-t border-stone-400 pt-3">
            <div className="font-bold text-stone-900">{explotacion.titular}</div>
            <div className="text-stone-500 text-[11px]">Titular de la Explotación</div>
          </div>
        </div>
      </div>
    </div>
  );
};
