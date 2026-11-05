// ==========================================
// TIPOS GENERALES Y CATEGORÍAS DE BODEGA
// ==========================================

export type CategoriaInsumo = 
  | 'Fungicida'
  | 'Bactericida'
  | 'Fungicida y Bactericida'
  | 'Elicitor PSA'
  | 'Insecticida'
  | 'Acariicida'
  | 'Acaricida'
  | 'Herbicida'
  | 'Fitorregulador'
  | 'Fertilizante'
  | 'Bioestimulante'
  | 'Coadyuvante'
  | 'Adyuvante / Coadyuvante'
  | 'Desinfectante'
  | 'Insumo de Riego'
  | 'Otro';

export type DestinoUso = 
  | 'Kiwis' 
  | 'Vivero' 
  | 'Quinta frutal' 
  | 'Casa patronal' 
  | 'Uso General';

export type DestinoAplicacion = 
  | 'Huerto de Kiwi' 
  | 'Casa patronal' 
  | 'Quinta frutal' 
  | 'Control de praderas' 
  | 'Vivero' 
  | 'Caminos y cercos' 
  | 'Otro destino';

export type EstadoFormaFertilizante = 'Líquido' | 'Granulado';
export type SolubilidadFertilizante = 'Soluble' | 'No soluble';
export type RolUsuario = 'administrador' | 'agronomo' | 'operador' | 'consultor';
export type EstadoUsuario = 'activo' | 'inactivo';

// ==========================================
// ESTRUCTURAS PRINCIPALES DEL FUNDO
// ==========================================

export interface ExplotacionAgricola {
  nombreFundo: string;
  titular: string;
  identificacionFiscal: string;
  comunaRegion: string;
  direccion: string;
  asesorAgronomo: string;
  numeroRegistroAgricola: string;
  telefonoContacto: string;
  temporada: string;
}

export interface Parcela {
  id: string;
  nombre: string;
  superficieHa: number;
  variedad?: string;
  anoPlantacion?: number;
  descripcion?: string;
}

export interface LugarPredio {
  id: string;
  nombre: string;
  tipo: string;
  descripcion?: string;
}

export interface UsuarioPredio {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: RolUsuario;
  rutIdentificacion?: string;
  tituloProfesional?: string;
  numeroRegistroSAG?: string;
  estado: EstadoUsuario;
  fechaAlta: string;
  avatarColor?: string;
  notas?: string;
  clave?: string;
}

// ==========================================
// 1. INVENTARIO / BODEGA
// ==========================================

export interface InsumoInventario {
  id: string;
  nombreComercial: string;
  materiaActiva: string;
  numeroRegistroSAG?: string;
  categoria: CategoriaInsumo;
  stockActual: number;
  unidad: 'L' | 'kg' | 'g' | 'cc';
  stockMinimo?: number;
  ubicacionBodega?: string;
  costoPorUnidadCLP?: number;
  consumoHistoricoAcumulado?: number;
  
  // Fechas y Control
  fechaElaboracion?: string;
  fechaVencimiento?: string;
  destinoEspecifico?: DestinoUso;
  
  // Fertilizante Detalle
  composicionQuimica?: string;
  formaFertilizante?: EstadoFormaFertilizante;
  solubilidad?: SolubilidadFertilizante;
  observaciones?: string;
}

// ==========================================
// 2. ÓRDENES DE TRABAJO (APLICACIONES)
// ==========================================

export interface ProductoOrden {
  insumoId?: string;
  productoComercial: string;
  materiaActiva: string;
  numeroRegistroSAG: string;
  dosisPorHa: number;
  unidadDosis: 'L/ha' | 'kg/ha' | 'cc/100L' | 'g/100L';
  totalProductoRequerido: number;
  unidadProducto: string;
}

