import { useState, useEffect } from 'react';
import api from '@/core/api/axios';
import { User } from '@/shared/types';
import { Navbar } from '@/shared/components/Navbar';
import { format } from 'date-fns';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'user' });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update
        await api.patch(`/users/${editingUser.id}`, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          ...(formData.password && { password: formData.password }),
        });
      } else {
        // Create
        await api.post('/users', formData);
      }
      
      setShowModal(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert('Erro ao excluir usuário');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-[#0b0f16]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white/60"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f16] text-white">
      <Navbar />
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/dashboard-bg.png.png')] bg-[length:115%_115%] bg-[position:40%_50%] opacity-90 animate-[dashboard-drift_28s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f16]/30 via-[#0b0f16]/70 to-[#0b0f16]" />
        <div className="relative z-10 w-full px-8 sm:px-10 lg:px-12 py-14">
        <div className="mx-auto max-w-[1500px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white">Gerenciar Usuários</h1>
              <p className="mt-2 text-white/70">Área administrativa</p>
            </div>
            <button
              onClick={handleCreate}
              className="rounded-full border border-sky-400/40 bg-sky-500/20 px-5 py-2 text-sm font-medium text-sky-100 backdrop-blur transition hover:bg-sky-500/30"
            >
              ➕ Novo Usuário
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/60">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-transparent">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white/70">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-300/20 text-purple-100' : 'bg-emerald-300/20 text-emerald-100'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="mr-4 text-sky-300 hover:text-sky-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-rose-300 hover:text-rose-200"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha {editingUser && '(deixe em branco para não alterar)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingUser ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
