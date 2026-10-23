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
  RegistroPolinizacion
} from './types/campo';
import { initialClimaLaCabana } from './data/initialData';
import { RotateCcw, X, CheckCircle2, Loader2, Save, RefreshCw, Database, Lock, LogIn, AlertCircle, LogOut, UserCog, Waves, Plus, Droplet, Wheat, Edit2, Trash2 } from 'lucide-react';

const SUPABASE_URL = 'https://zvtolionewlulqmtdaty.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_s1vQx_x3_f3fDHHkdjVxZw_GTMkiU8I';

// LOS 4 SECTORES EXCLUSIVOS DE RIEGO (SUMAN 13.1 HA)
const SECTORES_RIEGO = [
  { id: 'sec-1', nombre: 'Sector 1', ha: 3.8 },
  { id: 'sec-2', nombre: 'Sector 2', ha: 3.2 },
  { id: 'sec-3', nombre: 'Sector 3', ha: 3.5 },
  { id: 'sec-4', nombre: 'Sector 4', ha: 2.6 }
];

interface RegistroRiegoSector {
  id: string;
  fecha: string;
  horaInicio: string;
  sectorDestino: string;
  superficieHa: number;
  tipoRiego: 'Solo Riego por Goteo' | 'Fertirriego' | 'Microaspersión' | 'Surco / Gravedad';
  fuenteAgua: string;
  duracionHoras: number;
  volumenM3: number;
  litrosTotales: number;
  laminaMm?: number;
  productoFertilizante?: string;
  dosisKgHa?: number;
  totalFertilizanteKg?: number;
  operador: string;
  observaciones?: string;
}

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

  // ESTADOS DEL FORMULARIO DE RIEGO (SOLO SECTORES 1, 2, 3, 4)
  const [isModalRiegoOpen, setIsModalRiegoOpen] = useState(false);
  const [editingRiego, setEditingRiego] = useState<RegistroRiegoSector | null>(null);
  const [riegoFecha, setRiegoFecha] = useState(new Date().toISOString().slice(0, 10));
  const [riegoHora, setRiegoHora] = useState('08:00');
  const [riegoSector, setRiegoSector] = useState('Sector 1');
  const [riegoModalidad, setRiegoModalidad] = useState<'Solo Riego por Goteo' | 'Fertirriego'>('Solo Riego por Goteo');
  const [riegoFuente, setRiegoFuente] = useState('Tranque acumulador');
  const [riegoDuracion, setRiegoDuracion] = useState<number>(4.0);
  const [riegoVolumen, setRiegoVolumen] = useState<number>(250);
  const [riegoFertilizante, setRiegoFertilizante] = useState('Nitrato de Calcio');
  const [riegoDosis, setRiegoDosis] = useState<number>(35);
  const [riegoObservaciones, setRiegoObservaciones] = useState('');

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
              consumoHistoricoAcumulado: Math.max(0, Number((item.consumoHistoricoAcumulado - revertAmount).toFixed(2)))
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
              consumoHistoricoAcumulado: Number((item.consumoHistoricoAcumulado + deductionAmount).toFixed(2))
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
              consumoHistoricoAcumulado: Math.max(0, Number((item.consumoHistoricoAcumulado - restoreAmount).toFixed(2)))
            };
          }
          return item;
        })
      );
    }
    setLabores((prev) => prev.filter((l) => l.id !== id));
  };

  const handleExecuteReset = () => {
    const defaults = resetStorageToDefaults();
    setExplotacion(defaults.explotacion);
    setParcelas(defaults.parcelas);
    setLabores(defaults.labores);
    setInventario(defaults.inventario);
    setRegistrosPozo(defaults.registrosPozo);
    setRiegosSector([]);
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
    guardarEnSupabase({ ...defaults, riegosSector: [] });
  };

  // CÁLCULO DE RIEGO EXCLUSIVAMENTE PARA SECTOR 1, 2, 3 O 4
  const sectorSeleccionadoObj = SECTORES_RIEGO.find(s => s.nombre === riegoSector) || SECTORES_RIEGO[0];
  const sectorHa = sectorSeleccionadoObj.ha;
  
  // Lámina = m3 / (10 * ha)
  const laminaMmCalculada = (riegoVolumen > 0 && sectorHa > 0) 
    ? Number((riegoVolumen / (10 * sectorHa)).toFixed(2)) 
    : 0;

  // Fertilizante total = dosisKgHa * ha
  const fertilizanteTotalKg = (riegoDosis > 0 && sectorHa > 0)
    ? Number((riegoDosis * sectorHa).toFixed(1))
    : 0;

  // Guardar Riego
  const handleSaveRiegoModal = (e: React.FormEvent) => {
    e.preventDefault();
    const lts = (Number(riegoVolumen) || 0) * 1000;
    const nuevoRiego: RegistroRiegoSector = {
      id: editingRiego ? editingRiego.id : `rieg-${Date.now()}`,
      fecha: riegoFecha,
      horaInicio: riegoHora,
      sectorDestino: sectorSeleccionadoObj.nombre,
      superficieHa: sectorHa,
      tipoRiego: riegoModalidad,
      fuenteAgua: riegoFuente,
      duracionHoras: Number(riegoDuracion) || 0,
      volumenM3: Number(riegoVolumen) || 0,
      litrosTotales: lts,
      laminaMm: laminaMmCalculada,
      productoFertilizante: riegoModalidad === 'Fertirriego' ? riegoFertilizante : undefined,
      dosisKgHa: riegoModalidad === 'Fertirriego' ? Number(riegoDosis) || 0 : undefined,
      totalFertilizanteKg: riegoModalidad === 'Fertirriego' ? fertilizanteTotalKg : undefined,
      operador: activeUser.nombre,
      observaciones: riegoObservaciones || undefined
    };

    if (editingRiego) {
      setRiegosSector(prev => prev.map(r => r.id === editingRiego.id ? nuevoRiego : r));
    } else {
      setRiegosSector(prev => [nuevoRiego, ...prev]);
    }
    setIsModalRiegoOpen(false);
  };

  const lowStockCount = inventario.filter((i) => i.stockActual <= i.stockMinimo).length;

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
            onRegisterLaborForParcela={(pId) => handleOpenNewLaborWithDefaults(pId, undefined)}
          />
        )}

        {/* USUARIOS CON PRIVACIDAD TOTAL */}
        {activeTab === 'usuarios' && (
          <UsuariosView
            usuarios={usuarios}
            activeUserId={activeUserId}
            loggedInUser={loggedInUser}
            onSetActiveUser={setActiveUserId}
            onAddUsuario={(u) => {
              const userWithPass = { ...u, clave: (u as any).clave || '1234' };
              const nuevaLista = [...usuarios, userWithPass];
              setUsuarios(nuevaLista);
              guardarEnSupabase({
                explotacion,
                parcelas,
                labores,
                inventario,
                registrosPozo,
                riegosSector,
                lugares,
                usuarios: nuevaLista,
                activeUserId,
                muestreosMadurez,
                cosechasLote,
                ordenesTrabajo,
                horasFrio,
                fenologia,
                polinizacion
              });
            }}
            onUpdateUsuario={(u) => {
              const nuevaLista = usuarios.map((item) => item.id === u.id ? { ...u, clave: (u as any).clave || (item as any).clave || '1234' } : item);
              setUsuarios(nuevaLista);
              guardarEnSupabase({
                explotacion,
                parcelas,
                labores,
                inventario,
                registrosPozo,
                riegosSector,
                lugares,
                usuarios: nuevaLista,
                activeUserId,
                muestreosMadurez,
                cosechasLote,
                ordenesTrabajo,
                horasFrio,
                fenologia,
                polinizacion
              });
            }}
            onDeleteUsuario={(id) => {
              const nuevaLista = usuarios.filter((item) => item.id !== id);
              setUsuarios(nuevaLista);
              guardarEnSupabase({
                explotacion,
                parcelas,
                labores,
                inventario,
                registrosPozo,
                riegosSector,
                lugares,
                usuarios: nuevaLista,
                activeUserId,
                muestreosMadurez,
                cosechasLote,
                ordenesTrabajo,
                horasFrio,
                fenologia,
                polinizacion
              });
            }}
          />
        )}

        {activeTab === 'cosecha' && (
          <CosechaMadurezView
            parcelas={parcelas}
            muestreos={muestreosMadurez}
            onAddMuestreo={(m) => setMuestreosMadurez((prev) => [m, ...prev])}
            onDeleteMuestreo={(id) => setMuestreosMadurez((prev) => prev.filter((m) => m.id !== id))}
            cosechas={cosechasLote}
            onAddCosecha={(c) => setCosechasLote((prev) => [c, ...prev])}
            onDeleteCosecha={(id) => setCosechasLote((prev) => prev.filter((c) => c.id !== id))}
            activeUserName={activeUser?.nombre}
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
            onExecuteOrden={(ordenId, aplicadorNombre, firma) => {
              const orden = ordenesTrabajo.find((o) => o.id === ordenId);
              if (!orden) return;
              if (!orden.descontadoInventario && orden.insumoId) {
                setInventario((prev) =>
                  prev.map((item) => {
                    if (item.id === orden.insumoId) {
                      return {
                        ...item,
                        stockActual: Math.max(0, Number((item.stockActual - orden.totalProductoRequerido).toFixed(2))),
                        consumoHistoricoAcumulado: Number((item.consumoHistoricoAcumulado + orden.totalProductoRequerido).toFixed(2))
                      };
                    }
                    return item;
                  })
                );
              }
              setOrdenesTrabajo((prev) =>
                prev.map((o) => o.id === ordenId ? { ...o, estado: 'completada', aplicadorFirma: firma, descontadoInventario: true } : o)
              );
            }}
            onDeleteOrden={(id) => setOrdenesTrabajo((prev) => prev.filter((o) => o.id !== id))}
          />
        )}

        {activeTab === 'fenologia' && (
          <HorasFrioFenologiaView
            parcelas={parcelas}
            horasFrio={horasFrio}
            onUpdateHorasFrio={setHorasFrio}
            fenologia={fenologia}
            onAddFenologia={(f) => setFenologia((prev) => [f, ...prev])}
            onDeleteFenologia={(id) => setFenologia((prev) => prev.filter((f) => f.id !== id))}
            polinizacion={polinizacion}
            onAddPolinizacion={(p) => setPolinizacion((prev) => [p, ...prev])}
            onDeletePolinizacion={(id) => setPolinizacion((prev) => prev.filter((p) => p.id !== id))}
            activeUserName={activeUser?.nombre}
          />
        )}

        {/* LABORES (SIN RIEGO NI POZO) */}
        {activeTab === 'labores' && (
          <LaboresView
            labores={labores.filter(l => l.tipoLabor !== 'riego')}
            parcelas={parcelas}
            onOpenNewLabor={handleOpenNewLabor}
            onEditLabor={handleEditLabor}
            onDeleteLabor={handleDeleteLabor}
          />
        )}

        {activeTab === 'inventario' && (
          <InventarioView
            inventario={inventario}
            onAddInsumo={(i) => setInventario((prev) => [...prev, i])}
            onUpdateInsumo={(i) => setInventario((prev) => prev.map((item) => item.id === i.id ? i : item))}
            onDeleteInsumo={(id) => setInventario((prev) => prev.filter((item) => item.id !== id))}
          />
        )}

        {/* PESTAÑA EXCLUSIVA POZO PROFUNDO (DGA) */}
        {activeTab === 'pozo' && (
          <PozoView
            registrosPozo={registrosPozo}
            onAddRegistroPozo={(r) => setRegistrosPozo((prev) => [r, ...prev])}
            onUpdateRegistroPozo={(r) => setRegistrosPozo((prev) => prev.map((p) => p.id === r.id ? r : p))}
            onDeleteRegistroPozo={(id) => setRegistrosPozo((prev) => prev.filter((p) => p.id !== id))}
          />
        )}

        {/* PESTAÑA RIEGO EXCLUSIVA: SOLO SECTORES 1, 2, 3, 4 */}
        {activeTab === 'riego' && (
          <div className="space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                  <Waves className="w-5 h-5 text-blue-700" />
                  Control de Riego y Fertirriego por Sectores
                </h1>
                <p className="text-xs text-stone-500">
                  Riego distribuido exclusivamente en los 4 sectores del fundo. Cálculo automático de lámina (mm) y fertilizantes.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingRiego(null);
                  setRiegoFecha(new Date().toISOString().slice(0, 10));
                  setRiegoHora('08:00');
                  setRiegoSector('Sector 1');
                  setRiegoModalidad('Solo Riego por Goteo');
                  setRiegoFuente('Tranque acumulador');
                  setRiegoDuracion(4.0);
                  setRiegoVolumen(250);
                  setRiegoFertilizante('Nitrato de Calcio');
                  setRiegoDosis(35);
                  setRiegoObservaciones('');
                  setIsModalRiegoOpen(true);
                }}
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                + Registrar Riego al Sector
              </button>
            </div>

            {/* LAS 4 TARJETAS EXCLUSIVAS DE LOS SECTORES 1, 2, 3, 4 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SECTORES_RIEGO.map((sec) => {
                const riegosSectorActual = riegosSector.filter(r => r.sectorDestino === sec.nombre);
                const m3Sector = riegosSectorActual.reduce((a, b) => a + Number(b.volumenM3 || 0), 0);

                return (
                  <div key={sec.id} className="p-4 bg-white rounded-2xl border border-blue-200 shadow-2xs space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-blue-950 font-bold text-sm">{sec.nombre}</strong>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                        {sec.ha} ha
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-stone-900 font-mono mt-1">
                      {m3Sector.toLocaleString()} <span className="text-xs text-stone-500 font-normal">m³</span>
                    </div>
                    <p className="text-[10px] text-stone-400">
                      {riegosSectorActual.length} riegos aplicados
                    </p>
                  </div>
                );
              })}
            </div>

            {/* TABLA DE RIEGOS */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b text-stone-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Fecha & Hora</th>
                      <th className="p-3">Sector</th>
                      <th className="p-3">Superficie</th>
                      <th className="p-3">Modalidad</th>
                      <th className="p-3">Fuente Agua</th>
                      <th className="p-3">Horas / m³</th>
                      <th className="p-3">Lámina mm</th>
                      <th className="p-3">Fertirriego</th>
                      <th className="p-3">Regador</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {riegosSector.map((rg) => {
                      const esFertirriego = rg.tipoRiego === 'Fertirriego';
                      return (
                        <tr key={rg.id} className="hover:bg-stone-50/70">
                          <td className="p-3 font-mono">{rg.fecha} {rg.horaInicio}</td>
                          <td className="p-3 font-bold text-stone-900">{rg.sectorDestino}</td>
                          <td className="p-3 font-mono">{rg.superficieHa} ha</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              esFertirriego ? 'bg-emerald-100 text-emerald-950' : 'bg-blue-100 text-blue-950'
                            }`}>
                              {rg.tipoRiego}
                            </span>
                          </td>
                          <td className="p-3 text-stone-600">{rg.fuenteAgua}</td>
                          <td className="p-3 font-mono font-bold text-blue-950">{rg.duracionHoras} hrs ({rg.volumenM3} m³)</td>
                          <td className="p-3 font-mono font-bold text-sky-800">{rg.laminaMm || '-'} mm</td>
                          <td className="p-3">
                            {esFertirriego ? (
                              <div>
                                <strong className="text-emerald-950 block">{rg.productoFertilizante}</strong>
                                <span className="text-[10px] text-stone-500 font-mono">Dosis: {rg.dosisKgHa} kg/ha (Total: {rg.totalFertilizanteKg} kg)</span>
                              </div>
                            ) : (
                              <span className="text-stone-400 italic">Solo agua</span>
                            )}
                          </td>
                          <td className="p-3 text-stone-700">{rg.operador}</td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingRiego(rg);
                                setRiegoFecha(rg.fecha);
                                setRiegoHora(rg.horaInicio);
                                setRiegoSector(rg.sectorDestino);
                                setRiegoModalidad(rg.tipoRiego === 'Fertirriego' ? 'Fertirriego' : 'Solo Riego por Goteo');
                                setRiegoFuente(rg.fuenteAgua);
                                setRiegoDuracion(rg.duracionHoras);
                                setRiegoVolumen(rg.volumenM3);
                                setRiegoFertilizante(rg.productoFertilizante || 'Nitrato de Calcio');
                                setRiegoDosis(rg.dosisKgHa || 35);
                                setIsModalRiegoOpen(true);
                              }}
                              className="p-1 text-blue-700 hover:bg-blue-50 rounded mr-1 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setRiegosSector(prev => prev.filter(item => item.id !== rg.id));
                              }}
                              className="p-1 text-red-700 hover:bg-red-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {riegosSector.length === 0 && (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-stone-400">
                          No hay riegos registrados. Haz clic en <strong>"+ Registrar Riego al Sector"</strong> para ingresar el primero.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clima' && (
          <ClimaView
            clima={clima}
            onUpdateClima={setClima}
          />
        )}

        {activeTab === 'monitoreo' && (
          <MonitoreoView
            labores={labores}
            parcelas={parcelas}
            onOpenNewLaborWithDefaults={handleOpenNewLaborWithDefaults}
            onSaveQuickObservation={handleSaveLabor}
          />
        )}

        {activeTab === 'calculadora' && (
          <CalculadoraView />
        )}

        {/* INFORME OFICIAL SAG CON TODAS LAS TABLAS EN VIVO */}
        {activeTab === 'informe' && (
          <InformeOficialView
            explotacion={explotacion}
            parcelas={parcelas}
            labores={labores}
            inventario={inventario}
            registrosPozo={registrosPozo}
            riegosSector={riegosSector}
            muestreosMadurez={muestreosMadurez}
            cosechasLote={cosechasLote}
            ordenesTrabajo={ordenesTrabajo}
            usuarios={usuarios}
            onImportJSON={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const parsed = JSON.parse(event.target?.result as string);
                    if (parsed.explotacion) setExplotacion(parsed.explotacion);
                    if (parsed.parcelas) setParcelas(parsed.parcelas);
                    if (parsed.labores) setLabores(parsed.labores);
                    if (parsed.inventario) setInventario(parsed.inventario);
                    if (parsed.registrosPozo) setRegistrosPozo(parsed.registrosPozo);
                    if (parsed.riegosSector) setRiegosSector(parsed.riegosSector);
                    if (parsed.lugares) setLugares(parsed.lugares);
                    if (parsed.usuarios) setUsuarios(parsed.usuarios);
                    if (parsed.muestreosMadurez) setMuestreosMadurez(parsed.muestreosMadurez);
                    if (parsed.cosechasLote) setCosechasLote(parsed.cosechasLote);
                    if (parsed.ordenesTrabajo) setOrdenesTrabajo(parsed.ordenesTrabajo);
                    if (parsed.horasFrio) setHorasFrio(parsed.horasFrio);
                    if (parsed.fenologia) setFenologia(parsed.fenologia);
                    if (parsed.polinizacion) setPolinizacion(parsed.polinizacion);
                    guardarEnSupabase(parsed);
                  } catch (err) {
                    console.error('Error importando', err);
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
        )}
      </main>

      {/* MODAL REGISTRAR RIEGO AL SECTOR (SOLO SECTORES 1, 2, 3, 4) */}
      {isModalRiegoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border">
            <div className="px-6 py-4 border-b bg-blue-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-300" />
                {editingRiego ? 'Editar Riego' : 'Registrar Riego a Sector'}
              </h3>
              <button onClick={() => setIsModalRiegoOpen(false)} className="text-blue-200 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveRiegoModal} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              
              {/* SELECTOR EXCLUSIVO: SOLO SECTORES 1, 2, 3, 4 */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <label className="block font-bold text-blue-950 mb-1 uppercase tracking-wide">
                  Selecciona el Sector de Riego *
                </label>
                <select
                  value={riegoSector}
                  onChange={(e) => setRiegoSector(e.target.value)}
                  className="w-full p-2.5 bg-white border border-blue-300 rounded-lg font-bold text-stone-900 text-sm cursor-pointer"
                >
                  {SECTORES_RIEGO.map(s => (
                    <option key={s.id} value={s.nombre}>
                      {s.nombre} ({s.ha} hectáreas)
                    </option>
                  ))}
                </select>
              </div>

              {/* MODALIDAD */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">Modalidad de Riego *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRiegoModalidad('Solo Riego por Goteo')}
                    className={`p-3 rounded-xl border text-left font-bold cursor-pointer ${
                      riegoModalidad === 'Solo Riego por Goteo' ? 'bg-blue-900 text-white border-blue-900' : 'bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-400" />
                      <span>Solo Riego por Goteo</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRiegoModalidad('Fertirriego')}
                    className={`p-3 rounded-xl border text-left font-bold cursor-pointer ${
                      riegoModalidad === 'Fertirriego' ? 'bg-emerald-900 text-white border-emerald-900' : 'bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wheat className="w-4 h-4 text-emerald-300" />
                      <span>Fertirriego (Con Abono)</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* FUENTE AGUA Y DURACIÓN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fuente del Agua *</label>
                  <select value={riegoFuente} onChange={(e) => setRiegoFuente(e.target.value)} className="w-full p-2.5 bg-white border rounded-lg">
                    <option value="Tranque acumulador">🌊 Tranque acumulador</option>
                    <option value="Canal de regadío">💧 Canal de regadío / Canalistas</option>
                    <option value="Red presurizada">⚙️ Red presurizada / Matriz</option>
                    <option value="Pozo profundo">🏗️ Pozo profundo</option>
                    <option value="Otra fuente">📍 Otra fuente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duración (Horas) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={riegoDuracion}
                    onChange={(e) => setRiegoDuracion(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border rounded-lg font-bold"
                  />
                </div>
              </div>

              {/* VOLUMEN Y LÁMINA CALCULADA */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Volumen Estimado (m³) *</label>
                  <input
                    type="number"
                    required
                    value={riegoVolumen}
                    onChange={(e) => setRiegoVolumen(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border rounded-lg font-bold bg-white"
                  />
                </div>

                <div>
                  <span className="block font-semibold text-stone-500 mb-1">Lámina Calculada:</span>
                  <div className="text-xl font-extrabold text-blue-900 font-mono mt-1">
                    {laminaMmCalculada} mm
                  </div>
                  <span className="text-[10px] text-stone-500">Para {sectorHa} ha del {sectorSeleccionadoObj.nombre}</span>
                </div>
              </div>

              {/* FERTIRRIEGO */}
              {riegoModalidad === 'Fertirriego' && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 space-y-3">
                  <strong className="text-emerald-950 block">Fertirriego en {sectorSeleccionadoObj.nombre}</strong>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Producto / Abono *</label>
                      <input
                        type="text"
                        required
                        value={riegoFertilizante}
                        onChange={(e) => setRiegoFertilizante(e.target.value)}
                        placeholder="Ej: Nitrato de Calcio"
                        className="w-full p-2 border border-emerald-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Dosis (kg/ha) *</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={riegoDosis}
                        onChange={(e) => setRiegoDosis(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-emerald-300 rounded-lg bg-white font-bold"
                      />
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded border border-emerald-200 text-[11px] text-emerald-900 flex justify-between items-center font-bold">
                    <span>Abono Total a Disolver en Estanque:</span>
                    <span className="text-sm font-extrabold font-mono text-emerald-950">{fertilizanteTotalKg} kg</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fecha *</label>
                  <input type="date" required value={riegoFecha} onChange={(e) => setRiegoFecha(e.target.value)} className="w-full p-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Hora Inicio</label>
                  <input type="time" value={riegoHora} onChange={(e) => setRiegoHora(e.target.value)} className="w-full p-2 border rounded-lg font-mono" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones</label>
                <textarea rows={2} value={riegoObservaciones} onChange={(e) => setRiegoObservaciones(e.target.value)} placeholder="Lavado de matriz, presiones..." className="w-full p-2 border rounded-lg" />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalRiegoOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-700">Guardar Riego</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MI PERFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-stone-200 bg-emerald-950 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <UserCog className="w-4 h-4 text-emerald-400" />
                Mi Perfil y Contraseña
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMyProfile} className="p-5 space-y-4">
              {profileSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-stone-700 font-bold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={myNewName}
                  onChange={(e) => setMyNewName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Correo Electrónico (Tu usuario de ingreso) *</label>
                <input
                  type="email"
                  required
                  value={myNewEmail}
                  onChange={(e) => setMyNewEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Nueva Contraseña *</label>
                <input
                  type="text"
                  required
                  value={myNewPassword}
                  onChange={(e) => setMyNewPassword(e.target.value)}
                  placeholder="Escribe tu nueva clave secreta"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-sm font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <ModalLabor
        isOpen={isLaborModalOpen}
        onClose={() => {
          setIsLaborModalOpen(false);
          setEditingLabor(null);
        }}
        onSave={handleSaveLabor}
        parcelas={parcelas}
        inventario={inventario}
        climaActual={clima}
        usuarios={usuarios}
        activeUserId={activeUserId}
        initialLabor={editingLabor}
        defaultParcelaId={defaultParcelaId}
        defaultTipoLabor={defaultTipoLabor}
      />

      <ModalExplotacion
        isOpen={isExplotacionModalOpen}
        onClose={() => setIsExplotacionModalOpen(false)}
        explotacion={explotacion}
        onSave={setExplotacion}
      />

      <AlertasStockModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        inventario={inventario}
        onUpdateInsumo={(i) => setInventario((prev) => prev.map((item) => item.id === i.id ? i : item))}
        onNavigateToInventario={() => setActiveTab('inventario')}
      />

      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 bg-amber-950 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Vaciar Datos</h3>
              <button onClick={() => setIsResetConfirmOpen(false)} className="p-1 text-amber-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <p className="text-stone-700 text-sm">¿Deseas vaciar la base de datos para comenzar en blanco?</p>
              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Confirmar y Vaciar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="no-print mt-auto border-t border-stone-200 bg-white py-3.5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div>
            <span className="font-semibold text-stone-800">{explotacion.nombreFundo}</span>
            <span className="mx-2">·</span>
            <span>Cuaderno Oficial SAG</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => guardarEnSupabase()}
              className="text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar en Supabase
            </button>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Vaciar / Empezar en Blanco
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
