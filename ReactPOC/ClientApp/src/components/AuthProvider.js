import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Obtener el estado de autenticaci�n almacenado en localStorage
    const initialIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
    const [userRole, setUserRole] = useState(''); // Estado para almacenar el rol del usuario

    // Funci�n para establecer los datos del usuario cuando inicia sesi�n
    const updateUserData = (userData) => {
        setUserData(userData);
        setUserRole(userData.role)
    };

    // Funci�n para establecer el rol del usuario
    const updateUserRole = (role) => {
        setUserRole(role);
        // Puedes almacenar el rol en los datos del usuario si lo deseas
        if (userData) {
            updateUserData({ ...userData, role });
        }
    };

    // Almacenar el estado de autenticaci�n en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                userData,
                setUserData,
                updateUserData,
                userRole,
                updateUserRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
