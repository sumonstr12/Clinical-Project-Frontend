import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler
);

// import useDashboardData from '../hooks/useDashBoardData';
import useDashboardData from '../hooks/useDashBoardData';

export default function ChartsSection() {

  const data = useDashboardData();

  if (!data) return <p>Loading...</p>;


  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: [45, 52, 38, 65, 59, 72, 48],
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // const pieChartData = {
  //   labels: ['Patients', 'Doctors', 'Caregivers'],
  //   datasets: [
  //     {
  //       data: [1245, 87, 143],
  //       backgroundColor: ['#60a5fa', '#34d399', '#a78bfa'],
  //       borderWidth: 0,
  //     },
  //   ],
  // };

  const pieChartData = {
    labels: ['Patients', 'Doctors', 'Caregivers'],
    datasets: [
      {
        data: [
          data.total_patients,
          data.total_doctors,
          data.total_caregivers
        ],
        backgroundColor: ['#60a5fa', '#34d399', '#a78bfa'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-6">Appointments Overview</h3>
        <div className="h-64">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-6">User Distribution</h3>
        <div className="h-64">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
}