import axios from 'axios'
import store from '@/store'
import router from '@/router'

const request = axios.create({ baseURL: 'http://toutiao-app.itheima.net' })

/**
 * 请求拦截器
 * 成功则添加请求头
 * 失败则 Promise.reject
 */
request.interceptors.request.use(
  config => {
    const { user } = store.state
    if (user && user.token)
      config.headers.Authorization = `Bearer ${user.token}`
    return config
  },
  err => Promise.reject(err)
)

/**
 * 响应拦截器
 * 成功进入第一个函数，返回响应对象
 * 失败进入第二个函数，参数为错误对象
 *  校验是否有 refresh_token
 *  响应码为 401 则请求获取新的 token
 */
request.interceptors.response.use(
  response => response,
  async err => {
    if (err.response && err.response.status === 401) {
      const { user } = store.state
      if (!user || !user.refresh_token) return router.push('/login')
      try {
        const res = await axios({
          method: 'PUT',
          url: 'http://toutiao-app.itheima.net/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`,
          },
        })
        console.log('刷新 token 成功', res)
        // 更新 token 到容器中
        store.commit('setUser', {
          token: res.data.data.token,
          refresh_token: user.refresh_token,
        })
        return request(err.config)
      } catch (error) {
        console.log('请求刷新 token 失败', error)
        router.push('/login')
      }
    }
    return Promise.reject(err)
  }
)

export default request
