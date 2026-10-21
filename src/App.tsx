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
import { RotateCcw, X, CheckCircle2, Loader2, Save, RefreshCw, Database, Lock, LogIn, AlertCircle, LogOut, UserCog } from 'lucide-react';

const SUPABASE_URL = 'https://zvtolionewlulqmtdaty.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_s1vQx_x3_f3fDHHkdjVxZw_GTMkiU8I';

const USUARIO_INICIAL_ADMIN: UsuarioPredio & { clave?: string } = {
  id: 'usr-admin-diego',
  nombre: 'Diego Administrador',
  email: 'diego@fundolacabana.cl',
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
  const [lugares, setLugares] = useState<LugarPredio[]>(getStoredLugares);
  const [usuarios, setUsuarios] = useState<(UsuarioPredio & { clave?: string })[]>([
    { ...USUARIO_INICIAL_ADMIN, clave: '1234' }
  ]);
  const [activeUserId, setActiveUserId] = useState<string>('usr-admin-diego');
  const [clima, setClima] = useState<ClimaCondiciones>(initialClimaLaCabana);

  const [muestreosMadurez, setMuestreosMadurez] = useState<MuestreoMadurez[]>(getStoredMuestreosMadurez);
  const [cosechasLote, setCosechasLote] = useState<RegistroCosechaLote[]>(getStoredCosechasLote);
  const [ordenesTrabajo, setOrdenesTrabajo] = useState<OrdenTrabajoFitosanitaria[]>(getStoredOrdenesTrabajo);
  const [horasFrio, setHorasFrio] = useState<CondicionHorasFrio>(getStoredCondicionHorasFrio);
  const [fenologia, setFenologia] = useState<SeguimientoFenologico[]>(getStoredFenologia);
  const [polinizacion, setPolinizacion] = useState<RegistroPolinizacion[]>(getStoredPolinizacion);

  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [dbStatus, setDbStatus] = useState<'sincronizado' | 'guardando' | 'cargando' | 'error'>('cargando');
  const [dbMessage, setDbMessage] = useState('Conectando a Supabase...');

  // SISTEMA DE SESIÓN
  const [loggedInUser, setLoggedInUser] = useState<(UsuarioPredio & { clave?: string }) | null>(null);
  const [loginEmail, setLoginEmail] = useState('diego@fundolacabana.cl');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // MODAL PARA CAMBIAR CLAVE Y CORREO
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [myNewName, setMyNewName] = useState('');
  const [myNewEmail, setMyNewEmail] = useState('');
  const [myNewPassword, setMyNewPassword] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Modales
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<RegistroLabor | null>(null);
  const [defaultParcelaId, setDefaultParcelaId] = useState<string | undefined>(undefined);
  const [defaultTipoLabor, setDefaultTipoLabor] = useState<TipoLabor | undefined>(undefined);
  const [isExplotacionModalOpen, setIsExplotacionModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // 1. CARGA DESDE SUPABASE AL ABRIR LA APP
  const cargarDesdeSupabase = () => {
    setDbStatus('cargando');
    setDbMessage('Descargando datos de Supabase...');

    fetch(`${SUPABASE_URL}/rest/v1/fundo_datos?id=eq.fundo_la_cabana&select=datos`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((filas) => {
        if (Array.isArray(filas) && filas.length > 0 && filas[0].datos) {
          const datos = filas[0].datos;
          if (datos.explotacion) setExplotacion(datos.explotacion);
          if (Array.isArray(datos.parcelas)) setParcelas(datos.parcelas);
          if (Array.isArray(datos.labores)) setLabores(datos.labores);
          if (Array.isArray(datos.inventario)) setInventario(datos.inventario);
          if (Array.isArray(datos.registrosPozo)) setRegistrosPozo(datos.registrosPozo);
          if (Array.isArray(datos.lugares)) setLugares(datos.lugares);
          if (Array.isArray(datos.usuarios) && datos.usuarios.length > 0) {
            setUsuarios(datos.usuarios);
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
      })
      .catch((err) => {
        console.warn('Iniciando con memoria local:', err);
        setIsDbLoaded(true);
        setDbStatus('sincronizado');
        setDbMessage('Modo local activo');
      });
  };

  useEffect(() => {
    cargarDesdeSupabase();

    const savedUserId = localStorage.getItem('fundo_sesion_id');
    if (savedUserId) {
      const u = usuarios.find((item) => item.id === savedUserId);
      if (u) {
        setLoggedInUser(u);
        setActiveUserId(u.id);
      }
    }
  }, []);

  // 2. GUARDAR EN SUPABASE (CON ENLACE POSTGREST BLINDADO)
  const guardarEnSupabase = (datosPersonalizados?: any) => {
    setDbStatus('guardando');
    setDbMessage('Guardando en Supabase...');

    const payload = datosPersonalizados || {
      explotacion,
      parcelas,
      labores,
      inventario,
      registrosPozo,
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

    // LLAMADA EXACTA QUE SUPABASE ESPERA: ?on_conflict=id y cuerpo en array [{ ... }]
    fetch(`${SUPABASE_URL}/rest/v1/fundo_datos?on_conflict=id`, {
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
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al guardar');
        setDbStatus('sincronizado');
        setDbMessage(`Guardado en Supabase (${new Date().toLocaleTimeString('es-CL')})`);
      })
      .catch((err) => {
        console.error('Error guardando en Supabase:', err);
        setDbStatus('error');
        setDbMessage('Error al enviar a Supabase');
      });
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const user = usuarios.find(
      (u) => u.email.trim().toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!user) {
      setLoginError('No existe ningún usuario con este correo electrónico.');
      return;
    }

    const userPass = user.clave || '1234';

    if (loginPassword !== userPass) {
      setLoginError('Contraseña incorrecta.');
      return;
    }

    setLoggedInUser(user);
    setActiveUserId(user.id);
    localStorage.setItem('fundo_sesion_id', user.id);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('fundo_sesion_id');
    setLoginPassword('');
  };

  // GUARDAR MI PERFIL, CORREO Y CONTRASEÑA
  const handleSaveMyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInUser) return;

    const updatedUser = {
      ...loggedInUser,
      nombre: myNewName.trim() || loggedInUser.nombre,
      email: myNewEmail.trim().toLowerCase() || loggedInUser.email,
      clave: myNewPassword.trim() || loggedInUser.clave || '1234'
    };

    setLoggedInUser(updatedUser);
    setUsuarios((prev) => prev.map((u) => u.id === updatedUser.id ? updatedUser : u));

    // Guardado inmediato en Supabase
    guardarEnSupabase();

    setProfileSuccessMsg('¡Datos actualizados con éxito!');
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

    if (laborToSave.tipoLabor === 'riego' && laborToSave.volumenM3) {
      const m3 = Number(laborToSave.volumenM3);
      const lts = m3 * 1000;
      const hrs = laborToSave.duracionRiegoHoras || 4;
      const caudal = hrs > 0 ? Number((lts / (hrs * 3600)).toFixed(1)) : 23.5;

      if (isEdit && oldLabor?.registroPozoId) {
        setRegistrosPozo((prev) =>
          prev.map((r) => {
            if (r.id === oldLabor.registroPozoId) {
              return {
                ...r,
                fecha: laborToSave.fecha,
                hora: laborToSave.hora || '07:00',
                metrosCubicosExtraidos: m3,
                litrosTotales: lts,
                horasBombeo: hrs,
                caudalPromedioLs: caudal,
                sectorDestino: laborToSave.parcelaNombre,
                operadorBomba: laborToSave.registradoPor || activeUser?.nombre || 'Operador'
              };
            }
            return r;
          })
        );
        laborToSave.registroPozoId = oldLabor.registroPozoId;
        laborToSave.litrosAgua = lts;
      } else {
        const latestFinalM3 = registrosPozo.length > 0 
          ? Math.max(...registrosPozo.map((r) => r.lecturaFinalM3))
          : 0;

        const nuevoRegistroPozo: RegistroExtraccionPozo = {
          id: `pz-auto-${Date.now()}`,
          fecha: laborToSave.fecha,
          hora: laborToSave.hora || '07:00',
          lecturaInicialM3: latestFinalM3,
          lecturaFinalM3: latestFinalM3 + m3,
          metrosCubicosExtraidos: m3,
          litrosTotales: lts,
          horasBombeo: hrs,
          caudalPromedioLs: caudal,
          sectorDestino: laborToSave.parcelaNombre,
          operadorBomba: laborToSave.registradoPor || activeUser?.nombre || 'Operador',
          observaciones: `Extracción registrada desde labor de riego en ${laborToSave.parcelaNombre}`
        };

        setRegistrosPozo((prev) => [nuevoRegistroPozo, ...prev]);
        laborToSave.registroPozoId = nuevoRegistroPozo.id;
        laborToSave.litrosAgua = lts;
      }
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
    if (labor) {
      if (labor.insumoId && labor.totalInsumoUtilizado) {
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
      if (labor.registroPozoId) {
        setRegistrosPozo((prev) => prev.filter((r) => r.id !== labor.registroPozoId));
      }
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
    setLugares(defaults.lugares);
    setUsuarios(defaults.usuarios);
    setMuestreosMadurez(defaults.muestreosMadurez);
    setCosechasLote(defaults.cosechasLote);
    setOrdenesTrabajo(defaults.ordenesTrabajo);
    setHorasFrio(defaults.condicionHorasFrio);
    setFenologia(defaults.fenologia);
    setPolinizacion(defaults.polinizacion);
    setActiveUserId(defaults.usuarios[0]?.id || 'usr-1');
    setIsResetConfirmOpen(false);
    guardarEnSupabase(defaults);
  };

  const lowStockCount = inventario.filter((i) => i.stockActual <= i.stockMinimo).length;

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
                Selecciona tu Usuario o Escribe tu Correo *
              </label>
              <select
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 font-medium bg-white text-stone-900 mb-2"
              >
                {usuarios.map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.nombre} ({u.email})
                  </option>
                ))}
              </select>

              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="correo@fundolacabana.cl"
                className="w-full p-2.5 rounded-lg border border-stone-300"
              />
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
                className="w-full p-2.5 rounded-lg border border-stone-300 text-sm"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                *(Clave por defecto: <strong>1234</strong>)*
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Ingresar al Cuaderno
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 pb-16 sm:pb-0">
      {/* BARRA SUPERIOR DE CONEXIÓN CON SUPABASE & BOTÓN MI PERFIL */}
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
          {/* BOTÓN PARA CAMBIAR NOMBRE, CORREO Y CLAVE */}
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

        {activeTab === 'usuarios' && (
          <UsuariosView
            usuarios={usuarios}
            activeUserId={activeUserId}
            onSetActiveUser={setActiveUserId}
            onAddUsuario={(u) => {
              const userWithPass = { ...u, clave: (u as any).clave || '1234' };
              setUsuarios((prev) => [...prev, userWithPass]);
            }}
            onUpdateUsuario={(u) => setUsuarios((prev) => prev.map((item) => item.id === u.id ? { ...u, clave: (item as any).clave || '1234' } : item))}
            onDeleteUsuario={(id) => setUsuarios((prev) => prev.filter((item) => item.id !== id))}
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

        {activeTab === 'labores' && (
          <LaboresView
            labores={labores}
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

        {activeTab === 'pozo' && (
          <PozoView
            registrosPozo={registrosPozo}
            onAddRegistroPozo={(r) => setRegistrosPozo((prev) => [r, ...prev])}
            onUpdateRegistroPozo={(r) => setRegistrosPozo((prev) => prev.map((p) => p.id === r.id ? r : p))}
            onDeleteRegistroPozo={(id) => setRegistrosPozo((prev) => prev.filter((p) => p.id !== id))}
          />
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

        {activeTab === 'informe' && (
          <InformeOficialView
            explotacion={explotacion}
            parcelas={parcelas}
            labores={labores}
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

      {/* MODAL CAMBIAR NOMBRE, CORREO Y CONTRASEÑA */}
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
                <label className="block text-stone-700 font-bold mb-1">Correo Electrónico (Para iniciar sesión) *</label>
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
                  placeholder="Escribe tu nueva clave"
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
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
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
