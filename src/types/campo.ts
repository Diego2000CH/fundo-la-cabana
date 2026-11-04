// 1. Actualizar InsumoInventario (Bodega) para las fechas
export interface InsumoInventario {
  id: string;
  nombreComercial: string;
  materiaActiva: string;
  numeroRegistroSAG?: string;
  categoria: string;
  stockActual: number;
  unidad: 'L' | 'kg' | 'g' | 'cc';
  fechaElaboracion?: string; // <-- NUEVO
  fechaVencimiento?: string; // <-- NUEVO
}

// 2. Crear un tipo para los productos múltiples en la orden
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

// 3. Actualizar la Orden de Trabajo
export interface OrdenTrabajoFitosanitaria {
  id: string;
  numeroOrden: string;
  fechaEmision: string;
  fechaProgramada: string;
  
  // CAMBIOS AQUÍ: De 1 parcela a múltiples
  parcelaIds: string[]; 
  parcelaNombres: string; // Ej: "Cuartel 1, Cuartel 2"
  superficieTratarHa: number; // Suma de hectáreas
  
  destinoAplicacion: DestinoAplicacion;
  estado: 'emitida' | 'en_ejecucion' | 'completada';
  plagaObjetivo: string;
  
  // CAMBIOS AQUÍ: De 1 producto a un arreglo de productos
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

// Asegúrate de que DestinoAplicacion tenga estas opciones
export type DestinoAplicacion = 
  | 'Huerto de Kiwi' 
  | 'Casa patronal' 
  | 'Quinta frutal' 
  | 'Control de praderas' 
  | 'Vivero' 
  | 'Caminos y cercos' 
  | 'Otro destino';
