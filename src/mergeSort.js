import Container from './container'

export default class MergeSort {
  constructor (element, numbers) {
    this.container = new Container(element, numbers, true)
    this.numbers = numbers
    this.oldNumbers = numbers.slice()
    this.stepStack = null

    this.isFinised = false

    this.temp = null
    this.array = []
    this.i1 = null
    this.ii1 = null
    this.j1 = null
    this.i2 = null
    this.ii2 = null
    this.j2 = null
    this.flag1 = false
    this.start = null
    this.end = null
    this.timer = null

    this.selectedColor = '#27AE60'

    this.isSwap = false
    this.swapIndex1 = null
    this.swapIndex2 = null
    this.isMoveDown = false
    this.moveDownIndex1 = null
    this.moveDownIndex2 = null
    this.isMoveUp = false
    this.moveUpStart = null
    this.moveUpEnd = null
    this.isFinished = false
  }
  init () {
    this.container.init()
    var stack = []
    function stackInit (start, end) {
      stack.push({start: start, end: end})
      if (end - start <= 1) {
        return
      }
      var mid = Math.floor((end + start) / 2)
      stackInit(mid + 1, end)
      stackInit(start, mid)
    }
    this.stepStack = stack
    stackInit(0, this.numbers.length - 1)
  }
  reset () {
    this.container.reset()
    clearTimeout(this.timer)
    this.array = []
    this.flag1 = false
    this.isSwap = false
    this.isMoveDown = false
    this.isMoveUp = false
    this.isFinished = false
    this.container.numbers = this.oldNumbers
    this.init()
  }
  pause () {
    clearTimeout(this.timer)
  }
  next () {
    if (!this.isFinised) {
      if (this.flag1) {
        if (this.i1 <= this.j1 && this.i2 <= this.j2) {
          if (this.numbers[this.i1] > this.numbers[this.i2]) {
            this.array.push(this.numbers[this.i2])
            this.isMoveDown = true
            this.moveDownIndex1 = this.i2
            this.moveDownIndex2 = this.ii1 + this.array.length - 1
            this.i2++
          } else {
            this.array.push(this.numbers[this.i1])
            this.isMoveDown = true
            this.moveDownIndex1 = this.i1
            this.moveDownIndex2 = this.ii1 + this.array.length - 1
            this.i1++
          }
        } else if (this.i1 > this.j1 && this.i2 > this.j2) {
          var j = 0
          for (let i = this.ii1; i <= this.j2; i++) {
            this.numbers[i] = this.array[j]
            j++
          }
          this.array.length = 0
          this.isMoveUp = true
          this.moveUpStart = this.ii1
          this.moveUpEnd = this.j2
          if (this.stepStack.length === 0) {
            this.isFinished = true
          }
          this.flag1 = false
        } else {
          if (this.i1 <= this.j1) {
            this.array.push(this.numbers[this.i1])
            this.isMoveDown = true
            this.moveDownIndex1 = this.i1
            this.moveDownIndex2 = this.ii1 + this.array.length - 1
            this.i1++
          } else {
            this.array.push(this.numbers[this.i2])
            this.isMoveDown = true
            this.moveDownIndex1 = this.i2
            this.moveDownIndex2 = this.ii1 + this.array.length - 1
            this.i2++
          }
        }
      } else {
        var obj = this.stepStack.pop()
        this.start = obj.start
        this.end = obj.end
        if (obj.end - obj.start === 1) {
          if (this.numbers[obj.start] > this.numbers[obj.end]) {
            this.isSwap = true
            this.swapIndex1 = obj.start
            this.swapIndex2 = obj.end
            this.temp = this.numbers[obj.start]
            this.numbers[obj.start] = this.numbers[obj.end]
            this.numbers[obj.end] = this.temp
          }
        } else if (obj.end - obj.start === 0) {
          if (this.numbers[obj.start] > this.numbers[obj.end]) {
          }
        } else {
          var mid = Math.floor((obj.end + obj.start) / 2)
          this.i1 = obj.start
          this.ii1 = obj.start
          this.j1 = mid
          this.i2 = mid + 1
          this.ii2 = mid + 1
          this.j2 = obj.end
          this.flag1 = true
        }
      }
    }
  }
  run () {
    if (!this.isFinished) {
      this.next()
      this.container.clearColumnColor()
      // 着色操作元素
      for (let i = this.start; i <= this.end; i++) {
        this.container.columnColor(i, this.selectedColor)
      }
      if (this.isSwap) {
        this.isSwap = false
        this.container.swap(this.swapIndex1, this.swapIndex2)
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.run()
        }, this.container.swapTime)
      } else if (this.isMoveDown) {
        this.isMoveDown = false
        this.container.moveDown(this.moveDownIndex1, this.moveDownIndex2)
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.run()
        }, this.container.moveDownTime)
      } else if (this.isMoveUp) {
        this.isMoveUp = false
        this.container.moveUpGroup(this.moveUpStart, this.moveUpEnd)
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.run()
        }, this.container.moveUpTime)
      } else {
        this.run()
      }
    }
  }
}
