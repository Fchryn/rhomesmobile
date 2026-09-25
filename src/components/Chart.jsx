import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
export const ChartKunjungan = ({chartDataKunjungan, chartOptionKunjungan}) => {
  return (
      <Bar
        data={chartDataKunjungan}
        options={chartOptionKunjungan}
        // height={1000}
      />
  );
};
export const ChartTindakan = ({chartDataTindakan, chartOptionTindakan}) => {
  return (
      <Bar
        data={chartDataTindakan}
        options={chartOptionTindakan}
      />
  );
};
export const ChartGender = ({chartDataGender, chartOptionGender}) => {
  return (
      <Pie
        data={chartDataGender}
        options={chartOptionGender}
      />
  );
};
export const ChartPenyakit = ({chartDataPenyakit, chartOptionPenyakit}) => {
  return (
      <Bar
        data={chartDataPenyakit}
        options={chartOptionPenyakit}
      />
  );
};
export const ChartPekerjaan = ({chartDataPekerjaan, chartOptionPekerjaan}) => {
  return (
      <Bar
        data={chartDataPekerjaan}
        options={chartOptionPekerjaan}
      />
  );
};
