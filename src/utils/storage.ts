import { 
  ExplotacionAgricola, 
  Parcela, 
  RegistroLabor, 
  InsumoInventario, 
  RegistroExtraccionPozo,
  LugarPredio,
  UsuarioPredio,
  MuestreoMadurez,
  RegistroCosechaLote,
  OrdenTrabajoFitosanitaria,
  CondicionHorasFrio,
  SeguimientoFenologico,
  RegistroPolinizacion
} from '../types/campo';
import { 
  initialExplotacion, 
  initialParcelas, 
  initialLabores, 
  initialInventario, 
  initialRegistrosPozo,
  initialLugaresPredio,
  initialUsuarios,
  initialMuestreosMadurez,
  initialCosechasLote,
  initialOrdenesTrabajo,
  initialCondicionHorasFrio,
  initialFenologia,
  initialPolinizacion
} from '../data/initialData';

const STORAGE_KEYS = {
  EXPLOTACION: 'agrocampo_explotacion_lacabana_v1',
  PARCELAS: 'agrocampo_parcelas_lacabana_v1',
  LABORES: 'agrocampo_labores_lacabana_v1',
  INVENTARIO: 'agrocampo_inventario_lacabana_v1',
  POZO: 'agrocampo_pozo_lacabana_v1',
  LUGARES: 'agrocampo_lugares_lacabana_v1',
  USUARIOS: 'agrocampo_usuarios_lacabana_v1',
  ACTIVE_USER_ID: 'agrocampo_active_user_id_v1',
  MUESTREOS_MADUREZ: 'agrocampo_muestreos_madurez_lacabana_v1',
  COSECHAS_LOTE: 'agrocampo_cosechas_lote_lacabana_v1',
  ORDENES_TRABAJO: 'agrocampo_ordenes_trabajo_lacabana_v1',
  HORAS_FRIO: 'agrocampo_horas_frio_lacabana_v1',
  FENOLOGIA: 'agrocampo_fenologia_lacabana_v1',
  POLINIZACION: 'agrocampo_polinizacion_lacabana_v1'
};

export const getStoredLugares = (): LugarPredio[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LUGARES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando lugares de localStorage', e);
  }
  return initialLugaresPredio;
};

export const saveStoredLugares = (lugares: LugarPredio[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LUGARES, JSON.stringify(lugares));
  } catch (e) {
    console.error('Error guardando lugares', e);
  }
};

export const getStoredExplotacion = (): ExplotacionAgricola => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPLOTACION);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando explotación de localStorage', e);
  }
  return initialExplotacion;
};

export const saveStoredExplotacion = (data: ExplotacionAgricola): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPLOTACION, JSON.stringify(data));
  } catch (e) {
    console.error('Error guardando explotación', e);
  }
};

export const getStoredParcelas = (): Parcela[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARCELAS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando parcelas de localStorage', e);
  }
  return initialParcelas;
};

export const saveStoredParcelas = (parcelas: Parcela[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PARCELAS, JSON.stringify(parcelas));
  } catch (e) {
    console.error('Error guardando parcelas', e);
  }
};

export const getStoredLabores = (): RegistroLabor[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LABORES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando labores de localStorage', e);
  }
  return initialLabores;
};

export const saveStoredLabores = (labores: RegistroLabor[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LABORES, JSON.stringify(labores));
  } catch (e) {
    console.error('Error guardando labores', e);
  }
};

export const getStoredInventario = (): InsumoInventario[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTARIO);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando inventario de localStorage', e);
  }
  return initialInventario;
};

export const saveStoredInventario = (inventario: InsumoInventario[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTARIO, JSON.stringify(inventario));
  } catch (e) {
    console.error('Error guardando inventario', e);
  }
};

export const getStoredRegistrosPozo = (): RegistroExtraccionPozo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POZO);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando registros de pozo de localStorage', e);
  }
  return initialRegistrosPozo;
};

export const saveStoredRegistrosPozo = (registros: RegistroExtraccionPozo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.POZO, JSON.stringify(registros));
  } catch (e) {
    console.error('Error guardando registros de pozo', e);
  }
};

