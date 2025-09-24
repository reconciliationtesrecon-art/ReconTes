
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Summary from './Summary';
import DataTransaction from './DataTransaction';
import UploadDatabase from './UploadDatabase';
import AddClient from './AddClient';
import AddUser from './AddUser';

type Page = 'summary' | 'transactions' | 'upload' | 'add_client' | 'add_user';

const pageTitles: Record<Page, string> = {
    summary: 'Ringkasan',
    transactions: 'Data Transaksi',
    upload: 'Unggah Database',
    add_client: 'Tambah Klien Baru',
    add_user: 'Tambah Pengguna Baru'
};

const Dashboard: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>('summary');

    const renderContent = () => {
        switch (activePage) {
            case 'summary':
                return <Summary />;
            case 'transactions':
                return <DataTransaction />;
            case 'upload':
                return <UploadDatabase />;
            case 'add_client':
                return <AddClient />;
            case 'add_user':
                return <AddUser />;
            default:
                return <Summary />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={pageTitles[activePage]} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
