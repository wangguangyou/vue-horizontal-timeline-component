<template>
  <div class="vue-horizontal-timeline-component" v-bind="$attrs" v-on="$listeners">
    <div ref="container" class="timeline-container"
        @mousewheel="(event)=>!mousewheelDisable&&MouseMove.handleMousewhell(event)"
        @mousedown="(event)=>MouseMove.handleMousedown(event)"
        @mousemove="(event)=>MouseMove.handleMouseMove(event)"
        @mouseleave="(event)=>MouseMove.handleMouseleave(event)"
        @mouseup="(event)=>MouseMove.handleMouseup(event)"
    >
    <div v-if="!timelineList" class="loading-mask">
      <div class="loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
      </div>
    </div>
    <template v-if="hasData">
      <div class="arrow-left">
        <div class="i-container" :style="{marginTop:-gap/2+'px'}">
          <svg v-if="leftLoading" viewBox="25 25 50 50" class="circular small">
            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
          </svg>
          <svg v-if="leftArrowShow&&!leftLoading" class="icon-arrow-left" viewBox="0 0 1024 1024"  width="32" height="32" @click="left"><path d="M586.325333 747.52a36.565333 36.565333 0 0 1 0 52.309333 38.058667 38.058667 0 0 1-53.248 0l-266.069333-261.674666a36.565333 36.565333 0 0 1 0-52.309334l266.069333-261.674666a38.058667 38.058667 0 0 1 53.248 0 36.565333 36.565333 0 0 1 0 52.352L346.837333 512l239.488 235.52z"></path></svg>
        </div>
      </div>
      <div class="arrow-right">
        <div class="i-container" :style="{marginTop:-gap/2+'px'}">
          <svg v-if="rightLoading" viewBox="25 25 50 50" class="circular small">
            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
          </svg>
          <svg  v-if="rightArrowShow&&!rightLoading" class="icon-arrow-right" viewBox="0 0 1024 1024" width="32"  height="32" @click="right"><path d="M437.674667 747.52L677.162667 512l-239.488-235.52a36.565333 36.565333 0 0 1 0-52.309333 38.058667 38.058667 0 0 1 53.248 0l266.069333 261.674666a36.565333 36.565333 0 0 1 0 52.309334l-266.069333 261.674666a38.058667 38.058667 0 0 1-53.248 0 36.565333 36.565333 0 0 1 0-52.352z" p-id="1616"></path></svg>
        </div>
      </div>
      <div ref="timelineRef" :class="{'scroll-container':true,'scroll-show':showScroll}">
        <div  :style="{height:maxItemHeight*2+gap+'px'}" class="timeline-wrapper" >
          <div class="timeline">
            <div v-for="(i,index) in timelineList" :key="i[uuid]" v-inserted="afterInserted"
              :data-id="i[uuid]" class="timeline-item">
              <div class="tail"></div>
              <div v-if="i.newMark" :class="{right:i.newMark=='left'}" class="divider"></div>
              <div :class="{center:i.centerNode}" class="node"></div>
              <div :class="{time:true,top:getIsTop(index)}" class="time">
                <slot name="time" :item="i">{{i&&i.time||''}}</slot>
              </div>
              <div class="wrapper" >
                <div :style="{top:getIsTop(index)}"  class="card">

                  <div  style="flex:1;">
                    <slot :item="i"></slot>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="timelineList&&!timelineList.length">
      <p class="no-data">
        <svg  viewBox="0 0 1024 1024" width="30" height="30"><path d="M512 20.48a491.52 491.52 0 1 0 491.52 491.52A491.52 491.52 0 0 0 512 20.48z m0 931.84A440.32 440.32 0 1 1 952.32 512 440.7296 440.7296 0 0 1 512 952.32z" p-id="925"></path><path d="M611.9424 708.608c-8.8064 6.5536-70.4512 70.656-97.0752 71.0656-7.9872 0-11.8784-6.3488-11.8784-18.8416q0-37.888 61.44-247.3984a858.9312 858.9312 0 0 0 37.888-141.9264 24.7808 24.7808 0 0 0-8.3968-20.48 49.7664 49.7664 0 0 0-29.4912-6.5536c-54.4768 0-117.76 37.888-186.9824 114.688-20.48 22.9376 14.1312 31.1296 26.0096 20.48C409.6 472.6784 471.04 409.6 491.52 409.6c9.4208 0 14.1312 4.3008 14.1312 13.1072a76.3904 76.3904 0 0 1-4.7104 22.528q-87.6544 286.72-87.6544 352.6656a59.392 59.392 0 0 0 10.0352 33.1776 34.816 34.816 0 0 0 31.3344 15.36 134.9632 134.9632 0 0 0 63.8976-21.9136 806.0928 806.0928 0 0 0 113.664-94.0032c19.2512-20.0704-7.7824-31.5392-20.2752-21.9136z" p-id="926"></path><path d="M595.461331 273.348307a43.4176 49.3568 15.71 1 0 26.72853-95.026104 43.4176 49.3568 15.71 1 0-26.72853 95.026104Z"></path></svg> 暂无数据</p>
    </template>
    </div>
  </div>
