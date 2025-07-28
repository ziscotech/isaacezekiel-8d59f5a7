import React, { useState, useEffect } from 'react';
import { Users, UserCheck, HandCoins, PiggyBank } from 'lucide-react';
import { apiService, DashboardStats } from '../services/api';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="lendsqr-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-medium text-lendsqr-gray uppercase tracking-wider mb-2">
          {title}
        </p>
        <p className="text-2xl font-bold text-lendsqr-navy">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await apiService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="lendsqr-card p-6">
                <div className="w-10 h-10 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-lendsqr-navy mb-6">Users</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Users"
          value={stats?.totalUsers.toLocaleString() || '0'}
          icon={Users}
          color="bg-pink-500"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers.toLocaleString() || '0'}
          icon={UserCheck}
          color="bg-purple-500"
        />
        <StatCard
          title="Users with Loans"
          value={stats?.usersWithLoans.toLocaleString() || '0'}
          icon={HandCoins}
          color="bg-orange-500"
        />
        <StatCard
          title="Users with Savings"
          value={stats?.usersWithSavings.toLocaleString() || '0'}
          icon={PiggyBank}
          color="bg-pink-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;