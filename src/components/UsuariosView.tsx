import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit2, 
  Mail, 
  Phone, 
  Award, 
  Search, 
  X, 
  Check, 
  AlertCircle,
  Clock,
  KeyRound
} from 'lucide-react';
import { UsuarioPredio, RolUsuario } from '../types/campo';

interface UsuariosViewProps {
  usuarios: (UsuarioPredio & { clave?: string })[];
  activeUserId: string;
  onSetActiveUser: (userId: string) => void;
  onAddUsuario: (usuario: UsuarioPredio & { clave?: string }) => void;
  onUpdateUsuario: (usuario: UsuarioPredio & { clave?: string }) => void;
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
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<(UsuarioPredio & { clave?: string }) | null>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState<RolUsuario>('agronomo_predio');
  const [rutIdentificacion, setRutIdentificacion] = useState('');
  const [numeroRegistroSAG, setNumeroRegistroSAG] = useState('');
  const [tituloProfesional, setTituloProfesional] = useState('');
  const [clave, setClave] = useState('1234');
  const [notas, setNotas] = useState('');
  const [formError, setFormError] = useState('');

  const [userToDelete, setUserToDelete] = useState<(UsuarioPredio & { clave?: string }) | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const openNewUserModal = () => {
    setEditingUser(null);
    setNombre('');
    setEmail('');
    setTelefono('+56 9 ');
    setRol('agronomo_predio');
    setRutIdentificacion('');
    setNumeroRegistroSAG('');
    setTituloProfesional('Ingeniero Agrónomo');
    setClave('1234');
    setNotas('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditUserModal = (u: UsuarioPredio & { clave?: string }) => {
    setEditingUser(u);
    setNombre(u.nombre);
    setEmail(u.email);
    setTelefono(u.telefono);
    setRol(u.rol);
    setRutIdentificacion(u.rutIdentificacion);
    setNumeroRegistroSAG(u.numeroRegistroSAG || '');
    setTituloProfesional(u.tituloProfesional || '');
    setClave(u.clave || '1234');
    setNotas(u.notas || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setFormError('Por favor ingrese el nombre completo.');
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
      const updated: UsuarioPredio & { clave?: string } = {
        ...editingUser,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        rol,
        rutIdentificacion: rutIdentificacion.trim(),
        numeroRegistroSAG: numeroRegistroSAG.trim() || undefined,
        tituloProfesional: tituloProfesional.trim() || undefined,
        clave: clave.trim() || '1234',
        notas: notas.trim() || undefined,
        avatarColor
      };
      onUpdateUsuario(updated);
      showToast(`¡Usuario "${updated.nombre}" actualizado!`);
    } else {
      const newUser: UsuarioPredio & { clave?: string } = {
        id: `usr-${Date.now()}`,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        rol,
        rutIdentificacion: rutIdentificacion.trim(),
        numeroRegistroSAG: numeroRegistroSAG.trim() || undefined,
        tituloProfesional: tituloProfesional.trim() || undefined,
        clave: clave.trim() || '1234',
        estado: 'activo',
        fechaAlta: new Date().toISOString().slice(0, 10),
        avatarColor,
        notas: notas.trim() || undefined
      };
      onAddUsuario(newUser);
      showToast(`¡Nuevo usuario "${newUser.nombre}" creado exitosamente!`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const id = userToDelete.id;
    const name = userToDelete.nombre;
    onDeleteUsuario(id);
    if (activeUserId === id) {
      const remaining = usuarios.filter((u) => u.id !== id);
      if (remaining.length > 0) {
        onSetActiveUser(remaining[0].id);
      }
    }
    showToast(`Usuario "${name}" eliminado`);
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
      u.rutIdentificacion.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (roleFilter === 'todos') return true;
    if (roleFilter === 'agronomos') return u.rol === 'agronomo_predio' || u.rol === 'asesor_externo';
    if (roleFilter === 'admin') return u.rol === 'administrador';
    if (roleFilter === 'operadores') return u.rol === 'aplicador_calificado' || u.rol === 'operador_riego' || u.rol === 'jefe_campo';
    return u.rol === roleFilter;
  });

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-300" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              <Users className="w-4 h-4" />
              Gestión de Equipo & Cuentas de Acceso
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
              Equipo y Usuarios del Fundo
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Crea usuarios para tus trabajadores, tractoristas o agrónomos con su propio correo y contraseña personal.
            </p>
          </div>

          <button
            onClick={openNewUserModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            + Agregar Nuevo Usuario con Clave
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar usuario por nombre o correo..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
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
            Agrónomos
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

      {/* Cuadrícula de Usuarios */}
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
                        {u.tituloProfesional || badge.label}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.class}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditUserModal(u)}
                      className="p-1.5 text-stone-400 hover:text-stone-900 rounded hover:bg-stone-100 cursor-pointer"
                      title="Editar usuario o cambiar contraseña"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setUserToDelete(u)}
                      className="p-1.5 text-stone-400 hover:text-red-700 rounded hover:bg-red-50 cursor-pointer"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Detalles de contacto y clave */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-medium text-stone-800 truncate">{u.email}</span>
                  </div>

