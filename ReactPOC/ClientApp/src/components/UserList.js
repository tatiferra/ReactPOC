import React, { Component } from 'react';
import { DataGrid, GridActionsCellItem, esES } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Paper, Typography, TextField, Button, Alert, Stack } from '@mui/material';
import axios from 'axios';


//const spanishLocaleText = {
//     Filter panel text
//    filterPanelAddFilter: 'Agregar Filtro',
//    filterPanelRemoveAll: 'Eliminar Todos',
//    filterPanelDeleteIconLabel: 'Eliminar',
//    filterPanelLogicOperator: 'Operador Logico',
//    filterPanelOperator: 'Operador',
//    filterPanelOperatorAnd: 'Y',
//    filterPanelOperatorOr: 'O',
//    filterPanelColumns: 'Columnas',
//    filterPanelInputLabel: 'Valor',
//    filterPanelInputPlaceholder: 'Valor Filtro',

//     Filter operators text
//    filterOperatorContains: 'contiene',
//    filterOperatorEquals: 'igual a',
//    filterOperatorStartsWith: 'comienza con',
//    filterOperatorEndsWith: 'termina con',
//    filterOperatorIs: 'es',
//    filterOperatorNot: 'no es',
//    filterOperatorAfter: 'is after',
//    filterOperatorOnOrAfter: 'is on or after',
//    filterOperatorBefore: 'is before',
//    filterOperatorOnOrBefore: 'is on or before',
//    filterOperatorIsEmpty: 'is empty',
//    filterOperatorIsNotEmpty: 'is not empty',
//    filterOperatorIsAnyOf: 'is any of',
//    'filterOperator=': '=',
//    'filterOperator!=': '!=',
//    'filterOperator>': '>',
//    'filterOperator>=': '>=',
//    'filterOperator<': '<',
//    'filterOperator<=': '<=',

//     Column menu text
//    columnMenuLabel: 'Menu',
//    columnMenuShowColumns: 'Mostrar columnas',
//    columnMenuManageColumns: 'Gestionar columnas',
//    columnMenuFilter: 'Filtrar',
//    columnMenuHideColumn: 'Ocultar columna',
//    columnMenuUnsort: 'No Ordenar',
//    columnMenuSortAsc: 'Ordenar por ASC',
//    columnMenuSortDesc: 'Ordenar por DESC',

//     Otros mensajes
//    noRowsLabel: 'No hay filas para mostrar',
//};

//const rows = [
//    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
//];

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.ObtenerUsuarios();
    }

    handleEdit = (userId) => {
        console.log('Editar usuario:', userId);
        // Lógica para editar el usuario con el ID proporcionado
        alert('Editar el usuario ' + userId);
    };

    handleDelete = (userId) => {
        console.log('Eliminar usuario:', userId);
        // Lógica para eliminar el usuario con el ID proporcionado
        alert('Eliminar el usuario ' + userId);
    };

    renderCell = (params) => {
        const { id } = params;
        const handleEdit = () => this.handleEdit(id);
        const handleDelete = () => this.handleDelete(id);

        return (
            <>
                <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEdit}
                color="inherit"
                />
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleDelete}
                    color="inherit"
                />
            </>
        );
    };


    ObtenerUsuarios = () => {
        axios
            .get('login/obtenerusuarios')
            .then((response) => {
                this.setState({ rows: response.data, loading: false });
            })
            .catch((error) => {
                console.error('Error obteniendo usuarios', error);
            });
    };

    render() {
        const { rows, loading } = this.state;

        const columns = [
            { field: 'username', headerName: 'User name', width: 130 },
            { field: 'password', headerName: 'Password', width: 130 },
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
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Button size="small" onClick={this.ObtenerUsuarios}>
                        Remove a row
                    </Button>
                    <Button size="small" onClick={this.ObtenerUsuarios}>
                        Add a row
                    </Button>
                </Stack>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    loading={loading}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    
                />
            </div>
        );
    }
}

export default UserList;
