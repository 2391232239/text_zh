<template>
  <div>
<!-- 面包屑导航 -->
	<el-breadcrumb separator-class="el-icon-arrow-right">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>文章管理</el-breadcrumb-item>
	  
	</el-breadcrumb>
	<!-- 用户主体 -->
	 <!-- 卡片视图区 -->
	<el-card>
	  <el-row :gutter="25"> 
		<el-col :span="10"> 
		  <!-- 搜索添加 -->
		  <!-- @clear="getUserList" 清除后结果还在上面挂着 -->
		  <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList"> 
			<el-button slot="append" icon="el-icon-search" @click="getNewUserList()"></el-button>
		  </el-input>
		</el-col>
		<el-col :span="4">
		  <el-button type="primary" @click="addDialogVisible = true">添加文章</el-button>
		  
		  <el-button class="btn-upload" type="primary" @click="handleUpdate">上传文件</el-button>
		  <a style="color:#0DCAF0; float: left;" class='btn_download' href='http://localhost:8081/data/张行期末项目接口说明.md' download="张行期末项目接口说明.md" title="项目接口文档下载">
		  	<el-button type="primary" round>项目接口文档下载</el-button>
		  </a>
		</el-col>
		<el-dialog
					title="提示"
					:visible.sync="dialogVisible"
					width="30%"
					>
					<span>
						<el-upload class="upload-demo"
							ref="upload"
							drag 
							action="http://localhost:8081/api/v1/upload" 
							multiple
							:auto-upload="false"
							:limit="5"
							:on-success="handleFilUploadSuccess"
							:on-remove="handleRemove"
							>
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
							<div class="el-upload__tip" slot="tip">只能上传 Excel 文件，且不超过500kb</div>
						</el-upload>
						
					</span>
					
					<span slot="footer" class="dialog-footer">
						
						<el-button @click="dialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="handleUpload">确 定</el-button>
					</span>
				</el-dialog>
	
	  </el-row>
	  
	  <!-- 用户列表  border 边框 stripe 隔行变色 -->
	  <el-table :data="articlelist" border stripe>
	       <el-table-column label="ID" prop="id" align="center"></el-table-column>
		   <el-table-column label="发布时间" prop="created" align="center" :formatter="dateFormat"></el-table-column>
	       <el-table-column label="标题" prop="title" align="center"></el-table-column>
	       <el-table-column label="作者" prop="author" align="center"></el-table-column>
	       <el-table-column label="文章内容" prop="content" align="center" :formatter="stateFormat"></el-table-column>
	       
	       <!--自定义插槽-->
	       <el-table-column label="操作" align="center">
	            <template slot-scope="scope">
	              <!-- 修改 -->
	              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
	              <!-- 删除 -->
	              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteArticle(scope.row.id)"></el-button>
	            </template>
	      </el-table-column>
	  </el-table>
	  <!-- 分页 size-change 每页最大数变化 current-change 页数变化 layout 功能组件-->
	  <el-pagination
	          @size-change="handleSizeChange"
	          @current-change="handleCurrentChange"
	          :current-page="queryInfo.pageNum"
	          :page-sizes="[1, 2, 5, 100]"
	          :page-size="queryInfo.pageSize"
	          layout="total, sizes, prev, pager, next, jumper"
	          :total="total"
	  ></el-pagination>
	</el-card>
	<!-- 新增对话框 -->
	<el-dialog title="添加文章" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
		<el-form :model="addForm"  ref="addFormRef" label-width="70px">
			<el-form-item label="标题" prop="title">
				<el-input v-model="addForm.title"></el-input>
			</el-form-item>
			<el-form-item label="作者" prop="author" >
				<el-input v-model="addForm.author"></el-input>
			</el-form-item>
			<el-form-item label="文章内容" prop="content">
				<el-input v-model="addForm.content" type="textarea"></el-input>
			</el-form-item>
			
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="addDialogVisible = false">取消</el-button>
			<el-button type="primary" @click="addArticle">确定</el-button>
		</span>
	</el-dialog>
	
	<!-- 修改对话框 -->
	
	<el-dialog title="修改文章" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
		<el-form :model="editForm" ref="editFormRef" label-width="70px">
			<el-form-item label="标题" prop="title">
				<el-input v-model="editForm.title"></el-input>
			</el-form-item>
			<el-form-item label="作者" prop="author" >
				<el-input v-model="editForm.author"></el-input>
			</el-form-item>
			<el-form-item label="文章内容" prop="content">
				<el-input v-model="editForm.content" type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="editDialogVisible = false">取消</el-button>
			<el-button type="primary" @click="editUserInfo">确定</el-button>
		</span>
	</el-dialog>
  </div>