                  {u.telefono && (
                    <div className="flex items-center gap-2 text-stone-600">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-mono text-stone-700">{u.telefono}</span>
                    </div>
                  )}

                  {/* VISUALIZACIÓN DE CONTRASEÑA PARA EL ADMINISTRADOR */}
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/80 flex items-center justify-between text-[11px] mt-2">
                    <span className="text-stone-500 flex items-center gap-1 font-semibold">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      Clave de ingreso:
                    </span>
                    <strong className="font-mono text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {u.clave || '1234'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Alta: {u.fechaAlta}
                </span>

                <button
                  onClick={() => openEditUserModal(u)}
                  className="text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  Cambiar clave
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CREAR / EDITAR USUARIO CON CONTRASEÑA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 my-8 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    {editingUser ? `Editar Usuario: ${editingUser.nombre}` : 'Crear Nuevo Usuario de Acceso'}
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    Podrá ingresar con su propio correo y contraseña a la app
                  </span>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 mt-4">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Carlos Manqui"
                  className="w-full p-2.5 border border-stone-300 rounded-lg"
                />
              </div>

              {/* CORREO Y CONTRASEÑA PERSONAL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <div>
                  <label className="font-bold text-emerald-950 block mb-1">
                    Correo Electrónico (Usuario) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trabajador@gmail.com"
                    className="w-full p-2.5 border border-emerald-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-emerald-950 block mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                    Contraseña Personal *
                  </label>
                  <input
                    type="text"
                    required
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    placeholder="Ej: clave2026"
                    className="w-full p-2.5 border border-emerald-300 rounded-lg bg-white font-mono font-bold text-emerald-950"
                  />
                  <span className="text-[10px] text-emerald-800 mt-0.5 block">
                    (Clave con la que esta persona entrará a la app)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Rol en el Fundo</label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value as RolUsuario)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg bg-white font-medium"
                  >
                    <option value="agronomo_predio">Agrónomo a Cargo del Predio</option>
                    <option value="jefe_campo">Jefe de Campo / Administrador</option>
                    <option value="aplicador_calificado">Aplicador con Carnet SAG</option>
                    <option value="operador_riego">Operador de Riego y Pozo</option>
                    <option value="asesor_externo">Asesor Externo</option>
                    <option value="administrador">Administrador de la App</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Cargo / Especialidad</label>
                  <input
                    type="text"
                    value={tituloProfesional}
                    onChange={(e) => setTituloProfesional(e.target.value)}
                    placeholder="Ej: Tractorista / Regador"
                    className="w-full p-2.5 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Teléfono / Celular</label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+56 9 "
                    className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">N° Carnet SAG (Si aplica)</label>
                  <input
                    type="text"
                    value={numeroRegistroSAG}
                    onChange={(e) => setNumeroRegistroSAG(e.target.value)}
                    placeholder="Ej: APL-SAG-8921"
                    className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  {editingUser ? 'Guardar Cambios' : 'Registrar Usuario con Clave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR USUARIO */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 p-5 space-y-3">
            <h3 className="font-bold text-sm text-stone-900">¿Deseas eliminar a este usuario?</h3>
            <p className="text-stone-600">
              Se eliminará el acceso para <strong>{userToDelete.nombre}</strong> ({userToDelete.email}).
            </p>
            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button onClick={() => setUserToDelete(null)} className="px-4 py-2 border rounded-lg cursor-pointer">
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
