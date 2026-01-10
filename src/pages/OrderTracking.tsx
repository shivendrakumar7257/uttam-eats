import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, ChefHat, Truck, CheckCircle2, Clock, MapPin, Phone, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

interface OrderItem {
  id: string;
  item_name: string;
  item_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_status: string;
  payment_method: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  special_instructions: string | null;
  estimated_delivery: string | null;
  created_at: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to view orders');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!orderId || !user) return;

    const fetchOrder = async () => {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .maybeSingle();

        if (orderError) throw orderError;
        if (!orderData) {
          toast.error('Order not found');
          navigate('/orders');
          return;
        }

        // Type assertion for the delivery_address
        const typedOrder: Order = {
          ...orderData,
          status: orderData.status as Order['status'],
          delivery_address: orderData.delivery_address as Order['delivery_address'],
        };

        setOrder(typedOrder);

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;
        setOrderItems(itemsData || []);
      } catch (error: any) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updatedOrder = payload.new as any;
          setOrder((prev) => prev ? {
            ...prev,
            ...updatedOrder,
            status: updatedOrder.status as Order['status'],
            delivery_address: updatedOrder.delivery_address as Order['delivery_address'],
          } : null);
          toast.success(`Order status updated: ${updatedOrder.status.replace('_', ' ')}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, user, navigate]);

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    if (order.status === 'cancelled') return -1;
    return statusSteps.findIndex((step) => step.key === order.status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Order not found</p>
            <Link to="/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            All Orders
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Order #{order.order_number}</h1>
              <p className="text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
            </div>
            {order.status !== 'cancelled' && order.estimated_delivery && (
              <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  Est. Delivery: {formatDate(order.estimated_delivery)}
                </span>
              </div>
            )}
          </div>

          {/* Cancelled Banner */}
          {order.status === 'cancelled' && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-8 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-destructive" />
              <p className="text-destructive font-medium">This order has been cancelled</p>
            </div>
          )}

          {/* Progress Tracker */}
          {order.status !== 'cancelled' && (
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="font-display text-xl font-semibold mb-8">Order Status</h2>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-muted hidden md:block">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <div
                        key={step.key}
                        className={`flex md:flex-col items-center gap-3 md:gap-2 ${
                          isCurrent ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        <div
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                              : isCompleted
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-sm font-medium ${isCurrent ? 'font-bold' : ''}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-display text-xl font-semibold mb-6">Order Items</h2>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-muted/30 rounded-xl"
                    >
                      {item.item_image && (
                        <img
                          src={item.item_image}
                          alt={item.item_name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">{item.item_name}</p>
                        <p className="text-muted-foreground text-sm">
                          ₹{item.unit_price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-lg">₹{item.total_price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Delivery Address</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {order.delivery_address.address_line1}
                  {order.delivery_address.address_line2 && (
                    <>, {order.delivery_address.address_line2}</>
                  )}
                  <br />
                  {order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{order.delivery_address.phone}</span>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{Number(order.delivery_fee) === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{order.total}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    Payment Method: <span className="text-foreground font-medium">
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Status: <span className={`font-medium ${
                      order.payment_status === 'paid' ? 'text-green-600' : 'text-accent'
                    }`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Special Instructions */}
              {order.special_instructions && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-2">Special Instructions</h3>
                  <p className="text-muted-foreground text-sm">{order.special_instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
