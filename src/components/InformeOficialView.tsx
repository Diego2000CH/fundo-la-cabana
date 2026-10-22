import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  ShieldCheck, 
  Building2,
  Droplet,
  Waves,
  Apple,
  Package,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { 
  ExplotacionAgricola, 
  Parcela, 
  RegistroLabor, 
  InsumoInventario, 
  RegistroExtraccionPozo,
  RegistroRiegoSector,
  MuestreoMadurez,
  RegistroCosechaLote,
  OrdenTrabajoFitosanitaria,
  UsuarioPredio
} from '../types/campo';

interface InformeOficialViewProps {
  explotacion: ExplotacionAgricola;
  parcelas: Parcela[];
  labores: RegistroLabor[];
  inventario?: InsumoInventario[];
  registrosPozo?: RegistroExtraccionPozo[];
  riegosSector?: RegistroRiegoSector[];
  muestreosMadurez?: MuestreoMadurez[];
  cosechasLote?: RegistroCosechaLote[];
  ordenesTrabajo?: OrdenTrabajoFitosanitaria[];
  usuarios?: UsuarioPredio[];
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InformeOficialView: React.FC<InformeOficialViewProps> = ({
  explotacion,
  parcelas,
  labores,
  inventario = [],
  registrosPozo = [],
  riegosSector = [],
  muestreosMadurez = [],
  cosechasLote = [],
  ordenesTrabajo = [],
  usuarios = [],
  onImportJSON
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // Descarga directa del archivo JSON con TODOS los datos reales en vivo
  const handleDownloadFullJSON = () => {
    const dataCompleta = {
      version: '3.0',
      fechaExportacion: new Date().toISOString(),
      explotacion,
      parcelas,
      labores,
      inventario,
      registrosPozo,
      riegosSector,
      muestreosMadurez,
      cosechasLote,
      ordenesTrabajo,
      usuarios
    };
    const blob = new Blob([JSON.stringify(dataCompleta, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuaderno_oficial_sag_${(explotacion.nombreFundo || 'la_cabana').toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Exportar labores a Excel / CSV en vivo
  const handleExportCSV = () => {
    const headers = [
      'Fecha',
      'Hora',
      'Cuartel / Sector',
      'Destino Aplicacion',
      'Tipo Labor',
      'Descripcion',
      'Producto Comercial',
      'Materia Activa',
      'N Registro SAG',
      'Plaga u Objetivo',
      'Dosis por Ha',
      'Total Producto Descontado',
      'Volumen Caldo L/Ha',
      'Carencia (Dias)',
      'Reingreso REI (Horas)',
      'Maquinaria',
      'Aplicador',
      'Responsable'
    ];

    const escapeCSV = (val: any) => {
      if (val === undefined || val === null) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const rows = labores.map(l => [
      escapeCSV(l.fecha),
      escapeCSV(l.hora),
      escapeCSV(l.parcelaNombre),
      escapeCSV(l.destinoAplicacion || 'Huerto de Kiwi'),
      escapeCSV(l.tipoLabor),
      escapeCSV(l.descripcionGeneral),
      escapeCSV(l.productoComercial || l.abonoProducto || ''),
      escapeCSV(l.materiaActiva || l.formulacionNPK || ''),
      escapeCSV(l.numeroRegistroSAG || ''),
      escapeCSV(l.plagaObjetivo || ''),
      escapeCSV(l.dosisPorHa ? `${l.dosisPorHa} ${l.unidadDosis}` : (l.dosisAbonoKgHa ? `${l.dosisAbonoKgHa} kg/ha` : '')),
      escapeCSV(l.totalInsumoUtilizado ? `${l.totalInsumoUtilizado} ${l.unidadDosis?.split('/')[0] || ''}` : ''),
      escapeCSV(l.volumenCaldoLHa || ''),
      escapeCSV(l.plazoSeguridadDias ?? ''),
      escapeCSV(l.plazoReingresoHoras ?? ''),
      escapeCSV(l.maquinariaEquipo || ''),
      escapeCSV(l.aplicadorNombre || ''),
      escapeCSV(l.registradoPor || '')
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuaderno_labores_sag_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalHa = parcelas.reduce((a, b) => a + Number(b.superficieHa || 0), 0);
  const fitosanitarios = labores.filter(l => l.tipoLabor === 'fitosanitario');
  const otrasLabores = labores.filter(l => l.tipoLabor !== 'fitosanitario');

  return (
    <div className="space-y-6">
      {/* Barra de Acciones (Se oculta al imprimir) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-stone-200 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            Cuaderno Oficial de Campo SAG / GlobalGAP
          </h2>
          <p className="text-xs text-stone-500">
            Formato oficial para inspecciones fitosanitarias, auditorías de exportación y respaldo de datos
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
            className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Cargar un archivo de respaldo"
          >
            <Upload className="w-3.5 h-3.5" />
            Importar JSON
          </button>

          <button
            onClick={handleDownloadFullJSON}
            className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Descargar toda la información actual en un archivo"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            Descargar Respaldo JSON
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Exportar a planilla Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
            Exportar Excel / CSV
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar en PDF
          </button>
        </div>
      </div>

      {/* DOCUMENTO OFICIAL IMPRIMIBLE */}
      <div className="print-page bg-white border border-stone-300 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 text-stone-900">
        
        {/* Cabecera Oficial */}
        <div className="border-b-2 border-stone-900 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
              Servicio Agrícola y Ganadero (SAG) · Buenas Prácticas Agrícolas
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Cuaderno Oficial de Explotación Agrícola
            </h1>
            <p className="text-xs text-stone-600">
              Registro obligatorio de tratamientos fitosanitarios, nutrición, riego y trazabilidad
            </p>
          </div>

          <div className="text-right text-xs font-mono">
            <div className="font-bold text-stone-900">Temporada: {explotacion.temporada || '2026 - 2027'}</div>
            <div className="text-stone-500">Emisión: {new Date().toLocaleDateString('es-CL')}</div>
            <div className="text-stone-700 font-bold">Reg. SAG: {explotacion.numeroRegistroAgricola || 'En trámite'}</div>
          </div>
        </div>

        {/* 1. Datos Generales de la Explotación */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-4 border-stone-800">
            1. Identificación del Predio y Titular
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Fundo / Predio:</span>
              <strong className="text-stone-900">{explotacion.nombreFundo || 'Fundo La Cabaña'}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Titular / Razón Social:</span>
              <span className="text-stone-900 font-medium">{explotacion.titular || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">RUT:</span>
              <span className="font-mono text-stone-900 font-bold">{explotacion.identificacionFiscal || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Comuna / Región:</span>
              <span className="text-stone-900">{explotacion.comunaRegion || 'Valle Central'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Dirección del Predio:</span>
              <span className="text-stone-900">{explotacion.direccion || 'Sin dirección registrada'}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Asesor Agrónomo:</span>
              <span className="font-medium text-stone-900">{explotacion.asesorAgronomo || 'A cargo'}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Superficie Total:</span>
              <span className="font-mono font-bold text-emerald-900">{totalHa.toFixed(1)} ha</span>
            </div>
          </div>
        </div>

        {/* 2. Catastro de Cuarteles */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-4 border-stone-800">
            2. Catastro de Cuarteles ({parcelas.length} cuarteles registrados)
          </h3>
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-[10px] font-bold uppercase">
                <tr>
                  <th className="p-2">Cuartel</th>
                  <th className="p-2">Superficie</th>
                  <th className="p-2">Variedad</th>
                  <th className="p-2">Conducción</th>
                  <th className="p-2">Sistema Riego</th>
                  <th className="p-2">Coordenadas GPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {parcelas.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 font-bold">{p.nombre} ({p.codigoLote})</td>
                    <td className="p-2 font-mono font-bold">{p.superficieHa} ha</td>
                    <td className="p-2">Kiwi {p.variedad}</td>
                    <td className="p-2">{p.sistemaConduccion || 'Parrón Español'}</td>
                    <td className="p-2">{p.sistemaRiego}</td>
                    <td className="p-2 font-mono text-[10px] text-stone-500">{p.latitud?.toFixed(5)}, {p.longitud?.toFixed(5)}</td>
                  </tr>
                ))}
                {parcelas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-stone-400 italic">No hay cuarteles registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Registro Oficial de Tratamientos Fitosanitarios */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-4 border-stone-800">
            3. Registro Cronológico de Aplicaciones Fitosanitarias (Requisito SAG)
          </h3>
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-[10px] font-bold uppercase">
                <tr>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Sector / Destino</th>
                  <th className="p-2">Producto Comercial</th>
                  <th className="p-2">Materia Activa</th>
                  <th className="p-2">Reg. SAG</th>
                  <th className="p-2">Dosis / Ha</th>
                  <th className="p-2">Total Producto</th>
                  <th className="p-2">Carencia</th>
                  <th className="p-2">REI</th>
                  <th className="p-2">Aplicador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {fitosanitarios.map((f) => (
                  <tr key={f.id}>
                    <td className="p-2 font-mono whitespace-nowrap">{f.fecha}</td>
                    <td className="p-2">
                      <strong className="block text-stone-900">{f.destinoAplicacion || 'Huerto de Kiwi'}</strong>
                      <span className="text-[10px] text-stone-500">{f.parcelaNombre}</span>
                    </td>
                    <td className="p-2 font-bold text-stone-900">{f.productoComercial}</td>
                    <td className="p-2 text-stone-600">{f.materiaActiva || '-'}</td>
                    <td className="p-2 font-mono text-[10px]">{f.numeroRegistroSAG || '-'}</td>
                    <td className="p-2 font-mono">{f.dosisPorHa ? `${f.dosisPorHa} ${f.unidadDosis}` : '-'}</td>
                    <td className="p-2 font-mono font-bold text-emerald-900">
                      {f.totalInsumoUtilizado ? `${f.totalInsumoUtilizado} ${f.unidadDosis?.split('/')[0] || ''}` : '-'}
                    </td>
                    <td className="p-2 font-mono font-bold text-amber-900">{f.plazoSeguridadDias ? `${f.plazoSeguridadDias} días` : '-'}</td>
                    <td className="p-2 font-mono">{f.plazoReingresoHoras ? `${f.plazoReingresoHoras} hrs` : '-'}</td>
                    <td className="p-2 text-[11px]">{f.aplicadorNombre || f.registradoPor}</td>
                  </tr>
                ))}
                {fitosanitarios.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-4 text-center text-stone-400 italic">No hay aplicaciones fitosanitarias registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Registro de Pozo Profundo (DGA) */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-4 border-stone-800">
            4. Registro de Extracciones de Pozo Profundo (DGA)
          </h3>
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-[10px] font-bold uppercase">
                <tr>
                  <th className="p-2">Fecha & Hora</th>
                  <th className="p-2">Flujómetro Inicial / Final</th>
                  <th className="p-2">Volumen Extraído</th>
                  <th className="p-2">Litros Totales</th>
                  <th className="p-2">Horas Bombeo</th>
                  <th className="p-2">Caudal L/s</th>
                  <th className="p-2">Operador Bomba</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {registrosPozo.map((r) => (
                  <tr key={r.id}>
                    <td className="p-2 font-mono whitespace-nowrap">{r.fecha} {r.hora}</td>
                    <td className="p-2 font-mono text-stone-600">Ini: {r.lecturaInicialM3} m³ / Fin: {r.lecturaFinalM3} m³</td>
                    <td className="p-2 font-mono font-bold text-sky-950">{r.metrosCubicosExtraidos.toLocaleString()} m³</td>
                    <td className="p-2 font-mono font-bold text-emerald-900">{r.litrosTotales.toLocaleString()} L</td>
                    <td className="p-2 font-mono">{r.horasBombeo} hrs</td>
                    <td className="p-2 font-mono">{r.caudalPromedioLs} L/s</td>
                    <td className="p-2">{r.operadorBomba}</td>
                  </tr>
                ))}
                {registrosPozo.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-3 text-center text-stone-400 italic">No hay extracciones de pozo registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Registro de Riegos y Fertirriegos */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-4 border-stone-800">
            5. Registro de Riego y Fertirriego por Sectores
          </h3>
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-[10px] font-bold uppercase">
                <tr>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Sector Regado</th>
                  <th className="p-2">Modalidad</th>
                  <th className="p-2">Fuente de Agua</th>
                  <th className="p-2">Horas</th>
                  <th className="p-2">Volumen (m³ / Litros)</th>
                  <th className="p-2">Abono Inyectado</th>
                  <th className="p-2">Regador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {riegosSector.map((rg) => (
                  <tr key={rg.id}>
                    <td className="p-2 font-mono whitespace-nowrap">{rg.fecha}</td>
                    <td className="p-2 font-bold">{rg.sectorDestino}</td>
                    <td className="p-2 font-medium">{rg.tipoRiego}</td>
                    <td className="p-2 text-stone-600">{rg.fuenteAgua}</td>
                    <td className="p-2 font-mono">{rg.duracionHoras} hrs</td>
                    <td className="p-2 font-mono font-bold text-blue-900">{rg.volumenM3} m³ ({rg.litrosTotales.toLocaleString()} L)</td>
                    <td className="p-2 font-medium text-emerald-900">{rg.productoFertilizante ? `${rg.productoFertilizante} (${rg.dosisKgHa} kg/ha)` : 'Solo agua'}</td>
                    <td className="p-2">{rg.operador}</td>
                  </tr>
                ))}
                {riegosSector.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-3 text-center text-stone-400 italic">No hay riegos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Muestreos de Madurez y Cosecha */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-4 border-stone-800">
            6. Control de Madurez (°Brix) y Cosecha de Kiwi Hayward
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-stone-200 overflow-x-auto">
              <div className="p-2 bg-stone-50 font-bold text-[11px] border-b">Muestreos de Azúcar (°Brix SAG)</div>
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-stone-500 uppercase border-b">
                  <tr>
                    <th className="p-1.5">Fecha</th>
                    <th className="p-1.5">Cuartel</th>
                    <th className="p-1.5">°Brix</th>
                    <th className="p-1.5">% MS</th>
                    <th className="p-1.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {muestreosMadurez.map(m => (
                    <tr key={m.id}>
                      <td className="p-1.5 font-mono">{m.fecha}</td>
                      <td className="p-1.5">{m.parcelaNombre}</td>
                      <td className="p-1.5 font-bold text-emerald-900">{m.solidosSolublesBrix}°</td>
                      <td className="p-1.5 font-bold text-teal-900">{m.materiaSecaPorcentaje}%</td>
                      <td className="p-1.5 font-semibold text-[10px]">{m.estadoAutorizacion}</td>
                    </tr>
                  ))}
                  {muestreosMadurez.length === 0 && (
                    <tr><td colSpan={5} className="p-2 text-center text-stone-400 italic">Sin muestreos.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border border-stone-200 overflow-x-auto">
              <div className="p-2 bg-stone-50 font-bold text-[11px] border-b">Bins Cosechados y Despachos</div>
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-stone-500 uppercase border-b">
                  <tr>
                    <th className="p-1.5">Fecha</th>
                    <th className="p-1.5">Cuartel</th>
                    <th className="p-1.5">Bins</th>
                    <th className="p-1.5">Kilos</th>
                    <th className="p-1.5">Packing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {cosechasLote.map(c => (
                    <tr key={c.id}>
                      <td className="p-1.5 font-mono">{c.fecha}</td>
                      <td className="p-1.5">{c.parcelaNombre}</td>
                      <td className="p-1.5 font-bold text-amber-900">{c.cantidadBins} bins</td>
                      <td className="p-1.5 font-bold text-emerald-900">{c.kilosTotales.toLocaleString()} kg</td>
                      <td className="p-1.5">{c.packingDestino}</td>
                    </tr>
                  ))}
                  {cosechasLote.length === 0 && (
                    <tr><td colSpan={5} className="p-2 text-center text-stone-400 italic">Sin cosechas registradas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 7. Existencias en Bodega */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 p-2 border-l-4 border-stone-800">
            7. Estado Actual de Inventario en Bodega de Insumos
          </h3>
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-[10px] font-bold uppercase">
                <tr>
                  <th className="p-2">Producto Comercial</th>
                  <th className="p-2">Categoría</th>
                  <th className="p-2">Materia Activa</th>
                  <th className="p-2">Reg. SAG</th>
                  <th className="p-2">Stock en Bodega</th>
                  <th className="p-2">Ubicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {inventario.map(i => (
                  <tr key={i.id}>
                    <td className="p-2 font-bold">{i.nombreComercial}</td>
                    <td className="p-2">{i.categoria}</td>
                    <td className="p-2 text-stone-600">{i.materiaActiva}</td>
                    <td className="p-2 font-mono text-[10px]">{i.numeroRegistroSAG || '-'}</td>
                    <td className="p-2 font-mono font-bold text-stone-900">{i.stockActual} {i.unidad}</td>
                    <td className="p-2 text-stone-500">{i.ubicacionBodega}</td>
                  </tr>
                ))}
                {inventario.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-stone-400 italic">Bodega vacía.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Firmas Oficiales */}
        <div className="pt-8 grid grid-cols-2 gap-10 text-center text-xs">
          <div className="border-t border-stone-400 pt-3">
            <div className="font-bold text-stone-900">{explotacion.asesorAgronomo || 'Asesor Agrónomo'}</div>
            <div className="text-stone-500 text-[11px]">Ingeniero Agrónomo Responsable SAG</div>
          </div>
          <div className="border-t border-stone-400 pt-3">
            <div className="font-bold text-stone-900">{explotacion.titular || 'Representante Legal'}</div>
            <div className="text-stone-500 text-[11px]">Titular de la Explotación Agrícola</div>
          </div>
        </div>

      </div>
    </div>
  );
};
