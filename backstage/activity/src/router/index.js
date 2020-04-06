import Vue from 'vue'
import Router from 'vue-router'
import settings from "@root/publicMethods/settings";
import Activity from '@/views/activity'

Vue.use(Router)

const createRouter = () => new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [{
    path: settings.admin_base_path + '/activity',
    name: 'activity',
    component: Activity
  }, {
    path: settings.admin_base_path + '/activity/addActivity',
    name: 'addActivity',
    component: () => import( /* webpackChunkName: "addActivity" */ '@/views/activity/activityForm.vue')
  }, {
    path: settings.admin_base_path + '/activity/editActivity/:id',
    name: 'editActivity',
    component: () => import( /* webpackChunkName: "editActivity" */ '@/views/activity/activityForm.vue')
  }]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router