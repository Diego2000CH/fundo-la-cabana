export type TipoLabor = 
  | 'fitosanitario' 
  | 'fertilizacion' 
  | 'riego' 
  | 'cosecha' 
  | 'siembra' 
  | 'labor_cultural' 
  | 'monitoreo';

export interface ExplotacionAgricola {
  nombreFundo: string;
  titular: string;
  identificacionFiscal: string; // RUT o CIF/NIF
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
  codigoLote: string;
  superficieHa: number;
  cultivo: string; // "Kiwi"
  variedad: string; // 100% Kiwi Hayward
  anoPlantacion: number;
  marcoPlantacion: string; // e.g., "4.5m x 4.0m"
  sistemaRiego: 'Goteo automatizado' | 'Microaspersión' | 'Aspersión cobertura total' | 'Pivote central' | 'Surco / Gravedad';
  tipoSuelo: string;
  latitud: number;
  longitud: number;
  poligono?: [number, number][]; // Coordenadas relativas de visualización [x, y] en %
  estadoActual: 'En crecimiento' | 'Floración' | 'Cuaje / Maduración' | 'Cosecha activa' | 'Receso invernal' | 'En descanso / Barbecho';
  sistemaConduccion?: 'Parrón Español / Pérgola' | 'Espaldera en T / Doble T';
}

export interface LugarPredio {
  id: string;
  nombre: string;
  tipo: 'entrada_principal' | 'bodega' | 'estacionamiento' | 'pozo' | 'cabezal_riego' | 'oficina' | 'estacion_meteo' | 'packing' | 'otro';
  descripcion?: string;
  latitud: number;
  longitud: number;
}

export interface ClimaCondiciones {
  temperaturaC: number;
  humedadRelativa: number;
  velocidadVientoKmH: number;
  vientoDireccion?: string;
  precipitacionMm?: number;
  puntoRocioC?: number;
  presionHpa?: number;
  radiacionUv?: number;
  alertaHelada?: boolean;
  aptoPulverizacion?: 'Optimo' | 'Precaucion' | 'No Apto';
  motivoNoApto?: string;
}

export interface InsumoInventario {
  id: string;
  nombreComercial: string;
  materiaActiva: string;
  categoria: 'Fungicida' | 'Insecticida / Acaricida' | 'Bactericida' | 'Herbicida' | 'Fertilizante' | 'Regulador de Crecimiento' | 'Coadyuvante';
  stockActual: number;
  unidad: 'kg' | 'L' | 'g' | 'cc';
  stockMinimo: number; // Umbral de alerta
  numeroRegistroSAG?: string;
  ubicacionBodega: string;
  fechaVencimiento: string;
  costoPorUnidadCLP: number;
  consumoHistoricoAcumulado: number;
}

export interface RegistroExtraccionPozo {
  id: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:MM
  lecturaInicialM3: number;
  lecturaFinalM3: number;
  metrosCubicosExtraidos: number;
  litrosTotales: number; // m3 * 1000
  horasBombeo: number;
  caudalPromedioLs: number; // Litros por segundo
  nivelEstaticoMetros?: number;
  nivelDinamicoMetros?: number;
  sectorDestino: string;
  operadorBomba: string;
  observaciones?: string;
}

export interface RegistroLabor {
  id: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:MM
  parcelaId: string;
  parcelaNombre: string;
  tipoLabor: TipoLabor;
  descripcionGeneral: string;

  // Campos específicos Tratamiento Fitosanitario
  productoComercial?: string;
  insumoId?: string; // Vinculación con el inventario
  materiaActiva?: string;
  numeroRegistroSAG?: string;
  plagaObjetivo?: string;
  dosisPorHa?: number;
  unidadDosis?: 'L/ha' | 'kg/ha' | 'cc/100L' | 'g/100L';
  volumenCaldoLHa?: number;
  totalInsumoUtilizado?: number; // Cantidad total descontada de bodega
  plazoSeguridadDias?: number; // Días de carencia
  plazoReingresoHoras?: number;
  maquinariaEquipo?: string;
  aplicadorNombre?: string;
  carnetAplicador?: string;
  condicionesClima?: ClimaCondiciones;
  estadoFenologicoBBCH?: string;