</template>

<script>
  import MouseMove from './MouseMove'
  export default {
    name: 'VueHorizontalTimelineComponent',
    directives: {
      inserted: {
        inserted: (el, binding) => {
          binding.value && binding.value(el.offsetHeight)
        },
        mounted: (el, binding) => {
          binding.value && binding.value(el.offsetHeight)
        },
        update: (el, binding) => {
          binding.value && binding.value(el.offsetHeight)
        },
        updated : (el, binding) => {
          binding.value && binding.value(el.offsetHeight)
        }
      }
    },
    props: {
      /**
       * 初次加载时定位的索引位置,优先级低于positionId
      */
      positionIndex: {
        type: Number,
        default: null
      },
      /**
       * 初次加载时定位的id位置,优先级高于positionIndex
      */
      positionId: {
        type: Number,
        default: null
      },
      /**
       * 显示的数据
       */
      timelineList: {
        type: Array,
        default: null
      },
      /**
       * 是否显示横向滚动轴
      */
      showScroll: {
        type: Boolean,
        default: true
      },
      /**
       * 数据项唯一标识符字段
       */
      uuid: {
        type: String,
        default: 'id'
      },
      /**
       * 左侧数据加载完毕
       */
      leftComplete: {
        type: Boolean,
        default: false
      },
      /**
       * 右侧数据加载完毕
       */
      rightComplete: {
        type: Boolean,
        default: false
      },
      /**
       * 是否显示左侧箭头
       */
      leftArrowShow: {
        type: Boolean,
        default: true
      },
      /**
       * 是否显示右侧箭头
       */
      rightArrowShow: {
        type: Boolean,
        default: true
      },
      /**
       * 底部空隙,单位px
       */
      gap: {
        type: Number,
        default: 25,
        validator: function (value) {
          return value > 0
        }
      },
      /**
       * 是否禁用滚轮
       */
      mousewheelDisable: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        MouseMove,
        maxScrollLeft: 0,
        rightLoading: false,
        leftLoading: false,
        maxItemHeight: 0,
        smoothScrolling: false
      }
    },
    computed: {
      offset() {
        return this.MouseMove.offset
      },
      hasData() {
        return this.timelineList && this.timelineList.length
      }
    },
    watch: {
      offset(val) {
        this.hasData && this.watchOffset(val.value)
      },
      rightLoading: 'handleRightLoad',
      leftLoading: 'handleLeftLoad',
      timelineList: {
        handler(val, oldval) {
          this.setMaxScrollLeft()
          if (!oldval && val) {
            if (this.positionId != null) {
              return this.positionById(this.positionId)
            }
            if (this.positionIndex != null) {
              this.positionByIndex(this.positionIndex)
            }
          }

        }, deep: true
      }
    },
    mounted() {
      this.setMaxScrollLeft()
    },
    methods: {
      getIsTop(index) {
        if (this.timelineList.length % 2) {
          return index % 2 ? 'calc(100% + 30px)' : 0
        } else {
          return index % 2 ? 0 : 'calc(100% + 30px)'
        }
      },
      afterInserted(height) {
        this.maxItemHeight = Math.max(height, this.maxItemHeight)
      },
      setMaxScrollLeft() {
        this.$nextTick(() => {
          let timelineRef = this.$refs.timelineRef
          if (!timelineRef) return
          this.maxScrollLeft = timelineRef.scrollWidth - timelineRef.offsetWidth
        })
      },
      smoothScroll(val, amplitude) {
        this.smoothScrolling = true
        let timelineRef = this.$refs.timelineRef
        let requestAnimationFrame = window.requestAnimationFrame
        let def = timelineRef.scrollLeft
        let scrollLeft = (val - def) / Math.abs((val - def)) * amplitude
        if (scrollLeft < 0) {
          scrollLeft = Math.floor(scrollLeft)
        } else {
          scrollLeft = Math.ceil(scrollLeft)
        }
        if (def + scrollLeft <= 0) {
          timelineRef.scrollLeft = 0
          this.smoothScrolling = false
          return
        }
        if (def + scrollLeft >= this.maxScrollLeft) {
          timelineRef.scrollLeft = this.maxScrollLeft
          return this.smoothScrolling = false
        }
        timelineRef.scrollLeft += scrollLeft
        return requestAnimationFrame(() => this.smoothScroll(val, amplitude))
      },
      left() {
        let timelineRef = this.$refs.timelineRef
        if (this.smoothScrolling || this.leftLoading || this.rightLoading) return
        if (timelineRef.scrollLeft == 0) {
          !this.leftComplete && (this.leftLoading = true)
        } else {
          this.smoothScroll(0, timelineRef.scrollLeft / 50)
        }
      },
      right() {
        if (this.smoothScrolling || this.leftLoading || this.rightLoading) return
        let timelineRef = this.$refs.timelineRef
        if (this.maxScrollLeft == timelineRef.scrollLeft) {
          !this.rightComplete && (this.rightLoading = true)
        } else {
          this.smoothScroll(this.maxScrollLeft, (this.maxScrollLeft - (timelineRef.scrollLeft || 0)) / 50)
        }
      },
      watchOffset(val) {
        if (this.rightLoading || this.leftLoading) return
        let timelineRef = this.$refs.timelineRef
        let scrollLeft = timelineRef.scrollLeft
        scrollLeft += -val
        if (scrollLeft < 0) scrollLeft = 0
        if (scrollLeft > this.maxScrollLeft) scrollLeft = this.maxScrollLeft
        if (!this.rightComplete && val < 0 && scrollLeft >= this.maxScrollLeft) {
          this.rightLoading = true
        }
        if (!this.leftComplete && val > 0 && scrollLeft <= 0) {
          this.leftLoading = true
        }
        timelineRef.scrollLeft = scrollLeft
      },
      handleRightLoad(val) {
        if (val) {
          const length = this.timelineList.length
          new Promise((resolve) => {
            /**
             * @property {function} resolve - 右侧数据加载中
             */
            this.$emit('right-loading', resolve)
          }).then(() => {
            const add = this.timelineList.length - length
            if (add > 0) {
              this.timelineList[0] && this.positioning(length, null, true)
            }
            this.rightLoading = false
          })
          MouseMove.start = false
        }
      },
      handleLeftLoad(val) {
        if (val) {
          const length = this.timelineList.length
          new Promise((resolve) => {
            /**
            * @property {function} resolve - 左侧数据加载中
            */
            this.$emit('left-loading', resolve)
          }).then(() => {
            const add = this.timelineList.length - length
            if (add > 0) {
              this.timelineList[0] && this.positioning(add - 1, true)
            }
            this.leftLoading = false
          })
          MouseMove.start = false
        }
      },
      /**
       * 定位到指定id项
       * @public
       */
      positionById(id) {
        this.$nextTick(() => {
          if (!id) return console.warn('id不能为空')
          let doms = this.$refs.timelineRef && this.$refs.timelineRef.querySelectorAll('.timeline-item')
          doms && [].forEach.call(doms, (dom) => {
            if (dom.dataset.id == id) {
              dom.scrollIntoView && dom.scrollIntoView({
                inline: "center",
                block: "center"
              })
            }
          })
        })
      },
      /**
       * 定位到指定索引项
       * @public
       */
      positionByIndex(index) {
        this.timelineList[index] && this.positionById(this.timelineList[index][this.uuid])
      },
      positioning(index, leftLoading, rightLoading) {
        this.$nextTick(() => {
          let doms = this.$refs.timelineRef && this.$refs.timelineRef.querySelectorAll('.timeline-item')
          const dom = doms[index]
          dom.scrollIntoView && dom.scrollIntoView({
            inline: leftLoading ? "start" :
              (rightLoading ? 'end' : "center"),
            block: "center"
          })
        })
      }
    }
  }
