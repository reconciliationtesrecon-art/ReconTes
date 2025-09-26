import React, { useState } from 'react';
import Spinner from '../components/ui/Spinner';
import { addUser } from '../services/api'; // ganti dari mockApi → api.ts

const AddUser: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setStatus('error');
            setMessage('Username dan password tidak boleh kosong.');
            return;
        }
        setStatus('saving');
        try {
            const newUser = await addUser(username, role, password);
            setStatus('success');
            setMessage(`Pengguna baru "${newUser.username}" dengan peran "${newUser.role}" berhasil ditambahkan.`);
            setUsername('');
            setPassword('');
            setRole('User');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Gagal menambahkan pengguna.');
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
                <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Pengguna Baru</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Buat akun baru untuk mengakses Dashboard.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="cth: user_baru"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                         <label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">Peran</label>
                         <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                         >
                            <option>User</option>
                            <option>Admin</option>
                         </select>
                    </div>

                    {status === 'success' && <div className="p-4 text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/50 rounded-md">{message}</div>}
                    {status === 'error' && <div className="p-4 text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/50 rounded-md">{message}</div>}
                    
                    <button
                        type="submit"
                        disabled={status === 'saving'}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                        {status === 'saving' ? <Spinner size="sm" /> : 'Simpan Pengguna'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