  // Campos específicos Fertilización
  abonoProducto?: string;
  formulacionNPK?: string;
  dosisAbonoKgHa?: number;
  metodoAplicacionAbono?: 'Fertirriego' | 'Foliar' | 'Al voleo / Fondo' | 'Localizado en hilera';

  // Campos específicos Riego
  duracionRiegoHoras?: number;
  volumenM3?: number;
  litrosAgua?: number;
  fuenteAgua?: string;
  registroPozoId?: string;

  // Campos específicos Cosecha
  kilosRecolectados?: number;
  calibreCalidad?: string;
  destinoProducto?: 'Exportación Fresco' | 'Mercado Interno' | 'Agroindustria / Proceso';
  loteTrazabilidad?: string;

  // Campos específicos Siembra / Plantación
  dosisSemillaKgHa?: number;
  semillaLote?: string;
  profundidadSiembraCm?: number;

  // Campos específicos Monitoreo
  nivelInfestacion?: 'Bajo (<5%)' | 'Medio (5-15%)' | 'Crítico (>15%)' | 'No detectado';
  umbralSuperado?: boolean;
  accionSugerida?: string;
  fotoUrl?: string;

  // Metadatos
  costoEstimadoCLP?: number;
  observaciones?: string;
  registradoPor: string;
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

export type RolUsuario = 
  | 'administrador' 
  | 'agronomo_predio' 
  | 'asesor_externo' 
  | 'jefe_campo' 
  | 'aplicador_calificado' 
  | 'operador_riego';

export interface UsuarioPredio {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: RolUsuario;
  rutIdentificacion: string;
  numeroRegistroSAG?: string;
  tituloProfesional?: string;
  estado: 'activo' | 'inactivo';
  fechaAlta: string;
  avatarColor?: string;
  notas?: string;
}

export interface AlertaInsumoStock {
  insumo: InsumoInventario;
  nivel: 'agotado' | 'critico' | 'advertencia';
  porcentajeStock: number;
  diferenciaUnidades: number;
  hectareasEstimadasRestantes: number;
}

// -------------------------------------------------------------
// CONTROL DE COSECHA & MADUREZ (KIWI HAYWARD)
// -------------------------------------------------------------

export interface MuestreoMadurez {
  id: string;
  fecha: string; // YYYY-MM-DD
  parcelaId: string;
  parcelaNombre: string;
  variedad: 'Hayward';
  cuartelSector?: string;
  solidosSolublesBrix: number; // Objetivo: >= 6.2° - 6.5° Brix para autorización
  firmezaLibras: number; // Penetrómetro de pulpa (libras/cm² con punta 7.9mm, óptimo 14-16 lb)
  materiaSecaPorcentaje: number; // Óptimo > 15.5% - 16.5% MS
  colorSemillas: '100% Negras' | '75% Pardo Oscuro' | 'Verdosas / Inmaduras';
  estadoAutorizacion: 'Autorizado Cosecha' | 'En Observación' | 'No Autorizado';
  temperaturaAmbienteMuestreoC?: number;
  evaluadorNombre: string;
  observaciones?: string;
}

export interface RegistroCosechaLote {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  variedad: 'Hayward';
  cuartelHilera?: string;
  cantidadBins: number;
  pesoPromedioBinKg: number; // Estándar 380 - 400 kg por bin de kiwi
  kilosTotales: number;
  cuadrillaCosecheros: string;
  numeroCosecheros: number;
  calidadCalibrePredominante: 'Calibre 27-30 (Jumbo)' | 'Calibre 33-36 (Grande)' | 'Calibre 39-42 (Medio)' | 'Descarte / Agroindustria';
  guiaDespachoNumero?: string;
  packingDestino: string;
  responsableCosecha: string;
  observaciones?: string;
}

// -------------------------------------------------------------
// ÓRDENES DE TRABAJO FITOSANITARIAS (RECETAS AGRONÓMICAS)
// -------------------------------------------------------------

export interface OrdenTrabajoFitosanitaria {
  id: string;
  numeroOrden: string; // e.g. "OT-2026-001"
  fechaEmision: string;
  fechaProgramada: string;
  fechaEjecucion?: string;
  parcelaId: string;
  parcelaNombre: string;
  superficieTratarHa: number;
  estado: 'borrador' | 'emitida' | 'en_ejecucion' | 'completada' | 'cancelada';
  
