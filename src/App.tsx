import React, { useState } from 'react';
import { 
  Sprout, 
  Package, 
  FileText, 
  Plus, 
  Users, 
  LogOut, 
  Waves, 
  Droplet, 
  Sun, 
  Apple, 
  LayoutDashboard, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Activity, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Lock,
  Mail,
  UserCheck,
  TrendingUp,
  BarChart3,
  Calendar,
  Check,
  Clock
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
  RegistroCosechaLote 
} from './types/campo';

import { LaboresView } from './components/LaboresView';
import { BodegaView } from './components/BodegaView';
import { OrdenesTrabajoView } from './components/OrdenesTrabajoView';
import { ModalLabor } from './components/ModalLabor';

// ==========================================
// DATOS INICIALES DEL PREDIO
// ==========================================

const INITIAL_PARCELAS: Parcela[] = [
  { id: 'c1', nombre: 'Cuartel 1 - Kiwi Hayward', superficieHa: 2.8, variedad: 'Kiwi Hayward', anoPlantacion: 2015, descripcion: 'Suelo franco arcilloso, riego por goteo doble línea' },
  { id: 'c2', nombre: 'Cuartel 2 - Kiwi Hayward', superficieHa: 4.9, variedad: 'Kiwi Hayward', anoPlantacion: 2017, descripcion: 'Suelo franco profundo, cobertura vegetal interhilera' },
  { id: 'c3', nombre: 'Cuartel 3 - Kiwi Hayward Formacion', superficieHa: 5.4, variedad: 'Kiwi Hayward', anoPlantacion: 2021, descripcion: 'Plantación joven en estructura T-Bar' }
];

const INITIAL_INVENTARIO: InsumoInventario[] = [
  { id: 'ins-1', nombreComercial: 'Cobre Hidróxido 50 WP', materiaActiva: 'Hidróxido de Cobre', categoria: 'Fungicida y Bactericida', stockActual: 45, unidad: 'kg', numeroRegistroSAG: '1234-SAG', destinoEspecifico: 'Kiwis' },
  { id: 'ins-2', nombreComercial: 'Spirotetramat 240 SC', materiaActiva: 'Spirotetramat', categoria: 'Insecticida', stockActual: 4, unidad: 'L', numeroRegistroSAG: '5678-SAG', destinoEspecifico: 'Kiwis' },
  { id: 'ins-3', nombreComercial: 'Nitrato de Calcio Soluble', materiaActiva: 'Nitrato de Calcio', categoria: 'Fertilizante', stockActual: 500, unidad: 'kg', composicionQuimica: '15.5% N + 26.5% CaO', formaFertilizante: 'Granulado', solubilidad: 'Soluble', destinoEspecifico: 'Kiwis' },
  { id: 'ins-4', nombreComercial: 'Glifosato 480 SL', materiaActiva: 'Glifosato', categoria: 'Herbicida', stockActual: 30, unidad: 'L', numeroRegistroSAG: '9912-SAG', destinoEspecifico: 'Uso General' }
];

const INITIAL_USUARIOS: UsuarioPredio[] = [
  { 
    id: 'usr-1', 
    nombre: 'Diego Pereira Ramirez', 
    email: 'admin@fundolacabana.cl', 
    clave: 'admin123', 
    rol: 'administrador', 
    rutIdentificacion: '15.432.890-K',
    numeroRegistroSAG: 'SAG-8921-CL', 
    estado: 'activo', 
    fechaAlta: '2025-01-01',
    telefono: '+56 9 8765 4321'
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
    telefono: '+56 9 1234 5678'
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
    observaciones: 'Aplicado con pulverizadora 2000L'
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
    plagaObjetivo: 'Control Fitosanitario / Preventivo',
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
    eppObligatorio: ['Máscara respiratoria', 'Buzo impermeable', 'Guantes nitrilo'],
    condicionesClimaticasRequeridas: 'Viento menor a 10 km/h',
    agronomoEmisorId: 'usr-1',
    agronomoEmisorNombre: 'Diego Pereira Ramirez',
    agronomoRegistroSAG: 'SAG-8921-CL',
    agronomoFirmaDigital: 'FIRMADO DIGITALMENTE',
    aplicadorAsignadoId: 'usr-2',
    aplicadorAsignadoNombre: 'Juan Pérez',
    maquinariaTractor: 'Tractor John Deere + Pulverizadora 2000L',
    descontadoInventario: false
  }
];

