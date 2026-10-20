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
  getStoredParcelas, 
  getStoredLabores, 
  getStoredInventario, 
  getStoredRegistrosPozo, 
  getStoredLugares, 
  getStoredUsuarios, 
  getStoredActiveUserId, 
  getStoredMuestreosMadurez, 
  getStoredCosechasLote, 
  getStoredOrdenesTrabajo, 
  getStoredCondicionHorasFrio, 
  getStoredFenologia, 
  getStoredPolinizacion, 
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
import { RotateCcw, X, HardDrive } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [explotacion, setExplotacion] = useState<ExplotacionAgricola>(getStoredExplotacion);
  const [parcelas, setParcelas] = useState<Parcela[]>(getStoredParcelas);
  const [labores, setLabores] = useState<RegistroLabor[]>(getStoredLabores);
  const [inventario, setInventario] = useState<InsumoInventario[]>(getStoredInventario);
  const [registrosPozo, setRegistrosPozo] = useState<RegistroExtraccionPozo[]>(getStoredRegistrosPozo);
  const [lugares, setLugares] = useState<LugarPredio[]>(getStoredLugares);
  const [usuarios, setUsuarios] = useState<UsuarioPredio[]>(getStoredUsuarios);
  const [activeUserId, setActiveUserId] = useState<string>(getStoredActiveUserId);
  const [clima, setClima] = useState<ClimaCondiciones>(initialClimaLaCabana);

  const [muestreosMadurez, setMuestreosMadurez] = useState<MuestreoMadurez[]>(getStoredMuestreosMadurez);
  const [cosechasLote, setCosechasLote] = useState<RegistroCosechaLote[]>(getStoredCosechasLote);
  const [ordenesTrabajo, setOrdenesTrabajo] = useState<OrdenTrabajoFitosanitaria[]>(getStoredOrdenesTrabajo);
  const [horasFrio, setHorasFrio] = useState<CondicionHorasFrio>(getStoredCondicionHorasFrio);
  const [fenologia, setFenologia] = useState<SeguimientoFenologico[]>(getStoredFenologia);
  const [polinizacion, setPolinizacion] = useState<RegistroPolinizacion[]>(getStoredPolinizacion);

  const [isLoadedFromDisk, setIsLoadedFromDisk] = useState(false);

  // Modals state
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<RegistroLabor | null>(null);
  const [defaultParcelaId, setDefaultParcelaId] = useState<string | undefined>(undefined);
  const [defaultTipoLabor, setDefaultTipoLabor] = useState<TipoLabor | undefined>(undefined);
  const [isExplotacionModalOpen, setIsExplotacionModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // 1. CARGA AUTOMÁTICA DESDE EL ARCHIVO CENTRAL AL ABRIR CUALQUIER NAVEGADOR
  useEffect(() => {
    fetch('/api/datos')
      .then((res) => res.json())
      .then((datos) => {
        if (datos && datos.explotacion) {
          setExplotacion(datos.explotacion);
          if (datos.parcelas) setParcelas(datos.parcelas);
          if (datos.labores) setLabores(datos.labores);
          if (datos.inventario) setInventario(datos.inventario);
          if (datos.registrosPozo) setRegistrosPozo(datos.registrosPozo);
          if (datos.lugares) setLugares(datos.lugares);
          if (datos.usuarios) setUsuarios(datos.usuarios);
          if (datos.activeUserId) setActiveUserId(datos.activeUserId);
          if (datos.muestreosMadurez) setMuestreosMadurez(datos.muestreosMadurez);
          if (datos.cosechasLote) setCosechasLote(datos.cosechasLote);
          if (datos.ordenesTrabajo) setOrdenesTrabajo(datos.ordenesTrabajo);
          if (datos.horasFrio) setHorasFrio(datos.horasFrio);
          if (datos.fenologia) setFenologia(datos.fenologia);
          if (datos.polinizacion) setPolinizacion(datos.polinizacion);
        }
        setIsLoadedFromDisk(true);
      })
      .catch((err) => {
        console.warn('Iniciando con datos locales:', err);
        setIsLoadedFromDisk(true);
      });
  }, []);

  // 2. GUARDADO AUTOMÁTICO EN EL ARCHIVO CENTRAL ANTE CUALQUIER CAMBIO
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (!isLoadedFromDisk) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const datosCompletos = {
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

      fetch('/api/datos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompletos)
      }).catch((err) => console.error('Error guardando en archivo central:', err));
    }, 400);

    return () => clearTimeout(timer);
  }, [
    isLoadedFromDisk,
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

  const activeUser = usuarios.find((u) => u.id === activeUserId) || usuarios[0];

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
                operadorBomba: laborToSave.registradoPor || activeUser?.nombre || 'Carlos Morales Vega'
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
          : 41630;

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
          operadorBomba: laborToSave.registradoPor || activeUser?.nombre || 'Carlos Morales Vega',
          observaciones: `Extracción automática registrada desde labor de riego en ${laborToSave.parcelaNombre}`
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
  };

  const lowStockCount = inventario.filter((i) => i.stockActual <= i.stockMinimo).length;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 pb-16 sm:pb-0">
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
            onAddUsuario={(u) => setUsuarios((prev) => [...prev, u])}
            onUpdateUsuario={(u) => setUsuarios((prev) => prev.map((item) => item.id === u.id ? u : item))}
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
              <h3 className="font-bold text-sm">Restablecer Datos de Demostración</h3>
              <button onClick={() => setIsResetConfirmOpen(false)} className="p-1 text-amber-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <p className="text-stone-700 text-sm">¿Deseas restablecer Fundo La Cabaña a sus datos iniciales?</p>
              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Restablecer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="no-print mt-auto border-t border-stone-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">{explotacion.nombreFundo}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
              Guardado automático central activo
            </span>
          </div>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer Datos
          </button>
        </div>
      </footer>
    </div>
  );
}
