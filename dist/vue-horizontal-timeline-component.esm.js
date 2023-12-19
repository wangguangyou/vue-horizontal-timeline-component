import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';

var MouseMove = /*#__PURE__*/function () {
  function MouseMove() {
    _classCallCheck(this, MouseMove);
    this.start = false;
    this.x = 0;
    this.offset = {
      value: 0
    };
    this.startx = 0;
  }
  _createClass(MouseMove, [{
    key: "handleMousedown",
    value: function handleMousedown(event) {
      if (!event.button) {
        this.start = true;
        var pageX = event.pageX;
        this.startx = pageX;
        this.x = pageX;
      }
    }
  }, {
    key: "handleMousewhell",
    value: function handleMousewhell(event) {
      var wheelDelta = event.wheelDelta;
      this.offset = {
        value: wheelDelta / 2
      };
      if (event.preventDefault) {
        event.preventDefault();
        return false;
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      if (!this.start) return;
      var pageX = event.pageX;
      this.offset = {
        value: pageX - this.x
      };
      this.x = pageX;
      if (event.preventDefault) {
        event.preventDefault();
        return false;
      }
    }
  }, {
    key: "handleMouseup",
    value: function handleMouseup() {
      this.start = false;
    }
  }, {
    key: "handleMouseleave",
    value: function handleMouseleave() {
      this.start = false;
    }
  }]);
  return MouseMove;
}();
var MouseMove$1 = new MouseMove();

//
var script = {
  name: 'VueHorizontalTimelineComponent',
  directives: {
    inserted: {
      inserted: function inserted(el, binding) {
        binding.value && binding.value(el.offsetHeight);
      },
      mounted: function mounted(el, binding) {
        binding.value && binding.value(el.offsetHeight);
      },
      update: function update(el, binding) {
        binding.value && binding.value(el.offsetHeight);
      },
      updated: function updated(el, binding) {
        binding.value && binding.value(el.offsetHeight);
      }
    }
  },
  props: {
    /**
     * 初次加载时定位的索引位置,优先级低于positionId
    */
    positionIndex: {
      type: Number,
      "default": null
    },
    /**
     * 初次加载时定位的id位置,优先级高于positionIndex
    */
    positionId: {
      type: Number,
      "default": null
    },
    /**
     * 显示的数据
     */
    timelineList: {
      type: Array,
      "default": null
    },
    /**
     * 是否显示横向滚动轴
    */
    showScroll: {
      type: Boolean,
      "default": true
    },
    /**
     * 数据项唯一标识符字段
     */
    uuid: {
      type: String,
      "default": 'id'
    },
    /**
     * 左侧数据加载完毕
     */
    leftComplete: {
      type: Boolean,
      "default": false
    },
    /**
     * 右侧数据加载完毕
     */
    rightComplete: {
      type: Boolean,
      "default": false
    },
    /**
     * 是否显示左侧箭头
     */
    leftArrowShow: {
      type: Boolean,
      "default": true
    },
    /**
     * 是否显示右侧箭头
     */
    rightArrowShow: {
      type: Boolean,
      "default": true
    },
    /**
     * 底部空隙,单位px
     */
    gap: {
      type: Number,
      "default": 25,
      validator: function validator(value) {
        return value > 0;
      }
    },
    /**
     * 是否禁用滚轮
     */
    mousewheelDisable: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      MouseMove: MouseMove$1,
      maxScrollLeft: 0,
      rightLoading: false,
      leftLoading: false,
      maxItemHeight: 0,
      smoothScrolling: false
    };
  },
  computed: {
    offset: function offset() {
      return this.MouseMove.offset;
    },
    hasData: function hasData() {
      return this.timelineList && this.timelineList.length;
    }
  },
  watch: {
    offset: function offset(val) {
      this.hasData && this.watchOffset(val.value);
    },
    rightLoading: 'handleRightLoad',
    leftLoading: 'handleLeftLoad',
    timelineList: {
      handler: function handler(val, oldval) {
        this.setMaxScrollLeft();
        if (!oldval && val) {
          if (this.positionId != null) {
            return this.positionById(this.positionId);
          }
          if (this.positionIndex != null) {
            this.positionByIndex(this.positionIndex);
          }
        }
      },
      deep: true
    }
  },
  mounted: function mounted() {
    this.setMaxScrollLeft();
  },
  methods: {
    getIsTop: function getIsTop(index) {
      if (this.timelineList.length % 2) {
        return index % 2 ? 'calc(100% + 30px)' : 0;
      } else {
        return index % 2 ? 0 : 'calc(100% + 30px)';
      }
    },
    afterInserted: function afterInserted(height) {
      this.maxItemHeight = Math.max(height, this.maxItemHeight);
    },
    setMaxScrollLeft: function setMaxScrollLeft() {
      var _this = this;
      this.$nextTick(function () {
        var timelineRef = _this.$refs.timelineRef;
        if (!timelineRef) return;
        _this.maxScrollLeft = timelineRef.scrollWidth - timelineRef.offsetWidth;
      });
    },
    smoothScroll: function smoothScroll(val, amplitude) {
      var _this2 = this;
      this.smoothScrolling = true;
      var timelineRef = this.$refs.timelineRef;
      var requestAnimationFrame = window.requestAnimationFrame;
      var def = timelineRef.scrollLeft;
      var scrollLeft = (val - def) / Math.abs(val - def) * amplitude;
      if (scrollLeft < 0) {
        scrollLeft = Math.floor(scrollLeft);
      } else {
        scrollLeft = Math.ceil(scrollLeft);
      }
      if (def + scrollLeft <= 0) {
        timelineRef.scrollLeft = 0;
        this.smoothScrolling = false;
        return;
      }
      if (def + scrollLeft >= this.maxScrollLeft) {
        timelineRef.scrollLeft = this.maxScrollLeft;
        return this.smoothScrolling = false;
      }
      timelineRef.scrollLeft += scrollLeft;
      return requestAnimationFrame(function () {
        return _this2.smoothScroll(val, amplitude);
      });
    },
    left: function left() {
      var timelineRef = this.$refs.timelineRef;
      if (this.smoothScrolling || this.leftLoading || this.rightLoading) return;
      if (timelineRef.scrollLeft == 0) {
        !this.leftComplete && (this.leftLoading = true);
      } else {
        this.smoothScroll(0, timelineRef.scrollLeft / 50);
      }
    },
    right: function right() {
      if (this.smoothScrolling || this.leftLoading || this.rightLoading) return;
      var timelineRef = this.$refs.timelineRef;
      if (this.maxScrollLeft == timelineRef.scrollLeft) {
        !this.rightComplete && (this.rightLoading = true);
      } else {
        this.smoothScroll(this.maxScrollLeft, (this.maxScrollLeft - (timelineRef.scrollLeft || 0)) / 50);
      }
    },
    watchOffset: function watchOffset(val) {
      if (this.rightLoading || this.leftLoading) return;
      var timelineRef = this.$refs.timelineRef;
      var scrollLeft = timelineRef.scrollLeft;
      scrollLeft += -val;
      if (scrollLeft < 0) scrollLeft = 0;
      if (scrollLeft > this.maxScrollLeft) scrollLeft = this.maxScrollLeft;
      if (!this.rightComplete && val < 0 && scrollLeft >= this.maxScrollLeft) {
        this.rightLoading = true;
      }
      if (!this.leftComplete && val > 0 && scrollLeft <= 0) {
        this.leftLoading = true;
      }
      timelineRef.scrollLeft = scrollLeft;
    },
    handleRightLoad: function handleRightLoad(val) {
      var _this3 = this;
      if (val) {
        var length = this.timelineList.length;
        new Promise(function (resolve) {
          /**
           * @property {function} resolve - 右侧数据加载中
           */
          _this3.$emit('right-loading', resolve);
        }).then(function () {
          var add = _this3.timelineList.length - length;
          if (add > 0) {
            _this3.timelineList[0] && _this3.positioning(length, null, true);
          }
          _this3.rightLoading = false;
        });
        MouseMove$1.start = false;
      }
    },
    handleLeftLoad: function handleLeftLoad(val) {
      var _this4 = this;
      if (val) {
        var length = this.timelineList.length;
        new Promise(function (resolve) {
          /**
          * @property {function} resolve - 左侧数据加载中
          */
          _this4.$emit('left-loading', resolve);
        }).then(function () {
          var add = _this4.timelineList.length - length;
          if (add > 0) {
            _this4.timelineList[0] && _this4.positioning(add - 1, true);
          }
          _this4.leftLoading = false;
        });
        MouseMove$1.start = false;
      }
    },
    /**
     * 定位到指定id项
     * @public
     */
    positionById: function positionById(id) {
      var _this5 = this;
      this.$nextTick(function () {
        if (!id) return console.warn('id不能为空');
        var doms = _this5.$refs.timelineRef && _this5.$refs.timelineRef.querySelectorAll('.timeline-item');
        doms && [].forEach.call(doms, function (dom) {
          if (dom.dataset.id == id) {
            dom.scrollIntoView && dom.scrollIntoView({
              inline: "center",
              block: "center"
            });
          }
        });
      });
    },
    /**
     * 定位到指定索引项
     * @public
     */
    positionByIndex: function positionByIndex(index) {
      this.timelineList[index] && this.positionById(this.timelineList[index][this.uuid]);
    },
    positioning: function positioning(index, leftLoading, rightLoading) {
      var _this6 = this;
      this.$nextTick(function () {
        var doms = _this6.$refs.timelineRef && _this6.$refs.timelineRef.querySelectorAll('.timeline-item');
        var dom = doms[index];
        dom.scrollIntoView && dom.scrollIntoView({
          inline: leftLoading ? "start" : rightLoading ? 'end' : "center",
          block: "center"
        });
      });
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", _vm._g(_vm._b({
    staticClass: "vue-horizontal-timeline-component"
  }, "div", _vm.$attrs, false), _vm.$listeners), [_c("div", {
    ref: "container",
    staticClass: "timeline-container",
    on: {
      mousewheel: function mousewheel(event) {
        return !_vm.mousewheelDisable && _vm.MouseMove.handleMousewhell(event);
      },
      mousedown: function mousedown(event) {
        return _vm.MouseMove.handleMousedown(event);
      },
      mousemove: function mousemove(event) {
        return _vm.MouseMove.handleMouseMove(event);
      },
      mouseleave: function mouseleave(event) {
        return _vm.MouseMove.handleMouseleave(event);
      },
      mouseup: function mouseup(event) {
        return _vm.MouseMove.handleMouseup(event);
      }
    }
  }, [!_vm.timelineList ? _c("div", {
    staticClass: "loading-mask"
  }, [_c("div", {
    staticClass: "loading-spinner"
  }, [_c("svg", {
    staticClass: "circular",
    attrs: {
      viewBox: "25 25 50 50"
    }
  }, [_c("circle", {
    staticClass: "path",
    attrs: {
      cx: "50",
      cy: "50",
      r: "20",
      fill: "none"
    }
  })])])]) : _vm._e(), _vm._v(" "), _vm.hasData ? [_c("div", {
    staticClass: "arrow-left"
  }, [_c("div", {
    staticClass: "i-container",
    style: {
      marginTop: -_vm.gap / 2 + "px"
    }
  }, [_vm.leftLoading ? _c("svg", {
    staticClass: "circular small",
    attrs: {
      viewBox: "25 25 50 50"
    }
  }, [_c("circle", {
    staticClass: "path",
    attrs: {
      cx: "50",
      cy: "50",
      r: "20",
      fill: "none"
    }
  })]) : _vm._e(), _vm._v(" "), _vm.leftArrowShow && !_vm.leftLoading ? _c("svg", {
    staticClass: "icon-arrow-left",
    attrs: {
      viewBox: "0 0 1024 1024",
      width: "32",
      height: "32"
    },
    on: {
      click: _vm.left
    }
  }, [_c("path", {
    attrs: {
      d: "M586.325333 747.52a36.565333 36.565333 0 0 1 0 52.309333 38.058667 38.058667 0 0 1-53.248 0l-266.069333-261.674666a36.565333 36.565333 0 0 1 0-52.309334l266.069333-261.674666a38.058667 38.058667 0 0 1 53.248 0 36.565333 36.565333 0 0 1 0 52.352L346.837333 512l239.488 235.52z"
    }
  })]) : _vm._e()])]), _vm._v(" "), _c("div", {
    staticClass: "arrow-right"
  }, [_c("div", {
    staticClass: "i-container",
    style: {
      marginTop: -_vm.gap / 2 + "px"
    }
  }, [_vm.rightLoading ? _c("svg", {
    staticClass: "circular small",
    attrs: {
      viewBox: "25 25 50 50"
    }
  }, [_c("circle", {
    staticClass: "path",
    attrs: {
      cx: "50",
      cy: "50",
      r: "20",
      fill: "none"
    }
  })]) : _vm._e(), _vm._v(" "), _vm.rightArrowShow && !_vm.rightLoading ? _c("svg", {
    staticClass: "icon-arrow-right",
    attrs: {
      viewBox: "0 0 1024 1024",
      width: "32",
      height: "32"
    },
    on: {
      click: _vm.right
    }
  }, [_c("path", {
    attrs: {
      d: "M437.674667 747.52L677.162667 512l-239.488-235.52a36.565333 36.565333 0 0 1 0-52.309333 38.058667 38.058667 0 0 1 53.248 0l266.069333 261.674666a36.565333 36.565333 0 0 1 0 52.309334l-266.069333 261.674666a38.058667 38.058667 0 0 1-53.248 0 36.565333 36.565333 0 0 1 0-52.352z",
      "p-id": "1616"
    }
  })]) : _vm._e()])]), _vm._v(" "), _c("div", {
    ref: "timelineRef",
    "class": {
      "scroll-container": true,
      "scroll-show": _vm.showScroll
    }
  }, [_c("div", {
    staticClass: "timeline-wrapper",
    style: {
      height: _vm.maxItemHeight * 2 + _vm.gap + "px"
    }
  }, [_c("div", {
    staticClass: "timeline"
  }, _vm._l(_vm.timelineList, function (i, index) {
    return _c("div", {
      directives: [{
        name: "inserted",
        rawName: "v-inserted",
        value: _vm.afterInserted,
        expression: "afterInserted"
      }],
      key: i[_vm.uuid],
      staticClass: "timeline-item",
      attrs: {
        "data-id": i[_vm.uuid]
      }
    }, [_c("div", {
      staticClass: "tail"
    }), _vm._v(" "), i.newMark ? _c("div", {
      staticClass: "divider",
      "class": {
        right: i.newMark == "left"
      }
    }) : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "node",
      "class": {
        center: i.centerNode
      }
    }), _vm._v(" "), _c("div", {
      staticClass: "time",
      "class": {
        time: true,
        top: _vm.getIsTop(index)
      }
    }, [_vm._t("time", [_vm._v(_vm._s(i && i.time || ""))], {
      item: i
    })], 2), _vm._v(" "), _c("div", {
      staticClass: "wrapper"
    }, [_c("div", {
      staticClass: "card",
      style: {
        top: _vm.getIsTop(index)
      }
    }, [_c("div", {
      staticStyle: {
        flex: "1"
      }
    }, [_vm._t("default", null, {
      item: i
    })], 2)])])]);
  }), 0)])])] : _vm._e(), _vm._v(" "), _vm.timelineList && !_vm.timelineList.length ? [_c("p", {
    staticClass: "no-data"
  }, [_c("svg", {
    attrs: {
      viewBox: "0 0 1024 1024",
      width: "30",
      height: "30"
    }
  }, [_c("path", {
    attrs: {
      d: "M512 20.48a491.52 491.52 0 1 0 491.52 491.52A491.52 491.52 0 0 0 512 20.48z m0 931.84A440.32 440.32 0 1 1 952.32 512 440.7296 440.7296 0 0 1 512 952.32z",
      "p-id": "925"
    }
  }), _c("path", {
    attrs: {
      d: "M611.9424 708.608c-8.8064 6.5536-70.4512 70.656-97.0752 71.0656-7.9872 0-11.8784-6.3488-11.8784-18.8416q0-37.888 61.44-247.3984a858.9312 858.9312 0 0 0 37.888-141.9264 24.7808 24.7808 0 0 0-8.3968-20.48 49.7664 49.7664 0 0 0-29.4912-6.5536c-54.4768 0-117.76 37.888-186.9824 114.688-20.48 22.9376 14.1312 31.1296 26.0096 20.48C409.6 472.6784 471.04 409.6 491.52 409.6c9.4208 0 14.1312 4.3008 14.1312 13.1072a76.3904 76.3904 0 0 1-4.7104 22.528q-87.6544 286.72-87.6544 352.6656a59.392 59.392 0 0 0 10.0352 33.1776 34.816 34.816 0 0 0 31.3344 15.36 134.9632 134.9632 0 0 0 63.8976-21.9136 806.0928 806.0928 0 0 0 113.664-94.0032c19.2512-20.0704-7.7824-31.5392-20.2752-21.9136z",
      "p-id": "926"
    }
  }), _c("path", {
    attrs: {
      d: "M595.461331 273.348307a43.4176 49.3568 15.71 1 0 26.72853-95.026104 43.4176 49.3568 15.71 1 0-26.72853 95.026104Z"
    }
  })]), _vm._v(" 暂无数据")])] : _vm._e()], 2)]);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-7855e68a_0", {
    source: "\n.loading-mask[data-v-7855e68a] {\n  position: absolute;\n  z-index: 2000;\n  background-color: rgba(255, 255, 255, 0.9);\n  margin: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  -webkit-transition: opacity 0.3s;\n  transition: opacity 0.3s;\n}\n.loading-mask .loading-spinner[data-v-7855e68a] {\n  top: 50%;\n  margin-top: -21px;\n  width: 100%;\n  text-align: center;\n  position: absolute;\n}\n@-webkit-keyframes loading-rotate-data-v-7855e68a {\n100% {\n    -webkit-transform: rotate(1turn);\n            transform: rotate(1turn);\n}\n}\n@keyframes loading-rotate-data-v-7855e68a {\n100% {\n    -webkit-transform: rotate(1turn);\n            transform: rotate(1turn);\n}\n}\n.circular[data-v-7855e68a] {\n  height: 42px;\n  width: 42px;\n  -webkit-animation: loading-rotate-data-v-7855e68a 2s linear infinite;\n          animation: loading-rotate-data-v-7855e68a 2s linear infinite;\n}\n.circular.small[data-v-7855e68a] {\n  height: 22px;\n  width: 22px;\n}\n.circular .path[data-v-7855e68a] {\n  -webkit-animation: loading-dash 1.5s ease-in-out infinite;\n          animation: loading-dash 1.5s ease-in-out infinite;\n  stroke-dasharray: 90, 150;\n  stroke-dashoffset: 0;\n  stroke-width: 2;\n  stroke: #409eff;\n  stroke-linecap: round;\n}\n.no-data[data-v-7855e68a] {\n  font-size: 26px;\n  text-align: center;\n  margin: 0;\n  padding: 1em 0;\n}\n.no-data svg[data-v-7855e68a] {\n  vertical-align: sub;\n}\n.card[data-v-7855e68a] {\n  border: 1px solid #ebeef5;\n  background-color: #fff;\n  color: #303133;\n  -webkit-transition: 0.3s;\n  transition: 0.3s;\n  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  position: relative;\n  height: 100%;\n  width: 100%;\n}\n.filter-bar[data-v-7855e68a] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: justify;\n          justify-content: space-between;\n  -webkit-box-align: center;\n          align-items: center;\n}\n.timeline-container[data-v-7855e68a] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-flex: 1;\n          flex: 1;\n  min-height: 60px;\n  position: relative !important;\n  padding: 0 40px;\n}\n.timeline-container .arrow-right[data-v-7855e68a],\n.timeline-container .arrow-left[data-v-7855e68a] {\n  outline: none;\n  padding: 0;\n  margin: 0;\n  height: 100%;\n  width: 36px;\n  -webkit-transition: 0.3s;\n  transition: 0.3s;\n  color: #aeaeae;\n  position: absolute;\n  top: 50%;\n  z-index: 10;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n}\n.timeline-container .arrow-right .i-container[data-v-7855e68a],\n.timeline-container .arrow-left .i-container[data-v-7855e68a] {\n  position: absolute;\n  font-size: 0;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n}\n.timeline-container .arrow-right .i-container i[data-v-7855e68a],\n.timeline-container .arrow-left .i-container i[data-v-7855e68a] {\n  font-size: 50px;\n}\n.timeline-container .arrow-right:hover i[data-v-7855e68a],\n.timeline-container .arrow-left:hover i[data-v-7855e68a] {\n  color: #999;\n}\n.timeline-container .arrow-left[data-v-7855e68a] {\n  left: 4px;\n}\n.timeline-container .arrow-left .i-container[data-v-7855e68a] {\n  left: 0;\n}\n.timeline-container .arrow-left .i-container .icon-arrow-left[data-v-7855e68a] {\n  margin-left: -15px;\n  cursor: pointer;\n}\n.timeline-container .arrow-left .i-container .icon-arrow-left:hover path[data-v-7855e68a] {\n  fill: #5cb6ff;\n}\n.timeline-container .arrow-right[data-v-7855e68a] {\n  right: 4px;\n}\n.timeline-container .arrow-right .i-container[data-v-7855e68a] {\n  right: 0;\n}\n.timeline-container .arrow-right .i-container .icon-arrow-right[data-v-7855e68a] {\n  margin-right: -15px;\n  cursor: pointer;\n}\n.timeline-container .arrow-right .i-container .icon-arrow-right:hover path[data-v-7855e68a] {\n  fill: #5cb6ff;\n}\n.timeline-wrapper[data-v-7855e68a] {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  position: relative;\n}\n.timeline[data-v-7855e68a] {\n  display: -webkit-box;\n  display: flex;\n  flex-wrap: nowrap;\n  margin: 0;\n  width: 100%;\n  font-size: 14px;\n  list-style: none;\n  padding-top: 10px;\n}\n.timeline .timeline-item[data-v-7855e68a] {\n  position: relative;\n  display: -webkit-inline-box;\n  display: inline-flex;\n  padding: 0 8px;\n}\n.timeline .timeline-item .tail[data-v-7855e68a] {\n  position: absolute;\n  bottom: 5px;\n  right: 0;\n  width: 100%;\n  border-top: 2px solid #e4e7ed;\n}\n.timeline .timeline-item .divider[data-v-7855e68a] {\n  position: absolute;\n  width: 1px;\n  height: 200%;\n  left: 0;\n  top: 0;\n  border-right: 1px dashed #e4e7ed;\n}\n.timeline .timeline-item .divider.right[data-v-7855e68a] {\n  left: initial;\n  right: 0;\n}\n.timeline .timeline-item .link[data-v-7855e68a] {\n  position: absolute;\n  bottom: 5px;\n  left: 6px;\n  -webkit-transform-origin: 0 0;\n          transform-origin: 0 0;\n  -webkit-transform: rotate(-45deg);\n          transform: rotate(-45deg);\n  width: 21px;\n  border-top: 1px solid #e4e7ed;\n}\n.timeline .timeline-item .time[data-v-7855e68a] {\n  position: absolute;\n  bottom: -30px;\n  width: 100%;\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n          transform: translateX(-50%);\n  color: #909399;\n  line-height: 1.3;\n  font-size: 13px;\n  text-align: center;\n}\n.timeline .timeline-item .time.top[data-v-7855e68a] {\n  bottom: 30px;\n}\n.timeline .timeline-item .node[data-v-7855e68a] {\n  position: absolute;\n  bottom: 0;\n  -webkit-transform: translateX(-50%);\n          transform: translateX(-50%);\n  left: 50%;\n  background-color: #e4e7ed;\n  border-radius: 50%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n          align-items: center;\n  width: 12px;\n  height: 12px;\n}\n.timeline .timeline-item .node.center[data-v-7855e68a] {\n  background-color: #74f5dd;\n}\n.timeline .timeline-item:first-child .tail[data-v-7855e68a] {\n  width: 50%;\n}\n.timeline .timeline-item:last-child .tail[data-v-7855e68a] {\n  left: 0;\n  width: 50%;\n}\n.timeline .timeline-item .wrapper[data-v-7855e68a] {\n  margin-bottom: 20px;\n  width: 100%;\n}\n.scroll-container[data-v-7855e68a] {\n  overflow-x: hidden;\n  -webkit-box-flex: 1;\n          flex: 1;\n}\n.scroll-container.scroll-show[data-v-7855e68a] {\n  overflow-x: auto;\n}\n.scroll-container[data-v-7855e68a]::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n  background-color: #f5f5f5;\n}\n.scroll-container[data-v-7855e68a]::-webkit-scrollbar-track {\n  display: none;\n  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);\n  border-radius: 10px;\n  background-color: transparent;\n}\n.scroll-container[data-v-7855e68a]::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);\n  background: rgba(0, 0, 0, 0.16);\n}\n.scroll-container[data-v-7855e68a]::-webkit-scrollbar-track-piece {\n  display: none;\n}\n.scroll-container[data-v-7855e68a]::-webkit-scrollbar-corner {\n  display: none;\n}\n.scroll-container[data-v-7855e68a]::-webkit-scrollbar-button {\n  display: none;\n}\n",
    map: {
      "version": 3,
      "sources": ["E:\\vue-horizontal-timeline-component\\src\\vue-horizontal-timeline-component.vue"],
      "names": [],
      "mappings": ";AA0WA;EACA,kBAAA;EACA,aAAA;EACA,0CAAA;EACA,SAAA;EACA,MAAA;EACA,QAAA;EACA,SAAA;EACA,OAAA;EACA,gCAAA;EAAA,wBAAA;AACA;AAEA;EACA,QAAA;EACA,iBAAA;EACA,WAAA;EACA,kBAAA;EACA,kBAAA;AACA;AAEA;AACA;IACA,gCAAA;YAAA,wBAAA;AACA;AACA;AAJA;AACA;IACA,gCAAA;YAAA,wBAAA;AACA;AACA;AAEA;EACA,YAAA;EACA,WAAA;EACA,oEAAA;UAAA,4DAAA;AACA;AAEA;EACA,YAAA;EACA,WAAA;AACA;AAEA;EACA,yDAAA;UAAA,iDAAA;EACA,yBAAA;EACA,oBAAA;EACA,eAAA;EACA,eAAA;EACA,qBAAA;AACA;AAEA;EACA,eAAA;EACA,kBAAA;EACA,SAAA;EACA,cAAA;AACA;AAEA;EACA,mBAAA;AACA;AAEA;EACA,yBAAA;EACA,sBAAA;EACA,cAAA;EACA,wBAAA;EAAA,gBAAA;EACA,2CAAA;EACA,oBAAA;EAAA,aAAA;EACA,4BAAA;EAAA,6BAAA;UAAA,sBAAA;EACA,kBAAA;EACA,YAAA;EACA,WAAA;AACA;AAEA;EACA,oBAAA;EAAA,aAAA;EACA,yBAAA;UAAA,8BAAA;EACA,yBAAA;UAAA,mBAAA;AACA;AAEA;EACA,oBAAA;EAAA,aAAA;EACA,4BAAA;EAAA,6BAAA;UAAA,sBAAA;EACA,mBAAA;UAAA,OAAA;EACA,gBAAA;EACA,6BAAA;EACA,eAAA;AACA;AAEA;;EAEA,aAAA;EACA,UAAA;EACA,SAAA;EACA,YAAA;EACA,WAAA;EACA,wBAAA;EAAA,gBAAA;EACA,cAAA;EACA,kBAAA;EACA,QAAA;EACA,WAAA;EACA,mCAAA;UAAA,2BAAA;AACA;AAEA;;EAEA,kBAAA;EACA,YAAA;EACA,QAAA;EACA,mCAAA;UAAA,2BAAA;AACA;AAEA;;EAEA,eAAA;AACA;AAEA;;EAEA,WAAA;AACA;AAEA;EACA,SAAA;AACA;AAEA;EACA,OAAA;AACA;AAEA;EACA,kBAAA;EACA,eAAA;AACA;AAEA;EACA,aAAA;AACA;AAEA;EACA,UAAA;AACA;AAEA;EACA,QAAA;AACA;AAEA;EACA,mBAAA;EACA,eAAA;AACA;AAEA;EACA,aAAA;AACA;AAEA;EACA,yBAAA;KAAA,sBAAA;MAAA,qBAAA;UAAA,iBAAA;EACA,kBAAA;AACA;AAEA;EACA,oBAAA;EAAA,aAAA;EACA,iBAAA;EACA,SAAA;EACA,WAAA;EACA,eAAA;EACA,gBAAA;EACA,iBAAA;AACA;AAEA;EACA,kBAAA;EACA,2BAAA;EAAA,oBAAA;EACA,cAAA;AACA;AAEA;EACA,kBAAA;EACA,WAAA;EACA,QAAA;EACA,WAAA;EACA,6BAAA;AACA;AAEA;EACA,kBAAA;EACA,UAAA;EACA,YAAA;EACA,OAAA;EACA,MAAA;EACA,gCAAA;AACA;AAEA;EACA,aAAA;EACA,QAAA;AACA;AAEA;EACA,kBAAA;EACA,WAAA;EACA,SAAA;EACA,6BAAA;UAAA,qBAAA;EACA,iCAAA;UAAA,yBAAA;EACA,WAAA;EACA,6BAAA;AACA;AAEA;EACA,kBAAA;EACA,aAAA;EACA,WAAA;EACA,SAAA;EACA,mCAAA;UAAA,2BAAA;EACA,cAAA;EACA,gBAAA;EACA,eAAA;EACA,kBAAA;AACA;AAEA;EACA,YAAA;AACA;AAEA;EACA,kBAAA;EACA,SAAA;EACA,mCAAA;UAAA,2BAAA;EACA,SAAA;EACA,yBAAA;EACA,kBAAA;EACA,oBAAA;EAAA,aAAA;EACA,wBAAA;UAAA,uBAAA;EACA,yBAAA;UAAA,mBAAA;EACA,WAAA;EACA,YAAA;AACA;AAEA;EACA,yBAAA;AACA;AAEA;EACA,UAAA;AACA;AAEA;EACA,OAAA;EACA,UAAA;AACA;AAEA;EACA,mBAAA;EACA,WAAA;AACA;AAEA;EACA,kBAAA;EACA,mBAAA;UAAA,OAAA;AACA;AAEA;EACA,gBAAA;AACA;AAEA;EACA,UAAA;EACA,WAAA;EACA,yBAAA;AACA;AAEA;EACA,aAAA;EACA,4CAAA;EACA,mBAAA;EACA,6BAAA;AACA;AAEA;EACA,mBAAA;EACA,4CAAA;EACA,+BAAA;AACA;AAEA;EACA,aAAA;AACA;AAEA;EACA,aAAA;AACA;AAEA;EACA,aAAA;AACA",
      "file": "vue-horizontal-timeline-component.vue",
      "sourcesContent": ["<template>\n  <div class=\"vue-horizontal-timeline-component\" v-bind=\"$attrs\" v-on=\"$listeners\">\n    <div ref=\"container\" class=\"timeline-container\"\n        @mousewheel=\"(event)=>!mousewheelDisable&&MouseMove.handleMousewhell(event)\"\n        @mousedown=\"(event)=>MouseMove.handleMousedown(event)\"\n        @mousemove=\"(event)=>MouseMove.handleMouseMove(event)\"\n        @mouseleave=\"(event)=>MouseMove.handleMouseleave(event)\"\n        @mouseup=\"(event)=>MouseMove.handleMouseup(event)\"\n    >\n    <div v-if=\"!timelineList\" class=\"loading-mask\">\n      <div class=\"loading-spinner\">\n        <svg viewBox=\"25 25 50 50\" class=\"circular\">\n          <circle cx=\"50\" cy=\"50\" r=\"20\" fill=\"none\" class=\"path\"></circle>\n        </svg>\n      </div>\n    </div>\n    <template v-if=\"hasData\">\n      <div class=\"arrow-left\">\n        <div class=\"i-container\" :style=\"{marginTop:-gap/2+'px'}\">\n          <svg v-if=\"leftLoading\" viewBox=\"25 25 50 50\" class=\"circular small\">\n            <circle cx=\"50\" cy=\"50\" r=\"20\" fill=\"none\" class=\"path\"></circle>\n          </svg>\n          <svg v-if=\"leftArrowShow&&!leftLoading\" class=\"icon-arrow-left\" viewBox=\"0 0 1024 1024\"  width=\"32\" height=\"32\" @click=\"left\"><path d=\"M586.325333 747.52a36.565333 36.565333 0 0 1 0 52.309333 38.058667 38.058667 0 0 1-53.248 0l-266.069333-261.674666a36.565333 36.565333 0 0 1 0-52.309334l266.069333-261.674666a38.058667 38.058667 0 0 1 53.248 0 36.565333 36.565333 0 0 1 0 52.352L346.837333 512l239.488 235.52z\"></path></svg>\n        </div>\n      </div>\n      <div class=\"arrow-right\">\n        <div class=\"i-container\" :style=\"{marginTop:-gap/2+'px'}\">\n          <svg v-if=\"rightLoading\" viewBox=\"25 25 50 50\" class=\"circular small\">\n            <circle cx=\"50\" cy=\"50\" r=\"20\" fill=\"none\" class=\"path\"></circle>\n          </svg>\n          <svg  v-if=\"rightArrowShow&&!rightLoading\" class=\"icon-arrow-right\" viewBox=\"0 0 1024 1024\" width=\"32\"  height=\"32\" @click=\"right\"><path d=\"M437.674667 747.52L677.162667 512l-239.488-235.52a36.565333 36.565333 0 0 1 0-52.309333 38.058667 38.058667 0 0 1 53.248 0l266.069333 261.674666a36.565333 36.565333 0 0 1 0 52.309334l-266.069333 261.674666a38.058667 38.058667 0 0 1-53.248 0 36.565333 36.565333 0 0 1 0-52.352z\" p-id=\"1616\"></path></svg>\n        </div>\n      </div>\n      <div ref=\"timelineRef\" :class=\"{'scroll-container':true,'scroll-show':showScroll}\">\n        <div  :style=\"{height:maxItemHeight*2+gap+'px'}\" class=\"timeline-wrapper\" >\n          <div class=\"timeline\">\n            <div v-for=\"(i,index) in timelineList\" :key=\"i[uuid]\" v-inserted=\"afterInserted\"\n              :data-id=\"i[uuid]\" class=\"timeline-item\">\n              <div class=\"tail\"></div>\n              <div v-if=\"i.newMark\" :class=\"{right:i.newMark=='left'}\" class=\"divider\"></div>\n              <div :class=\"{center:i.centerNode}\" class=\"node\"></div>\n              <div :class=\"{time:true,top:getIsTop(index)}\" class=\"time\">\n                <slot name=\"time\" :item=\"i\">{{i&&i.time||''}}</slot>\n              </div>\n              <div class=\"wrapper\" >\n                <div :style=\"{top:getIsTop(index)}\"  class=\"card\">\n\n                  <div  style=\"flex:1;\">\n                    <slot :item=\"i\"></slot>\n                  </div>\n\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </template>\n\n    <template v-if=\"timelineList&&!timelineList.length\">\n      <p class=\"no-data\">\n        <svg  viewBox=\"0 0 1024 1024\" width=\"30\" height=\"30\"><path d=\"M512 20.48a491.52 491.52 0 1 0 491.52 491.52A491.52 491.52 0 0 0 512 20.48z m0 931.84A440.32 440.32 0 1 1 952.32 512 440.7296 440.7296 0 0 1 512 952.32z\" p-id=\"925\"></path><path d=\"M611.9424 708.608c-8.8064 6.5536-70.4512 70.656-97.0752 71.0656-7.9872 0-11.8784-6.3488-11.8784-18.8416q0-37.888 61.44-247.3984a858.9312 858.9312 0 0 0 37.888-141.9264 24.7808 24.7808 0 0 0-8.3968-20.48 49.7664 49.7664 0 0 0-29.4912-6.5536c-54.4768 0-117.76 37.888-186.9824 114.688-20.48 22.9376 14.1312 31.1296 26.0096 20.48C409.6 472.6784 471.04 409.6 491.52 409.6c9.4208 0 14.1312 4.3008 14.1312 13.1072a76.3904 76.3904 0 0 1-4.7104 22.528q-87.6544 286.72-87.6544 352.6656a59.392 59.392 0 0 0 10.0352 33.1776 34.816 34.816 0 0 0 31.3344 15.36 134.9632 134.9632 0 0 0 63.8976-21.9136 806.0928 806.0928 0 0 0 113.664-94.0032c19.2512-20.0704-7.7824-31.5392-20.2752-21.9136z\" p-id=\"926\"></path><path d=\"M595.461331 273.348307a43.4176 49.3568 15.71 1 0 26.72853-95.026104 43.4176 49.3568 15.71 1 0-26.72853 95.026104Z\"></path></svg> 暂无数据</p>\n    </template>\n    </div>\n  </div>\n</template>\n\n<script>\n  import MouseMove from './MouseMove'\n  export default {\n    name: 'VueHorizontalTimelineComponent',\n    directives: {\n      inserted: {\n        inserted: (el, binding) => {\n          binding.value && binding.value(el.offsetHeight)\n        },\n        mounted: (el, binding) => {\n          binding.value && binding.value(el.offsetHeight)\n        },\n        update: (el, binding) => {\n          binding.value && binding.value(el.offsetHeight)\n        },\n        updated : (el, binding) => {\n          binding.value && binding.value(el.offsetHeight)\n        }\n      }\n    },\n    props: {\n      /**\n       * 初次加载时定位的索引位置,优先级低于positionId\n      */\n      positionIndex: {\n        type: Number,\n        default: null\n      },\n      /**\n       * 初次加载时定位的id位置,优先级高于positionIndex\n      */\n      positionId: {\n        type: Number,\n        default: null\n      },\n      /**\n       * 显示的数据\n       */\n      timelineList: {\n        type: Array,\n        default: null\n      },\n      /**\n       * 是否显示横向滚动轴\n      */\n      showScroll: {\n        type: Boolean,\n        default: true\n      },\n      /**\n       * 数据项唯一标识符字段\n       */\n      uuid: {\n        type: String,\n        default: 'id'\n      },\n      /**\n       * 左侧数据加载完毕\n       */\n      leftComplete: {\n        type: Boolean,\n        default: false\n      },\n      /**\n       * 右侧数据加载完毕\n       */\n      rightComplete: {\n        type: Boolean,\n        default: false\n      },\n      /**\n       * 是否显示左侧箭头\n       */\n      leftArrowShow: {\n        type: Boolean,\n        default: true\n      },\n      /**\n       * 是否显示右侧箭头\n       */\n      rightArrowShow: {\n        type: Boolean,\n        default: true\n      },\n      /**\n       * 底部空隙,单位px\n       */\n      gap: {\n        type: Number,\n        default: 25,\n        validator: function (value) {\n          return value > 0\n        }\n      },\n      /**\n       * 是否禁用滚轮\n       */\n      mousewheelDisable: {\n        type: Boolean,\n        default: false\n      }\n    },\n    data() {\n      return {\n        MouseMove,\n        maxScrollLeft: 0,\n        rightLoading: false,\n        leftLoading: false,\n        maxItemHeight: 0,\n        smoothScrolling: false\n      }\n    },\n    computed: {\n      offset() {\n        return this.MouseMove.offset\n      },\n      hasData() {\n        return this.timelineList && this.timelineList.length\n      }\n    },\n    watch: {\n      offset(val) {\n        this.hasData && this.watchOffset(val.value)\n      },\n      rightLoading: 'handleRightLoad',\n      leftLoading: 'handleLeftLoad',\n      timelineList: {\n        handler(val, oldval) {\n          this.setMaxScrollLeft()\n          if (!oldval && val) {\n            if (this.positionId != null) {\n              return this.positionById(this.positionId)\n            }\n            if (this.positionIndex != null) {\n              this.positionByIndex(this.positionIndex)\n            }\n          }\n\n        }, deep: true\n      }\n    },\n    mounted() {\n      this.setMaxScrollLeft()\n    },\n    methods: {\n      getIsTop(index) {\n        if (this.timelineList.length % 2) {\n          return index % 2 ? 'calc(100% + 30px)' : 0\n        } else {\n          return index % 2 ? 0 : 'calc(100% + 30px)'\n        }\n      },\n      afterInserted(height) {\n        this.maxItemHeight = Math.max(height, this.maxItemHeight)\n      },\n      setMaxScrollLeft() {\n        this.$nextTick(() => {\n          let timelineRef = this.$refs.timelineRef\n          if (!timelineRef) return\n          this.maxScrollLeft = timelineRef.scrollWidth - timelineRef.offsetWidth\n        })\n      },\n      smoothScroll(val, amplitude) {\n        this.smoothScrolling = true\n        let timelineRef = this.$refs.timelineRef\n        let requestAnimationFrame = window.requestAnimationFrame\n        let def = timelineRef.scrollLeft\n        let scrollLeft = (val - def) / Math.abs((val - def)) * amplitude\n        if (scrollLeft < 0) {\n          scrollLeft = Math.floor(scrollLeft)\n        } else {\n          scrollLeft = Math.ceil(scrollLeft)\n        }\n        if (def + scrollLeft <= 0) {\n          timelineRef.scrollLeft = 0\n          this.smoothScrolling = false\n          return\n        }\n        if (def + scrollLeft >= this.maxScrollLeft) {\n          timelineRef.scrollLeft = this.maxScrollLeft\n          return this.smoothScrolling = false\n        }\n        timelineRef.scrollLeft += scrollLeft\n        return requestAnimationFrame(() => this.smoothScroll(val, amplitude))\n      },\n      left() {\n        let timelineRef = this.$refs.timelineRef\n        if (this.smoothScrolling || this.leftLoading || this.rightLoading) return\n        if (timelineRef.scrollLeft == 0) {\n          !this.leftComplete && (this.leftLoading = true)\n        } else {\n          this.smoothScroll(0, timelineRef.scrollLeft / 50)\n        }\n      },\n      right() {\n        if (this.smoothScrolling || this.leftLoading || this.rightLoading) return\n        let timelineRef = this.$refs.timelineRef\n        if (this.maxScrollLeft == timelineRef.scrollLeft) {\n          !this.rightComplete && (this.rightLoading = true)\n        } else {\n          this.smoothScroll(this.maxScrollLeft, (this.maxScrollLeft - (timelineRef.scrollLeft || 0)) / 50)\n        }\n      },\n      watchOffset(val) {\n        if (this.rightLoading || this.leftLoading) return\n        let timelineRef = this.$refs.timelineRef\n        let scrollLeft = timelineRef.scrollLeft\n        scrollLeft += -val\n        if (scrollLeft < 0) scrollLeft = 0\n        if (scrollLeft > this.maxScrollLeft) scrollLeft = this.maxScrollLeft\n        if (!this.rightComplete && val < 0 && scrollLeft >= this.maxScrollLeft) {\n          this.rightLoading = true\n        }\n        if (!this.leftComplete && val > 0 && scrollLeft <= 0) {\n          this.leftLoading = true\n        }\n        timelineRef.scrollLeft = scrollLeft\n      },\n      handleRightLoad(val) {\n        if (val) {\n          const length = this.timelineList.length\n          new Promise((resolve) => {\n            /**\n             * @property {function} resolve - 右侧数据加载中\n             */\n            this.$emit('right-loading', resolve)\n          }).then(() => {\n            const add = this.timelineList.length - length\n            if (add > 0) {\n              this.timelineList[0] && this.positioning(length, null, true)\n            }\n            this.rightLoading = false\n          })\n          MouseMove.start = false\n        }\n      },\n      handleLeftLoad(val) {\n        if (val) {\n          const length = this.timelineList.length\n          new Promise((resolve) => {\n            /**\n            * @property {function} resolve - 左侧数据加载中\n            */\n            this.$emit('left-loading', resolve)\n          }).then(() => {\n            const add = this.timelineList.length - length\n            if (add > 0) {\n              this.timelineList[0] && this.positioning(add - 1, true)\n            }\n            this.leftLoading = false\n          })\n          MouseMove.start = false\n        }\n      },\n      /**\n       * 定位到指定id项\n       * @public\n       */\n      positionById(id) {\n        this.$nextTick(() => {\n          if (!id) return console.warn('id不能为空')\n          let doms = this.$refs.timelineRef && this.$refs.timelineRef.querySelectorAll('.timeline-item')\n          doms && [].forEach.call(doms, (dom) => {\n            if (dom.dataset.id == id) {\n              dom.scrollIntoView && dom.scrollIntoView({\n                inline: \"center\",\n                block: \"center\"\n              })\n            }\n          })\n        })\n      },\n      /**\n       * 定位到指定索引项\n       * @public\n       */\n      positionByIndex(index) {\n        this.timelineList[index] && this.positionById(this.timelineList[index][this.uuid])\n      },\n      positioning(index, leftLoading, rightLoading) {\n        this.$nextTick(() => {\n          let doms = this.$refs.timelineRef && this.$refs.timelineRef.querySelectorAll('.timeline-item')\n          const dom = doms[index]\n          dom.scrollIntoView && dom.scrollIntoView({\n            inline: leftLoading ? \"start\" :\n              (rightLoading ? 'end' : \"center\"),\n            block: \"center\"\n          })\n        })\n      }\n    }\n  }\n</script>\n\n<style scoped>\n.loading-mask {\n  position: absolute;\n  z-index: 2000;\n  background-color: rgba(255, 255, 255, 0.9);\n  margin: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transition: opacity 0.3s;\n}\n\n.loading-mask .loading-spinner {\n  top: 50%;\n  margin-top: -21px;\n  width: 100%;\n  text-align: center;\n  position: absolute;\n}\n\n@keyframes loading-rotate {\n  100% {\n    transform: rotate(1turn);\n  }\n}\n\n.circular {\n  height: 42px;\n  width: 42px;\n  animation: loading-rotate 2s linear infinite;\n}\n\n.circular.small {\n  height: 22px;\n  width: 22px;\n}\n\n.circular .path {\n  animation: loading-dash 1.5s ease-in-out infinite;\n  stroke-dasharray: 90, 150;\n  stroke-dashoffset: 0;\n  stroke-width: 2;\n  stroke: #409eff;\n  stroke-linecap: round;\n}\n\n.no-data {\n  font-size: 26px;\n  text-align: center;\n  margin: 0;\n  padding: 1em 0;\n}\n\n.no-data svg {\n  vertical-align: sub;\n}\n\n.card {\n  border: 1px solid #ebeef5;\n  background-color: #fff;\n  color: #303133;\n  transition: 0.3s;\n  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  height: 100%;\n  width: 100%;\n}\n\n.filter-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.timeline-container {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-height: 60px;\n  position: relative !important;\n  padding: 0 40px;\n}\n\n.timeline-container .arrow-right,\n.timeline-container .arrow-left {\n  outline: none;\n  padding: 0;\n  margin: 0;\n  height: 100%;\n  width: 36px;\n  transition: 0.3s;\n  color: #aeaeae;\n  position: absolute;\n  top: 50%;\n  z-index: 10;\n  transform: translateY(-50%);\n}\n\n.timeline-container .arrow-right .i-container,\n.timeline-container .arrow-left .i-container {\n  position: absolute;\n  font-size: 0;\n  top: 50%;\n  transform: translateY(-50%);\n}\n\n.timeline-container .arrow-right .i-container i,\n.timeline-container .arrow-left .i-container i {\n  font-size: 50px;\n}\n\n.timeline-container .arrow-right:hover i,\n.timeline-container .arrow-left:hover i {\n  color: #999;\n}\n\n.timeline-container .arrow-left {\n  left: 4px;\n}\n\n.timeline-container .arrow-left .i-container {\n  left: 0;\n}\n\n.timeline-container .arrow-left .i-container .icon-arrow-left {\n  margin-left: -15px;\n  cursor: pointer;\n}\n\n.timeline-container .arrow-left .i-container .icon-arrow-left:hover path {\n  fill: #5cb6ff;\n}\n\n.timeline-container .arrow-right {\n  right: 4px;\n}\n\n.timeline-container .arrow-right .i-container {\n  right: 0;\n}\n\n.timeline-container .arrow-right .i-container .icon-arrow-right {\n  margin-right: -15px;\n  cursor: pointer;\n}\n\n.timeline-container .arrow-right .i-container .icon-arrow-right:hover path {\n  fill: #5cb6ff;\n}\n\n.timeline-wrapper {\n  user-select: none;\n  position: relative;\n}\n\n.timeline {\n  display: flex;\n  flex-wrap: nowrap;\n  margin: 0;\n  width: 100%;\n  font-size: 14px;\n  list-style: none;\n  padding-top: 10px;\n}\n\n.timeline .timeline-item {\n  position: relative;\n  display: inline-flex;\n  padding: 0 8px;\n}\n\n.timeline .timeline-item .tail {\n  position: absolute;\n  bottom: 5px;\n  right: 0;\n  width: 100%;\n  border-top: 2px solid #e4e7ed;\n}\n\n.timeline .timeline-item .divider {\n  position: absolute;\n  width: 1px;\n  height: 200%;\n  left: 0;\n  top: 0;\n  border-right: 1px dashed #e4e7ed;\n}\n\n.timeline .timeline-item .divider.right {\n  left: initial;\n  right: 0;\n}\n\n.timeline .timeline-item .link {\n  position: absolute;\n  bottom: 5px;\n  left: 6px;\n  transform-origin: 0 0;\n  transform: rotate(-45deg);\n  width: 21px;\n  border-top: 1px solid #e4e7ed;\n}\n\n.timeline .timeline-item .time {\n  position: absolute;\n  bottom: -30px;\n  width: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n  color: #909399;\n  line-height: 1.3;\n  font-size: 13px;\n  text-align: center;\n}\n\n.timeline .timeline-item .time.top {\n  bottom: 30px;\n}\n\n.timeline .timeline-item .node {\n  position: absolute;\n  bottom: 0;\n  transform: translateX(-50%);\n  left: 50%;\n  background-color: #e4e7ed;\n  border-radius: 50%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 12px;\n  height: 12px;\n}\n\n.timeline .timeline-item .node.center {\n  background-color: #74f5dd;\n}\n\n.timeline .timeline-item:first-child .tail {\n  width: 50%;\n}\n\n.timeline .timeline-item:last-child .tail {\n  left: 0;\n  width: 50%;\n}\n\n.timeline .timeline-item .wrapper {\n  margin-bottom: 20px;\n  width: 100%;\n}\n\n.scroll-container {\n  overflow-x: hidden;\n  flex: 1;\n}\n\n.scroll-container.scroll-show {\n  overflow-x: auto;\n}\n\n.scroll-container::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n  background-color: #f5f5f5;\n}\n\n.scroll-container::-webkit-scrollbar-track {\n  display: none;\n  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);\n  border-radius: 10px;\n  background-color: transparent;\n}\n\n.scroll-container::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);\n  background: rgba(0, 0, 0, 0.16);\n}\n\n.scroll-container::-webkit-scrollbar-track-piece {\n  display: none;\n}\n\n.scroll-container::-webkit-scrollbar-corner {\n  display: none;\n}\n\n.scroll-container::-webkit-scrollbar-button {\n  display: none;\n}\n</style>\n"]
    },
    media: undefined
  });
};
/* scoped */
var __vue_scope_id__ = "data-v-7855e68a";
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject SSR */

var Component = normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

// Import vue component

// `Vue.use` automatically prevents you from using
// the same plugin more than once,
// so calling it multiple times on the same plugin
// will install the plugin only once
Component.install = function (Vue) {
  Vue.component(Component.name, Component);
};

// To auto-install when vue is found
var GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(Component);
}

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default Component;
