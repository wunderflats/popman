'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const Popover = require('../dist')

class ClickButton extends React.Component {
  static propTypes = {
    preferPosition: React.PropTypes.object
  }

  constructor () {
    super()
    this.state = { open: false }
    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({ open: !this.state.open })
  }

  render () {
    const { open } = this.state

    const body = (
      <button onClick={this.toggle}>
        {open ? 'hide' : 'show'}
      </button>
    )

    return (
      <Popover {...this.props} open={open} around={body}>
        <span>hello mr. popover</span>
      </Popover>
    )
  }
}

class Example extends React.Component {
  render () {
    return (
      <div>
        <h1>Popover</h1>
        <h2>top left</h2>
        <ClickButton position={{ y: 'top', x: 'left' }} />
        <h2>top right</h2>
        <ClickButton position={{ y: 'top', x: 'right' }} />
        <h2>top center</h2>
        <ClickButton position={{ y: 'top', x: 'center' }} />

        <h2>bottom left</h2>
        <ClickButton position={{ y: 'bottom', x: 'left' }} />
        <h2>bottom right</h2>
        <ClickButton position={{ y: 'bottom', x: 'right' }} />
        <h2>bottom center</h2>
        <ClickButton position={{ y: 'bottom', x: 'center' }} />

        <h2>center left</h2>
        <ClickButton position={{ y: 'center', x: 'left' }} />
        <h2>center right</h2>
        <ClickButton position={{ y: 'center', x: 'right' }} />
        <h2>center center</h2>
        <ClickButton position={{ y: 'center', x: 'center' }} />

        <h2>constrainTo 'scrollParent'</h2>
        <h3>scroll x:</h3>
        <div style={{ overflow: 'scroll', border: '1px solid black' }}>
          <div className='scroll-x'>
            <span style={{ marginRight: 200 }}>
              <ClickButton constrainTo='scrollParent' constrainX />
            </span>
          </div>
        </div>
        <h3>scroll x:</h3>
        <div style={{ overflow: 'scroll', border: '1px solid black' }}>
          <div className='scroll-x'>
            <span style={{ marginLeft: 400 }}>
              <ClickButton constrainTo='scrollParent' constrainX />
            </span>
          </div>
        </div>
        <h3>scroll y:</h3>
        <div style={{ overflow: 'scroll', border: '1px solid black', height: '6em' }}>
          <div className='scroll-y'>
            <div style={{ marginBottom: 200 }}>
              <ClickButton constrainTo='scrollParent' constrainY />
            </div>
          </div>
        </div>
        <h3>scroll y:</h3>
        <div style={{ overflow: 'scroll', border: '1px solid black', height: '6em' }}>
          <div className='scroll-y'>
            <div style={{ marginTop: 400 }}>
              <ClickButton constrainTo='scrollParent' constrainY />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Example />, document.querySelector('#root'))
