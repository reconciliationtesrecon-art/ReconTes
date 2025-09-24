import React, { useState, useEffect } from 'react';
import { getSummaryData } from '../services/api';
import type { SummaryData } from '../types';
import Spinner from '../components/ui/Spinner';

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform hover:-translate-y-1 transition-transform duration-300">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">{title}</h3>
        {children}
    </div>
);

const Summary: React.FC = () => {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const summaryData = await getSummaryData();
                setData(summaryData);
            } catch (err) {
                console.error("Gagal memuat data ringkasan:", err);
                setError("Data ringkasan tidak dapat dimuat. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }
    
    if (!data || !data.totalBalance) {
        return <p className="text-center text-gray-500">Tidak ada data untuk ditampilkan.</p>;
    }

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter Tanggal</label>
                    <input type="date" id="date-filter" className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter Bulan</label>
                    <input type="month" id="month-filter" className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter Tahun</label>
                    <input type="number" placeholder="2023" id="year-filter" className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
            </div>

            {/* Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Total Saldo per Klien">
                     <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {data.totalBalance.length > 0 ? (
                            data.totalBalance.map(({ client, balance }) => (
                                 <li key={client} className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-800 dark:text-gray-100 truncate pr-2">{client}</span>
                                    <span className={`font-bold flex-shrink-0 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(balance)}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">Tidak ada data saldo.</p>
                        )}
                    </ul>
                </Card>
                <Card title="Pendapatan Bulanan per Klien">
                    {/* Placeholder for chart */}
                    <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                        <p className="text-gray-400">Grafik Pendapatan</p>
                    </div>
                </Card>
                <Card title="Transaksi per Hari">
                     {/* Placeholder for chart */}
                    <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                        <p className="text-gray-400">Grafik Transaksi</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Summary;
