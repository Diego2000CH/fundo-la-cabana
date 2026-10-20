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

export const initialExplotacion: ExplotacionAgricola = {
  nombreFundo: 'Fundo La Cabaña',
  titular: 'Agrícola e Inversiones La Cabaña Ltda.',
  identificacionFiscal: '77.291.840-3',
  comunaRegion: 'Curicó - Valle Central / La Araucanía',
  direccion: 'Ruta K-60 Km 8.5, Sector La Cabaña',
  asesorAgronomo: 'Ing. Agrónomo Especialista en Kiwis (Reg. 5104)',
  numeroRegistroAgricola: 'SAG-REG-KIWI-2026-119',
  telefonoContacto: '+56 9 7619 4432',
  temporada: '2026 - 2027'
};

export const initialParcelas: Parcela[] = [
  {
    id: 'parc-1',
    nombre: 'Cuartel 1 - Kiwi Hayward Parrón',
    codigoLote: 'K-01-HAY',
    superficieHa: 4.5,
    cultivo: 'Kiwi',
    variedad: 'Hayward (Verde)',
    anoPlantacion: 2018,
    marcoPlantacion: '4.5m x 4.0m (555 pl/ha)',
    sistemaRiego: 'Goteo automatizado',
    tipoSuelo: 'Suelo aluvial profundo de textura franco-limosa con excelente drenaje',
    latitud: -35.9812,
    longitud: -71.2405,
    poligono: [[10, 15], [45, 12], [48, 48], [12, 45]],
    estadoActual: 'Floración',
    sistemaConduccion: 'Parrón Español / Pérgola'
  },
  {
    id: 'parc-2',
    nombre: 'Cuartel 2 - Kiwi Hayward Espaldera',
    codigoLote: 'K-02-HAY',
    superficieHa: 3.8,
    cultivo: 'Kiwi',
    variedad: 'Hayward (Verde)',
    anoPlantacion: 2019,
    marcoPlantacion: '4.0m x 3.5m (714 pl/ha)',
    sistemaRiego: 'Goteo automatizado',
    tipoSuelo: 'Franco arcillo-arenoso profundo',
    latitud: -35.9835,
    longitud: -71.2428,
    poligono: [[50, 15], [88, 18], [85, 52], [52, 48]],
    estadoActual: 'En crecimiento',
    sistemaConduccion: 'Espaldera en T / Doble T'
  },
  {
    id: 'parc-3',
    nombre: 'Cuartel 3 - Kiwi Hayward Sur',
    codigoLote: 'K-03-HAY',
    superficieHa: 3.2,
    cultivo: 'Kiwi',
    variedad: 'Hayward (Verde)',
    anoPlantacion: 2020,
    marcoPlantacion: '4.5m x 3.5m (635 pl/ha)',
    sistemaRiego: 'Microaspersión',
    tipoSuelo: 'Aluvial fértil con 3.5% materia orgánica y buen drenaje',
    latitud: -35.9820,
    longitud: -71.2370,
    poligono: [[15, 52], [48, 52], [46, 88], [10, 85]],
    estadoActual: 'Cuaje / Maduración',
    sistemaConduccion: 'Parrón Español / Pérgola'
  },
  {
    id: 'parc-4',
    nombre: 'Cuartel 4 - Kiwi Hayward Norte',
    codigoLote: 'K-04-HAY',
    superficieHa: 5.0,
    cultivo: 'Kiwi',
    variedad: 'Hayward (Verde)',
    anoPlantacion: 2017,
    marcoPlantacion: '4.5m x 4.0m (555 pl/ha)',
    sistemaRiego: 'Goteo automatizado',
    tipoSuelo: 'Franco profundo con alta capacidad de retención de humedad',
    latitud: -35.9860,
    longitud: -71.2355,
    poligono: [[52, 54], [92, 56], [90, 92], [50, 90]],
    estadoActual: 'En crecimiento',
    sistemaConduccion: 'Parrón Español / Pérgola'
  }
];

