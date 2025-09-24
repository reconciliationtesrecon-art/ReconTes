
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
        } catch (err) {
            // Error is already handled in the AuthContext, just catching to prevent unhandled promise rejection
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 transform transition-all hover:scale-105 duration-500">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Selamat Datang</h1>
                        <p className="text-gray-500 dark:text-gray-400">Masuk ke Dashboard Anda</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
                            <p className="font-bold">Gagal Masuk</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="cth: admin"
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                            {loading ? <Spinner size="sm" /> : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
