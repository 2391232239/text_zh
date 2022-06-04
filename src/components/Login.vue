<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <!--头像-->
        <img src="../assets/login.png" alt />
      </div>
      <!--添加表单-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login_form"
        label-width="0px"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icondenglu"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont iconmima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button  type="primary" @click="login">登录</el-button>
          <el-button  type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
	  
    </div>
  </div>
  
</template>

<script>
export default {
  data() {
    return {
		//表单数据对象
      loginForm: {
        username: "admin",
        password: "123456"
      },
	  //验证对象
      loginRules: {
		  //校验用户名密码
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },//必填验证
          { min: 5, max: 15, message: "长度在 5 到 8 个字符", trigger: "blur" }//验证长度
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "密码为 6~8 位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
	  //重置表单内容
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
	//登录处理
    login() {
		//1.验证校验规则
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;//验证失败
        // 调用post请求
        const {data :res} = await this.$http.post("login",this.loginForm);//访问后台 调用封装起来的用户名密码
         if (res.flag == "ok" ) {
			window.sessionStorage.setItem("user",res.user);//存储user对象
           this.$message.success("登陆成功！！！");//信息返回
           this.$router.push({ path: "/home"});// 页面跳转
		   
         }else{
          this.$message.error("登录失败！！！");//错误信息返回
         }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

// 跟节点样式
.login_container 
  background-image: url("../assets/login3.jpg");
  height: 100%
.login_box 
  width: 45rem
  height: 30rem
  background-color: rgba(204,204,204,0.5)
  border-radius: 0.3rem// 圆角
  position: absolute// 绝对定位
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)// 根据自己位置 以自己为长度位移

  .avatar_box
    width: 13rem
    height: 13rem
    border: 0.1rem solid #eee
    border-radius: 50%// 加圆角
    padding: 1rem
    box-shadow: 0 0 1rem #ddd// 盒子阴影
    position: absolute
    left: 50%
    transform: translate(-50%, -50%)
    background-color: #0ee
    img 
      width: 100%
      height: 100%
      border-radius: 50% // 加圆角
      background-color: #eee
  .btns
	  display: flex// 弹性布局
	  justify-content: center // 尾部对齐
  .login_form 
    position: absolute
    bottom: 0%
    width: 100%
    padding: 0 1rem
    box-sizing: border-box;// 设置边框

</style>