export const initialLugaresPredio: LugarPredio[] = [
  {
    id: 'lug-0',
    nombre: 'Entrada Principal Fundo La Cabaña (Portón Acceso)',
    tipo: 'entrada_principal',
    descripcion: 'Acceso vehicular principal para camiones de cosecha, personal y maquinaria desde Ruta K-60.',
    latitud: -35.9800,
    longitud: -71.2435
  },
  {
    id: 'lug-1',
    nombre: 'Bodega Central de Insumos y Fitosanitarios',
    tipo: 'bodega',
    descripcion: 'Almacén autorizado SAG para almacenamiento de fungicidas, bactericidas de cobre y fertilizantes.',
    latitud: -35.9818,
    longitud: -71.2412
  },
  {
    id: 'lug-2',
    nombre: 'Estacionamiento y Patio de Maquinaria / Tractores',
    tipo: 'estacionamiento',
    descripcion: 'Zona de aparcamiento de tractores, nebulizadoras Hardi y vehículos de cuadrillas de cosecha.',
    latitud: -35.9824,
    longitud: -71.2419
  },
  {
    id: 'lug-3',
    nombre: 'Pozo Profundo N°1 y Caseta de Bomba 30 HP',
    tipo: 'pozo',
    descripcion: 'Pozo de 64 metros con caudalímetro electromagnético homologado por la DGA.',
    latitud: -35.9805,
    longitud: -71.2395
  },
  {
    id: 'lug-4',
    nombre: 'Cabezal de Riego y Fertirriego Automatizado',
    tipo: 'cabezal_riego',
    descripcion: 'Filtros de anillas automáticos, inyector Venturi proporcional y control de pH y CE.',
    latitud: -35.9808,
    longitud: -71.2398
  },
  {
    id: 'lug-5',
    nombre: 'Oficina Técnica y Administración Fundo La Cabaña',
    tipo: 'oficina',
    descripcion: 'Punto de control agronómico, registros de cuadrillas y certificados GlobalGAP.',
    latitud: -35.9825,
    longitud: -71.2409
  },
  {
    id: 'lug-6',
    nombre: 'Estación Meteorológica Fundo La Cabaña',
    tipo: 'estacion_meteo',
    descripcion: 'Sensor de velocidad de viento para evitar deriva y sensor de heladas para kiwis.',
    latitud: -35.9810,
    longitud: -71.2425
  }
];

export const initialInventario: InsumoInventario[] = [
  {
    id: 'ins-1',
    nombreComercial: 'Cuprocol 50% WP (Cobre)',
    materiaActiva: 'Óxido Cuproso 50% p/p',
    categoria: 'Bactericida',
    stockActual: 12.0, // BAJO STOCK!
    unidad: 'kg',
    stockMinimo: 30.0,
    numeroRegistroSAG: 'SAG 1892',
    ubicacionBodega: 'Bodega Principal - Estante Químicos A1',
    fechaVencimiento: '2027-11-30',
    costoPorUnidadCLP: 18500,
    consumoHistoricoAcumulado: 48.0
  },
  {
    id: 'ins-2',
    nombreComercial: 'Switch 62.5 WG',
    materiaActiva: 'Cyprodinil 37.5% + Fludioxonil 25%',
    categoria: 'Fungicida',
    stockActual: 4.5, // CRÍTICO: PRÓXIMO A AGOTARSE
    unidad: 'kg',
    stockMinimo: 12.0,
    numeroRegistroSAG: 'SAG 2481',
    ubicacionBodega: 'Bodega Principal - Estante B2',
    fechaVencimiento: '2028-03-15',
    costoPorUnidadCLP: 64000,
    consumoHistoricoAcumulado: 15.5
  },
  {
    id: 'ins-3',
    nombreComercial: 'Envidor 240 SC',
    materiaActiva: 'Spirodiclofen 24% p/v',
    categoria: 'Insecticida / Acaricida',
    stockActual: 3.0, // BAJO STOCK
    unidad: 'L',
    stockMinimo: 6.0,
    numeroRegistroSAG: 'SAG 3215',
    ubicacionBodega: 'Bodega Principal - Sector Acaricidas',
    fechaVencimiento: '2027-08-20',
    costoPorUnidadCLP: 42000,
    consumoHistoricoAcumulado: 9.0
  },
  {
    id: 'ins-4',
    nombreComercial: 'Luna Tranquility',
    materiaActiva: 'Fluopyram 12.5% + Pyrimethanil 37.5%',
    categoria: 'Fungicida',
    stockActual: 22.0,
    unidad: 'L',
    stockMinimo: 8.0,
    numeroRegistroSAG: 'SAG 3920',
    ubicacionBodega: 'Bodega Principal - Estante B1',
    fechaVencimiento: '2028-01-10',
    costoPorUnidadCLP: 51000,
    consumoHistoricoAcumulado: 12.0
  },
  {
    id: 'ins-5',
    nombreComercial: 'Nitrato de Calcio Grado Fertirriego',
    materiaActiva: '15.5% N + 26% CaO',
    categoria: 'Fertilizante',
    stockActual: 850.0,
    unidad: 'kg',
    stockMinimo: 300.0,
    ubicacionBodega: 'Galpón de Fertilizantes - Pallet 4',
    fechaVencimiento: '2029-12-31',
    costoPorUnidadCLP: 850,
    consumoHistoricoAcumulado: 1200.0
  },
  {
    id: 'ins-6',
    nombreComercial: 'Break-Thru S 240 (Organosiliconado)',
    materiaActiva: 'Polieter polimetilsiloxano 100%',
    categoria: 'Coadyuvante',
    stockActual: 2.5, // BAJO STOCK
    unidad: 'L',
    stockMinimo: 6.0,
    numeroRegistroSAG: 'SAG 1632',
    ubicacionBodega: 'Bodega Principal - Gabinete Coadyuvantes',
    fechaVencimiento: '2027-05-18',
    costoPorUnidadCLP: 28000,
    consumoHistoricoAcumulado: 8.5
  }
];

