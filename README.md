# popman

Unopinionated and unstyled popover component for React. [View example](https://cdn.rawgit.com/wunderflats/popman/master/examples/index.html).

## Benefits

* Unopinionated
* Unstyled
* Simple API
* Automatic positioning
* Renders popovers on page body, so it **works inside containers with `overflow: hidden`**

## Installation

```
npm install popman
```

## Usage

### Example

```javascript
const Popover = require('popman')

<Popover open around={<div>Hello</div>}>
  Hello, i am the popover content
</Popover>
```

More examples can be found in the [examples](https://github.com/wunderflats/popman/tree/master/examples) directory.

### props

#### open (`bool`)

Show/hide the popover.

#### className (`string`)

Custom base class name for your popover. Defaults to `Popman`. popman adds the following css class to the container of the popover (`Popman` is replaced by your own `className` if you specified it):

* `.Popman`
* `.Popman--position-${y}-${x}` (`.Popman--position-top-left` | `.Popman--position-top-right` | `.Popman--position-top-center` | `.Popman--position-bottom-left` | `.Popman--position-bottom-right` | `.Popman--position-bottom-center` | `.Popman--position-center-left` | `.Popman--position-center-right` | `.Popman--position-center-center`)

#### children (`node`)

The content of the popover.

#### around (`node`)

The React component against which the popover is positioned.

#### position (`{ y: 'top'|'bottom'|'center', x: 'left'|'right'|'center' }`)

Manually set the position of the popover.

#### constrainTo: 'scrollParent'

Make sure the tooltip stays within the bounds of its scroll parent. To constrain `x` and `y`, set `constrainX (bool)` and `constrainY (bool)` props.

### Styling

To give your popovers padding, a white background and a box shadow. Also give some spacing to the anchor element (`margin`).

```css
.Popover {
  padding: .25rem .5rem;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, .2);
  background: white;
}

.Popover--position-bottom-left,
.Popover--position-bottom-right,
.Popover--position-bottom-center {
  margin-top: .25rem;
}

.Popover--position-top-left,
.Popover--position-top-right,
.Popover--position-top-center {
  margin-top: -.25rem;
}
```
