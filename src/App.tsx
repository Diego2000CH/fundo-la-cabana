import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Package, 
  Calculator, 
  FileText, 
  Plus, 
  Users, 
  Lock, 
  LogOut, 
  Waves, 
  Droplet, 
  Sun, 
  Apple, 
  LayoutDashboard, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Calendar, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Activity, 
  Compass, 
  Tractor, 
  MapPin, 
  Check, 
  X, 
  Award, 
  Layers, 
  Scissors, 
  Bug, 
  FlaskConical, 
  ChevronRight, 
  Info 
} from 'lucide-react';

import { 
  Parcela, 
  InsumoInventario, 
  UsuarioPredio, 
  RegistroLabor, 
  OrdenTrabajoFitosanitaria, 
  RegistroRiegoSector, 
  RegistroExtraccionPozo, 
  MuestreoMadurez, 
  RegistroCosechaLote, 
  ClimaCondiciones, 
  CondicionHorasFrio, 
  SeguimientoFenologico, 
  RegistroPolinizacion, 
  DestinoAplicacion, 
  TipoLabor, 
  CategoriaInsumo, 
  DestinoUso, 
  EstadoFormaFertilizante, 
  SolubilidadFertilizante, 
  TipoRiego, 
  FuenteAguaRiego 
} from './types/campo';

import { LaboresView } from './components/LaboresView';
import { BodegaView } from './components/BodegaView';
import { OrdenesTrabajoView } from './components/OrdenesTrabajoView';
import { ModalLabor } from './components/ModalLabor';

// ==========================================
// DATOS INICIALES COMPLETOS DEL PREDIO
// ==========================================

const INITIAL_PARCELAS: Parcela[] = [
  { id: 'c1', nombre: 'Cuartel 1 - Kiwi Hayward', superficieHa: 2.8, variedad: 'Kiwi Hayward', anoPlantacion: 2015, descripcion: 'Suelo franco arcilloso, riego por goteo doble línea' },
  { id: 'c2', nombre: 'Cuartel 2 - Kiwi Hayward', superficieHa: 4.9, variedad: 'Kiwi Hayward', anoPlantacion: 2017, descripcion: 'Suelo franco profundo, cobertura vegetal interhilera' },
  { id: 'c3', nombre: 'Cuartel 3 - Kiwi Hayward Formacion', superficieHa: 5.4, variedad: 'Kiwi Hayward', anoPlantacion: 2021, descripcion: 'Plantación joven en estructura T-Bar y macho Tomuri 1:8' }
];

const INITIAL_INVENTARIO: InsumoInventario[] = [
  { id: 'ins-1', nombreComercial: 'Cobre Hidróxido 50 WP', materiaActiva: 'Hidróxido de Cobre', categoria: 'Fungicida y Bactericida', stockActual: 45, unidad: 'kg', numeroRegistroSAG: '1234-SAG', ubicacionBodega: 'Estante A-1', fechaElaboracion: '2025-08-10', fechaVencimiento: '2027-08-10', destinoEspecifico: 'Kiwis' },
  { id: 'ins-2', nombreComercial: 'Spirotetramat 240 SC', materiaActiva: 'Spirotetramat', categoria: 'Insecticida', stockActual: 12, unidad: 'L', numeroRegistroSAG: '5678-SAG', ubicacionBodega: 'Estante B-3', fechaElaboracion: '2025-05-15', fechaVencimiento: '2027-05-15', destinoEspecifico: 'Kiwis' },
  { id: 'ins-3', nombreComercial: 'Nitrato de Calcio Soluble', materiaActiva: 'Nitrato de Calcio', categoria: 'Fertilizante', stockActual: 500, unidad: 'kg', composicionQuimica: '15.5% N + 26.5% CaO', formaFertilizante: 'Granulado', solubilidad: 'Soluble', ubicacionBodega: 'Pallet 4', destinoEspecifico: 'Kiwis' },
  { id: 'ins-4', nombreComercial: 'Glifosato 480 SL', materiaActiva: 'Glifosato', categoria: 'Herbicida', stockActual: 30, unidad: 'L', numeroRegistroSAG: '9912-SAG', ubicacionBodega: 'Estante C-1', destinoEspecifico: 'Uso General' },
  { id: 'ins-5', nombreComercial: 'Hydrogen Cyanamide 52%', materiaActiva: 'Cianamida Hidrogenada', categoria: 'Fitorregulador', stockActual: 60, unidad: 'L', numeroRegistroSAG: '4321-SAG', ubicacionBodega: 'Bodega Fito Especial', destinoEspecifico: 'Kiwis', observaciones: 'Rompedor de dormancia uso exclusivo precosecha' }
];