export const initialRegistrosPozo: RegistroExtraccionPozo[] = [
  {
    id: 'pz-1',
    fecha: '2026-10-18',
    hora: '06:00',
    lecturaInicialM3: 41250,
    lecturaFinalM3: 41630,
    metrosCubicosExtraidos: 380,
    litrosTotales: 380000,
    horasBombeo: 4.5,
    caudalPromedioLs: 23.4,
    nivelEstaticoMetros: 14.2,
    nivelDinamicoMetros: 22.6,
    sectorDestino: 'Cuartel 1 y 2 - Kiwis Hayward',
    operadorBomba: 'Carlos Morales Vega',
    observaciones: 'Bomba sumergible 30 HP operando a 3.2 bar constante. Sin variaciones en nivel de pozo.'
  },
  {
    id: 'pz-2',
    fecha: '2026-10-15',
    hora: '07:30',
    lecturaInicialM3: 40910,
    lecturaFinalM3: 41250,
    metrosCubicosExtraidos: 340,
    litrosTotales: 340000,
    horasBombeo: 4.0,
    caudalPromedioLs: 23.6,
    nivelEstaticoMetros: 14.0,
    nivelDinamicoMetros: 22.4,
    sectorDestino: 'Cuartel 3 - Kiwi Hayward Sur',
    operadorBomba: 'Carlos Morales Vega',
    observaciones: 'Riego matutino con inyección de nutrientes. Manómetro en cabezal de filtrado OK.'
  },
  {
    id: 'pz-3',
    fecha: '2026-10-12',
    hora: '08:00',
    lecturaInicialM3: 40480,
    lecturaFinalM3: 40910,
    metrosCubicosExtraidos: 430,
    litrosTotales: 430000,
    horasBombeo: 5.0,
    caudalPromedioLs: 23.8,
    nivelEstaticoMetros: 13.9,
    nivelDinamicoMetros: 22.1,
    sectorDestino: 'Cuartel 4 - Kiwi Hayward Norte',
    operadorBomba: 'Carlos Morales Vega',
    observaciones: 'Riego profundo de inicio de brotación de primavera.'
  }
];

export const initialClimaLaCabana: ClimaCondiciones = {
  temperaturaC: 17.5,
  humedadRelativa: 62,
  velocidadVientoKmH: 5.2,
  vientoDireccion: 'Sur-Suroeste',
  precipitacionMm: 0,
  puntoRocioC: 9.8,
  presionHpa: 1016,
  radiacionUv: 5,
  alertaHelada: false,
  aptoPulverizacion: 'Optimo',
  motivoNoApto: 'Condiciones óptimas: viento suave (5.2 km/h) y temperatura moderada sin riesgo de evaporación ni deriva.'
};

