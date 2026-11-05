import { 
  ExplotacionAgricola, 
  Parcela, 
  RegistroLabor, 
  PlagaFicha, 
  InsumoInventario, 
  RegistroExtraccionPozo,
  ClimaCondiciones,
  LugarPredio,
  UsuarioPredio,
  MuestreoMadurez,
  RegistroCosechaLote,
  OrdenTrabajoFitosanitaria,
  CondicionHorasFrio,
  SeguimientoFenologico,
  RegistroPolinizacion
} from '../types/campo';

// DATOS GENERALES DEL FUNDO
export const initialExplotacion: ExplotacionAgricola = {
  nombreFundo: 'Fundo La Cabaña',
  titular: '',
  identificacionFiscal: '',
  comunaRegion: '',
  direccion: '',
  asesorAgronomo: '',
  numeroRegistroAgricola: '',
  telefonoContacto: '',
  temporada: '2026 - 2027'
};

// CUARTELES DE EJEMPLO (Kiwis)
export const initialParcelas: Parcela[] = [
  { id: 'c1', nombre: 'Cuartel 1 (Kiwis)', superficieHa: 4.5, variedad: 'Hayward', anoPlantacion: 2015, descripcion: 'Sector Norte' },
  { id: 'c2', nombre: 'Cuartel 2 (Kiwis)', superficieHa: 3.8, variedad: 'Hayward', anoPlantacion: 2016, descripcion: 'Sector Centro' },
  { id: 'c3', nombre: 'Cuartel 3 (Kiwis)', superficieHa: 4.8, variedad: 'Hayward', anoPlantacion: 2018, descripcion: 'Sector Sur' }
];

// PUNTOS Y ENTRADAS EN BLANCO
export const initialLugaresPredio: LugarPredio[] = [];

// BODEGA DE INSUMOS CON EJEMPLOS DE LOS NUEVOS TIPOS Y DETALLES
export const initialInventario: InsumoInventario[] = [
  {
    id: 'ins-1',
    nombreComercial: 'Cobre Hidróxido 50 WP',
    materiaActiva: 'Hidróxido de Cobre',
    numeroRegistroSAG: 'SAG-1234',
    categoria: 'Fungicida y Bactericida',
    stockActual: 100,
    unidad: 'kg',
    fechaElaboracion: '2025-08-10',
    fechaVencimiento: '2027-08-10',
    destinoEspecifico: 'Kiwis',
    observaciones: 'Prevención de Psa y Botrytis en brotación'
  },
  {
    id: 'ins-2',
    nombreComercial: 'Acibenzolar-S-Metil Pro',
    materiaActiva: 'Acibenzolar-S-Metil',
    numeroRegistroSAG: 'SAG-5678',
    categoria: 'Elicitor PSA',
    stockActual: 50,
    unidad: 'L',
    fechaElaboracion: '2025-10-01',
    fechaVencimiento: '2027-10-01',
    destinoEspecifico: 'Kiwis',
    observaciones: 'Activador de defensas para Psa'
  },
  {
    id: 'ins-3',
    nombreComercial: 'Nitrato de Calcio Soluble',
    materiaActiva: 'Nitrato de Calcio',
    numeroRegistroSAG: 'SAG-9012',
    categoria: 'Fertilizante',
    stockActual: 500,
    unidad: 'kg',
    fechaElaboracion: '2025-05-15',
    fechaVencimiento: '2028-05-15',
    destinoEspecifico: 'Kiwis',
    composicionQuimica: '15.5% N - 26.5% CaO',
    formaFertilizante: 'Granulado',
    solubilidad: 'Soluble',
    observaciones: 'Apto para fertirriego y disolución en estanque'
  }
];

// POZO PROFUNDO EN BLANCO
export const initialRegistrosPozo: RegistroExtraccionPozo[] = [];

// LABORES EN BLANCO
export const initialLabores: RegistroLabor[] = [];

// MUESTREOS DE MADUREZ EN BLANCO
export const initialMuestreosMadurez: MuestreoMadurez[] = [];

// REGISTROS DE COSECHA EN BLANCO
export const initialCosechasLote: RegistroCosechaLote[] = [];

