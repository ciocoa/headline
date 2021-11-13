// 存储数据
export const setItem = (k, v) => {
  if (typeof v === 'object') v = JSON.stringify(v)
  localStorage.setItem(k, v)
}
// 获取数据
export const getItem = k => {
  const data = localStorage.getItem(k)
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}
// 删除数据
export const removeItem = k => localStorage.removeItem(k)
