import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Target, Award, TrendingUp, BarChart3, PieChart, Activity, Calendar, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStats } from '../contexts/StatsContext';
import Navbar from './Navbar';

const Analytics: React.FC = () => {
  const { logActivity } = useStats();

  React.useEffect(() => {
    logActivity('Analytics page accessed', 'Analytics');
  }, [logActivity]);

  // Mock investor-focused metrics (replace with real data)
  const investorMetrics = {
    mrr: 45600, // Monthly Recurring Revenue
    growth: 32.5, // Month over month growth %
    activeUsers: 1247,
    userGrowth: 18.2,
    retention: 94.3,
    nps: 72,
    efficiency: 89.4,
    expansion: 156.7 // Revenue expansion %
  };

  const keyMetrics = [
    {
      title: 'Monthly Revenue',
      value: `$${investorMetrics.mrr.toLocaleString()}`,
      change: `+${investorMetrics.growth}%`,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      description: 'Monthly Recurring Revenue with 32.5% MoM growth'
    },
    {
      title: 'Active Users',
      value: investorMetrics.activeUsers.toLocaleString(),
      change: `+${investorMetrics.userGrowth}%`,
      trend: 'up',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      description: 'Monthly active users with strong engagement rates'
    },
    {
      title: 'User Retention',
      value: `${investorMetrics.retention}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      description: '30-day user retention rate showing product stickiness'
    },
    {
      title: 'Net Promoter Score',
      value: investorMetrics.nps,
      change: '+8 pts',
      trend: 'up',
      icon: Award,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      description: 'Customer satisfaction and likelihood to recommend'
    }
  ];

  const advancedMetrics = [
    {
      title: 'Customer Acquisition Cost',
      value: '$127',
      change: '-15.3%',
      trend: 'down',
      description: 'Cost to acquire new customers (lower is better)',
      period: 'vs last month'
    },
    {
      title: 'Customer Lifetime Value',
      value: '$2,340',
      change: '+23.7%',
      trend: 'up',
      description: 'Average revenue per customer over their lifetime',
      period: 'vs last quarter'
    },
    {
      title: 'Churn Rate',
      value: '2.1%',
      change: '-0.8%',
      trend: 'down',
      description: 'Monthly customer churn rate (lower is better)',
      period: 'vs last month'
    },
    {
      title: 'Average Revenue Per User',
      value: '$367',
      change: '+12.4%',
      trend: 'up',
      description: 'Monthly revenue per active user',
      period: 'vs last month'
    }
  ];

  const revenueBreakdown = [
    { category: 'Enterprise Plans', amount: 28500, percentage: 62.5, color: 'bg-blue-500' },
    { category: 'Professional Plans', amount: 12300, percentage: 27.0, color: 'bg-green-500' },
    { category: 'Starter Plans', amount: 3200, percentage: 7.0, color: 'bg-purple-500' },
    { category: 'Add-ons & Services', amount: 1600, percentage: 3.5, color: 'bg-orange-500' }
  ];

  const monthlyGrowthData = [
    { month: 'Jan', revenue: 32000, users: 890 },
    { month: 'Feb', revenue: 35500, users: 945 },
    { month: 'Mar', revenue: 38200, users: 1020 },
    { month: 'Apr', revenue: 41800, users: 1105 },
    { month: 'May', revenue: 44300, users: 1180 },
    { month: 'Jun', revenue: 45600, users: 1247 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link 
              to="/"
              className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Business Analytics
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Comprehensive metrics and investor insights
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {keyMetrics.map((metric) => (
            <div key={metric.title} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {metric.title}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Advanced Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Metrics</h2>
              <p className="text-gray-600 dark:text-gray-400">Deep dive into business performance indicators</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedMetrics.map((metric) => (
              <div key={metric.title} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {metric.value}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {metric.change}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {metric.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {metric.description}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {metric.period}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown and Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <PieChart className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Breakdown</h3>
            </div>
            <div className="space-y-4">
              {revenueBreakdown.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.category}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${item.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Growth Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">6-Month Growth Trend</h3>
            </div>
            <div className="space-y-4">
              {monthlyGrowthData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{data.month}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${data.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {data.users} users
                      </p>
                    </div>
                  </div>
                  {index > 0 && (
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                          +{(((data.revenue - monthlyGrowthData[index-1].revenue) / monthlyGrowthData[index-1].revenue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Position & Forecasting */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Market Position */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="h-6 w-6" />
              <h3 className="text-xl font-bold">Market Position</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-purple-100">Market Share</span>
                <span className="text-2xl font-bold">23.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-100">Rank in Category</span>
                <span className="text-2xl font-bold">#3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-100">Total Addressable Market</span>
                <span className="text-xl font-bold">$2.1B</span>
              </div>
            </div>
          </div>

          {/* Performance Score */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="h-6 w-6" />
              <h3 className="text-xl font-bold">Performance Score</h3>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">94</div>
              <p className="text-green-100 mb-4">Overall Health Score</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-100">Revenue</p>
                  <p className="font-bold">98/100</p>
                </div>
                <div>
                  <p className="text-green-100">Growth</p>
                  <p className="font-bold">92/100</p>
                </div>
                <div>
                  <p className="text-green-100">Retention</p>
                  <p className="font-bold">96/100</p>
                </div>
                <div>
                  <p className="text-green-100">Efficiency</p>
                  <p className="font-bold">89/100</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly Forecast */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="h-6 w-6" />
              <h3 className="text-xl font-bold">Q3 2025 Forecast</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-blue-100 text-sm">Projected Revenue</p>
                <p className="text-2xl font-bold">$67,200</p>
                <p className="text-blue-200 text-xs">+47% vs Q2</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Expected Users</p>
                <p className="text-2xl font-bold">1,650</p>
                <p className="text-blue-200 text-xs">+32% vs Q2</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Confidence Level</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-blue-700 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm font-bold">87%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Executive Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">$547K</p>
              <p className="text-gray-300 text-sm">Annual Recurring Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">156%</p>
              <p className="text-gray-300 text-sm">YoY Revenue Growth</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">18.4x</p>
              <p className="text-gray-300 text-sm">LTV/CAC Ratio</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">72</p>
              <p className="text-gray-300 text-sm">Net Promoter Score</p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
            <p className="text-white/90 leading-relaxed">
              <strong>Strong momentum across all key metrics.</strong> Revenue growth of 156% YoY with exceptional unit economics (LTV/CAC of 18.4x). 
              Customer satisfaction remains high with NPS of 72, and retention rates of 94.3% indicate strong product-market fit. 
              Current trajectory supports aggressive expansion into new markets and feature development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;