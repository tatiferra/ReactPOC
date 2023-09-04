import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import Login from "./components/LoginUser";
import Home1 from "./components/Home1";
import EventForm from "./components/EventForm";
import UserList from "./components/UserList";
import EventosList from "./components/EventosList";
import { EventosCalendar } from "./components/EventosCalendar";
import ExpositoresList from "./components/ExpositoresList";
import IngresosList from "./components/IngresosList";
import EventosCard from "./components/EventosCard";
import Breadcrumb from "./components/Breadcrumb";
import ExpositorRegistro from "./components/ExpositoresRegistro";


const AppRoutes = [
      {
        index: true,
        element: <Home />,
        requiresAuth: false, // No requiere autenticación
        requiresRole: 'Administrador',
      },
      {
        path: '/expositoresregistro',
        element: <ExpositorRegistro />,
        requiresAuth: false, // No requiere autenticación
        requiresRole: '',
      },
      {
        path: '/counter',
        element: <Counter />,
          requiresAuth: false, // No requiere autenticación
          requiresRole: 'Administrador',
      },
      {
        path: '/fetch-data',
        element: <FetchData />,
          requiresAuth: false, // No requiere autenticación
          requiresRole: 'Administrador',
      },
    {
        path: '/loginuser',
        element: <Login />,
        requiresAuth: false, // No requiere autenticación
        requiresRole: '',
    },
    {
        path: '/home1',
        element: <Home1 />,
        requiresAuth: false, // No requiere autenticación
        requiresRole: '',
    },
    {
        path: '/eventform',
        element: <EventForm />,
        requiresAuth: false, // No requiere autenticación
        requiresRole: 'Administrador',
    },
    {
        path: '/breadcrumb',
        element: <Breadcrumb />,
        requiresAuth: false, // No requiere autenticación
        requiresRole: '',
    },
    {
        path: '/userlist',
        element: <UserList />,
        requiresAuth: false, // No requiere autenticación
        requiresRole: 'Administrador',
    }
    , {
        path: '/eventoscalendar',
        element: <EventosCalendar />,
        requiresAuth: false, // No requiere autenticación
        requiresRole: 'Administrador',
    },
    {
        path: '/eventoslist',
        element: <EventosList />,
        requiresAuth: true, // Requiere autenticación
        requiresRole: 'Administrador',
    },
    {
        path: '/eventoscard',
        element: <EventosCard />,
        requiresAuth: true, // Requiere autenticación
        requiresRole: 'Administrador',
    },
    {
        path: '/expositoreslist',
        element: <ExpositoresList />,
        requiresAuth: true, // No requiere autenticación
        requiresRole: 'Administrador',
    },
    {
        path: '/ingresoslist',
        element: <IngresosList />,
        requiresAuth: true, // Requiere autenticación
        requiresRole: 'Administrador',
    },
    
];

export default AppRoutes;
