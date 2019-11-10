import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./map.css";
import myImage from "./mapbox-icon.png";
import Modal from "../modal/Modal";
import Event from "../event/Event";

class Mapgl extends Component {
  state = {
    lng: 0,
    lat: 51.5,
    zoom: 13,
    allevents: [
      {
        id: 3,
        title: "St Pauls",
        description: "event 1 details",
        lat: 51.5143,
        lng: -0.0983
      },
      {
        id: 4,
        title: "Covent Garden",
        description: "event 2 details",
        lat: 51.5116,
        lng: -0.1225
      }
    ]
  };

  componentDidMount() {
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
      loadEvents();
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on("click", "places", function(e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    //DOUBLE CLICK OPEN MODAL COMPONENT
    map.on("dblclick", function(e) {
      console.log("double click");
      var y = JSON.stringify(e.lngLat.wrap());
      var obj = JSON.parse(y);
      console.log("lat " + obj.lat);
      console.log("lng " + obj.lng);

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
        console.log(
          eTitle + " , " + eDescription + " , " + obj.lng + " , " + obj.lat
        );
        //create new event, add to array and update display

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

    function loadEvents() {
      map.loadImage(myImage, function(error, image) {
        if (error) throw error;
        map.addImage("cat", image);
        map.addLayer({
          id: "places",
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    description: "Test description"
                  },
                  geometry: {
                    type: "Point",
                    coordinates: [0, 51.5]
                  }
                },
                {
                  type: "Feature",
                  properties: {
                    description: "<h3>Description 2</h3>",
                    icon: "music"
                  },
                  geometry: {
                    type: "Point",
                    coordinates: [0, 51.51]
                  }
                }
              ]
            }
          },
          layout: {
            "icon-image": "cat",
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
          {this.state.allevents.map(sevent => (
            <Event key={sevent.id} sevent={sevent} />
          ))}
          <Modal />
        </div>
      </React.Fragment>
    );
  }
} //end class

export default Mapgl;