const INITIAL_USUARIOS: UsuarioPredio[] = [
  { 
    id: 'usr-1', 
    nombre: 'Diego Pereira Ramirez', 
    email: 'admin@fundolacabana.cl', 
    clave: 'admin123', 
    rol: 'administrador', 
    rutIdentificacion: '15.432.890-K',
    tituloProfesional: 'Ingeniero Agrónomo',
    numeroRegistroSAG: 'SAG-8921-CL', 
    estado: 'activo', 
    fechaAlta: '2025-01-01',
    telefono: '+56 9 8765 4321',
    avatarColor: 'bg-emerald-800'
  },
  { 
    id: 'usr-2', 
    nombre: 'Juan Pérez', 
    email: 'operador@fundolacabana.cl', 
    clave: 'operador123', 
    rol: 'operador', 
    rutIdentificacion: '12.876.543-2',
    numeroRegistroSAG: 'APL-SAG-3312', 
    estado: 'activo', 
    fechaAlta: '2025-01-01',
    telefono: '+56 9 1234 5678',
    avatarColor: 'bg-blue-800'
  },
  { 
    id: 'usr-3', 
    nombre: 'Rodrigo Morales Silva', 
    email: 'agronomo@fundolacabana.cl', 
    clave: 'agro2026', 
    rol: 'agronomo', 
    rutIdentificacion: '14.123.987-5',
    tituloProfesional: 'Asesor Fitosanitario',
    numeroRegistroSAG: 'SAG-4410-AG', 
    estado: 'activo', 
    fechaAlta: '2025-03-15',
    telefono: '+56 9 9988 7766',
    avatarColor: 'bg-amber-800'
  }
];

const INITIAL_LABORES: RegistroLabor[] = [
  {
    id: 'lab-1',
    fecha: '2026-11-04',
    parcelaId: 'c1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward',
    tipoLabor: 'Aplicacion Fitosanitaria',
    descripcion: 'Aplicación foliar preventiva con Fungicida Cobre para control de Psa',
    operadorNombre: 'Juan Pérez',
    insumoId: 'ins-1',
    insumoNombre: 'Cobre Hidróxido 50 WP',
    dosisPorHa: 1.5,
    totalInsumoUtilizado: 4.2,
    unidadInsumo: 'kg/ha',
    observaciones: 'Aplicado con pulverizadora 2000L a 1200 L/ha de agua'
  },
  {
    id: 'lab-2',
    fecha: '2026-10-20',
    parcelaId: 'c2',
    parcelaNombre: 'Cuartel 2 - Kiwi Hayward',
    tipoLabor: 'Fertilizacion',
    descripcion: 'Fertirriego de primavera enfocado a brotación inicial',
    operadorNombre: 'Juan Pérez',
    insumoId: 'ins-3',
    insumoNombre: 'Nitrato de Calcio Soluble',
    dosisPorHa: 25,
    totalInsumoUtilizado: 122.5,
    unidadInsumo: 'kg/ha',
    observaciones: 'Inyectado vía sistema de riego por goteo'
  }
];

const INITIAL_ORDENES: OrdenTrabajoFitosanitaria[] = [
  {
    id: 'ot-1',
    numeroOrden: 'OT-2026-001',
    fechaEmision: '2026-11-04',
    fechaProgramada: '2026-11-06',
    parcelaIds: ['c1'],
    parcelaNombres: 'Cuartel 1 - Kiwi Hayward',
    superficieTratarHa: 2.8,
    destinoAplicacion: 'Huerto de Kiwi',
    estado: 'emitida',
    plagaObjetivo: 'Pseudomonas syringae pv. actinidiae (Psa) / Hongos de madera',
    productos: [
      {
        insumoId: 'ins-1',
        productoComercial: 'Cobre Hidróxido 50 WP',
        materiaActiva: 'Hidróxido de Cobre',
        numeroRegistroSAG: '1234-SAG',
        dosisPorHa: 1.5,
        unidadDosis: 'kg/ha',
        totalProductoRequerido: 4.2,
        unidadProducto: 'kg'
      }
    ],
    mojamientoLHa: 1200,
    caldoTotalLitros: 3360,
    plazoReingresoHoras: 24,
    plazoCarenciaDias: 14,
    eppObligatorio: ['Máscara respiratoria con filtro químico', 'Buzo impermeable Tyvek', 'Guantes de nitrilo', 'Botas de goma'],
    condicionesClimaticasRequeridas: 'Viento menor a 8 km/h, humedad relativa superior al 50%, sin precipitaciones',
    agronomoEmisorId: 'usr-1',
    agronomoEmisorNombre: 'Diego Pereira Ramirez',
    agronomoRegistroSAG: 'SAG-8921-CL',
    agronomoFirmaDigital: 'FIRMADO DIGITALMENTE - Diego Pereira Ramirez',
    aplicadorAsignadoId: 'usr-2',
    aplicadorAsignadoNombre: 'Juan Pérez',
    maquinariaTractor: 'Tractor John Deere + Pulverizadora Teyme 2000L',
    descontadoInventario: false,
    observacionesTecnicas: 'Cubrir adecuadamente todo el follaje y madera del cuartel.'
  }
];