  // Detalle Fitosanitario
  plagaObjetivo: string;
  insumoId?: string;
  productoComercial: string;
  materiaActiva: string;
  numeroRegistroSAG: string;
  dosisPorHa: number;
  unidadDosis: 'L/ha' | 'kg/ha' | 'cc/100L' | 'g/100L';
  mojamientoLHa: number;
  caldoTotalLitros: number;
  totalProductoRequerido: number;
  unidadProducto: 'kg' | 'L' | 'g' | 'cc';

  // Seguridad y Buenas Prácticas Agrícolas
  plazoReingresoHoras: number;
  plazoCarenciaDias: number;
  eppObligatorio: string[];
  condicionesClimaticasRequeridas: string;

  // Personal y Firmas
  agronomoEmisorId: string;
  agronomoEmisorNombre: string;
  agronomoRegistroSAG?: string;
  agronomoFirmaDigital?: string; // Sello de tiempo o validación
  
  aplicadorAsignadoId?: string;
  aplicadorAsignadoNombre?: string;
  maquinariaTractor?: string;
  aplicadorFirma?: string;

  descontadoInventario: boolean;
  laborRegistradaId?: string;
  observacionesTecnicas?: string;
}

// -------------------------------------------------------------
// HORAS FRÍO & FENOLOGÍA / POLINIZACIÓN DEL KIWI HAYWARD
// -------------------------------------------------------------

export interface CondicionHorasFrio {
  temporada: string;
  horasFrioAcumuladas: number; // Horas bajo 7.2°C (Weinberger)
  horasFrioMetaHayward: number; // 850 HF (Rango 800-1000 HF)
  porcentajeCumplimiento: number;
  fechaInicioMedicion: string; // Ej: 01 de Mayo
  fechaUltimaActualizacion: string;
  temperaturaMinimaRegistradaC: number;
  rompedorDormanciaRecomendado: string;
  fechaSugeridaRompedor: string;
  estadoDormancia: 'En acumulación' | 'Cumplimiento óptimo' | 'Déficit - Rompedor urgente';
  observacionesAgronomicas: string;
}

export interface SeguimientoFenologico {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  variedad: 'Hayward';
  codigoBBCH: string;
  nombreEstado: string; // ej. "BBCH 00: Receso invernal", "BBCH 65: Plena floración"
  porcentajeAvance: number; // 0 - 100%
  observaciones: string;
  evaluador: string;
}

export interface RegistroPolinizacion {
  id: string;
  temporada: string;
  parcelaId: string;
  parcelaNombre: string;
  variedadPrincipal: string; // "Hayward (Hembra)"
  variedadPolinizadora: string; // "Tomuri / Chieftain (Macho)"
  fechaEntradaColmenas: string;
  fechaSalidaColmenas: string;
  tipoPolinizador: 'Abejas melíferas (Apis mellifera)' | 'Abejorros (Bombus terrestris)' | 'Mixta (Abejas + Abejorros)' | 'Polen seco / asistido';
  colmenasTotales: number;
  colmenasPorHectarea: number; // Recomendado 8-10 colm/ha en Hayward
  proveedorApiario: string;
  sincroniaFloracion: 'Óptima (>90%)' | 'Aceptable (70-90%)' | 'Desfasada (<70%)';
  porcentajeFloresAbiertas: number;
  estadoPolinizacion: 'En curso' | 'Finalizada' | 'Programada';
  observaciones?: string;
}
