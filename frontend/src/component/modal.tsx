import React from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root") as HTMLElement;

export default class Modal extends React.Component {
  el: HTMLElement = document.createElement("div");

  componentDidMount() {
    modalRoot.appendChild(this.el);
    this.el.className = "modal";
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
