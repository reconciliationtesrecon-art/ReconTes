import React, { useState, useCallback, useMemo } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import type { User } from './types';
import { AuthContext } from './contexts/AuthContext';
import { login as apiLogin } from './services/api';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const login = useCallback(async (username: string, password: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const loggedInUser = await apiLogin(username, password);
            setUser(loggedInUser);
        } catch (err: unknown) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An unknown error occurred.");
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const authContextValue = useMemo(() => ({
        user,
        login,
        logout,
        error,
        loading
    }), [user, login, logout, error, loading]);

    return (
        <AuthContext.Provider value={authContextValue}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                {user ? <Dashboard /> : <Login />}
            </div>
        </AuthContext.Provider>
    );
}

export default App;
