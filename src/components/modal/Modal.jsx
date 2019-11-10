import React from "react";

import "./Modal.css";

const modal = props => {
  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <span id="mySpan" className="close">
          &times;
        </span>

        <form id="eventform">
          <div className="form-group">
            <label>
              <span className="glyphicon glyphicon-user"></span>Event
            </label>
            <input
              type="text"
              className="form-control"
              id="eventtitle"
              placeholder="Enter title"
            />
          </div>
          <div className="form-group">
            <label>
              <span className="glyphicon glyphicon-eye-open"></span>
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="eventdescription"
              placeholder="Description"
            />
          </div>
          <div className="form-group">
            <label>
              <span className="glyphicon glyphicon-eye-open"></span>
              Event Date
            </label>
            <input
              type="date"
              id="eventdate"
              data-date-format="DD MMMM YYYY"
            ></input>
          </div>
          <div className="form-group">
            <label>
              <span className="glyphicon glyphicon-eye-open"></span>
              Location
            </label>
            <input
              type="text"
              className="form-control"
              id="eventlocation"
              placeholder="Description"
            />
          </div>
        </form>
        <button
          type="submit"
          id="btnModal"
          className=" btn btn-success btn-block"
        >
          <span className="glyphicon glyphicon-off"></span> Create event
        </button>
      </div>
    </div>
  );
};

export default modal;
