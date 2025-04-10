import {createRouter, createWebHistory} from 'vue-router'
import Home from "../views/home.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/stu-list',
                name: 'stu-list',
                component: () => import('./../components/stu-list.vue'),
            },
            {
                path: '/seat',
                name: 'seat',
                component: () => import('./../components/seat.vue'),
            },
            {
                path: '/group',
                name: 'group',
                component: () => import('./../components/group.vue'),
            }
        ]
    }
]

const router = createRouter(
    {
        history: createWebHistory(),
        routes,
    }
)
export default router