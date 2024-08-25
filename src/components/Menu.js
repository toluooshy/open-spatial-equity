"use es6";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const Menu = ({
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
  const [mission, setMission] = useState("");
  const [acknowledgements, setAcknowledgements] = useState("");
  const [sources, setSources] = useState("");
  const [act, setAct] = useState("");

  const [activeSelection, setActiveSelection] = useState("mission");
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const files = [
      `${process.env.PUBLIC_URL}/data/menu/mission.md`,
      `${process.env.PUBLIC_URL}/data/menu/acknowledgements.md`,
      `${process.env.PUBLIC_URL}/data/menu/sources.md`,
      `${process.env.PUBLIC_URL}/data/menu/act.md`,
    ];
    Promise.all(files.map((file) => fetch(file).then((res) => res.text())))
      .then(([missionText, acknowledgementsText, sourcesText, actText]) => {
        setMission(missionText);
        setAcknowledgements(acknowledgementsText);
        setSources(sourcesText);
        setAct(actText);
      })
      .catch((error) =>
        console.error("Failed to fetch markdown files:", error)
      );
  }, []);

  useEffect(() => {
    const markdownFiles = {
      mission: mission,
      acknowledgements: acknowledgements,
      sources: sources,
      act: act,
    };
    setMarkdown(markdownFiles[activeSelection]);
    console.log(mission);
    console.log(activeSelection);
    console.log(markdownFiles[activeSelection]);
  }, [activeSelection, mission, acknowledgements, sources, act]);

  return (
    <div
      style={{
        width: isDesktop
          ? dimensions.width * 0.75 - 250
          : dimensions.width - 40,
        height: isDesktop ? dimensions.height - 120 : 490,
        padding: 10,
        ...style,
        textAlign: "left",
        backgroundColor: "rgba(255,255,255,.75)",
      }}
    >
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {Object.keys(text.menu).map((option, index) => (
            <div
              style={{
                cursor: "pointer",
                textDecoration:
                  activeSelection === option ? "underline" : "none",
              }}
              onClick={() => {
                setActiveSelection(option);
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "solid 1px #000000",
            margin: 10,
            marginBottom: 0,
          }}
        />
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Menu;
