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
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff
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
  
  // Eres Administrador si tu rol es administrador o tu correo es diegopereiraramirez@gmail.com
  const isAdmin = loggedInUser?.rol === 'administrador' || loggedInUser?.email === 'diegopereiraramirez@gmail.com';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<(UsuarioPredio & { clave?: string }) | null>(null);

  // Form states
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
    // Si no es admin y no es su propio perfil, no puede editar
    if (!isAdmin && u.id !== loggedInUser?.id) {
      alert('Solo el administrador puede editar a otros usuarios.');
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
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

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
            {isAdmin 
              ? '🔑 Modo Administrador: Puedes ver y modificar las contraseñas de todo el equipo.'
              : '🔒 Modo Trabajador: Solo puedes ver y modificar tu propia contraseña personal.'}
          </p>
        </div>

        {isAdmin && (
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
          const esMiCuenta = u.id === loggedInUser?.id;
          const puedeVerClave = isAdmin || esMiCuenta;

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

                  {/* Botones de acción (Solo admin o el propio usuario) */}
                  {(isAdmin || esMiCuenta) && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditUserModal(u)}
                        className="p-1.5 text-stone-500 hover:text-emerald-900 rounded hover:bg-stone-100 cursor-pointer"
                        title={esMiCuenta ? "Cambiar mi clave o datos" : "Editar clave o datos de este usuario"}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {isAdmin && !esMiCuenta && (
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="
