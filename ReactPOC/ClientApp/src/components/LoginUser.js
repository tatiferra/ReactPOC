import React, { useState } from 'react';
import axios from 'axios';
import { Paper, Typography, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { useAuth } from './AuthProvider';

function Login() {
    const { setIsAuthenticated, updateUserData } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate(); // Usamos useNavigate para acceder a la función navigate

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const showSnackbar = (severity, message) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
    };

    const hideSnackbar = () => {
        setIsSnackbarOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true); // Activar indicador de carga

        const formData = {
            username: username,
            password: password,
        };

        axios
            .post('login/login', formData)
            .then((response) => {
                // Actualizar los datos del usuario utilizando updateUserData del AuthProvider
                const userData = {
                    ...response.data.user,
                    role: response.data.role, // Agregar el rol del usuario al objeto userData
                };
                updateUserData(userData);

                // Actualizar el estado de isAuthenticated a true
                setIsAuthenticated(true);

                showSnackbar('success', 'Inicio de sesion exitoso');

                setTimeout(() => {
                    // Utiliza navigate para navegar a la página principal sin recargar la página
                    setIsLoading(false); // Desactivar indicador de carga
                    navigate('/');
                }, 2000);
            })
            .catch((error) => {
                showSnackbar('error', error.response.data.message);
                console.error(error);
                setIsLoading(false); // Desactivar indicador de carga
            });
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64vh' }}>
            <Paper style={{ padding: 10, width: 300 }}>
                <Typography variant="h5" component="h1" align="center" gutterBottom>
                    Ingreso al Sistema
                </Typography>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <TextField label="Usuario" value={username} onChange={handleUsernameChange} required />
                    <TextField label="Password" type="password" value={password} onChange={handlePasswordChange} required />
                    <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
                    </Button>
                </form>
            </Paper>
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={2000}
                onClose={hideSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbarSeverity} onClose={hideSnackbar}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Login;
