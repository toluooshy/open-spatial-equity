import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Histogram = ({
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
  const [data, setData] = useState(
    metricdata.sort((a, b) => b.value - a.value)
  );
  const colors = ["#c3b091"];

  const width = isDesktop
    ? dimensions.width * 0.75 - 215
    : dimensions.width - 40;
  const height = 250;
  const paddingLeft = 2; // Shift everything to the right to avoid negative coordinates
  const paddingTop = 75; // Shift everything down to avoid negative coordinates

  const svgRef = useRef();

  useEffect(() => {
    if (data && svgRef.current) {
      const svg = d3.select(svgRef.current);

      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.section))
        .range([0, width - 40])
        .padding(0); // No gaps between bars

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .range([height, 0]);

      // Calculate mean and median
      const values = data.map((d) => d.value);
      const mean = d3.mean(values);
      const median = d3.median(values);

      // Remove previous elements
      svg.selectAll("*").remove();

      // Draw bars
      svg
        .append("g")
        .selectAll("rect")
        .data(data)
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
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.7)
        .attr("class", "median-line");

      svg
        .append("text")
        .attr("x", width - 106)
        .attr("y", yScale(mean) + paddingTop - 6)
        .attr("text-anchor", "start")
        .text(`Mean: ${mean.toFixed(2)}`)
        .attr("fill", "#000000")
        .attr("font-size", "12px");

      // Draw median line
      svg
        .append("line")
        .attr("x1", paddingLeft)
        .attr("x2", width - 37)
        .attr("y1", yScale(median) + paddingTop)
        .attr("y2", yScale(median) + paddingTop)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.7)
        .attr("class", "median-line");

      svg
        .append("text")
        .attr("x", width - 116)
        .attr("y", yScale(median) + paddingTop - 6)
        .attr("text-anchor", "start")
        .text(`Median: ${median.toFixed(2)}`)
        .attr("fill", "#000000")
        .attr("font-size", "12px");

      // Draw "Most" line and label
      svg
        .append("line")
        .attr("x1", xScale(data[0].section) + paddingLeft)
        .attr("x2", xScale(data[0].section) + paddingLeft)
        .attr("y1", paddingTop - 50) // Extends 50px above the max bar height
        .attr("y2", height + paddingTop)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("class", "most-x-line");

      svg
        .append("text")
        .attr("x", xScale(data[0].section) + paddingLeft + 60)
        .attr("y", paddingTop - 40)
        .attr("text-anchor", "end")
        .text(`Most: ${data[0].value}`)
        .attr("fill", "#000000")
        .attr("font-size", "12px");

      // Draw "Least" line and label
      svg
        .append("line")
        .attr(
          "x1",
          xScale(data[data.length - 1].section) +
            xScale.bandwidth() +
            paddingLeft
        )
        .attr(
          "x2",
          xScale(data[data.length - 1].section) +
            xScale.bandwidth() +
            paddingLeft
        )
        .attr("y1", paddingTop - 50) // Extends 50px above the max bar height
        .attr("y2", height + paddingTop)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("class", "least-x-line");

      svg
        .append("text")
        .attr(
          "x",
          xScale(data[data.length - 1].section) +
            xScale.bandwidth() +
            paddingLeft +
            -50
        )
        .attr("y", paddingTop - 40)
        .attr("text-anchor", "start")
        .text(`Least: ${data[data.length - 1].value}`)
        .attr("fill", "#000000")
        .attr("font-size", "12px");

      svg
        .append("line")
        .attr("x1", paddingLeft - 1)
        .attr("x2", width - 37)
        .attr("y1", height + paddingTop)
        .attr("y2", height + paddingTop)
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("class", "bottom-line");
    }
  }, [data, dimensions.width, activeMetric, activeCategory, activeTopic]);

  return (
    <svg
      ref={svgRef}
      width={width - 36}
      height={height + paddingTop + 50}
      style={{ marginLeft: 0 }}
    ></svg>
  );
};

export default Histogram;
