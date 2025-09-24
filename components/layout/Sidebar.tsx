
import React from 'react';

type Page = 'summary' | 'transactions' | 'upload' | 'add_client' | 'add_user';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
    page: Page;
    activePage: Page;
    setActivePage: (page: Page) => void;
    icon: JSX.Element;
    label: string;
}> = ({ page, activePage, setActivePage, icon, label }) => (
    <li
        onClick={() => setActivePage(page)}
        className={`flex items-center px-4 py-3 cursor-pointer rounded-lg transition-colors duration-200 ${
            activePage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {icon}
        <span className="ml-4 font-medium">{label}</span>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
    const iconClass = "h-6 w-6";
    const icons = {
        summary: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
        transactions: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>,
        upload: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>,
        add_client: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
        add_user: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
    };

    return (
        <aside className="w-64 bg-gray-800 text-white flex-shrink-0 flex flex-col">
            <div className="h-20 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
                <span>Mitra<span className="text-blue-500">Dash</span></span>
            </div>
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-3">
                    <NavItem page="summary" {...{activePage, setActivePage, icon: icons.summary, label: 'Ringkasan'}} />
                    <NavItem page="transactions" {...{activePage, setActivePage, icon: icons.transactions, label: 'Data Transaksi'}} />
                    <NavItem page="upload" {...{activePage, setActivePage, icon: icons.upload, label: 'Unggah Database'}} />
                    <NavItem page="add_client" {...{activePage, setActivePage, icon: icons.add_client, label: 'Tambah Klien'}} />
                    <NavItem page="add_user" {...{activePage, setActivePage, icon: icons.add_user, label: 'Tambah Pengguna'}} />
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
