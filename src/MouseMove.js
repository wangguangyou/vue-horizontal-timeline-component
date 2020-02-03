class MouseMove {
  constructor() {
    this.start = false
    this.x = 0
    this.offset = {
      value: 0
    }
    this.startx = 0
  }
  handleMousedown(event) {
    if (!event.button) {
      this.start = true
      const {
        pageX
      } = event
      this.startx = pageX
      this.x = pageX
    }
  }
  handleMousewhell(event) {
    const {
      wheelDelta,
    } = event
    this.offset = {
      value: wheelDelta / 2
    }
    if (event.preventDefault) {
      event.preventDefault()
      return false
    }
  }
  handleMouseMove(event) {
    if (!this.start) return
    const {
      pageX
    } = event
    this.offset = {
      value: pageX - this.x
    }
    this.x = pageX
    if (event.preventDefault) {
      event.preventDefault()
      return false
    }
  }
  handleMouseup() {
    this.start = false
  }
  handleMouseleave() {
    this.start = false
  }
}
export default new MouseMove()