export const initialLabores: RegistroLabor[] = [
  {
    id: 'lab-1',
    fecha: '2026-10-14',
    hora: '07:30',
    parcelaId: 'parc-1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward Parrón',
    tipoLabor: 'fitosanitario',
    descripcionGeneral: 'Tratamiento preventivo para Botrytis cinerea y Psa en kiwi en pre-floración',
    productoComercial: 'Switch 62.5 WG',
    insumoId: 'ins-2',
    materiaActiva: 'Cyprodinil 37.5% + Fludioxonil 25%',
    numeroRegistroSAG: 'SAG 2481',
    plagaObjetivo: 'Botrytis cinerea (Moho gris del kiwi)',
    dosisPorHa: 0.8,
    unidadDosis: 'kg/ha',
    volumenCaldoLHa: 1200,
    totalInsumoUtilizado: 3.6, // 0.8 kg/ha * 4.5 ha = 3.6 kg
    plazoSeguridadDias: 14,
    plazoReingresoHoras: 12,
    maquinariaEquipo: 'Nebulizadora para parrón Hardi 2000L con deflector superior',
    aplicadorNombre: 'Carlos Morales Vega',
    carnetAplicador: 'APL-SAG-8921',
    condicionesClima: {
      temperaturaC: 16.4,
      humedadRelativa: 68,
      velocidadVientoKmH: 4.2,
      vientoDireccion: 'Sur-Oeste',
      precipitacionMm: 0,
      aptoPulverizacion: 'Optimo'
    },
    estadoFenologicoBBCH: 'BBCH 57 (Botones florales separados en inflorescencia)',
    costoEstimadoCLP: 230400,
    observaciones: 'Aplicación dirigida bajo el parrón de kiwis. Verificado con tarjetas hidrosensibles colocadas en el tercio superior de la canopia.',
    registradoPor: 'Diego Pereira'
  },
  {
    id: 'lab-2',
    fecha: '2026-10-16',
    hora: '08:00',
    parcelaId: 'parc-3',
    parcelaNombre: 'Cuartel 3 - Kiwi Hayward Sur',
    tipoLabor: 'fertilizacion',
    descripcionGeneral: 'Aporte de Nitrato de Calcio por fertirriego para desarrollo celular del fruto',
    abonoProducto: 'Nitrato de Calcio Grado Fertirriego',
    insumoId: 'ins-5',
    formulacionNPK: '15.5-0-0 + 26 CaO',
    dosisAbonoKgHa: 45,
    metodoAplicacionAbono: 'Fertirriego',
    volumenCaldoLHa: 7500,
    maquinariaEquipo: 'Cabezal automatizado de fertirriego con inyector Venturi proporcional',
    aplicadorNombre: 'Juan Riquelme Silva',
    costoEstimadoCLP: 122400,
    observaciones: 'Conductividad eléctrica controlada en 1.35 mS/cm. pH de la solución de riego mantenido en 5.8.',
    registradoPor: 'Diego Pereira'
  },
  {
    id: 'lab-3',
    fecha: '2026-10-17',
    hora: '09:30',
    parcelaId: 'parc-1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward Parrón',
    tipoLabor: 'monitoreo',
    descripcionGeneral: 'Monitoreo de Falsa Arañita de la vid y kiwi (Brevipalpus chilensis) en envés de hojas',
    plagaObjetivo: 'Brevipalpus chilensis (Falsa Arañita roja)',
    nivelInfestacion: 'Bajo (<5%)',
    umbralSuperado: false,
    accionSugerida: 'Revisión periódica en 7 días. Población controlada por fitoseidos nativos.',
    fotoUrl: '/src/assets/images/agro_monitoring_leaf_1792419620073.jpg',
    condicionesClima: {
      temperaturaC: 18.2,
      humedadRelativa: 58,
      velocidadVientoKmH: 4.8
    },
    observaciones: 'Muestreo de 50 hojas en zona sombreada del parrón. 0.3 formas móviles por hoja. No requiere aplicación química inmediata.',
    registradoPor: 'Diego Pereira'
  },
  {
    id: 'lab-4',
    fecha: '2026-10-18',
    hora: '06:00',
    parcelaId: 'parc-1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward Parrón',
    tipoLabor: 'riego',
    descripcionGeneral: 'Riego con extracción de pozo profundo registrado (380.000 Litros)',
    duracionRiegoHoras: 4.5,
    volumenM3: 380,
    litrosAgua: 380000,
    fuenteAgua: 'Pozo Profundo N°1 Fundo La Cabaña (Caudal DGA: 25 L/s)',
    registroPozoId: 'pz-1',
    maquinariaEquipo: 'Bomba sumergible 30 HP y cabezal de filtrado de anillas',
    observaciones: 'Presión en cabezal mantenida en 3.2 bar. Lámina calculada: 8.4 mm de agua aplicados al cuartel.',
    costoEstimadoCLP: 35000,
    registradoPor: 'Carlos Morales Vega'
  },
  {
    id: 'lab-5',
    fecha: '2026-10-11',
    hora: '08:30',
    parcelaId: 'parc-2',
    parcelaNombre: 'Cuartel 2 - Kiwi Hayward Espaldera',
    tipoLabor: 'labor_cultural',
    descripcionGeneral: 'Poda en verde y deschuponado de brotes vigorosos verticales en kiwi',
    maquinariaEquipo: 'Tijeras de poda manuales esterilizadas con alcohol 70°',
    aplicadorNombre: 'Cuadrilla de 4 podadores especializados',
    costoEstimadoCLP: 180000,
    observaciones: 'Se eliminaron chupones no fértiles para favorecer iluminación y ventilación en espaldera.',
    registradoPor: 'Diego Pereira'
  }
];

export const plagasGuiaKiwi: PlagaFicha[] = [
  {
    nombreComun: 'Bacteriosis del Kiwi / Psa',
    nombreCientifico: 'Pseudomonas syringae pv. actinidiae',
    cultivosAfectados: ['Kiwi Hayward', 'Actinidia deliciosa', 'Actinidia spp.'],
    sintomas: 'Manchas angulares pardas rodeadas de halo amarillento en hojas, exudados rojizos o blancos en tronco, muerte de ramillas y marchitez de flores.',
    umbralEconomico: 'Tolerancia CERO. Requiere aviso inmediato y aplicación preventiva tras heladas, podas o lluvias.',
    metodoControl: 'Aplicación estricta de sales de cobre (óxido cuproso o hidróxido de cobre), desinfección rigurosa de tijeras con amonio cuaternario o alcohol 70°, y sellado de heridas.',
    periodoAlerta: 'Invierno y Primavera (Lluvias y brotación)'
  },
  {
    nombreComun: 'Botrytis / Moho Gris del Kiwi',
    nombreCientifico: 'Botrytis cinerea',
    cultivosAfectados: ['Kiwi Hayward', 'Actinidia deliciosa'],
    sintomas: 'Infección en pétalos florales que se transmite al receptáculo del fruto, provocando caída floral o pudrición peduncular en cámara frigorífica.',
    umbralEconomico: 'Preventivo obligatorio durante caída de pétalos (floración) ante condiciones de humedad >80%.',
    metodoControl: 'Manejo de canopia para aireación del parrón. Aplicación de fungicidas específicos (Switch, Luna Tranquility) en plena flor y caída de pétalos.',
    periodoAlerta: 'Noviembre a Diciembre (Floración)'
  },
  {
    nombreComun: 'Falsa Arañita Roja de la Vid y Kiwi',
    nombreCientifico: 'Brevipalpus chilensis',
    cultivosAfectados: ['Kiwi', 'Vid', 'Cítricos', 'Ligustro'],
    sintomas: 'Acaro cuarentenario para mercados de exportación (EE.UU.). Bronceado y micro-puntuaciones en el envés de la hoja y en pedicelo del fruto.',
    umbralEconomico: 'Presencia de formas móviles en más del 2% al 5% de hojas muestreadas; tolerancia cero para exportación sin bromurado.',
    metodoControl: 'Monitoreo meticuloso con lupa de 20x. Aplicación de acaricidas específicos (Spirodiclofen / Envidor, Abamectina) respetando carencia.',
    periodoAlerta: 'Diciembre a Abril'
  },
  {
    nombreComun: 'Escama de San José',
    nombreCientifico: 'Diaspidiotus perniciosus',
    cultivosAfectados: ['Kiwi', 'Manzano', 'Peral'],
    sintomas: 'Costras circulares en corteza de madera vieja y manchas rojas alrededor de frutos, depreciando valor comercial.',
    umbralEconomico: 'Presencia visible de escamas vivas en madera de 1 y 2 años.',
    metodoControl: 'Aceites minerales en receso invernal + insecticidas reguladores de crecimiento en estado de ninfas migratorias.',
    periodoAlerta: 'Noviembre y Enero'
  }
];

