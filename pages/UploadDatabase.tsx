import React, { useState } from 'react';
import Spinner from '../components/ui/Spinner';
import { uploadDatabase } from '../services/api';

const UploadDatabase: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };
    
    // Fungsi parsing CSV yang andal: menggunakan header dari file apa adanya.
    // Mengharuskan header di file CSV sama persis dengan di Google Sheet.
    const parseCSV = (text: string): Record<string, any>[] => {
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim()); // Gunakan header asli
        const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const entry: Record<string, any> = {};
            headers.forEach((header, i) => {
                if (values[i] !== undefined) {
                    const lowerHeader = header.toLowerCase();
                    if (lowerHeader === 'debet' || lowerHeader === 'credit') {
                        entry[header] = parseFloat(values[i]) || 0;
                    } else {
                        entry[header] = values[i];
                    }
                }
            });
            return entry;
        });
        return data;
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus('error');
            setMessage('Silakan pilih file terlebih dahulu.');
            return;
        }

        setStatus('uploading');
        setMessage('');

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const records = parseCSV(text);

                if (records.length === 0) {
                    setStatus('error');
                    setMessage('File kosong atau format CSV tidak valid. Pastikan ada header dan setidaknya satu baris data.');
                    return;
                }
                
                const result = await uploadDatabase(records);
                
                setStatus('success');
                setMessage(`Berhasil! ${result.count} baris data baru telah ditambahkan.`);
                setFile(null);
                
                // Reset input file
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }

            } catch (error) {
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'Gagal memproses file. Silakan coba lagi.');
            }
        };

        reader.onerror = () => {
            setStatus('error');
            setMessage('Gagal membaca file.');
        };

        reader.readAsText(file);
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Unggah Database Baru</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Pastikan header file CSV Anda sama persis dengan di Google Sheet.</p>
                </div>
                
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih File</label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <span>Unggah sebuah file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
                                </label>
                                <p className="pl-1">atau seret dan lepas</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Hanya CSV</p>
                        </div>
                    </div>
                    {file && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">File dipilih: {file.name}</p>}
                </div>

                {status === 'success' && <div className="p-4 text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/50 rounded-md">{message}</div>}
                {status === 'error' && <div className="p-4 text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/50 rounded-md">{message}</div>}

                <button
                    onClick={handleUpload}
                    disabled={!file || status === 'uploading'}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {status === 'uploading' ? <Spinner size="sm" /> : 'Unggah Sekarang'}
                </button>
            </div>
        </div>
    );
};

export default UploadDatabase;