export function App() {
  // AUTENTICACIÓN
  const [currentUser, setCurrentUser] = useState<UsuarioPredio | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginClave, setLoginClave] = useState('');
  const [loginError, setLoginError] = useState('');

  // NAVEGACIÓN
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'labores' | 'ordenes' | 'bodega' | 'riego' | 'pozo' | 'cosecha' | 'clima' | 'fenologia' | 'usuarios'
  >('dashboard');

  // ESTADOS PRINCIPALES DE DATOS (PERMITEN EDICIÓN Y CREACIÓN)
  const [parcelas] = useState<Parcela[]>(INITIAL_PARCELAS);
  const [inventario, setInventario] = useState<InsumoInventario[]>(INITIAL_INVENTARIO);
  const [usuarios, setUsuarios] = useState<UsuarioPredio[]>(INITIAL_USUARIOS);
  const [labores, setLabores] = useState<RegistroLabor[]>(INITIAL_LABORES);
  const [ordenes, setOrdenes] = useState<OrdenTrabajoFitosanitaria[]>(INITIAL_ORDENES);
  
  // MODALES Y ENTRADAS DINÁMICAS
  const [riegos, setRiegos] = useState<RegistroRiegoSector[]>([
    { id: 'r1', fecha: '2026-11-04', horaInicio: '08:00', sectorDestino: 'Cuartel 1', superficieHa: 2.8, tipoRiego: 'Fertirriego', fuenteAgua: 'Pozo profundo', duracionHoras: 4, volumenM3: 280, litrosTotales: 280000, laminaMm: 10, operador: 'Juan Pérez' }
  ]);
  const [pozo, setPozo] = useState<RegistroExtraccionPozo[]>([
    { id: 'p1', fecha: '2026-11-04', caudalLps: 35.5, horasOperacion: 8, volumenExtraidoM3: 1022.4, nivelFreaticoM: 14.2, operador: 'Juan Pérez' }
  ]);
  const [cosechas, setCosechas] = useState<RegistroCosechaLote[]>([
    { id: 'cos-1', fecha: '2026-04-15', parcelaId: 'c1', parcelaNombre: 'Cuartel 1 - Kiwi Hayward', kilosTotales: 14200, binsTotales: 38, calibrePromedio: '30-33', destinoExportacion: 'David Del Curto', responsableCosecha: 'Juan Pérez' }
  ]);

  // MOSTRAR CLAVES EN TABLA DE USUARIOS
  const [showClavesAdmin, setShowClavesAdmin] = useState<Record<string, boolean>>({});

  // CONTROL MODAL DE LABORES
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<RegistroLabor | null>(null);

  // CONTROL MODAL GESTIÓN DE USUARIOS (CRUD COMPLETO)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioPredio | null>(null);
  const [userNombre, setUserNombre] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userClave, setUserClave] = useState('');
  const [userRol, setUserRol] = useState<any>('operador');
  const [userRut, setUserRut] = useState('');
  const [userSAG, setUserSAG] = useState('');
  const [userTelefono, setUserTelefono] = useState('');

  // FORMULARIOS DINÁMICOS RÁPIDOS (RIEGO, POZO, COSECHA)
  const [showRiegoModal, setShowRiegoModal] = useState(false);
  const [riegoSector, setRiegoSector] = useState('Cuartel 1 - Kiwi Hayward');
  const [riegoHoras, setRiegoHoras] = useState(4);
  const [riegoM3, setRiegoM3] = useState(250);

  const [showPozoModal, setShowPozoModal] = useState(false);
  const [pozoHoras, setPozoHoras] = useState(8);
  const [pozoCaudal, setPozoCaudal] = useState(35);

  const [showCosechaModal, setShowCosechaModal] = useState(false);
  const [cosechaKilos, setCosechaKilos] = useState(5000);
  const [cosechaBins, setCosechaBins] = useState(14);
  const [cosechaCalibre, setCosechaCalibre] = useState('30-33');

  // FUNCIONES DE AUTENTICACIÓN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userFound = usuarios.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.clave === loginClave
    );

    if (userFound) {
      if (userFound.estado === 'inactivo') {
        setLoginError('Usuario desactivado por la administración.');
        return;
      }
      setCurrentUser(userFound);
      setLoginError('');
      setActiveTab('dashboard');
    } else {
      setLoginError('Credenciales incorrectas. Verifique su correo y clave.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginClave('');
  };

  // FUNCIONES GESTIÓN DE USUARIOS (CREAR, EDITAR, ELIMINAR)
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
        fechaAlta: new Date().toISOString().slice(0, 10)
      };
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('No puedes eliminar tu propia cuenta activa.');
      return;
    }
    if (window.confirm('¿Estás seguro de eliminar permanentemente este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== userId));
    }
  };

  const toggleUserEstado = (userId: string) => {
    setUsuarios(usuarios.map(u => u.id === userId ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' } : u));
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
    if (window.confirm('¿Eliminar este registro de labor?')) {
      setLabores(labores.filter(l => l.id !== id));
    }
  };

  // MANEJO DE ÓRDENES Y BODEGA
  const handleAddOrden = (nueva: OrdenTrabajoFitosanitaria) => setOrdenes([nueva, ...ordenes]);
  const handleUpdateOrden = (editada: OrdenTrabajoFitosanitaria) => setOrdenes(ordenes.map(o => o.id === editada.id ? editada : o));
  const handleDeleteOrden = (id: string) => window.confirm('¿Eliminar orden?') && setOrdenes(ordenes.filter(o => o.id !== id));

  const handleExecuteOrden = (ordenId: string, aplicadorNombre: string, firma: string) => {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;
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

    const nuevaLabor: RegistroLabor = {
      id: `lab-ot-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      parcelaId: orden.parcelaIds[0] || 'general',
      parcelaNombre: orden.parcelaNombres,
      tipoLabor: 'Aplicacion Fitosanitaria',
      descripcion: `[Receta ${orden.numeroOrden}] ${orden.plagaObjetivo}`,
      operadorNombre: aplicadorNombre,
      insumoNombre: (orden.productos || []).map(p => p.productoComercial).join(', '),
      observaciones: `Orden ${orden.numeroOrden} completada. Firma: ${firma}`
    };
    setLabores(prev => [nuevaLabor, ...prev]);
    setOrdenes(ordenes.map(o => o.id === ordenId ? { ...o, estado: 'completada', descontadoInventario: true, aplicadorFirma: firma } : o));
  };

  const handleAddInsumo = (nuevo: InsumoInventario) => setInventario([...inventario, nuevo]);
  const handleUpdateInsumo = (editado: InsumoInventario) => setInventario(inventario.map(i => i.id === editado.id ? editado : i));
  const handleDeleteInsumo = (id: string) => window.confirm('¿Eliminar insumo?') && setInventario(inventario.filter(i => i.id !== id));

  // AGREGAR REGISTROS DE RIEGO, POZO Y COSECHA
  const handleAddRiego = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: RegistroRiegoSector = {
      id: `r-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      horaInicio: '08:30',
      sectorDestino: riegoSector,
      superficieHa: 4.9,
      tipoRiego: 'Fertirriego',
      fuenteAgua: 'Pozo Profundo',
      duracionHoras: Number(riegoHoras),
      volumenM3: Number(riegoM3),
      litrosTotales: Number(riegoM3) * 1000,
      laminaMm: Number((Number(riegoM3) / 49).toFixed(1)),
      operador: currentUser?.nombre || 'Juan Pérez'
    };
    setRiegos([nuevo, ...riegos]);
    setShowRiegoModal(false);
  };

  const handleAddPozo = (e: React.FormEvent) => {
    e.preventDefault();
    const vol = Math.round(Number(pozoCaudal) * 3.6 * Number(pozoHoras));
    const nuevo: RegistroExtraccionPozo = {
      id: `p-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      caudalLps: Number(pozoCaudal),
      horasOperacion: Number(pozoHoras),
      volumenExtraidoM3: vol,
      nivelFreaticoM: 14.5,
      operador: currentUser?.nombre || 'Juan Pérez'
    };
    setPozo([nuevo, ...pozo]);
    setShowPozoModal(false);
  };

  const handleAddCosecha = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: RegistroCosechaLote = {
      id: `cos-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      parcelaId: 'c1',
      parcelaNombre: 'Cuartel 1 - Kiwi Hayward',
      kilosTotales: Number(cosechaKilos),
      binsTotales: Number(cosechaBins),
      calibrePromedio: cosechaCalibre,
      destinoExportacion: 'Exportadora La Cabaña',
      responsableCosecha: currentUser?.nombre || 'Juan Pérez'
    };
    setCosechas([nuevo, ...cosechas]);
    setShowCosechaModal(false);
  };

  // LOGIN SCREEN SI NO ESTÁ LOGUEADO
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl"></div>

        <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-800 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/50">
              <Sprout className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Fundo La Cabaña</h1>
            <p className="text-stone-400 text-xs">Sistema Agrícola de Alta Gama · 100% Kiwi Hayward</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 rounded-2xl text-center font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-stone-300 font-bold mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@fundolacabana.cl"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1.5">Contraseña Personal</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginClave}
                  onChange={(e) => setLoginClave(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-2xl shadow-xl transition-all cursor-pointer text-xs uppercase tracking-wider active:scale-98"
            >
              Iniciar Sesión Fundo La Cabaña
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800/80 text-center text-[11px] text-stone-500">
            Acceso seguro administrado por roles y contraseñas individuales.
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.rol === 'administrador';
  const lowStockItems = inventario.filter(i => i.stockActual <= 5);
  const ordenesPendientesCount = ordenes.filter(o => o.estado === 'emitida').length;
  const totalKilosCosechados = cosechas.reduce((sum, c) => sum + c.kilosTotales, 0);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      
      {/* HEADER PREMIUM */}
      <header className="bg-stone-950 text-white sticky top-0 z-40 shadow-xl border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-2xl shadow-md">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base leading-tight tracking-tight">Fundo La Cabaña</h1>
              <p className="text-[10px] text-emerald-400 font-medium">100% Kiwi Hayward · Cuaderno SAG</p>
            </div>
          </div>

          {/* MENÚ SUPERIOR DE PESTAÑAS */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <button onClick={() => setActiveTab('dashboard')} className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'bg-emerald-700 text-white shadow-md' : 'text-stone-300 hover:bg-stone-900'}`}>
              <LayoutDashboard className="w-4 h-4" /> Inicio
            </button>
            <button onClick={() => setActiveTab('labores')} className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'labores' ? 'bg-emerald-700 text-white shadow-md' : 'text-stone-300 hover:bg-stone-900'}`}>
              <Sprout className="w-4 h-4" /> Labores
            </button>
            <button onClick={() => setActiveTab('ordenes')} className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'ordenes' ? 'bg-emerald-700 text-white shadow-md' : 'text-stone-300 hover:bg-stone-900'}`}>
              <FileText className="w-4 h-4" /> Recetas SAG
            </button>
            <button onClick={() => setActiveTab('bodega')} className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'bodega' ? 'bg-emerald-700 text-white shadow-md' : 'text-stone-300 hover:bg-stone-900'}`}>
              <Package className="w-4 h-4" /> Bodega ({inventario.length})
            </button>
            <button onClick={() => setActiveTab('riego')} className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'riego' ? 'bg-emerald-700 text-white shadow-md' : 'text-stone-300 hover:bg-stone-900'}`}>
              <Droplet className="w-4 h-4" /> Riego
            </button>
            <button onClick={() => setActiveTab('pozo')} className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'pozo' ? 'bg-emerald-700 text-white shadow-md' : 'text-stone-300 hover:bg-stone-900'}`}>
              <Waves className="w-4 h-4" /> Pozo
            </button>
            <button onClick={() => setActiveTab('cosecha')} className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'cosecha' ? 'bg-emerald-700 text-white shadow-md' : 'text-stone-300 hover:bg-stone-900'}`}>
              <Apple className="w-4 h-4" /> Cosecha
            </button>
            {isAdmin && (
              <button onClick={() => setActiveTab('usuarios')} className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-600/40 ${activeTab === 'usuarios' ? 'bg-emerald-700 text-white shadow-md' : 'text-emerald-300 hover:bg-stone-900'}`}>
                <Users className="w-4 h-4" /> Usuarios & Claves
              </button>
            )}
          </nav>

          {/* PERFIL */}
          <div className="flex items-center gap-3">
            <button onClick={handleOpenNewLabor} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <Plus className="w-4 h-4" /> Nueva Labor
            </button>
            <div className="text-right hidden sm:block border-l border-stone-800 pl-3">
              <span className="block text-xs font-bold leading-tight">{currentUser.nombre}</span>
              <span className="block text-[10px] text-emerald-400 font-semibold uppercase">{currentUser.rol}</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-stone-900 hover:bg-red-900 text-stone-300 hover:text-white rounded-xl transition-colors cursor-pointer" title="Cerrar sesión">
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* MENÚ MÓVIL */}
      <div className="lg:hidden flex bg-stone-900 text-white border-b border-stone-800 overflow-x-auto p-2 gap-1 text-xs font-bold">
        <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-emerald-700' : ''}`}>Inicio</button>
        <button onClick={() => setActiveTab('labores')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'labores' ? 'bg-emerald-700' : ''}`}>Labores</button>
        <button onClick={() => setActiveTab('ordenes')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'ordenes' ? 'bg-emerald-700' : ''}`}>Recetas</button>
        <button onClick={() => setActiveTab('bodega')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'bodega' ? 'bg-emerald-700' : ''}`}>Bodega</button>
        <button onClick={() => setActiveTab('riego')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'riego' ? 'bg-emerald-700' : ''}`}>Riego</button>
        <button onClick={() => setActiveTab('pozo')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'pozo' ? 'bg-emerald-700' : ''}`}>Pozo</button>
        <button onClick={() => setActiveTab('cosecha')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'cosecha' ? 'bg-emerald-700' : ''}`}>Cosecha</button>
        {isAdmin && <button onClick={() => setActiveTab('usuarios')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'usuarios' ? 'bg-emerald-700' : ''}`}>Usuarios</button>}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">

        {/* 1. DASHBOARD DE ALTA GAMA CON RESUMEN EN TIEMPO REAL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 text-xs">
            
            {/* HEROBANNER EXECUTIVE */}
            <div className="p-6 bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950 text-white rounded-3xl shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px] uppercase tracking-wider border border-emerald-500/30">
                  Panel Ejecutivo 360° · Estado en Tiempo Real
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-2 tracking-tight">Bienvenido, {currentUser.nombre}</h2>
                <p className="text-stone-400 text-xs mt-1">Supervisión integral de Fundo La Cabaña (13.1 Ha de Kiwi Hayward productivo).</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowRiegoModal(true)} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-md">+ Riego</button>
                <button onClick={() => setShowCosechaModal(true)} className="px-3.5 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl cursor-pointer shadow-md">+ Cosecha</button>
              </div>
            </div>

            {/* TARJETAS KPI RESUMEN EN TIEMPO REAL */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-stone-500 font-bold uppercase text-[10px]">
                  <span>Cuarteles Hayward</span>
                  <Sprout className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900">13.1 Ha</div>
                <div className="text-stone-500 text-[11px] font-medium">3 Cuarteles en producción</div>
              </div>

              <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-stone-500 font-bold uppercase text-[10px]">
                  <span>Stock en Bodega</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900">{inventario.length} Prod.</div>
                {lowStockItems.length > 0 ? (
                  <div className="text-red-700 font-bold text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {lowStockItems.length} insumos en stock bajo
                  </div>
                ) : (
                  <div className="text-emerald-700 font-semibold text-[11px]">Stock saludable</div>
                )}
              </div>

              <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-stone-500 font-bold uppercase text-[10px]">
                  <span>Recetas SAG</span>
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900">{ordenes.length} Total</div>
                <div className="text-amber-700 font-bold text-[11px]">{ordenesPendientesCount} pendientes de ejecución</div>
              </div>

              <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-stone-500 font-bold uppercase text-[10px]">
                  <span>Cosecha Acumulada</span>
                  <Apple className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900">{(totalKilosCosechados / 1000).toFixed(1)} Ton</div>
                <div className="text-purple-800 font-bold text-[11px]">{cosechas.length} lotes recepcionados</div>
              </div>
            </div>

            {/* SECCIÓN ESTADO GENERAL EN VIVO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* ÚLTIMAS LABORES SAG */}
              <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cuaderno SAG - Últimas Labores
                  </h3>
                  <button onClick={() => setActiveTab('labores')} className="text-emerald-700 font-bold text-[11px]">Ver todas →</button>
                </div>
                <div className="space-y-2">
                  {labores.slice(0, 3).map(l => (
                    <div key={l.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-center">
                      <div>
                        <strong className="text-stone-900 block text-xs">{l.parcelaNombre}</strong>
                        <span className="text-[11px] text-stone-500">{l.descripcion}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-lg text-[10px]">{l.fecha}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIEGO EN VIVO */}
              <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-blue-600" /> Riego & Fertirriego en Vivo
                  </h3>
                  <button onClick={() => setShowRiegoModal(true)} className="px-3 py-1 bg-blue-50 text-blue-800 font-bold rounded-lg hover:bg-blue-100">+ Registrar Riego</button>
                </div>
                <div className="space-y-2">
                  {riegos.slice(0, 3).map(r => (
                    <div key={r.id} className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 flex justify-between items-center">
                      <div>
                        <strong className="text-stone-900 block text-xs">{r.sectorDestino} ({r.duracionHoras} hrs)</strong>
                        <span className="text-[11px] text-stone-600">Volumen: {r.volumenM3} m³ · Lámina: {r.laminaMm} mm</span>
                      </div>
                      <span className="font-mono text-blue-900 font-bold text-xs">{r.fecha}</span>
                    </div>
                  ))}
                </div>
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

        {/* 4. BODEGA E INVENTARIO */}
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
                <p className="text-stone-500 text-[11px]">Monitoreo de horas de riego, m³ aplicados e inyección de fertilizante.</p>
              </div>
              <button onClick={() => setShowRiegoModal(true)} className="px-4 py-2 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 cursor-pointer">+ Nuevo Registro de Riego</button>
            </div>

            <div className="space-y-3">
              {riegos.map(r => (
                <div key={r.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex justify-between items-center">
                  <div>
                    <strong className="text-stone-900 text-sm block">{r.sectorDestino} ({r.superficieHa} ha)</strong>
                    <span className="text-stone-500 text-[11px]">Duración: {r.duracionHoras} hrs · Volumen: {r.volumenM3} m³ · Lámina: {r.laminaMm} mm</span>
                  </div>
                  <span className="font-mono font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">{r.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. GESTIÓN DE POZO PROFUNDO */}
        {activeTab === 'pozo' && (
          <div className="space-y-6 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Waves className="w-6 h-6 text-cyan-600" /> Extracción Pozo Profundo
                </h1>
                <p className="text-stone-500 text-[11px]">Control de caudales (L/s) y volumen de agua extraído.</p>
              </div>
              <button onClick={() => setShowPozoModal(true)} className="px-4 py-2 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 cursor-pointer">+ Registrar Lectura Pozo</button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b text-stone-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Caudal (L/s)</th>
                    <th className="p-3">Horas</th>
                    <th className="p-3">Volumen m³</th>
                    <th className="p-3">Nivel Freático</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. COSECHA */}
        {activeTab === 'cosecha' && (
          <div className="space-y-6 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Apple className="w-6 h-6 text-purple-700" /> Registros de Cosecha & Bins
                </h1>
                <p className="text-stone-500 text-[11px]">Recepciones de fruta por cuartel y calibre.</p>
              </div>
              <button onClick={() => setShowCosechaModal(true)} className="px-4 py-2 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 cursor-pointer">+ Registrar Lote Cosecha</button>
            </div>

            <div className="space-y-3">
              {cosechas.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex justify-between items-center">
                  <div>
                    <strong className="text-stone-900 text-sm block">{c.parcelaNombre}</strong>
                    <span className="text-stone-500 text-[11px]">Bins Totales: {c.binsTotales} · Calibre Promedio: {c.calibrePromedio}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-900 text-base block font-mono">{c.kilosTotales} kg</span>
                    <span className="text-[10px] text-stone-400">{c.destinoExportacion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. CLIMA */}
        {activeTab === 'clima' && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3 text-xs">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" /> Estación Meteorológica Fundo La Cabaña
            </h2>
            <p className="text-stone-600">Registro de temperaturas mínimas/máximas, humedad relativa y acumulación de Horas Frío (HF).</p>
          </div>
        )}

        {/* 9. FENOLOGÍA */}
        {activeTab === 'fenologia' && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3 text-xs">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" /> Seguimiento Fenológico Kiwi Hayward
            </h2>
            <p className="text-stone-600">Monitoreo de brotación, plena floración, cuaja y crecimiento de fruto.</p>
          </div>
        )}

        {/* 10. ADMINISTRACIÓN TOTAL DE USUARIOS & CLAVES (SOLO PARA ADMINISTRADOR) */}
        {activeTab === 'usuarios' && isAdmin && (
          <div className="space-y-6 text-xs">
            
            <div className="p-5 bg-stone-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-stone-800">
              <div>
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> Administración Total de Usuarios y Claves Personales
                </h2>
                <p className="text-stone-400 text-[11px] mt-0.5">
                  Módulo exclusivo de control total: crea, edita correos, cambia claves, desactiva o elimina usuarios.
                </p>
              </div>

              <button
                onClick={openNewUserModal}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-2xl text-white shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" /> Crear Nuevo Usuario
              </button>
            </div>

            {/* TABLA DE USUARIOS EDITABLE */}
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-4">Nombre & RUT</th>
                      <th className="p-4">Correo Electrónico</th>
                      <th className="p-4">Rol Asignado</th>
                      <th className="p-4">Registro SAG</th>
                      <th className="p-4">Contraseña Personal</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {usuarios.map((u) => {
                      const isVisible = showClavesAdmin[u.id];
                      return (
                        <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-4">
                            <strong className="font-bold text-stone-900 block text-xs">{u.nombre}</strong>
                            <span className="text-[10px] text-stone-400 font-mono">{u.rutIdentificacion || 'Sin RUT'}</span>
                          </td>

                          <td className="p-4 text-stone-700 font-mono font-medium">{u.email}</td>

                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] bg-stone-100 text-stone-800 border border-stone-200">
                              {u.rol}
                            </span>
                          </td>

                          <td className="p-4 font-mono text-stone-600">{u.numeroRegistroSAG || 'N/A'}</td>

                          <td className="p-4 font-mono font-bold">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-950 bg-stone-100 px-2.5 py-1 rounded-xl border border-stone-200 min-w-[90px] text-center">
                                {isVisible ? u.clave : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowClavesAdmin(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                                className="text-stone-400 hover:text-stone-700 cursor-pointer"
                                title={isVisible ? 'Ocultar clave' : 'Ver clave'}
                              >
                                {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => toggleUserEstado(u.id)}
                              className={`px-3 py-1 rounded-full font-bold text-[10px] cursor-pointer transition-colors ${
                                u.estado === 'activo' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'
                              }`}
                            >
                              {u.estado === 'activo' ? '✓ Activo' : '✕ Inactivo'}
                            </button>
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => openEditUserModal(u)}
                              className="p-2 text-blue-700 hover:bg-blue-50 rounded-xl cursor-pointer mr-1"
                              title="Editar usuario y clave"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* MODAL REGISTRO DE LABOR */}
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

      {/* MODAL EDITAR / CREAR USUARIO Y CAMBIAR CLAVE */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-stone-200">
            <div className="px-6 py-4 border-b bg-stone-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                {editingUser ? 'Editar Usuario y Cambiar Clave' : 'Registrar Nuevo Usuario'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={userNombre}
                  onChange={(e) => setUserNombre(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Contraseña Personal *</label>
                  <input
                    type="text"
                    required
                    value={userClave}
                    onChange={(e) => setUserClave(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-mono font-bold bg-emerald-50 text-emerald-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Rol *</label>
                  <select
                    value={userRol}
                    onChange={(e) => setUserRol(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-white font-bold"
                  >
                    <option value="operador">Operador / Aplicador</option>
                    <option value="agronomo">Agrónomo Asesor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Registro SAG</label>
                  <input
                    type="text"
                    value={userSAG}
                    onChange={(e) => setUserSAG(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-mono"
                    placeholder="Ej: APL-SAG-3312"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">RUT</label>
                  <input
                    type="text"
                    value={userRut}
                    onChange={(e) => setUserRut(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={userTelefono}
                    onChange={(e) => setUserTelefono(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border rounded-xl cursor-pointer hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INGRESAR RIEGO RÁPIDO */}
      {showRiegoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Registrar Riego en Tiempo Real</h3>
            <form onSubmit={handleAddRiego} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Sector / Cuartel *</label>
                <select value={riegoSector} onChange={(e) => setRiegoSector(e.target.value)} className="w-full p-2 border rounded-xl font-bold">
                  {parcelas.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Horas de Riego</label>
                  <input type="number" required value={riegoHoras} onChange={(e) => setRiegoHoras(Number(e.target.value))} className="w-full p-2 border rounded-xl font-mono" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Volumen m³</label>
                  <input type="number" required value={riegoM3} onChange={(e) => setRiegoM3(Number(e.target.value))} className="w-full p-2 border rounded-xl font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowRiegoModal(false)} className="px-4 py-2 border rounded-
