import React, { useState, useEffect } from 'react';
import { Activity, Cpu, MemoryStick as Memory, Zap, TrendingUp, TrendingDown, AlertTriangle, Play, Pause, RotateCcw, Settings, Download } from 'lucide-react';

interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeConnections: number;
  timestamp: string;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    responseTime: 0,
    throughput: 0,
    errorRate: 0,
    activeConnections: 0,
    timestamp: new Date().toISOString()
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(2000);
  const [showSettings, setShowSettings] = useState(false);
  const [alertThresholds, setAlertThresholds] = useState({
    cpuUsage: 80,
    memoryUsage: 85,
    responseTime: 1000,
    errorRate: 5
  });
  const [maxDataPoints, setMaxDataPoints] = useState(20);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring) {
      interval = setInterval(() => {
        fetchMetrics();
      }, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, refreshInterval]);

  const fetchMetrics = async () => {
    const startTime = Date.now();
    
    try {
      // Try to fetch from backend first
      const response = await fetch('http://localhost:8000/api/metrics');
      let newMetrics: PerformanceMetrics;
      
      if (response.ok) {
        const data = await response.json();
        const fetchTime = Date.now() - startTime;
        
        newMetrics = {
          cpuUsage: data.cpu_usage || Math.random() * 100,
          memoryUsage: data.memory_usage || Math.random() * 100,
          responseTime: data.response_time || fetchTime,
          throughput: data.throughput || Math.random() * 1000 + 500,
          errorRate: data.error_rate || Math.random() * 5,
          activeConnections: data.active_connections || Math.floor(Math.random() * 100) + 10,
          timestamp: new Date().toISOString()
        };
        
        // Log actual response time
        console.log(`API response time: ${fetchTime}ms`);
      } else {
        // Fallback to simulated data
        newMetrics = generateSimulatedMetrics();
      }
      
      setCurrentMetrics(newMetrics);
      setMetrics(prev => [...prev.slice(-(maxDataPoints - 1)), newMetrics]);
      
      // Check for alerts
      checkAlerts(newMetrics);
      
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Use simulated data as fallback
      const newMetrics = generateSimulatedMetrics();
      setCurrentMetrics(newMetrics);
      setMetrics(prev => [...prev.slice(-(maxDataPoints - 1)), newMetrics]);
      checkAlerts(newMetrics);
    }
  };

  const generateSimulatedMetrics = (): PerformanceMetrics => {
    return {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      responseTime: Math.random() * 1000 + 100,
      throughput: Math.random() * 1000 + 500,
      errorRate: Math.random() * 5,
      activeConnections: Math.floor(Math.random() * 100) + 10,
      timestamp: new Date().toISOString()
    };
  };

  const checkAlerts = (newMetrics: PerformanceMetrics) => {
    const newAlerts: SystemAlert[] = [];

    if (newMetrics.cpuUsage > alertThresholds.cpuUsage) {
      newAlerts.push({
        id: `cpu-${Date.now()}`,
        type: 'warning',
        message: `High CPU usage detected: ${newMetrics.cpuUsage.toFixed(1)}%`,
        timestamp: new Date().toISOString()
      });
    }

    if (newMetrics.memoryUsage > alertThresholds.memoryUsage) {
      newAlerts.push({
        id: `memory-${Date.now()}`,
        type: 'warning',
        message: `High memory usage detected: ${newMetrics.memoryUsage.toFixed(1)}%`,
        timestamp: new Date().toISOString()
      });
    }

    if (newMetrics.responseTime > alertThresholds.responseTime) {
      newAlerts.push({
        id: `response-${Date.now()}`,
        type: 'error',
        message: `Slow response time: ${newMetrics.responseTime.toFixed(0)}ms`,
        timestamp: new Date().toISOString()
      });
    }

    if (newMetrics.errorRate > alertThresholds.errorRate) {
      newAlerts.push({
        id: `error-${Date.now()}`,
        type: 'error',
        message: `High error rate: ${newMetrics.errorRate.toFixed(1)}%`,
        timestamp: new Date().toISOString()
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)]);
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      // Initialize with some sample data
      const initialMetrics = Array.from({ length: 10 }, (_, i) => ({
        cpuUsage: Math.random() * 60 + 20,
        memoryUsage: Math.random() * 70 + 15,
        responseTime: Math.random() * 500 + 200,
        throughput: Math.random() * 800 + 400,
        errorRate: Math.random() * 2,
        activeConnections: Math.floor(Math.random() * 50) + 20,
        timestamp: new Date(Date.now() - (9 - i) * 2000).toISOString()
      }));
      setMetrics(initialMetrics);
    }
  };

  const resetData = () => {
    setMetrics([]);
    setAlerts([]);
    setCurrentMetrics({
      cpuUsage: 0,
      memoryUsage: 0,
      responseTime: 0,
      throughput: 0,
      errorRate: 0,
      activeConnections: 0,
      timestamp: new Date().toISOString()
    });
  };

  const exportData = () => {
    const data = {
      metrics,
      alerts,
      exportTime: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `performance_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getMetricTrend = (metricName: keyof PerformanceMetrics) => {
    if (metrics.length < 2) return 'stable';
    const current = metrics[metrics.length - 1][metricName] as number;
    const previous = metrics[metrics.length - 2][metricName] as number;
    return current > previous ? 'up' : current < previous ? 'down' : 'stable';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Activity className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    trend: string;
    color: string;
    threshold?: number;
  }> = ({ title, value, unit, icon, trend, color, threshold }) => (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${
      threshold && value > threshold ? 'border-red-300 bg-red-50' : ''
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
          {threshold && value > threshold && <AlertTriangle className="w-4 h-4 text-red-500" />}
        </div>
      </div>
      <div className="flex items-baseline space-x-1">
        <span className={`text-2xl font-bold ${color}`}>
          {value.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      {threshold && (
        <div className="mt-1 text-xs text-gray-500">
          Threshold: {threshold}{unit}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMonitoring}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}</span>
          </button>
          
          <button
            onClick={resetData}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-md transition-colors ${
              showSettings ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Last updated: {new Date(currentMetrics.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Monitor Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refresh Interval (ms)
              </label>
              <input
                type="number"
                min="500"
                max="10000"
                step="500"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Data Points
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={maxDataPoints}
                onChange={(e) => setMaxDataPoints(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPU Alert Threshold (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={alertThresholds.cpuUsage}
                onChange={(e) => setAlertThresholds(prev => ({ ...prev, cpuUsage: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Memory Alert Threshold (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={alertThresholds.memoryUsage}
                onChange={(e) => setAlertThresholds(prev => ({ ...prev, memoryUsage: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Response Time Alert (ms)
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                value={alertThresholds.responseTime}
                onChange={(e) => setAlertThresholds(prev => ({ ...prev, responseTime: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Error Rate Alert (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={alertThresholds.errorRate}
                onChange={(e) => setAlertThresholds(prev => ({ ...prev, errorRate: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="CPU Usage"
          value={currentMetrics.cpuUsage}
          unit="%"
          icon={<Cpu className="w-5 h-5 text-blue-500" />}
          trend={getMetricTrend('cpuUsage')}
          color="text-blue-600"
          threshold={alertThresholds.cpuUsage}
        />
        <MetricCard
          title="Memory Usage"
          value={currentMetrics.memoryUsage}
          unit="%"
          icon={<Memory className="w-5 h-5 text-green-500" />}
          trend={getMetricTrend('memoryUsage')}
          color="text-green-600"
          threshold={alertThresholds.memoryUsage}
        />
        <MetricCard
          title="Response Time"
          value={currentMetrics.responseTime}
          unit="ms"
          icon={<Zap className="w-5 h-5 text-yellow-500" />}
          trend={getMetricTrend('responseTime')}
          color="text-yellow-600"
          threshold={alertThresholds.responseTime}
        />
        <MetricCard
          title="Throughput"
          value={currentMetrics.throughput}
          unit="req/s"
          icon={<Activity className="w-5 h-5 text-purple-500" />}
          trend={getMetricTrend('throughput')}
          color="text-purple-600"
        />
        <MetricCard
          title="Error Rate"
          value={currentMetrics.errorRate}
          unit="%"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          trend={getMetricTrend('errorRate')}
          color="text-red-600"
          threshold={alertThresholds.errorRate}
        />
        <MetricCard
          title="Active Connections"
          value={currentMetrics.activeConnections}
          unit=""
          icon={<Activity className="w-5 h-5 text-indigo-500" />}
          trend={getMetricTrend('activeConnections')}
          color="text-indigo-600"
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trends</h3>
        <div className="h-64 flex items-end justify-between space-x-1">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center space-y-1 flex-1">
              <div className="w-full flex flex-col items-center space-y-1">
                <div
                  className="w-full bg-blue-500 rounded-t cursor-pointer hover:bg-blue-600 transition-colors"
                  style={{ height: `${(metric.cpuUsage / 100) * 100}px` }}
                  title={`CPU: ${metric.cpuUsage.toFixed(1)}%`}
                ></div>
                <div
                  className="w-full bg-green-500 cursor-pointer hover:bg-green-600 transition-colors"
                  style={{ height: `${(metric.memoryUsage / 100) * 80}px` }}
                  title={`Memory: ${metric.memoryUsage.toFixed(1)}%`}
                ></div>
                <div
                  className="w-full bg-yellow-500 rounded-b cursor-pointer hover:bg-yellow-600 transition-colors"
                  style={{ height: `${(metric.responseTime / 1000) * 60}px` }}
                  title={`Response: ${metric.responseTime.toFixed(0)}ms`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 transform rotate-45 origin-left">
                {new Date(metric.timestamp).toLocaleTimeString().slice(0, 5)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>CPU Usage</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Memory Usage</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Response Time</span>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            System Alerts ({alerts.length})
          </h3>
          {alerts.length > 0 && (
            <button
              onClick={clearAlerts}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No alerts at this time.
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start justify-between p-3 rounded-lg ${
                  alert.type === 'error' ? 'bg-red-50 border border-red-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitor;