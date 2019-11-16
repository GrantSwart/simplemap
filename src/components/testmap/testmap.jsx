import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "../map/map.css";
import myImage from "../map/mapbox-icon.png";
import Modal from "../modal/Modal";

class Testmap extends Component {
  state = {
    lng: -0.1225,
    lat: 51.5,
    zoom: 12.5
  };

  componentDidMount() {
    //GLOBAL DATA
    const el = [];

    //Model for new events
    function newevent(eid, title, long, lat, description, date, location) {
      this.id = eid;
      this.title = title;
      this.lng = long;
      this.lat = lat;
      this.description = description;
      this.date = date;
      this.location = location;
    }

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic3dhcnRncmFudCIsImEiOiJjazJjeHlicmYzODhwM2dtemJxeGlja3R1In0.DlrCAWM70XHlKREU5XJY1g";

    //create map object
    var map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    map.on("load", function() {
      window.alert(
        "Simple Map Test. Click event to view details, Double click map location to create a new event on the location."
      );

      let eventsObject = require("../data/data.json");
      //console.log(eventsObject);
      //console.log(eventsObject.eventsArray[0].id);

      loadEvents(eventsObject);
    });

    map.on("click", function(e) {
      //get coordinates of mouse click
      var y = JSON.stringify(e.lngLat.wrap());
      var obj = JSON.parse(y);
      //console.log(obj.lng + " , " + obj.lat);

      //get layer dynamically - search elements array and return object
      var eobject = findLayer(obj.lng, obj.lat);
      //console.log(eobject);

      var coordinates = e.lngLat.wrap();
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      if (eobject != null) {
        var p1 = "<h3>" + eobject.title + "</h3>";
        var p2 = "<h4>" + eobject.description + "</h4>";
        var p3 = "<h5>" + eobject.date + "</h5>";
        var p4 = "<h5>" + eobject.location + "</h5>";
        var htmlstring = p1 + p2 + p3 + p4;

        //show popup
        new mapboxgl.Popup()
          .setLngLat(e.lngLat.wrap())
          .setHTML(htmlstring)
          .addTo(map);
      }
    });

    /*
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
*/

    /* Find layer from mouse position */
    function findLayer(lng, lat) {
      //  console.log(lng + " , " + lat);

      var precision = 0.001;
      for (const [i] of el.entries()) {
        if (Math.abs(lng - el[i].lng) <= precision) {
          //  console.log(el[i].id + ": " + lng + el[i].lng + " lng EQUAL");

          if (Math.abs(lat - el[i].lat) <= precision) {
            //  console.log(el[i].id + ": " + lat + el[i].lat + " lat EQUAL");
            console.log("Match - return id=layer");
            return el[i];
          } else {
            //   console.log(el[i].id + ": " + lat + el[i].lat + " lat DO NOT EQUAL" );
            console.log("No Match ");

            return null;
          }
        } else {
          // console.log(el[i].id + ": " + lng + el[i].lng + " lng DO NOT EQUAL");
        }
      } //end for
      return null;
    } //End function

    function loadEvents(eventsObject) {
      //LOOP ARRAY DATA AND ADD TO MAP
      for (var i = 0; i < eventsObject.eventsArray.length; i++) {
        //console.log(eventsObject.eventsArray[i].id);
        addToMap(eventsObject.eventsArray[i]);
        //add to local array
        el.push(eventsObject.eventsArray[i]);
      }

      //get array and store in JSON format
      var myObject = { eventsArray: el };
      const jsonTest = JSON.stringify(myObject);
      console.log("129 serialised object:\n" + jsonTest);

      let test = JSON.parse(jsonTest);
      console.log(test.eventsArray[0].id);
      /*
      for (const [index] of el.entries()) {
        //items.push(<li key={index}>{value}</li>);
        // console.log(elements[index]);
        addToMap(el[index]);
      }
  */
    }

    //DOUBLE CLICK OPEN MODAL COMPONENT
    map.on("dblclick", function(e) {
      // console.log("double click");
      var y = JSON.stringify(e.lngLat.wrap());
      var obj = JSON.parse(y);
      //  console.log("lat " + obj.lat);
      //  console.log("lng " + obj.lng);

      //open modal
      var modal = document.getElementById("myModal");
      modal.style.display = "block";

      // When the user clicks on <span> (x), close the modal
      var s = document.getElementById("mySpan");
      s.onclick = function() {
        modal.style.display = "none";
      };

      // When the user clicks on <span> (x), close the modal
      var submitModal = document.getElementById("btnModal");
      submitModal.onclick = function() {
        //access the values in the form
        var eTitle = document.getElementById("eventtitle").value;
        var eDescription = document.getElementById("eventdescription").value;
        var eDate = new Date(document.getElementById("eventdate").value);
        var shortDate = eDate.toLocaleDateString();
        var eLocation = document.getElementById("eventlocation").value;
        // console.log(eTitle + " , " + eDescription);
        //create new event, add to array and update display
        //Generate a random ID
        var length = 9;
        var id = Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, length);
        //Create a new event object
        var newEvent = new newevent(
          id,
          eTitle,
          obj.lng,
          obj.lat,
          eDescription,
          shortDate,
          eLocation
        );
        // console.log(newEvent);
        //add to array
        el.push(newEvent);
        //add event to map
        addToMap(newEvent);

        //check in array
        for (const [index] of el.entries()) {
          console.log(el[index].id);
        }

        //Reset form values
        document.getElementById("eventform").reset();
        //Close modal after submit
        modal.style.display = "none";
      };
      //close modal if click off form
      window.onclick = function(event) {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      };
    });

    function addToMap(element) {
      // console.log(element.lng + "," + element.lat);

      map.loadImage(myImage, function(error, image) {
        if (error) throw error;
        map.addImage(element.id, image);
        map.addLayer({
          id: element.id,
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    description: element.title
                  },
                  geometry: {
                    type: "Point",
                    coordinates: [element.lng, element.lat]
                  }
                }
              ]
            }
          },
          layout: {
            "icon-image": element.id,
            "icon-size": 0.25
          }
        });
      });
    }
  } //end component did mount

  render() {
    return (
      <React.Fragment>
        <div ref={el => (this.mapContainer = el)} className="mapContainer">
          <Modal />
        </div>
      </React.Fragment>
    );
  }
} //end class

export default Testmap;
