import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  UserCheck, 
  Trash2, 
  Edit2, 
  Mail, 
  Phone, 
  Award, 
  Search, 
  X, 
  Check, 
  Briefcase,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { UsuarioPredio, RolUsuario } from '../types/campo';

interface UsuariosViewProps {
  usuarios: UsuarioPredio[];
  activeUserId: string;
  onSetActiveUser: (userId: string) => void;
  onAddUsuario: (usuario: UsuarioPredio) => void;
  onUpdateUsuario: (usuario: UsuarioPredio) => void;
  onDeleteUsuario: (id: string) => void;
}

export const UsuariosView: React.FC<UsuariosViewProps> = ({
  usuarios,
  activeUserId,
  onSetActiveUser,
  onAddUsuario,
  onUpdateUsuario,
  onDeleteUsuario
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioPredio | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState<RolUsuario>('agronomo_predio');
  const [rutIdentificacion, setRutIdentificacion] = useState('');
  const [numeroRegistroSAG, setNumeroRegistroSAG] = useState('');
  const [tituloProfesional, setTituloProfesional] = useState('');
  const [notas, setNotas] = useState('');
  const [formError, setFormError] = useState('');

  const openNewUserModal = () => {
    setEditingUser(null);
    setNombre('');
    setEmail('');
    setTelefono('+56 9 ');
    setRol('agronomo_predio');
    setRutIdentificacion('');
    setNumeroRegistroSAG('');
    setTituloProfesional('Ingeniero Agrónomo');
    setNotas('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditUserModal = (u: UsuarioPredio) => {
    setEditingUser(u);
    setNombre(u.nombre);
    setEmail(u.email);
    setTelefono(u.telefono);
    setRol(u.rol);
    setRutIdentificacion(u.rutIdentificacion);
    setNumeroRegistroSAG(u.numeroRegistroSAG || '');
    setTituloProfesional(u.tituloProfesional || '');
    setNotas(u.notas || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setFormError('Por favor ingrese el nombre completo del usuario.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Por favor ingrese un correo electrónico válido.');
      return;
    }

    const avatarColor = 
      rol === 'administrador' ? 'bg-indigo-700 text-white' :
      rol === 'agronomo_predio' ? 'bg-emerald-700 text-white' :
      rol === 'asesor_externo' ? 'bg-purple-700 text-white' :
      rol === 'jefe_campo' ? 'bg-amber-700 text-white' :
      rol === 'aplicador_calificado' ? 'bg-orange-700 text-white' :
      'bg-sky-700 text-white';

    if (editingUser) {
      const updated: UsuarioPredio = {
        ...editingUser,
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        rol,
        rutIdentificacion: rutIdentificacion.trim(),
        numeroRegistroSAG: numeroRegistroSAG.trim() || undefined,
        tituloProfesional: tituloProfesional.trim() || undefined,
        notas: notas.trim() || undefined,
        avatarColor
      };
      onUpdateUsuario(updated);
    } else {
      const newUser: UsuarioPredio = {
        id: `usr-${Date.now()}`,
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        rol,
        rutIdentificacion: rutIdentificacion.trim(),
        numeroRegistroSAG: numeroRegistroSAG.trim() || undefined,
        tituloProfesional: tituloProfesional.trim() || undefined,
        estado: 'activo',
        fechaAlta: new Date().toISOString().slice(0, 10),
        avatarColor,
        notas: notas.trim() || undefined
      };
      onAddUsuario(newUser);
      showToast(`¡Usuario "${newUser.nombre}" registrado exitosamente!`);
    }

    setIsModalOpen(false);
  };

  const [userToDelete, setUserToDelete] = useState<UsuarioPredio | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const id = userToDelete.id;
    const name = userToDelete.nombre;
    onDeleteUsuario(id);
    if (activeUserId === id) {
      const remaining = usuarios.filter(u => u.id !== id);
      if (remaining.length > 0) {
        onSetActiveUser(remaining[0].id);
      }
    }
    showToast(`Usuario "${name}" eliminado exitosamente`);
    setUserToDelete(null);
  };

  const getRoleBadge = (r: RolUsuario) => {
    switch (r) {
      case 'administrador':
        return { label: 'Administrador App', class: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'agronomo_predio':
        return { label: 'Agrónomo a Cargo', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'asesor_externo':
        return { label: 'Asesor Externo', class: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'jefe_campo':
        return { label: 'Jefe de Campo', class: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'aplicador_calificado':
        return { label: 'Aplicador SAG', class: 'bg-orange-50 text-orange-800 border-orange-200' };
      case 'operador_riego':
        return { label: 'Operador de Riego & Pozo', class: 'bg-sky-50 text-sky-800 border-sky-200' };
    }
  };

  const filteredUsuarios = usuarios.filter((u) => {
    const matchesSearch = 
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.rutIdentificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.tituloProfesional && u.tituloProfesional.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (roleFilter === 'todos') return true;
    if (roleFilter === 'agronomos') return u.rol === 'agronomo_predio' || u.rol === 'asesor_externo';
    if (roleFilter === 'admin') return u.rol === 'administrador';
    if (roleFilter === 'operadores') return u.rol === 'aplicador_calificado' || u.rol === 'operador_riego' || u.rol === 'jefe_campo';
    return u.rol === roleFilter;
  });

  const activeUser = usuarios.find(u => u.id === activeUserId) || usuarios[0];

  return (
    <div className="space-y-6">
      {/* Header and Hero Summary */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              <Users className="w-4 h-4" />
              Gestión de Equipo & Responsables Prediales
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
              Usuarios y Equipo Técnico
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Administración de agrónomo a cargo, asesor fitosanitario externo, administradores y operadores de Fundo La Cabaña.
            </p>
          </div>

          <button
            onClick={openNewUserModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Agregar Usuario o Asesor
          </button>
        </div>

        {/* Current Active User Session Bar */}
        <div className="mt-5 p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${activeUser?.avatarColor || 'bg-emerald-800 text-white'}`}>
              {activeUser?.nombre.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900">{activeUser?.nombre}</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Sesión Activa
                </span>
              </div>
              <div className="text-stone-500 text-[11px]">
                {activeUser?.tituloProfesional || getRoleBadge(activeUser?.rol || 'administrador').label} · Los registros se firmarán a su nombre
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 text-[11px] hidden md:inline">Cambiar operador activo:</span>
            <select
              value={activeUserId}
              onChange={(e) => onSetActiveUser(e.target.value)}
              className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} ({getRoleBadge(u.rol).label})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-[11px] text-stone-500 font-medium block">Total Usuarios</span>
            <span className="text-xl font-mono font-bold text-stone-900">{usuarios.length}</span>
            <span className="text-[10px] text-stone-400 block">Personal habilitado</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-[11px] text-stone-500 font-medium block">Agrónomos & Asesores</span>
            <span className="text-xl font-mono font-bold text-emerald-800">
              {usuarios.filter(u => u.rol === 'agronomo_predio' || u.rol === 'asesor_externo').length}
            </span>
            <span className="text-[10px] text-stone-400 block">Supervisión técnica</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-[11px] text-stone-500 font-medium block">Aplicadores SAG</span>
            <span className="text-xl font-mono font-bold text-amber-800">
              {usuarios.filter(u => u.numeroRegistroSAG).length}
            </span>
            <span className="text-[10px] text-stone-400 block">Con carnet vigente</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-[11px] text-stone-500 font-medium block">Administradores</span>
            <span className="text-xl font-mono font-bold text-indigo-800">
              {usuarios.filter(u => u.rol === 'administrador').length}
            </span>
            <span className="text-[10px] text-stone-400 block">Acceso total</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo, RUT o cargo..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setRoleFilter('todos')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              roleFilter === 'todos' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos ({usuarios.length})
          </button>
          <button
            onClick={() => setRoleFilter('agronomos')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              roleFilter === 'agronomos' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Agrónomos & Asesores
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              roleFilter === 'admin' ? 'bg-indigo-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Administradores
          </button>
          <button
            onClick={() => setRoleFilter('operadores')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              roleFilter === 'operadores' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Campo & Riego
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsuarios.map((u) => {
          const badge = getRoleBadge(u.rol);
          const isActive = u.id === activeUserId;

          return (
            <div 
              key={u.id}
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                isActive ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${u.avatarColor || 'bg-stone-700 text-white'}`}>
                      {u.nombre.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 leading-tight">
                        {u.nombre}
                      </h3>
                      <div className="text-[11px] text-stone-500 mt-0.5 font-medium line-clamp-1">
                        {u.tituloProfesional || 'Miembro del equipo'}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.class}`}>
                          {badge.label}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Activo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditUserModal(u)}
                      className="p-1.5 text-stone-400 hover:text-stone-900 rounded hover:bg-stone-100"
                      title="Editar usuario"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setUserToDelete(u)}
                      className="p-1.5 text-stone-400 hover:text-red-700 rounded hover:bg-red-50"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact and Identification Details */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a href={`mailto:${u.email}`} className="hover:underline hover:text-emerald-800 truncate">
                      {u.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a href={`tel:${u.telefono}`} className="hover:underline hover:text-emerald-800 font-mono">
                      {u.telefono}
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-stone-500">
                    <span>RUT: <strong className="font-mono text-stone-700">{u.rutIdentificacion || 'Sin especificar'}</strong></span>
                    {u.numeroRegistroSAG && (
                      <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <Award className="w-3 h-3 text-emerald-700" />
                        {u.numeroRegistroSAG}
                      </span>
                    )}
                  </div>

                  {u.notas && (
                    <div className="p-2 bg-stone-50 rounded border border-stone-100 text-[11px] text-stone-600 mt-2 line-clamp-2">
                      {u.notas}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Alta: {u.fechaAlta}
                </span>

                {!isActive ? (
                  <button
                    onClick={() => onSetActiveUser(u.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 rounded transition-colors"
                  >
                    Establecer como Activo
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Usuario actual
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsuarios.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-8 text-center space-y-3">
          <Users className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="font-bold text-stone-900 text-sm">No se encontraron usuarios</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No hay miembros que coincidan con los filtros aplicados. Intenta con otro criterio o agrega un nuevo usuario.
          </p>
          <button
            onClick={openNewUserModal}
            className="px-3.5 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900"
          >
            Agregar Usuario Ahora
          </button>
        </div>
      )}

      {/* MODAL: ADD / EDIT USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    {editingUser ? 'Editar Datos de Usuario' : 'Registrar Nuevo Usuario / Asesor'}
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    Fundo La Cabaña · Equipo Agronómico & Administrativo
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Ing. Rodrigo Morales Sotomayor"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Rol en el Predio *
                  </label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value as RolUsuario)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
                  >
                    <option value="agronomo_predio">Agrónomo a Cargo del Predio</option>
                    <option value="asesor_externo">Asesor Agronómico Externo</option>
                    <option value="administrador">Administrador de la App / Fundo</option>
                    <option value="jefe_campo">Jefe de Campo / Administrador</option>
                    <option value="aplicador_calificado">Aplicador con Carnet SAG</option>
                    <option value="operador_riego">Operador de Riego y Pozo</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Título o Especialidad
                  </label>
                  <input
                    type="text"
                    value={tituloProfesional}
                    onChange={(e) => setTituloProfesional(e.target.value)}
                    placeholder="Ej: Ing. Agrónomo / Técnico Agrícola"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@fundolacabana.cl"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Teléfono / Celular
                  </label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    RUT / Identificación
                  </label>
                  <input
                    type="text"
                    value={rutIdentificacion}
                    onChange={(e) => setRutIdentificacion(e.target.value)}
                    placeholder="12.345.678-9"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    N° Registro SAG / Credencial
                  </label>
                  <input
                    type="text"
                    value={numeroRegistroSAG}
                    onChange={(e) => setNumeroRegistroSAG(e.target.value)}
                    placeholder="Ej: APL-SAG-8921 o REG-5104"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Responsabilidades y Notas
                </label>
                <textarea
                  rows={2}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Detalles sobre cuarteles asignados, certificaciones o labores que supervisa..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {editingUser ? 'Guardar Cambios' : 'Registrar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IN-APP DE CONFIRMACIÓN DE ELIMINACIÓN DE USUARIO */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-red-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm">Eliminar Usuario del Equipo</h3>
              </div>
              <button 
                onClick={() => setUserToDelete(null)}
                className="p-1 text-red-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {userToDelete.rol === 'administrador' && usuarios.filter(u => u.rol === 'administrador').length <= 1 ? (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    Acción No Permitida
                  </div>
                  <p className="leading-relaxed">
                    No es posible eliminar a <strong>{userToDelete.nombre}</strong> porque es el <strong>único Administrador</strong> del Fundo La Cabaña.
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Para eliminar a este usuario, primero debes editar a otro miembro del equipo o agregar uno nuevo con el rol de Administrador.
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setUserToDelete(null)}
                      className="px-4 py-2 bg-stone-900 text-white font-bold rounded-lg"
                    >
                      Entendido
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-stone-700 text-sm">
                    ¿Estás seguro de que deseas eliminar a <strong>{userToDelete.nombre}</strong> del equipo técnico?
                  </p>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div><strong>Rol:</strong> {getRoleBadge(userToDelete.rol).label}</div>
                    <div><strong>Email:</strong> {userToDelete.email}</div>
                    {userToDelete.rutIdentificacion && (
                      <div><strong>RUT:</strong> {userToDelete.rutIdentificacion}</div>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Esta acción retirará sus accesos y permisos en el cuaderno de campo. Los registros históricos de labores ya efectuados se conservarán.
                  </p>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setUserToDelete(null)}
                      className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-sm"
                    >
                      Eliminar Definitivamente
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-300" />
          {toastMsg}
        </div>
      )}
    </div>
  );
};

