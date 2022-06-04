<template>
  <div>
<!-- 面包屑导航 -->
	<el-breadcrumb separator-class="el-icon-arrow-right">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
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
		  <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
		</el-col>
	  </el-row>
	  
	  <!-- 用户列表  border 边框 stripe 隔行变色 -->
	  <el-table :data="userlist" border stripe>
	       <el-table-column label="ID" prop="id" align="center"></el-table-column>
	       <el-table-column label="姓名" prop="username" align="center"></el-table-column>
	       <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
	       <el-table-column label="密码" prop="password" align="center"></el-table-column>
	       <el-table-column label="角色" prop="role" align="center"></el-table-column>
	       <el-table-column label="登录权限" prop="state" align="center">
	       <!--作用域插槽 scope.row 存储了当前行的信息 -->
	           <template slot-scope="scope"><!--数据模板-->
	                  <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
	           </template>
	       </el-table-column>
	       <!--自定义插槽-->
	       <el-table-column label="操作" align="center">
	            <template slot-scope="scope">
	              <!-- 修改 -->
	              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
	              <!-- 删除 -->
	              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
	             
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
	<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
		<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="addForm.username"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" >
				<el-input v-model="addForm.password" show-password></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="addForm.email"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="addDialogVisible = false">取消</el-button>
			<el-button type="primary" @click="addUser">确定</el-button>
		</span>
	</el-dialog>
	
	<!-- 修改对话框 -->
	
	<el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
		<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="editForm.username" disabled></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" >
				<el-input v-model="editForm.password" show-password></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="editForm.email"></el-input>
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
				userlist:[],//用户列表
				total:0,//总记录数
				addDialogVisible:false,//对话框状态
				//添加表单信息
				addForm:{
					username: "",
					password: "",
					email: "",
				},
				//修改用户信息
				editForm:{},
				//显示和隐藏修改对话框
				editDialogVisible:false,
				//添加表单验证
				addFormRules:{
					username: [
					  { required: true, message: "请输入用户名", trigger: "blur" },//必填验证
					  { min: 5, max: 15, message: "长度在 5 到 8 个字符", trigger: "blur" }//验证长度
					],
					password: [
					  { required: true, message: "请输入密码", trigger: "blur" },
					  { min: 6, max: 10, message: "密码为 6~8 位", trigger: "blur" }
					],
					email: [
					  { required: true, message: "请输入邮箱", trigger: "blur" },
					  { min: 5, max: 25, message: "请输入正确的邮箱地址", trigger: "blur" }
					]
				},
				//修改表单验证
				editFormRules:{
					password: [
					  { required: true, message: "请输入密码", trigger: "blur" },
					  { min: 6, max: 10, message: "密码为 6~8 位", trigger: "blur" }
					],
					email: [
					  { required: true, message: "请输入邮箱", trigger: "blur" },
					  { min: 5, max: 25, message: "请输入正确的邮箱地址", trigger: "blur" }
					]
				},
				
			}
		},
		
		methods:{
			//获取所有用户
			async getUserList() {
			  // 调用get请求
			  const { data: res } = await this.$http.get("allUser", {
				params: this.queryInfo
			  });
			  this.userlist = res.data; // 将返回数据赋值
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
			async userStateChanged(userInfo){
			  const {data:res} = await this.$http.post(`userState?id=${userInfo.id}&state=${userInfo.state}`);
			  if(res!="success"){
				  userInfo.id = !userInfo.id;
				  return this.$message.error("操作失败！！");
			  }else{
				  this.$message.success("操作成功！！");
			  }
			},
			getNewUserList(){
				this.queryInfo.pagenumber=1;
				this.getUserList();
			},
			//监听添加用户
			addDialogClosed(){
				this.$refs.addFormRef.resetFields();
			},
			addUser(){
				this.$refs.addFormRef.validate(async valid=>{
					if(!valid) return;
					const {data:res} = await this.$http.post("addUser",this.addForm);
					if(res!="success"){
						return this.$message.error("操作失败！！！");
					}
					this.$message.success("操作成功！！！");
					this.addDialogVisible = false;
					this.getUserList();
				});
			},
			//根据id删除用户
			async deleteUser(id){
				const confirmResult = await this.$confirm('此操作将永久删除用户，是否继续？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning',
				}).catch(err => err)
				
				if(confirmResult!='confirm'){//取消
					return this.$message.info("已取消删除");
				}
				const {data:res} = await this.$http.delete("deleteUser?id="+id);
				if(res != "success"){
					return this.$message.error("删除失败！");
				}
				this.$message.success("删除成功！");
				this.getUserList();
			},
			//显示对话框
			async showEditDialog(id){
				const {data:res} = await this.$http.get("getupdate?id="+id);
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
					const {data:res} = await this.$http.post("edituser",this.editForm);
					if(res!="success") return this.$message.error("操作失败！");
					this.$message.success("操作成功！");
					//隐藏编辑框
					this.editDialogVisible = false;
					this.getUserList();
				})
			}
		},
	}
</script>
<style lang="stylus" scoped>

</style>