// ÓRDENES DE TRABAJO CON MÚLTIPLES PRODUCTOS Y MULTI-CUARTEL DE EJEMPLO
export const initialOrdenesTrabajo: OrdenTrabajoFitosanitaria[] = [
  {
    id: 'ot-101',
    numeroOrden: 'OT-2026-001',
    fechaEmision: '2026-10-25',
    fechaProgramada: '2026-10-26',
    destinoAplicacion: 'Huerto de Kiwi',
    parcelaIds: ['c1', 'c2'],
    parcelaNombres: 'Cuartel 1 (Kiwis), Cuartel 2 (Kiwis)',
    superficieTratarHa: 8.3,
    estado: 'emitida',
    plagaObjetivo: 'Control preventivo Psa (Pseudomonas syringae) y Botrytis',
    productos: [
      {
        insumoId: 'ins-1',
        productoComercial: 'Cobre Hidróxido 50 WP',
        materiaActiva: 'Hidróxido de Cobre',
        numeroRegistroSAG: 'SAG-1234',
        dosisPorHa: 2.0,
        unidadDosis: 'kg/ha',
        totalProductoRequerido: 16.6,
        unidadProducto: 'kg'
      },
      {
        insumoId: 'ins-2',
        productoComercial: 'Acibenzolar-S-Metil Pro',
        materiaActiva: 'Acibenzolar-S-Metil',
        numeroRegistroSAG: 'SAG-5678',
        dosisPorHa: 0.5,
        unidadDosis: 'L/ha',
        totalProductoRequerido: 4.15,
        unidadProducto: 'L'
      }
    ],
    mojamientoLHa: 1000,
    caldoTotalLitros: 8300,
    plazoReingresoHoras: 24,
    plazoCarenciaDias: 30,
    eppObligatorio: ['Mascarilla con filtro', 'Guantes de nitrilo', 'Traje Tyvek', 'Antiparras'],
    condicionesClimaticasRequeridas: 'Viento menor a 10 km/h, sin precipitaciones',
    agronomoEmisorId: 'usr-1',
    agronomoEmisorNombre: 'Diego',
    agronomoRegistroSAG: 'SAG-AG-9988',
    agronomoFirmaDigital: 'Diego - Asesor Agrónomo',
    maquinariaTractor: 'Tractor John Deere + Pulverizadora 2000L',
    descontadoInventario: false,
    observacionesTecnicas: 'Cubrir bien la vegetación sin chorreo excesivo.'
  }
];

// FENOLOGÍA EN BLANCO
export const initialFenologia: SeguimientoFenologico[] = [];

// POLINIZACIÓN EN BLANCO
export const initialPolinizacion: RegistroPolinizacion[] = [];

// CONDICIÓN CLIMA BASE
export const initialClimaLaCabana: ClimaCondiciones = {
  temperaturaC: 18.0,
  humedadRelativa: 60,
  velocidadVientoKmH: 5.0,
  vientoDireccion: 'Sur',
  precipitacionMm: 0,
  puntoRocioC: 10.0,
  presionHpa: 1013,
  radiacionUv: 5,
  alertaHelada: false,
  aptoPulverizacion: 'Optimo',
  motivoNoApto: 'Condición apta para aplicaciones'
};

// PLANTILLA HORAS FRÍO
export const initialCondicionHorasFrio: CondicionHorasFrio = {
  temporada: '2026',
  horasFrioAcumuladas: 0,
  horasFrioMetaHayward: 850,
  porcentajeCumplimiento: 0,
  fechaInicioMedicion: '2026-05-01',
  fechaUltimaActualizacion: '2026-05-01',
  temperaturaMinimaRegistradaC: 0,
  rompedorDormanciaRecomendado: 'Por evaluar según acumulación invernal',
  fechaSugeridaRompedor: 'Agosto',
  estadoDormancia: 'En acumulación',
  observacionesAgronomicas: 'Sin registros aún'
};

// USUARIO ADMINISTRADOR
export const initialUsuarios: UsuarioPredio[] = [
  {
    id: 'usr-1',
    nombre: 'Diego',
    email: 'diego@fundolacabana.cl',
    telefono: '+56 9 ',
    rol: 'administrador',
    rutIdentificacion: '',
    tituloProfesional: 'Administrador General',
    estado: 'activo',
    fechaAlta: '2026-10-20',
    avatarColor: 'bg-emerald-700 text-white',
    notas: 'Administrador del Fundo La Cabaña'
  }
];

// GUÍA TÉCNICA DE CONSULTA DE PLAGAS DEL KIWI
export const plagasGuiaKiwi: PlagaFicha[] = [
  {
    nombreComun: 'Bacteriosis del Kiwi / Psa',
    nombreCientifico: 'Pseudomonas syringae pv. actinidiae',
    cultivosAfectados: ['Kiwi Hayward'],
    sintomas: 'Manchas angulares en hojas con halo amarillo y exudados en tronco.',
    umbralEconomico: 'Tolerancia CERO.',
    metodoControl: 'Aplicación de sales de cobre y sellado de heridas.',
    periodoAlerta: 'Invierno y Primavera'
  },
  {
    nombreComun: 'Botrytis / Moho Gris',
    nombreCientifico: 'Botrytis cinerea',
    cultivosAfectados: ['Kiwi Hayward'],
    sintomas: 'Pudrición en flores y caída de fruta.',
    umbralEconomico: 'Preventivo en floración.',
    metodoControl: 'Fungicidas específicos y ventilación de parrón.',
    periodoAlerta: 'Noviembre a Diciembre'
  }
];
