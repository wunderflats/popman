# popman

Unopinionated and unstyled popover component for React. [View example](https://cdn.rawgit.com/wunderflats/popman/master/examples/index.html).

## Benefits

* Unopinionated
* Unstyled
* Simple API
* Automatic positioning
* Renders popovers on page body, so it **works inside containers with `overflow: hidden`**
* No dependencies

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

Custom class name for your popover.

#### children (`node`)

The content of the popover.

#### around (`node`)

The React component against which the popover is positioned.

#### preferPosition (`{ y: 'top'|'bottom', x: 'left'|'right' }`)

The preferred position of the popover.
