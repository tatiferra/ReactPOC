import React, { Component } from 'react';
import { useState } from 'react';
import { Alert, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Tooltip } from '@mui/material';
import { FormControlLabel, Checkbox, Snackbar } from '@mui/material';
import { DataGrid, GridActionsCellItem, esES } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import MenuItem from '@mui/material/MenuItem';
import Breadcrumb from './Breadcrumb';

/*import { Paper, Typography, TextField, Button, Alert, Stack } from '@mui/material';*/
import axios from 'axios';
axios.defaults.headers.common['Origin'] = window.location.origin;


class ExpositoresList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [], 
            // Estos son los campos del modelo
            apellido: '',
            nombre: '',
            empresa: '',
            email: '',
            dni: '',
            ciudad: '',
            fechaNacimiento: '',
            genero: '',
            habilitado: false,
            // Estos son valores de configuracion de pantalla
            loading: true,
            openModal: false,
            selectedRow: null,
            isEditing: false, // True es un evento nuevo y False es Edición de un evento existente;
            showSnackbar: false,
            error: '',
            tiposIngreso: [],
            tipoIngreso: '',
            eventosActivos: [],
            eventoActivo: '',
            eventoFiltrado: '',
            confirmDisable: false,
        };
    }

    isAuthenticated() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        return userData !== null;
    }

    componentDidMount() {
        this.ObtenerEventosActivos();
        this.ObtenerTiposIngreso();
        this.ObtenerExpositoresActivos();
    }

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleEdit = (selectedRow) => {
        console.log('Editar expositor:', selectedRow);
        // Lógica para editar el usuario con el ID proporcionado
        const formattedFechaNacimiento = this.formatDate(selectedRow.fechaNacimiento);
        const isEditing = true; // Comprueba si hay un evento seleccionado
        this.setState({
            selectedRow: selectedRow,
            openModal: true,
            apellido: selectedRow.apellido,
            nombre: selectedRow.nombre,
            empresa: selectedRow.empresa,
            email: selectedRow.email,
            dni: selectedRow.dni,
            ciudad: selectedRow.ciudad,
            fechaNacimiento: formattedFechaNacimiento,
            genero: selectedRow.genero,
            habilitado: selectedRow.habilitado,
            tipoIngreso: selectedRow.id_tipoIngreso,
            eventoActivo: selectedRow.id_evento,
            isEditing: isEditing,
        });
        //alert('Editar el evento ' + this.state.fechaDesde.toString());
    };

    handleDelete = (userId) => {
        console.log('Eliminar expositor:', userId);
        // Lógica para eliminar el usuario con el ID proporcionado
        alert('Eliminar el expositor ' + userId);
    };

    handleDisable = (selectedRow) => {
        console.log('Deshabilitar evento:', selectedRow);
        // Lógica para editar el usuario con el ID proporcionado
        const formattedFechaNacimiento = this.formatDate(selectedRow.fechaNacimiento);
        
        this.setState({
            selectedRow: selectedRow,
            apellido: selectedRow.apellido,
            nombre: selectedRow.nombre,
            empresa: selectedRow.empresa,
            email: selectedRow.email,
            dni: selectedRow.dni,
            ciudad: selectedRow.ciudad,
            fechaNacimiento: formattedFechaNacimiento,
            genero: selectedRow.genero,
            habilitado: selectedRow.habilitado,
            tipoIngreso: selectedRow.id_tipoIngreso,
            eventoActivo: selectedRow.id_evento,
        });
        this.handleConfirmDisable();
        //this.handleDisableEvent();


    };

    handleConfirmDisable = () => {
        this.setState({ confirmDisable: true });
    };

    handleOpenModal = () => {
        const today = new Date().toISOString().split('T')[0];
        const isEditing = !!this.state.selectedRow; // Comprueba si hay un evento seleccionado
        this.setState({
            openModal: true,
            fechaNacimiento: today,
            isEditing: isEditing,
        });
    };

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            apellido: '',
            nombre: '',
            empresa: '',
            email: '',
            dni: '',
            ciudad: '',
            fechaNacimiento: '',
            genero: '',
            habilitado: false,
            selectedRow: null,
            isEditing: false, // Restablecer el valor de isEditing
            error: '',
        });
    };

    renderCell = (params) => {
        const { row } = params;
        const handleEdit = () => this.handleEdit(row);
        const handleDelete = () => this.handleDelete(row.id);
        const handleDisable = () => this.handleDisable(row);

        return (
            <>
                <Tooltip title="Editar" placement="bottom">
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Editar"
                        className="textPrimary"
                        onClick={handleEdit}
                        color="inherit"
                    />
                </Tooltip>
                <Tooltip title="Cambiar Estado" placement="bottom">
                    <GridActionsCellItem
                        icon={<LoopIcon />}
                        label="Deshabilitar"
                        onClick={handleDisable}
                        color="inherit"
                    />
                </Tooltip>
                <Tooltip title="Eliminar" placement="bottom">
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Eliminar"
                        onClick={handleDelete}
                        color="inherit"
                    />
                </Tooltip>
            </>
        );
    };

    formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    parseDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return new Date(year, parseInt(month) - 1, day);
    };

    handleAddExpositor = () => {
        const { apellido, nombre, empresa, email, dni, ciudad, fechaNacimiento, genero, habilitado, tipoIngreso, eventoActivo } = this.state;

        

        // Resto de la lógica para agregar el evento
        axios
            .post('expositores/AgregarExpositor', {
                apellido: apellido,
                nombre: nombre,
                empresa: empresa,
                email: email,
                dni: dni,
                ciudad: ciudad,
                fechaNacimiento: fechaNacimiento,
                genero: genero,
                habilitado: habilitado,
                id_tipoIngreso: tipoIngreso,
                id_evento: eventoActivo,
            })
            .then((response) => {
                // Procesa la respuesta si es necesario
                console.log('Expositor agregado con éxito:', response.data);
                // Volver a obtener los eventos activos para actualizar la grilla
                this.ObtenerExpositoresActivos();
                this.handleShowSnackbar(); // Mostrar el Snackbar
                // Cerrar el diálogo modal y limpiar los campos
                this.handleCloseModal();
            })
            .catch((error) => {
                // Maneja el error si ocurre
                console.error('Error al agregar el expositor:', error);
                // Cerrar el diálogo modal y limpiar los campos
                this.handleCloseModal();
            });

        
    };

    handleEditExpositor = () => {
        const { apellido, nombre, empresa, email, dni, ciudad, fechaNacimiento, genero, habilitado, tipoIngreso, eventoActivo, selectedRow } = this.state;



        // Resto de la lógica para agregar el evento
        axios
            .post('expositores/EditarExpositor', {
                id: selectedRow.id,
                apellido: apellido,
                nombre: nombre,
                empresa: empresa,
                email: email,
                dni: dni,
                ciudad: ciudad,
                fechaNacimiento: fechaNacimiento,
                genero: genero,
                habilitado: habilitado,
                id_tipoIngreso: tipoIngreso,
                id_evento: eventoActivo,
            })
            .then((response) => {
                // Procesa la respuesta si es necesario
                console.log('Expositor agregado con éxito:', response.data);
                // Volver a obtener los eventos activos para actualizar la grilla
                this.ObtenerExpositoresActivos();
                this.handleShowSnackbar(); // Mostrar el Snackbar
                // Cerrar el diálogo modal y limpiar los campos
                this.handleCloseModal();
            })
            .catch((error) => {
                // Maneja el error si ocurre
                console.error('Error al agregar el expositor:', error);
                // Cerrar el diálogo modal y limpiar los campos
                this.handleCloseModal();
            });

        
    };

    ObtenerExpositoresActivos = () => {
        axios
            .get('expositores/obtenerexpositores')
            .then((response) => {
                this.setState({ rows: response.data, loading: false });
            })
            .catch((error) => {
                console.error('Error obteniendo expositores', error);
            });
    };

    handleDisableExpositor = () => {

        const { apellido, nombre, empresa, email, dni, ciudad, fechaNacimiento, genero, habilitado, tipoIngreso, eventoActivo, selectedRow } = this.state;

        // Resto de la lógica para agregar el evento
        axios
            .post('expositores/cambiarestadoexpositor', {
                id: selectedRow.id,
                apellido: apellido,
                nombre: nombre,
                empresa: empresa,
                email: email,
                dni: dni,
                ciudad: ciudad,
                fechaNacimiento: fechaNacimiento,
                genero: genero,
                habilitado: habilitado ? false : true,
                id_tipoIngreso: tipoIngreso,
                id_evento: eventoActivo,
            })
            .then((response) => {
                // Procesa la respuesta si es necesario
                console.log('Expositor cambio estado con éxito:', response.data);
                // Volver a obtener los eventos activos para actualizar la grilla
                this.ObtenerExpositoresActivos();
                this.handleShowSnackbar(); // Mostrar el Snackbar
                // Cerrar el diálogo modal y limpiar los campos
                this.setState({ confirmDisable: false });
            })
            .catch((error) => {
                // Maneja el error si ocurre
                console.error('Error al cambiar estado el expositor:', error);
                // Cerrar el diálogo modal y limpiar los campos
                this.setState({ confirmDisable: false });
            });
    };

    ObtenerEventosActivos = () => {
        axios
            .get('eventos/obtenereventosactivos')
            .then((response) => {
                this.setState({ eventosActivos: response.data });
            })
            .catch((error) => {
                console.error('Error obteniendo eventos activos', error);
            });
    };

    ObtenerTiposIngreso = () => {
        axios
            .get('expositores/obtenertiposingreso')
            .then((response) => {
                this.setState({ tiposIngreso: response.data });
                console.log(this.state.tiposIngreso);
            })
            .catch((error) => {
                console.error('Error obteniendo tipos de ingreso', error);
            });
    };

    render() {

        //const isAuthenticated = this.isAuthenticated();
        //// Si el usuario no está autenticado, redirigir al componente LoginUser
        //if (!isAuthenticated) {
        //    setTimeout(() => {
        //        window.location.href = '/LoginUser';
        //    }, 0);
        //    return null;
        //}

        const { error, rows, loading, openModal, apellido, nombre, empresa, email, dni, ciudad, fechaNacimiento, genero, habilitado, isEditing, showSnackbar, tiposIngreso, tipoIngreso, eventosActivos, eventoActivo, eventoFiltrado, confirmDisable } = this.state;

        const filteredRows = eventoFiltrado ? rows.filter((row) => row.id_evento === eventoFiltrado) : rows;
        const columns = [
            { field: 'apellido', headerName: 'Apellido', width: 130 },
            { field: 'nombre', headerName: 'Nombre', width: 130 },
            { field: 'empresa', headerName: 'Empresa', width: 130 },
            { field: 'email', headerName: 'Email', width: 250 },
            //{ field: 'dni', headerName: 'DNI', width: 130 },
            //{ field: 'ciudad', headerName: 'Ciudad', width: 130 },
            //{ field: 'fechaNacimiento', headerName: 'Fecha Nacimiento', type: 'datetime', width: 130, valueFormatter: (params) => this.formatDateTime(params.value), },
            //{ field: 'genero', headerName: 'Genero', width: 60 },
            {
                field: 'TipoIngreso', headerName: 'Ingreso', width: 100,
                valueGetter: (params) => {
                    const tipoIngresoId = params.row.id_tipoIngreso;
                    const tipoIngreso = this.state.tiposIngreso.find(tipo => tipo.id === tipoIngresoId);
                    return tipoIngreso ? tipoIngreso.tipo : '';
                },
            },
            {
                field: 'EventoActivo', headerName: 'Evento', width: 100,
                valueGetter: (params) => {
                    const eventoId = params.row.id_evento;
                    const eventoActivo = this.state.eventosActivos.find(evento => evento.id === eventoId);
                    return eventoActivo ? eventoActivo.nombreEvento : '';
                },
            },
            { field: 'habilitado', headerName: 'Habilitado', type: 'boolean', width: 100 },
            {
                field: 'actions',
                headerName: 'Acciones',
                width: 160,
                sortable: false,
                filterable: false,
                renderCell: this.renderCell,
            },
        ];

        return (
            <div style={{ height: '100%', width: '100%' }}>
                <Breadcrumb text='Expositores' />
                <Typography variant="h5" component="h1" align="left" gutterBottom>
                    Expositores
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Button size="small" onClick={this.handleOpenModal}>
                        Agregar Expositor
                    </Button>                    
                    <TextField
                        select
                        label="Filtrar por Evento"
                        value={eventoFiltrado}
                        onChange={(e) => this.setState({ eventoFiltrado: e.target.value })}
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="">Todos los Eventos</MenuItem>
                        {eventosActivos.map((evento) => (
                            <MenuItem key={evento.id} value={evento.id}>
                                {evento.nombreEvento}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={5}
                    loading={loading}
                    autoHeight={true}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    
                />

                <Dialog open={openModal} onClose={this.handleCloseModal}>
                    <DialogTitle>{isEditing ? 'Editar Expositor' : 'Nuevo Expositor' }</DialogTitle>
                    <DialogContent style={{ padding: 10, width: 'auto', minWidth: 400 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            <Paper style={{ padding: 10, width: 'auto', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 400 }}>
                            {error && <Alert severity="error">{error}</Alert>} {/* Mostrar la alerta si hay un mensaje de error */}
                            <TextField
                                select
                                label="Evento"
                                value={eventoActivo}
                                onChange={(e) => this.setState({ eventoActivo: e.target.value })}
                                fullWidth
                                >
                                    {eventosActivos.map((evento) => (
                                    <MenuItem key={evento.id} value={evento.id}>
                                        {evento.nombreEvento}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Apellido"
                                value={apellido}
                                onChange={(e) => this.setState({ apellido: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Nombre"
                                value={nombre}
                                onChange={(e) => this.setState({ nombre: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Empresa"
                                value={empresa}
                                onChange={(e) => this.setState({ empresa: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                value={email}
                                type="email"
                                onChange={(e) => this.setState({ email: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="DNI"
                                value={dni}
                                onChange={(e) => this.setState({ dni: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Ciudad"
                                value={ciudad}
                                onChange={(e) => this.setState({ ciudad: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Fecha Nacimiento"
                                type="date"
                                value={fechaNacimiento.substring(0, 10)}
                                onChange={(e) => {
                                    this.setState({ fechaNacimiento: e.target.value }); // Llama a validarFechas después de actualizar el estado
                                }}
                                required    
                                fullWidth
                                />
                            <TextField
                                label="Genero"
                                value={genero}
                                onChange={(e) => this.setState({ genero: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                select
                                label="Tipo de Ingreso"
                                value={tipoIngreso}
                                onChange={(e) => this.setState({ tipoIngreso: e.target.value })}
                                fullWidth
                            >
                                {tiposIngreso.map((tipo) => (
                                    <MenuItem key={tipo.id} value={tipo.id}>
                                        {tipo.tipo}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={habilitado}
                                        onChange={(e) => this.setState({ habilitado: e.target.checked })}
                                    />
                                }
                                label="Habilitado"
                            />
                            </Paper>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseModal}>Cancelar</Button>
                        <Button onClick={isEditing ? this.handleEditExpositor: this.handleAddExpositor} variant="contained" color="primary">
                            {isEditing ? 'Editar' : 'Agregar'}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={confirmDisable} onClose={() => this.setState({ confirmDisable: false })}>
                    <DialogTitle>Confirmar Accion</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Estas seguro de que deseas modificar el estado del expositor?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ confirmDisable: false })}>
                            Cancelar
                        </Button>
                        <Button onClick={this.handleDisableExpositor} variant="contained" color="primary">
                            Cambiar Estado
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={showSnackbar}
                    autoHideDuration={3000}
                    onClose={() => this.setState({ showSnackbar: false })}
                >
                    <Alert severity="success" sx={{ width: '100%' }}>
                        Expositor modificado satisfactoriamente
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default ExpositoresList;
