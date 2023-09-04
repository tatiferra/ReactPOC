import React, { Component } from 'react';
import { TextField, Button, Paper, FormControlLabel, Checkbox, Typography } from '@mui/material';
import axios from 'axios';
import { Alert, Stack } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import ReCAPTCHA from "react-google-recaptcha";

class ExpositorRegistro extends Component {
    constructor(props) {
        super(props);
        this.recaptchaRef = React.createRef();
        this.state = {
            // Estados para los campos del formulario
            apellido: '',
            nombre: '',
            empresa: '',
            email: '',
            dni: '',
            ciudad: '',
            fechaNacimiento: '',
            genero: '',
            habilitado: false,
            eventosActivos: [],
            eventoActivo: '',   
            tiposIngreso: [],
            tipoIngreso: '',
            // Estados para la respuesta y error
            showMessage: false,
            successMessage: '',
            errorMessage: '',
        };
    }

    //isAuthenticated() {
    //    const userData = JSON.parse(localStorage.getItem('userData'));
    //    return userData !== null;
    //}

    componentDidMount() {
        this.ObtenerTiposIngreso();
        this.ObtenerEventosActivos();
        const today = new Date().toISOString().split('T')[0];
        this.setState({
            fechaNacimiento: today,
        });
    }

    handleRecaptchaChange = (value) => {
        // Puedes guardar el valor del reCAPTCHA en el estado si es necesario
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

    ObtenerEventosActivos = () => {
        axios
            .get('eventos/obtenereventoshabilitados')
            .then((response) => {
                this.setState({ eventosActivos: response.data });
            })
            .catch((error) => {
                console.error('Error obteniendo eventos habilitados', error);
            });
    };

    handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        this.setState({
            [name]: fieldValue,
        });
    };

    handleFormSubmit = (event) => {
        event.preventDefault();

        // Verifica el reCAPTCHA aquí antes de enviar el formulario
        const recaptchaValue = this.recaptchaRef.current.getValue();
        if (!recaptchaValue) {
            // Mostrar un mensaje de error o realizar alguna acción si el reCAPTCHA no se completó
            return;
        }
        // Resto de la lógica para agregar el expositor
        axios
            .post('expositores/AgregarExpositor', {
                apellido: this.state.apellido,
                nombre: this.state.nombre,
                empresa: this.state.empresa,
                email: this.state.email,
                dni: this.state.dni,
                ciudad: this.state.ciudad,
                fechaNacimiento: this.state.fechaNacimiento,
                genero: this.state.genero,
                habilitado: false,
                // Agrega otros campos aquí según tus necesidades
                id_tipoIngreso: this.state.tipoIngreso,
                id_evento: this.state.eventoActivo,
            })
            .then((response) => {
                this.setState({
                    showMessage: true,
                    successMessage: 'Expositor agregado exitosamente.',
                    errorMessage: '',
                });
                this.resetFormFields();
            })
            .catch((error) => {
                this.setState({
                    showMessage: true,
                    successMessage: '',
                    errorMessage: 'Error al agregar el expositor. ' + error.response.data,
                });
            });
    };

    resetFormFields = () => {
        this.setState({
            apellido: '',
            nombre: '',
            empresa: '',
            email: '',
            dni: '',
            ciudad: '',
            fechaNacimiento: '',
            genero: '',
            habilitado: false,
        });
    };

    render() {
        const {
            apellido,
            nombre,
            empresa,
            email,
            dni,
            ciudad,
            fechaNacimiento,
            genero,
            habilitado,
            showMessage,
            successMessage,
            errorMessage,
            tiposIngreso,
            tipoIngreso,
            eventosActivos,
            eventoActivo,
        } = this.state;

        return (
            <Paper elevation={3} style={{ padding: '20px', width: '400px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', margin: '0 auto', }}>
                <Typography variant="h6" gutterBottom>
                    Registro de Acceso a Evento
                </Typography>
                {showMessage && (
                    <Alert severity={successMessage ? 'success' : 'error'} sx={{ mb: 2 }}>
                        {successMessage || errorMessage}
                    </Alert>
                )}
                <form onSubmit={this.handleFormSubmit}>
                    {/* Agrega los campos del formulario aquí */}
                    <TextField
                        select
                        label="Evento"
                        value={eventoActivo}
                        required
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
                        name="apellido"
                        value={apellido}
                        onChange={this.handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                    />
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={nombre}
                        onChange={this.handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                    />
                    <TextField
                        label="Empresa/Institucion/Periodista/Otro"
                        name="empresa"
                        value={empresa}
                        onChange={this.handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                    />
                    <TextField
                        label="Email"
                        value={email}
                        type="email"
                        name="email"
                        helperText="Email donde se confirma el acceso al Evento"
                        onChange={this.handleInputChange}
                        required
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="DNI"
                        value={dni}
                        name="dni"
                        onChange={this.handleInputChange}
                        required
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Ciudad"
                        value={ciudad}
                        name="ciudad"
                        onChange={this.handleInputChange}
                        required
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Fecha Nacimiento"
                        type="date"
                        name="fechaNacimiento"
                        value={fechaNacimiento.substring(0, 10)}
                        onChange={this.handleInputChange}
                        required
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Genero (M/F/I)"
                        value={genero}
                        name="genero"
                        onChange={this.handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                    />
                    <TextField
                        select
                        label="Tipo de Ingreso"
                        name="tipoIngreso"
                        value={tipoIngreso}
                        onChange={(e) => this.setState({ tipoIngreso: e.target.value })}
                        fullWidth
                        required
                        margin="dense"
                    >
                        {tiposIngreso.map((tipo) => (
                            <MenuItem key={tipo.id} value={tipo.id}>
                                {tipo.tipo}
                            </MenuItem>
                        ))}
                    </TextField>
                    {/*<FormControlLabel*/}
                    {/*    control={*/}
                    {/*        <Checkbox*/}
                    {/*            checked={habilitado}*/}
                    {/*            onChange={this.handleInputChange}*/}
                    {/*        />*/}
                    {/*    }*/}
                    {/*    label="Habilitado"*/}
                    {/*/>*/}
                    <br />
                    {/* Agrega el reCAPTCHA */}
                    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                        <ReCAPTCHA
                            ref={this.recaptchaRef}
                            sitekey="6Ldk7LcnAAAAAFupHGSgXaxwLkYG1XLEFqLVEjsm"
                            onChange={this.handleRecaptchaChange}
                        />
                    </div>
                    {/* Agrega otros campos del formulario según tus necesidades */}
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ margin: 'dense' }} >
                        Registrar Persona
                    </Button>
                </form>
            </Paper>
        );
    }
}

export default ExpositorRegistro;
