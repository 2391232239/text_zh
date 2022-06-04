<template>
	<div>
		<img src="../assets/images/content.png">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>文章详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="article" :model="editForm" >
			<h1 class="title" >{{editForm.title}}</h1>
			<div class="author_time">
				<span class="author">{{editForm.author}}</span>
				<span class="time" >{{editForm.created | formatDate}}</span>
			</div>
			<br><br>
			<hr>
			<div class="content">
				<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					{{editForm.content}}
				</p>
			</div>
		</div>
	</div>		
</template>

<script>
import {formatDate} from '../../Date/Date.js'	
import { GetUrlParam } from "../../Date/getUrlParams.js";
export default{
	data(){
		return{
			editForm:{
				
			},
		}
	},
	filters:{
		/*日期处理*/
	  formatDate(time){
		  var data = new Date(time);
		  return formatDate(data,'yyyy-MM-dd');
	  },
	},
	methods:{
		async showEditDialog(){
			this.id = GetUrlParam("id");
			const {data:res} = await this.$http.get("updateArticle?id="+this.id);
			this.editForm = res;//查询出用户信息返回到编辑表单
		},
		
	},
	mounted: function(){
		this.showEditDialog();//需要触发的函数
	}
}

</script>


<style lang="stylus" scoped>
	img
		width 100%
		height 25rem
	.article
		width 115rem
		margin 1rem auto
		.title
			font-size 2.8rem
			width 100%
			text-align center
		
		.author_time
			width 100%
			color #C0C4CC
			font-size 2.4rem
			.author
				float left
			.time
				float right
		.content
			p
				font-size 2rem
	
</style>
