vue3-piczoom

```A picture magnifier component for Vue.js 3.x 基于vue3.x的电商图片放大镜插件```

使用步骤
```安装 npm install```
```npm i vue3-piczoom --save```

```使用use```
```js
--script
直接在你需要使用的vue文件中引用
vue2中这样注册
import PicZoom from 'vue3-piczoom'
export default {
  name: 'App',
  components: {
    PicZoom
  }
}
vue3中这样即可使用
import PicZoom from 'vue3-piczoom'
--html
<pic-zoom :url="url" :scale="3"></pic-zoom>
```
### Config配置
```
  props | describe | default 
  ----|------|----
  url | 图片地址 | string required  
  big-url | 大图地址 | string null  
  scale | 图片放大倍数 | number 2.5  
  scroll | 放大时页面是否可滚动 | boolean fasle 
  show-edit | 是否显示旋转图片按钮 | boolean fasle  
```
### Suggest 注意事项
```js
// 组件默认是100%的高宽，所以建议将组件包含在一个有固定高宽的容器内。如：

<div class="pic-box"> <!--pic-box:width:500px;height:500px-->
     <pic-zoom url="static/imac2.jpg" :scale="3"></pic-zoom>
</div>
```
### GIF 动画截图
![zoom2.gif](http://upload-images.jianshu.io/upload_images/6651371-e26a702c2ef8651a.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Demo 示例
[在线示例](https://826327700.github.io/vue-piczoom/dist/ "图片放大镜")

### 致谢
```本包主要是根据vue-piczoom进行编写，所以功能是一样的，只是代码为vue3了，感谢vue-piczoom的作者~~```