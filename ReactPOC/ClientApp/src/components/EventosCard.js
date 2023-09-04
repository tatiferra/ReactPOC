import React, { Component } from 'react';
import { useState } from 'react';
import { Grid, Card, CardContent, CardActions, CardHeader, Alert, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Tooltip } from '@mui/material';
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

class EventosCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            loading: true,
            openModal: false,
            nombreEvento: '',
            fechaDesde: '',
            fechaHasta: '',
            organizador: '',
            cantidadExpositores: '',
            habilitado: false,
            selectedRow: null,
            isEditing: false, // True es un evento nuevo y False es Edición de un evento existente;
            showSnackbar: false,
            error: '',
            tiposIngreso: [],
            tipoIngreso: '',
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
    }

    handleConfirmDisable = () => {
        this.setState({ confirmDisable: true });
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    handleEdit = (selectedRow) => {
        console.log('Editar evento:', selectedRow);
        // Lógica para editar el usuario con el ID proporcionado
        const formattedFechaDesde = this.formatDate(selectedRow.fechaDesde);
        const formattedFechaHasta = this.formatDate(selectedRow.fechaHasta);
        const isEditing = true; // Comprueba si hay un evento seleccionado
        this.setState({
            selectedRow: selectedRow,
            openModal: true,
            nombreEvento: selectedRow.nombreEvento,
            fechaDesde: formattedFechaDesde,
            fechaHasta: formattedFechaHasta,
            organizador: selectedRow.organizador,
            habilitado: selectedRow.habilitado,
            tipoIngreso: selectedRow.id_tipoIngreso,
            isEditing: isEditing,
        });
        //alert('Editar el evento ' + this.state.fechaDesde.toString());

 
    };

    handleDisable = (selectedRow) => {
        console.log('Deshabilitar evento:', selectedRow);
        // Lógica para editar el usuario con el ID proporcionado
        const formattedFechaDesde = this.formatDate(selectedRow.fechaDesde);
        const formattedFechaHasta = this.formatDate(selectedRow.fechaHasta);
        this.setState({
            selectedRow: selectedRow,
            nombreEvento: selectedRow.nombreEvento,
            fechaDesde: formattedFechaDesde,
            fechaHasta: formattedFechaHasta,
            organizador: selectedRow.organizador,
            habilitado: selectedRow.habilitado,
            tipoIngreso: selectedRow.id_tipoIngreso,
        });
        this.handleConfirmDisable();
        //this.handleDisableEvent();


    };

    handleDelete = (userId) => {
        console.log('Eliminar evento:', userId);
        // Lógica para eliminar el usuario con el ID proporcionado
        alert('Eliminar el evento ' + userId);
    };

    

    handleOpenModal = () => {
        const today = new Date().toISOString().split('T')[0];
        const isEditing = !!this.state.selectedRow; // Comprueba si hay un evento seleccionado
        this.setState({
            openModal: true,
            fechaDesde: today,
            fechaHasta: today,
            isEditing: isEditing,
        });
    };

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            nombreEvento: '',
            fechaDesde: '',
            fechaHasta: '',
            organizador: '',
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

    handleAddEvent = () => {
        const { nombreEvento, fechaDesde, fechaHasta, organizador, habilitado, tipoIngreso} = this.state;

        // Validar campos obligatorios
        if (!nombreEvento || !fechaDesde || !fechaHasta || !organizador || !tipoIngreso) {
            this.setState({ error: 'Por favor, completa todos los campos obligatorios' });
            return;
        }

        // Validar que fechaHasta sea mayor o igual a fechaDesde
        if (new Date(fechaHasta) < new Date(fechaDesde)) {
            this.setState({ error: 'La fecha de fin debe ser mayor o igual a la fecha de inicio' });
            return;
        }

        // Resto de la lógica para agregar el evento
        axios
            .post('eventos/AgregarEvento', {
                nombreEvento: nombreEvento,
                fechaDesde: fechaDesde,
                fechaHasta: fechaHasta,
                organizador: organizador,
                habilitado: habilitado,
                id_tipoIngreso: tipoIngreso,
            })
            .then((response) => {
                // Procesa la respuesta si es necesario
                console.log('Evento agregado con éxito:', response.data);
                // Volver a obtener los eventos activos para actualizar la grilla
                this.ObtenerEventosActivos();
                this.handleShowSnackbar(); // Mostrar el Snackbar
                // Cerrar el diálogo modal y limpiar los campos
                this.handleCloseModal();
            })
            .catch((error) => {
                // Maneja el error si ocurre
                console.error('Error al agregar el evento:', error);
                // Cerrar el diálogo modal y limpiar los campos
                this.handleCloseModal();
            });

        
    };

    handleEditEvent = () => {
        const { nombreEvento, fechaDesde, fechaHasta, organizador, habilitado, tipoIngreso, selectedRow } = this.state;

        // Validar campos obligatorios
        if (!nombreEvento || !fechaDesde || !fechaHasta || !organizador || !tipoIngreso) {
            this.setState({ error: 'Por favor, completa todos los campos obligatorios' });
            return;
        }

        // Validar que fechaHasta sea mayor o igual a fechaDesde
        if (new Date(fechaHasta) < new Date(fechaDesde)) {
            this.setState({ error: 'La fecha de fin debe ser mayor o igual a la fecha de inicio' });
            return;
        }

        // Resto de la lógica para agregar el evento
        axios
            .post('eventos/EditarEvento', {
                id: selectedRow.id,
                nombreEvento: nombreEvento,
                fechaDesde: fechaDesde,
                fechaHasta: fechaHasta,
                organizador: organizador,
                habilitado: habilitado,
                id_tipoIngreso: tipoIngreso,
            })
            .then((response) => {
                // Procesa la respuesta si es necesario
                console.log('Evento agregado con éxito:', response.data);
                // Volver a obtener los eventos activos para actualizar la grilla
                this.ObtenerEventosActivos();
                this.handleShowSnackbar(); // Mostrar el Snackbar
                // Cerrar el diálogo modal y limpiar los campos
                this.handleCloseModal();
            })
            .catch((error) => {
                // Maneja el error si ocurre
                console.error('Error al agregar el evento:', error);
                // Cerrar el diálogo modal y limpiar los campos
                this.handleCloseModal();
            });


    };

    handleDisableEvent = () => {
        
        const { nombreEvento, fechaDesde, fechaHasta, organizador, habilitado, tipoIngreso, selectedRow } = this.state;

        // Resto de la lógica para agregar el evento
        axios
            .post('eventos/CambiarEstadoEvento', {
                id: selectedRow.id,
                nombreEvento: nombreEvento,
                fechaDesde: fechaDesde,
                fechaHasta: fechaHasta,
                organizador: organizador,
                habilitado: habilitado ? false : true,
                id_tipoIngreso: tipoIngreso,
            })
            .then((response) => {
                // Procesa la respuesta si es necesario
                console.log('Evento cambio estado con éxito:', response.data);
                // Volver a obtener los eventos activos para actualizar la grilla
                this.ObtenerEventosActivos();
                this.handleShowSnackbar(); // Mostrar el Snackbar
                // Cerrar el diálogo modal y limpiar los campos
                this.setState({ confirmDisable: false });
            })
            .catch((error) => {
                // Maneja el error si ocurre
                console.error('Error al cambiar estado el evento:', error);
                // Cerrar el diálogo modal y limpiar los campos
                this.setState({ confirmDisable: false });
            });
    };

    validarFechas = () => {
        const { fechaDesde, fechaHasta } = this.state;

        // Validar campos vacíos
        if (!fechaDesde || !fechaHasta) {
            this.setState({ error: '' });
            return;
        }

        // Validar que fechaHasta sea mayor o igual a fechaDesde
        if (new Date(fechaHasta) < new Date(fechaDesde)) {
            this.setState({ error: 'La fecha de fin debe ser mayor o igual a la fecha de inicio' });
        } else {
            this.setState({ error: '' });
        }
    };

    getTipoIngreso = (tipoIngresoId) => {
        const tipoIngreso = this.state.tiposIngreso.find((tipo) => tipo.id === tipoIngresoId);
        return tipoIngreso ? tipoIngreso.tipo : '';
    };

    ObtenerEventosActivos = () => {
        axios
            .get('eventos/obtenereventosactivos')
            .then((response) => {
                this.setState({ rows: response.data, loading: false });
            })
            .catch((error) => {
                console.error('Error obteniendo eventos', error);
            });
    };

    ObtenerTiposIngreso = () => {
        axios
            .get('eventos/obtenertiposingreso')
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

        const { error, rows, loading, openModal, nombreEvento, fechaDesde, fechaHasta, organizador, habilitado, isEditing, showSnackbar, tiposIngreso, tipoIngreso, confirmDisable } = this.state;
        const columns = [
            { field: 'nombreEvento', headerName: 'Evento', width: 180 },
            { field: 'fechaDesde', headerName: 'Fecha Inicio', type: 'datetime', width: 130, valueFormatter: (params) => this.formatDateTime(params.value), },
            { field: 'fechaHasta', headerName: 'Fecha Fin', type: 'datetime', width: 130, valueFormatter: (params) => this.formatDateTime(params.value), },
            { field: 'organizador', headerName: 'Organizador', width: 130 },
            {
                field: 'TipoIngreso', headerName: 'Ingreso', width: 100,
                valueGetter: (params) => {
                    const tipoIngresoId = params.row.id_tipoIngreso;
                    const tipoIngreso = this.state.tiposIngreso.find(tipo => tipo.id === tipoIngresoId);
                    return tipoIngreso ? tipoIngreso.tipo : '';
                },
            },
            { field: 'habilitado', headerName: 'Habilitado', type: 'boolean', width: 100 },
            { field: 'cantidadExpositores', headerName: 'Expositores', width: 100, align: 'center', },
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
                <Breadcrumb text='Ficha Eventos' />
                <Typography variant="h5" component="h1" align="left" gutterBottom>
                    Eventos
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Button size="small" onClick={this.handleOpenModal}>
                        Agregar Evento
                    </Button>
                    
                </Stack>

                <Grid container spacing={2}>
                {rows.map((row) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={row.id}>
                        <Card sx={{ marginBottom: 2, height: '100%' }}>
                            {/*<CardHeader sx={{ backgroundColor: row.habilitado ? '#b3ffb3' : '#ffb3b3' }} />*/}
                            <CardContent>
                                <Typography variant="h6" component="h2" sx={{ backgroundColor: row.habilitado ? '#b3ffb3' : '#ffb3b3' }}> {/* Cambiar variant a "h6" */}
                                    {row.nombreEvento}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom variant="body2"> {/* Agregar variant "body2" */}
                                    {this.formatDateTime(row.fechaDesde)} - {this.formatDateTime(row.fechaHasta)}
                                </Typography>
                               
                                <Typography variant="body2" component="p">
                                    {row.organizador}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Total Expositores: ({row.cantidadExpositores})
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Tipo de Ingreso: {this.getTipoIngreso(row.id_tipoIngreso)}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Habilitado: {row.habilitado ? 'Si' : 'No'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Stack direction="row" spacing={1}>
                                    <Button size="small" onClick={() => this.handleEdit(row)}>
                                        Editar
                                    </Button>
                                    <Button size="small" onClick={() => this.handleDisable(row)}>
                                        Cambiar Estado
                                    </Button>
                                    {/*<Button size="small" onClick={() => this.handleDelete(row.id)}>*/}
                                    {/*    Eliminar*/}
                                    {/*</Button>*/}
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                </Grid>

                <Dialog open={openModal} onClose={this.handleCloseModal}>
                    <DialogTitle>{isEditing ? 'Editar Evento' : 'Nuevo Evento' }</DialogTitle>
                    <DialogContent style={{ padding: 10, width: 'auto', minWidth: 400 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            <Paper style={{ padding: 10, width: 'auto', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 400 }}>
                            {error && <Alert severity="error">{error}</Alert>} {/* Mostrar la alerta si hay un mensaje de error */}
                            <TextField
                                label="Nombre Evento"
                                value={nombreEvento}
                                onChange={(e) => this.setState({ nombreEvento: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Fecha Inicio"
                                type="date"
                                value={fechaDesde.substring(0, 10)}
                                onChange={(e) => {
                                    this.setState({ fechaDesde: e.target.value }, this.validarFechas); // Llama a validarFechas después de actualizar el estado
                                }}
                                required    
                                fullWidth
                                />
                            
                            <TextField
                                label="Fecha Fin"
                                type="date"
                                value={fechaHasta.substring(0, 10)}
                                onChange={(e) => {
                                    this.setState({ fechaHasta: e.target.value }, this.validarFechas); // Llama a validarFechas después de actualizar el estado
                                }}
                                required
                                fullWidth
                                />
                            <TextField
                                label="Organizador"
                                value={organizador}
                                onChange={(e) => this.setState({ organizador: e.target.value })}
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
                        <Button onClick={isEditing ? this.handleEditEvent: this.handleAddEvent} variant="contained" color="primary">
                            {isEditing ? 'Editar' : 'Agregar'}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={confirmDisable} onClose={() => this.setState({ confirmDisable: false })}>
                    <DialogTitle>Confirmar Accion</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Estas seguro de que deseas modificar el estado del evento?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ confirmDisable: false })}>
                            Cancelar
                        </Button>
                        <Button onClick={this.handleDisableEvent} variant="contained" color="primary">
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
                        Evento modificado satisfactoriamente
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default EventosCard;
