import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js/auto';
import { bgColors, borderColors } from '../constants';
import { GameModes } from '../../package';

export async function makeBattleLogGraphic(values: AverageData) {
  const width = 840;
  const height = 320;
  const configuration: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: Object.entries(values).map(
        ([mode, duration]) => `${mode} (${duration}m)`
      ),
      datasets: [
        {
          label: 'Time played (minutes)',
          data: Object.values(values),
          backgroundColor: bgColors.slice(0, values.length),
          borderColor: borderColors.slice(0, values.length),
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: true,
        },
      },
    },
    plugins: [
      {
        id: 'background-colour',
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = '#27292d';
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        },
      },
    ],
  };
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    chartCallback: (ChartJS) => {
      ChartJS.defaults.responsive = true;
      ChartJS.defaults.maintainAspectRatio = false;
      ChartJS.defaults.color = '#d6d6d6';
      ChartJS.defaults.font.size = 15;
    },
  });

  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  return buffer;
}

type AverageData = {
  [k in GameModes]: number;
};