</script>

<style scoped>
.loading-mask {
  position: absolute;
  z-index: 2000;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
}

.loading-mask .loading-spinner {
  top: 50%;
  margin-top: -21px;
  width: 100%;
  text-align: center;
  position: absolute;
}

@keyframes loading-rotate {
  100% {
    transform: rotate(1turn);
  }
}

.circular {
  height: 42px;
  width: 42px;
  animation: loading-rotate 2s linear infinite;
}

.circular.small {
  height: 22px;
  width: 22px;
}

.circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #409eff;
  stroke-linecap: round;
}

.no-data {
  font-size: 26px;
  text-align: center;
  margin: 0;
  padding: 1em 0;
}

.no-data svg {
  vertical-align: sub;
}

.card {
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  transition: 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: 100%;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 60px;
  position: relative !important;
  padding: 0 40px;
}

.timeline-container .arrow-right,
.timeline-container .arrow-left {
  outline: none;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 36px;
  transition: 0.3s;
  color: #aeaeae;
  position: absolute;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
}

.timeline-container .arrow-right .i-container,
.timeline-container .arrow-left .i-container {
  position: absolute;
  font-size: 0;
  top: 50%;
  transform: translateY(-50%);
}

.timeline-container .arrow-right .i-container i,
.timeline-container .arrow-left .i-container i {
  font-size: 50px;
}