export const initialUsuarios: UsuarioPredio[] = [
  {
    id: 'usr-1',
    nombre: 'Diego Pereira',
    email: 'diego.pereira2019@alu.uct.cl',
    telefono: '+56 9 7619 4432',
    rol: 'administrador',
    rutIdentificacion: '19.824.115-K',
    tituloProfesional: 'Administrador General del Predio',
    estado: 'activo',
    fechaAlta: '2024-03-01',
    avatarColor: 'bg-emerald-700 text-white',
    notas: 'Acceso total a configuración de la app, gestión de usuarios, catastro de cuarteles y reportes oficiales SAG.'
  },
  {
    id: 'usr-2',
    nombre: 'Ing. Rodrigo Morales Sotomayor',
    email: 'rmorales.agronomo@fundolacabana.cl',
    telefono: '+56 9 9234 8110',
    rol: 'agronomo_predio',
    rutIdentificacion: '15.420.318-7',
    numeroRegistroSAG: 'REG-COL-AGRO-5104',
    tituloProfesional: 'Ingeniero Agrónomo Especialista en Kiwis',
    estado: 'activo',
    fechaAlta: '2024-08-15',
    avatarColor: 'bg-emerald-600 text-white',
    notas: 'Responsable técnico del plan de fertilización, monitoreo de Psa y dosificaciones fitosanitarias de Fundo La Cabaña.'
  },
  {
    id: 'usr-3',
    nombre: 'Dra. Marcela Valenzuela Reyes',
    email: 'mvalenzuela@agrocert-consultores.cl',
    telefono: '+56 9 8451 9022',
    rol: 'asesor_externo',
    rutIdentificacion: '14.180.992-3',
    numeroRegistroSAG: 'ASESOR-EXP-KIWI-089',
    tituloProfesional: 'Asesora Externa en Sanidad Vegetal & GlobalGAP',
    estado: 'activo',
    fechaAlta: '2025-01-10',
    avatarColor: 'bg-purple-700 text-white',
    notas: 'Auditoría periódica de cuadernos de campo, tolerancias de residuos (LMR) y cumplimiento de protocolos de exportación.'
  },
  {
    id: 'usr-4',
    nombre: 'Carlos Morales Vega',
    email: 'cmorales.campo@fundolacabana.cl',
    telefono: '+56 9 6512 3349',
    rol: 'jefe_campo',
    rutIdentificacion: '13.901.764-2',
    numeroRegistroSAG: 'APL-SAG-8921',
    tituloProfesional: 'Jefe de Campo y Aplicador Autorizado SAG',
    estado: 'activo',
    fechaAlta: '2023-05-20',
    avatarColor: 'bg-amber-700 text-white',
    notas: 'Coordinador de cuadrillas, mantención de maquinaria pulverizadora Hardi y operador principal del pozo profundo.'
  },
  {
    id: 'usr-5',
    nombre: 'Juan Riquelme Silva',
    email: 'jriquelme.riego@fundolacabana.cl',
    telefono: '+56 9 5109 7781',
    rol: 'operador_riego',
    rutIdentificacion: '16.744.205-9',
    tituloProfesional: 'Técnico de Riego y Fertirriego',
    estado: 'activo',
    fechaAlta: '2024-11-01',
    avatarColor: 'bg-sky-700 text-white',
    notas: 'Operador de cabezal de filtrado, inyección de fertilizantes y registro de flujómetro de pozo profundo.'
  }
];

