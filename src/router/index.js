import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '/src/components/Login.vue'
import Home from '/src/components/Home.vue'
import Welcome from '/src/components/Welcome.vue'
import UserList from '/src/components/admin/UserList.vue'
import ArticleList from '/src/components/admin/ArticleList.vue'
import Content from '/src/components/Content.vue'
Vue.use(VueRouter)

const routes = [
  {
	  path: "/",
	  redirect: "/login"
  },
  {
	  path: "/login",
	  component: Login
  },
  {
	  path: '/home',
	  component: Home,
	  redirect:"/welcome",
	  children:[
		  {
			path: "/welcome",
			component: Welcome,
		  },
		  {
			path: "/user",
			component: UserList,
		  },
		  {
			path: "/article",
			component: ArticleList,
		  },
		  {
			path: "/content",
			component: Content,
		  },
		  
	  ]
  },
 
]

const router = new VueRouter({
  routes
})
// 出现问题的时候使用
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
	//to 将要访问
	//from 从哪访问
	//next 接着干 next（url） 重定向到url上 next（）继续访问 to路径
	if(to.path == '/login') return next();
	//获取user
	const userFlag = window.sessionStorage.getItem("user");
	if(!userFlag) return next('/login');//为空返回登录页
	next();//符合要求  放行
	
})
export default router//暴露出去
