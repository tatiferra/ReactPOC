import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './NavMenu.css'
import axios from 'axios';
import 'moment/locale/es'; // Importa el idioma español
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, CircularProgress } from '@mui/material';
import Breadcrumb from './Breadcrumb';

axios.defaults.headers.common['Origin'] = window.location.origin;

export class EventosCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            selectedEvent: null,
            openDialog: false,
            loading: true,
        };
    }

    // Define la función para obtener las propiedades del evento
    getEventProps = (event) => {
        let className = event.habilitado ? 'evento-habilitado' : 'evento-deshabilitado';
        return {
            className,
        };
    };

    componentDidMount() {
        this.obtenerEventos();
    }

    obtenerEventos() {
        axios
            .get('eventos/obtenereventosactivos')
            .then((response) => {
                const eventos = response.data.map((evento) => ({
                    id: evento.id,
                    title: evento.nombreEvento,
                    start: new Date(evento.fechaDesde),
                    end: new Date(evento.fechaHasta),
                    allDay: true,
                    className: evento.habilitado ? 'evento-habilitado' : 'evento-deshabilitado',
                    ...evento, // Agrega todas las propiedades del evento al objeto del calendario
                }));
                this.setState({ events: eventos, loading: false });
            })
            .catch((error) => {
                console.error('Error obteniendo eventos', error);
                this.setState({ loading: false });
            });
    }

    handleSelectEvent = (event) => {
        this.setState({ selectedEvent: event, openDialog: true });
    };

    handleCloseDialog = () => {
        this.setState({ openDialog: false });
    };

    render() {
        moment.locale('es'); // Establece el idioma español

        const localizer = momentLocalizer(moment);
        const { events, selectedEvent, openDialog, loading } = this.state;

        return (
            <div style={{ height: 480 }}>
                <Breadcrumb text='Calendario' />
                <Typography variant="h5" component="h1" align="left" gutterBottom>
                    Calendario de Eventos SSR 
                </Typography>
                {loading ? ( // Muestra el indicador de carga mientras se cargan los eventos
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    selectable
                    onSelectEvent={this.handleSelectEvent}
                    onSelectSlot={(slotInfo) => console.log(slotInfo)}
                    eventPropGetter={this.getEventProps}
                    // Configuración de idioma
                    messages={{
                        next: 'Siguiente',
                        previous: 'Anterior',
                        today: 'Hoy',
                        month: 'Mes',
                        week: 'Semana',
                        day: 'Dia',
                        showMore: (total) => `+ Ver mas (${total})`,
                    }}
                />
                )}
                <Dialog open={openDialog} onClose={this.handleCloseDialog}>
                    <DialogTitle>{selectedEvent && selectedEvent.title}</DialogTitle>
                    <DialogContent>
                        {selectedEvent && (
                            <>
                                <Typography variant="subtitle1">Fecha de inicio: {selectedEvent.start.toLocaleString()}</Typography>
                                <Typography variant="subtitle1">Fecha de fin: {selectedEvent.end.toLocaleString()}</Typography>
                                {/* Agrega aquí más detalles del evento según tus necesidades */}
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog}>Cerrar</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

