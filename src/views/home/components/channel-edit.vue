<template lang="pug">
.channel-edit
  van-cell(:border="false")
    template(#title)
      .title-text 我的频道
    template(#value)
      van-button.edit-btn(size="mini" type="danger" round plain @click="isEdit = !isEdit") {{ isEdit ? '完成' : '编辑' }}
  van-grid.my-grid(:gutter="10")
    van-grid-item.grid-item(v-for="(channel, index) in myChannels" :key="index" @click="onMyChannelClick(channel, index)")
      van-icon(v-show="isEdit && !fiexdChannels.includes(channel.id)" name="clear")
      span.text(:class="{ active: index === active }") {{ channel.name }}
  van-cell(:border="false")
    template(#title)
      .title-text 全部频道
  van-grid.recommend-grid(:gutter="10")
    van-grid-item.grid-item(v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name" @click="onAddChannel(channel)" icon='plus' icon-color='red')
</template>

<script>
import { getAllChannels, addUserChannel, delUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels: [],
      isEdit: false,
      fiexdChannels: [0],
    }
  },
  created() {
    this.loadAllChannels()
  },
  computed: {
    ...mapState(['user']),
    /**
     * 遍历所有频道，判断：该频道是否属于我的频道
     * 不属于则收集起来
     * 遍历结束剩下的就是其余的推荐频道
     */
    recommendChannels() {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter((channel) => {
        // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
      })
    },
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length,
          })
        } catch (err) {
          this.$toast(`保存失败，请稍后重试 -- ${err}`)
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 若是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) return
        // 删除频道项
        this.myChannels.splice(index, 1)
        /**
         * 如果删除的激活频道之前的频道，则更新激活的频道项
         * 参数1：要删除的元素的开始索引（包括）
         * 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
         */
        if (index <= this.active)
          // 让激活频道的索引 - 1
          this.$emit('update-active', this.active - 1, true)
        this.deleteChannel(channel)
      } else {
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel(channel) {
      try {
        // 已登录，则将数据更新到线上
        if (this.user) await delUserChannel(channel.id)
        // 未登录，则将数据更新到本地
        else setItem('TOUTIAO_CHANNELS', this.myChannels)
      } catch (err) {
        this.$toast(`操作失败，请稍后重试 -- ${err}`)
      }
    },
  },
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
    margin: 10px 0;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  :deep(.my-grid) {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  :deep(.grid-item) {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  :deep(.recommend-grid) {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
