import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Histogram = ({
  isDesktop = false,
  dimensions = {},
  text = null,
  activeCategory = null,
  activeTopic = null,
  activeMetric = null,
  activeSolution = null,
  selectionConsoleVisible = null,
  metricdata = [],
  style = {},
  ...buttonProps
}) => {
  const [data, setData] = useState([]);

  const width = isDesktop
    ? dimensions.width -
      ((!!selectionConsoleVisible ? 250 : 0) +
        (!!activeSolution ? 250 : 0) +
        280)
    : dimensions.width - 40;
  const height = isDesktop ? 300 : 250;
  const paddingLeft = 2; // Shift everything to the right to avoid negative coordinates
  const paddingTop = 75; // Shift everything down to avoid negative coordinates

  const svgRef = useRef();

  useEffect(() => {
    setData(metricdata.sort((a, b) => b.value - a.value));
    if (metricdata.length > 0 && svgRef.current) {
      const svg = d3.select(svgRef.current);
      const xScale = d3
        .scaleBand()
        .domain(metricdata.map((d) => d.section))
        .range([0, width - 40])
        .padding(0); // No gaps between bars

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(metricdata, (d) => d.value)])
        .range([height, 0]);

      // Calculate mean and median
      const values = metricdata.map((d) => d.value);
      const mean = d3.mean(values);
      const median = d3.median(values);

      // Remove previous elements
      svg.selectAll("*").remove();

      // Draw bars
      svg
        .append("g")
        .selectAll("rect")
        .data(metricdata)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.section) + paddingLeft)
        .attr("y", (d) => yScale(d.value) + paddingTop)
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d.value))
        .attr(
          "fill",
          !!activeCategory
            ? text.categories[activeCategory.title.toLowerCase()].colors[1]
            : text.categories["infrastructure"].colors[1]
        )
        .on("mouseover", function (event, d) {
          d3.select(this).attr("opacity", ".5");

          // Tooltip on hover
          svg
            .append("text")
            .attr("class", "tooltip")
            .attr("x", xScale(d.section) + xScale.bandwidth() / 2 + paddingLeft)
            .attr("y", yScale(d.value) - 5 + paddingTop)
            .attr("text-anchor", "middle")
            .text(`${d.section}: ${d.value}`)
            .attr("fill", "#000000");
        })
        .on("mouseout", function (event, d) {
          d3.select(this).attr("opacity", "1");
          // Remove tooltip
          svg.select(".tooltip").remove();
        });

      // Draw mean line
      svg
        .append("line")
        .attr("x1", paddingLeft)
        .attr("x2", width - 37)
        .attr("y1", yScale(mean) + paddingTop)
        .attr("y2", yScale(mean) + paddingTop)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "6,6")
        .attr("opacity", 0.7)
        .attr("class", "mean-line");

      // Draw median line
      svg
        .append("line")
        .attr("x1", paddingLeft)
        .attr("x2", width - 37)
        .attr("y1", yScale(median) + paddingTop)
        .attr("y2", yScale(median) + paddingTop)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "8,6,2,2")
        .attr("opacity", 0.7)
        .attr("class", "median-line");

      // Draw "Max" line and label
      svg
        .append("line")
        .attr("x1", xScale(metricdata[0].section) + paddingLeft)
        .attr("x2", xScale(metricdata[0].section) + paddingLeft)
        .attr("y1", paddingTop - 50) // Extends 50px above the max bar height
        .attr("y2", height + paddingTop)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("class", "max-x-line");

      svg
        .append("text")
        .attr(
          "x",
          xScale(metricdata[0].section) +
            paddingLeft +
            8 +
            (5 + String(metricdata[0].value).length) * 7.5
        )
        .attr("y", paddingTop - 40)
        .attr("text-anchor", "end")
        .text(`Max: ${metricdata[0].value}`)
        .attr("fill", "#000000")
        .attr("font-size", "12px")
        .attr("font-family", "monospace");

      // Draw "Min" line and label
      svg
        .append("line")
        .attr(
          "x1",
          xScale(metricdata[metricdata.length - 1].section) +
            xScale.bandwidth() +
            paddingLeft
        )
        .attr(
          "x2",
          xScale(metricdata[metricdata.length - 1].section) +
            xScale.bandwidth() +
            paddingLeft
        )
        .attr("y1", paddingTop - 50) // Extends 50px above the max bar height
        .attr("y2", height + paddingTop)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("class", "min-x-line");

      svg
        .append("text")
        .attr(
          "x",
          xScale(metricdata[metricdata.length - 1].section) +
            xScale.bandwidth() +
            -(
              (5 + String(metricdata[metricdata.length - 1].value).length) *
              7
            ) -
            10
        )
        .attr("y", paddingTop - 40)
        .attr("text-anchor", "start")
        .text(`Min: ${metricdata[metricdata.length - 1].value}`)
        .attr("fill", "#000000")
        .attr("font-size", "12px")
        .attr("font-family", "monospace");

      svg
        .append("line")
        .attr("x1", paddingLeft - 1)
        .attr("x2", width - 37)
        .attr("y1", height + paddingTop)
        .attr("y2", height + paddingTop)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("class", "bottom-line");

      // Draw key

      svg
        .append("text")
        .attr("x", paddingLeft - 1)
        .attr("y", height + 95)
        .attr("text-anchor", "start")
        .text(`Mean: ${mean?.toFixed(2)}`)
        .attr("fill", "#000000")
        .attr("font-size", "12px")
        .attr("font-family", "monospace");

      svg
        .append("line")
        .attr("x1", paddingLeft - 1)
        .attr("x2", 150)
        .attr("y1", height + 100)
        .attr("y2", height + 100)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "6,6")
        .attr("opacity", 0.7)
        .attr("class", "mean-line-key");

      svg
        .append("text")
        .attr("x", paddingLeft - 1 + 170)
        .attr("y", height + 95)
        .attr("text-anchor", "start")
        .text(`Median: ${median}`)
        .attr("fill", "#000000")
        .attr("font-size", "12px")
        .attr("font-family", "monospace");

      svg
        .append("line")
        .attr("x1", paddingLeft - 1 + 170)
        .attr("x2", paddingLeft - 1 + 170 + 150)
        .attr("y1", height + 100)
        .attr("y2", height + 100)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "8,6,2,2")
        .attr("opacity", 0.7)
        .attr("class", "median-line-key");
    }
  }, [
    metricdata,
    dimensions.width,
    activeMetric,
    activeCategory,
    activeTopic,
    activeSolution,
    selectionConsoleVisible,
  ]);

  return (
    <svg
      ref={svgRef}
      width={width - 36}
      height={height + paddingTop + 90}
      style={{
        marginLeft: 0,
      }}
    ></svg>
  );
};

export default Histogram;
