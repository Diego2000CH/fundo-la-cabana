export type RolUsuario = 'administrador' | 'operador' | 'agronomo' | 'consultor';

export type DestinoAplicacion = 
  | 'Huerto de Kiwi' 
  | 'Casa patronal' 
  | 'Quinta frutal' 
  | 'Control de praderas' 
  | 'Vivero' 
  | 'Caminos y cercos' 
  | 'Otro destino';

export type TipoLabor = 
  | 'Aplicacion Fitosanitaria' 
  | 'Fertilizacion' 
  | 'Poda' 
  | 'Cosecha' 
  | 'Desmalezado' 
  | 'Riego' 
  | 'Otra';

export type CategoriaInsumo = 
  | 'Fungicida y Bactericida' 
  | 'Insecticida' 
  | 'Fertilizante' 
  | 'Herbicida' 
  | 'Fitorregulador' 
  | 'Otro';

export interface UsuarioPredio {
  id: string;
  nombre: string;
  email: string;
  clave: string;
  rol: RolUsuario;
  rutIdentificacion?: string;
  tituloProfesional?: string;
  numeroRegistroSAG?: string;
  estado: 'activo' | 'inactivo';
  fechaAlta?: string;
  telefono?: string;
  avatarColor?: string;
}

export interface Parcela {
  id: string;
  nombre: string;
  superficieHa: number;
  variedad: string;
  anoPlantacion: number;
  descripcion?: string;
}

export interface InsumoInventario {
  id: string;
  nombreComercial: string;
  materiaActiva: string;
  categoria: CategoriaInsumo;
  stockActual: number;
  unidad: 'kg' | 'L' | 'g' | 'cc';
  numeroRegistroSAG?: string;
  ubicacionBodega?: string;
  fechaElaboracion?: string;
  fechaVencimiento?: string;
  destinoEspecifico?: string;
  composicionQuimica?: string;
  formaFertilizante?: string;
  solubilidad?: string;
  observaciones?: string;
}

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

export interface ProductoOrden {
  insumoId?: string;
  productoComercial: string;
  materiaActiva: string;
  numeroRegistroSAG?: string;
  dosisPorHa: number;
  unidadDosis: string;
  totalProductoRequerido: number;
  unidadProducto: string;
}

export interface OrdenTrabajoFitosanitaria {
  id: string;
  numeroOrden: string;
  fechaEmision: string;
  fechaProgramada: string;
  parcelaIds: string[];
  parcelaNombres: string;
  superficieTratarHa: number;
  destinoAplicacion: DestinoAplicacion;
  estado: 'emitida' | 'en_ejecucion' | 'completada' | 'cancelada';
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
  aplicadorFirma?: string;
  maquinariaTractor?: string;
  descontadoInventario: boolean;
  observacionesTecnicas?: string;
}

export interface RegistroRiegoSector {
  id: string;
  fecha: string;
  horaInicio?: string;
  sectorDestino: string;
  superficieHa: number;
  tipoRiego: string;
  fuenteAgua?: string;
  duracionHoras: number;
  volumenM3: number;
  litrosTotales?: number;
  laminaMm?: number;
  productoFertilizante?: string;
  dosisKgHa?: number;
  totalFertilizanteKg?: number;
  operador: string;
  observaciones?: string;
}

export interface RegistroExtraccionPozo {
  id: string;
  fecha: string;
  caudalLps: number;
  horasOperacion: number;
  volumenExtraidoM3: number;
  nivelFreaticoM: number;
  operador: string;
}

export interface MuestreoMadurez {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  solidosSolublesBrix: number;
  firmezaPresionKg: number;
  colorSemilla?: string;
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
