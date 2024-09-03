import { useState, useEffect } from "react";
import Papa from "papaparse";
import text from "./data";
import background from "./graphics/branding/background.png";
import Histogram from "./components/Histogram";
import CityMap from "./components/CityMap";
import DataTable from "./components/DataTable";
import Menu from "./components/Menu";

import { useWindowDimensions } from "./utils/CustomHooks";

const App = () => {
  const dimensions = useWindowDimensions();
  const isDesktop = dimensions.width > 1024;

  const [selectionConsoleVisible, setSelectionConsoleVisible] = useState(false);
  const [activeView, setActiveView] = useState("portal");
  const [activeMetric, setActiveMetric] = useState("city_subdivision");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTopic, setActiveTopic] = useState("");
  const [activeSolution, setActiveSolution] = useState("");

  const [q1, setQ1] = useState();
  const [median, setMedian] = useState();
  const [q3, setQ3] = useState();

  const [activeCenterpiece, setActiveCenterpiece] = useState("video"); // video, table, graph, map, or comparison - depending on view and user selection
  const [metricdata, setMetricdata] = useState([]);

  const datasets = {
    Infrastructure: {
      "Median Income": [
        "files/datasets/infrastructure/median_income_ward.csv",
        "files/datasets/infrastructure/median_income_neighbourhood.csv",
      ],
    },
    Health: {
      "Healthcare Workers": [
        "files/datasets/health/healthcare_workers_ward.csv",
        "files/datasets/health/healthcare_workers_neighbourhood.csv",
      ],
    },
    Environment: {},
    Transportation: {},
  };

  const views = {
    portal: "🇨🇦",
    city_data: "🏙",
    community_profiles: "🏘",
    learn_more: "📚",
  };

  const centerpieceOptions =
    activeView === "city_data" ? ["🔢", "📊", "🗺"] : ["📊", "🗺"];

  const convertCSVToArray = (data) => {
    const names = data[0];
    const ids = data[1];
    const values = data[2];

    const result = names.map((name, index) => ({
      name: name.trim(),
      section: ids[index].trim(),
      value: Number(values[index].trim()),
    }));

    return result;
  };

  useEffect(() => {
    console.log(
      `${process.env.PUBLIC_URL}${
        datasets[activeCategory?.title]?.[activeTopic]?.[
          activeMetric === "city_subdivision" ? 0 : 1
        ]
      }`
    );
    if (!!activeTopic && !!activeCategory) {
      // Fetch the CSV file from the public folder
      const fetchData = async () => {
        await fetch(
          `${process.env.PUBLIC_URL}${
            datasets[activeCategory?.title]?.[activeTopic]?.[
              activeMetric === "city_subdivision" ? 0 : 1
            ]
          }`
        )
          .then((response) => response.text())
          .then((text) => {
            // Parse the CSV text using PapaParse
            Papa.parse(text, {
              complete: (result) => {
                const parsedData = convertCSVToArray(result.data);
                setMetricdata(parsedData.sort((a, b) => b.value - a.value));
              },
              header: false, // No headers in CSV
            });
          });
      };
      fetchData();
    }
  }, [activeTopic, activeCategory, activeMetric]);

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <div
      style={{
        height: "100vh",
        margin: "auto",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      <img
        src={background}
        style={{
          minWidth: dimensions.width * 1.5,
          opacity: 0.5,
          transform: "translate(-33%,-33%)",
        }}
      />
      <div
        style={{
          position: "fixed",
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          justifyContent: "space-between",
          top: 0,
          width: "100%",
          height: dimensions.height,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
          }}
        >
          {/* view selector */}
          <div
            style={{
              position: "relative",
              top: 0,
              paddingTop: isDesktop ? 14 : 6,
              paddingBottom: 6,
              backgroundColor: "rgba(0,0,0,.85)",
              borderBottom: isDesktop ? "" : "solid 1px #ffffff",
              borderRight: isDesktop ? "solid 1px #ffffff" : "",
              display: "flex",
              justifyContent: "space-between",
              width: isDesktop ? 250 : "100%",
              fontSize: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: isDesktop ? "column" : "row",
                height: isDesktop ? 300 : "100%",
                width: "100%",
              }}
            >
              {Object.keys(views).map((view) => (
                <div
                  key={view}
                  style={{
                    flex: isDesktop ? 0 : activeView === view ? 4 : 0.5,
                    textAlign: "center",
                    color: "#ffffff",
                    borderRight: isDesktop
                      ? ""
                      : `solid ${view === "learn_more" ? 0 : 1}px #ffffff`,
                    padding: 5,
                    cursor: "pointer",
                    opacity: isDesktop ? (activeView === view ? 1 : 0.5) : 1,
                  }}
                  onClick={() => {
                    if (view === "portal") {
                      setActiveCenterpiece("video");
                      setActiveSolution("");
                    }
                    if (view === "city_data") {
                      setSelectionConsoleVisible(true);
                      setActiveCenterpiece("graph");
                      setActiveSolution("");
                    }
                    if (view === "community_profiles") {
                      setSelectionConsoleVisible(true);
                      setActiveCenterpiece("map");
                      setActiveSolution("");
                    }
                    if (view === "learn_more") {
                      setActiveCenterpiece("menu");
                      setActiveSolution("");
                    }
                    setActiveView(view);
                  }}
                >
                  {isDesktop
                    ? text.views[view]
                    : activeView === view
                    ? text.views[view]
                    : views[view]}

                  {/* desktop metrics selector */}
                  {isDesktop &&
                  activeView === view &&
                  view !== "portal" &&
                  view !== "learn_more" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: 10,
                        borderRadius: 4,
                        padding: 4,
                        margin: "auto",
                        marginTop: 4,
                        textAlign: "center",
                      }}
                    >
                      {Object.keys(text.metrics).map((metric) => (
                        <div
                          key={metric}
                          style={{
                            textAlign: "center",
                            color:
                              activeMetric === metric ? "#ffffff" : "#888888",
                            borderLeft:
                              metric !== Object.keys(text.metrics)[0] &&
                              "solid 1px #ffffff",
                            paddingRight: 6,
                            paddingLeft: 6,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setActiveMetric(metric);
                          }}
                        >
                          {text.metrics[metric]}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* data selector */}
          {!!selectionConsoleVisible &&
          (activeView === "city_data" ||
            activeView === "community_profiles") ? (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,.85)",
                borderRight: "solid 1px #ffffff",
                borderLeft: isDesktop ? "" : "solid 1px #ffffff",
                paddingTop: isDesktop ? 0 : 10,
                flex: 1,
                display: "flex",
                flexDirection: isDesktop ? "row" : "column",
              }}
            >
              {!!text.categories ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    fontSize: 15,
                    flexWrap: !isDesktop && "wrap",
                    flexDirection: isDesktop ? "column" : "row",
                    width: isDesktop && 250,
                  }}
                >
                  {Object.entries(text.categories).map((category) => (
                    <div
                      key={category}
                      style={{
                        textAlign: "center",
                        flex: !activeCategory
                          ? 1
                          : isDesktop && activeCategory === category[1]
                          ? 1
                          : 0,
                        color: isDesktop
                          ? activeCategory === category[1]
                            ? "#ffffff"
                            : "#000000"
                          : "#ffffff",
                        cursor: "pointer",
                        height: isDesktop && 300,
                        marginTop: !isDesktop && -4,
                      }}
                      onClick={() => {
                        setActiveCategory(category[1]);
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: isDesktop
                            ? activeCategory === category[1]
                              ? "rgba(0,0,0,0)"
                              : "#ffffff"
                            : "rgba(0,0,0,0)",
                          opacity:
                            isDesktop || activeCategory === category[1]
                              ? 1
                              : 0.5,
                          padding: !!activeCategory && isDesktop ? 10 : 0,
                          height: !activeCategory && "100%",
                          alignContent: "center",
                          borderTop: "solid 1px #000000",
                          borderBottom: "solid 1px #000000",
                        }}
                      >
                        {category[1].title}
                      </div>
                      {isDesktop && activeCategory === category[1] ? (
                        <div
                          style={{
                            justifyContent: "center",
                            fontSize: 12,
                            backgroundColor: "#ffffff",
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              justifyContent: "center",
                              fontSize: 12,
                              padding: 6,
                            }}
                          >
                            {activeCategory?.topics?.map((topic) => (
                              <div
                                key={topic}
                                style={{
                                  textAlign: "center",
                                  color:
                                    activeTopic === topic
                                      ? "#ffffff"
                                      : "#000000",
                                  border:
                                    activeTopic === topic
                                      ? "solid 1px #ffffff"
                                      : "solid 1px #000000",
                                  backgroundColor:
                                    activeTopic === topic
                                      ? "#000000"
                                      : "#ffffff",
                                  margin: 4,
                                  borderRadius: 10,
                                  paddingTop: 1,
                                  paddingBottom: 2,
                                  paddingRight: 8,
                                  paddingLeft: 8,
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setActiveTopic(topic);
                                  setActiveSolution(topic);
                                }}
                              >
                                {topic}
                              </div>
                            ))}
                          </div>

                          {activeCategory?.topics?.indexOf(activeTopic) !==
                          -1 ? (
                            <div style={{ color: "#000000" }}>
                              descriptive text goes here
                            </div>
                          ) : null}
                          {activeCenterpiece === "map" &&
                          activeCategory?.topics?.indexOf(activeTopic) !==
                            -1 ? (
                            <div
                              style={{
                                display: "flex",
                                margin: "auto",
                                marginTop: 20,
                                width: 220,
                                color: "#000000",
                              }}
                            >
                              {[4, 3, 2, 1].map((index) => (
                                <div>
                                  <div
                                    style={{
                                      width: 55,
                                      height: 20,
                                      backgroundColor: !!activeCategory
                                        ? text.categories[
                                            activeCategory.title.toLowerCase()
                                          ].colors[index]
                                        : text.categories["infrastructure"]
                                            .colors[1],
                                    }}
                                  />
                                  <div
                                    style={{ fontSize: 10, textAlign: "left" }}
                                  >
                                    {index === 4
                                      ? metricdata
                                          .map((obj) => parseFloat(obj.value))
                                          .sort((a, b) => a - b)[0]
                                      : index === 3
                                      ? q1
                                      : index === 2
                                      ? median
                                      : index === 1
                                      ? `${q3}+`
                                      : 0}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
              {!isDesktop ? (
                <div
                  style={{
                    borderTop: "solid 1px #ffffff",
                    margin: 10,
                    marginBottom: 0,
                  }}
                />
              ) : null}
              {!isDesktop && !!activeCategory && !!activeCategory.topics ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    fontSize: 12,
                    padding: 6,
                  }}
                >
                  {activeCategory?.topics?.map((topic) => (
                    <div
                      key={topic}
                      style={{
                        textAlign: "center",
                        color: activeTopic === topic ? "#000000" : "#888888",
                        border:
                          activeTopic === topic
                            ? "solid 1px #ffffff"
                            : "solid 1px #888888",
                        backgroundColor:
                          activeTopic === topic ? "#ffffff" : "#000000",
                        margin: 4,
                        borderRadius: 10,
                        paddingTop: 1,
                        paddingBottom: 2,
                        paddingRight: 8,
                        paddingLeft: 8,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setActiveTopic(topic);
                        setActiveSolution(topic);
                        setSelectionConsoleVisible(false);
                      }}
                    >
                      {topic}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* minimize/maximize data selector */}
          {activeView === "city_data" || activeView === "community_profiles" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,.75)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,1)",
                  borderTopRightRadius: isDesktop ? 8 : 0,
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: isDesktop ? 0 : 8,
                  borderTop: "solid 1px #ffffff",
                  borderRight: "solid 1px #ffffff",
                  borderLeft: isDesktop ? "" : "solid 1px #ffffff",
                  borderBottom: "solid 1px #ffffff",
                  paddingTop: 4,
                  paddingBottom: -2,
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 30,
                    color: "#ffffff",
                    transform: `rotate(${
                      isDesktop
                        ? selectionConsoleVisible
                          ? 90
                          : 270
                        : selectionConsoleVisible
                        ? 180
                        : 0
                    }deg)`,
                    marginRight: isDesktop && -3,
                    paddingTop: selectionConsoleVisible ? 8 : 2,
                    marginTop: selectionConsoleVisible ? -8 : 2,
                    paddingLeft: !isDesktop
                      ? 0
                      : selectionConsoleVisible
                      ? 8
                      : 2,
                    marginLeft: !isDesktop
                      ? 0
                      : selectionConsoleVisible
                      ? -8
                      : 2,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectionConsoleVisible(!selectionConsoleVisible);
                    setActiveSolution("");
                  }}
                >
                  ﹀
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div
          style={{
            margin: "auto",
            height: dimensions.height,
            width: isDesktop
              ? !!activeSolution
                ? dimensions.width - 300
                : "100%"
              : "100%",
            backgroundColor: "rgba(255,255,255,.75)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* main centerpiece */}
            {activeCenterpiece === "video" ||
            activeCenterpiece === "menu" ||
            activeCategory?.topics?.indexOf(activeTopic) !== -1 ? (
              <div
                style={{
                  position: "relative",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {activeView === "city_data" ||
                activeView === "community_profiles" ? (
                  <div
                    style={{
                      textAlign: "left",
                      display: "flex",
                    }}
                  >
                    <div style={{ marginTop: 10, fontSize: 18 }}>
                      {activeTopic}
                    </div>
                  </div>
                ) : null}
                {activeView === "city_data" ||
                (activeView === "community_profiles" && !!activeTopic) ? (
                  <div style={{ display: "flex" }}>
                    {centerpieceOptions.map((icon, index) => (
                      <div
                        style={{
                          backgroundColor: "#000000",
                          borderRadius: 4,
                          marginTop: 4,
                          marginBottom: 4,
                          marginRight:
                            index === centerpieceOptions.length - 1 ? 6 : 10,
                          padding: 4,
                          fontSize: 10,
                          width: 14,
                          height: 14,
                          textAlign: "center",
                          alignContent: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setActiveCenterpiece(
                            icon === "🔢"
                              ? "table"
                              : icon === "📊"
                              ? "graph"
                              : "map"
                          );
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                    {/* mobile metrics selector */}
                    {!isDesktop ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          fontSize: 10,
                          borderRadius: 4,
                          padding: 4,
                          margin: 4,
                          backgroundColor: "#000000",
                        }}
                      >
                        {Object.keys(text.metrics).map((metric) => (
                          <div
                            key={metric}
                            style={{
                              flex: 1,
                              textAlign: "center",
                              color:
                                activeMetric === metric ? "#ffffff" : "#888888",
                              borderLeft:
                                metric !== Object.keys(text.metrics)[0] &&
                                "solid 1px #ffffff",
                              paddingRight: 6,
                              paddingLeft: 6,
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setActiveMetric(metric);
                            }}
                          >
                            {text.metrics[metric]}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {activeCenterpiece === "video" ? (
                  <iframe
                    margin="auto"
                    height={isDesktop ? dimensions.height - 100 : 490}
                    width={
                      isDesktop
                        ? dimensions.width * 0.75
                        : dimensions.width - 40
                    }
                    src="https://www.youtube.com/embed/iFPokf8mwPk?si=enqAV7tz2QqExC3t"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                  ></iframe>
                ) : activeCenterpiece === "table" &&
                  !!activeTopic &&
                  !!metricdata ? (
                  <DataTable
                    isDesktop={isDesktop}
                    dimensions={dimensions}
                    text={text}
                    activeCategory={activeCategory}
                    activeTopic={activeTopic}
                    activeMetric={activeMetric}
                    activeSolution={activeSolution}
                    selectionConsoleVisible={selectionConsoleVisible}
                    metricdata={metricdata}
                  />
                ) : activeCenterpiece === "graph" &&
                  !!activeTopic &&
                  !!metricdata ? (
                  <Histogram
                    isDesktop={isDesktop}
                    dimensions={dimensions}
                    text={text}
                    activeCategory={activeCategory}
                    activeTopic={activeTopic}
                    activeMetric={activeMetric}
                    activeSolution={activeSolution}
                    selectionConsoleVisible={selectionConsoleVisible}
                    metricdata={metricdata}
                  />
                ) : activeCenterpiece === "map" &&
                  !!activeTopic &&
                  !!metricdata ? (
                  <CityMap
                    isDesktop={isDesktop}
                    dimensions={dimensions}
                    text={text}
                    activeCategory={activeCategory}
                    activeTopic={activeTopic}
                    activeMetric={activeMetric}
                    activeSolution={activeSolution}
                    selectionConsoleVisible={selectionConsoleVisible}
                    setQ1={setQ1}
                    setMedian={setMedian}
                    setQ3={setQ3}
                    metricdata={metricdata}
                  />
                ) : activeCenterpiece === "menu" ? (
                  <Menu
                    isDesktop={isDesktop}
                    dimensions={dimensions}
                    text={text}
                    activeCategory={activeCategory}
                    activeTopic={activeTopic}
                    activeMetric={activeMetric}
                    activeSolution={activeSolution}
                    metricdata={metricdata}
                  />
                ) : (
                  <div>comparison goes here</div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        {!!activeSolution ? (
          <div
            style={{
              zIndex: 3,
              width: isDesktop ? 380 : "100%",
              backgroundColor: "rgba(255,255,255,.75)",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: isDesktop ? dimensions.height - 2 : 300,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,.85)",
                border: "solid 1px #ffffff",
                borderTopRightRadius: isDesktop ? 0 : 8,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: isDesktop ? 8 : 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#ffffff",
                  fontSize: 12,
                  marginTop: 5,
                  marginLeft: 10,
                }}
              >
                solutions go here for {activeSolution}
                <div
                  style={{
                    width: 30,
                    color: "#ffffff",
                    textAlign: "center",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setActiveSolution("");
                  }}
                >
                  ✕
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  margin: 10,
                  flex: 1,
                }}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    openInNewTab("https://blackhealthalliance.ca/");
                  }}
                >
                  <img
                    src="https://blackhealthalliance.ca/wp-content/uploads/BHA-logo-transparent.png"
                    style={{ height: 36, margin: 10 }}
                  />
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    openInNewTab("https://www.unitedwaygt.org/");
                  }}
                >
                  <img
                    src="https://www.unitedwaygt.org/wp-content/uploads/2021/10/UnitedWay_GT_colour_horizontal-1030x301.png"
                    style={{ height: 36, margin: 10 }}
                  />
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    openInNewTab("https://torontofoundation.ca/");
                  }}
                >
                  <img
                    src="https://torontofoundation.ca/wp-content/themes/astra-child/img/tf-desktop-logo.png"
                    style={{ height: 36, margin: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;