export interface OrdenTrabajoFitosanitaria {
  id: string;
  numeroOrden: string;
  fechaEmision: string;
  fechaProgramada: string;
  destinoAplicacion: DestinoAplicacion;
  parcelaIds: string[];
  parcelaNombres: string;
  superficieTratarHa: number;
  estado: 'emitida' | 'en_ejecucion' | 'completada';
  plagaObjetivo: string;
  productos: ProductoOrden[];
  mojamientoLHa: number;
  caldoTotalLitros: number;
  plazoReingresoHoras: number;
  plazoCarenciaDias: number;
  eppObligatorio: string[];
  condicionesClimaticasRequeridas: string;
  agronomoEmisorId: string;
  agronomoEmisorNombre: string;
  agronomoRegistroSAG: string;
  agronomoFirmaDigital: string;
  aplicadorAsignadoId?: string;
  aplicadorAsignadoNombre?: string;
  maquinariaTractor: string;
  descontadoInventario: boolean;
  observacionesTecnicas?: string;
  aplicadorFirma?: string;
}

// ==========================================
// 3. LABORES, POZO, CLIMA Y OTROS REGISTROS
// ==========================================

export type TipoLabor = 'Aplicacion Fitosanitaria' | 'Fertilizacion' | 'Poda' | 'Cosecha' | 'Desmalezado' | 'Riego' | 'Otra';

export interface RegistroLabor {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  tipoLabor: TipoLabor;
  descripcion: string;
  operadorNombre: string;
  insumoId?: string;
  insumoNombre?: string;
  dosisPorHa?: number;
  totalInsumoUtilizado?: number;
  unidadInsumo?: string;
  observaciones?: string;
}

export interface RegistroExtraccionPozo {
  id: string;
  fecha: string;
  caudalLps: number;
  horasOperacion: number;
  volumenExtraidoM3: number;
  nivelFreaticoM?: number;
  operador: string;
}

export interface ClimaCondiciones {
  temperaturaC: number;
  humedadRelativa: number;
  velocidadVientoKmH: number;
  vientoDireccion: string;
  precipitacionMm: number;
  puntoRocioC: number;
  presionHpa: number;
  radiacionUv: number;
  alertaHelada: boolean;
  aptoPulverizacion: string;
  motivoNoApto: string;
}

export interface MuestreoMadurez {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  solidosSolublesBrix: number;
  firmezaPresionKg: number;
  colorSemilla: string;
  estadoAptoCosecha: boolean;
  observaciones?: string;
}

export interface RegistroCosechaLote {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  kilosTotales: number;
  binsTotales: number;
  calibrePromedio: string;
  destinoExportacion: string;
  responsableCosecha: string;
}

export interface CondicionHorasFrio {
  temporada: string;
  horasFrioAcumuladas: number;
  horasFrioMetaHayward: number;
  porcentajeCumplimiento: number;
  fechaInicioMedicion: string;
  fechaUltimaActualizacion: string;
  temperaturaMinimaRegistradaC: number;
  rompedorDormanciaRecomendado: string;
  fechaSugeridaRompedor: string;
  estadoDormancia: string;
  observacionesAgronomicas: string;
}

export interface SeguimientoFenologico {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  estadoFenologico: string;
  porcentajeAvance: number;
  observaciones?: string;
}

export interface RegistroPolinizacion {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  numeroColmenasHa: number;
  actividadAbejas: string;
  observaciones?: string;
}

export type TipoRiego = 'Solo Riego por Goteo' | 'Fertirriego';
export type FuenteAguaRiego = 'Tranque acumulador' | 'Canal de regadío' | 'Red presurizada' | 'Pozo profundo' | 'Otra fuente';

export interface SectorRiegoConfig {
  id: string;
  nombre: string;
  superficieHa: number;
  descripcion?: string;
}

export interface RegistroRiegoSector {
  id: string;
  fecha: string;
  horaInicio: string;
  sectorId?: string;
  sectorDestino: string;
  superficieHa: number;
  tipoRiego: TipoRiego;
  fuenteAgua: FuenteAguaRiego;
  duracionHoras: number;
  volumenM3: number;
  litrosTotales: number;
  laminaMm?: number;
  productoFertilizante?: string;
  dosisKgHa?: number;
  totalFertilizanteKg?: number;
  conductividadElectrica?: number;
  phSolucion?: number;
  operador: string;
  observaciones?: string;
}

export interface PlagaFicha {
  nombreComun: string;
  nombreCientifico: string;
  cultivosAfectados: string[];
  sintomas: string;
  umbralEconomico: string;
  metodoControl: string;
  periodoAlerta: string;
}
