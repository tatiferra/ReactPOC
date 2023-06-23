import React, { Component } from 'react';
import axios from 'axios';
import { Paper, Typography, TextField, Button } from '@mui/material';
/*import { withStyles } from '@mui/system';*/

const styles = (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    paper: {
        padding: theme.spacing(2),
        width: 300,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
    },
});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    };

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes implementar la lógica de autenticación o enviar los datos al servidor

        // Crear un objeto con los datos del formulario
        const formData = {
            username: this.state.username,
            password: this.state.password
        };

        // Enviar la solicitud al controlador
        const response = fetch('Login');

        axios.post('/Login', formData)
            .then(response => {
                // Manejar la respuesta del controlador
                console.log(response.data);
            })
            .catch(error => {
                // Manejar los errores de la solicitud
                console.error(error);
            });
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);
    };

    render() {
        const { classes } = this.props;

        return (
            <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 + 'vh' }} >
                <Paper style={{padding:10,width : 300}} >
                    <Typography variant="h5" component="h1" align="center" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={this.handleSubmit}
                        style={{ display: 'flex',flexDirection: 'column',gap: 8}}>
                        <TextField
                            label="Username"
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Login
                        </Button>
                    </form>
                </Paper>
            </div>
        );
    }
}

export default (Login);
