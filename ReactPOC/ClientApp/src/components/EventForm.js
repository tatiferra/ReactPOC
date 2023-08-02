import React, { Component } from "react";
import { Paper, Typography, TextField, Button, Select, InputLabel, MenuItem, FormControl } from '@mui/material';

class EventForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nombreEvento: "",
            fechaDesde: new Date(Date.now()).toISOString().split("T")[0],
            fechaHasta: new Date(Date.now()).toISOString().split("T")[0],
            habilitado: false,
            id_tipoIngreso: "",
            organizador: "",
            age: "",
            errors: {}
        }
    }

    handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const inputValue = type === "checkbox" ? checked : value;
        this.setState({ [name]: inputValue });
    };

    handleChangeSelect = (event) => {
        
        this.setState({ ["age"]: event.target.value });
        
    };

    handleSubmit = (event) => {
        event.preventDefault();

        // Validar los datos del formulario antes de enviarlos al servidor
        if (this.validateForm()) {
            // Enviar los datos al servidor
            const eventData = {
                nombreEvento: this.state.nombreEvento,
                fechaDesde: this.state.fechaDesde,
                fechaHasta: this.state.fechaHasta,
                habilitado: this.state.habilitado,
                id_tipoIngreso: this.state.id_tipoIngreso,
                organizador: this.state.organizador,
                age: this.state.age
            };

            // Lógica para enviar los datos al servidor o ejecutar la acción correspondiente
            // por ejemplo, usando una API o llamando a una función del padre mediante props

            // Limpiar el formulario después de enviar los datos
            this.setState({
                nombreEvento: "",
                fechaDesde: new Date(Date.now()).toISOString().split("T")[0],
                fechaHasta: Date.now,
                habilitado: false,
                id_tipoIngreso: "",
                organizador: "",
                age: "",
                errors: {}
            });
        }
    };

    validateForm = () => {
        const errors = {};
        let isValid = true;

        if (this.state.nombreEvento.trim() === "") {
            errors.nombreEvento = "El nombre del evento es requerido";
            isValid = false;
        }

        if (this.state.fechaDesde.trim() === "") {
            errors.fechaDesde = "La fecha desde es requerida";
            isValid = false;
        }

        if (this.state.fechaHasta.trim() === "") {
            errors.fechaHasta = "La fecha hasta es requerida";
            isValid = false;
        }

        if (this.state.id_tipoIngreso.trim() === "") {
            errors.id_tipoIngreso = "El modelo de ingreso es requerido";
            isValid = false;
        }

        if (this.state.organizador.trim() === "") {
            errors.organizador = "El organizador del evento es requerido";
            isValid = false;
        }

        this.setState({ errors });
        return isValid;
    };

    render() {
        const { errors } = this.state;

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 + 'vh' }} >
                <Paper style={{ padding: 10, width: 600 }} >
                    <Typography variant="h5" component="h1" align="center" gutterBottom>
                        Nuevo Evento
                    </Typography>
                <form onSubmit={this.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    
                    <TextField
                        name="nombreEvento"
                        label="Nombre Evento"
                        value={this.state.nombreEvento}
                        onChange={this.handleChange}
                        error={errors.nombreEvento ? true : false}
                        helperText={errors.nombreEvento}
                        required
                        fullWidth
                    />
                    <TextField
                        name="fechaDesde"
                        label="Fecha Desde"
                        type="date"
                        value={this.state.fechaDesde}
                        onChange={this.handleChange}
                        error={errors.fechaDesde ? true : false}
                        helperText={errors.fechaDesde}
                        required
                        fullWidth
                    />
                    <TextField
                        name="fechaHasta"
                        label="Fecha Hasta"
                        type="date"
                        value={this.state.fechaHasta}
                        onChange={this.handleChange}
                        error={errors.fechaHasta ? true : false}
                        helperText={errors.fechaHasta}
                        required
                        fullWidth
                    />
                    <TextField
                        name="id_tipoIngreso"
                        label="Modelo de Ingreso"
                        value={this.state.id_tipoIngreso}
                        onChange={this.handleChange}
                        error={errors.id_tipoIngreso ? true : false}
                        helperText={errors.id_tipoIngreso}
                        required
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Tipo de Ingreso</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.age}
                            label="Tipo de Ingreso"
                            onChange={this.handleChangeSelect}
                        >
                            <MenuItem value={10}>Unico</MenuItem>
                            <MenuItem value={20}>Recurrente</MenuItem>
 
                            </Select>
                    </FormControl>
                    <TextField
                        name="organizador"
                        label="Organizador"
                        value={this.state.organizador}
                        onChange={this.handleChange}
                        error={errors.organizador ? true : false}
                        helperText={errors.organizador}
                        required
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Agregar Evento
                    </Button>
                    </form>
                </Paper>
            </div>
        );
    }
}

export default (EventForm);
