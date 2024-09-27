import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import * as d3 from 'd3';

Chart.register(...registerables);

function HomePage() {
  const [chartData, setChartData] = useState(null);
  const chartJsRef = useRef(null);  // Reference for the Chart.js canvas
  const d3ChartRef = useRef(null);  // Reference for the D3.js svg
  const chartInstanceRef = useRef(null);  // Reference to store the Chart.js instance

  // Fetch budget data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:4000/budget");
        const budgetData = response.data.myBudget;
        setChartData(budgetData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, []);

  // Render Chart.js Pie Chart
  useEffect(() => {
    if (chartData && chartJsRef.current) {
      const titles = chartData.map(item => item.title);
      const budgets = chartData.map(item => item.budget);

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Destroy previous chart instance if it exists
      }

      const ctx = chartJsRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: titles,
          datasets: [{
            data: budgets,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Budget Distribution - Chart.js'
            }
          }
        }
      });
    }

    // Cleanup function to destroy the chart instance on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  // Render D3 Pie Chart
  useEffect(() => {
    if (chartData && d3ChartRef.current) {
      drawD3Chart(chartData);
    }
  }, [chartData]);

  const drawD3Chart = (data) => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.title))
      .range(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.budget)(data);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const svg = d3.select(d3ChartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    svg.selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.title))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    svg.selectAll('text')
      .data(pie)
      .enter()
      .append('text')
      .text(d => `${d.data.title}: ${d.data.budget}`)
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 12);
  };


  return (
    <div>
      <main className="center" id="main">
        <div className="page-area">
          <article>
            <h1>Stay on track</h1>
            <p>
              Do you know where you are spending your money? If you really stop to track it down,
              you would get surprised! Proper budget management depends on real data... and this
              app will help you with that!
            </p>
          </article>
        
          <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </article>
    
            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    

            <article>
            <h1>Chart.js Pie Chart</h1>
            {chartData ? (
              <canvas ref={chartJsRef} width="400" height="400"></canvas>
            ) : (
              <p>Loading Chart.js chart...</p>
            )}
          </article>

          {/* D3.js Pie Chart */}
          <article>
            <h1>D3.js Pie Chart</h1>
            {chartData ? (
              <svg ref={d3ChartRef}></svg>
            ) : (
              <p>Loading D3 chart...</p>
            )}
          </article>

        </div>
      </main>
    </div>
  );
}

export default HomePage;
