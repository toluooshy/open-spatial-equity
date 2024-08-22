import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import wardsData from "../data/maps/TorontoWards.geojson"; // Adjust the path to your GeoJSON file
import neighbourhoodsData from "../data/maps/TorontoNeighbourhoods.geojson"; // Adjust the path to your GeoJSON file

mapboxgl.accessToken =
  "pk.eyJ1IjoidG9sdW9vc2h5IiwiYSI6ImNsem44NmU0bjBsemkybHBuMmtqOGxuMmMifQ.9QVijevpo9rKZ7aO925FTw";

function generateRandomColorsets() {
  const allNumbers = Array.from({ length: 174 }, (_, i) => i + 1); // Create an array [1, 2, 3, ..., 174]
  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  shuffleArray(allNumbers);

  const colorset1 = allNumbers.slice(0, 20);
  const colorset2 = allNumbers.slice(20, 40);
  const colorset3 = allNumbers.slice(40, 60);
  const colorset4 = allNumbers.slice(60, 80);
  const colorset5 = allNumbers.slice(80, 100);

  return { colorset1, colorset2, colorset3, colorset4, colorset5 };
}

const CityMap = ({
  isDesktop = false,
  dimensions = {},
  text = null,
  activeCategory = null,
  activeTopic = null,
  activeMetric = null,
  metricdata = [],
  style = {},
  ...buttonProps
}) => {
  const center = [-79.3832, 43.74];
  const zoom = 9;
  const bounds = [
    [center[0] - 0.27, center[1] - 0.17], // southwest corner
    [center[0] + 0.27, center[1] + 0.12], // northeast corner
  ];

  const { colorset1, colorset2, colorset3, colorset4, colorset5 } =
    generateRandomColorsets();

  const mapContainerRef = useRef(null);
  const mapData =
    text.metrics[activeMetric] === text.metrics["city_subdivision"]
      ? wardsData
      : neighbourhoodsData;

  useEffect(() => {
    console.log(activeCategory);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: center,
      zoom: zoom,
    });

    map.setMaxBounds(bounds);

    // Add navigation control (zoom and rotation buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Load the wards GeoJSON data
    map.on("load", () => {
      map.addSource("wards", {
        type: "geojson",
        data: mapData,
      });

      // Add a layer to display the wards
      map.addLayer({
        id: "wards-layer",
        type: "fill",
        source: "wards",
        layout: {},
        paint: {
          "fill-color": [
            "case",
            [
              "in",
              ["to-number", ["get", "AREA_SHORT_CODE"]],
              ["literal", colorset1],
            ],
            !!activeCategory
              ? text.categories[activeCategory.title.toLowerCase()].colors[0]
              : text.categories["infrastructure"].colors[0],
            [
              "in",
              ["to-number", ["get", "AREA_SHORT_CODE"]],
              ["literal", colorset2],
            ],
            !!activeCategory
              ? text.categories[activeCategory.title.toLowerCase()].colors[1]
              : text.categories["infrastructure"].colors[1],
            [
              "in",
              ["to-number", ["get", "AREA_SHORT_CODE"]],
              ["literal", colorset3],
            ],
            !!activeCategory
              ? text.categories[activeCategory.title.toLowerCase()].colors[2]
              : text.categories["infrastructure"].colors[2],
            [
              "in",
              ["to-number", ["get", "AREA_SHORT_CODE"]],
              ["literal", colorset4],
            ],
            !!activeCategory
              ? text.categories[activeCategory.title.toLowerCase()].colors[3]
              : text.categories["infrastructure"].colors[3],
            [
              "in",
              ["to-number", ["get", "AREA_SHORT_CODE"]],
              ["literal", colorset5],
            ],
            !!activeCategory
              ? text.categories[activeCategory.title.toLowerCase()].colors[4]
              : text.categories["infrastructure"].colors[4],
            "#ffffff", // Default color if not in any colorset (optional)
          ],
          "fill-opacity": 0.75,
        },
      });

      // Add a layer for the ward boundaries
      map.addLayer({
        id: "wards-borders",
        type: "line",
        source: "wards",
        layout: {},
        paint: {
          "line-color": "#000000", // Black color for the borders
          "line-width": 1,
        },
      });

      // Add a label layer that appears on hover
      map.addLayer({
        id: "wards-labels",
        type: "symbol",
        source: "wards",
        layout: {
          "text-field": ["get", "AREA_NAME"], // Assumes the GeoJSON has a 'ward_name' property
          "text-font": ["Arial Unicode MS Regular"],
          "text-size": 6,
          "text-anchor": "top",
          visibility: "none", // Start with labels hidden
        },
        paint: {
          "text-color": "#000000",
        },
      });

      // Show labels on hover
      map.on("mouseenter", "wards-layer", (e) => {
        map.setLayoutProperty("wards-labels", "visibility", "visible");
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "wards-layer", () => {
        map.setLayoutProperty("wards-labels", "visibility", "none");
        map.getCanvas().style.cursor = "";
      });
    });

    // Clean up on unmount
    return () => map.remove();
  }, [activeMetric, activeCategory, activeTopic]);

  return (
    <div>
      {!!text ? (
        <div
          ref={mapContainerRef}
          style={{
            marginTop: 6,
            height: isDesktop ? dimensions.height - 120 : 490,
            width: isDesktop
              ? dimensions.width * 0.75 - 250
              : dimensions.width - 40,
          }}
        />
      ) : null}
    </div>
  );
};

export default CityMap;
