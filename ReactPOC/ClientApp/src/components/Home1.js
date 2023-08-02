import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Card, CardContent, Grid } from '@mui/material';
import { Avatar } from '@mui/material';
import { useAuth } from './AuthProvider';

function NavMenu() {
    const { userData, setIsAuthenticated, setUserData } = useAuth();
    const [open, setOpen] = useState(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Se ejecutará cada vez que cambie el estado en AuthProvider
        // Aquí puedes realizar otras acciones o actualizaciones en NavMenu
    }, [userData]);

    const handleDrawerToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleLogout = () => {
        setShowLogoutConfirmation(true); // Mostrar la ventana de confirmación al hacer clic en Cerrar Sesión
    };

    const handleLogoutConfirm = () => {
        //// Eliminar los datos del usuario del localStorage
        //localStorage.removeItem('userData');
        //// Actualizar el estado de autenticación a false en el AuthProvider
        //setIsAuthenticated(false);
        //// Redirigir al componente de login sin recargar la página
        //navigate('/LoginUser');
        // Eliminar los datos del usuario del localStorage
        localStorage.removeItem('userData');
        // Actualizar el estado de autenticación a false en el AuthProvider
        setIsAuthenticated(false);
        // Eliminar los datos del usuario del estado en el AuthProvider
        setUserData(null);
        // Cerrar el diálogo de confirmación
        setShowLogoutConfirmation(false);
        // Redirigir al componente de login sin recargar la página
        navigate('/LoginUser');
    };

    const handleLogoutCancel = () => {
        setShowLogoutConfirmation(false); // Ocultar la ventana de confirmación al cancelar el cierre de sesión
    };

    return (
        <div style={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        GESTOR DE EVENTOS
                    </Typography>
                   
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                        {userData ? (
                            <>
                                <Avatar alt="User Avatar">
                                    <PersonIcon />
                                </Avatar>
                                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                    Hola, {userData.email}!
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Avatar alt="User Avatar">
                                    <PersonIcon />
                                </Avatar>
                                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                    {/* Texto de bienvenida cuando no hay información de usuario */}
                                    Bienvenido/a
                                </Typography>
                            </>
                        )}
                    </div>
                </Toolbar>
            </AppBar>

            

            <div style={{ width: 240 }}>
                <Toolbar />
                <Toolbar />
                <Drawer
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
                    }}
                    open={open}
                    onClose={handleDrawerToggle}
                >
                    <List>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button component={Link} to="/eventoslist">
                            <ListItemIcon>
                                <TodayIcon />
                            </ListItemIcon>
                            <ListItemText primary="Eventos" />
                        </ListItem>

                        <ListItem button component={Link} to="/expositoreslist">
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Expositores" />
                        </ListItem>
                        <ListItem button component={Link} to="/eventoscalendar">
                            <ListItemIcon>
                                <CalendarMonthIcon />
                            </ListItemIcon>
                            <ListItemText primary="Calendario" />
                        </ListItem>
                        <ListItem button component={Link} to="/ingresoslist">
                            <ListItemIcon>
                                <ChecklistIcon />
                            </ListItemIcon>
                            <ListItemText primary="Ingresos" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        {userData && ( // Renderiza el botón de "Cerrar Sesión" solo si el usuario está logueado
                            <ListItem button onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Cerrar Sesion" />
                            </ListItem>
                        )}
                    </List>
                </Drawer>
            </div>

            {/* Ventana de confirmación de cierre de sesión */}
            <Dialog
                open={showLogoutConfirmation}
                onClose={handleLogoutCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirmar cierre de Sesion</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" component="div" id="alert-dialog-description">
                        Estas seguro de que deseas cerrar sesion?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutCancel} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleLogoutConfirm} color="error" autoFocus>
                        Cerrar sesion
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NavMenu;
