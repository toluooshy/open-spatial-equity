"use es6";

import React from "react";

const DataTable = ({
  isDesktop = false,
  dimensions = {},
  text = null,
  activeCategory = null,
  activeTopic = null,
  activeMetric = null,
  activeSolution = null,
  activeBoroughs = false,
  selectionConsoleVisible = null,
  metricdata = [],
  neighbourhoods = {},
  subdivisions = {},
  style = {},
  ...buttonProps
}) => {
  // Sort the data by value in descending order
  const sortedData = metricdata.sort((a, b) => b.value - a.value);

  return (
    <div style={{ ...style }}>
      <table
        style={{
          width: isDesktop
            ? dimensions.width -
              ((!!selectionConsoleVisible ? 250 : 0) +
                (!!activeSolution ? 250 : 0) +
                310)
            : dimensions.width - 40,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
                borderBottom: "2px solid #000",
              }}
            >
              Rank
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
                borderBottom: "2px solid #000",
              }}
            >
              Value
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
                borderBottom: "2px solid #000",
              }}
            >
              Section
            </th>
          </tr>
        </thead>
      </table>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {item.value}
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {item.section}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
