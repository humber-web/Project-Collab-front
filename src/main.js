import { createApp } from "vue";
import './assets/tailwind.css';
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faSignOutAlt, faSearch, faExclamationTriangle, faBell, faHome, faProjectDiagram, faTasks, faCog, faTimes, faPaperPlane, faCheckCircle, faTimesCircle, faInfoCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import store from './store';
import Toast from '../src/components/Toast.vue';
import { createI18n } from 'vue-i18n';


library.add(faUser, faSignOutAlt, faExclamationTriangle, faSearch, faBell, faHome, faProjectDiagram, faTasks, faCog, faTimes, faPaperPlane, faCheckCircle, faTimesCircle, faInfoCircle, faExclamationCircle);

const options = {
    position: "top-right",
    timeout: 5000,
};

const messages = {
    en: {
        message: {
            openMainMenu: 'Open main menu',
            dashboard: 'Dashboard',
            team: 'Team',
            projects: 'Projects',
            calendar: 'Calendar',
            viewNotifications: 'View notifications',
            yourProfile: 'Your Profile',
            settings: 'Settings',
            signOut: 'Sign out',
            workingOn: 'Working On',
            pendingTasks: 'Pending Tasks',
            edit: 'Edit',
            delete: 'Delete',
            createProject: 'Create Project',
            createNewTask: 'Create New Task',
            notStarted: 'Not Started',
            dueDate: 'Due Date',
            assignee: 'Assignee To',
            name: 'Name',
            description: 'Description',
            status: 'Status',
            notStarted: 'Not Started',
            inProgress: 'In Progress',
            completed: 'Completed',
            assignee: 'Assignee',
            completionDate: 'Completion Date',
            createTask: 'Create Task',
            updateTask: 'Update Task',
            description: 'Description',
            status: 'Status',
            submit: 'Submit',
            chats: 'Chats',
            searchPlaceholder: 'Search for a project',
            noChatsFound: 'No Chats found.',
            back: 'Back',
            next: 'Next',
            members: 'Members:',
            typeMessagePlaceholder: 'Type a message...',
            reply: 'Reply',
            copy: 'Copy',
            delete: 'Delete',
            yes: 'Yes',
            no: 'No',
            delete_project_confirmation: 'Are you sure you want to delete this project?',
            delete_task_confirmation: 'Are you sure you want to delete this task?',
            delete_event_confirmation: 'Are you sure you want to delete this event?',
            delete_account_confirmation: 'Are you sure you want to delete this account?',
            loginSuccess: 'You have successfully logged in!',
            loginError: 'Failed to log in.',
            registerSuccess: 'You have successfully registered!',
            registerError: 'Failed to register.',
            createProjectSuccess: 'Project has been created successfully!',
            createProjectError: 'Failed to create project.',
            updateProjectSuccess: 'Project has been updated successfully!',
            updateProjectError: 'Failed to update project.',
            deleteProjectSuccess: 'Project has been deleted successfully!',
            deleteProjectError: 'Failed to delete project.',
            createTaskSuccess: 'Task has been created successfully!',
            createTaskError: 'Failed to create task.',
            updateTaskSuccess: 'Task has been updated successfully!',
            updateTaskError: 'Failed to update task.',
            deleteTaskSuccess: 'Task has been deleted successfully!',
            deleteTaskError: 'Failed to delete task.',
            createEventSuccess: 'Event has been created successfully!',
            createEventError: 'Failed to create event.',
            updateEventSuccess: 'Event has been updated successfully!',
            updateEventError: 'Failed to update event.',
            deleteEventSuccess: 'Event has been deleted successfully!',
            deleteEventError: 'Failed to delete event.',
            deleteAccountSuccess: 'Account has been deleted successfully!',
            deleteAccountError: 'Failed to delete account.',

        },
        calendar: {
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            event: 'Event',
            allDay: 'All Day',
            noEvents: 'No events',
            newEvent: 'New Event',

        }
    },
    pt: {
        message: {
            openMainMenu: 'Abrir menu principal',
            dashboard: 'Painel de controle',
            team: 'Equipe',
            projects: 'Projetos',
            calendar: 'Calendário',
            viewNotifications: 'Ver notificações',
            yourProfile: 'Seu Perfil',
            settings: 'Configurações',
            signOut: 'Sair',
            workingOn: 'Trabajando Em',
            pendingTasks: 'Tarefas Pendentes',
            edit: 'Editar',
            delete: 'Excluir',
            createProject: 'Criar Projeto',
            createNewTask: 'Criar Nova Tarefa',
            notStarted: 'Não Iniciado',
            inProgress: 'In Progress',
            completed: 'Completed',
            dueDate: 'Data de Vencimento',
            assignee: 'Atribuído A',
            name: 'Nome',
            description: 'Descrição',
            status: 'Status',
            notStarted: 'Não Iniciado',
            inProgress: 'Em Progresso',
            completed: 'Concluído',
            assignee: 'Responsável',
            completionDate: 'Data de Conclusão',
            createTask: 'Criar Tarefa',
            updateTask: 'Atualizar Tarefa',
            description: 'Descrição',
            status: 'Status',
            submit: 'Enviar',
            chats: 'Conversas',
            searchPlaceholder: 'Buscar por um projeto',
            noChatsFound: 'Nenhuma conversa encontrada.',
            back: 'Voltar',
            next: 'Próximo',
            members: 'Membros:',
            typeMessagePlaceholder: 'Digite uma mensagem...',
            reply: 'Responder',
            copy: 'Copiar',
            delete: 'Excluir',
            yes: 'Sim',
            no: 'Não',
            delete_project_confirmation: 'Tem certeza de que deseja excluir este projeto?',
            delete_task_confirmation: 'Tem certeza de que deseja excluir esta tarefa?',
            delete_event_confirmation: 'Tem certeza de que deseja excluir este evento?',
            delete_account_confirmation: 'Tem certeza de que deseja excluir esta conta?'
        },
        calendar: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            event: 'Evento',
            allDay: 'Todo o Dia',
            noEvents: 'Sem eventos',
            newEvent: 'Novo Evento',
        }
    },
    es: {
        message: {
            openMainMenu: 'Abrir menú principal',
            dashboard: 'Tablero',
            team: 'Equipo',
            projects: 'Proyectos',
            calendar: 'Calendario',
            viewNotifications: 'Ver notificaciones',
            yourProfile: 'Tu Perfil',
            settings: 'Configuraciones',
            signOut: 'Cerrar sesión',
            workingOn: 'Trabajando En',
            pendingTasks: 'Tareas Pendientes',
            edit: 'Editar',
            delete: 'Eliminar',
            createProject: 'Crear Proyecto',
            createNewTask: 'Crear Nueva Tarea',
            notStarted: 'No Iniciado',
            inProgress: 'En Progreso',
            completed: 'Completado',
            dueDate: 'Fecha de Finalizacion',
            assignee: 'Asignado A',
            name: 'Nombre',
            description: 'Descripción',
            status: 'Estado',
            notStarted: 'No Iniciado',
            inProgress: 'En Progreso',
            completed: 'Completado',
            assignee: 'Encargado',
            completionDate: 'Fecha de Finalización',
            createTask: 'Crear Tarea',
            updateTask: 'Actualizar Tarea',
            description: 'Descripción',
            status: 'Estado',
            submit: 'Enviar',
            chats: 'Chats',
            searchPlaceholder: 'Buscar un proyecto',
            noChatsFound: 'No se encontraron chats.',
            back: 'Volver',
            next: 'Siguiente',
            members: 'Miembros:',
            typeMessagePlaceholder: 'Escribe un mensaje...',
            reply: 'Responder',
            copy: 'Copiar',
            delete: 'Eliminar',
            yes: 'Sí',
            no: 'No',
            delete_project_confirmation: '¿Estás seguro de que quieres eliminar este proyecto?',
            delete_task_confirmation: '¿Estás seguro de que quieres eliminar esta tarea?',
            delete_event_confirmation: '¿Estás seguro de que quieres eliminar este evento?',
            delete_account_confirmation: '¿Estás seguro de que quieres eliminar esta cuenta?'


        },
        calendar: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            event: 'Evento',
            allDay: 'Todo el Día',
            noEvents: 'Sin eventos',
            newEvent: 'Nuevo Evento',
        }
    }
    // Add more languages here
}

const i18n = createI18n({
    locale: 'en', // Set locale
    fallbackLocale: 'en', // Set fallback locale
    messages, // Set locale messages
})

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('Toast', Toast);


app.use(router);
app.use(store);
app.use(i18n);
app.mount("#app");