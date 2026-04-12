import { Users, TrendingUp, TrendingDown, Stethoscope, Heart, Calendar, AlertCircle } from 'lucide-react';
import myaxios from '../../assets/utilities/myaxios';
import { useEffect, useState } from 'react';
import useDashboardData from '../hooks/useDashBoardData';
import CardLoading from '../../LoadingSkeleton/CardLoading';

export default function StatisticsCards() {

  const data = useDashboardData();

  if (!data) return <CardLoading />;


  const cards = [
          {
            title: 'Total Users',
            value: data.total_users,
            change: '+5%',
            changeType: 'up',
            icon: Users,
            color: 'blue'
          },
          {
            title: 'Total Doctors',
            value: data.total_doctors,
            change: '+3%',
            changeType: 'up',
            icon: Stethoscope,
            color: 'green'
          },
          {
            title: 'Total Patients',
            value: data.total_patients,
            change: '+2%',
            changeType: 'up',
            icon: Users,
            color: 'purple'
          },
          {
            title: 'Total Caregivers',
            value: data.total_caregivers,
            change: '+4%',
            changeType: 'up',
            icon: Heart,
            color: 'purple'
          },
          {
            title: 'Total Approved Doctors',
            value: data.active_doctors,
            change: '+3%',
            changeType: 'up',
            icon: Stethoscope,
            color: 'blue'
          },
        ];

  const colorClasses = {
    blue: 'bg-blue-500 bg-opacity-20 text-blue-400',
    green: 'bg-green-500 bg-opacity-20 text-green-400',
    purple: 'bg-purple-500 bg-opacity-20 text-purple-400',
    orange: 'bg-orange-500 bg-opacity-20 text-orange-400',
    red: 'bg-red-500 bg-opacity-20 text-red-400',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">

      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.changeType === 'up' ? TrendingUp : TrendingDown;
        const trendColor = card.changeType === 'up' ? 'text-green-400' : 'text-red-400';

        return (
          <div key={index} className="bg-slate-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[card.color]}`}>
                <Icon className="w-6 h-6" />
              </div>

              <span className={`${trendColor} text-sm flex items-center`}>
                <TrendIcon className="w-4 h-4 mr-1" />
                {card.change}
              </span>
            </div>

            <h3 className="text-slate-400 text-sm mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        );
      })}

    </div>
  );
}