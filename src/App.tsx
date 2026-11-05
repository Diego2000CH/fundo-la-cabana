import React, { useState } from 'react';
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
  EyeOff
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

// DATOS INICIALES DEL PREDIO
const INITIAL_PARCELAS: Parcela[] = [
  { id: 'c1', nombre: 'Cuartel 1 - Kiwi Hayward', superficieHa: 2.8, variedad: 'Kiwi Hayward', anoPlantacion: 2015 },
  { id: 'c2', nombre: 'Cuartel 2 - Kiwi Hayward', superficieHa: 4.9, variedad: 'Kiwi Hayward', anoPlantacion: 2017 },
  { id: 'c3', nombre: 'Cuartel 3 - Kiwi Hayward Formacion', superficieHa: 5.4, variedad: 'Kiwi Hayward', anoPlantacion: 2021 }
];

const INITIAL_INVENTARIO: InsumoInventario[] = [
  { id: 'ins-1', nombreComercial: 'Cobre Hidróxido 50 WP', materiaActiva: 'Hidróxido de Cobre', categoria: 'Fungicida y Bactericida', stockActual: 45, unidad: 'kg', numeroRegistroSAG: '1234-SAG' },
  { id: 'ins-2', nombreComercial: 'Spirotetramat 240 SC', materiaActiva: 'Spirotetramat', categoria: 'Insecticida', stockActual: 12, unidad: 'L', numeroRegistroSAG: '5678-SAG' },
  { id: 'ins-3', nombreComercial: 'Nitrato de Calcio', materiaActiva: 'Nitrato de Calcio', categoria: 'Fertilizante', stockActual: 500, unidad: 'kg' },
  { id: 'ins-4', nombreComercial: 'Glifosato 480 SL', materiaActiva: 'Glifosato', categoria: 'Herbicida', stockActual: 30, unidad: 'L', numeroRegistroSAG: '9912-SAG' }
];

// USUARIOS CON ROLES Y CLAVES PERSONALES
const INITIAL_USUARIOS: UsuarioPredio[] = [
  { 
    id: 'usr-1', 
    nombre: 'Diego Pereira Ramirez', 
    email: 'admin@fundolacabana.cl', 
    clave: 'admin123',
    rol: 'administrador', 
    numeroRegistroSAG: 'SAG-8921-CL', 
    estado: 'activo', 
    fechaAlta: '2026-01-01' 
  },
  { 
    id: 'usr-2', 
    nombre: 'Juan Pérez', 
    email: 'operador@fundolacabana.cl', 
    clave: 'operador123',
    rol: 'operador', 
    numeroRegistroSAG: 'APL-SAG-3312', 
    estado: 'activo', 
    fechaAlta: '2026-01-01' 
  },
  { 
    id: 'usr-3', 
    nombre: 'Ing. Agrónomo Asesor', 
    email: 'agronomo@fundolacabana.cl', 
    clave: 'agro2026',
    rol: 'agronomo', 
    numeroRegistroSAG: 'SAG-4410-AG', 
    estado: 'activo', 
    fechaAlta: '2026-01-01' 
  }
];

