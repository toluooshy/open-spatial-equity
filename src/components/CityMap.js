import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoidG9sdW9vc2h5IiwiYSI6ImNsem44NmU0bjBsemkybHBuMmtqOGxuMmMifQ.9QVijevpo9rKZ7aO925FTw";

const CityMap = ({
  isDesktop = false,
  dimensions = {},
  text = null,
  activeCategory = null,
  activeTopic = null,
  activeMetric = null,
  activeSolution = null,
  selectionConsoleVisible = null,
  setQ1 = null,
  setMedian = null,
  setQ3 = null,
  metricdata = [],
  style = {},
  ...buttonProps
}) => {
  const [wardsGeoJSON, setWardsGeoJSON] = useState(null);
  const [neighbourhoodsGeoJSON, setNeighbourhoodsGeoJSON] = useState(null);

  const generateColorsets = (data) => {
    // Extract the values and sort them
    const values = data
      .map((obj) => parseFloat(obj.value))
      .sort((a, b) => a - b);

    // Calculate quartiles
    const Q1 = values[Math.floor(values.length / 4)];
    setQ1(Q1);
    const median = values[Math.floor(values.length / 2)];
    setMedian(median);
    const Q3 = values[Math.floor((values.length * 3) / 4)];
    setQ3(Q3);

    // Initialize the color sets
    const colorset1 = [];
    const colorset2 = [];
    const colorset3 = [];
    const colorset4 = [];

    // Sort ids into color sets based on value
    data.forEach((obj) => {
      const value = parseFloat(obj.value);
      if (value <= Q1) {
        colorset4.push(Number(obj.section));
      } else if (value <= median) {
        colorset3.push(Number(obj.section));
      } else if (value <= Q3) {
        colorset2.push(Number(obj.section));
      } else {
        colorset1.push(Number(obj.section));
      }
    });
    // Return the color sets
    return { colorset1, colorset2, colorset3, colorset4 };
  };

  useEffect(() => {
    const files = [
      `${process.env.PUBLIC_URL}/files/maps/TorontoWards.geojson`,
      `${process.env.PUBLIC_URL}/files/maps/TorontoNeighbourhoods.geojson`,
    ];

    Promise.all(files.map((file) => fetch(file).then((res) => res.json())))
      .then(([wardsData, neighbourhoodsData]) => {
        setWardsGeoJSON(wardsData);
        setNeighbourhoodsGeoJSON(neighbourhoodsData);
      })
      .catch((error) => console.error("Failed to fetch GeoJSON files:", error));
  }, []);

  const center = [-79.3832, 43.74]; // center coordinates of the city
  const zoom = 8;
  const bounds = [
    [center[0] - 0.28, center[1] - 0.19], // southwest corner
    [center[0] + 0.29, center[1] + 0.15], // northeast corner
  ];

  const mapContainerRef = useRef(null);
  const mapData =
    text.metrics[activeMetric] === text.metrics["city_subdivision"]
      ? wardsGeoJSON
      : neighbourhoodsGeoJSON;

  useEffect(() => {
    const { colorset1, colorset2, colorset3, colorset4 } =
      generateColorsets(metricdata);

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
              ? text.categories[activeCategory.title.toLowerCase()].colors[1]
              : text.categories["infrastructure"].colors[1],
            [
              "in",
              ["to-number", ["get", "AREA_SHORT_CODE"]],
              ["literal", colorset2],
            ],
            !!activeCategory
              ? text.categories[activeCategory.title.toLowerCase()].colors[2]
              : text.categories["infrastructure"].colors[2],
            [
              "in",
              ["to-number", ["get", "AREA_SHORT_CODE"]],
              ["literal", colorset3],
            ],
            !!activeCategory
              ? text.categories[activeCategory.title.toLowerCase()].colors[3]
              : text.categories["infrastructure"].colors[3],
            [
              "in",
              ["to-number", ["get", "AREA_SHORT_CODE"]],
              ["literal", colorset4],
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
  }, [
    mapData,
    metricdata,
    activeMetric,
    activeCategory,
    activeTopic,
    activeSolution,
    selectionConsoleVisible,
  ]);

  return (
    <div>
      {!!text ? (
        <div
          ref={mapContainerRef}
          style={{
            marginTop: 6,
            height: isDesktop ? dimensions.height - 100 : 430,
            width: isDesktop
              ? dimensions.width -
                ((!!selectionConsoleVisible ? 250 : 0) +
                  (!!activeSolution ? 250 : 0) +
                  310)
              : dimensions.width - 40,
          }}
        />
      ) : null}
    </div>
  );
};

export default CityMap;
