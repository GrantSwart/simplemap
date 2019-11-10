import React, { Component } from "react";

class Event extends Component {
  state = {
    title: this.props.sevent.title
  };

  render() {
    return <div>Event: {this.state.title}</div>;
  }
}

export default Event;
