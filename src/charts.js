import Chart from 'chart.js';
import moment from 'moment';
import 'chartjs-plugin-annotation';

export function init_chartjs() {

  // setting the globals
  Chart.defaults.global.elements.point.radius = 0;
  Chart.defaults.global.elements.line.tension = 0;
  // Chart.defaults.global.elements.line.backgroundColor = "rgba(92, 191, 255, 0.35)";
  Chart.defaults.global.elements.line.borderColor = "rgb(141, 87, 255)";
  Chart.defaults.global.elements.line.borderWidth = 2;

  // line on hover
  Chart.defaults.LineWithLine = Chart.defaults.line;
  Chart.controllers.LineWithLine = Chart.controllers.line.extend({
    draw: function (ease) {
      Chart.controllers.line.prototype.draw.call(this, ease);

      if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
        var activePoint = this.chart.tooltip._active[0],
          ctx = this.chart.ctx,
          x = activePoint.tooltipPosition().x,
          topY = this.chart.scales['y-axis-0'].top,
          bottomY = this.chart.scales['y-axis-0'].bottom;

        // drawing line for the target valueline
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(111, 111, 111, 0.9)';
        ctx.stroke();
        ctx.restore();
      }
    }
  });
}


export function build_line_chart(chart_id) {

  if (window.chart && window.chart !== null) {
    window.chart.destroy();
  }
  init_chartjs()
  // generating a fake array of 30 values
  let start = moment('2019-07-01');
  let end = moment('2019-08-01');

  let date_vals = [];
  let calories = [];
  let target = [];
  // If you want an inclusive end date (fully-closed interval)
  for (var m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
    date_vals.push(m.format('ddd, MMM D'))
    calories.push(Math.floor(Math.random() * (3400 - 2800 + 1) + 2800));
    target.push(3300);
  }
  let ctx = document.getElementById(chart_id);
  if (ctx == null) {
    return
  }

  let grad = ctx.getContext('2d').createLinearGradient(0, 0, 0, 450);

  // height: 156, grad: .3
  // height: 336, grad: .8
  // height: 456, grad: 1

  grad.addColorStop(0, 'rgba(43, 0, 255, 0.3)');
  if (!window.chart) {
    grad.addColorStop(.3, 'rgba(255,255,255,1)');
  } else {
    grad.addColorStop(Math.min(1, window.chart.height / 450), 'rgba(255,255,255,1)');
  }


  // init_chartjs();
  window.chart = new Chart(ctx, {
    type: 'LineWithLine',
    data: {
      labels: date_vals,
      datasets: [{
        label: 'Calories',
        data: calories,
        backgroundColor: grad,
        fontColor: "red"
      },
      ],
    },
    options: {
      responsive: true,
      responsiveAnimationDuration: 0,
      maintainAspectRatio: false,
      legend: {
        display: true,
      },
      title: {
        display: false,
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      tooltips: {
        enabled: true,
        mode: 'index',
        intersect: false,
        position: 'nearest',
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFontColor: "#fff",
        titleFontFamily: '-apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        titleFontStyle: "bold",
        titleFontSize: 14,
        titleMarginBottom: 6,
        bodyFontFamily: '-apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        bodyFontSize: 14,
        bodyFontColor: "#fff",
        xPadding: 20,
        yPadding: 12,
        boxShadow: '0 0 2px black',
        displayColors: false
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            beginAtZero: false,
            display: true,
            autoSkip: true,
          }
        }],
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: false,
            display: true,
            autoSkip: true,
            autoSkipPadding: 300,
            maxRotation: 0,
          },
        }]
      },
      annotation: {
        // Defines when the annotations are drawn.
        // This allows positioning of the annotation relative to the other
        // elements of the graph.
        //
        // Should be one of: afterDraw, afterDatasetsDraw, beforeDatasetsDraw
        // See http://www.chartjs.org/docs/#advanced-usage-creating-plugins
        drawTime: 'afterDatasetsDraw', // (default)

        // Array of annotation configuration objects
        // See below for detailed descriptions of the annotation options
        annotations: [{
          id: 'a-line-1', // optional
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: '3000',
          borderColor: 'rgba(0, 110, 255, 0.2)',
          borderWidth: 1,

          // Fires when the user clicks this annotation on the chart
          // (be sure to enable the event in the events array below).
          onClick: function (e) {
            // `this` is bound to the annotation element
          }
        }]
      }
    }
  });
}