const INITIAL_RIEGOS: RegistroRiegoSector[] = [
  {
    id: 'rieg-1',
    fecha: '2026-11-03',
    horaInicio: '07:30',
    sectorDestino: 'Cuartel 1 & Cuartel 2',
    superficieHa: 7.7,
    tipoRiego: 'Fertirriego',
    fuenteAgua: 'Pozo profundo',
    duracionHoras: 4.5,
    volumenM3: 310,
    litrosTotales: 310000,
    laminaMm: 4.02,
    productoFertilizante: 'Nitrato de Calcio Soluble',
    dosisKgHa: 15,
    totalFertilizanteKg: 115.5,
    conductividadElectrica: 1.8,
    phSolucion: 6.2,
    operador: 'Juan Pérez',
    observaciones: 'Riego matutino normal en etapa de floración temprana'
  }
];

const INITIAL_POZO: RegistroExtraccionPozo[] = [
  { id: 'poz-1', fecha: '2026-11-01', caudalLps: 35.5, horasOperacion: 8, volumenExtraidoM3: 1022.4, nivelFreaticoM: 14.2, operador: 'Juan Pérez' },
  { id: 'poz-2', fecha: '2026-11-02', caudalLps: 36.0, horasOperacion: 7.5, volumenExtraidoM3: 972.0, nivelFreaticoM: 14.4, operador: 'Juan Pérez' }
];

const INITIAL_MADUREZ: MuestreoMadurez[] = [
  { id: 'm-1', fecha: '2026-04-12', parcelaId: 'c1', parcelaNombre: 'Cuartel 1 - Kiwi Hayward', solidosSolublesBrix: 6.5, firmezaPresionKg: 14.2, colorSemilla: 'Negro 90%', estadoAptoCosecha: true, observaciones: 'Alcanzado umbral mínimo para inicio de cosecha exportación' }
];

const INITIAL_COSECHAS: RegistroCosechaLote[] = [
  { id: 'cos-1', fecha: '2026-04-15', parcelaId: 'c1', parcelaNombre: 'Cuartel 1 - Kiwi Hayward', kilosTotales: 14200, binsTotales: 38, calibrePromedio: '30-33', destinoExportacion: 'Exportadora David Del Curto', responsableCosecha: 'Juan Pérez' }
];

// ==========================================
// COMPONENTE PRINCIPAL APP
// ==========================================

