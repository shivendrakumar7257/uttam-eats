import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  order_date: string;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  delivered_orders: number;
  cancelled_orders: number;
}

interface StatusCount {
  name: string;
  value: number;
  color: string;
}

const COLORS = {
  pending: '#eab308',
  confirmed: '#3b82f6',
  preparing: '#f97316',
  out_for_delivery: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [statusData, setStatusData] = useState<StatusCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch daily analytics from view
        const { data: analytics, error: analyticsError } = await supabase
          .from('order_analytics')
          .select('*')
          .limit(30);

        if (analyticsError) throw analyticsError;
        
        // Format data for charts
        const formattedData = (analytics || []).map((item) => ({
          ...item,
          order_date: format(new Date(item.order_date), 'MMM d'),
          total_revenue: Number(item.total_revenue) || 0,
          average_order_value: Number(item.average_order_value) || 0,
        })).reverse();

        setAnalyticsData(formattedData);

        // Fetch status distribution
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('status');

        if (ordersError) throw ordersError;

        const statusCounts: Record<string, number> = {};
        orders?.forEach((order) => {
          statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });

        const statusArray: StatusCount[] = Object.entries(statusCounts).map(([name, value]) => ({
          name: name.replace('_', ' '),
          value,
          color: COLORS[name as keyof typeof COLORS] || '#6b7280',
        }));

        setStatusData(statusArray);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = analyticsData.reduce((sum, d) => sum + d.total_revenue, 0);
  const totalOrders = analyticsData.reduce((sum, d) => sum + d.total_orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your restaurant's performance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Revenue (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Orders (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{avgOrderValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No data available yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="order_date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="total_revenue"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Orders Chart and Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data available yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="order_date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="total_orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data available yet</p>
            ) : (
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="capitalize">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
