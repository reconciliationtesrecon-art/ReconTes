
import { createContext } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