</template>
<script>
	import moment from "moment"
	export default{
		created() {
			this.getUserList();
		},
		data(){
			return{
				//查询信息实体
				queryInfo:{
					query: "",//查询信息
					pageNum: 1,//当前页
					pageSize: 5,//每页最大数
				},
				articlelist:[],//文章列表
				total:0,//总记录数
				addDialogVisible:false,//对话框状态
				//添加文章信息
				addForm:{
					title: "",
					author: "",
					content: "",
				},
				//修改文章信息
				editForm:{
					
				},
				editDialogVisible:false,
				dialogVisible: false,
			}
		},
		
		methods:{
			/*日期处理*/
			  dateFormat:function(row,column){
			    var date = row[column.property];
			    if(date === undefined){
			      return ''
			    }
			    return moment(date).format("YYYY-MM-DD")
			  },  
			  //限制字数
			  stateFormat(row, column, cellValue) {
			  	  if (!cellValue) return ''
			  	  if (cellValue.length > 50) {       //最长固定显示10个字符
			  		return cellValue.slice(0, 50) + '...'
			  	  }
			  	  return cellValue
			  	},
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
			
			getNewUserList(){
				this.queryInfo.pagenumber=1;
				this.getUserList();
			},
			//监听添加文章
			addDialogClosed(){
				this.$refs.addFormRef.resetFields();
			},
			addArticle(){
				this.$refs.addFormRef.validate(async valid=>{
					if(!valid) return;
					const {data:res} = await this.$http.post("addArticle",this.addForm);
					if(res!="success"){
						return this.$message.error("操作失败！！！");
					}
					this.$message.success("操作成功！！！");
					this.addDialogVisible = false;
					this.getUserList();
				});
			},
		//根据id删除文章
			async deleteArticle(id){
				const confirmResult = await this.$confirm('此操作将永久删除文章，是否继续？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning',
				}).catch(err => err)
				
				if(confirmResult!='confirm'){//取消
					return this.$message.info("已取消删除");
				}
				const {data:res} = await this.$http.delete("deleteArticle?id="+id);
				if(res != "success"){
					return this.$message.error("删除失败！");
				}
				this.$message.success("删除成功！");
				this.getUserList();
			},
			
			//显示对话框
			async showEditDialog(id){
				const {data:res} = await this.$http.get("updateArticle?id="+id);
				this.editForm = res;//查询出用户信息返回到编辑表单
				this.editDialogVisible = true;//显示编辑框
			},
			//关闭窗口
			editDialogClosed(){
				this.$refs.editFormRef.resetFields();//重置信息
			},
			//确认修改
			editUserInfo(){
				this.$refs.editFormRef.validate(async valid =>{
					if(!valid) return;
					//发起修改请求
					const {data:res} = await this.$http.post("editArticle",this.editForm);
					if(res!="success") return this.$message.error("操作失败！");
					this.$message.success("操作成功！");
					//隐藏编辑框
					this.editDialogVisible = false;
					this.getUserList();
				})
			},
			
			
			handleRemove(file,fileList) {
					console.log(file,fileList);
				},
				submitUpload() {
					this.$refs.upload.submit();
				},
				// 文件上传成功时的函数
				handleFilUploadSuccess (res,file,fileList) {
					console.log(res,file,fileList)
					this.$message.success("上传成功")
				},
				handleUpdate () {
					this.dialogVisible = true;
				},
				// 处理文件上传的函数
				handleUpload () {
					// console.log(res,file)
					this.submitUpload()
					this.dialogVisible = false
				}
		
		},
	}
</script>
<style lang="stylus" scoped>
.btn-upload {
		top: 6.5rem;
		right: 4rem;
		position: fixed;
		z-index: 100;
		border-radius: 3rem;
		box-shadow: 0 0.2rem 1.2rem 0 rgba(91, 156, 255, 0.9)
	}
.btn_download{
	top: 6.5rem;
	right: 15rem;
	position: fixed;
	z-index: 100;
	border-radius: 3rem;
	box-shadow: 0 0.2rem 1.2rem 0 rgba(91, 156, 255, 0.9)
}
.el-upload {
	margin: 0.5rem
}
</style>