export function App() {
  // ESTADO DE SESIÓN Y LOGIN
  const [currentUser, setCurrentUser] = useState<UsuarioPredio | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginClave, setLoginClave] = useState('');
  const [loginError, setLoginError] = useState('');

  // NAVEGACIÓN COMPLETA
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'labores' | 'ordenes' | 'bodega' | 'riego' | 'pozo' | 'cosecha' | 'clima' | 'fenologia' | 'usuarios'
  >('dashboard');

  // ESTADOS PRINCIPALES DE DATOS
  const [parcelas] = useState<Parcela[]>(INITIAL_PARCELAS);
  const [inventario, setInventario] = useState<InsumoInventario[]>(INITIAL_INVENTARIO);
  const [usuarios, setUsuarios] = useState<UsuarioPredio[]>(INITIAL_USUARIOS);
  const [labores, setLabores] = useState<RegistroLabor[]>(INITIAL_LABORES);
  const [ordenes, setOrdenes] = useState<OrdenTrabajoFitosanitaria[]>(INITIAL_ORDENES);
  const [riegos, setRiegos] = useState<RegistroRiegoSector[]>(INITIAL_RIEGOS);
  const [pozo, setPozo] = useState<RegistroExtraccionPozo[]>(INITIAL_POZO);
  const [madurez, setMadurez] = useState<MuestreoMadurez[]>(INITIAL_MADUREZ);
  const [cosechas, setCosechas] = useState<RegistroCosechaLote[]>(INITIAL_COSECHAS);

  // CONTROL DE CLAVES (SOLO VISIBLE ADMINISTRADOR)
  const [showClavesAdmin, setShowClavesAdmin] = useState<Record<string, boolean>>({});

  // CONTROL MODAL LABOR
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<RegistroLabor | null>(null);

  // ESTADO FORMULARIO USUARIOS (CREAR / EDITAR)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioPredio | null>(null);
  const [userNombre, setUserNombre] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userClave, setUserClave] = useState('');
  const [userRol, setUserRol] = useState<any>('operador');
  const [userRut, setUserRut] = useState('');
  const [userSAG, setUserSAG] = useState('');
  const [userTelefono, setUserTelefono] = useState('');

  // LOGIN LÓGICA
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userFound = usuarios.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.clave === loginClave
    );

    if (userFound) {
      if (userFound.estado === 'inactivo') {
        setLoginError('Su usuario se encuentra inactivo. Contacte al administrador.');
        return;
      }
      setCurrentUser(userFound);
      setLoginError('');
      setActiveTab('dashboard');
    } else {
      setLoginError('Credenciales inválidas. Compruebe el correo y la contraseña ingresados.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginClave('');
  };

  // MANEJO DE LABORES (CUADERNO SAG)
  const handleOpenNewLabor = () => {
    setEditingLabor(null);
    setIsLaborModalOpen(true);
  };

  const handleEditLabor = (labor: RegistroLabor) => {
    setEditingLabor(labor);
    setIsLaborModalOpen(true);
  };

  const handleSaveLabor = (laborGuardar: RegistroLabor) => {
    if (editingLabor) {
      setLabores(labores.map(l => l.id === laborGuardar.id ? laborGuardar : l));
    } else {
      setLabores([laborGuardar, ...labores]);
      
      // Descontar inventario si se especificó insumo y cantidad
      if (laborGuardar.insumoId && laborGuardar.totalInsumoUtilizado) {
        setInventario(prev => prev.map(item => {
          if (item.id === laborGuardar.insumoId) {
            const nuevoStock = Math.max(0, item.stockActual - (laborGuardar.totalInsumoUtilizado || 0));
            return { ...item, stockActual: Number(nuevoStock.toFixed(2)) };
          }
          return item;
        }));
      }
    }
    setIsLaborModalOpen(false);
    setEditingLabor(null);
  };

  const handleDeleteLabor = (id: string) => {
    if (window.confirm('¿Confirma eliminar este registro del Cuaderno de Labores?')) {
      setLabores(labores.filter(l => l.id !== id));
    }
  };

  // MANEJO DE ÓRDENES DE TRABAJO (RECETAS SAG)
  const handleAddOrden = (nuevaOrden: OrdenTrabajoFitosanitaria) => {
    setOrdenes([nuevaOrden, ...ordenes]);
  };

  const handleUpdateOrden = (ordenActualizada: OrdenTrabajoFitosanitaria) => {
    setOrdenes(ordenes.map(o => o.id === ordenActualizada.id ? ordenActualizada : o));
  };

  const handleDeleteOrden = (ordenId: string) => {
    if (window.confirm('¿Eliminar esta receta fitosanitaria?')) {
      setOrdenes(ordenes.filter(o => o.id !== ordenId));
    }
  };

  const handleExecuteOrden = (ordenId: string, aplicadorNombre: string, firma: string) => {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;

    // Descontar stock de todos los productos de la receta
    if (!orden.descontadoInventario && orden.productos) {
      setInventario(prev => {
        let actual = [...prev];
        orden.productos.forEach(prod => {
          if (prod.insumoId) {
            actual = actual.map(item => {
              if (item.id === prod.insumoId) {
                const nStock = Math.max(0, item.stockActual - (prod.totalProductoRequerido || 0));
                return { ...item, stockActual: Number(nStock.toFixed(2)) };
              }
              return item;
            });
          }
        });
        return actual;
      });
    }

    // Registrar automáticamente en el Cuaderno SAG
    const productosNombres = (orden.productos || []).map(p => p.productoComercial).join(', ');
    const nuevaLaborDesdeOrden: RegistroLabor = {
      id: `lab-ot-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      parcelaId: orden.parcelaIds[0] || 'general',
      parcelaNombre: orden.parcelaNombres,
      tipoLabor: 'Aplicacion Fitosanitaria',
      descripcion: `[Ejecución OT ${orden.numeroOrden}] ${orden.plagaObjetivo}`,
      operadorNombre: aplicadorNombre,
      insumoNombre: productosNombres,
      observaciones: `Receta ${orden.numeroOrden} confirmada. Firma aplicador: ${firma}`
    };

    setLabores(prev => [nuevaLaborDesdeOrden, ...prev]);

    setOrdenes(ordenes.map(o => {
      if (o.id === ordenId) {
        return {
          ...o,
          estado: 'completada',
          descontadoInventario: true,
          aplicadorFirma: firma,
          aplicadorAsignadoNombre: aplicadorNombre
        };
      }
      return o;
    }));
  };

  // MANEJO BODEGA
  const handleAddInsumo = (nuevo: InsumoInventario) => {
    setInventario([...inventario, nuevo]);
  };

  const handleUpdateInsumo = (editado: InsumoInventario) => {
    setInventario(inventario.map(i => i.id === editado.id ? editado : i));
  };

  const handleDeleteInsumo = (id: string) => {
    if (window.confirm('¿Eliminar producto de bodega?')) {
      setInventario(inventario.filter(i => i.id !== id));
    }
  };

  // GESTIÓN DE USUARIOS (SOLO ADMINISTRADOR)
  const openNewUserModal = () => {
    setEditingUser(null);
    setUserNombre('');
    setUserEmail('');
    setUserClave('');
    setUserRol('operador');
    setUserRut('');
    setUserSAG('');
    setUserTelefono('');
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u: UsuarioPredio) => {
    setEditingUser(u);
    setUserNombre(u.nombre);
    setUserEmail(u.email);
    setUserClave(u.clave || '');
    setUserRol(u.rol);
    setUserRut(u.rutIdentificacion || '');
    setUserSAG(u.numeroRegistroSAG || '');
    setUserTelefono(u.telefono || '');
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsuarios(usuarios.map(u => u.id === editingUser.id ? {
        ...u,
        nombre: userNombre,
        email: userEmail,
        clave: userClave,
        rol: userRol,
        rutIdentificacion: userRut || undefined,
        numeroRegistroSAG: userSAG || undefined,
        telefono: userTelefono || undefined
      } : u));
    } else {
      const nuevoUsuario: UsuarioPredio = {
        id: `usr-${Date.now()}`,
        nombre: userNombre,
        email: userEmail,
        clave: userClave,
        rol: userRol,
        rutIdentificacion: userRut || undefined,
        numeroRegistroSAG: userSAG || undefined,
        telefono: userTelefono || undefined,
        estado: 'activo',
        fechaAlta: new Date().toISOString().slice(0, 10),
        avatarColor: 'bg-emerald-800'
      };
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    setIsUserModalOpen(false);
  };

  const toggleUserEstado = (userId: string) => {
    setUsuarios(usuarios.map(u => {
      if (u.id === userId) {
        return { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' };
      }
      return u;
    }));
  };

  // PANTALLA LOGIN SI NO HAY SESIÓN ACTIVA
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-stone-800 border border-stone-700 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-900 text-emerald-300 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Sprout className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Fundo La Cabaña</h1>
            <p className="text-stone-400 text-xs">Sistema Agrícola Integral · 100% Kiwi Hayward</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-red-950/90 border border-red-700 text-red-200 rounded-xl text-center font-semibold">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-stone-300 font-bold mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                placeholder="admin@fundolacabana.cl"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-3 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1">Contraseña Personal</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginClave}
                onChange={(e) => setLoginClave(e.target.value)}
                className="w-full p-3 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 font-bold text-white rounded-xl shadow-lg transition-all cursor-pointer text-sm"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="pt-4 border-t border-stone-700/60 text-center text-[11px] text-stone-400">
            <p>Acceso seguro administrado por rol y firma digital.</p>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.rol === 'administrador';

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      
      {/* NAVBAR SUPERIOR CON TODAS LAS PESTAÑAS */}
      <header className="bg-emerald-950 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 rounded-xl">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight">Fundo La Cabaña</h1>
              <p className="text-[10px] text-emerald-300">100% Kiwi Hayward · Cuaderno SAG</p>
            </div>
          </div>

          {/* MENÚ DE TODAS LAS PESTAÑAS */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Inicio
            </button>

            <button
              onClick={() => setActiveTab('labores')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'labores' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Sprout className="w-4 h-4" /> Labores
            </button>

            <button
              onClick={() => setActiveTab('ordenes')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ordenes' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <FileText className="w-4 h-4" /> Recetas SAG
            </button>

            <button
              onClick={() => setActiveTab('bodega')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bodega' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Package className="w-4 h-4" /> Bodega ({inventario.length})
            </button>

            <button
              onClick={() => setActiveTab('riego')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'riego' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Droplet className="w-4 h-4" /> Riego
            </button>

            <button
              onClick={() => setActiveTab('pozo')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pozo' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Waves className="w-4 h-4" /> Pozo
            </button>

            <button
              onClick={() => setActiveTab('cosecha')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cosecha' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Apple className="w-4 h-4" /> Cosecha
            </button>

            <button
              onClick={() => setActiveTab('clima')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'clima' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Sun className="w-4 h-4" /> Clima
            </button>

            <button
              onClick={() => setActiveTab('fenologia')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'fenologia' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Activity className="w-4 h-4" /> Fenología
            </button>

            {/* PESTAÑA ADMINISTRACIÓN DE USUARIOS (SOLO ADMIN) */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer border border-emerald-700 ${
                  activeTab === 'usuarios' ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-900/60'
                }`}
              >
                <Users className="w-4 h-4" /> Usuarios
              </button>
            )}
          </nav>

          {/* BOTÓN NUEVA LABOR Y PERFIL */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNewLabor}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> + Nueva Labor
            </button>

            <div className="text-right hidden sm:block border-l border-emerald-800 pl-3">
              <span className="block text-xs font-bold leading-tight">{currentUser.nombre}</span>
              <span className="block text-[10px] text-emerald-300 capitalize">{currentUser.rol}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 bg-emerald-900 hover:bg-red-800 text-white rounded-xl transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* NAVEGACIÓN MÓVIL */}
      <div className="lg:hidden flex bg-emerald-900 text-white border-b border-emerald-800 overflow-x-auto p-2 gap-1 text-xs font-bold">
        <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-emerald-700' : ''}`}>Inicio</button>
        <button onClick={() => setActiveTab('labores')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'labores' ? 'bg-emerald-700' : ''}`}>Labores</button>
        <button onClick={() => setActiveTab('ordenes')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'ordenes' ? 'bg-emerald-700' : ''}`}>Recetas</button>
        <button onClick={() => setActiveTab('bodega')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'bodega' ? 'bg-emerald-700' : ''}`}>Bodega</button>
        <button onClick={() => setActiveTab('riego')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'riego' ? 'bg-emerald-700' : ''}`}>Riego</button>
        <button onClick={() => setActiveTab('pozo')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'pozo' ? 'bg-emerald-700' : ''}`}>Pozo</button>
        <button onClick={() => setActiveTab('cosecha')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'cosecha' ? 'bg-emerald-700' : ''}`}>Cosecha</button>
        <button onClick={() => setActiveTab('clima')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'clima' ? 'bg-emerald-700' : ''}`}>Clima</button>
        <button onClick={() => setActiveTab('fenologia')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'fenologia' ? 'bg-emerald-700' : ''}`}>Fenología</button>
        {isAdmin && (
          <button onClick={() => setActiveTab('usuarios')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'usuarios' ? 'bg-emerald-700' : ''}`}>Usuarios</button>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">

        {/* 1. DASHBOARD COMPLETO */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 text-xs">
            <div className="p-6 bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-2xl shadow-md">
              <h2 className="text-xl font-bold">Bienvenido, {currentUser.nombre}</h2>
              <p className="text-emerald-200 mt-1">Panel de control de operaciones agronómicas — Fundo La Cabaña (Temporada 2026)</p>
            </div>

            {/* TARJETAS KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-stone-500 font-bold uppercase text-[10px]">Superficie Hayward</span>
                <div className="text-2xl font-extrabold text-stone-900">13.1 Ha</div>
                <span className="text-stone-400 text-[11px]">3 Cuarteles productivos</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-stone-500 font-bold uppercase text-[10px]">Inventario Bodega</span>
                <div className="text-2xl font-extrabold text-stone-900">{inventario.length} Productos</div>
                <span className="text-emerald-700 font-semibold text-[11px]">Control de stock activo</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-stone-500 font-bold uppercase text-[10px]">Cuaderno SAG</span>
                <div className="text-2xl font-extrabold text-stone-900">{labores.length} Labores</div>
                <span className="text-stone-400 text-[11px]">Registro cronológico oficial</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-stone-500 font-bold uppercase text-[10px]">Recetas / Órdenes</span>
                <div className="text-2xl font-extrabold text-stone-900">{ordenes.length} Emitidas</div>
                <span className="text-amber-700 font-semibold text-[11px]">Descuento automático bodega</span>
              </div>
            </div>

            {/* RESUMEN DE CUARTELES */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">Resumen de Cuarteles Productivos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {parcelas.map(p => (
                  <div key={p.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900 block">{p.nombre}</span>
                    <span className="text-stone-600 block text-[11px]">Superficie: <strong>{p.superficieHa} ha</strong></span>
                    <span className="text-stone-500 block text-[10px]">Plantación: {p.anoPlantacion} ({p.variedad})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. LABORES Y CUADERNO SAG */}
        {activeTab === 'labores' && (
          <LaboresView
            labores={labores}
            parcelas={parcelas}
            inventario={inventario}
            usuarios={usuarios}
            onOpenNewLabor={handleOpenNewLabor}
            onEditLabor={handleEditLabor}
            onDeleteLabor={handleDeleteLabor}
          />
        )}

        {/* 3. RECETAS SAG / ÓRDENES DE TRABAJO */}
        {activeTab === 'ordenes' && (
          <OrdenesTrabajoView
            ordenes={ordenes}
            parcelas={parcelas}
            inventario={inventario}
            usuarios={usuarios}
            activeUser={currentUser}
            onAddOrden={handleAddOrden}
            onUpdateOrden={handleUpdateOrden}
            onExecuteOrden={handleExecuteOrden}
            onDeleteOrden={handleDeleteOrden}
          />
        )}

        {/* 4. BODEGA DE INSUMOS */}
        {activeTab === 'bodega' && (
          <BodegaView
            inventario={inventario}
            onAddInsumo={handleAddInsumo}
            onUpdateInsumo={handleUpdateInsumo}
            onDeleteInsumo={handleDeleteInsumo}
          />
        )}

        {/* 5. GESTIÓN COMPLETA DE RIEGO Y FERTIRRIEGO */}
        {activeTab === 'riego' && (
          <div className="space-y-6 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Droplet className="w-6 h-6 text-blue-600" /> Control de Riego y Fertirriego
                </h1>
                <p className="text-stone-500 text-[11px]">
                  Monitoreo de lámina aplicada (mm), horas de pulso, m³ consumidos e inyección NPK.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {riegos.map(r => (
                <div key={r.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold text-stone-900 text-sm">{r.sectorDestino} ({r.superficieHa} ha)</span>
                    <span className="font-mono text-stone-500">{r.fecha} — {r.horaInicio} hrs</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>Tipo: <strong>{r.tipoRiego}</strong></div>
                    <div>Duración: <strong>{r.duracionHoras} hrs</strong></div>
                    <div>Volumen: <strong>{r.volumenM3} m³</strong></div>
                    <div>Lámina: <strong>{r.laminaMm} mm</strong></div>
                  </div>
                  {r.productoFertilizante && (
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-950 font-mono text-[11px]">
                      Fertilizante: <strong>{r.productoFertilizante}</strong> ({r.dosisKgHa} kg/ha) — Total: {r.totalFertilizanteKg} kg
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. GESTIÓN COMPLETA DE POZO PROFUNDO */}
        {activeTab === 'pozo' && (
          <div className="space-y-6 text-xs">
            <div className="pb-2 border-b">
              <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Waves className="w-6 h-6 text-cyan-600" /> Extracción Pozo Profundo
              </h1>
              <p className="text-stone-500 text-[11px]">
                Registro de caudales de extracción (L/s) y monitoreo de niveles freáticos.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b text-stone-600 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Caudal (L/s)</th>
                    <th className="p-3">Horas Operación</th>
                    <th className="p-3">Volumen Extraído (m³)</th>
                    <th className="p-3">Nivel Freático (m)</th>
                    <th className="p-3">Operador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {pozo.map(p => (
                    <tr key={p.id}>
                      <td className="p-3 font-mono font-bold">{p.fecha}</td>
                      <td className="p-3 font-mono">{p.caudalLps} L/s</td>
                      <td className="p-3 font-mono">{p.horasOperacion} hrs</td>
                      <td className="p-3 font-mono font-bold text-emerald-900">{p.volumenExtraidoM3} m³</td>
                      <td className="p-3 font-mono text-cyan-900">{p.nivelFreaticoM} m</td>
                      <td className="p-3 font-semibold">{p.operador}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. COSECHA Y MUESTREO DE MADUREZ */}
        {activeTab === 'cosecha' && (
          <div className="space-y-6 text-xs">
            <div className="pb-2 border-b">
              <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Apple className="w-6 h-6 text-purple-700" /> Muestreo de Madurez & Cosecha
              </h1>
              <p className="text-stone-500 text-[11px]">
                Seguimiento de °Brix, presión de fruta (kg) y recepción de bins recolectados.
              </p>
            </div>

            {/* MUESTREOS */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">Últimos Muestreos de Madurez (°Brix)</h3>
              {madurez.map(m => (
                <div key={m.id} className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex justify-between items-center">
                  <div>
                    <strong className="text-purple-950 block">{m.parcelaNombre}</strong>
                    <span className="text-purple-800 text-[11px] font-mono">°Brix: {m.solidosSolublesBrix} — Presión: {m.firmezaPresionKg} kg</span>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-900 text-white font-bold rounded-lg text-[10px]">
                    {m.estadoAptoCosecha ? '✓ APTO COSECHA' : 'PENDIENTE'}
                  </span>
                </div>
              ))}
            </div>

            {/* REGISTRO DE COSECHAS */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">Lotes de Cosecha Entregados</h3>
              <div className="space-y-2">
                {cosechas.map(c => (
                  <div key={c.id} className="p-3 bg-stone-50 rounded-xl border flex justify-between items-center font-mono">
                    <div>
                      <strong className="text-stone-900 block font-sans">{c.parcelaNombre}</strong>
                      <span className="text-stone-500 text-[11px]">Bins: {c.binsTotales} — Calibre: {c.calibrePromedio}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-900 text-sm block">{c.kilosTotales} kg</span>
                      <span className="text-[10px] text-stone-400 font-sans">{c.destinoExportacion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. CLIMA Y HORAS FRÍO */}
        {activeTab === 'clima' && (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" /> Estación Meteorológica & Horas Frío
            </h2>
            <p className="text-stone-600">
              Monitoreo en tiempo real de temperatura, radiación UV, alertas de heladas y acumulación de horas frío para la variedad Hayward.
            </p>
          </div>
        )}

        {/* 9. FENOLOGÍA Y POLINIZACIÓN */}
        {activeTab === 'fenologia' && (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" /> Seguimiento Fenológico & Polinización
            </h2>
            <p className="text-stone-600">
              Control de etapas fenológicas (Brotación, Floración, Cuaja) y densidad de colmenas de abejas por hectárea.
            </p>
          </div>
        )}

        {/* 10. ADMINISTRACIÓN DE USUARIOS Y GESTIÓN DE CONTRASEÑAS (SOLO ADMINISTRADOR) */}
        {activeTab === 'usuarios' && isAdmin && (
          <div className="space-y-6 text-xs">
            <div className="p-5 bg-emerald-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-300" /> Administración de Usuarios y Claves Personales
                </h2>
                <p className="text-emerald-200 text-[11px] mt-0.5">
                  Módulo reservado para el Administrador. Permite ver, asignar y modificar las contraseñas de cada operador o agrónomo.
                </p>
              </div>

              <button
                onClick={openNewUserModal}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Registrar Usuario
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Nombre & RUT</th>
                      <th className="p-3">Correo</th>
                      <th className="p-3">Rol</th>
                      <th className="p-3">Registro SAG</th>
                      <th className="p-3">Contraseña Personal</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {usuarios.map((u) => {
                      const isVisible = showClavesAdmin[u.id];
                      return (
                        <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-3">
                            <strong className="font-bold text-stone-900 block text-xs">{u.nombre}</strong>
                            <span className="text-[10px] text-stone-400 font-mono">{u.rutIdentificacion || 'Sin RUT'}</span>
                          </td>

                          <td className="p-3 text-stone-700 font-mono">{u.email}</td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-stone-100 text-stone-800 border">
                              {u.rol}
                            </span>
                          </td>

                          <td className="p-3 font-mono text-stone-600">{u.numeroRegistroSAG || 'N/A'}</td>

                          <td className="p-3 font-mono font-bold">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-950 bg-stone-100 px-2 py-1 rounded border min-w-[90px] text-center">
                                {isVisible ? u.clave : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowClavesAdmin(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                                className="text-stone-400 hover:text-stone-700 cursor-pointer"
                                title={isVisible ? 'Ocultar contraseña' : 'Ver contraseña'}
                              >
                                {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>

                          <td className="p-3">
                            <button
                              onClick={() => toggleUserEstado(u.id)}
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] cursor-pointer transition-colors ${
                                u.estado === 'activo' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'
                              }`}
                            >
                              {u.estado === 'activo' ? '✓ Activo' : '✕ Inactivo'}
                            </button>
                          </td>

                          <td className="p-3 text-center">
                            <button
                              onClick={() => openEditUserModal(u)}
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="Editar usuario"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL NUEVA / EDITAR LABOR */}
      {isLaborModalOpen && (
        <ModalLabor
          isOpen={isLaborModalOpen}
          labor={editingLabor}
          parcelas={parcelas}
          inventario={inventario}
          usuarios={usuarios}
          activeUserId={currentUser.id}
          onSave={handleSaveLabor}
          onClose={() => {
            setIsLaborModalOpen(false);
            setEditingLabor(null);
          }}
        />
      )}

      {/* MODAL GESTIÓN USUARIO (CREAR / EDITAR) */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-stone-200">
            <div className="px-6 py-4 border-b bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-300" />
                {editingUser ? 'Editar Usuario & Permisos' : 'Registrar Nuevo Usuario'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={userNombre}
                  onChange={(e) => setUserNombre(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Contraseña Personal *</label>
                  <input
                    type="text"
                    required
                    value={userClave}
                    onChange={(e) => setUserClave(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Rol de Usuario *</label>
                  <select
                    value={userRol}
                    onChange={(e) => setUserRol(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white font-bold"
                  >
                    <option value="operador">Operador / Aplicador</option>
                    <option value="agronomo">Agrónomo Asesor</option>
                    <option value="administrador">Administrador</option>
                    <option value="consultor">Consultor Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">N° Registro SAG</label>
                  <input
                    type="text"
                    value={userSAG}
                    onChange={(e) => setUserSAG(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono"
                    placeholder="Ej: APL-SAG-3312"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">RUT / Identificación</label>
                  <input
                    type="text"
                    value={userRut}
                    onChange={(e) => setUserRut(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={userTelefono}
                    onChange={(e) => setUserTelefono(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border rounded-lg cursor-pointer hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg cursor-pointer hover:bg-emerald-700"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
