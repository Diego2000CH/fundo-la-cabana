import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Package, 
  Droplet, 
  CloudSun, 
  Sprout, 
  Bug, 
  Calculator, 
  FileText, 
  LayoutDashboard,
  Users,
  Bell,
  Menu,
  X,
  Apple,
  FileCheck2,
  Snowflake,
  Compass,
  Waves
} from 'lucide-react';
import { UsuarioPredio } from '../types/campo';

export type ActiveTab = 
  | 'dashboard' 
  | 'parcelas' 
  | 'usuarios'
  | 'cosecha' 
  | 'ordenes' 
  | 'fenologia' 
  | 'labores' 
  | 'inventario' 
  | 'pozo' 
  | 'riego'
  | 'clima' 
  | 'monitoreo' 
  | 'calculadora' 
  | 'informe';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewLabor: () => void;
  fundoNombre: string;
  lowStockCount?: number;
  onOpenAlertsModal?: () => void;
  activeUser?: UsuarioPredio;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewLabor,
  fundoNombre,
  lowStockCount = 0,
  onOpenAlertsModal,
  activeUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'parcelas', label: 'Cuarteles & Mapa', icon: Compass, highlight: true },
    { id: 'usuarios', label: 'Usuarios & Equipo', icon: Users, highlight: true },
    { id: 'cosecha', label: 'Cosecha & °Brix', icon: Apple },
    { id: 'ordenes', label: 'Órdenes & Recetas', icon: FileCheck2 },
    { id: 'fenologia', label: 'Yemas, Frío & Fenología', icon: Snowflake },
    { id: 'labores', label: 'Cuaderno Labores', icon: Sprout },
    { id: 'inventario', label: 'Bodega Insumos', icon: Package, badge: lowStockCount },
    { id: 'pozo', label: 'Pozo DGA', icon: Droplet },
    { id: 'riego', label: 'Riego', icon: Waves },
    { id: 'clima', label: 'Clima', icon: CloudSun },
    { id: 'monitoreo', label: 'Psa & Plagas', icon: Bug },
    { id: 'calculadora', label: 'Calculadora', icon: Calculator },
    { id: 'informe', label: 'Informe SAG', icon: FileText }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                onClick={() => handleSelectTab('dashboard')} 
                className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-50 flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-bold tracking-tight text-stone-900 group-hover:text-emerald-900 transition-colors whitespace-nowrap block leading-tight">
                    {fundoNombre}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-emerald-800 font-semibold whitespace-nowrap leading-none block">
                    100% Kiwi Hayward · Cuaderno SAG
                  </span>
                </div>
              </button>
            </div>

            {/* Menú de Escritorio con Riego separado */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-stone-600 overflow-x-auto no-scrollbar py-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id as ActiveTab)}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : item.highlight
                        ? 'hover:bg-emerald-50 text-emerald-950 font-bold bg-emerald-50/50 border border-emerald-200/60'
                        : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Acciones derecha */}
            <div className="flex items-center gap-2 shrink-0">
              {onOpenAlertsModal && (
                <button
                  type="button"
                  onClick={onOpenAlertsModal}
                  className="relative p-2 rounded-xl text-stone-600 hover:text-amber-900 hover:bg-amber-50 transition-colors flex items-center justify-center cursor-pointer"
                  title="Alertas de stock en bodega"
                >
                  <Bell className="w-5 h-5" />
                  {lowStockCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {lowStockCount}
                    </span>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={onOpenNewLabor}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 active:scale-95 transition-all rounded-xl shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nueva Labor</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú Móvil (Celulares y Tablets) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-stone-200 bg-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="font-bold text-sm">{fundoNombre}</h3>
                  <span className="text-[10px] text-emerald-300">Cuaderno Digital Kiwi Hayward</span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-3 space-y-1 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-900 text-white font-bold shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
