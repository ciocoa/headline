<template lang="pug">
.home-container
  van-nav-bar.page-nav-bar(fixed)
    template(#left)
      .nav-bar-image
    template(#right)
      van-button.search-btn(slot="title" type="primary" size="small" round icon="search") 搜索
  van-tabs.channel-tabs(v-model:active="active" animated swipeable)
    van-tab(v-for="channel in channels" :key="channel.id" :title="channel.name")
      article-list(ref="article-list" :channel="channel")
    template(#nav-left)
      van-button.hamburger-btn(@click="isChennelEditShow = true" icon="apps-o")
  van-popup(v-model:show="isChennelEditShow" closeable round close-icon-position="top-left" position="bottom" :style="{ height: '8s0%' }") 
    channel-edit(:my-channels="channels" :active="active" @update-active="onUpdateActive")
</template>

<script>
import { mapState } from 'vuex'
import { getUserChannels } from '@/api/user'
import { getItem } from '@/utils/storage'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit,
  },
  data() {
    return {
      active: 0,
      channels: [],
      isChennelEditShow: false, // 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    this.loadChannels()
  },
  methods: {
    async loadChannels() {
      try {
        let channels = []
        const localChannels = getItem('TOUTIAO_CHANNELS')
        if (this.user || !localChannels) {
          // 已登录/未登录本地无存储，请求数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录本地有存储
          channels = localChannels
        }
        this.channels = channels
      } catch (err) {
        this.$toast(`获取频道数据失败！${err}`)
      }
    },
    onUpdateActive(index, isChennelEditShow = true) {
      // 更新激活的频道项
      this.active = index
      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow
    },
  },
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .nav-bar-image {
    width: 200px;
    height: 64px;
    background: url(@/assets/images/logo.png);
    background-size: contain;
  }
  .search-btn {
    width: 400px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  :deep(.channel-tabs) {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      width: 100%;
    }
    .van-tab {
      min-width: 160px;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background: #3296fa;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      border: none;
      opacity: 0.902;
      z-index: 1;
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(@/assets/images/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
