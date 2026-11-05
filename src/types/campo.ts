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
  | 'Herbicida'
  | 'Fertilizante'
  | 'Bioestimulante'
  | 'Adyuvante / Coadyuvante'
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

// ==========================================
// 1. INVENTARIO / BODEGA
// ==========================================

export interface InsumoInventario {
  id: string;
  nombreComercial: string;
  materiaActiva: string; // O ingrediente activo
  numeroRegistroSAG?: string;
  categoria: CategoriaInsumo;
  stockActual: number;
  unidad: 'L' | 'kg' | 'g' | 'cc';
  
  // Fechas de control
  fechaElaboracion?: string;
  fechaVencimiento?: string;
  
  // Destino específico del producto
  destinoEspecifico?: DestinoUso;
  
  // Campos específicos para Fertilizantes
  composicionQuimica?: string; // Ej: NPK 15-15-15, Calcio soluble 15%, etc.
  formaFertilizante?: EstadoFormaFertilizante; // Líquido o Granulado
  solubilidad?: SolubilidadFertilizante; // Soluble o No soluble
  
  // Observaciones adicionales de bodega
  observaciones?: string;
}

// ==========================================
// 2. ÓRDENES DE TRABAJO (APLICACIONES)
// ==========================================

export interface ProductoOrden {
  insumoId?: string; // Para vincularlo con la bodega y descontar stock
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
  
  // Destino de la orden (Kiwis, Vivero, Quinta Frutal, Casa Patronal, etc.)
  destinoAplicacion: DestinoAplicacion;
  
  // Selección múltiple de cuarteles para Kiwis (Cuartel 1, Cuartel 2, Cuartel 3)
  parcelaIds: string[]; // Ej: ['c1', 'c2'] o ['c1', 'c2', 'c3']
  parcelaNombres: string; // Ej: "Cuartel 1, Cuartel 2"
  superficieTratarHa: number; // Suma de hectáreas tratadas
  
  estado: 'emitida' | 'en_ejecucion' | 'completada';
  plagaObjetivo: string;
  
  // Múltiples productos por Orden de Trabajo
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
// 3. REGISTRO DE RIEGO Y SECTORES
// ==========================================

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
  sectorId: string;
  sectorDestino: string;
  superficieHa: number;
  tipoRiego: TipoRiego;
  fuenteAgua: FuenteAguaRiego;
  duracionHoras: number;
  volumenM3: number;
  litrosTotales: number;
  laminaMm: number;
  
  // Fertirriego específico
  productoFertilizante?: string;
  dosisKgHa?: number;
  totalFertilizanteKg?: number;
  conductividadElectrica?: number;
  phSolucion?: number;
  
  operador: string;
  observaciones?: string;
}

// ==========================================
// 4. PARCELAS Y CUARTELES
// ==========================================

export interface Parcela {
  id: string;
  nombre: string;
  superficieHa: number;
  variedad?: string;
  anoPlantacion?: number;
  descripcion?: string;
}
