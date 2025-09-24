import React, { useState } from 'react';
import Spinner from '../components/ui/Spinner';
import { addClient } from '../services/api'; 

const AddClient: React.FC = () => {
    const [clientName, setClientName] = useState('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName.trim()) {
            setStatus('error');
            setMessage('Nama klien tidak boleh kosong.');
            return;
        }
        setStatus('saving');
        try {
            const newClient = await addClient(clientName);
            setStatus('success');
            setMessage(`Klien baru "${newClient.client}" berhasil ditambahkan.`);
            setClientName('');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Gagal menambahkan klien. Silakan coba lagi.');
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
                <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Klien Baru</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Masukkan nama untuk klien baru.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="clientName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nama Klien
                        </label>
                        <input
                            id="clientName"
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Contoh: PT Mitra Sejahtera"
                        />
                    </div>

                    {status === 'success' && (
                        <div className="p-4 text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/50 rounded-md">
                            {message}
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="p-4 text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/50 rounded-md">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'saving'}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                        {status === 'saving' ? <Spinner size="sm" /> : 'Simpan Klien'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddClient;
