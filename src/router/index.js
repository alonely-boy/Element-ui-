import Vue from 'vue'
import VueRouter from 'vue-router'
// import { from } from 'core-js/fn/array'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path:'/login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path:'/home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component: () => import(/* webpackChunkName: "about" */ '@/components/Welcome.vue'),
      },
      {
        path:'/users',
        component: () => import('@/components/user/Users')
      },
      {
        path:'/rights',
        component: () => import('@/components/power/Rights.vue')
      },
      {
        path:'/roles',
        component: () => import('@/components/power/Roles.vue')
      },
      {
        path:'/categories',
        component: () => import('@/components/goods/Cate.vue')
      },
      {
        path:'/params',
        component: () => import('@/components/goods/Params.vue')
      }
    ]
  },
  // {
  //   path:'',
  //   component: () => import('@/components/power/Roles.vue')
  // }
  
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  //访问登录页，放行
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token，跳转登录页
  if(!tokenStr) return next('/login')
  //last
  next()
})

export default router
