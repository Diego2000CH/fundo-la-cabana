import React, { useState } from 'react';
import { 
  Sprout, 
  Package, 
  Calculator, 
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
  Edit2, 
  Trash2, 
  Activity, 
  X, 
  Compass
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

// DATOS INICIALES
const INITIAL_PARCELAS: Parcela[] = [
  { id: 'c1', nombre: 'Cuartel 1 - Kiwi Hayward', superficieHa: 2.8, variedad: 'Kiwi Hayward', anoPlantacion: 2015, descripcion: 'Suelo franco arcilloso, riego por goteo doble línea' },
  { id: 'c2', nombre: 'Cuartel 2 - Kiwi Hayward', superficieHa: 4.9, variedad: 'Kiwi Hayward', anoPlantacion: 2017, descripcion: 'Suelo franco profundo, cobertura vegetal interhilera' },
  { id: 'c3', nombre: 'Cuartel 3 - Kiwi Hayward Formacion', superficieHa: 5.4, variedad: 'Kiwi Hayward', anoPlantacion: 2021, descripcion: 'Plantación joven en estructura T-Bar y macho Tomuri 1:8' }
];

const INITIAL_INVENTARIO: InsumoInventario[] = [
  { id: 'ins-1', nombreComercial: 'Cobre Hidróxido 50 WP', materiaActiva: 'Hidróxido de Cobre', categoria: 'Fungicida y Bactericida', stockActual: 45, unidad: 'kg', numeroRegistroSAG: '1234-SAG', ubicacionBodega: 'Estante A-1' },
  { id: 'ins-2', nombreComercial: 'Spirotetramat 240 SC', materiaActiva: 'Spirotetramat', categoria: 'Insecticida', stockActual: 4, unidad: 'L', numeroRegistroSAG: '5678-SAG', ubicacionBodega: 'Estante B-3' },
  { id: 'ins-3', nombreComercial: 'Nitrato de Calcio Soluble', materiaActiva: 'Nitrato de Calcio', categoria: 'Fertilizante', stockActual: 500, unidad: 'kg', ubicacionBodega: 'Pallet 4' },
  { id: 'ins-4', nombreComercial: 'Glifosato 480 SL', materiaActiva: 'Glifosato', categoria: 'Herbicida', stockActual: 30, unidad: 'L', numeroRegistroSAG: '9912-SAG', ubicacionBodega: 'Estante C-1' }
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
    estado: 'activo'
  },
  { 
    id: 'usr-2', 
    nombre: 'Juan Pérez', 
    email: 'operador@fundolacabana.cl', 
    clave: 'operador123', 
    rol: 'operador', 
    rutIdentificacion: '12.876.543-2',
    numeroRegistroSAG: 'APL-SAG-3312', 
    estado: 'activo'
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
    plagaObjetivo: 'Control Fitosanitario / Preventivo Psa',
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
    condicionesClimaticasRequeridas: 'Viento menor a 8 km/h, sin precipitaciones',
    agronomoEmisorId: 'usr-1',
    agronomoEmisorNombre: 'Diego Pereira Ramirez',
    agronomoRegistroSAG: 'SAG-8921-CL',
    agronomoFirmaDigital: 'FIRMADO DIGITALMENTE - Diego Pereira Ramirez',
    aplicadorAsignadoId: 'usr-2',
    aplicadorAsignadoNombre: 'Juan Pérez',
    maquinariaTractor: 'Tractor John Deere + Pulverizadora 2000L',
    descontadoInventario: false
  }
];

const INITIAL_RIEGOS: RegistroRiegoSector[] = [
  { id: 'r-1', fecha: '2026-11-04', horaInicio: '08:00', sectorDestino: 'Cuartel 1 - Kiwi Hayward', superficieHa: 2.8, tipoRiego: 'Fertirriego', duracionHoras: 4, volumenM3: 280, operador: 'Juan Pérez' }
];

const INITIAL_POZO: RegistroExtraccionPozo[] = [
  { id: 'p-1', fecha: '2026-11-04', caudalLps: 45, horasOperacion: 8, volumenExtraidoM3: 1296, nivelFreaticoM: 18.5, operador: 'Juan Pérez' }
];

