<template lang="pug">
router-view
//- route: 开启路由模式，路由模式下会匹配路径和标签的to属性，并自动选中标签
van-tabbar(route)
  van-tabbar-item(icon="home-o" to="/") 首页
  van-tabbar-item(icon="chat-o" to="/qa" badge="5") 问答
  van-tabbar-item(icon="video-o" to="/video" dot) 视频
  van-tabbar-item(icon="user-o" to="/my") {{ $store.state.user ? '我的' : '未登录' }}
</template>

<script>
export default {
  name: 'LayoutIndex',
}
</script>

<style scoped lang="less"></style>
