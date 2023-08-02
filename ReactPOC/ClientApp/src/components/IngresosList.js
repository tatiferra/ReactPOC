import React, { Component } from 'react';
import { useState } from 'react';
import { Alert, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Tooltip, Modal } from '@mui/material';
import { FormControlLabel, Checkbox, Snackbar } from '@mui/material';
import { DataGrid, GridActionsCellItem, esES } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import MenuItem from '@mui/material/MenuItem';
import { saveAs } from 'file-saver';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFReport from './PDFReport';
import Papa from 'papaparse';
import Breadcrumb from './Breadcrumb';


/*import { Paper, Typography, TextField, Button, Alert, Stack } from '@mui/material';*/
import axios from 'axios';

axios.defaults.headers.common['Origin'] = window.location.origin;

class IngresosList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            loading: true,
            openModal: false,
            expositor: '',
            empresa: '',
            evento: '',
            fechaIngreso: '',
            valido: false,
            selectedRow: null,
            isEditing: false, // True es un evento nuevo y False es Edición de un evento existente;
            showSnackbar: false,
            error: '',
            confirmDisable: false,
            selectedEvent: null,
            eventos: null,
            pdfContent: null, // Initialize pdfContent state as null
        };
    }

    handleSelectEvent = (event) => {
        this.setState({ selectedEvent: event })
    }

    handleGeneratePDF = () => {
        const { rows } = this.state;

        // Renderiza el contenido del PDF en memoria
        const pdfContent = (
            <PDFReport rows={rows} />
        );

        this.setState({ pdfContent }); // Guarda el contenido del PDF en el estado
    };

    downloadPDF = () => {
        const { pdfContent } = this.state;

        // Si el contenido del PDF está disponible, inicia la descarga
        if (pdfContent) {
            const blob = new Blob([pdfContent], { type: 'application/pdf' });
            saveAs(blob, 'reporte.pdf');
        }
    };

    isAuthenticated() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        return userData !== null;
    }

    componentDidMount() {
        this.ObtenerEventosActivos();

        // Verificar si ya hay un evento seleccionado
        const { selectedEvent } = this.state;
        if (selectedEvent) {
            // Si hay un evento seleccionado, cargar los ingresos correspondientes
            this.ObtenerIngresosActivos();
        } else {
            // Si no hay un evento seleccionado, abrir el diálogo modal
            this.handleOpenModal();
        }
        
    } 

    handleConfirmDisable = () => {
        this.setState({ confirmDisable: true });
    };

    handleShowSnackbar = () => {
        this.setState({ showSnackbar: true });
    };

    ObtenerEventosActivos = () => {
        axios
            .get('eventos/obtenereventosactivos')
            .then((response) => {
                this.setState({ eventos: response.data });
            })
            .catch((error) => {
                console.error('Error obteniendo eventos', error);
            });
    };

    //handleEdit = (selectedRow) => {
    //    console.log('Editar evento:', selectedRow);
    //    // Lógica para editar el usuario con el ID proporcionado
    //    const formattedFechaDesde = this.formatDate(selectedRow.fechaDesde);
    //    const formattedFechaHasta = this.formatDate(selectedRow.fechaHasta);
    //    const isEditing = true; // Comprueba si hay un evento seleccionado
    //    this.setState({
    //        selectedRow: selectedRow,
    //        openModal: true,
    //        nombreEvento: selectedRow.nombreEvento,
    //        fechaDesde: formattedFechaDesde,
    //        fechaHasta: formattedFechaHasta,
    //        organizador: selectedRow.organizador,
    //        habilitado: selectedRow.habilitado,
    //        tipoIngreso: selectedRow.id_tipoIngreso,
    //        isEditing: isEditing,
    //    });
    //    //alert('Editar el evento ' + this.state.fechaDesde.toString());

 
    //};

    //handleDisable = (selectedRow) => {
    //    console.log('Deshabilitar evento:', selectedRow);
    //    // Lógica para editar el usuario con el ID proporcionado
    //    const formattedFechaDesde = this.formatDate(selectedRow.fechaDesde);
    //    const formattedFechaHasta = this.formatDate(selectedRow.fechaHasta);
    //    this.setState({
    //        selectedRow: selectedRow,
    //        nombreEvento: selectedRow.nombreEvento,
    //        fechaDesde: formattedFechaDesde,
    //        fechaHasta: formattedFechaHasta,
    //        organizador: selectedRow.organizador,
    //        habilitado: selectedRow.habilitado,
    //        tipoIngreso: selectedRow.id_tipoIngreso,
    //    });
    //    this.handleConfirmDisable();
    //    //this.handleDisableEvent();


    //};

    //handleDelete = (userId) => {
    //    console.log('Eliminar evento:', userId);
    //    // Lógica para eliminar el usuario con el ID proporcionado
    //    alert('Eliminar el evento ' + userId);
    //};

    

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
        const { selectedEvent } = this.state;
        if (selectedEvent) {
            this.setState({
                openModal: false,
                error: '',
            });
        } 
    };

    handleLoadEvent = () => {
        const { selectedEvent } = this.state;

        if (selectedEvent) {
            this.ObtenerIngresosActivos();

            // Cerrar el diálogo modal
            this.handleCloseModal();

        } else {
            // Si no se ha seleccionado un evento, puedes mostrar un mensaje de error o realizar otra acción
            console.log('No se ha seleccionado un evento');
        }
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

    // Función para exportar a CSV
    exportToCSV = () => {
        const { rows } = this.state;
        const csv = Papa.unparse(rows);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'reporte.csv');
    };

    //handleAddEvent = () => {
    //    const { nombreEvento, fechaDesde, fechaHasta, organizador, habilitado, tipoIngreso} = this.state;

    //    // Validar campos obligatorios
    //    if (!nombreEvento || !fechaDesde || !fechaHasta || !organizador || !tipoIngreso) {
    //        this.setState({ error: 'Por favor, completa todos los campos obligatorios' });
    //        return;
    //    }

    //    // Validar que fechaHasta sea mayor o igual a fechaDesde
    //    if (new Date(fechaHasta) < new Date(fechaDesde)) {
    //        this.setState({ error: 'La fecha de fin debe ser mayor o igual a la fecha de inicio' });
    //        return;
    //    }

    //    // Resto de la lógica para agregar el evento
    //    axios
    //        .post('eventos/AgregarEvento', {
    //            nombreEvento: nombreEvento,
    //            fechaDesde: fechaDesde,
    //            fechaHasta: fechaHasta,
    //            organizador: organizador,
    //            habilitado: habilitado,
    //            id_tipoIngreso: tipoIngreso,
    //        })
    //        .then((response) => {
    //            // Procesa la respuesta si es necesario
    //            console.log('Evento agregado con éxito:', response.data);
    //            // Volver a obtener los eventos activos para actualizar la grilla
    //            this.ObtenerEventosActivos();
    //            this.handleShowSnackbar(); // Mostrar el Snackbar
    //            // Cerrar el diálogo modal y limpiar los campos
    //            this.handleCloseModal();
    //        })
    //        .catch((error) => {
    //            // Maneja el error si ocurre
    //            console.error('Error al agregar el evento:', error);
    //            // Cerrar el diálogo modal y limpiar los campos
    //            this.handleCloseModal();
    //        });

        
    //};

    //handleEditEvent = () => {
    //    const { nombreEvento, fechaDesde, fechaHasta, organizador, habilitado, tipoIngreso, selectedRow } = this.state;

    //    // Validar campos obligatorios
    //    if (!nombreEvento || !fechaDesde || !fechaHasta || !organizador || !tipoIngreso) {
    //        this.setState({ error: 'Por favor, completa todos los campos obligatorios' });
    //        return;
    //    }

    //    // Validar que fechaHasta sea mayor o igual a fechaDesde
    //    if (new Date(fechaHasta) < new Date(fechaDesde)) {
    //        this.setState({ error: 'La fecha de fin debe ser mayor o igual a la fecha de inicio' });
    //        return;
    //    }

    //    // Resto de la lógica para agregar el evento
    //    axios
    //        .post('eventos/EditarEvento', {
    //            id: selectedRow.id,
    //            nombreEvento: nombreEvento,
    //            fechaDesde: fechaDesde,
    //            fechaHasta: fechaHasta,
    //            organizador: organizador,
    //            habilitado: habilitado,
    //            id_tipoIngreso: tipoIngreso,
    //        })
    //        .then((response) => {
    //            // Procesa la respuesta si es necesario
    //            console.log('Evento agregado con éxito:', response.data);
    //            // Volver a obtener los eventos activos para actualizar la grilla
    //            this.ObtenerEventosActivos();
    //            this.handleShowSnackbar(); // Mostrar el Snackbar
    //            // Cerrar el diálogo modal y limpiar los campos
    //            this.handleCloseModal();
    //        })
    //        .catch((error) => {
    //            // Maneja el error si ocurre
    //            console.error('Error al agregar el evento:', error);
    //            // Cerrar el diálogo modal y limpiar los campos
    //            this.handleCloseModal();
    //        });


    //};

    //handleDisableEvent = () => {
        
    //    const { nombreEvento, fechaDesde, fechaHasta, organizador, habilitado, tipoIngreso, selectedRow } = this.state;

    //    // Resto de la lógica para agregar el evento
    //    axios
    //        .post('eventos/CambiarEstadoEvento', {
    //            id: selectedRow.id,
    //            nombreEvento: nombreEvento,
    //            fechaDesde: fechaDesde,
    //            fechaHasta: fechaHasta,
    //            organizador: organizador,
    //            habilitado: habilitado ? false : true,
    //            id_tipoIngreso: tipoIngreso,
    //        })
    //        .then((response) => {
    //            // Procesa la respuesta si es necesario
    //            console.log('Evento cambio estado con éxito:', response.data);
    //            // Volver a obtener los eventos activos para actualizar la grilla
    //            this.ObtenerEventosActivos();
    //            this.handleShowSnackbar(); // Mostrar el Snackbar
    //            // Cerrar el diálogo modal y limpiar los campos
    //            this.setState({ confirmDisable: false });
    //        })
    //        .catch((error) => {
    //            // Maneja el error si ocurre
    //            console.error('Error al cambiar estado el evento:', error);
    //            // Cerrar el diálogo modal y limpiar los campos
    //            this.setState({ confirmDisable: false });
    //        });
    //};

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


    ObtenerIngresosActivos = () => {
        const { selectedEvent } = this.state;
        const eventoId = selectedEvent ? selectedEvent : null; // Obtener el id del evento seleccionado

        if (eventoId) {
            axios
                .get(`ingresos/obteneringresosactivos?eventoId=${eventoId}`) // Pasar el eventoId como parámetro en la URL
                .then((response) => {
                    this.setState({ rows: response.data, loading: false });
                })
                .catch((error) => {
                    console.error('Error obteniendo eventos', error);
                });
        } else {
            // Si no hay evento seleccionado, puedes mostrar un mensaje de error o realizar otra acción
            console.log('No hay evento seleccionado');
        }
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

        const { error, rows, loading, openModal, showSnackbar, confirmDisable, eventos, selectedEvent, pdfContent } = this.state;
        const columns = [
            { field: 'evento', headerName: 'Evento', width: 180 },
            { field: 'expositor', headerName: 'Expositor', width: 180 },
            { field: 'empresa', headerName: 'Empresa', width: 130 },
            { field: 'fechaIngreso', headerName: 'Fecha Ingreso', type: 'datetime', width: 130, valueFormatter: (params) => this.formatDateTime(params.value), },
            { field: 'horaIngreso', headerName: 'Hora de ingreso', type: 'datetime', width: 130, valueGetter: (params) => new Date(params.row.fechaIngreso).toLocaleTimeString(),
            },
            { field: 'valido', headerName: 'Valido', type: 'boolean', width: 100 },
            {
                field: 'actions',
                headerName: 'Acciones',
                width: 160,
                sortable: false,
                filterable: false,
                renderCell: this.renderCell,
            },
        ];

        // Verificar si eventos tiene un valor antes de realizar el mapeo
        const eventosOptions = eventos ? eventos.map((evento) => (
            <MenuItem key={evento.id} value={evento.id}>
                {evento.nombreEvento}
            </MenuItem>
        )) : null;

        return (
            <div style={{ height: '100%', width: '100%' }}>
                <Breadcrumb text='Ingresos' />
                <Typography variant="h5" component="h1" align="left" gutterBottom>
                    Ingresos
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Button size="small" onClick={this.handleOpenModal}>
                        Seleccionar Evento
                    </Button>
                    <Button size="small" onClick={this.exportToCSV}>
                        Exportar a CSV
                    </Button>
                    <Button size="small" onClick={this.handleGeneratePDF}>
                        Generar Reporte PDF
                    </Button>
                    {/* Agrega el PDFDownloadLink */}
                    <PDFDownloadLink
                        document={this.state.pdfContent}
                        fileName="reporte.pdf"
                    >
                        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar Reporte')}
                    </PDFDownloadLink>
                </Stack>

                {/* Agrega el diálogo modal para seleccionar el evento */}
                {/*<Dialog open={openModal} onClose={this.handleCloseModal} disableEscapeKeyDown BackdropProps={{*/}
                {/*    onClick: () => { } // Evitar el cierre al hacer clic en el fondo*/}
                {/*}}>*/}
                {/*    <DialogTitle>Seleccionar Evento</DialogTitle>*/}
                {/*    <DialogContent>*/}
                {/*        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >*/}
                {/*            <Paper style={{ padding: 10, width: 'auto', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 300 }}>*/}
                {/*                <TextField*/}
                {/*                    select*/}
                {/*                    label="Evento"*/}
                {/*                    value={selectedEvent}*/}
                {/*                    onChange={(e) => this.handleSelectEvent(e.target.value)}*/}
                {/*                    fullWidth*/}
                {/*                >*/}
                {/*                    {eventosOptions}*/}
                {/*                </TextField>*/}
                {/*            </Paper>*/}
                {/*        </div>*/}
                {/*    </DialogContent>*/}
                {/*    <DialogActions>*/}
                {/*        <Button onClick={this.handleCloseModal}>Cancelar</Button>*/}
                {/*        <Button*/}
                {/*            onClick={this.handleLoadEvent}*/}
                {/*            variant="contained"*/}
                {/*            color="primary"*/}
                {/*            disabled={!selectedEvent}*/}
                {/*        >*/}
                {/*            Cargar Evento*/}
                {/*        </Button>*/}
                {/*    </DialogActions>*/}
                {/*</Dialog>*/}
                <Modal open={openModal} onClose={this.handleCloseModal} disableEscapeKeyDown BackdropProps={{ onClick: () => { } }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Paper style={{ padding: 10, width: 'auto', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 300 }}>
                            <DialogTitle>Seleccionar Evento</DialogTitle>
                            <DialogContent>
                                <Paper style={{ padding: 10, width: 'auto', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 300 }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <TextField
                                            select
                                            label="Evento"
                                            value={selectedEvent}
                                            onChange={(e) => this.handleSelectEvent(e.target.value)}
                                            fullWidth
                                        >
                                            {eventosOptions}
                                        </TextField>
                                    </div>
                                </Paper>
                            </DialogContent>
                            <DialogActions style={{ marginTop: 'auto' }}>
                                <Button onClick={this.handleCloseModal}>Cancelar</Button>
                                <Button onClick={this.handleLoadEvent} variant="contained" color="primary" disabled={!selectedEvent}>
                                    Cargar Evento
                                </Button>
                            </DialogActions>
                        </Paper>
                    </div>
                </Modal>


                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    loading={loading}
                    autoHeight={true}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    
                />

                {/*<Dialog open={openModal} onClose={this.handleCloseModal}>*/}
                {/*    <DialogTitle>{isEditing ? 'Editar Evento' : 'Nuevo Evento' }</DialogTitle>*/}
                {/*    <DialogContent style={{ padding: 10, width: 'auto', minWidth: 400 }}>*/}
                {/*        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >*/}
                {/*            <Paper style={{ padding: 10, width: 'auto', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 400 }}>*/}
                {/*            {error && <Alert severity="error">{error}</Alert>} */}{/* Mostrar la alerta si hay un mensaje de error */}
                {/*            <TextField*/}
                {/*                label="Nombre Evento"*/}
                {/*                value={nombreEvento}*/}
                {/*                onChange={(e) => this.setState({ nombreEvento: e.target.value })}*/}
                {/*                required*/}
                {/*                fullWidth*/}
                {/*            />*/}
                {/*            <TextField*/}
                {/*                label="Fecha Inicio"*/}
                {/*                type="date"*/}
                {/*                value={fechaDesde.substring(0, 10)}*/}
                {/*                onChange={(e) => {*/}
                {/*                    this.setState({ fechaDesde: e.target.value }, this.validarFechas); // Llama a validarFechas después de actualizar el estado*/}
                {/*                }}*/}
                {/*                required    */}
                {/*                fullWidth*/}
                {/*                />*/}
                            
                {/*            <TextField*/}
                {/*                label="Fecha Fin"*/}
                {/*                type="date"*/}
                {/*                value={fechaHasta.substring(0, 10)}*/}
                {/*                onChange={(e) => {*/}
                {/*                    this.setState({ fechaHasta: e.target.value }, this.validarFechas); // Llama a validarFechas después de actualizar el estado*/}
                {/*                }}*/}
                {/*                required*/}
                {/*                fullWidth*/}
                {/*                />*/}
                {/*            <TextField*/}
                {/*                label="Organizador"*/}
                {/*                value={organizador}*/}
                {/*                onChange={(e) => this.setState({ organizador: e.target.value })}*/}
                {/*                fullWidth*/}
                {/*                />*/}
                {/*                <TextField*/}
                {/*                    select*/}
                {/*                    label="Tipo de Ingreso"*/}
                {/*                    value={tipoIngreso}*/}
                {/*                    onChange={(e) => this.setState({ tipoIngreso: e.target.value })}*/}
                {/*                    fullWidth*/}
                {/*                >*/}
                {/*                    {tiposIngreso.map((tipo) => (*/}
                {/*                        <MenuItem key={tipo.id} value={tipo.id}>*/}
                {/*                            {tipo.tipo}*/}
                {/*                        </MenuItem>*/}
                {/*                    ))}*/}
                {/*                </TextField>*/}
                {/*            <FormControlLabel*/}
                {/*                control={*/}
                {/*                    <Checkbox*/}
                {/*                        checked={habilitado}*/}
                {/*                        onChange={(e) => this.setState({ habilitado: e.target.checked })}*/}
                {/*                    />*/}
                {/*                }*/}
                {/*                label="Habilitado"*/}
                {/*            />*/}
                {/*            </Paper>*/}
                {/*        </div>*/}
                {/*    </DialogContent>*/}
                {/*    <DialogActions>*/}
                {/*        <Button onClick={this.handleCloseModal}>Cancelar</Button>*/}
                {/*        <Button onClick={isEditing ? this.handleEditEvent: this.handleAddEvent} variant="contained" color="primary">*/}
                {/*            {isEditing ? 'Editar' : 'Agregar'}*/}
                {/*        </Button>*/}
                {/*    </DialogActions>*/}
                {/*</Dialog>*/}
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

export default IngresosList;
