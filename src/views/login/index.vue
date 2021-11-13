<template lang="pug">
//- 表单验证：
  1、给 van-field 组件配置 rules 验证规则
    参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
  2、当表单提交的时候会自动触发表单验证
    如果验证通过，会触发 submit 事件
    如果验证失败，不会触发 submit
van-nav-bar.page-nav-bar(title="登录" left-text="返回" left-arrow @click-left="$router.back()")
van-form(@submit="onSubmit")
  van-cell-group(inset)
    van-field(type="tel" name="mobile" left-icon="phone-o" placeholder="请输入手机号" v-model="user.mobile" :rules="userFormRules.mobile" maxlength="11")
    van-field(type="number" name="code" left-icon="passed" placeholder="请输入验证码" v-model="user.code" :rules="userFormRules.code" maxlength="6" center)
      template(#button)
        van-count-down(v-if="isCountDownShow" :time="1000 * 30" format="ss s" @finish="isCountDownShow = false")
        van-button.send-sms-btn(v-else round size="small" type="default" native-type="button" @click="onSendSms") 获取验证码
  .login-btn-wrap
    van-button(block round type="primary" native-type="submit" color="#6db4fb") 登录
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  data() {
    return {
      currentRate: 0,
      gradientColor: {
        '0%': '#3fecff',
        '100%': '#6149f6',
      },
      user: {
        mobile: '13713981921',
        code: '246810',
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空',
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误',
          },
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空',
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误',
          },
        ],
      },
      isCountDownShow: false,
    }
  },
  methods: {
    async onSubmit() {
      // 表单验证
      this.$toast.loading({
        duration: 0, // 持续时间
        forbidClick: true, // 是否禁止点击
        message: '登录中...', // 提示消息
      })
      // 请求登录
      try {
        const { data } = await login(this.user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) this.$toast.fail('手机号或验证码错误')
        else this.$toast.fail('登录失败，请稍后重试')
        console.log(err)
      }
    },
    async onSendSms() {
      // 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败：', err)
      }
      // 验证通过
      this.isCountDownShow = true
      // 请求验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    },
  },
}
</script>

<style scoped lang="less">
.van-form {
  margin-top: 50px;
}
.send-sms-btn {
  width: 152px;
  height: 46px;
  line-height: 46px;
  background-color: #ededed;
  font-size: 22px;
  color: #666;
}
.login-btn-wrap {
  margin: 46px 26px;
}
</style>
