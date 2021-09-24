import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';
import Message from '@/components/Message.vue';

const routes = [
    {
        name: 'Home',
        path: '/wall',
        component: Home,
        meta: {
            title: 'Accueil'
        },
    },
    {
        name: 'Login',
        path: '/',
        component: Login,
        meta: {
            title: 'Connexion'
        },
    },
    {
        name: 'Profile',
        path: '/profile',
        component: Profile,
        props: true,
        meta: {
            title: 'Profil'
        },
    },
    {
        name: 'Message',
        path: '/message/:id',
        component: Message,
        props: true,
        meta: {
            title: 'Message'
        },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.afterEach((to) => {
    document.title = to.meta.title;
})
export default router;