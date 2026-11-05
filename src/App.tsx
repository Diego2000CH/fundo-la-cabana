import React, { useState, useEffect, useRef } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { LaboresView } from './components/LaboresView';
import { InventarioView } from './components/InventarioView';
import { PozoView } from './components/PozoView';
import { ClimaView } from './components/ClimaView';
import { ParcelasView } from './components/ParcelasView';
import { MonitoreoView } from './components/MonitoreoView';
import { CalculadoraView } from './components/CalculadoraView';
import { InformeOficialView } from './components/InformeOficialView';
import { UsuariosView } from './components/UsuariosView';
import { CosechaMadurezView } from './components/CosechaMadurezView';
import { OrdenesTrabajoView } from './components/OrdenesTrabajoView';
import { HorasFrioFenologiaView } from './components/HorasFrioFenologiaView';
import { RiegoView } from './components/RiegoView';
import { AlertasStockModal } from './components/AlertasStockModal';
import { ModalLabor } from './components/ModalLabor';
import { ModalExplotacion } from './components/ModalExplotacion';
import { 
  getStoredExplotacion, 
  saveStoredExplotacion,
  getStoredParcelas, 
  saveStoredParcelas,
  getStoredLabores, 
  saveStoredLabores,
  getStoredInventario, 
  saveStoredInventario,
  getStoredRegistrosPozo, 
  saveStoredRegistrosPozo,
  getStoredLugares, 
  saveStoredLugares,
  getStoredUsuarios, 
  saveStoredUsuarios,
  getStoredActiveUserId, 
  saveStoredActiveUserId,
  getStoredMuestreosMadurez, 
  saveStoredMuestreosMadurez,
  getStoredCosechasLote, 
  saveStoredCosechasLote,
  getStoredOrdenesTrabajo, 
  saveStoredOrdenesTrabajo,
  getStoredCondicionHorasFrio, 
  saveStoredCondicionHorasFrio,
  getStoredFenologia, 
  saveStoredFenologia,
  getStoredPolinizacion, 
  saveStoredPolinizacion,
  resetStorageToDefaults 
} from './utils/storage';
import { 
  ExplotacionAgricola, 
  Parcela, 
  RegistroLabor, 
  TipoLabor, 
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
  RegistroPolinizacion,
  RegistroRiegoSector,
  SectorRiegoConfig
} from './types/campo';
import { initialClimaLaCabana } from './data/initialData';
import { RotateCcw, X, CheckCircle2, Loader2, Save, Database, Lock, LogIn, AlertCircle, LogOut, UserCog } from 'lucide-react';

const SUPABASE_URL = 'https://zvtolionewlulqmtdaty.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_s1vQx_x3_f3fDHHkdjVxZw_GTMkiU8I';

const SECTORES_INICIALES: SectorRiegoConfig[] = [
  { id: 'sec-1', nombre: 'Sector 1', superficieHa: 3.8, descripcion: 'Lado Norte' },
  { id: 'sec-2', nombre: 'Sector 2', superficieHa: 3.2, descripcion: 'Lado Este' },
  { id: 'sec-3', nombre: 'Sector 3', superficieHa: 3.5, descripcion: 'Lado Sur' },
  { id: 'sec-4', nombre: 'Sector 4', superficieHa: 2.6, descripcion: 'Lado Poniente' }
];

