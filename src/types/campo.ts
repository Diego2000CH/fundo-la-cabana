export type TipoLabor = 
  | 'fitosanitario' 
  | 'fertilizacion' 
  | 'enmienda'
  | 'riego' 
  | 'cosecha' 
  | 'siembra' 
  | 'labor_cultural' 
  | 'monitoreo';

export type DestinoAplicacion = 
  | 'Huerto de Kiwi'
  | 'Casa patronal'
  | 'Quinta frutal'
  | 'Control de praderas'
  | 'Vivero'
  | 'Caminos y cercos'
  | 'Otro destino';

export type CategoriaInsumo = 
  | 'Fungicida'
  | 'Insecticida'
  | 'Acaricida'
  | 'Bactericida'
  | 'Herbicida'
  | 'Fitorregulador'
  | 'Bioestimulante'
  | 'Fertilizante'
  | 'Enmienda Agrícola'
  | 'Coadyuvante'
  | 'Desinfectante'
  | 'Otro';

export type TipoRiego = 
  | 'Solo Riego por Goteo'
  | 'Fertirriego'
  | 'Microaspersión'
  | 'Surco / Gravedad';

export type FuenteAguaRiego = 
  | 'Tranque acumulador'
  | 'Canal de regadío'
  | 'Pozo profundo'
  | 'Red presurizada'
  | 'Otra fuente';

export type EtapaFenologicaSabaini = 
  | 'E1' // Sep - Nov: Inicio brotación a Plena Flor
  | 'E2' // Nov - Ene: Plena Flor a 50 DDPF (División celular y Calcio)
  | 'E3' // Ene - Abr: 50 DDPF a Cosecha (Acumulación MS y metabolitos)
  | 'E4' // Abr - Jun: Cosecha a Caída de hojas (Reservas y Flash radicular)
  | 'E5'; // Jun - Sep: Receso invernal (Horas Frío, BEO y rizósfera PGPR)

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
  codigoLote: string;
  superficieHa: number;
  cultivo: string;
  variedad: string;
  anoPlantacion: number;
  marcoPlantacion: string;
  sistemaRiego: 'Goteo automatizado' | 'Microaspersión' | 'Aspersión cobertura total' | 'Pivote central' | 'Surco / Gravedad';
  tipoSuelo: string;
  latitud: number;
  longitud: number;
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
  categoria: CategoriaInsumo;
  stockActual: number;
  unidad: 'kg' | 'L' | 'g' | 'cc';
  stockMinimo: number;
  numeroRegistroSAG?: string;
  ubicacionBodega: string;
  fechaVencimiento: string;
  costoPorUnidadCLP: number;
  consumoHistoricoAcumulado: number;
}

export interface RegistroExtraccionPozo {
  id: string;
  fecha: string;
  hora: string;
  lecturaInicialM3: number;
  lecturaFinalM3: number;
  metrosCubicosExtraidos: number;
  litrosTotales: number;
  horasBombeo: number;
  caudalPromedioLs: number;
  nivelEstaticoMetros?: number;
  nivelDinamicoMetros?: number;
  operadorBomba: string;
  observaciones?: string;
}

export interface RegistroRiegoSector {
  id: string;
  fecha: string;
  horaInicio: string;
  sectorDestino: string;
  tipoRiego: TipoRiego;
  fuenteAgua: FuenteAguaRiego;
  duracionHoras: number;
  volumenM3: number;
  litrosTotales: number;
  laminaMm?: number;
  productoFertilizante?: string;
  dosisKgHa?: number;
  conductividadElectrica?: number;
  phSolucion?: number;
  operador: string;
  observaciones?: string;
}

export interface RegistroLabor {
  id: string;
  fecha: string;
  hora: string;
  parcelaId: string;
  parcelaNombre: string;
  tipoLabor: TipoLabor;
  descripcionGeneral: string;
  destinoAplicacion?: DestinoAplicacion;

  productoComercial?: string;
  insumoId?: string;
  materiaActiva?: string;
  numeroRegistroSAG?: string;
  plagaObjetivo?: string;
  dosisPorHa?: number;
  unidadDosis?: 'L/ha' | 'kg/ha' | 'cc/100L' | 'g/100L';
  volumenCaldoLHa?: number;
  totalInsumoUtilizado?: number;
  plazoSeguridadDias?: number;
  plazoReingresoHoras?: number;
  maquinariaEquipo?: string;
  aplicadorNombre?: string;
  carnetAplicador?: string;
  condicionesClima?: ClimaCondiciones;
  estadoFenologicoBBCH?: string;
  etapaFenologicaSabaini?: EtapaFenologicaSabaini;

  abonoProducto?: string;
  formulacionNPK?: string;
  dosisAbonoKgHa?: number;
  metodoAplicacionAbono?: 'Fertirriego' | 'Foliar' | 'Al voleo / Fondo' | 'Localizado en hilera';

  // Enmienda Agrícola (BEO / CHM)
  tipoEnmienda?: 'Compost Maduro' | 'Enmienda Húmica/Fúlvica' | 'Yeso Agrícola' | 'Cal / Carbonato' | 'Banda Enmienda Orgánica (BEO)' | 'Cubierta Herbácea (CHM)';
  dosisToneladasHa?: number;

