<template>
	<div>
		
		<!-- 轮播 -->
		
		<div>
		    <div class="w">
		      <el-carousel height="290px" width="100%">
		        <el-carousel-item v-for="(item, index) in list_img" :key="index">
		          <h3 class="small">
		            <img style="width: 100%; height: 250px;" :src="item.url" alt />
		          </h3>
		        </el-carousel-item>
		      </el-carousel>
		    </div>
		</div>
		<div class="list">
			<ul v-for="(item, index) in articlelist" :key="index" >
			  <li>
			    <div class="img" ><img :src="require('../assets/images/article'+index+'.jpeg')" /> </div>
			    <div class="web">
			      <div class="title">
			        <h4  >{{item.title}}</h4>
			      </div>
			      <div class="content">
			        <p style="text-align: left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.content|stateFormat}}</p>
			      </div>
				  <div class="xq">
				    <p style="text-align: right;"><a href="#"  @click="tocontent(item.id)">详情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a><em>{{item.created|formatDate}}</em></p>
				  </div>
			    </div>
			    <div class="clear"></div>
			  </li>
			  <hr>
			</ul>
			<el-pagination
			        @size-change="handleSizeChange"
			        @current-change="handleCurrentChange"
			        :current-page="queryInfo.pageNum"
			        :page-sizes="[1, 2, 5, 8]"
			        :page-size="queryInfo.pageSize"
			        layout="total, sizes, prev, pager, next, jumper"
			        :total="total"
			></el-pagination>
		</div>
		
		
		

</div>		
</template>

<script>
// 引入组件
import {formatDate} from '../../Date/Date.js'
  export default {
    created() {
    	this.getUserList();
    },
	filters:{
		/*日期处理*/
	  formatDate(time){
		  var data = new Date(time);
		  return formatDate(data,'yyyy-MM-dd');
	  },  
	  stateFormat(cellValue) {
		  if (!cellValue) return ''
		  if (cellValue.length > 250) {       //最长固定显示250个字符
			return cellValue.slice(0, 250) + '...'
		  }
		  return cellValue
		},
	},
    data() {
      return {
			list_img: [
			  { url: require('@/assets/images/banner1.png') },
			  { url: require('@/assets/images/banner2.png') },
			],
			queryInfo:{
				query: "",//查询信息
				pageNum: 1,//当前页
				pageSize: 5,//每页最大数
			},
			articlelist:[],//文章列表
			total:0,//总记录数
			
		}
	},	
	methods:{
		
		//获取所有文章
		async getUserList() {
		  // 调用get请求
		  const { data: res } = await this.$http.get("allArticle", {
			params: this.queryInfo
		  });
		  this.articlelist = res.data; // 将返回数据赋值
		  this.total = res.numbers; // 总个数
		},
		// 监听pageSize改变的事件
		handleSizeChange(newSize) {
		    this.queryInfo.pageSize = newSize;
		    this.getUserList(); // 数据发生改变重新申请数据
		},
		// 监听pageNum改变的事件
		handleCurrentChange(newPage) {
		    this.queryInfo.pageNum = newPage;
		    this.getUserList(); // 数据发生改变重新申请数据
		},
		tocontent(id){
			this.$router.push({path:`/content?id=${id}`})
		}
		
	}
  }
 
 
</script>


<style lang="stylus" scoped>
	.w
		margin: 0 auto
		width: 100%
	ul>li
		list-style-type:none
		height 200px
	a
		text-decoration:none
	.list
		font-size: 16px
		width 1500px
		height 200px
		margin 10px auto
		.img
			float: left
			width 200px
			height 100%
			img
				width 200px
		.web
			width 1230px
			height 200px
			float right
			.title
				height 20px
				width 100%
				margin-top -20px
				line-height 20px
				h4
					font-size 24px
					color #409EFF
			.content
				p
					color #000000
				
	
	
</style>
