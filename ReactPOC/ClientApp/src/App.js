import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';
import { Navigate } from 'react-router-dom';
import { Home } from './components/Home';
import { Alert } from '@mui/material';
import { AuthProvider, useAuth } from './components/AuthProvider';

function PrivateRoute({ element, requiresRole }) {
    //const { isAuthenticated, userRole } = useAuth();
    //const navigate = useNavigate();

    ////if (!isAuthenticated) {
    ////    navigate('/loginuser');
    ////}

    //if (requiresRole && userRole !== requiresRole) {
    //    return (
    //        <Alert severity="error" onClose={() => navigate('/')}>
    //            Acceso denegado. No estas autorizado para ver esta pagina.
    //        </Alert>
    //    );
    //}

    //return element;

    const { isAuthenticated, userRole } = useAuth();
    const navigate = useNavigate();

    if (requiresRole && userRole !== requiresRole) {
        return (
            <Alert severity="error" onClose={() => navigate('/')}>
                Acceso denegado. No est�s autorizado para ver esta p�gina.
            </Alert>
        );
    }

    // Verifica si la ruta requiere autenticaci�n
    if (element.props.requiresAuth && !isAuthenticated) {
        return (
            <Alert severity="error" onClose={() => navigate('/loginuser')}>
                Acceso denegado. Inicia sesi�n para ver esta p�gina.
            </Alert>
        );
    }

    return element;

}

function App() {

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [isInitialLoad, setIsInitialLoad] = useState(true);


    useEffect(() => {
        // Verifica si el usuario est� autenticado al cargar la aplicaci�n
        if (isInitialLoad) {
            setIsInitialLoad(false);
        } else if (!isAuthenticated) {
            //// Si no est� autenticado, redirige al componente de login
            //navigate('/loginuser');

            if (!window.location.pathname.startsWith('/ExpositoresRegistro') && !isAuthenticated) {
                navigate('/loginuser');
            }
        }
    }, [isInitialLoad, isAuthenticated, navigate]);

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                {AppRoutes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={<PrivateRoute element={route.element} requiresRole={route.requiresRole} />}
                    />
                ))}
            </Routes>
        </Layout>
    );
}

export default function AppWithAuthProvider() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}
