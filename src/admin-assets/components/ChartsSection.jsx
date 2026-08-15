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
import { useState, useEffect } from 'react';
import myaxios from '../../assets/utilities/myaxios';
import useDashboardData from '../hooks/useDashBoardData';

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

export default function ChartsSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lineData, setLineData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [0, 0, 0, 0, 0, 0, 0]
  });
  const [days, setDays] = useState(7);
  

  const dashboardData = useDashboardData();

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
          stepSize: 1,
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

  const defaultPieData = {
    labels: ['Patients', 'Doctors', 'Caregivers'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#60a5fa', '#34d399', '#a78bfa'],
      borderWidth: 0,
    }],
  };

  const fetchLineChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await myaxios.get('/admin/dashboard/chart-data/', {
        params: {
          days: days
        }
      });

      if (response.data.status) {
        setLineData({
          labels: response.data.appointment_chart.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: response.data.appointment_chart.data || [0, 0, 0, 0, 0, 0, 0]
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch chart data');
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLineChartData();
  }, [days]);

  const lineChartData = {
    labels: lineData.labels,
    datasets: [
      {
        label: 'Appointments',
        data: lineData.data,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieChartData = dashboardData ? {
    labels: ['Patients', 'Doctors', 'Caregivers'],
    datasets: [
      {
        data: [
          dashboardData.total_patients || 0,
          dashboardData.total_doctors || 0,
          dashboardData.total_caregivers || 0
        ],
        backgroundColor: ['#60a5fa', '#34d399', '#a78bfa'],
        borderWidth: 0,
      },
    ],
  } : defaultPieData;


  if (loading || !dashboardData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Loading chart data...</div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-6">User Distribution</h3>
          <div className="h-64">
            <Pie data={defaultPieData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400">Error: {error}</div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-6">User Distribution</h3>
          <div className="h-64">
            <Pie data={defaultPieData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        >
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Appointments Overview</h3>
            <span className="text-xs text-slate-400">
              Total: {lineData.data.reduce((a, b) => a + b, 0)}
            </span>
          </div>
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
    </>
  );
}