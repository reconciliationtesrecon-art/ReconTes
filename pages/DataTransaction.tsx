import React, { useState, useEffect, useCallback } from 'react';
import { getTransactions, updateTransactionAccount } from '../services/api';
import type { Transaction, Account } from '../types';
import Spinner from '../components/ui/Spinner';

const DataTransaction: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Record<string, { newAccountName: string; isSaving: boolean }>>({});

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const transData = await getTransactions();
            setTransactions(transData);

            // Create a unique list of accounts from the transaction data
            const uniqueAccountNames = [...new Set(transData.map(tx => tx.akun).filter(Boolean))];
            const derivedAccounts: Account[] = uniqueAccountNames.map((akunName, index) => ({
                id: String(index), // Use index as a simple key
                akun: akunName
            }));
            setAccounts(derivedAccounts);

        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAccountChange = (transactionId: string, newAccountName: string) => {
        setEditing(prev => ({
            ...prev,
            [transactionId]: { ...(prev[transactionId] || { isSaving: false }), newAccountName }
        }));
    };

    const handleSave = async (transactionId: string) => {
        const editState = editing[transactionId];
        if (!editState || !editState.newAccountName) return;

        setEditing(prev => ({ ...prev, [transactionId]: { ...editState, isSaving: true } }));

        try {
            await updateTransactionAccount(transactionId, editState.newAccountName);
            
            // Update local state manually since API doesn't return the updated object
            setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, akun: editState.newAccountName } : t));
            
            setEditing(prev => {
                const newState = { ...prev };
                delete newState[transactionId];
                return newState;
            });
        } catch (error) {
            console.error("Failed to save transaction:", error);
            // Optionally show an error message to the user
            setEditing(prev => ({ ...prev, [transactionId]: { ...editState, isSaving: false } }));
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Debet</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credit</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Akun</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{tx.tanggal}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{tx.client}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">{new Intl.NumberFormat('id-ID').format(tx.debet)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{new Intl.NumberFormat('id-ID').format(tx.credit)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    <select
                                        value={editing[tx.id]?.newAccountName || tx.akun}
                                        onChange={(e) => handleAccountChange(tx.id, e.target.value)}
                                        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={tx.akun} disabled hidden>{tx.akun}</option>
                                        {accounts.map(acc => <option key={acc.id} value={acc.akun}>{acc.akun}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {editing[tx.id] && (
                                        <button
                                            onClick={() => handleSave(tx.id)}
                                            disabled={editing[tx.id]?.isSaving}
                                            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md disabled:bg-blue-400"
                                        >
                                            {editing[tx.id]?.isSaving ? <Spinner size="sm" /> : 'Simpan'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTransaction;