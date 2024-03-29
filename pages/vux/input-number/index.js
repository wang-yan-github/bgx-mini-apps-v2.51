import baseComponent from '../helpers/baseComponent'
import classNames from '../helpers/classNames'

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1

const toNumberWhenUserInput = (num) => {
  if (/\.\d*0$/.test(num) || num.length > 16) {
    return num
  }

  if (isNaN(num)) {
    return num
  }

  return Number(num)
}

const getValidValue = (value, min, max) => {
  let val = parseFloat(value)

  if (isNaN(val)) {
    return value
  }

  if (val < min) {
    val = min
  }

  if (val > max) {
    val = max
  }

  return val
}

baseComponent({
  externalClasses: ['wux-sub-class', 'wux-input-class', 'wux-add-class'],
  properties: {
    prefixCls: {
      type: String,
      value: 'wux-input-number',
    },
    shape: {
      type: String,
      value: 'square',
    },
    min: {
      type: Number,
      value: -MAX_SAFE_INTEGER,
    },
    max: {
      type: Number,
      value: MAX_SAFE_INTEGER,
    },
    step: {
      type: Number,
      value: 1,
    },
    defaultValue: {
      type: Number,
      value: 0,
    },
    value: {
      type: Number,
      value: 0,
      observer(newVal) {
        if (this.data.controlled) {
          this.updated(newVal)
        }
      },
    },
    disabled: {
      type: Boolean,
      value: true,
    },
    longpress: {
      type: Boolean,
      value: false,
    },
    color: {
      type: String,
      value: 'balanced',
    },
    controlled: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    inputValue: 0,
    disabledMin: false,
    disabledMax: false,
  },
  computed: {
    classes() {
      const { prefixCls, shape, color, disabledMin, disabledMax } = this.data
      const wrap = classNames(prefixCls, {
        [`${prefixCls}--${shape}`]: shape,
      })
      const sub = classNames(`${prefixCls}__selector`, {
        [`${prefixCls}__selector--sub`]: true,
        [`${prefixCls}__selector--${color}`]: color,
        [`${prefixCls}__selector--disabled`]: disabledMin,
      })
      const add = classNames(`${prefixCls}__selector`, {
        [`${prefixCls}__selector--add`]: true,
        [`${prefixCls}__selector--${color}`]: color,
        [`${prefixCls}__selector--disabled`]: disabledMax,
      })
      const icon = `${prefixCls}__icon`
      const input = `${prefixCls}__input`

      return {
        wrap,
        sub,
        add,
        icon,
        input,
      }
    },
  },
  methods: {
    /**
     * 更新值
     */
    updated(value, condition = true, trigger = false) {
      const { min, max } = this.data
      const inputValue = getValidValue(value, min, max)
      const disabledMin = inputValue <= min
      const disabledMax = inputValue >= max

      // 更新数值，判断最小或最大值禁用 sub 或 add 按钮
      if (condition) {
        this.setData({
          inputValue,
          disabledMin,
          disabledMax,
        })
      }

      // 触发事件
      if (trigger) {
        this.triggerEvent('change', { value: inputValue })
      }
    },
    /**
     * 数字计算函数
     */
    calculation(type, meta) {
      const { disabledMax, disabledMin, inputValue, step, longpress, controlled } = this.data

      // add
      if (type === 'add') {
        if (disabledMax) return false
        this.updated(inputValue + step, !controlled, true)
      }

      // sub
      if (type === 'sub') {
        if (disabledMin) return false
        this.updated(inputValue - step, !controlled, true)
      }

      // longpress
      if (longpress && meta) {
        this.timeout = setTimeout(() => this.calculation(type, meta), 100)
      }
    },
    /**
     * 当键盘输入时，触发 input 事件
     */
    onInput(e) {
      this.clearInputTimer()
      this.inputTime = setTimeout(() => {
        const value = toNumberWhenUserInput(e.detail.value)
        this.updated(value, !this.data.controlled)
        this.triggerEvent('change', { value })
      }, 300)
    },
    /**
     * 输入框聚焦时触发
     */
    onFocus(e) {
      this.triggerEvent('focus', e.detail)
    },
    /**
     * 输入框失去焦点时触发
     */
    onBlur(e) {
      // always set input value same as value
      this.setData({
        inputValue: this.data.inputValue,
      })

      this.triggerEvent('blur', e.detail)
    },
    /**
     * 手指触摸后，超过350ms再离开
     */
    onLongpress(e) {
      const { type } = e.currentTarget.dataset
      const { longpress } = this.data
      if (longpress) {
        this.calculation(type, true)
      }
    },
    /**
     * 手指触摸后马上离开
     */
    onTap(e) {
      const { type } = e.currentTarget.dataset
      const { longpress } = this.data
      if (!longpress || longpress && !this.timeout) {
        this.calculation(type, false)
      }
    },
    /**
     * 	手指触摸动作结束
     */
    onTouchEnd() {
      this.clearTimer()
    },
    /**
     * 手指触摸动作被打断，如来电提醒，弹窗
     */
    onTouchCancel() {
      this.clearTimer()
    },
    /**
     * 清除长按的定时器
     */
    clearTimer() {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
    },
    /**
     * 清除输入框的定时器
     */
    clearInputTimer() {
      if (this.inputTime) {
        clearTimeout(this.inputTime)
        this.inputTime = null
      }
    },
  },
  attached() {
    const { defaultValue, value, controlled } = this.data
    const inputValue = controlled ? value : defaultValue

    this.updated(inputValue)
  },
  detached() {
    this.clearTimer()
    this.clearInputTimer()
  },
})