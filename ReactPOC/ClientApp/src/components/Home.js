import React, { Component } from 'react';
import TemporaryDrawer from './TemporaryDrawer';
import Badgess from './myBadge'
import { Card, CardContent, CardActions, Button, Typography, Grid, Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';

export class Home extends Component {
  static displayName = Home.name;
  
    constructor(props) {
        super(props);
        this.state = {
            badgeContent: 133,
        }   

        this.events = [
            { date: new Date(2023, 6, 10), title: 'Evento 1' },
            { date: new Date(2023, 6, 15), title: 'Evento 2' },
            // Agrega más eventos aquí
        ];
    }

  render() {
    return (
        <div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    Administrador de Eventos
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Gestiona los eventos que se realizan en la SSR
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button component={Link} to="/eventoslist" size="small" variant="outlined">Lista</Button>
                                <Button component={Link} to="/eventoscard" size="small" variant="outlined">Fichas</Button>
                                <Button component={Link} to="/eventoscalendar" size="small" variant="outlined">Calendario</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    Administrador de Expositores
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Gestiona los expositores autorizados en SSR
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button component={Link} to="/expositoreslist" size="small" variant="outlined">Lista</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    Reportes de Ingresos por Eventos
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Emite consultas de ingreso de los Eventos
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button component={Link} to="/ingresoslist" size="small" variant="outlined">Lista</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>    
            </div>

      </div>
    );
  }
}