.timeline-container .arrow-right:hover i,
.timeline-container .arrow-left:hover i {
  color: #999;
}

.timeline-container .arrow-left {
  left: 4px;
}

.timeline-container .arrow-left .i-container {
  left: 0;
}

.timeline-container .arrow-left .i-container .icon-arrow-left {
  margin-left: -15px;
  cursor: pointer;
}

.timeline-container .arrow-left .i-container .icon-arrow-left:hover path {
  fill: #5cb6ff;
}

.timeline-container .arrow-right {
  right: 4px;
}

.timeline-container .arrow-right .i-container {
  right: 0;
}

.timeline-container .arrow-right .i-container .icon-arrow-right {
  margin-right: -15px;
  cursor: pointer;
}

.timeline-container .arrow-right .i-container .icon-arrow-right:hover path {
  fill: #5cb6ff;
}

.timeline-wrapper {
  user-select: none;
  position: relative;
}

.timeline {
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
  width: 100%;
  font-size: 14px;
  list-style: none;
  padding-top: 10px;
}

.timeline .timeline-item {
  position: relative;
  display: inline-flex;
  padding: 0 8px;
}

.timeline .timeline-item .tail {
  position: absolute;
  bottom: 5px;
  right: 0;
  width: 100%;
  border-top: 2px solid #e4e7ed;
}

.timeline .timeline-item .divider {
  position: absolute;
  width: 1px;
  height: 200%;
  left: 0;
  top: 0;
  border-right: 1px dashed #e4e7ed;
}

.timeline .timeline-item .divider.right {
  left: initial;
  right: 0;
}

.timeline .timeline-item .link {
  position: absolute;
  bottom: 5px;
  left: 6px;
  transform-origin: 0 0;
  transform: rotate(-45deg);
  width: 21px;
  border-top: 1px solid #e4e7ed;
}

.timeline .timeline-item .time {
  position: absolute;
  bottom: -30px;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  color: #909399;
  line-height: 1.3;
  font-size: 13px;
  text-align: center;
}

.timeline .timeline-item .time.top {
  bottom: 30px;
}

.timeline .timeline-item .node {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  left: 50%;
  background-color: #e4e7ed;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12px;
  height: 12px;
}

.timeline .timeline-item .node.center {
  background-color: #74f5dd;
}

.timeline .timeline-item:first-child .tail {
  width: 50%;
}

.timeline .timeline-item:last-child .tail {
  left: 0;
  width: 50%;
}

.timeline .timeline-item .wrapper {
  margin-bottom: 20px;
  width: 100%;
}

.scroll-container {
  overflow-x: hidden;
  flex: 1;
}

.scroll-container.scroll-show {
  overflow-x: auto;
}

.scroll-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #f5f5f5;
}

.scroll-container::-webkit-scrollbar-track {
  display: none;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background-color: transparent;
}

.scroll-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.16);
}

.scroll-container::-webkit-scrollbar-track-piece {
  display: none;
}

.scroll-container::-webkit-scrollbar-corner {
  display: none;
}

.scroll-container::-webkit-scrollbar-button {
  display: none;
}
</style>
