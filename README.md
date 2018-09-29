## 通过vue.use自定义一个横幅提示组件

在工作中有个需求是用户在完成一些操作，前端需要根据结果进行反馈。考虑到是全局提示，所有模块都会
用到的，如果像其他普通组件那样定义引入，通过v-show/v-model的方式展示，会让前端代码相对比较冗余，而且
维护起来不那么友好；于是我采用了vue.use方式封装了banner组件，可以让同事在自己的业务层代码中通过
函数进行调用。

该组件返回一个promise对象，每一次调用都会将当前的promise push到一个全局的数组处理，形成堆栈队列调用。最初想要提供类似onConfirm, onCancel的回调处理，
使该组件显得不那么鸡肋，但实际需求只需要提供撤销行为就行了，于是直接将callback以参数的形式传进组件，避免了复杂的处理。

---

`banner` 组件属性说明如下：

## props

属性 | 说明 | 类型 | 默认值
-----|-----|-----|------ |
text | 横幅文字提示 | String | - |
type | 横幅类型 `loading`,  `normal`, ``success`, `error`  | String |
extraOption | 是否提供额外选项 | Boolean | -
extraOptionText | 额外选项文字 | String | '撤销' |


## events

事件名 | 说明 |
-----|-----|
callback  | 点击撤销触发

## demo

### 参数为文字
this.$banner.success('a test string');

### 参数为对象
this.$banner({
    type: 'error',
    text: 'a test string'
});

### 参数带有回调函数
this.$banner({
    type: 'success',
    text: 'a test string',
    callback: () => {
        callbackFn()
    }
})







