<script setup >
import { reactive, ref, onMounted, watch, nextTick } from 'vue'
const props = defineProps({
  scale: {
    type: Number,
    default: 2.5
  },
  url: {
    type: String,
    required: true
  },
  bigUrl: {
    type: String,
    default: null
  },
  scroll: {
    type: Boolean,
    default: false
  },
  showEidt: {
    type: Boolean,
    default: false
  }
})
const id = ref(null)
const state = reactive({
  cover: null,
  imgbox: null,
  imgwrap: null,
  orginUrl: null,
  bigImgUrl: null,
  bigOrginUrl: null,
  imgUrl: null,
  img: null,
  canvas: null,
  ctx: null,
  rectTimesX: 0,
  rectTimesY: 0,
  imgTimesX: 0,
  imgTimesY: 0,
  init: false,
  step: 0,
  bigStep: 0,
  vertical: false,
  showImg: true
})
onMounted(() => {
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var str = '';
  for (let i = 0; i < 10; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  id.value = str
  state.imgUrl = props.url
  state.orginUrl = props.url
  state.bigImgUrl = props.bigUrl
  state.bigOrginUrl = props.bigUrl
  nextTick(() => {
    initTime()
  })
})
watch(() => props.url,
  (val) => {
    state.imgUrl = val
    state.orginUrl = val
    initTime()
  })
watch(() => props.bigUrl,
  (val) => {
    state.bigImgUrl = props.bigUrl
    state.bigOrginUrl = props.bigUrl
    initTime()
  })

const initTime = () => {
  state.init = false
  let box = document.getElementsByClassName('magnifier-box')
  state.imgbox = box[0]
  state.cover = box[0].children[1]
  state.cover.style.width = (state.imgbox.offsetWidth / props.scale) + 'px'
  state.cover.style.height = (state.imgbox.offsetHeight / props.scale) + 'px'
  state.cover.style.left = '-100%'
  state.cover.style.top = '-100%'
  state.imgwrap = box[0].children[0]
  let imgsrc;
  if (state.bigImgUrl) {
    imgsrc = state.bigImgUrl
  } else {
    imgsrc = state.imgUrl
  }

  state.img = new Image()
  state.img.src = imgsrc
  state.img.onload = () => {
    state.rectTimesX = (state.imgbox.offsetWidth / props.scale) / state.imgwrap.offsetWidth
    state.rectTimesY = (state.imgbox.offsetHeight / props.scale) / state.imgwrap.offsetHeight
    state.imgTimesX = state.img.width / state.imgwrap.offsetWidth,
      state.imgTimesY = state.img.height / state.imgwrap.offsetHeight
    state.vertical = state.img.width < state.img.height
    state.init = true
  }
  if (state.canvas) {
    state.canvas.parentNode.removeChild(state.canvas);
    state.canvas = null
  }
  state.canvas = document.createElement('canvas')
  state.canvas.className = 'mouse-cover-canvas'
  state.canvas.style.position = 'absolute'
  state.canvas.style.left = state.imgbox.offsetLeft + state.imgbox.offsetWidth + 10 + 'px'
  state.canvas.style.top = state.imgbox.offsetTop + 'px'
  state.canvas.style.border = '1px solid #eee'
  state.canvas.style.zIndex = '99999'
  state.canvas.height = state.imgbox.offsetHeight
  state.canvas.width = state.imgbox.offsetWidth
  state.canvas.style.display = 'none'
  document.body.append(state.canvas)
  state.ctx = state.canvas.getContext("2d");
  state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
}
const initBox = () => {
  state.showImg = false
  state.canvas.style.display = 'none'
  let box = document.getElementsByClassName('magnifier-box')
  let imgsrc;
  if (state.bigImgUrl) {
    imgsrc = state.bigImgUrl
  } else {
    imgsrc = state.imgUrl
  }
  state.img = new Image()
  state.img.src = imgsrc
  state.img.onload = () => {
    state.vertical = state.img.width < state.img.height
    state.showImg = true
    let thumb = box[0].children[0]
    setTimeout(() => {
      state.rectTimesX = (state.imgbox.offsetWidth / props.scale) / thumb.offsetWidth,
        state.rectTimesY = (state.imgbox.offsetHeight / props.scale) / thumb.offsetHeight
    }, 20);
  }

}
const mousemove = (e) => {
  if (!state.init) {
    return false
  }
  if (state.canvas.height === 0 || state.canvas.width === 0) {
    initTime()
  }
  //获取实际的offset
  function offset(curEle) {
    var totalLeft = null, totalTop = null, par = curEle.offsetParent;
    //首先加自己本身的左偏移和上偏移
    totalLeft += curEle.offsetLeft;
    totalTop += curEle.offsetTop
    //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
    while (par) {
      if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
        //累加父级参照物的边框
        totalLeft += par.clientLeft;
        totalTop += par.clientTop
      }

      //累加父级参照物本身的偏移
      totalLeft += par.offsetLeft;
      totalTop += par.offsetTop
      par = par.offsetParent;
    }

    return {
      left: totalLeft,
      top: totalTop
    }
  }

  function getXY(eve) {
    return {
      x: eve.clientX - (state.cover.offsetWidth / 2),
      y: eve.clientY - (state.cover.offsetHeight / 2)
    };
  }
  let oEvent = e || event;
  let pos = getXY(oEvent);
  let imgwrap = offset(state.imgwrap)
  let range = {
    minX: imgwrap.left,
    maxX: imgwrap.left + state.imgwrap.offsetWidth - state.cover.offsetWidth,
    minY: imgwrap.top - document.documentElement.scrollTop,
    maxY: imgwrap.top - document.documentElement.scrollTop + state.imgwrap.offsetHeight - state.cover.offsetHeight,
  }
  if (pos.x > range.maxX) {
    pos.x = range.maxX
  }
  if (pos.x < range.minX) {
    pos.x = range.minX
  }
  if (pos.y > range.maxY) {
    pos.y = range.maxY
  }
  if (pos.y < range.minY) {
    pos.y = range.minY
  }
  state.cover.style.left = pos.x + 'px'
  state.cover.style.top = pos.y + 'px'
  state.ctx.clearRect(0, 0, state.imgwrap.offsetWidth, state.imgwrap.offsetHeight);
  let startX = pos.x - (imgwrap.left - document.documentElement.scrollLeft),
    startY = pos.y - (imgwrap.top - document.documentElement.scrollTop)
  state.ctx.drawImage(state.img, startX * state.imgTimesX, startY * state.imgTimesY, state.img.width * state.rectTimesX, state.img.height * state.rectTimesY, 0, 0, state.imgbox.offsetWidth, state.imgbox.offsetHeight);

}
const mouseover = (e) => {
  if (!state.init) {
    return false
  }
  e = e || event
  if (!props.scroll) {
    e.currentTarget.addEventListener("mousewheel", function (ev) {
      ev.preventDefault();
    }, false);

    e.currentTarget.addEventListener("DOMMouseScroll", function (ev) {
      ev.preventDefault();
    }, false);
  }


  state.cover.style.display = 'block'
  state.canvas.style.display = 'block'
}
const mouseleave = () => {
  if (!state.init) {
    return false
  }
  state.cover.style.display = 'none'
  state.canvas.style.display = 'none'
}
const rotate = (direction) => {
  var orginImg = new Image()
  orginImg.crossOrigin = "Anonymous";
  orginImg.src = state.orginUrl
  orginImg.onload = () => {
    rotateImg(orginImg, direction, state.step)
  }
  if (state.bigOrginUrl) {
    var bigOrginImg = new Image()
    orginImg.crossOrigin = "Anonymous";
    bigOrginImg.src = state.bigOrginUrl
    bigOrginImg.onload = () => {
      rotateImg(bigOrginImg, direction, state.bigStep, true)
    }
  }

}
const rotateImg = (img, direction, step, isBig = false) => {
  var min_step = 0;
  var max_step = 3;
  if (img == null) return;
  //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
  var height = img.height;
  var width = img.width;

  if (step == null) {
    step = min_step;
  }
  if (direction == 'right') {
    step++;
    //旋转到原位置，即超过最大值    
    step > max_step && (step = min_step);
  } else {
    step--;
    step < min_step && (step = max_step);
  }
  var canvas = document.createElement('canvas')

  //旋转角度以弧度值为参数    
  var degree = step * 90 * Math.PI / 180;
  var ctx = canvas.getContext('2d');
  canvas.width = height;
  canvas.height = width;
  ctx.rotate(degree);
  ctx.drawImage(img, 0, -height);
  switch (step) {
    case 0:
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      break;
    case 1:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, 0, -height);
      break;
    case 2:
      canvas.width = width;
      canvas.height = height;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, -height);
      break;
    case 3:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, 0);
      break;
  }
  var newImg = canvas.toDataURL()

  if (isBig) {
    state.bigImgUrl = newImg
    state.bigStep = step
    initBox()
  } else {
    state.imgUrl = newImg
    state.step = step
    nextTick(() => {
      initBox()
    })
  }
}

