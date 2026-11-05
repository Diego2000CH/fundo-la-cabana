import React, { useState } from 'react';
import { 
  Sprout, 
  Package, 
  Droplet, 
  Waves, 
  Sun, 
  Bug, 
  Calculator, 
  FileText, 
  Plus, 
  Bell,
  Layers
} from 'lucide-react';

import { Parcela, InsumoInventario, UsuarioPredio, RegistroLabor, OrdenTrabajoFitosanitaria, CondicionClima } from './types/campo';
import { LaboresView } from './components/LaboresView';
import { BodegaView } from './components/BodegaView';
import { CalculadoraView } from './components/CalculadoraView';
import { OrdenesTrabajoView } from './components/OrdenesTrabajoView';
import { ModalLabor } from './components/ModalLabor';

// Datos Iniciales de Ejemplo
const INITIAL_PARCELAS: Parcela[] = [
  { id: 'c1', nombre: 'Cuartel 1 - Kiwi Hayward', superficieHa: 2.8, variedad: 'Kiwi Hayward', anoPlantacion: 2015 },
  { id: 'c2', nombre: 'Cuartel 2 - Kiwi Hayward', superficieHa: 4.9, variedad: 'Kiwi Hayward', anoPlantacion: 2017 },
  { id: 'c3', nombre: 'Cuartel 3 - Kiwi Hayward Formacion', superficieHa: 5.4, variedad: 'Kiwi Hayward', anoPlantacion: 2021 }
];

const INITIAL_INVENTARIO: InsumoInventario[] = [
  { id: 'ins-1', nombreComercial: 'Cobre Hidróxido 50 WP', materiaActiva: 'Hidróxido de Cobre', categoria: 'Fungicida', stockActual: 45, unidad: 'kg', numeroRegistroSAG: '1234-SAG' },
  { id: 'ins-2', nombreComercial: 'Spirotetramat 240 SC', materiaActiva: 'Spirotetramat', categoria: 'Insecticida', stockActual: 12, unidad: 'L', numeroRegistroSAG: '5678-SAG' },
  { id: 'ins-3', nombreComercial: 'Nitrato de Calcio', materiaActiva: 'Nitrato de Calcio', categoria: 'Fertilizante', stockActual: 500, unidad: 'kg' },
  { id: 'ins-4', nombreComercial: 'Glifosato 480 SL', materiaActiva: 'Glifosato', categoria: 'Herbicida', stockActual: 30, unidad: 'L', numeroRegistroSAG: '9912-SAG' }
];

const INITIAL_USUARIOS: UsuarioPredio[] = [
  { id: 'usr-1', nombre: 'Diego Pereira Ramirez', rol: 'Agronomo', numeroRegistroSAG: 'SAG-8921-CL' },
  { id: 'usr-2', nombre: 'Juan Pérez', rol: 'Aplicador', numeroRegistroSAG: 'APL-SAG-3312' }
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
    eppObligatorio: ['Máscara respiratoria', 'Buzo impermeble', 'Guantes nitrilo'],
    agronomoEmisorId: 'usr-1',
    agronomoEmisorNombre: 'Diego Pereira Ramirez',
    agronomoRegistroSAG: 'SAG-8921-CL',
    aplicadorAsignadoId: 'usr-2',
    aplicadorAsignadoNombre: 'Juan Pérez',
    maquinariaTractor: 'Tractor John Deere + Pulverizadora 2000L',
    descontadoInventario: false
  }
];

