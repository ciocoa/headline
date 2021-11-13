<template lang="pug">
//- 已登录
.header.user-info(v-if="user")
  .base-info
    .left
      van-image.avatar(:src="userInfo.photo" round fit="cover")
      span.name {{ userInfo.name }}
    .right 
      van-button(size="mini" round to="/user/profile") 编辑资料
  .data-stats
    .data-item 
      span.count {{ userInfo.art_count }}
      span.text 头条
    .data-item 
      span.count {{ userInfo.follow_count }}
      span.text 关注
    .data-item 
      span.count {{ userInfo.fans_count }}
      span.text 粉丝
    .data-item 
      span.count {{ userInfo.like_count }}
      span.text 获赞
//- 未登录
.header.not-login(v-else)
  .login-btn(@click="$router.push('/login')")
    img.mobile-img(src="@/assets/images/mobile.png")
    span.text 登录 / 注册
//- 九宫格
van-grid.grid-nav.mb-9(:column-num="2" clickable)
  van-grid-item.grid-item(text="收藏" icon="star-o" icon-color="#eb5253")
  van-grid-item.grid-item(text="历史" icon="underway-o" icon-color="#ff9d1d")
van-cell-group
  van-cell(title="消息通知" is-link)
  van-cell.mb-9(title="小智同学" is-link)
//- 退出登录
van-cell-group
  van-cell.logout-cell(v-if="user" title="退出登录" clickable @click="onLogout")
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data() {
    return {
      userInfo: {},
    }
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    if (this.user) this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast(`获取数据失败，请稍后再试！${err}`)
      }
    },
    onLogout() {
      this.$dialog
        .confirm({
          title: '确认退出吗？',
        })
        .then(() => this.$store.commit('setUser', null))
        .catch(() => console.log(点击了取消))
    },
  },
}
</script>

<style scoped lang="less">
.header {
  height: 361px;
  background: url('@/assets/images/banner.png');
  background-size: cover;
}
.not-login {
  display: flex;
  justify-content: center;
  align-items: center;
  .login-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile-img {
      width: 132px;
      height: 132px;
      margin-bottom: 15px;
    }
    .text {
      font-size: 28px;
      color: #fff;
    }
  }
}
.user-info {
  .base-info {
    height: 231px;
    padding: 76px 32px 23px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .avatar {
        width: 132px;
        height: 132px;
        border: 4px solid #fff;
        margin-right: 23px;
      }
      .name {
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .data-stats {
    display: flex;
    .data-item {
      height: 130px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
}
.logout-cell {
  text-align: center;
  color: #d86262;
}
.mb-9 {
  margin-bottom: 9px;
}
</style>