</script>

<template>
  <div class="magnifier-box" :class="state.vertical ? 'vertical' : ''" :ref="state.id" @mousemove="mousemove"
    @mouseover="mouseover" @mouseleave="mouseleave">
    <img v-show="state.showImg" :src="state.imgUrl" alt="">
    <div class="mouse-cover"></div>
    <div class="edit-wrap" v-if="props.showEidt">
      <span class="rotate-left" @click="rotate('left')"></span>
      <span class="rotate-right" @click="rotate('right')"></span>
    </div>
  </div>
</template>
<style lang="less" scoped>
.magnifier-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;

  .edit-wrap {
    position: absolute;
    top: 5px;
    right: 0;
    z-index: 9999999;
    background: rgba(0, 0, 0, 0.4);
    padding: 5px 15px 0 15px;
    border-radius: 15px;

    .rotate-left {
      display: inline-block;
      cursor: pointer;
      width: 16px;
      height: 16px;
      // background: url(../rotate.png);
      background-size: 100% 100%;
      -moz-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      transform: scaleX(-1);
      /*IE*/
      filter: FlipH;
    }

    .rotate-right {
      margin-left: 10px;
      cursor: pointer;
      display: inline-block;
      width: 16px;
      height: 16px;
      // background: url(../rotate.png);
      background-size: 100% 100%;
    }
  }

  img {
    width: 100%;
  }

  ;

  .mouse-cover {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: move
  }

  ;

  .mouse-cover-canvas {
    position: fixed;
    left: 100%;
    top: 0;
    width: 100%;
    height: 100%;
  }

  &.vertical {
    img {
      height: 100%;
      width: auto
    }
  }
}
</style>