<template>
	<!-- 引入布局 -->
	<el-container class="home-container">
		<!-- 头部 -->
	      <el-header>
	            <div>
	              <img src="../assets/login.png" alt class="logo_img"  style="border-radius: 50%;"/>
	            </div>
				<span>文章管理平台 </span>
	            <el-button type="info" @click="logout">安全退出</el-button>
	      </el-header>
		  <!-- 主体 -->
	      <el-container>
			  <!-- 侧边栏 -->
	        <el-aside width="200px">
				 <el-menu
				      background-color="#545c64"
				      text-color="#fff"
				      active-text-color="#ffd04b"
					  >
					<el-menu-item @click="towelcome">
					         <i class="el-icon-s-home"></i>
					         <span slot="title">首页</span>
					</el-menu-item>
					<el-menu-item @click="touser">
					         <i class="el-icon-user-solid"></i>
					         <span slot="title">用户管理</span>
					</el-menu-item>
					<el-menu-item @click="toarticle">
					         <i class="el-icon-document"></i>
					         <span slot="title">文章管理</span>
					</el-menu-item>
					
				</el-menu>		
			</el-aside>
			<!-- 主体内容 -->
	        <el-main>
				<router-view></router-view>
			</el-main>
	</el-container>
	</el-container>
</template>
<script>

export default {
	
	 methods: {
		logout() {
		      window.sessionStorage.clear();//清楚session
		      this.$router.push("/login");//回到首页
		    },
		towelcome() {
		      this.$router.push("/welcome");//跳转欢迎页
		    },
		touser() {
		      this.$router.push("/user");//跳转到用户管理
		    },
		toarticle() {
		      this.$router.push("/article");//跳转到首页
		    },
		tocontent() {
		      this.$router.push("/content");//跳转到文章详情
		    },
		
		
		
	 }

}
</script>
<style lang="stylus" scoped>
	.el-header 
	  background-color: #373d41
	  display: flex
	  justify-content: space-between// 左右贴边
	  padding-left: 0%// 左边界
	  align-items: center// 水平
	  color: #fff
	  font-size: 2rem
	  > div  //左侧div加布局
	    display: flex
	    align-items: center
	    span 
	      margin-left: 0.9375rem
	.logo_img
	  width: 5.5rem
	  height: 5.5rem
	.home-container 
	  height: 100%
	.el-header 
	  background-color: #373d41
	.el-aside 
	  background-color: #333744
	  .el-menu
		  border-right: none
	.el-main 
	  background-color: #eaedf1
	
</style>