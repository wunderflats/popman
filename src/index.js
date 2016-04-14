'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const scrollparent = require('scrollparent')

class Popover extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    around: React.PropTypes.node.isRequired,
    open: React.PropTypes.bool.isRequired,
    constrainTo: React.PropTypes.string,
    constrainX: React.PropTypes.bool,
    constrainY: React.PropTypes.bool,
    position: React.PropTypes.object
  }

  constructor () {
    super()
    this.onResize = this.onResize.bind(this)
  }

  componentDidMount () {
    const domNode = ReactDOM.findDOMNode(this)
    this.scrollParent = scrollparent(domNode)

    this.popover = document.createElement('div')
    this.popover.className = '_Popover'
    this._detachedContainer = document.createElement('div')
    this._detachedContainer.style.display = 'inline-block'
    this._detachedContainer.style.visibility = 'hidden'
    this._detachedContainer.style.position = 'absolute'
    this._detachedContainer.style.top = 0
    this._detachedContainer.style.left = 0
    this._detachedContainer.className = 'Popover' +
      (this.props.className ? ' ' + this.props.className : '')
    document.body.appendChild(this.popover)
    document.body.appendChild(this._detachedContainer)
    this._renderPopover()

    if (this.props.open) {
      window.addEventListener('resize', this.onResize)
      if (this.scrollParent) {
        this.scrollParent.addEventListener('scroll', this.onResize)
      }
    }
  }

  componentWillReceiveProps (props) {
    // if we are now opening the popover
    if (!this.props.open && props.open) {
      window.addEventListener('resize', this.onResize)
      if (this.scrollParent) {
        this.scrollParent.addEventListener('scroll', this.onResize)
      }
    }

    // if we are now hiding the popover
    if (this.props.open && !props.open) {
      window.removeEventListener('resize', this.onResize)
      if (this.scrollParent) {
        this.scrollParent.removeEventListener('scroll', this.onResize)
      }
    }
  }

  componentDidUpdate () {
    this._renderPopover()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize)
    if (this.scrollParent) {
      this.scrollParent.removeEventListener('scroll', this.onResize)
    }
    if (this.popover.parentNode !== document.body) return
    ReactDOM.unmountComponentAtNode(this.popover)
    document.body.removeChild(this.popover)
    ReactDOM.unmountComponentAtNode(this._detachedContainer)
    document.body.removeChild(this._detachedContainer)
  }

  onResize () {
    this.forceUpdate()
  }

  getViewportBounds () {
    const { x, y } = scrollPosition()
    return {
      left: x,
      right: x + window.innerWidth,
      top: y,
      bottom: y + window.innerHeight
    }
  }

  getAnchorBounds () {
    return this.getBounds(this.anchor)
  }

  getBounds (domNode) {
    const bounds = domNode.getBoundingClientRect()
    const viewport = this.getViewportBounds()

    const a = {
      left: bounds.left + viewport.left,
      right: bounds.right + viewport.left,
      top: bounds.top + viewport.top,
      bottom: bounds.bottom + viewport.top
    }

    return a
  }

  getBodySize () {
    return {
      width: this._detachedContainer.offsetWidth,
      height: this._detachedContainer.offsetHeight
    }
  }

  calculatePosition () {
    const docbounds = this.getViewportBounds()
    const rect = this.getAnchorBounds()
    const body = this.getBodySize()

    if (this.props.position) return this.props.position

    const position = { x: 'left', y: 'bottom' }

    if (rect.bottom + body.height >= docbounds.bottom) {
      position.y = 'top'
    }

    if (rect.right + body.width >= docbounds.right) {
      position.x = 'right'
    }

    const values = this.calculatePositionValues(position)

    if (values.left < 0) {
      position.x = 'left'
    }

    return position
  }

  calculatePositionValues (position) {
    const { constrainTo, constrainX, constrainY } = this.props
    const docbounds = this.getViewportBounds()
    const bounds = this.getAnchorBounds()
    const body = this.getBodySize()
    const values = {}

    if (position.y === 'bottom') {
      values.top = bounds.bottom
    } else if (position.y === 'center') {
      const anchorHeight = bounds.bottom - bounds.top
      const anchorCenter = bounds.top + anchorHeight / 2
      values.top = anchorCenter - body.height / 2
    } else {
      values.top = bounds.top - body.height
    }

    if (position.x === 'left') {
      values.left = bounds.left
    } else if (position.x === 'center') {
      const anchorWidth = bounds.right - bounds.left
      const anchorCenter = bounds.left + anchorWidth / 2
      values.left = anchorCenter - body.width / 2
    } else {
      values.left = bounds.right - body.width
    }

    if (values.left + body.width > docbounds.right) {
      values.left = docbounds.right - body.width
    }

    if (constrainTo === 'scrollParent') {
      const scrollBounds = this.getBounds(this.scrollParent)
      if (constrainX && values.left < scrollBounds.left) {
        values.left = scrollBounds.left
      } else if (constrainX && values.left + body.width > scrollBounds.right) {
        values.left = scrollBounds.right - body.width
      }

      if (constrainY && values.top < scrollBounds.top) {
        values.top = scrollBounds.top
      } else if (constrainY && values.top + body.height > scrollBounds.bottom) {
        values.top = scrollBounds.bottom - body.height
      }
    }

    return values
  }

  calculateStyle (position, values) {
    const style = { position: 'absolute', zIndex: '201' }
    return Object.assign(style, values || this.calculatePositionValues(position))
  }

  _renderPopover () {
    this._renderDetached()
    this.anchor = ReactDOM.findDOMNode(this)
    const position = this.calculatePosition(this.anchor)
    const style = this.calculateStyle(position)

    const className = 'Popover' +
      (' Popover--position-' + position.y + '-' + position.x) +
      (this.props.className ? ' ' + this.props.className : '')

    if (!this.props.open) {
      ReactDOM.render((
        <div style={{ display: 'none' }} className={className} />
      ), this.popover)
      return
    }

    ReactDOM.render((
      <div style={style} className={className}>{this.props.children}</div>
    ), this.popover)
  }

  _renderDetached () {
    ReactDOM.render(this.props.children, this._detachedContainer)
  }

  render () {
    return this.props.around
  }
}

function scrollPosition () {
  const x = window.pageXOffset || document.documentElement.scrollLeft
  const y = window.pageYOffset || document.documentElement.scrollTop
  return { x, y }
}

module.exports = Popover
