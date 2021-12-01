import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '../views/NotFound.vue'
import store from '../store'
import SignIn from '../views/sessions/SignIn.vue'
import SignUp from '../views/sessions/SignUp.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../layout/index.vue'),
        redirect: '/dashboards/dashboard-version-one',
        meta: {
            title: 'Home',
        },

        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/dashboards/Dashboards.vue'),
                meta: {
                    title: 'Dashboard',
                },
            },
            {
                path: '/options',
                name: 'components',
                component: () => import('../views/components/Options.vue'),
                meta: {
                    title: 'Options',
                },
            },
        ],
    },

    { path: '/login', component: SignIn },
    { path: '/register', component: SignUp },

    { path: '/:path(.*)', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        return { left: 0, top: 0 }
    },
    routes,
})

router.afterEach(() => {
    if (window.innerWidth <= 1200) {
        const sidenav =
            store.state.largeSidebar.sidebarToggleProperties.isSideNavOpen

        store.commit('largeSidebar/toggleSidebarProperties')
    }
})

export default router
