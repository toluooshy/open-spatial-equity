"use es6";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import mission from "../data/menu/mission.md";
import acknowledgements from "../data/menu/acknowledgements.md";
import sources from "../data/menu/sources.md";
import act from "../data/menu/act.md";

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
  const [activeSelection, setActiveSelection] = useState("mission");
  const [markdown, setMarkdown] = useState("");

  const markdownFiles = {
    mission: mission,
    acknowledgements: acknowledgements,
    sources: sources,
    act: act,
  };

  useEffect(() => {
    fetch(markdownFiles[activeSelection])
      .then((res) => res.text())
      .then((text) => setMarkdown(text));
  }, [activeSelection]);

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
