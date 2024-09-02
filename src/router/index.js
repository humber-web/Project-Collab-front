import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignInView from "../views/SignInView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import TeamChatView from "../views/TeamChatView.vue";
import UserView from "../views/UserView.vue";
// import Project from "../components/Project.vue"; 
import Tasks from "../views/TasksView.vue";
import CalendarView from "../views/CalendarView.vue"
import PasswordRecoveryView from "../views/PasswordRecoveryView.vue";
import ResetPasswordView from "../views/ResetPasswordView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/signin",
    name: "signin",
    component: SignInView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: '/password-recovery',
    name: 'PasswordRecovery',
    component: PasswordRecoveryView
  },
  {
    path: "/reset-password/:uid/:token",
    name: "ResetPasswordView",
    component: ResetPasswordView,
    props: true
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView
  },
  {
    path: "/projects",
    name: "projects",
    component: ProjectsView,
  },

  {
    path: "/projects/:projectId/tasks",
    name: "Tasks",
    component: Tasks,
    props: true
  },

  {
    path: "/teamchat",
    name: "teamchat",
    component: TeamChatView
  },
  {
    path: "/user/:openForm",
    name: "user",
    component: UserView,
    props: route => ({ openForm: route.params.openForm })
  },
  {
    path: "/calendar",
    name: "calendar",
    component: CalendarView
  },


];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Assuming you have a method `isLoggedIn` that checks if the user is authenticated
import { isLoggedIn } from '../auth'; 

router.beforeEach((to, from, next) => {
  // List of routes that don't require authentication
  const publicPages = ['home', 'signin', 'register', 'PasswordRecovery', 'ResetPasswordView'];

  // Check if the route requires authentication
  const authRequired = !publicPages.includes(to.name);

  if (authRequired && !isLoggedIn()) {
    // If the route requires authentication and the user is not authenticated,
    // redirect to the sign-in page
    next({ name: 'signin' });
  } else {
    // Otherwise, allow the navigation
    next();
  }
});

export default router;