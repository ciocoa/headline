<template lang="pug">
van-nav-bar.page-nav-bar(title="个人信息" left-arrow @click-left="$router.back")
input(type="file" ref="file" hidden @change="onFileChange")
van-cell.photo-cell(title="头像" is-link center @click="$refs.file.click()")
  template(#value)
    van-image.avatar(fit="cover" round :src="user.photo")
van-cell(title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true")
van-cell(title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isUpdateGenderShow = true")
van-cell(title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true")
van-popup(v-model:show="isUpdateNameShow" position="bottom" style="height: 50%;")
  update-name(v-if="isUpdateNameShow" v-model="user.name" @close="isUpdateNameShow = false")
van-popup(v-model:show="isUpdateGenderShow" position="bottom" style="height: 50%;")
  update-gender(v-if="isUpdateGenderShow" v-model="user.gender" @close="isUpdateGenderShow = false")
van-popup(v-model:show="isUpdateBirthdayShow" style="height: 50%;" position="bottom")
  update-birthday(v-if="isUpdateBirthdayShow" v-model="user.birthday" @close="isUpdateBirthdayShow = false")
van-popup(v-model:show="isUpdatePhotoShow" style="height: 100%;" position="bottom")
  update-photo(v-if="isUpdatePhotoShow" :img="img" @close="isUpdatePhotoShow = false" @update-photo="user.photo = $event")
</template>

<script setup>
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
</script>

<script>
import { getUserProfile } from '@/api/user'
export default {
  name: 'UserProfile',
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null,
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (error) {
        this.$toast('获取数据失败')
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true
      this.$refs.file.value = ''
    },
  },
}
</script>

<style scoped lang="less">
.avatar {
  width: 60px;
  height: 60px;
}
.van-popup {
  background-color: #f5f7f9;
}
.photo-cell {
  .van-cell__value {
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>