const INITIAL_COSECHAS: RegistroCosechaLote[] = [
  { id: 'cos-1', fecha: '2026-04-20', parcelaId: 'c1', parcelaNombre: 'Cuartel 1 - Kiwi Hayward', kilosTotales: 18500, binsTotales: 46, calibrePromedio: '30-33', destinoExportacion: 'Exportadora Principal', responsableCosecha: 'Juan Pérez' }
];

export function App() {
  const [currentUser, setCurrentUser] = useState<UsuarioPredio | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginClave, setLoginClave] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'labores' | 'ordenes' | 'bodega' | 'riego' | 'pozo' | 'cosecha' | 'usuarios'
  >('dashboard');

  const [parcelas] = useState<Parcela[]>(INITIAL_PARCELAS);
  const [inventario, setInventario] = useState<InsumoInventario[]>(INITIAL_INVENTARIO);
  const [usuarios, setUsuarios] = useState<UsuarioPredio[]>(INITIAL_USUARIOS);
  const [labores, setLabores] = useState<RegistroLabor[]>(INITIAL_LABORES);
  const [ordenes, setOrdenes] = useState<OrdenTrabajoFitosanitaria[]>(INITIAL_ORDENES);
  const [riegos, setRiegos] = useState<RegistroRiegoSector[]>(INITIAL_RIEGOS);
  const [pozo, setPozo] = useState<RegistroExtraccionPozo[]>(INITIAL_POZO);
  const [cosechas, setCosechas] = useState<RegistroCosechaLote[]>(INITIAL_COSECHAS);

  const [showClavesAdmin, setShowClavesAdmin] = useState<Record<string, boolean>>({});

  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<RegistroLabor | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioPredio | null>(null);
  const [userNombre, setUserNombre] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userClave, setUserClave] = useState('');
  const [userRol, setUserRol] = useState<any>('operador');
  const [userRut, setUserRut] = useState('');
  const [userSAG, setUserSAG] = useState('');

  const [isRiegoModalOpen, setIsRiegoModalOpen] = useState(false);
  const [riegoSector, setRiegoSector] = useState(parcelas[0]?.nombre || '');
  const [riegoDuracion, setRiegoDuracion] = useState<number>(4);
  const [riegoVolumen, setRiegoVolumen] = useState<number>(200);

  const [isPozoModalOpen, setIsPozoModalOpen] = useState(false);
  const [pozoCaudal, setPozoCaudal] = useState<number>(45);
  const [pozoHoras, setPozoHoras] = useState<number>(8);
  const [pozoNivel, setPozoNivel] = useState<number>(18.5);

  const [isCosechaModalOpen, setIsCosechaModalOpen] = useState(false);
  const [cosechaCuartel, setCosechaCuartel] = useState(parcelas[0]?.nombre || '');
  const [cosechaKilos, setCosechaKilos] = useState<number>(10000);
  const [cosechaBins, setCosechaBins] = useState<number>(25);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = usuarios.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.clave === loginClave
    );

    if (user) {
      if (user.estado === 'inactivo') {
        setLoginError('Usuario inactivo. Contacte al administrador.');
        return;
      }
      setCurrentUser(user);
      setLoginError('');
      setActiveTab('dashboard');
    } else {
      setLoginError('Credenciales incorrectas. Verifique correo y clave.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginClave('');
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
    if (window.confirm('¿Eliminar esta labor del Cuaderno SAG?')) {
      setLabores(labores.filter(l => l.id !== id));
    }
  };

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

    const productosNombres = (orden.productos || []).map(p => p.productoComercial).join(', ');
    const nuevaLabor: RegistroLabor = {
      id: `lab-ot-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      parcelaId: orden.parcelaIds[0] || 'general',
      parcelaNombre: orden.parcelaNombres,
      tipoLabor: 'Aplicacion Fitosanitaria',
      descripcion: `[Ejecución Receta ${orden.numeroOrden}] ${orden.plagaObjetivo}`,
      operadorNombre: aplicadorNombre,
      insumoNombre: productosNombres,
      observaciones: `Receta ${orden.numeroOrden} confirmada. Firma: ${firma}`
    };

    setLabores(prev => [nuevaLabor, ...prev]);

    setOrdenes(ordenes.map(o => {
      if (o.id === ordenId) {
        return { ...o, estado: 'completada', descontadoInventario: true, aplicadorFirma: firma, aplicadorAsignadoNombre: aplicadorNombre };
      }
      return o;
    }));
  };

  const openNewUserModal = () => {
    setEditingUser(null);
    setUserNombre('');
    setUserEmail('');
    setUserClave('');
    setUserRol('operador');
    setUserRut('');
    setUserSAG('');
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
        numeroRegistroSAG: userSAG || undefined
      } : u));
    } else {
      const nuevo: UsuarioPredio = {
        id: `usr-${Date.now()}`,
        nombre: userNombre,
        email: userEmail,
        clave: userClave,
        rol: userRol,
        rutIdentificacion: userRut || undefined,
        numeroRegistroSAG: userSAG || undefined,
        estado: 'activo',
        fechaAlta: new Date().toISOString().slice(0, 10)
      };
      setUsuarios([...usuarios, nuevo]);
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) {
      alert('No puedes eliminar tu propio usuario administrador en uso.');
      return;
    }
    if (window.confirm('¿Estás seguro de eliminar este usuario permanentemente?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const handleSaveRiego = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoRiego: RegistroRiegoSector = {
      id: `r-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      horaInicio: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      sectorDestino: riegoSector,
      superficieHa: 3.5,
      tipoRiego: 'Fertirriego',
      fuenteAgua: 'Pozo profundo',
      duracionHoras: Number(riegoDuracion),
      volumenM3: Number(riegoVolumen),
      operador: currentUser?.nombre || 'Operador'
    };
    setRiegos([nuevoRiego, ...riegos]);
    setIsRiegoModalOpen(false);
  };

  const handleSavePozo = (e: React.FormEvent) => {
    e.preventDefault();
    const vol = Math.round(pozoCaudal * 3.6 * pozoHoras);
    const nuevoPozo: RegistroExtraccionPozo = {
      id: `p-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      caudalLps: Number(pozoCaudal),
      horasOperacion: Number(pozoHoras),
      volumenExtraidoM3: vol,
      nivelFreaticoM: Number(pozoNivel),
      operador: currentUser?.nombre || 'Operador'
    };
    setPozo([nuevoPozo, ...pozo]);
    setIsPozoModalOpen(false);
  };

  const handleSaveCosecha = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaCosecha: RegistroCosechaLote = {
      id: `cos-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      parcelaId: 'c1',
      parcelaNombre: cosechaCuartel,
      kilosTotales: Number(cosechaKilos),
      binsTotales: Number(cosechaBins),
      calibrePromedio: '30-33',
      destinoExportacion: 'Exportadora General',
      responsableCosecha: currentUser?.nombre || 'Responsable'
    };
    setCosechas([nuevaCosecha, ...cosechas]);
    setIsCosechaModalOpen(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-stone-900/90 border border-emerald-900/50 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 backdrop-blur-md">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-900/80 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-700/50 shadow-emerald-950 shadow-lg">
              <Sprout className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Fundo La Cabaña</h1>
            <p className="text-stone-400 text-xs">Gestión Agrónoma de Alta Gama · Kiwi Hayward</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 rounded-xl text-center font-bold">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-stone-300 font-bold mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@fundolacabana.cl"
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1">Contraseña Personal</label>
              <input
                type="password"
                required
                value={loginClave}
                onChange={(e) => setLoginClave(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 font-bold text-white rounded-xl shadow-lg transition-all cursor-pointer text-sm"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.rol === 'administrador';
  const lowStockCount = inventario.filter(i => i.stockActual <= 5).length;
  const totalKilosCosechados = cosechas.reduce((sum, c) => sum + c.kilosTotales, 0);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      <header className="bg-gradient-to-r from-emerald-950 via-stone-950 to-emerald-950 text-white sticky top-0 z-40 shadow-xl border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800/80 rounded-2xl border border-emerald-600/50 shadow-inner">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="font-black text-base leading-tight tracking-tight text-white">Fundo La Cabaña</h1>
              <p className="text-[10px] text-emerald-400 font-bold">100% Kiwi Hayward · Cuaderno SAG</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-900/50'}`}><LayoutDashboard className="w-4 h-4" /> Inicio</button>
            <button onClick={() => setActiveTab('labores')} className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'labores' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-900/50'}`}><Sprout className="w-4 h-4" /> Labores</button>
            <button onClick={() => setActiveTab('ordenes')} className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'ordenes' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-900/50'}`}><FileText className="w-4 h-4" /> Recetas SAG</button>
            <button onClick={() => setActiveTab('bodega')} className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'bodega' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-900/50'}`}><Package className="w-4 h-4" /> Bodega ({inventario.length})</button>
            <button onClick={() => setActiveTab('riego')} className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'riego' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-900/50'}`}><Droplet className="w-4 h-4" /> Riego</button>
            <button onClick={() => setActiveTab('pozo')} className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'pozo' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-900/50'}`}><Waves className="w-4 h-4" /> Pozo</button>
            <button onClick={() => setActiveTab('cosecha')} className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'cosecha' ? 'bg-emerald-800 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-900/50'}`}><Apple className="w-4 h-4" /> Cosecha</button>
            {isAdmin && (
              <button onClick={() => setActiveTab('usuarios')} className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 border border-emerald-600/50 cursor-pointer ${activeTab === 'usuarios' ? 'bg-emerald-800 text-white' : 'text-emerald-200'}`}><Users className="w-4 h-4" /> Usuarios</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => { setEditingLabor(null); setIsLaborModalOpen(true); }} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <Plus className="w-4 h-4" /> + Labor
            </button>
            <button onClick={handleLogout} className="p-2 bg-emerald-900 hover:bg-red-800 text-white rounded-xl transition-colors cursor-pointer" title="Cerrar sesión">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="lg:hidden flex bg-emerald-950 text-white border-b border-emerald-900 overflow-x-auto p-2 gap-1 text-xs font-bold">
        <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-emerald-700' : ''}`}>Inicio</button>
        <button onClick={() => setActiveTab('labores')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'labores' ? 'bg-emerald-700' : ''}`}>Labores</button>
        <button onClick={() => setActiveTab('ordenes')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'ordenes' ? 'bg-emerald-700' : ''}`}>Recetas</button>
        <button onClick={() => setActiveTab('bodega')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'bodega' ? 'bg-emerald-700' : ''}`}>Bodega</button>
        <button onClick={() => setActiveTab('riego')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'riego' ? 'bg-emerald-700' : ''}`}>Riego</button>
        <button onClick={() => setActiveTab('pozo')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'pozo' ? 'bg-emerald-700' : ''}`}>Pozo</button>
        <button onClick={() => setActiveTab('cosecha')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'cosecha' ? 'bg-emerald-700' : ''}`}>Cosecha</button>
        {isAdmin && <button onClick={() => setActiveTab('usuarios')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'usuarios' ? 'bg-emerald-700' : ''}`}>Usuarios</button>}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">

        {activeTab === 'dashboard' && (
          <div className="space-y-6 text-xs">
            <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white shadow-2xl border border-emerald-800/30">
              <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> Monitoreo Vivo Predial
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Bienvenido, {currentUser.nombre}</h2>
                  <p className="text-stone-300 text-xs mt-1 max-w-xl">
                    Panel Ejecutivo Fundo La Cabaña. Resumen integral de fitosanidad, existencias de bodega, pozo profundo y rendimientos de cosecha.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsRiegoModalOpen(true)} className="px-3.5 py-2.5 bg-blue-700 hover:bg-blue-600 font-bold rounded-xl text-white shadow-md cursor-pointer flex items-center gap-1.5">
                    <Droplet className="w-4 h-4" /> + Riego
                  </button>
                  <button onClick={() => setIsPozoModalOpen(true)} className="px-3.5 py-2.5 bg-cyan-700 hover:bg-cyan-600 font-bold rounded-xl text-white shadow-md cursor-pointer flex items-center gap-1.5">
                    <Waves className="w-4 h-4" /> + Pozo
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Superficie Activa</span>
                <div className="text-2xl font-black text-stone-900">13.1 Ha</div>
                <span className="text-emerald-700 font-bold text-[10px]">3 Cuarteles Hayward</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Alertas Bodega</span>
                <div className="text-2xl font-black text-amber-700">{lowStockCount} Críticos</div>
                <span className="text-stone-500 text-[10px]">Total {inventario.length} insumos</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Extracción Pozo</span>
                <div className="text-2xl font-black text-cyan-800">{pozo[0]?.volumenExtraidoM3 || 0} m³</div>
                <span className="text-stone-500 text-[10px]">Caudal: {pozo[0]?.caudalLps || 0} L/s</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Cosecha Acumulada</span>
                <div className="text-2xl font-black text-purple-900">{totalKilosCosechados.toLocaleString()} kg</div>
                <span className="text-purple-700 font-bold text-[10px]">{cosechas.reduce((sum, c) => sum + c.binsTotales, 0)} Bins totales</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                  <span>Últimas Labores SAG</span>
                  <button onClick={() => setActiveTab('labores')} className="text-emerald-700 font-bold text-xs hover:underline cursor-pointer">Ver todas →</button>
                </h3>
                <div className="space-y-2">
                  {labores.slice(0, 3).map(l => (
                    <div key={l.id} className="p-3 bg-stone-50 rounded-xl border flex justify-between items-center">
                      <div>
                        <strong className="text-stone-900 block">{l.descripcion}</strong>
                        <span className="text-stone-500 text-[10px]">{l.parcelaNombre} · {l.fecha}</span>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-lg text-[10px]">{l.operadorNombre}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                  <span>Registros de Riego Recientes</span>
                  <button onClick={() => setActiveTab('riego')} className="text-blue-700 font-bold text-xs hover:underline cursor-pointer">Ver todos →</button>
                </h3>
                <div className="space-y-2">
                  {riegos.slice(0, 3).map(r => (
                    <div key={r.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex justify-between items-center">
                      <div>
                        <strong className="text-blue-950 block">{r.sectorDestino}</strong>
                        <span className="text-blue-700 text-[10px]">{r.duracionHoras} hrs · {r.volumenM3} m³</span>
                      </div>
                      <span className="font-mono font-bold text-blue-900 text-xs">{r.fecha}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'labores' && (
          <LaboresView
            labores={labores}
            parcelas={parcelas}
            inventario={inventario}
            usuarios={usuarios}
            onOpenNewLabor={() => { setEditingLabor(null); setIsLaborModalOpen(true); }}
            onEditLabor={(l) => { setEditingLabor(l); setIsLaborModalOpen(true); }}
            onDeleteLabor={handleDeleteLabor}
          />
        )}

        {activeTab === 'ordenes' && (
          <OrdenesTrabajoView
            ordenes={ordenes}
            parcelas={parcelas}
            inventario={inventario}
            usuarios={usuarios}
            activeUser={currentUser}
            onAddOrden={(n) => setOrdenes([n, ...ordenes])}
            onUpdateOrden={(u) => setOrdenes(ordenes.map(o => o.id === u.id ? u : o))}
            onExecuteOrden={handleExecuteOrden}
            onDeleteOrden={(id) => setOrdenes(ordenes.filter(o => o.id !== id))}
          />
        )}

        {activeTab === 'bodega' && (
          <BodegaView
            inventario={inventario}
            onAddInsumo={(n) => setInventario([...inventario, n])}
            onUpdateInsumo={(u) => setInventario(inventario.map(i => i.id === u.id ? u : i))}
            onDeleteInsumo={(id) => setInventario(inventario.filter(i => i.id !== id))}
          />
        )}

        {activeTab === 'riego' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-2xs">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2"><Droplet className="w-5 h-5 text-blue-600" /> Registros de Riego & Fertirriego</h2>
                <p className="text-stone-500 text-[11px]">Control de pulsos de riego, volumen de agua e inyección de fertilizantes.</p>
              </div>
              <button onClick={() => setIsRiegoModalOpen(true)} className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl cursor-pointer">+ Nuevo Riego</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {riegos.map(r => (
                <div key={r.id} className="bg-white p-4 rounded-2xl border space-y-2 shadow-2xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-blue-950 text-sm">{r.sectorDestino}</span>
                    <span className="text-stone-400 font-mono">{r.fecha}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2 rounded-xl text-center font-mono">
                    <div><span className="text-[10px] text-stone-400 block">Horas</span><strong>{r.duracionHoras} hrs</strong></div>
                    <div><span className="text-[10px] text-stone-400 block">Volumen</span><strong>{r.volumenM3} m³</strong></div>
                    <div><span className="text-[10px] text-stone-400 block">Lámina</span><strong>{r.laminaMm || 10} mm</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pozo' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-2xs">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2"><Waves className="w-5 h-5 text-cyan-600" /> Registros Pozo Profundo</h2>
                <p className="text-stone-500 text-[11px]">Monitoreo de caudales (L/s) y nivel freático del pozo.</p>
              </div>
              <button onClick={() => setIsPozoModalOpen(true)} className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded-xl cursor-pointer">+ Registro Pozo</button>
            </div>

            <div className="bg-white rounded-2xl border overflow-hidden shadow-2xs">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b font-bold uppercase text-[10px] text-stone-600">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Caudal (L/s)</th>
                    <th className="p-3">Horas</th>
                    <th className="p-3">Volumen Extraído</th>
                    <th className="p-3">Nivel Freático</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {pozo.map(p => (
                    <tr key={p.id}>
                      <td className="p-3 font-bold text-stone-900">{p.fecha}</td>
                      <td className="p-3 text-cyan-900">{p.caudalLps} L/s</td>
                      <td className="p-3">{p.horasOperacion} hrs</td>
                      <td className="p-3 font-bold text-emerald-900">{p.volumenExtraidoM3} m³</td>
                      <td className="p-3">{p.nivelFreaticoM} m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cosecha' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-2xs">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2"><Apple className="w-5 h-5 text-purple-700" /> Cosecha & Recepción Bins</h2>
                <p className="text-stone-500 text-[11px]">Ingreso de kilos recolectados y conteo de bins por cuartel.</p>
              </div>
              <button onClick={() => setIsCosechaModalOpen(true)} className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white font-bold rounded-xl cursor-pointer">+ Cosecha Lote</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cosechas.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border shadow-2xs space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-stone-900 text-sm">{c.parcelaNombre}</span>
                    <span className="font-mono text-stone-400">{c.fecha}</span>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex justify-between items-center font-mono">
                    <div><span className="text-[10px] text-purple-800 font-sans block">Total Kilos</span><strong className="text-base text-purple-950">{c.kilosTotales} kg</strong></div>
                    <div><span className="text-[10px] text-purple-800 font-sans block">Total Bins</span><strong className="text-base text-purple-950">{c.binsTotales} Bins</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && isAdmin && (
          <div className="space-y-6 text-xs">
            <div className="p-5 bg-emerald-950 text-white rounded-2xl flex justify-between items-center shadow-lg">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2"><Users className="w-5 h-5 text-emerald-300" /> Gestión Total de Usuarios & Credenciales</h2>
                <p className="text-emerald-200 text-[11px]">Edita nombres, correos, claves personales o elimina cuentas de usuario.</p>
              </div>
              <button onClick={openNewUserModal} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5">+ Nuevo Usuario</button>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b text-stone-600 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Usuario / RUT</th>
                    <th className="p-3">Correo Acceso</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3">Clave Personal</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {usuarios.map(u => {
                    const isVisible = showClavesAdmin[u.id];
                    return (
                      <tr key={u.id} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-stone-900">{u.nombre} <span className="block text-[10px] text-stone-400 font-mono font-normal">{u.rutIdentificacion || 'Sin RUT'}</span></td>
                        <td className="p-3 font-mono text-stone-700">{u.email}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-stone-100 border">{u.rol}</span></td>
                        <td className="p-3 font-mono font-bold">
                          <div className="flex items-center gap-2">
                            <span className="bg-stone-100 px-2 py-1 rounded border min-w-[80px] text-center">{isVisible ? u.clave : '••••••••'}</span>
                            <button onClick={() => setShowClavesAdmin(prev => ({ ...prev, [u.id]: !prev[u.id] }))} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-center space-x-2">
                          <button onClick={() => openEditUserModal(u)} className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer" title="Editar correo, clave o datos"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg cursor-pointer" title="Eliminar usuario"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {isRiegoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Registrar Riego / Fertirriego</h3>
            <form onSubmit={handleSaveRiego} className="space-y-3">
              <div><label className="block font-bold mb-1">Sector / Cuartel</label><input type="text" value={riegoSector} onChange={e => setRiegoSector(e.target.value)} className="w-full p-2 border rounded-lg font-bold" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block font-bold mb-1">Duración (Horas)</label><input type="number" value={riegoDuracion} onChange={e => setRiegoDuracion(Number(e.target.value))} className="w-full p-2 border rounded-lg font-mono" /></div>
                <div><label className="block font-bold mb-1">Volumen (m³)</label><input type="number" value={riegoVolumen} onChange={e => setRiegoVolumen(Number(e.target.value))} className="w-full p-2 border rounded-lg font-mono" /></div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsRiegoModalOpen(false)} className="px-4 py-2 border rounded-lg cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-700 text-white font-bold rounded-lg cursor-pointer">Guardar Riego</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPozoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Registrar Extracción Pozo Profundo</h3>
            <form onSubmit={handleSavePozo} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div><label className="block font-bold mb-1">Caudal (L/s)</label><input type="number" value={pozoCaudal} onChange={e => setPozoCaudal(Number(e.target.value))} className="w-full p-2 border rounded-lg font-mono" /></div>
                <div><label className="block font-bold mb-1">Horas Operación</label><input type="number" value={pozoHoras} onChange={e => setPozoHoras(Number(e.target.value))} className="w-full p-2 border rounded-lg font-mono" /></div>
                <div><label className="block font-bold mb-1">Nivel Freático (m)</label><input type="number" step="0.1" value={pozoNivel} onChange={e => setPozoNivel(Number(e.target.value))} className="w-full p-2 border rounded-lg font-mono" /></div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsPozoModalOpen(false)} className="px-4 py-2 border rounded-lg cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-cyan-700 text-white font-bold rounded-lg cursor-pointer">Guardar Pozo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCosechaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Registrar Cosecha / Lote</h3>
            <form onSubmit={handleSaveCosecha} className="space-y-3">
              <div><label className="block font-bold mb-1">Cuartel Cosechado</label><input type="text" value={cosechaCuartel} onChange={e => setCosechaCuartel(e.target.value)} className="w-full p-2 border rounded-lg font-bold" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block font-bold mb-1">Kilos Totales</label><input type="number" value={cosechaKilos} onChange={e => setCosechaKilos(Number(e.target.value))} className="w-full p-2 border rounded-lg font-mono" /></div>
                <div><label className="block font-bold mb-1">Bins Totales</label><input type="number" value={cosechaBins} onChange={e => setCosechaBins(Number(e.target.value))} className="w-full p-2 border rounded-lg font-mono" /></div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCosechaModalOpen(false)} className="px-4 py-2 border rounded-lg cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-purple-800 text-white font-bold rounded-lg cursor-pointer">Guardar Cosecha</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border space-y-3">
            <h3 className="font-bold text-sm text-stone-900">{editingUser ? 'Editar Usuario & Credenciales' : 'Registrar Nuevo Usuario'}</h3>
            <form onSubmit={handleSaveUser} className="space-y-3">
              <div><label className="block font-semibold mb-1">Nombre Completo *</label><input type="text" required value={userNombre} onChange={e => setUserNombre(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block font-semibold mb-1">Correo Electrónico *</label><input type="email" required value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                <div><label className="block font-semibold mb-1">Clave Personal *</label><input type="text" required value={userClave} onChange={e => setUserClave(e.target.value)} className="w-full p-2 border rounded-lg font-mono font-bold" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block font-semibold mb-1">Rol *</label><select value={userRol} onChange={e => setUserRol(e.target.value as any)} className="w-full p-2 border rounded-lg font-bold"><option value="operador">Operador</option><option value="agronomo">Agrónomo</option><option value="administrador">Administrador</option></select></div>
                <div><label className="block font-semibold mb-1">RUT</label><input type="text" value={userRut} onChange={e => setUserRut(e.target.value)} className="w-full p-2 border rounded-lg font-mono" /></div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 border rounded-lg cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg cursor-pointer">Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLaborModalOpen && (
        <ModalLabor
          isOpen={isLaborModalOpen}
          labor={editingLabor}
          parcelas={parcelas}
          inventario={inventario}
          usuarios={usuarios}
          activeUserId={currentUser.id}
          onSave={handleSaveLabor}
          onClose={() => { setIsLaborModalOpen(false); setEditingLabor(null); }}
        />
      )}
    </div>
  );
}

export default App;
