<template>
  <div class="login" v-if="show">
    <i class="el-icon-error" @click="show = false"></i>
    <div>
      <span class="login-button pointer" :class="{actived: choosed === 0}" @click="choose(0)">登录</span>
      <span class="register-button pointer" :class="{actived: choosed === 1}" @click="choose(1)">注册</span>
    </div>
    <el-form v-show="choosed === 0" :model="signInForm" ref="signInForm" status-icon :rules="signInRule"
      label-position="left">
      <el-form-item label="账号" prop="username">
        <el-input v-model.number="signInForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="signInForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('signInForm')">提交</el-button>
        <el-button @click="resetForm('signInForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form v-show="choosed !== 0 " :model="signUpForm" ref="signUpForm" status-icon :rules="signUpRule"
      label-position="left">
      <el-form-item label="账号" prop="username">
        <el-input v-model.number="signUpForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="signUpForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="signUpForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('signUpForm')">提交</el-button>
        <el-button @click="resetForm('signUpForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import cookie from 'js-cookie';
  import {
    post
  } from '../../service/axios'
  export default {
    data() {
      var checkAccount = (rule, value, callback) => {
        if (!value) {
          callback(new Error('账号不能为空'));
        } else {
          const pattern = /^[_A-Za-z0-9]{8,16}$/;
          if (!pattern.test(value)) {
            callback(new Error('账号必须为下划线字母数字的8到16位组合'));
          } else {
            callback();
          }
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          const pattern = /^[_A-Za-z0-9]{8,16}$/;
          if (!pattern.test(value)) {
            callback(new Error('密码必须为下划线字母数字的8到16位组合'))
          } else if (this.signUpForm.password2 !== '') {
            const signUpForm = this.$refs.signUpForm;
            signUpForm && signUpForm.validateField('password2');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        console.log('validatePass2')
        if (value === '') {
          callback(new Error('不能为空'));
        } else if (value !== this.signUpForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        show: true,
        signUpForm: {
          password: '',
          checkPass: '',
          username: ''
        },
        signInForm: {
          password: '',
          username: ''
        },
        signUpRule: {
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
          username: [{
            validator: checkAccount,
            trigger: 'blur'
          }]
        },
        signInRule: {
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          username: [{
            validator: checkAccount,
            trigger: 'blur'
          }]
        },
        choosed: 0
      }
    },
    created() {
      this.show = !!!cookie.get('username');
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'signUpForm') {
              this.signUp()
            } else {
              this.signIn()
            }
          } else {
            this.$message.error('请正确填写信息');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      signUp() {
        post('/article/register', {
          password: this.signUpForm.password,
          username: this.signUpForm.username
        }).then(ret => {
          this.$message.success(ret.msg);
          window.location.reload()
          // this.show = false;
        }).catch(err => {
          this.resetForm('signUpForm');
          this.$message.error(err.message);
        })
      },
      signIn() {
        post('/article/login', this.signInForm).then(_ => {
          // this.show = false;
          this.$message.success('登录成功');
          window.location.reload()

        }).catch(err => {
          this.$message.error(err.message || err)
        })
      },
      choose(index) {
        const arr = ['signUpForm', 'signInForm'];
        const form = this.$refs[arr[index]];
        form && form.resetFields();
        this.choosed = index;
      }
    }
  }

</script>
<style lang="less" scoped>
  .login {
    position: fixed;
    z-index: 9990;
    top: 50%;
    left: 50%;
    width: 300px;
    padding: 10px 50px;
    transform: translate3d(-50%, -50%, 0);
    background: white;
    border: 3px solid #dfdfdf;
    border-radius: 5px;

    /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }

    .el-icon-error {
      position: absolute;
      right: -20px;
      top: -20px;
      height: 30px;
      width: 30px;
      border-radius: 50px;
      background: white;

      &::before {
        position: absolute;
        left: -7px;
        font-size: 40px;
        top: -3px;
      }
    }

    .login-button {
      margin-right: 20px;
      font-size: 20px;
    }

    .register-button {
      font-size: 20px;
    }

    .actived {
      color: orange;
    }
  }

</style>