// MUESTREOS DE MADUREZ (°BRIX, FIRMEZA Y MATERIA SECA - KIWI HAYWARD)
export const initialMuestreosMadurez: MuestreoMadurez[] = [
  {
    id: 'mad-01',
    fecha: '2026-04-12',
    parcelaId: 'parc-1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward Parrón',
    variedad: 'Hayward',
    cuartelSector: 'Sector Norte Hileras 1 a 25',
    solidosSolublesBrix: 6.6,
    firmezaLibras: 14.8,
    materiaSecaPorcentaje: 16.4,
    colorSemillas: '100% Negras',
    estadoAutorizacion: 'Autorizado Cosecha',
    temperaturaAmbienteMuestreoC: 18.2,
    evaluadorNombre: 'Ing. Rodrigo Maturana V.',
    observaciones: 'Fruta alcanza umbral SAG de exportación (>6.2° Brix) con excelente coloración parda de semilla y pulpa verde esmeralda uniforme.'
  },
  {
    id: 'mad-02',
    fecha: '2026-04-11',
    parcelaId: 'parc-4',
    parcelaNombre: 'Cuartel 4 - Kiwi Hayward Norte',
    variedad: 'Hayward',
    cuartelSector: 'Sector Bajo Camino',
    solidosSolublesBrix: 6.3,
    firmezaLibras: 15.6,
    materiaSecaPorcentaje: 16.0,
    colorSemillas: '100% Negras',
    estadoAutorizacion: 'Autorizado Cosecha',
    temperaturaAmbienteMuestreoC: 17.5,
    evaluadorNombre: 'Ing. Rodrigo Maturana V.',
    observaciones: 'Autorizada recolección de primera pasada en sector asoleado. Excelente firmeza para guarda frigorífica prolongada.'
  },
  {
    id: 'mad-03',
    fecha: '2026-04-10',
    parcelaId: 'parc-2',
    parcelaNombre: 'Cuartel 2 - Kiwi Hayward Espaldera',
    variedad: 'Hayward',
    cuartelSector: 'Hileras centrales 12 a 30',
    solidosSolublesBrix: 5.9,
    firmezaLibras: 16.8,
    materiaSecaPorcentaje: 15.3,
    colorSemillas: '75% Pardo Oscuro',
    estadoAutorizacion: 'En Observación',
    temperaturaAmbienteMuestreoC: 16.8,
    evaluadorNombre: 'Ing. Rodrigo Maturana V.',
    observaciones: 'Aún bajo el umbral de corte comercial (5.9° Brix). Re-evaluar en 5 días con acumulación térmica.'
  },
  {
    id: 'mad-04',
    fecha: '2026-04-08',
    parcelaId: 'parc-3',
    parcelaNombre: 'Cuartel 3 - Kiwi Hayward Sur',
    variedad: 'Hayward',
    cuartelSector: 'Paño Completo',
    solidosSolublesBrix: 5.6,
    firmezaLibras: 17.2,
    materiaSecaPorcentaje: 14.8,
    colorSemillas: '75% Pardo Oscuro',
    estadoAutorizacion: 'No Autorizado',
    temperaturaAmbienteMuestreoC: 19.0,
    evaluadorNombre: 'Ing. Rodrigo Maturana V.',
    observaciones: 'Fruto aún inmaduro. Dejar evolucionar fotosintéticamente sin déficit hídrico.'
  }
];

// REGISTROS DE COSECHA (BINS, KILOS Y DESTINO PACKING)
export const initialCosechasLote: RegistroCosechaLote[] = [
  {
    id: 'cos-01',
    fecha: '2026-04-14',
    parcelaId: 'parc-1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward Parrón',
    variedad: 'Hayward',
    cuartelHilera: 'Hileras 1 a 15',
    cantidadBins: 42,
    pesoPromedioBinKg: 395,
    kilosTotales: 16590,
    cuadrillaCosecheros: 'Cuadrilla Don Carlos (16 cosecheros)',
    numeroCosecheros: 16,
    calidadCalibrePredominante: 'Calibre 33-36 (Grande)',
    guiaDespachoNumero: 'GD-88412',
    packingDestino: 'Frusan Central San Fernando',
    responsableCosecha: 'Marcos Benítez T.',
    observaciones: 'Cosecha con guantes de algodón y alicate curvo para pedúnculo raso. Cero daño mecánico en fruta.'
  },
  {
    id: 'cos-02',
    fecha: '2026-04-13',
    parcelaId: 'parc-4',
    parcelaNombre: 'Cuartel 4 - Kiwi Hayward Norte',
    variedad: 'Hayward',
    cuartelHilera: 'Hileras 1 a 12',
    cantidadBins: 36,
    pesoPromedioBinKg: 390,
    kilosTotales: 14040,
    cuadrillaCosecheros: 'Cuadrilla Los Espinos (14 cosecheros)',
    numeroCosecheros: 14,
    calidadCalibrePredominante: 'Calibre 27-30 (Jumbo)',
    guiaDespachoNumero: 'GD-88409',
    packingDestino: 'David del Curto Curicó',
    responsableCosecha: 'Marcos Benítez T.',
    observaciones: 'Excelente llenado de bins. Fruta uniforme sin marcas de viento.'
  }
];

