import React, { useContext, useRef } from "react";
import { Context } from "../../context/Context";
import styles from "./BarChart.module.css";
import { Bar, Chart } from "react-chartjs-2";

const BarChart = (props) => {
  const ref = useRef();
  console.log(Chart);
  const { chartdata } = props;
  //console.log(chartdata);
  const [
    setIndicatorsData,
    statusVisible,
    setStatusVisible,
    labelsIndicators,
    setLabelIndicators,
  ] = useContext(Context);

  // Get Parameters from chartData
  const getParametrsArray = (params, param) => {
    const array = [];
    params.map((x) => {
      return array.push(x[param]);
    });
    return array;
  };

  const getParametrsSelect = (params) => {
    const labels = [];
    params.map((x, index) => {
      return labels.push({
        id: index,
        label: x,
      });
    });
    return labels;
  };

  const labels = getParametrsArray(chartdata, "stage");
  const dataLinesBlue = getParametrsArray(chartdata, "value");
  const dataLinesPurple = getParametrsArray(chartdata, "average");
  //console.log(labels, dataLinesBlue, dataLinesPurple);
  //console.log(labelsIndicators);

  // Plugins for Chart
  /* columns background */
  const chartAreaCols = {
    id: "chartAreaCols",
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      ctx.save();

      for (var i = 0; i < 7; i++) {
        // for (var j = 0; j < 3; j++) {
        ctx.beginPath();
        var x = left + (width / 7) * i; // x coordinate
        var y = top; // y coordinate
        var widthRect = width / 7;
        var heightRect = height;

        ctx.rect(x, y, widthRect, heightRect);

        if (i % 2) {
          // ctx.fillStyle = "#E7EBEF";
          // ctx.fill();
        } else {
          ctx.fillStyle = "#E7EBEF";
          ctx.fillStyle = "rgba(231, 235, 239, 0.5)";
          ctx.fill();
          // ctx.stroke();
        }
        // }
      }

      ctx.restore();
    },
  };

  Chart.register({ chartAreaCols });

  /* html legend */
  const getOrCreateLegendList = (chart, id) => {
    //console.log(chart);
    const legendContainer = document.getElementById(id);

    let listContainer;

    if (legendContainer) {
      listContainer = legendContainer.querySelector("ul");
    }

    if (!listContainer) {
      listContainer = document.createElement("ul");
      listContainer.style.display = "flex";
      listContainer.style.flexDirection = "row";
      listContainer.style.margin = 0;
      listContainer.style.padding = 0;

      if (legendContainer) {
        legendContainer.appendChild(listContainer);
      }
      //legendContainer.appendChild(listContainer);
    }

    return listContainer;
  };

  const htmlLegendPlugin = {
    id: "htmlLegend",
    afterUpdate(chart, args, options) {
      const ul = getOrCreateLegendList(chart, options.containerID);

      // Remove old legend items
      while (ul.firstChild) {
        ul.firstChild.remove();
      }

      // Reuse the built-in legendItems generator
      const items = chart.options.plugins.legend.labels.generateLabels(chart);

      items.forEach((item) => {
        const li = document.createElement("li");
        li.style.alignItems = "center";
        li.style.cursor = "pointer";
        li.style.display = "flex";
        li.style.flexDirection = "row";
        li.style.marginLeft = "30px";

        li.onclick = () => {
          const { type } = chart.config;
          if (type === "pie" || type === "doughnut") {
            // Pie and doughnut charts only have a single dataset and visibility is per item
            chart.toggleDataVisibility(item.index);
          } else {
            chart.setDatasetVisibility(
              item.datasetIndex,
              !chart.isDatasetVisible(item.datasetIndex)
            );
          }
          chart.update();
        };

        // Color box
        const boxSpan = document.createElement("span");
        boxSpan.style.background = item.fillStyle;
        boxSpan.style.borderColor = item.strokeStyle;
        boxSpan.style.borderWidth = item.lineWidth + "px";
        boxSpan.style.display = "inline-block";
        boxSpan.style.height = "20px";
        boxSpan.style.marginRight = "10px";
        boxSpan.style.width = "20px";
        boxSpan.style.borderRadius = "50%";

        // Text
        const textContainer = document.createElement("p");
        textContainer.style.color = item.fontColor;
        textContainer.style.margin = 0;
        textContainer.style.padding = 0;
        textContainer.style.textDecoration = item.hidden ? "line-through" : "";

        const text = document.createTextNode(item.text);
        textContainer.appendChild(text);

        li.appendChild(boxSpan);
        li.appendChild(textContainer);
        ul.appendChild(li);
      });
    },
  };

  Chart.register({ htmlLegendPlugin });

  const options = {
    radius: 6,
    pointHoverRadius: 6,
    responsive: true,
    plugins: {
      chartAreaCols: {
        id: "chartAreaCols",
      },
      htmlLegend: {
        containerID: "legend-container",
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    // animations: {
    //   y: {
    //     easing: "easeInOutElastic",
    //     from: (ctx) => {
    //       if (ctx.type === "data") {
    //         if (ctx.mode === "default" && !ctx.dropped) {
    //           ctx.dropped = true;
    //           return 0;
    //         }
    //       }
    //     },
    //   },
    // },
    scales: {
      y: {
        type: "linear",
        min: 0,
        max: 8,
        ticks: {
          color: "#959A9E",
          size: 14,
          padding: 10,
        },
        grid: {
          color: "#E7EBEF",
          borderColor: "#FFFFFF",
        },
      },
      x: {
        grid: {
          display: false,
          borderColor: "#E7EBEF",
        },
        ticks: {
          tickColor: "red",
          align: "center",
          padding: 0,
          color: "#959A9E",
        },
      },
    },
  };

  const data = () => {
    return {
      labels: labels,
      options: { options },
      plugins: [htmlLegendPlugin, chartAreaCols],
      datasets: [
        {
          label: "my first dataset",
          backgroundColor: "#36B5EB",
          borderColor: "#36B5EB",
          data: dataLinesBlue,
          borderWidth: 1,
          type: "line",
        },
        {
          label: "average in the system",
          data: dataLinesPurple,
          backgroundColor: "#9a3c86",
          borderColor: "#9a3c86",
          borderWidth: 1,
          type: "line",
        },
      ],
    };
  };

  const getElementsAtEvent = (elements) => {
    if (!elements.length) return;

    const { index } = elements[0];
    //console.log(index);

    const label = ref.current.config._config.data.labels[index];
    const blueLine = ref.current.config._config.data.datasets[0].data[index];
    const purpleLine = ref.current.config._config.data.datasets[1].data[index];
    console.log(label, blueLine, purpleLine);

    // console.log(labelsIndicators);
    // console.log(1);

    const labelsSelect = getParametrsSelect(labels);

    setLabelIndicators({
      ...labelsIndicators,
      labels: labelsSelect,
      labelActive: index,
    });

    setIndicatorsData([
      {
        code: "RI-PS-001",
        description:
          "Short or inadequate notice to bidders to submit expressions of interest or bids",
        cases: 2,
      },
      {
        code: "RI-PS-003",
        description: "Splitting purchases to avoid procurement thresholds",
        cases: 1,
      },
      {
        code: "RI-PS-005",
        description:
          "Direct awards in contravention to the provisions of the procurement plan",
        cases: 7,
      },
    ]);

    setStatusVisible({
      ...statusVisible,
      chart: false,
      indicators: true,
    });
  };

  // new Chart(ref, {
  //   data: data,
  //   options: options,
  //   getElementsAtEvent: getElementsAtEvent,
  // });

  return (
    <div className={styles.chart}>
      <div className={styles.chart__top}>
        <h2 className={styles.chart__h2}>Red Flags Dynamics</h2>
        <div id="legend-container"></div>
      </div>
      <Bar
        ref={ref}
        data={data}
        options={options}
        getElementsAtEvent={getElementsAtEvent}
      />
    </div>
  );
};

export default BarChart;
