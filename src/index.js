"use strict";

const React = require("react");
const ReactDOM = require("react-dom");
const PropTypes = require("prop-types");
const scrollparent = require("scrollparent");

class Popover extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    around: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    constrainTo: PropTypes.string,
    constrainX: PropTypes.bool,
    constrainY: PropTypes.bool,
    position: PropTypes.object
  };

  constructor() {
    super();
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this);
    this.scrollParent = scrollparent(domNode);

    this.popover = document.createElement("div");
    this.popover.className = "_Popover";
    this._detachedContainer = document.createElement("div");
    this._detachedContainer.style.display = "inline-block";
    this._detachedContainer.style.visibility = "hidden";
    this._detachedContainer.style.position = "absolute";
    this._detachedContainer.style.top = 0;
    this._detachedContainer.style.left = 0;
    this._detachedContainer.className = this.props.className || "Popover";
    document.body.appendChild(this.popover);
    document.body.appendChild(this._detachedContainer);
    this._renderPopover();

    if (this.props.open) {
      window.addEventListener("resize", this.onResize);
      if (this.scrollParent) {
        this.scrollParent.addEventListener("scroll", this.onResize);
      }
    }
  }

  componentWillReceiveProps(props) {
    // if we are now opening the popover
    if (!this.props.open && props.open) {
      window.addEventListener("resize", this.onResize);
      if (this.scrollParent) {
        this.scrollParent.addEventListener("scroll", this.onResize);
      }
    }

    // if we are now hiding the popover
    if (this.props.open && !props.open) {
      window.removeEventListener("resize", this.onResize);
      if (this.scrollParent) {
        this.scrollParent.removeEventListener("scroll", this.onResize);
      }
    }
  }

  componentDidUpdate() {
    this._renderPopover();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    if (this.scrollParent) {
      this.scrollParent.removeEventListener("scroll", this.onResize);
    }
    if (this.popover.parentNode !== document.body) return;
    ReactDOM.unmountComponentAtNode(this.popover);
    document.body.removeChild(this.popover);
    ReactDOM.unmountComponentAtNode(this._detachedContainer);
    document.body.removeChild(this._detachedContainer);
  }

  onResize() {
    this.forceUpdate();
  }

  getViewportBounds() {
    const { x, y } = scrollPosition();

    return {
      left: x,
      right: x + window.innerWidth,
      top: y,
      bottom: y + window.innerHeight
    };
  }

  getAnchorBounds() {
    return this.getBounds(this.anchor);
  }

  getBodyBounds() {
    return this.getBounds(this._detachedContainer);
  }

  getBounds(domNode) {
    const bounds = domNode.getBoundingClientRect();
    const viewport = this.getViewportBounds();

    const a = {
      left: bounds.left + viewport.left,
      right: bounds.right + viewport.left,
      top: bounds.top + viewport.top,
      bottom: bounds.bottom + viewport.top
    };

    return a;
  }

  getBodySize() {
    return {
      width: this._detachedContainer.offsetWidth,
      height: this._detachedContainer.offsetHeight
    };
  }

  calculatePosition() {
    const docbounds = this.getViewportBounds();
    const anchorBounds = this.getAnchorBounds();
    const bodySize = this.getBodySize();

    const position = Object.assign(
      {
        x: calculateXPosition(),
        y: calculateYPosition()
      },
      this.props.position || {}
    );

    const values = this.calculatePositionValues(position);

    if (values.left < 0) {
      position.x = "left";
    }

    return position;

    function calculateXPosition() {
      if (anchorBounds.right + bodySize.width >= docbounds.right) {
        return "left";
      }

      return "right";
    }

    function calculateYPosition() {
      if (anchorBounds.bottom + bodySize.height >= docbounds.bottom) {
        return "top";
      }

      return "bottom";
    }
  }

  calculatePositionValues(position) {
    const { constrainTo, constrainX, constrainY } = this.props;
    const docbounds = this.getViewportBounds();
    const anchorBounds = this.getAnchorBounds();
    const bodySize = this.getBodySize();
    const values = {};

    if (position.y === "bottom") {
      values.top = anchorBounds.bottom;
    } else if (position.y === "center") {
      const anchorHeight = anchorBounds.bottom - anchorBounds.top;
      const anchorCenter = anchorBounds.top + anchorHeight / 2;
      values.top = anchorCenter - bodySize.height / 2;
    } else {
      values.top = anchorBounds.top - bodySize.height;
    }

    if (position.x === "left") {
      values.left = anchorBounds.left - bodySize.width;
    } else if (position.x === "center") {
      const anchorWidth = anchorBounds.right - anchorBounds.left;
      const anchorCenter = anchorBounds.left + anchorWidth / 2;
      values.left = anchorCenter - bodySize.width / 2;
    } else {
      values.left = anchorBounds.right;
    }

    if (values.left + bodySize.width > docbounds.right) {
      values.left = docbounds.right - bodySize.width;
    }

    if (constrainTo === "scrollParent") {
      const scrollBounds = this.getBounds(this.scrollParent);
      if (constrainX && values.left < scrollBounds.left) {
        values.left = scrollBounds.left;
      } else if (
        constrainX &&
        values.left + bodySize.width > scrollBounds.right
      ) {
        values.left = scrollBounds.right - bodySize.width;
      }

      if (constrainY && values.top < scrollBounds.top) {
        values.top = scrollBounds.top;
      } else if (
        constrainY &&
        values.top + bodySize.height > scrollBounds.bottom
      ) {
        values.top = scrollBounds.bottom - bodySize.height;
      }
    }

    return values;
  }

  calculateStyle(position, values) {
    const style = { position: "absolute", zIndex: "201" };

    return Object.assign(
      style,
      values || this.calculatePositionValues(position)
    );
  }

  _renderPopover() {
    this._renderDetached();
    this.anchor = ReactDOM.findDOMNode(this);
    const position = this.calculatePosition(this.anchor);
    const style = this.calculateStyle(position);
    const baseClassName = this.props.className || "Popover";

    const className = `${baseClassName} ${baseClassName}--position-${position.y}-${position.x}`;

    if (!this.props.open) {
      ReactDOM.render(
        <div style={{ display: "none" }} className={className} />,
        this.popover
      );

      return;
    }

    ReactDOM.render(
      <div style={style} className={`${className} ${baseClassName}--open`}>
        {this.props.children}
      </div>,
      this.popover
    );
  }

  _renderDetached() {
    ReactDOM.render(this.props.children, this._detachedContainer);
  }

  render() {
    return this.props.around;
  }
}

function scrollPosition() {
  const x = window.pageXOffset || document.documentElement.scrollLeft;
  const y = window.pageYOffset || document.documentElement.scrollTop;

  return { x, y };
}

module.exports = Popover;
