<template lang="pug">
//- List 列表组件：瀑布流滚动加载，用于展示长列表。
    List 组件通过 loading 和 finished 两个变量控制加载状态，
    当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
    数据更新完毕后，将 loading 设置成 false 即可。
    若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
    - load 事件：
      + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
      + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
    - loading 属性：控制加载中的 loading 状态
      + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
      + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件
    - finished 属性：控制加载结束的状态
      + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
      + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
.article-list
  van-pull-refresh(v-model="isreFreshLoading" :success-text="refreshSuccessText" :success-duration="1500" @refresh="onRefresh")
    van-list(v-model:loading="loading" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad")
      article-item(v-for="(article, index) in list" :key="index" :article="article")
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      timestamp: null,
      isreFreshLoading: false,
      refreshSuccessText: '刷新成功',
    }
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(), // 请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章
        })
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.loading = false
        this.error = true
      }
    },
    async onRefresh() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1,
        })
        // 模拟随机失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }
        const { results } = data.data
        this.list.unshift(...results)
        this.isreFreshLoading = false
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    },
  },
}
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;

  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  height: 79vh;
  overflow-y: auto;
}
</style>