export const getStoredUsuarios = (): UsuarioPredio[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USUARIOS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando usuarios de localStorage', e);
  }
  return initialUsuarios;
};

export const saveStoredUsuarios = (usuarios: UsuarioPredio[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
  } catch (e) {
    console.error('Error guardando usuarios', e);
  }
};

export const getStoredActiveUserId = (): string => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    if (raw) return raw;
  } catch (e) {
    console.error('Error leyendo active user id', e);
  }
  return 'usr-1'; // Default Diego Pereira
};

export const saveStoredActiveUserId = (id: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
  } catch (e) {
    console.error('Error guardando active user id', e);
  }
};

// MUESTREOS DE MADUREZ
export const getStoredMuestreosMadurez = (): MuestreoMadurez[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MUESTREOS_MADUREZ);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando muestreos de madurez', e);
  }
  return initialMuestreosMadurez;
};

export const saveStoredMuestreosMadurez = (items: MuestreoMadurez[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MUESTREOS_MADUREZ, JSON.stringify(items));
  } catch (e) {
    console.error('Error guardando muestreos de madurez', e);
  }
};

// REGISTROS DE COSECHA
export const getStoredCosechasLote = (): RegistroCosechaLote[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COSECHAS_LOTE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando registros de cosecha', e);
  }
  return initialCosechasLote;
};

export const saveStoredCosechasLote = (items: RegistroCosechaLote[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COSECHAS_LOTE, JSON.stringify(items));
  } catch (e) {
    console.error('Error guardando registros de cosecha', e);
  }
};

// ÓRDENES DE TRABAJO FITOSANITARIAS
export const getStoredOrdenesTrabajo = (): OrdenTrabajoFitosanitaria[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDENES_TRABAJO);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando órdenes de trabajo', e);
  }
  return initialOrdenesTrabajo;
};

export const saveStoredOrdenesTrabajo = (items: OrdenTrabajoFitosanitaria[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDENES_TRABAJO, JSON.stringify(items));
  } catch (e) {
    console.error('Error guardando órdenes de trabajo', e);
  }
};

// HORAS FRÍO
export const getStoredCondicionHorasFrio = (): CondicionHorasFrio => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HORAS_FRIO);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando horas frío', e);
  }
  return initialCondicionHorasFrio;
};

export const saveStoredCondicionHorasFrio = (item: CondicionHorasFrio): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.HORAS_FRIO, JSON.stringify(item));
  } catch (e) {
    console.error('Error guardando horas frío', e);
  }
};

// FENOLOGÍA
export const getStoredFenologia = (): SeguimientoFenologico[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FENOLOGIA);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando fenología', e);
  }
  return initialFenologia;
};

export const saveStoredFenologia = (items: SeguimientoFenologico[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FENOLOGIA, JSON.stringify(items));
  } catch (e) {
    console.error('Error guardando fenología', e);
  }
};

// POLINIZACIÓN
export const getStoredPolinizacion = (): RegistroPolinizacion[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POLINIZACION);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando polinización', e);
  }
  return initialPolinizacion;
};

export const saveStoredPolinizacion = (items: RegistroPolinizacion[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.POLINIZACION, JSON.stringify(items));
  } catch (e) {
    console.error('Error guardando polinización', e);
  }
};

