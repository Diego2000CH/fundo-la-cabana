import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Package, 
  Droplet, 
  CloudSun, 
  MapPin, 
  Sprout, 
  Bug, 
  Calculator, 
  FileText, 
  LayoutDashboard,
  Users,
  Bell,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Apple,
  FileCheck2,
  Snowflake,
  Compass
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
    { id: 'fenologia', label: 'Horas Frío & Polinización', icon: Snowflake },
    { id: 'labores', label: 'Cuaderno Labores', icon: Sprout },
    { id: 'inventario', label: 'Bodega Insumos', icon: Package, badge: lowStockCount },
    { id: 'pozo', label: 'Pozo & Riego', icon: Droplet },
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
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                onClick={() => handleSelectTab('dashboard')} 
                className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none"
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

            {/* Zone 2: Navigation Links (Desktop with Horizontal Scroll or Priority Links) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-stone-600 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => handleSelectTab('dashboard')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Resumen
              </button>

              <button
                onClick={() => handleSelectTab('parcelas')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'parcelas'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-emerald-50 text-emerald-950 font-bold bg-emerald-50/50 border border-emerald-200/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                Cuarteles & Mapa
              </button>

              <button
                onClick={() => handleSelectTab('usuarios')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'usuarios'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-indigo-50 text-indigo-950 font-bold bg-indigo-50/50 border border-indigo-200/60'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-700" />
                Equipo & Usuarios
              </button>

              <button
                onClick={() => handleSelectTab('cosecha')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'cosecha'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Apple className="w-3.5 h-3.5 text-amber-700" />
                Cosecha & °Brix
              </button>

              <button
                onClick={() => handleSelectTab('ordenes')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'ordenes'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
                Órdenes & Recetas
              </button>

              <button
                onClick={() => handleSelectTab('fenologia')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'fenologia'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5 text-sky-700" />
                Horas Frío & Polinización
              </button>

              <button
                onClick={() => handleSelectTab('labores')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'labores'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" />
                Labores
              </button>

              <button
                onClick={() => handleSelectTab('inventario')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'inventario'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                Bodega
                {lowStockCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    {lowStockCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleSelectTab('pozo')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'pozo'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Droplet className="w-3.5 h-3.5 text-sky-600" />
                Pozo
              </button>

              <button
                onClick={() => handleSelectTab('clima')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'clima'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <CloudSun className="w-3.5 h-3.5 text-orange-500" />
                Clima
              </button>

              <button
                onClick={() => handleSelectTab('informe')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'informe'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Informe SAG
              </button>
            </nav>

            {/* Zone 3: Actions, Alerts, User Avatar and Mobile Menu Button */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Alert Bell Button */}
              {onOpenAlertsModal && (
                <button
                  type="button"
                  onClick={onOpenAlertsModal}
                  aria-label="Ver alertas de stock"
                  className="relative p-2 rounded-xl text-stone-600 hover:text-amber-900 hover:bg-amber-50 transition-colors flex items-center justify-center"
                  title="Alertas de stock en bodega"
                >
                  <Bell className="w-5 h-5" />
                  {lowStockCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {lowStockCount}
                    </span>
                  )}
                </button>
              )}

              {/* Active User Avatar Chip (Clickable to jump to Usuarios) */}
              {activeUser && (
                <button
                  type="button"
                  onClick={() => handleSelectTab('usuarios')}
                  className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors text-left"
                  title="Ver y administrar usuarios del predio"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${activeUser.avatarColor || 'bg-emerald-800 text-white'}`}>
                    {activeUser.nombre.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <span className="block text-xs font-semibold text-stone-900 truncate max-w-[100px]">
                      {activeUser.nombre.split(' ')[0]}
                    </span>
                    <span className="block text-[9px] text-stone-500 font-medium capitalize truncate max-w-[100px]">
                      {activeUser.rol.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              )}

              {/* CTA Labor Button */}
              <button
                type="button"
                onClick={onOpenNewLabor}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 active:scale-95 transition-all rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nueva Labor</span>
              </button>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                aria-label="Abrir menú de navegación"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER (Full navigation for smartphones and tablets) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 bg-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="font-bold text-sm">{fundoNombre}</h3>
                  <span className="text-[10px] text-emerald-300">100% Kiwi Hayward</span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info in drawer */}
            {activeUser && (
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${activeUser.avatarColor || 'bg-emerald-800 text-white'}`}>
                    {activeUser.nombre.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-stone-900">{activeUser.nombre}</span>
                    <span className="block text-[10px] text-stone-500 capitalize">{activeUser.rol.replace('_', ' ')}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectTab('usuarios')}
                  className="text-xs font-bold text-emerald-800"
                >
                  Cambiar
                </button>
              </div>
            )}

            {/* Drawer Links */}
            <nav className="p-3 space-y-1 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-emerald-900 text-white font-bold shadow-xs'
                        : item.highlight
                        ? 'bg-emerald-50/70 text-emerald-950 hover:bg-emerald-100 font-bold border border-emerald-200'
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

            {/* Bottom Drawer Actions */}
            <div className="mt-auto p-4 border-t border-stone-200 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenNewLabor();
                }}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Registrar Nueva Labor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