  duracionRiegoHoras?: number;
  volumenM3?: number;
  litrosAgua?: number;
  fuenteAgua?: string;
  registroPozoId?: string;

  kilosRecolectados?: number;
  calibreCalidad?: string;
  destinoProducto?: 'Exportación Fresco' | 'Mercado Interno' | 'Agroindustria / Proceso';
  loteTrazabilidad?: string;

  nivelInfestacion?: 'Bajo (<5%)' | 'Medio (5-15%)' | 'Crítico (>15%)' | 'No detectado';
  umbralSuperado?: boolean;
  accionSugerida?: string;
  fotoUrl?: string;

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
  clave?: string;
  numeroRegistroSAG?: string;
  tituloProfesional?: string;
  estado: 'activo' | 'inactivo';
  fechaAlta: string;
  avatarColor?: string;
  notas?: string;
}

export interface MuestreoMadurez {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  variedad: 'Hayward';
  cuartelSector?: string;
  solidosSolublesBrix: number;
  materiaSecaPorcentaje: number;
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
  pesoPromedioBinKg: number;
  kilosTotales: number;
  cuadrillaCosecheros: string;
  numeroCosecheros: number;
  calidadCalibrePredominante: 'Calibre 27-30 (Jumbo)' | 'Calibre 33-36 (Grande)' | 'Calibre 39-42 (Medio)' | 'Descarte / Agroindustria';
  guiaDespachoNumero?: string;
  packingDestino: string;
  responsableCosecha: string;
  observaciones?: string;
}

export interface OrdenTrabajoFitosanitaria {
  id: string;
  numeroOrden: string;
  fechaEmision: string;
  fechaProgramada: string;
  fechaEjecucion?: string;
  parcelaId: string;
  parcelaNombre: string;
  superficieTratarHa: number;
  destinoAplicacion: DestinoAplicacion;
  estado: 'borrador' | 'emitida' | 'en_ejecucion' | 'completada' | 'cancelada';
  
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

  plazoReingresoHoras: number;
  plazoCarenciaDias: number;
  eppObligatorio: string[];
  condicionesClimaticasRequeridas: string;

  agronomoEmisorId: string;
  agronomoEmisorNombre: string;
  agronomoRegistroSAG?: string;
  agronomoFirmaDigital?: string;
  
  aplicadorAsignadoId?: string;
  aplicadorAsignadoNombre?: string;
  maquinariaTractor?: string;
  aplicadorFirma?: string;

  descontadoInventario: boolean;
  laborRegistradaId?: string;
  observacionesTecnicas?: string;
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
  estadoDormancia: 'En acumulación' | 'Cumplimiento óptimo' | 'Déficit - Rompedor urgente';
  observacionesAgronomicas: string;
}

export interface ConteoYemasBrotacion {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  hileraSector: string;
  cargadoresMuestreados: number;
  yemasTotalesInvierno: number;
  brotesEmergidos: number;
  brotesFertilesFlorales: number;
  porcentajeBrotacion: number;
  porcentajeFertilidad: number;
  evaluador: string;
  observaciones?: string;
}

// Registro Fenológico detallado según las 5 Etapas del Curso Kiwi
export interface SeguimientoFenologicoSabaini {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  etapa: EtapaFenologicaSabaini;
  nombreEtapa: string;
  diametroBrotesBaseMm?: number; // > o < 15 mm
  largoBrotePromedioCm?: number;
  yemasPorMetro?: number;
  calibreFrutoPolarSemanalCm?: number; // E2: potencial 1 cm/sem
  crecimientoFrutoGDia?: number; // E2: 1.6 g/día primeros 35 ddpf
  materiaSecaFruto?: number; // E3: % MS
  estadoRaicesFlash?: 'Sin actividad' | 'Flash de otoño activo' | 'Flash de primavera activo' | 'En crecimiento';
  enmiendaAplicada?: string; // E4/E5: BEO o CHM
  observaciones: string;
  evaluador: string;
}

export interface SeguimientoFenologico {
  id: string;
  fecha: string;
  parcelaId: string;
  parcelaNombre: string;
  variedad: 'Hayward';
  codigoBBCH: string;
  nombreEstado: string;
  porcentajeAvance: number;
  observaciones: string;
  evaluador: string;
}

export interface RegistroPolinizacion {
  id: string;
  temporada: string;
  parcelaId: string;
  parcelaNombre: string;
  variedadPrincipal: string;
  variedadPolinizadora: string;
  fechaEntradaColmenas: string;
  fechaSalidaColmenas: string;
  tipoPolinizador: 'Abejas melíferas (Apis mellifera)' | 'Abejorros (Bombus terrestris)' | 'Mixta (Abejas + Abejorros)' | 'Polen seco / asistido';
  colmenasTotales: number;
  colmenasPorHectarea: number;
  proveedorApiario: string;
  sincroniaFloracion: 'Óptima (>90%)' | 'Aceptable (70-90%)' | 'Desfasada (<70%)';
  porcentajeFloresAbiertas: number;
  estadoPolinizacion: 'En curso' | 'Finalizada' | 'Programada';
  observaciones?: string;
}