// ÓRDENES DE TRABAJO FITOSANITARIAS (RECETAS AGRONÓMICAS OFICIALES)
export const initialOrdenesTrabajo: OrdenTrabajoFitosanitaria[] = [
  {
    id: 'ot-01',
    numeroOrden: 'OT-2026-048',
    fechaEmision: '2026-04-15',
    fechaProgramada: '2026-04-17',
    parcelaId: 'parc-1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward Parrón',
    superficieTratarHa: 4.5,
    estado: 'emitida',
    plagaObjetivo: 'Pseudomonas syringae pv. actinidiae (Psa) - Protección herida post-cosecha',
    insumoId: 'ins-1',
    productoComercial: 'Nordox 75 WG',
    materiaActiva: 'Óxido Cuproso 75% p/p',
    numeroRegistroSAG: 'SAG-1944',
    dosisPorHa: 1.5,
    unidadDosis: 'kg/ha',
    mojamientoLHa: 1500,
    caldoTotalLitros: 6750,
    totalProductoRequerido: 6.75,
    unidadProducto: 'kg',
    plazoReingresoHoras: 24,
    plazoCarenciaDias: 14,
    eppObligatorio: [
      'Máscara con filtro de carbón para polvos y vapores',
      'Traje impermeable tipo Tyvek completo con capucha',
      'Guantes de nitrilo puño largo',
      'Botas de goma caña alta sin perforaciones',
      'Antiparras de policarbonato con sello facial'
    ],
    condicionesClimaticasRequeridas: 'Viento menor a 8 km/h, Humedad Relativa > 50%, T° entre 12°C y 22°C. No pulverizar si hay rocío o pronóstico de lluvia en 12 horas.',
    agronomoEmisorId: 'usr-2',
    agronomoEmisorNombre: 'Ing. Rodrigo Maturana V.',
    agronomoRegistroSAG: 'SAG-AGR-4491-RM',
    agronomoFirmaDigital: 'FIRMADO DIGITALMENTE - RUT 15.321.458-2 · SAG-AGR-4491-RM (15/04/2026 09:30)',
    aplicadorAsignadoId: 'usr-4',
    aplicadorAsignadoNombre: 'Marcos Benítez T.',
    maquinariaTractor: 'Tractor New Holland TN75F + Nebulizadora Hardi 2000L (Boquillas ATR Naranjas)',
    descontadoInventario: false,
    observacionesTecnicas: 'Cubrimiento exhaustivo de cicatrices de pedúnculo tras la cosecha para evitar colonización bacteriana de Psa.'
  },
  {
    id: 'ot-02',
    numeroOrden: 'OT-2026-042',
    fechaEmision: '2026-03-20',
    fechaProgramada: '2026-03-22',
    fechaEjecucion: '2026-03-22',
    parcelaId: 'parc-4',
    parcelaNombre: 'Cuartel 4 - Kiwi Hayward Norte',
    superficieTratarHa: 5.0,
    estado: 'completada',
    plagaObjetivo: 'Botrytis cinerea (Moho Gris)',
    insumoId: 'ins-2',
    productoComercial: 'Switch 62.5 WG',
    materiaActiva: 'Cyprodinil 37.5% + Fludioxonil 25%',
    numeroRegistroSAG: 'SAG-2388',
    dosisPorHa: 1.0,
    unidadDosis: 'kg/ha',
    mojamientoLHa: 1200,
    caldoTotalLitros: 6000,
    totalProductoRequerido: 5.0,
    unidadProducto: 'kg',
    plazoReingresoHoras: 12,
    plazoCarenciaDias: 7,
    eppObligatorio: [
      'Máscara respiratoria aprobada NIOSH con filtro P100',
      'Buzo protector resistente a químicos',
      'Guantes impermeables de nitrilo',
      'Protector facial envolvente'
    ],
    condicionesClimaticasRequeridas: 'Viento calmo < 6 km/h, Temperatura 18°C.',
    agronomoEmisorId: 'usr-2',
    agronomoEmisorNombre: 'Ing. Rodrigo Maturana V.',
    agronomoRegistroSAG: 'SAG-AGR-4491-RM',
    agronomoFirmaDigital: 'FIRMADO DIGITALMENTE - RUT 15.321.458-2 · SAG-AGR-4491-RM',
    aplicadorAsignadoId: 'usr-4',
    aplicadorAsignadoNombre: 'Marcos Benítez T.',
    maquinariaTractor: 'Tractor John Deere 5075E + Pulverizadora Jacto Arbus 2000',
    aplicadorFirma: 'APLICACIÓN CONFORME - Marcos Benítez T. (Carnet SAG Aplicador #08-4122)',
    descontadoInventario: true,
    laborRegistradaId: 'lab-prev-01',
    observacionesTecnicas: 'Aplicación preventiva previa a evento de lluvia. Excelente cobertura en racimos florales.'
  }
];

