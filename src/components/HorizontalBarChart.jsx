import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { csv } from 'd3-fetch'
import PropTypes from "prop-types";
import { Chart, registerables } from "chart.js";
import datalabels from "chartjs-plugin-datalabels";


Chart.register(...registerables);


const HorizontalBarChart = ({ countryCode }) => {
  const [rawData, setRawData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const handleCsvData = (data) => {
    setRawData((prev) => [...prev, data]);
  };

  useEffect(() => {
    csv(`output.csv`, (result) => {
      handleCsvData(result);
    });
  }, []);

  if(rawData?.length == 2260 && !attempted){

    const filteredData = rawData.filter(
      (item) => item.iso_3digit_alpha == countryCode.toUpperCase()
    );

    const sortedData = filteredData.sort((a, b) => b.RCA - a.RCA).slice(0, 10);
  
    const labels = sortedData.map(
      (item) => item["product_description"]
    );

    const specializationIndex = sortedData.map((item) => item.RCA);

    setChartData({
      labels,
      datasets: [
        {
          label: "Specialization Index",
          data: specializationIndex,
          tooltip: sortedData,
          // pointBackgroundColor: ["#ff0000", "#00ff00", "#0000ff"],
          backgroundColor: Array(10).fill("rgba(75, 192, 192, 0.2)"),
          borderColor: Array(10).fill("rgba(75, 192, 192, 1)"),
          borderWidth: 1,
          axis: "y",
        },
      ],

    });
    setAttempted(true);
  }

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Specialization Index based on RSA", // Set the title text
          align: "center", // Align title to the right
          color: "black", // Make the title blue
          font: {
            size: 16, // Increase font size
            weight: "bold", // Make the font bold
          },
        },
        ticks: {
          beginAtZero: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Most Specialized Products", // Set the title text
          align: "center", // Align title to the right
          color: "black", // Make the title blue
          font: {
            size: 16, // Increase font size
            weight: "bold", // Make the font bold
          },
        },
      },
    },
    plugins: {
      // datalabels: {
      //   anchor: "center",
      //   align: "center",
      //   formatter: (value, context) =>
      //     context.chart.data.labels[context.dataIndex],
      // },
      tooltip: {
        callbacks: {
          label: (context) => {
            // const data = context?.dataset?.data?.[context?.dataIndex];
            // const label = context?.dataset?.label;
            const product = context?.dataset?.tooltip?.[context?.dataIndex];

            return `(RCA: ${product?.RCA}, % Share: ${product?.percent_share}, % Expected Share: ${product?.expected_share})`;
          },
        },
      },
    },
    indexAxis: "y",
  };

  return <div>{chartData && <Bar data={chartData} options={options} />}</div>;
};

HorizontalBarChart.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default HorizontalBarChart;