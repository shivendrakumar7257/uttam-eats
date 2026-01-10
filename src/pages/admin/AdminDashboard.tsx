import { useEffect, useState } from 'react';
import { ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import OrdersTable from '@/components/admin/OrdersTable';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: OrderStatus;
  payment_method: string;
  payment_status: string;
  total: number;
  subtotal: number;
  delivery_fee: number;
  special_instructions: string | null;
  delivery_address: {
    name?: string;
    phone?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const typedOrders = (data || []).map(order => ({
        ...order,
        delivery_address: order.delivery_address as Order['delivery_address']
      }));
      
      setOrders(typedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: allOrders, error } = await supabase
        .from('orders')
        .select('total, status');

      if (error) throw error;

      const totalOrders = allOrders?.length || 0;
      const totalRevenue = allOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const pendingOrders = allOrders?.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing').length || 0;
      const deliveredOrders = allOrders?.filter(o => o.status === 'delivered').length || 0;

      setStats({
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleOrderUpdate = () => {
    fetchOrders();
    fetchStats();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={TrendingUp}
        />
        <StatsCard
          title="Delivered Orders"
          value={stats.deliveredOrders}
          icon={Package}
        />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading orders...</p>
        ) : (
          <OrdersTable
            orders={orders}
            onOrderUpdate={handleOrderUpdate}
            onViewOrder={setSelectedOrder}
          />
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default AdminDashboard;