const INITIAL_LABORES: RegistroLabor[] = [
  {
    id: 'lab-1',
    fecha: '2026-11-04',
    parcelaId: 'c1',
    parcelaNombre: 'Cuartel 1 - Kiwi Hayward',
    tipoLabor: 'Aplicacion Fitosanitaria',
    descripcion: 'Aplicación foliar preventiva con Fungicida Cobre',
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
    condicionesClimaticasRequeridas: 'Viento menor a 10 km/h, sin lluvias',
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

export function App() {
  // ESTADO DE AUTENTICACIÓN
  const [currentUser, setCurrentUser] = useState<UsuarioPredio | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginClave, setLoginClave] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showClavesAdmin, setShowClavesAdmin] = useState<Record<string, boolean>>({});

  // ESTADO NAVEGACIÓN COMPLETA
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'labores' | 'ordenes' | 'bodega' | 'riego' | 'pozo' | 'cosecha' | 'usuarios'
  >('dashboard');

  // ESTADOS GLOBALES DE DATOS
  const [parcelas] = useState<Parcela[]>(INITIAL_PARCELAS);
  const [inventario, setInventario] = useState<InsumoInventario[]>(INITIAL_INVENTARIO);
  const [usuarios, setUsuarios] = useState<UsuarioPredio[]>(INITIAL_USUARIOS);
  const [labores, setLabores] = useState<RegistroLabor[]>(INITIAL_LABORES);
  const [ordenes, setOrdenes] = useState<OrdenTrabajoFitosanitaria[]>(INITIAL_ORDENES);

  // CONTROL MODAL LABOR
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<RegistroLabor | null>(null);

  // INICIO DE SESIÓN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = usuarios.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.clave === loginClave
    );

    if (found) {
      if (found.estado === 'inactivo') {
        setLoginError('Usuario inactivo. Contacte al administrador.');
        return;
      }
      setCurrentUser(found);
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

  // MANEJO DE LABORES
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
    if (window.confirm('¿Estás seguro de eliminar este registro de labor?')) {
      setLabores(labores.filter(l => l.id !== id));
    }
  };

  // MANEJO DE ÓRDENES Y RECETAS SAG
  const handleAddOrden = (nuevaOrden: OrdenTrabajoFitosanitaria) => {
    setOrdenes([nuevaOrden, ...ordenes]);
  };

  const handleUpdateOrden = (ordenActualizada: OrdenTrabajoFitosanitaria) => {
    setOrdenes(ordenes.map(o => o.id === ordenActualizada.id ? ordenActualizada : o));
  };

  const handleDeleteOrden = (ordenId: string) => {
    if (window.confirm('¿Eliminar esta receta / orden de trabajo?')) {
      setOrdenes(ordenes.filter(o => o.id !== ordenId));
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
    const nuevaLaborDesdeOrden: RegistroLabor = {
      id: `lab-ot-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      parcelaId: orden.parcelaIds[0] || 'general',
      parcelaNombre: orden.parcelaNombres,
      tipoLabor: 'Aplicacion Fitosanitaria',
      descripcion: `[Ejecutado Receta ${orden.numeroOrden}] ${orden.plagaObjetivo}`,
      operadorNombre: aplicadorNombre,
      insumoNombre: productosNombres,
      observaciones: `Orden de Trabajo ${orden.numeroOrden} completada. Firma: ${firma}`
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

  // MANEJO DE BODEGA
  const handleAddInsumo = (nuevo: InsumoInventario) => {
    setInventario([...inventario, nuevo]);
  };

  const handleUpdateInsumo = (editado: InsumoInventario) => {
    setInventario(inventario.map(i => i.id === editado.id ? editado : i));
  };

  const handleDeleteInsumo = (id: string) => {
    if (window.confirm('¿Eliminar este producto de bodega?')) {
      setInventario(inventario.filter(i => i.id !== id));
    }
  };

  // PANTALLA DE LOGIN
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
              <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 rounded-xl text-center font-semibold">
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
            <p>Acceso restringido según rol asignado (Administrador, Agrónomo, Operador).</p>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.rol === 'administrador';

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      
      {/* NAVBAR PRINCIPAL COMPLETA */}
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

          {/* MENÚ DE NAVEGACIÓN DE TODAS LAS PESTAÑAS */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Inicio
            </button>

            <button
              onClick={() => setActiveTab('labores')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'labores' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Sprout className="w-4 h-4" /> Labores
            </button>

            <button
              onClick={() => setActiveTab('ordenes')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ordenes' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <FileText className="w-4 h-4" /> Recetas SAG
            </button>

            <button
              onClick={() => setActiveTab('bodega')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bodega' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Package className="w-4 h-4" /> Bodega ({inventario.length})
            </button>

            <button
              onClick={() => setActiveTab('riego')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'riego' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Droplet className="w-4 h-4" /> Riego
            </button>

            <button
              onClick={() => setActiveTab('pozo')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pozo' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Waves className="w-4 h-4" /> Pozo
            </button>

            <button
              onClick={() => setActiveTab('cosecha')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cosecha' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Apple className="w-4 h-4" /> Cosecha
            </button>

            {/* PESTAÑA SOLO PARA ADMINISTRADOR */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer border border-emerald-700/50 ${
                  activeTab === 'usuarios' ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-900/60'
                }`}
              >
                <Users className="w-4 h-4" /> Usuarios & Claves
              </button>
            )}
          </nav>

          {/* PERFIL DE USUARIO LOGUEADO */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold">{currentUser.nombre}</span>
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

      {/* MENÚ MÓVIL */}
      <div className="lg:hidden flex bg-emerald-900 text-white border-b border-emerald-800 overflow-x-auto p-2 gap-1 text-xs font-bold">
        <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-emerald-700' : ''}`}>Inicio</button>
        <button onClick={() => setActiveTab('labores')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'labores' ? 'bg-emerald-700' : ''}`}>Labores</button>
        <button onClick={() => setActiveTab('ordenes')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'ordenes' ? 'bg-emerald-700' : ''}`}>Recetas SAG</button>
        <button onClick={() => setActiveTab('bodega')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'bodega' ? 'bg-emerald-700' : ''}`}>Bodega</button>
        <button onClick={() => setActiveTab('riego')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'riego' ? 'bg-emerald-700' : ''}`}>Riego</button>
        <button onClick={() => setActiveTab('pozo')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'pozo' ? 'bg-emerald-700' : ''}`}>Pozo</button>
        <button onClick={() => setActiveTab('cosecha')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'cosecha' ? 'bg-emerald-700' : ''}`}>Cosecha</button>
        {isAdmin && (
          <button onClick={() => setActiveTab('usuarios')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'usuarios' ? 'bg-emerald-700' : ''}`}>Usuarios</button>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">

        {/* 1. DASHBOARD GENERAL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 text-xs">
            <div className="p-6 bg-emerald-950 text-white rounded-2xl shadow-md">
              <h2 className="text-xl font-bold">Bienvenido, {currentUser.nombre}</h2>
              <p className="text-emerald-300 mt-1">Panel de control de gestión agronómica - Fundo La Cabaña</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-stone-500 font-bold block text-[10px] uppercase">Cuarteles Hayward</span>
                <span className="text-2xl font-extrabold text-stone-900 mt-1 block">{parcelas.length} Sectores</span>
                <span className="text-xs text-stone-500 font-mono mt-1 block">Total: 13.1 Ha</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-stone-500 font-bold block text-[10px] uppercase">Productos en Bodega</span>
                <span className="text-2xl font-extrabold text-stone-900 mt-1 block">{inventario.length} Insumos</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-stone-500 font-bold block text-[10px] uppercase">Labores SAG</span>
                <span className="text-2xl font-extrabold text-stone-900 mt-1 block">{labores.length} Registros</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-stone-500 font-bold block text-[10px] uppercase">Recetas Emitidas</span>
                <span className="text-2xl font-extrabold text-stone-900 mt-1 block">{ordenes.length} Órdenes</span>
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

        {/* 3. RECETAS / ÓRDENES DE TRABAJO */}
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

        {/* 5. SECCIÓN RIEGO Y FERTIRRIEGO */}
        {activeTab === 'riego' && (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-600" /> Control de Riego y Fertirriego
            </h2>
            <p className="text-stone-600">
              Registro de tiempos de riego, sectores por hectárea, volumen de agua aplicado (m³) e inyección de fertilizantes solubles.
            </p>
          </div>
        )}

        {/* 6. SECCIÓN POZO PROFUNDO */}
        {activeTab === 'pozo' && (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-600" /> Extracción Pozo Profundo
            </h2>
            <p className="text-stone-600">
              Registro obligatorio de caudales (L/s), niveles freáticos (m) y volumen total extraído.
            </p>
          </div>
        )}

        {/* 7. SECCIÓN COSECHA */}
        {activeTab === 'cosecha' && (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Apple className="w-5 h-5 text-purple-600" /> Registros de Cosecha & Bins
            </h2>
            <p className="text-stone-600">
              Control de kilos cosechados por cuartel, conteo de bins, calibres promedio y lote de exportación.
            </p>
          </div>
        )}

        {/* 8. GESTIÓN DE USUARIOS Y CLAVES (SOLO VISIBLE PARA ADMINISTRADOR) */}
        {activeTab === 'usuarios' && isAdmin && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-950 text-white rounded-2xl flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-300" /> Administración de Usuarios y Credenciales
                </h2>
                <p className="text-emerald-200 text-[11px] mt-0.5">
                  Exclusivo para Administrador. Permite revisar y modificar las claves personales del personal.
                </p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Correo</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3">Registro SAG</th>
                    <th className="p-3">Contraseña Personal</th>
                    <th className="p-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {usuarios.map((u) => {
                    const isVisible = showClavesAdmin[u.id];
                    return (
                      <tr key={u.id} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-stone-900">{u.nombre}</td>
                        <td className="p-3 text-stone-600 font-mono">{u.email}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-stone-100 text-stone-800">
                            {u.rol}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-stone-600">{u.numeroRegistroSAG || 'N/A'}</td>
                        <td className="p-3 font-mono font-bold">
                          <div className="flex items-center gap-2">
                            <span>{isVisible ? u.clave : '••••••••'}</span>
                            <button
                              type="button"
                              onClick={() => setShowClavesAdmin(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                              className="text-stone-400 hover:text-stone-700 cursor-pointer"
                            >
                              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${u.estado === 'activo' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
                            {u.estado}
                          </span>
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
    </div>
  );
}

export default App;
