import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit2, 
  Mail, 
  Phone, 
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
  loggedInUser?: (UsuarioPredio & { clave?: string }) | null;
  onSetActiveUser: (userId: string) => void;
  onAddUsuario: (usuario: UsuarioPredio & { clave?: string }) => void;
  onUpdateUsuario: (usuario: UsuarioPredio & { clave?: string }) => void;
  onDeleteUsuario: (id: string) => void;
}

export const UsuariosView: React.FC<UsuariosViewProps> = ({
  usuarios,
  activeUserId,
  loggedInUser,
  onSetActiveUser,
  onAddUsuario,
  onUpdateUsuario,
  onDeleteUsuario
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');

  // Solo tú (Diego Pereira) eres el Administrador Maestro con acceso a ver y cambiar todas las claves
  const currentUser = loggedInUser || usuarios.find((u) => u.id === activeUserId) || usuarios[0];
  const isMasterAdmin = currentUser?.email?.trim().toLowerCase() === 'diegopereiraramirez@gmail.com';

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
    setTituloProfesional('Técnico / Operador');
    setClave('1234');
    setNotas('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditUserModal = (u: UsuarioPredio & { clave?: string }) => {
    const esMiPropiaCuenta = u.email?.trim().toLowerCase() === currentUser?.email?.trim().toLowerCase();

    if (!isMasterAdmin && !esMiPropiaCuenta) {
      alert('Solo el administrador Diego Pereira tiene acceso a ver y modificar a otros usuarios.');
      return;
    }

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
      showToast(`¡Usuario creado con clave!`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const id = userToDelete.id;
    const name = userToDelete.nombre;
    onDeleteUsuario(id);
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
    if (roleFilter === 'operadores') return u.rol === 'aplicador_calificado' || u.rol === 'operador_riego' || u.rol === 'jefe_campo';
    return u.rol === roleFilter;
  });

  return (
    <div className="space-y-6 text-xs">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-300" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            <Users className="w-4 h-4" />
            Control de Personal y Seguridad de Acceso
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Usuarios del Fundo y Contraseñas
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {isMasterAdmin 
              ? '🔑 Modo Administrador Maestro: Tienes acceso total para ver y modificar todas las contraseñas del equipo.'
              : '🔒 Modo Trabajador: Solo puedes ver y modificar tu propia contraseña personal.'}
          </p>
        </div>

        {isMasterAdmin && (
          <button
            onClick={openNewUserModal}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            + Agregar Nuevo Usuario con Clave
          </button>
        )}
      </div>

      {/* Grid de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsuarios.map((u) => {
          const badge = getRoleBadge(u.rol);
          const esMiCuenta = u.email?.trim().toLowerCase() === currentUser?.email?.trim().toLowerCase();
          
          // Solo Diego ve las claves de todos. Los demás solo ven la suya.
          const puedeVerClave = isMasterAdmin || esMiCuenta;
          const puedeEditar = isMasterAdmin || esMiCuenta;
          const puedeEliminar = isMasterAdmin && !esMiCuenta;

          return (
            <div 
              key={u.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                esMiCuenta ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${u.avatarColor || 'bg-stone-700 text-white'}`}>
                      {u.nombre.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 leading-tight flex items-center gap-1.5">
                        {u.nombre}
                        {esMiCuenta && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 text-emerald-900 font-bold">
                            Tú
                          </span>
                        )}
                      </h3>
                      <div className="text-[11px] text-stone-500 mt-0.5 font-medium">{u.tituloProfesional || badge.label}</div>
                      <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.class}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center gap-1 shrink-0">
                    {puedeEditar && (
                      <button
                        onClick={() => openEditUserModal(u)}
                        className="p-1.5 text-stone-500 hover:text-emerald-900 rounded hover:bg-stone-100 cursor-pointer"
                        title={esMiCuenta ? "Cambiar mi clave o datos" : "Editar clave o datos de este usuario"}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {puedeEliminar && (
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 text-stone-400 hover:text-red-700 rounded hover:bg-red-50 cursor-pointer"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-medium text-stone-800 truncate">{u.email}</span>
                  </div>

                  {/* Visualización protegida de clave */}
                  <div className={`p-2 rounded-xl border flex items-center justify-between text-[11px] mt-2 ${
                    puedeVerClave ? 'bg-amber-50/60 border-amber-200' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <span className="text-stone-600 flex items-center gap-1 font-semibold">
                      <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                      Clave de ingreso:
                    </span>

                    {puedeVerClave ? (
                      <strong className="font-mono text-stone-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                        {u.clave || '1234'}
                      </strong>
                    ) : (
                      <span className="font-mono text-stone-400 italic">
                        •••••••• (Protegida)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-400">Alta: {u.fechaAlta}</span>
                {puedeEditar && (
                  <button
                    onClick={() => openEditUserModal(u)}
                    className="text-emerald-800 font-bold hover:underline cursor-pointer"
                  >
                    {esMiCuenta ? 'Modificar mi clave' : 'Editar clave de usuario'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal crear / editar usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto text-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-800" />
                {editingUser ? `Editar Usuario: ${editingUser.nombre}` : 'Crear Nuevo Usuario de Acceso'}
              </h3>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <div>
                  <label className="font-bold text-emerald-950 block mb-1">
                    Correo Electrónico *
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
                    placeholder="Ej: campo2026"
                    className="w-full p-2.5 border border-emerald-300 rounded-lg bg-white font-mono font-bold text-emerald-950"
                  />
                </div>
              </div>

              {isMasterAdmin && (
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
                      <option value="operador_riego">Operador de Riego & Pozo</option>
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
              )}

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-700 font-medium hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Guardar Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 p-5 space-y-3">
            <h3 className="font-bold text-sm text-stone-900">¿Eliminar usuario?</h3>
            <p className="text-stone-600">Se eliminará el acceso de <strong>{userToDelete.nombre}</strong> ({userToDelete.email}).</p>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button onClick={() => setUserToDelete(null)} className="px-4 py-2 border rounded-lg cursor-pointer">Cancelar</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg cursor-pointer">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