const USUARIO_INICIAL_ADMIN: UsuarioPredio & { clave?: string } = {
  id: 'usr-admin-diego',
  nombre: 'Diego Pereira Ramirez',
  email: 'diegopereiraramirez@gmail.com',
  telefono: '+56 9 ',
  rol: 'administrador',
  rutIdentificacion: '',
  estado: 'activo',
  fechaAlta: '2026-10-20',
  avatarColor: 'bg-emerald-800 text-white',
  notas: 'Administrador del Fundo La Cabaña'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [explotacion, setExplotacion] = useState<ExplotacionAgricola>(getStoredExplotacion);
  const [parcelas, setParcelas] = useState<Parcela[]>(getStoredParcelas);
  const [labores, setLabores] = useState<RegistroLabor[]>(getStoredLabores);
  const [inventario, setInventario] = useState<InsumoInventario[]>(getStoredInventario);
  const [registrosPozo, setRegistrosPozo] = useState<RegistroExtraccionPozo[]>(getStoredRegistrosPozo);
  const [riegosSector, setRiegosSector] = useState<RegistroRiegoSector[]>([]);
  const [sectoresRiego, setSectoresRiego] = useState<SectorRiegoConfig[]>(SECTORES_INICIALES);

  const [lugares, setLugares] = useState<LugarPredio[]>(getStoredLugares);
  const [usuarios, setUsuarios] = useState<(UsuarioPredio & { clave?: string })[]>([
    { ...USUARIO_INICIAL_ADMIN, clave: 'DiegoPer1.' }
  ]);
  const [activeUserId, setActiveUserId] = useState<string>('usr-admin-diego');
  const [clima, setClima] = useState<ClimaCondiciones>(initialClimaLaCabana);

  const [muestreosMadurez, setMuestreosMadurez] = useState<MuestreoMadurez[]>(getStoredMuestreosMadurez);
  const [cosechasLote, setCosechasLote] = useState<RegistroCosechaLote[]>(getStoredCosechasLote);
  const [ordenesTrabajo, setOrdenesTrabajo] = useState<OrdenTrabajoFitosanitaria[]>(getStoredOrdenesTrabajo);
  const [horasFrio, setHorasFrio] = useState<CondicionHorasFrio>(getStoredCondicionHorasFrio);
  const [fenologia, setFenologia] = useState<SeguimientoFenologico[]>(getStoredFenologia);
  const [polinizacion, setPolinizacion] = useState<RegistroPolinizacion[]>(getStoredPolinizacion);

  // Estados de conexión con Supabase
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [dbStatus, setDbStatus] = useState<'sincronizado' | 'guardando' | 'cargando' | 'error'>('cargando');
  const [dbMessage, setDbMessage] = useState('Conectando a Supabase...');

  // Sesión y Login
  const [loggedInUser, setLoggedInUser] = useState<(UsuarioPredio & { clave?: string }) | null>(null);
  const [loginEmail, setLoginEmail] = useState('diegopereiraramirez@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Modal Mi Perfil y Clave
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [myNewName, setMyNewName] = useState('Diego Pereira Ramirez');
  const [myNewEmail, setMyNewEmail] = useState('diegopereiraramirez@gmail.com');
  const [myNewPassword, setMyNewPassword] = useState('DiegoPer1.');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Modales
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<RegistroLabor | null>(null);
  const [defaultParcelaId, setDefaultParcelaId] = useState<string | undefined>(undefined);
  const [defaultTipoLabor, setDefaultTipoLabor] = useState<TipoLabor | undefined>(undefined);
  const [isExplotacionModalOpen, setIsExplotacionModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // 1. CARGA AUTOMÁTICA EN VIVO DESDE SUPABASE
  const cargarDesdeSupabase = async () => {
    setDbStatus('cargando');
    setDbMessage('Descargando datos de Supabase...');

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/fundo_datos?id=eq.fundo_la_cabana&select=datos`, {
        headers: { 'apikey': SUPABASE_ANON_KEY }
      });

      if (!res.ok) {
        const errDetail = await res.text();
        throw new Error(`HTTP ${res.status}: ${errDetail.slice(0, 40)}`);
      }

      const filas = await res.json();

      if (Array.isArray(filas) && filas.length > 0 && filas[0].datos) {
        const datos = filas[0].datos;
        if (datos.explotacion) setExplotacion(datos.explotacion);
        if (Array.isArray(datos.parcelas)) setParcelas(datos.parcelas);
        if (Array.isArray(datos.labores)) setLabores(datos.labores);
        if (Array.isArray(datos.inventario)) setInventario(datos.inventario);
        if (Array.isArray(datos.registrosPozo)) setRegistrosPozo(datos.registrosPozo);
        if (Array.isArray(datos.riegosSector)) setRiegosSector(datos.riegosSector);
        if (Array.isArray(datos.sectoresRiego) && datos.sectoresRiego.length > 0) {
          setSectoresRiego(datos.sectoresRiego);
        }
        if (Array.isArray(datos.lugares)) setLugares(datos.lugares);
        if (Array.isArray(datos.usuarios) && datos.usuarios.length > 0) {
          setUsuarios(datos.usuarios);
          const adminUser = datos.usuarios.find((u: any) => u.email === 'diegopereiraramirez@gmail.com');
          if (adminUser) {
            setMyNewEmail(adminUser.email);
            setMyNewName(adminUser.nombre);
            if (adminUser.clave) setMyNewPassword(adminUser.clave);
          }
        }
        if (Array.isArray(datos.muestreosMadurez)) setMuestreosMadurez(datos.muestreosMadurez);
        if (Array.isArray(datos.cosechasLote)) setCosechasLote(datos.cosechasLote);
        if (Array.isArray(datos.ordenesTrabajo)) setOrdenesTrabajo(datos.ordenesTrabajo);
        if (datos.horasFrio) setHorasFrio(datos.horasFrio);
        if (Array.isArray(datos.fenologia)) setFenologia(datos.fenologia);
        if (Array.isArray(datos.polinizacion)) setPolinizacion(datos.polinizacion);
      }
      setIsDbLoaded(true);
      setDbStatus('sincronizado');
      setDbMessage('Supabase conectado en vivo');
    } catch (err: any) {
      console.warn('Iniciando con memoria local:', err);
      setIsDbLoaded(true);
      setDbStatus('sincronizado');
      setDbMessage('Modo local activo');
    }
  };

  useEffect(() => {
    cargarDesdeSupabase();

    const savedUserId = localStorage.getItem('fundo_sesion_id');
    if (savedUserId) {
      const u = usuarios.find((item) => item.id === savedUserId) || usuarios[0];
      if (u) {
        setLoggedInUser(u);
        setActiveUserId(u.id);
      }
    }
  }, []);

  // 2. GUARDAR EN SUPABASE
  const guardarEnSupabase = async (datosPersonalizados?: any) => {
    setDbStatus('guardando');
    setDbMessage('Guardando en Supabase...');

    const payload = datosPersonalizados || {
      explotacion,
      parcelas,
      labores,
      inventario,
      registrosPozo,
      riegosSector,
      sectoresRiego,
      lugares,
      usuarios,
      activeUserId,
      muestreosMadurez,
      cosechasLote,
      ordenesTrabajo,
      horasFrio,
      fenologia,
      polinizacion
    };

    saveStoredExplotacion(payload.explotacion);
    saveStoredParcelas(payload.parcelas);
    saveStoredLabores(payload.labores);
    saveStoredInventario(payload.inventario);
    saveStoredRegistrosPozo(payload.registrosPozo);
    saveStoredLugares(payload.lugares);
    saveStoredUsuarios(payload.usuarios);
    saveStoredActiveUserId(payload.activeUserId);
    saveStoredMuestreosMadurez(payload.muestreosMadurez);
    saveStoredCosechasLote(payload.cosechasLote);
    saveStoredOrdenesTrabajo(payload.ordenesTrabajo);
    saveStoredCondicionHorasFrio(payload.horasFrio);
    saveStoredFenologia(payload.fenologia);
    saveStoredPolinizacion(payload.polinizacion);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/fundo_datos?on_conflict=id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify([{
          id: 'fundo_la_cabana',
          datos: payload,
          updated_at: new Date().toISOString()
        }])
      });

      if (!res.ok) {
        const errDetail = await res.text();
        throw new Error(`HTTP ${res.status}: ${errDetail.slice(0, 50)}`);
      }

      setDbStatus('sincronizado');
      setDbMessage(`Guardado en Supabase (${new Date().toLocaleTimeString('es-CL')})`);
    } catch (err: any) {
      console.error('Error guardando en Supabase:', err);
      setDbStatus('error');
      setDbMessage('Error al conectar');
    }
  };

  const primerCarga = useRef(true);
  useEffect(() => {
    if (!isDbLoaded) return;
    if (primerCarga.current) {
      primerCarga.current = false;
      return;
    }

    const timer = setTimeout(() => {
      guardarEnSupabase();
    }, 600);

    return () => clearTimeout(timer);
  }, [
    isDbLoaded,
    explotacion,
    parcelas,
    labores,
    inventario,
    registrosPozo,
    riegosSector,
    sectoresRiego,
    lugares,
    usuarios,
    activeUserId,
    muestreosMadurez,
    cosechasLote,
    ordenesTrabajo,
    horasFrio,
    fenologia,
    polinizacion
  ]);

  // LOGIN EN VIVO
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      let listaFresca = usuarios;
      const res = await fetch(`${SUPABASE_URL}/rest/v1/fundo_datos?id=eq.fundo_la_cabana&select=datos`, {
        headers: { 'apikey': SUPABASE_ANON_KEY }
      });

      if (res.ok) {
        const filas = await res.json();
        if (Array.isArray(filas) && filas.length > 0 && filas[0].datos?.usuarios) {
          listaFresca = filas[0].datos.usuarios;
          setUsuarios(listaFresca);

          const datos = filas[0].datos;
          if (datos.explotacion) setExplotacion(datos.explotacion);
          if (Array.isArray(datos.parcelas)) setParcelas(datos.parcelas);
          if (Array.isArray(datos.labores)) setLabores(datos.labores);
          if (Array.isArray(datos.inventario)) setInventario(datos.inventario);
          if (Array.isArray(datos.registrosPozo)) setRegistrosPozo(datos.registrosPozo);
          if (Array.isArray(datos.riegosSector)) setRiegosSector(datos.riegosSector);
          if (Array.isArray(datos.sectoresRiego)) setSectoresRiego(datos.sectoresRiego);
          if (Array.isArray(datos.lugares)) setLugares(datos.lugares);
          if (Array.isArray(datos.muestreosMadurez)) setMuestreosMadurez(datos.muestreosMadurez);
          if (Array.isArray(datos.cosechasLote)) setCosechasLote(datos.cosechasLote);
          if (Array.isArray(datos.ordenesTrabajo)) setOrdenesTrabajo(datos.ordenesTrabajo);
          if (datos.horasFrio) setHorasFrio(datos.horasFrio);
          if (Array.isArray(datos.fenologia)) setFenologia(datos.fenologia);
          if (Array.isArray(datos.polinizacion)) setPolinizacion(datos.polinizacion);
        }
      }

      const inputEmail = loginEmail.trim().toLowerCase();
      const user = listaFresca.find(
        (u) => u.email.trim().toLowerCase() === inputEmail
      );

      if (!user) {
        setLoginError('Usuario no encontrado. Por favor selecciona tu nombre.');
        setIsLoggingIn(false);
        return;
      }

      const userPass = user.clave || '1234';

      if (loginPassword.trim() !== userPass.trim()) {
        setLoginError('Contraseña incorrecta.');
        setIsLoggingIn(false);
        return;
      }

      setLoggedInUser(user);
      setActiveUserId(user.id);
      localStorage.setItem('fundo_sesion_id', user.id);
    } catch (err: any) {
      setLoginError('Error de red al comprobar usuario.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('fundo_sesion_id');
    setLoginPassword('');
  };

  const handleSaveMyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInUser) return;

    const emailLimpio = myNewEmail.trim().toLowerCase();
    const claveLimpia = myNewPassword.trim() || '1234';
    const nombreLimpio = myNewName.trim() || loggedInUser.nombre;

    const updatedUser = {
      ...loggedInUser,
      nombre: nombreLimpio,
      email: emailLimpio,
      clave: claveLimpia
    };

    const nuevosUsuarios = usuarios.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );

    if (!nuevosUsuarios.some(u => u.id === updatedUser.id)) {
      nuevosUsuarios.push(updatedUser);
    }

    setLoggedInUser(updatedUser);
    setUsuarios(nuevosUsuarios);
    setLoginEmail(emailLimpio);

    localStorage.setItem('fundo_sesion_id', updatedUser.id);

    guardarEnSupabase({
      explotacion,
      parcelas,
      labores,
      inventario,
      registrosPozo,
      riegosSector,
      sectoresRiego,
      lugares,
      usuarios: nuevosUsuarios,
      activeUserId: updatedUser.id,
      muestreosMadurez,
      cosechasLote,
      ordenesTrabajo,
      horasFrio,
      fenologia,
      polinizacion
    });

    setProfileSuccessMsg('¡Correo y contraseña guardados con éxito!');
    setTimeout(() => {
      setIsProfileModalOpen(false);
      setProfileSuccessMsg('');
    }, 1500);
  };

  const activeUser = loggedInUser || usuarios.find((u) => u.id === activeUserId) || usuarios[0];

  const handleOpenNewLabor = () => {
    setEditingLabor(null);
    setDefaultParcelaId(undefined);
    setDefaultTipoLabor(undefined);
    setIsLaborModalOpen(true);
  };

  const handleOpenNewLaborWithDefaults = (parcelaId?: string, tipoLabor?: TipoLabor) => {
    setEditingLabor(null);
    setDefaultParcelaId(parcelaId);
    setDefaultTipoLabor(tipoLabor);
    setIsLaborModalOpen(true);
  };

  const handleEditLabor = (labor: RegistroLabor) => {
    setEditingLabor(labor);
    setDefaultParcelaId(undefined);
    setDefaultTipoLabor(undefined);
    setIsLaborModalOpen(true);
  };

  const handleSaveLabor = (laborToSave: RegistroLabor) => {
    const existingIndex = labores.findIndex((l) => l.id === laborToSave.id);
    const isEdit = existingIndex >= 0;
    const oldLabor = isEdit ? labores[existingIndex] : null;

    if (isEdit && oldLabor?.insumoId && oldLabor?.totalInsumoUtilizado) {
      const revertAmount = Number(oldLabor.totalInsumoUtilizado);
      setInventario((prev) => 
        prev.map((item) => {
          if (item.id === oldLabor.insumoId) {
            return {
              ...item,
              stockActual: Number((item.stockActual + revertAmount).toFixed(2)),
              consumoHistoricoAcumulado: Math.max(0, Number(((item.consumoHistoricoAcumulado || 0) - revertAmount).toFixed(2)))
            };
          }
          return item;
        })
      );
    }

    if (laborToSave.insumoId && laborToSave.totalInsumoUtilizado) {
      const deductionAmount = Number(laborToSave.totalInsumoUtilizado);
      setInventario((prev) => 
        prev.map((item) => {
          if (item.id === laborToSave.insumoId) {
            return {
              ...item,
              stockActual: Math.max(0, Number((item.stockActual - deductionAmount).toFixed(2))),
              consumoHistoricoAcumulado: Number(((item.consumoHistoricoAcumulado || 0) + deductionAmount).toFixed(2))
            };
          }
          return item;
        })
      );
    }

    setLabores((prev) => {
      const idx = prev.findIndex((l) => l.id === laborToSave.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = laborToSave;
        return copy;
      }
      return [laborToSave, ...prev];
    });

    setEditingLabor(null);
    setIsLaborModalOpen(false);
  };

  const handleDeleteLabor = (id: string) => {
    const labor = labores.find((l) => l.id === id);
    if (labor && labor.insumoId && labor.totalInsumoUtilizado) {
      const restoreAmount = Number(labor.totalInsumoUtilizado);
      setInventario((prev) => 
        prev.map((item) => {
          if (item.id === labor.insumoId) {
            return {
              ...item,
              stockActual: Number((item.stockActual + restoreAmount).toFixed(2)),
              consumoHistoricoAcumulado: Math.max(0, Number(((item.consumoHistoricoAcumulado || 0) - restoreAmount).toFixed(2)))
            };
          }
          return item;
        })
      );
    }
    setLabores((prev) => prev.filter((l) => l.id !== id));
  };

  // EXECUCIÓN Y DESCUENTO AUTOMÁTICO DE PRODUCTOS DE LA ORDEN DE TRABAJO DE BODEGA
  const handleExecuteOrden = (ordenId: string, aplicadorNombre: string, firma: string) => {
    const orden = ordenesTrabajo.find(o => o.id === ordenId);
    if (!orden) return;

    // Descontar todos los productos vinculados de la bodega
    if (orden.productos && orden.productos.length > 0) {
      setInventario(prevInv => {
        let copyInv = [...prevInv];
        orden.productos.forEach(prod => {
          if (prod.insumoId) {
            copyInv = copyInv.map(ins => {
              if (ins.id === prod.insumoId) {
                const descontar = Number(prod.totalProductoRequerido) || 0;
                return {
                  ...ins,
                  stockActual: Math.max(0, Number((ins.stockActual - descontar).toFixed(2))),
                  consumoHistoricoAcumulado: Number(((ins.consumoHistoricoAcumulado || 0) + descontar).toFixed(2))
                };
              }
              return ins;
            });
          }
        });
        return copyInv;
      });
    }

    // Marcar la orden como completada
    setOrdenesTrabajo(prev => prev.map(o => {
      if (o.id === ordenId) {
        return {
          ...o,
          estado: 'completada',
          descontadoInventario: true,
          aplicadorAsignadoNombre: aplicadorNombre,
          aplicadorFirma: firma
        };
      }
      return o;
    }));
  };

  const handleExecuteReset = () => {
    const defaults = resetStorageToDefaults();
    setExplotacion(defaults.explotacion);
    setParcelas(defaults.parcelas);
    setLabores(defaults.labores);
    setInventario(defaults.inventario);
    setRegistrosPozo(defaults.registrosPozo);
    setRiegosSector([]);
    setSectoresRiego(SECTORES_INICIALES);
    setLugares(defaults.lugares);
    setUsuarios(defaults.usuarios);
    setMuestreosMadurez(defaults.muestreosMadurez);
    setCosechasLote(defaults.cosechasLote);
    setOrdenesTrabajo(defaults.ordenesTrabajo);
    setHorasFrio(defaults.condicionHorasFrio);
    setFenologia(defaults.fenologia);
    setPolinizacion(defaults.polinizacion);
    setActiveUserId(defaults.usuarios[0]?.id || 'usr-admin-diego');
    setIsResetConfirmOpen(false);
    guardarEnSupabase({ ...defaults, riegosSector: [], sectoresRiego: SECTORES_INICIALES });
  };

  const lowStockCount = inventario.filter((i) => i.stockActual <= (i.stockMinimo || 5)).length;

  // PANTALLA LOGIN
  if (!loggedInUser) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
          <div className="bg-emerald-950 p-6 text-white text-center">
            <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center mx-auto mb-3 border border-emerald-600">
              <Lock className="w-6 h-6 text-emerald-200" />
            </div>
            <h1 className="text-xl font-bold">Fundo La Cabaña</h1>
            <p className="text-xs text-emerald-300 mt-1">
              Cuaderno de Campo Digital · Kiwi Hayward
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-stone-700 font-bold mb-1">
                Selecciona tu Nombre de Usuario *
              </label>
              
              <select
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 font-bold bg-stone-50 text-stone-900 text-sm cursor-pointer focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                {usuarios.map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">
                Contraseña Personal *
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Escribe tu clave aquí"
                className="w-full p-3 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Comprobando en Supabase...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar al Cuaderno</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 pb-16 sm:pb-0">
      {/* BARRA SUPERIOR DE CONEXIÓN CON SUPABASE */}
      <div className="bg-stone-900 text-white px-4 py-2 border-b border-stone-800 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          {dbStatus === 'guardando' && (
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {dbMessage}
            </span>
          )}
          {dbStatus === 'sincronizado' && (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {dbMessage}
            </span>
          )}
          {dbStatus === 'cargando' && (
            <span className="flex items-center gap-1.5 text-stone-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {dbMessage}
            </span>
          )}
          {dbStatus === 'error' && (
            <span className="text-red-400 font-bold">
              {dbMessage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMyNewName(activeUser.nombre);
              setMyNewEmail(activeUser.email);
              setMyNewPassword((activeUser as any).clave || '1234');
              setIsProfileModalOpen(true);
            }}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700 shadow-xs"
            title="Cambiar mi nombre, correo y contraseña"
          >
            <UserCog className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mi Perfil / Clave</span>
          </button>

          <button
            onClick={() => guardarEnSupabase()}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar en Supabase
          </button>

          <button
            onClick={handleLogout}
            className="px-2.5 py-1 bg-stone-800 hover:bg-red-800 text-stone-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </div>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewLabor={handleOpenNewLabor}
        fundoNombre={explotacion.nombreFundo}
        lowStockCount={lowStockCount}
        onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
        activeUser={activeUser}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            explotacion={explotacion}
            parcelas={parcelas}
            labores={labores}
            inventario={inventario}
            registrosPozo={registrosPozo}
            clima={clima}
            usuarios={usuarios}
            activeUserId={activeUserId}
            onOpenNewLaborWithDefaults={handleOpenNewLaborWithDefaults}
            onNavigateTab={setActiveTab}
            onEditExplotacion={() => setIsExplotacionModalOpen(true)}
            onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
            onEditLabor={handleEditLabor}
            onDeleteLabor={handleDeleteLabor}
          />
        )}

        {activeTab === 'parcelas' && (
          <ParcelasView
            parcelas={parcelas}
            lugares={lugares}
            onAddParcela={(p) => setParcelas((prev) => [...prev, p])}
            onUpdateParcela={(p) => setParcelas((prev) => prev.map((item) => item.id === p.id ? p : item))}
            onDeleteParcela={(id) => setParcelas((prev) => prev.filter((item) => item.id !== id))}
            onAddLugar={(l) => setLugares((prev) => [...prev, l])}
            onDeleteLugar={(id) => setLugares((prev) => prev.filter((item) => item.id !== id))}
          />
        )}

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

        {activeTab === 'ordenes' && (
          <OrdenesTrabajoView
            ordenes={ordenesTrabajo}
            parcelas={parcelas}
            inventario={inventario}
            usuarios={usuarios}
            activeUser={activeUser}
            onAddOrden={(o) => setOrdenesTrabajo((prev) => [o, ...prev])}
            onUpdateOrden={(o) => setOrdenesTrabajo((prev) => prev.map((item) => item.id === o.id ? o : item))}
            onExecuteOrden={handleExecuteOrden}
            onDeleteOrden={(id) => setOrdenesTrabajo((prev) => prev.filter((item) => item.id !== id))}
          />
        )}

        {activeTab === 'inventario' && (
          <InventarioView
            inventario={inventario}
            onAddInsumo={(insumo) => setInventario((prev) => [...prev, insumo])}
            onUpdateInsumo={(insumo) => setInventario((prev) => prev.map((item) => item.id === insumo.id ? insumo : item))}
            onDeleteInsumo={(id) => setInventario((prev) => prev.filter((item) => item.id !== id))}
          />
        )}

        {activeTab === 'pozo' && (
          <PozoView
            registrosPozo={registrosPozo}
            onAddRegistro={(reg) => setRegistrosPozo((prev) => [reg, ...prev])}
            onDeleteRegistro={(id) => setRegistrosPozo((prev) => prev.filter((item) => item.id !== id))}
          />
        )}

        {activeTab === 'riego' && (
          <RiegoView
            riegos={riegosSector}
            sectoresConfig={sectoresRiego}
            onUpdateSectoresConfig={(nuevosSectores) => setSectoresRiego(nuevosSectores)}
            onAddRiego={(r) => setRiegosSector((prev) => [r, ...prev])}
            onUpdateRiego={(r) => setRiegosSector((prev) => prev.map((item) => item.id === r.id ? r : item))}
            onDeleteRiego={(id) => setRiegosSector((prev) => prev.filter((item) => item.id !== id))}
            activeUserName={activeUser.nombre}
          />
        )}

        {activeTab === 'clima' && (
          <ClimaView
            clima={clima}
            onUpdateClima={setClima}
          />
        )}

        {activeTab === 'cosecha' && (
          <CosechaMadurezView
            muestreos={muestreosMadurez}
            cosechas={cosechasLote}
            parcelas={parcelas}
            onAddMuestreo={(m) => setMuestreosMadurez((prev) => [m, ...prev])}
            onDeleteMuestreo={(id) => setMuestreosMadurez((prev) => prev.filter((item) => item.id !== id))}
            onAddCosecha={(c) => setCosechasLote((prev) => [c, ...prev])}
            onDeleteCosecha={(id) => setCosechasLote((prev) => prev.filter((item) => item.id !== id))}
          />
        )}

        {activeTab === 'horasfrio' && (
          <HorasFrioFenologiaView
            horasFrio={horasFrio}
            fenologia={fenologia}
            polinizacion={polinizacion}
            onUpdateHorasFrio={setHorasFrio}
            onAddFenologia={(f) => setFenologia((prev) => [f, ...prev])}
            onDeleteFenologia={(id) => setFenologia((prev) => prev.filter((item) => item.id !== id))}
            onAddPolinizacion={(p) => setPolinizacion((prev) => [p, ...prev])}
            onDeletePolinizacion={(id) => setPolinizacion((prev) => prev.filter((item) => item.id !== id))}
          />
        )}

        {activeTab === 'monitoreo' && (
          <MonitoreoView
            labores={labores}
            parcelas={parcelas}
          />
        )}

        {activeTab === 'calculadora' && (
          <CalculadoraView
            parcelas={parcelas}
            inventario={inventario}
          />
        )}

        {activeTab === 'informe' && (
          <InformeOficialView
            explotacion={explotacion}
            parcelas={parcelas}
            labores={labores}
            inventario={inventario}
            registrosPozo={registrosPozo}
            cosechas={cosechasLote}
            ordenes={ordenesTrabajo}
          />
        )}

        {activeTab === 'usuarios' && (
          <UsuariosView
            usuarios={usuarios}
            activeUserId={activeUserId}
            onSelectActiveUser={setActiveUserId}
            onAddUsuario={(u) => setUsuarios((prev) => [...prev, u])}
            onUpdateUsuario={(u) => setUsuarios((prev) => prev.map((item) => item.id === u.id ? u : item))}
            onDeleteUsuario={(id) => setUsuarios((prev) => prev.filter((item) => item.id !== id))}
          />
        )}
      </main>

      {/* MODAL MI PERFIL / CLAVE */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border overflow-hidden">
            <div className="px-6 py-4 border-b bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <UserCog className="w-4 h-4 text-emerald-300" />
                Editar Mi Perfil & Clave
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMyProfile} className="p-6 space-y-4">
              {profileSuccessMsg && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={myNewName}
                  onChange={(e) => setMyNewName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-stone-50"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Correo Electrónico (Login) *</label>
                <input
                  type="email"
                  required
                  value={myNewEmail}
                  onChange={(e) => setMyNewEmail(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-stone-50"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Nueva Contraseña *</label>
                <input
                  type="text"
                  required
                  value={myNewPassword}
                  onChange={(e) => setMyNewPassword(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-mono font-bold bg-stone-50"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 border rounded-xl cursor-pointer hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-700 shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR EXPOTACIÓN */}
      {isExplotacionModalOpen && (
        <ModalExplotacion
          explotacion={explotacion}
          onSave={(e) => {
            setExplotacion(e);
            setIsExplotacionModalOpen(false);
          }}
          onClose={() => setIsExplotacionModalOpen(false)}
        />
      )}

      {/* MODAL REGISTRAR / EDITAR LABOR */}
      {isLaborModalOpen && (
        <ModalLabor
          labor={editingLabor}
          parcelas={parcelas}
          inventario={inventario}
          usuarios={usuarios}
          activeUserId={activeUserId}
          defaultParcelaId={defaultParcelaId}
          defaultTipoLabor={defaultTipoLabor}
          onSave={handleSaveLabor}
          onClose={() => {
            setIsLaborModalOpen(false);
            setEditingLabor(null);
          }}
        />
      )}

      {/* MODAL ALERTAS DE STOCK */}
      {isAlertsModalOpen && (
        <AlertasStockModal
          inventario={inventario}
          onClose={() => setIsAlertsModalOpen(false)}
        />
      )}

      {/* MODAL CONFIRMAR RESETEO */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 text-red-700">
              <RotateCcw className="w-4 h-4" />
              ¿Restablecer datos de fábrica?
            </h3>
            <p className="text-stone-600">
              Esta acción borrará los registros agregados manualmente y restaurará el sistema a su estado inicial.
            </p>
            <div className="pt-2 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 border rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteReset}
                className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Restablecer Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