export const exportDataAsJSON = (
  explotacion: ExplotacionAgricola, 
  parcelas: Parcela[], 
  labores: RegistroLabor[],
  inventario?: InsumoInventario[],
  registrosPozo?: RegistroExtraccionPozo[],
  usuarios?: UsuarioPredio[],
  lugares?: LugarPredio[]
): void => {
  const data = {
    version: '2.1',
    exportDate: new Date().toISOString(),
    explotacion,
    parcelas,
    labores,
    inventario: inventario || getStoredInventario(),
    registrosPozo: registrosPozo || getStoredRegistrosPozo(),
    usuarios: usuarios || getStoredUsuarios(),
    lugares: lugares || getStoredLugares()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cuaderno_campo_${explotacion.nombreFundo.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportLaboresToCSV = (labores: RegistroLabor[]): void => {
  const headers = [
    'ID',
    'Fecha',
    'Hora',
    'Parcela',
    'Tipo de Labor',
    'Descripcion',
    'Producto / Insumo',
    'Materia Activa',
    'Registro SAG/Oficial',
    'Plaga o Motivo',
    'Dosis',
    'Unidad',
    'Total Insumo Descontado Bodega',
    'Volumen Caldo L/ha',
    'Litros Agua Pozo',
    'Plazo Carencia (dias)',
    'Maquinaria',
    'Aplicador',
    'Temp (°C)',
    'Humedad (%)',
    'Viento (km/h)',
    'Costo Estimado CLP',
    'Observaciones',
    'Registrado Por'
  ];

  const escapeCSV = (val: unknown): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = labores.map(l => [
    escapeCSV(l.id),
    escapeCSV(l.fecha),
    escapeCSV(l.hora),
    escapeCSV(l.parcelaNombre),
    escapeCSV(l.tipoLabor),
    escapeCSV(l.descripcionGeneral),
    escapeCSV(l.productoComercial || l.abonoProducto || ''),
    escapeCSV(l.materiaActiva || l.formulacionNPK || ''),
    escapeCSV(l.numeroRegistroSAG || ''),
    escapeCSV(l.plagaObjetivo || ''),
    escapeCSV(l.dosisPorHa || l.dosisAbonoKgHa || l.dosisSemillaKgHa || ''),
    escapeCSV(l.unidadDosis || ''),
    escapeCSV(l.totalInsumoUtilizado ? `${l.totalInsumoUtilizado} ${l.unidadDosis?.split('/')[0] || ''}` : ''),
    escapeCSV(l.volumenCaldoLHa || l.volumenM3 || ''),
    escapeCSV(l.litrosAgua || (l.volumenM3 ? l.volumenM3 * 1000 : '')),
    escapeCSV(l.plazoSeguridadDias ?? ''),
    escapeCSV(l.maquinariaEquipo || ''),
    escapeCSV(l.aplicadorNombre || ''),
    escapeCSV(l.condicionesClima?.temperaturaC ?? ''),
    escapeCSV(l.condicionesClima?.humedadRelativa ?? ''),
    escapeCSV(l.condicionesClima?.velocidadVientoKmH ?? ''),
    escapeCSV(l.costoEstimadoCLP ?? ''),
    escapeCSV(l.observaciones || ''),
    escapeCSV(l.registradoPor || '')
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cuaderno_campo_la_cabana_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const resetStorageToDefaults = () => {
  localStorage.removeItem(STORAGE_KEYS.EXPLOTACION);
  localStorage.removeItem(STORAGE_KEYS.PARCELAS);
  localStorage.removeItem(STORAGE_KEYS.LABORES);
  localStorage.removeItem(STORAGE_KEYS.INVENTARIO);
  localStorage.removeItem(STORAGE_KEYS.POZO);
  localStorage.removeItem(STORAGE_KEYS.LUGARES);
  localStorage.removeItem(STORAGE_KEYS.USUARIOS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
  localStorage.removeItem(STORAGE_KEYS.MUESTREOS_MADUREZ);
  localStorage.removeItem(STORAGE_KEYS.COSECHAS_LOTE);
  localStorage.removeItem(STORAGE_KEYS.ORDENES_TRABAJO);
  localStorage.removeItem(STORAGE_KEYS.HORAS_FRIO);
  localStorage.removeItem(STORAGE_KEYS.FENOLOGIA);
  localStorage.removeItem(STORAGE_KEYS.POLINIZACION);
  return {
    explotacion: initialExplotacion,
    parcelas: initialParcelas,
    labores: initialLabores,
    inventario: initialInventario,
    registrosPozo: initialRegistrosPozo,
    lugares: initialLugaresPredio,
    usuarios: initialUsuarios,
    muestreosMadurez: initialMuestreosMadurez,
    cosechasLote: initialCosechasLote,
    ordenesTrabajo: initialOrdenesTrabajo,
    condicionHorasFrio: initialCondicionHorasFrio,
    fenologia: initialFenologia,
    polinizacion: initialPolinizacion
  };
};
