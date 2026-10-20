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

// DATOS GENERALES DEL FUNDO EN BLANCO
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

// CUARTELES EN BLANCO (0 CUARTELES)
export const initialParcelas: Parcela[] = [];

// PUNTOS Y ENTRADAS EN BLANCO (0 LUGARES)
export const initialLugaresPredio: LugarPredio[] = [];

// BODEGA DE INSUMOS EN BLANCO (0 PRODUCTOS)
export const initialInventario: InsumoInventario[] = [];

// POZO PROFUNDO EN BLANCO (0 EXTRACCIONES)
export const initialRegistrosPozo: RegistroExtraccionPozo[] = [];

// LABORES EN BLANCO (0 LABORES)
export const initialLabores: RegistroLabor[] = [];

// MUESTREOS DE MADUREZ EN BLANCO
export const initialMuestreosMadurez: MuestreoMadurez[] = [];

// REGISTROS DE COSECHA EN BLANCO
export const initialCosechasLote: RegistroCosechaLote[] = [];

// ÓRDENES DE TRABAJO EN BLANCO
export const initialOrdenesTrabajo: OrdenTrabajoFitosanitaria[] = [];

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

// TU USUARIO ADMINISTRADOR
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

// GUÍA TÉCNICA DE CONSULTA DE PLAGAS DEL KIWI (Biblioteca de consulta)
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