export function App() {
  // Estado de Pestañas
  const [activeTab, setActiveTab] = useState<
    'labores' | 'bodega' | 'calculadora' | 'ordenes'
  >('labores');

  // Datos globales de la aplicación
  const [parcelas] = useState<Parcela[]>(INITIAL_PARCELAS);
  const [inventario, setInventario] = useState<InsumoInventario[]>(INITIAL_INVENTARIO);
  const [usuarios] = useState<UsuarioPredio[]>(INITIAL_USUARIOS);
  const [labores, setLabores] = useState<RegistroLabor[]>(INITIAL_LABORES);
  const [ordenes, setOrdenes] = useState<OrdenTrabajoFitosanitaria[]>(INITIAL_ORDENES);
  const [activeUserId] = useState<string>('usr-1');

  // Control del Modal de Labores
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<RegistroLabor | null>(null);
  const [defaultParcelaId, setDefaultParcelaId] = useState<string>('');
  const [defaultTipoLabor, setDefaultTipoLabor] = useState<any>('Aplicacion Fitosanitaria');

  // Abrir Modal de Nueva Labor
  const handleOpenNewLabor = () => {
    setEditingLabor(null);
    setDefaultParcelaId(parcelas[0]?.id || '');
    setDefaultTipoLabor('Aplicacion Fitosanitaria');
    setIsLaborModalOpen(true);
  };

  // Abrir Modal para Editar Labor
  const handleEditLabor = (labor: RegistroLabor) => {
    setEditingLabor(labor);
    setIsLaborModalOpen(true);
  };

  // Guardar / Crear / Editar Labor
  const handleSaveLabor = (laborGuardar: RegistroLabor) => {
    if (editingLabor) {
      setLabores(labores.map(l => l.id === laborGuardar.id ? laborGuardar : l));
    } else {
      setLabores([laborGuardar, ...labores]);
      
      // Si incluye descuento de insumo
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

  // Eliminar Labor
  const handleDeleteLabor = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro de labor?')) {
      setLabores(labores.filter(l => l.id !== id));
    }
  };

  // Manejo de Órdenes de Trabajo (Recetas)
  const handleAddOrden = (nuevaOrden: OrdenTrabajoFitosanitaria) => {
    setOrdenes([nuevaOrden, ...ordenes]);
  };

  const handleUpdateOrden = (ordenActualizada: OrdenTrabajoFitosanitaria) => {
    setOrdenes(ordenes.map(o => o.id === ordenActualizada.id ? ordenActualizada : o));
  };

  const handleDeleteOrden = (ordenId: string) => {
    if (confirm('¿Eliminar esta receta / orden de trabajo?')) {
      setOrdenes(ordenes.filter(o => o.id !== ordenId));
    }
  };

  const handleExecuteOrden = (ordenId: string, aplicadorNombre: string, firma: string) => {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;

    // Descontar inventario de cada producto
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

    // Actualizar estado de la Orden
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

  // Manejo del Inventario (Bodega)
  const handleAddInsumo = (nuevo: InsumoInventario) => {
    setInventario([...inventario, nuevo]);
  };

  const handleUpdateInsumo = (editado: InsumoInventario) => {
    setInventario(inventario.map(i => i.id === editado.id ? editado : i));
  };

  const handleDeleteInsumo = (id: string) => {
    if (confirm('¿Eliminar este producto de bodega?')) {
      setInventario(inventario.filter(i => i.id !== id));
    }
  };

  const activeUser = usuarios.find(u => u.id === activeUserId);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      
      {/* NAVBAR SUPERIOR */}
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

          {/* MENU NAVEGACIÓN DE PESTAÑAS */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('labores')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'labores' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Sprout className="w-4 h-4" /> Labores
            </button>

            <button
              onClick={() => setActiveTab('ordenes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ordenes' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <FileText className="w-4 h-4" /> Recetas SAG
            </button>

            <button
              onClick={() => setActiveTab('bodega')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bodega' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Package className="w-4 h-4" /> Bodega Insumos
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-700 rounded-full text-[10px]">
                {inventario.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calculadora')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'calculadora' ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-100 hover:bg-emerald-900/60'
              }`}
            >
              <Calculator className="w-4 h-4" /> Calculadora
            </button>
          </nav>

          {/* BOTÓN NUEVA LABOR RÁPIDO */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenNewLabor}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> + Nueva Labor
            </button>
          </div>

        </div>
      </header>

      {/* MENU NAVEGACIÓN MÓVIL */}
      <div className="md:hidden flex bg-emerald-900 text-white border-b border-emerald-800 overflow-x-auto p-1.5 gap-1 text-xs">
        <button 
          onClick={() => setActiveTab('labores')} 
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${activeTab === 'labores' ? 'bg-emerald-700' : ''}`}
        >
          Labores
        </button>
        <button 
          onClick={() => setActiveTab('ordenes')} 
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${activeTab === 'ordenes' ? 'bg-emerald-700' : ''}`}
        >
          Recetas SAG
        </button>
        <button 
          onClick={() => setActiveTab('bodega')} 
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${activeTab === 'bodega' ? 'bg-emerald-700' : ''}`}
        >
          Bodega ({inventario.length})
        </button>
        <button 
          onClick={() => setActiveTab('calculadora')} 
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${activeTab === 'calculadora' ? 'bg-emerald-700' : ''}`}
        >
          Calculadora
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        
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
            ordenes={ordenes}
            parcelas={parcelas}
            inventario={inventario}
            usuarios={usuarios}
            activeUser={activeUser}
            onAddOrden={handleAddOrden}
            onUpdateOrden={handleUpdateOrden}
            onExecuteOrden={handleExecuteOrden}
            onDeleteOrden={handleDeleteOrden}
          />
        )}

        {activeTab === 'bodega' && (
          <BodegaView
            inventario={inventario}
            onAddInsumo={handleAddInsumo}
            onUpdateInsumo={handleUpdateInsumo}
            onDeleteInsumo={handleDeleteInsumo}
          />
        )}

        {activeTab === 'calculadora' && (
          <CalculadoraView
            parcelas={parcelas}
            inventario={inventario}
          />
        )}

      </main>

      {/* MODAL REGISTRAR / EDITAR LABOR */}
      {isLaborModalOpen && (
        <ModalLabor
          isOpen={isLaborModalOpen}
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

    </div>
  );
}

export default App;