// CONDICIONES DE HORAS FRÍO PARA KIWI HAYWARD (META 800 - 1000 HF)
export const initialCondicionHorasFrio: CondicionHorasFrio = {
  temporada: '2026',
  horasFrioAcumuladas: 845,
  horasFrioMetaHayward: 850,
  porcentajeCumplimiento: 99.4,
  fechaInicioMedicion: '2026-05-01',
  fechaUltimaActualizacion: '2026-08-05',
  temperaturaMinimaRegistradaC: -2.4,
  rompedorDormanciaRecomendado: 'Cianamida Hidrogenada al 4% + Aceite Mineral al 1.0% (o Erger / Syncron en orgánico)',
  fechaSugeridaRompedor: 'Entre 15 y 25 de Agosto (25-30 días antes de la brotación estimada)',
  estadoDormancia: 'Cumplimiento óptimo',
  observacionesAgronomicas: 'Fundo La Cabaña acumuló 845 HF bajo 7.2°C, cumpliendo el requerimiento de frío del cultivar Hayward. El uso de rompedor de dormancia homogeneizará la brotación floral de cargadores y adelantará la floración de machos Tomuri.'
};

// SEGUIMIENTO FENOLÓGICO BBCH KIWI HAYWARD
export const initialFenologia: SeguimientoFenologico[] = [
  {
    id: 'fen-01',
    fecha: '2026-10-18',
    parcelaId: 'parc-1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward Parrón',
    variedad: 'Hayward',
    codigoBBCH: 'BBCH 65',
    nombreEstado: 'Plena Floración (50% o más de flores abiertas en plantas hembra Hayward)',
    porcentajeAvance: 75,
    observaciones: 'Gran sincronía floral con machos polinizadores Tomuri y Chieftain. Alto vuelo de abejas y abejorros en el parrón.',
    evaluador: 'Ing. Rodrigo Maturana V.'
  },
  {
    id: 'fen-02',
    fecha: '2026-10-16',
    parcelaId: 'parc-2',
    parcelaNombre: 'Cuartel 2 - Kiwi Hayward Espaldera',
    variedad: 'Hayward',
    codigoBBCH: 'BBCH 61',
    nombreEstado: 'Inicio de Floración (Apertura de primeras flores hembra ~10%)',
    porcentajeAvance: 40,
    observaciones: 'Botones hinchados con pétalos blancos visibles. Machos con apertura del 60%.',
    evaluador: 'Marcos Benítez T.'
  },
  {
    id: 'fen-03',
    fecha: '2026-10-12',
    parcelaId: 'parc-3',
    parcelaNombre: 'Cuartel 3 - Kiwi Hayward Sur',
    variedad: 'Hayward',
    codigoBBCH: 'BBCH 55',
    nombreEstado: 'Botón floral individual visible en axilas de hojas',
    porcentajeAvance: 85,
    observaciones: 'Buen número de inflorescencias por cargador (promedio 3 a 5 botones por brote fértil).',
    evaluador: 'Ing. Rodrigo Maturana V.'
  },
  {
    id: 'fen-04',
    fecha: '2026-10-15',
    parcelaId: 'parc-4',
    parcelaNombre: 'Cuartel 4 - Kiwi Hayward Norte',
    variedad: 'Hayward',
    codigoBBCH: 'BBCH 65',
    nombreEstado: 'Plena Floración (Pétalos blancos abiertos, estigmas receptivos)',
    porcentajeAvance: 70,
    observaciones: 'Polinización activa en curso.',
    evaluador: 'Marcos Benítez T.'
  }
];

// REGISTRO DE POLINIZACIÓN EN KIWI HAYWARD
export const initialPolinizacion: RegistroPolinizacion[] = [
  {
    id: 'pol-01',
    temporada: '2026 - 2027',
    parcelaId: 'parc-1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward Parrón',
    variedadPrincipal: 'Hayward (Hembra)',
    variedadPolinizadora: 'Tomuri / Chieftain (Macho 1:6)',
    fechaEntradaColmenas: '2026-10-12',
    fechaSalidaColmenas: '2026-10-26',
    tipoPolinizador: 'Mixta (Abejas + Abejorros)',
    colmenasTotales: 45,
    colmenasPorHectarea: 10,
    proveedorApiario: 'Apícola Los Quillayes del Maule',
    sincroniaFloracion: 'Óptima (>90%)',
    porcentajeFloresAbiertas: 75,
    estadoPolinizacion: 'En curso',
    observaciones: '36 colmenas de Apis mellifera con alzas vigorosas + 9 colmenas de abejorros Bombus terrestris para días nublados. Kiwi requiere más de 1.000 granos de polen por flor para lograr calibre exportable (>100g).'
  },
  {
    id: 'pol-02',
    temporada: '2026 - 2027',
    parcelaId: 'parc-4',
    parcelaNombre: 'Cuartel 4 - Kiwi Hayward Norte',
    variedadPrincipal: 'Hayward (Hembra)',
    variedadPolinizadora: 'Matua / Tomuri (Macho 1:8)',
    fechaEntradaColmenas: '2026-10-14',
    fechaSalidaColmenas: '2026-10-28',
    tipoPolinizador: 'Abejas melíferas (Apis mellifera)',
    colmenasTotales: 42,
    colmenasPorHectarea: 8.4,
    proveedorApiario: 'Apícola Los Quillayes del Maule',
    sincroniaFloracion: 'Óptima (>90%)',
    porcentajeFloresAbiertas: 70,
    estadoPolinizacion: 'En curso',
    observaciones: 'Distribución en 3 piqueras estratégicas protegidas del viento sur.'
  }
];
