import { useState, useEffect } from "react";
import text from "./data";
import background from "./graphics/branding/background.png";
import Histogram from "./components/Histogram";
import CityMap from "./components/CityMap";
import DataTable from "./components/DataTable";
import Menu from "./components/Menu";

import { useWindowDimensions } from "./utils/CustomHooks";

const App = () => {
  const dimensions = useWindowDimensions();
  const isDesktop = dimensions.width > 850;

  const [selectionConsoleVisible, setSelectionConsoleVisible] = useState(false);
  const [activeView, setActiveView] = useState("portal");
  const [activeMetric, setActiveMetric] = useState("city_subdivision");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTopic, setActiveTopic] = useState("");
  const [activeSolution, setActiveSolution] = useState("");

  const [activeCenterpiece, setActiveCenterpiece] = useState("video"); // video, table, graph, map, or comparison - depending on view and user selection

  const views = {
    portal: "🇨🇦",
    city_data: "🏙",
    community_profiles: "🏘",
    learn_more: "📚",
  };

  const centerpieceOptions =
    activeView === "city_data" ? ["🔢", "📊", "🗺"] : ["📊", "🗺"];

  const metricdata = [
    {
      section: "A1",
      value: 7,
    },
    {
      section: "B1",
      value: 3,
    },
    {
      section: "C1",
      value: 1,
    },
    {
      section: "D1",
      value: 1.5,
    },
    {
      section: "A2",
      value: 7,
    },
    {
      section: "B2",
      value: 7,
    },
    {
      section: "C2",
      value: 6,
    },
    {
      section: "D2",
      value: 2.5,
    },
    {
      section: "D3",
      value: 9.5,
    },
  ];

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
          minWidth: "100%",
          opacity: 0.5,
          transform: "translate(-25%,-25%)",
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
                paddingTop: 10,
                flex: 1,
                width: isDesktop && 250,
              }}
            >
              {!!text.categories ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    fontSize: 15,
                    flexWrap: "wrap",
                  }}
                >
                  {Object.entries(text.categories).map((category) => (
                    <div
                      key={category}
                      style={{
                        textAlign: "center",
                        flex: 1,
                        color: "#ffffff",
                        opacity: activeCategory === category[1] ? 1 : 0.5,
                        cursor: "pointer",
                        padding: isDesktop ? 10 : 0,
                      }}
                      onClick={() => {
                        setActiveCategory(category[1]);
                        console.log(category[1]);
                      }}
                    >
                      {category[1].title}
                    </div>
                  ))}
                </div>
              ) : null}
              <div
                style={{
                  borderTop: "solid 1px #ffffff",
                  margin: 10,
                  marginBottom: 0,
                }}
              />
              {!!activeCategory && !!activeCategory.topics ? (
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
                backgroundColor:
                  selectionConsoleVisible || isDesktop
                    ? "rgba(255,255,255,.75)"
                    : "",
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
            height: isDesktop ? dimensions.height : 600,
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
            <div
              style={{
                position: "relative",
                textAlign: "center",
                margin: 30,
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
              activeView === "community_profiles" ? (
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

                  {/* metrics selector */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      fontSize: 10,
                      backgroundColor: "#000000",
                      borderRadius: 4,
                      padding: 4,
                      margin: 4,
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
                </div>
              ) : null}
              {activeCenterpiece === "video" ? (
                <iframe
                  margin="auto"
                  height={isDesktop ? dimensions.height - 100 : 490}
                  width={
                    isDesktop ? dimensions.width * 0.75 : dimensions.width - 40
                  }
                  src="https://www.youtube.com/embed/jvW3NQQuUh0?si=Tz9m-2uTDLkj2nd7"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              ) : activeCenterpiece === "table" ? (
                <DataTable
                  isDesktop={isDesktop}
                  dimensions={dimensions}
                  text={text}
                  activeCategory={activeCategory}
                  activeTopic={activeTopic}
                  activeMetric={activeMetric}
                  metricdata={metricdata}
                />
              ) : activeCenterpiece === "graph" ? (
                <Histogram
                  isDesktop={isDesktop}
                  dimensions={dimensions}
                  text={text}
                  activeCategory={activeCategory}
                  activeTopic={activeTopic}
                  activeMetric={activeMetric}
                  metricdata={metricdata}
                />
              ) : activeCenterpiece === "map" ? (
                <CityMap
                  isDesktop={isDesktop}
                  dimensions={dimensions}
                  text={text}
                  activeCategory={activeCategory}
                  activeTopic={activeTopic}
                  activeMetric={activeMetric}
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
                  metricdata={metricdata}
                />
              ) : (
                <div>comparison goes here</div>
              )}
            </div>
          </div>
        </div>
        {!!activeSolution ? (
          <div
            style={{
              zIndex: 3,
              width: isDesktop ? 380 : "100%",
              backgroundColor: isDesktop ? "rgba(255,255,255,.75)" : "",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: isDesktop ? dimensions.height - 1 : 300,
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
