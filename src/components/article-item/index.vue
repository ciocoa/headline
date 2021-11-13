<template lang="pug">
van-cell.article-item(:to="{ name: 'article', params: { articleId:article.art_id } }")
  template(#title)
    .title.van-multi-ellipsis--l2 {{ article.title }}
  template(#label)
    .cover-wrap(v-if="article.cover.type === 3")
      .cover-item(v-for="(img, index) in article.cover.images" :key="index")
        van-image.cover-item-img(fit="cover" :src="img")
    .label-info-wrap
      span {{ article.aut_name }}
      span {{ article.comm_count }}
      span {{ $filters.filterTime(article.pubdate) }}
    van-image.right-cover(v-if="article.cover.type === 1" slot="default" fit="cover" :src="article.cover.images[0]")
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
