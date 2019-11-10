import React, { Component } from "react";

class Math extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", value2: "" };

    this.handleChange2 = this.handleChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleChange2(event) {
    this.setState({ value2: event.target.value });
    console.log(this.state.value2);
  }

  handleSubmit(event) {
    console.log(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Math;
