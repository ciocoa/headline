<template lang="pug">
van-picker(show-toolbar title="选择性别" :columns="columns" :default-index="value" @close="$emit('close')" @confirm="onConfirm" @change="onPickerChange")
</template>
<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.value,
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0,
      })
      try {
        const localGender = this.localGender
        await updateUserProfile({
          gender: localGender,
        })
        this.$emit('input', localGender)
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    },
    onPickerChange(picker, value, index) {
      this.localGender = index
    },
  },
}
</script>
