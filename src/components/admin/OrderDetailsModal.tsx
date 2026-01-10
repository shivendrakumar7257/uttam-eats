import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import OrderStatusBadge from './OrderStatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item_image: string | null;
}

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

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, open, onClose }: OrderDetailsModalProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!order) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (error) throw error;
        setOrderItems(data || []);
      } catch (error) {
        console.error('Error fetching order items:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open && order) {
      fetchOrderItems();
    }
  }, [order, open]);

  if (!order) return null;

  const address = order.delivery_address;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Order #{order.order_number}
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Order Date</p>
              <p className="font-medium">{format(new Date(order.created_at), 'PPpp')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <p className="font-medium capitalize">{order.payment_method}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Status</p>
              <p className="font-medium capitalize">{order.payment_status}</p>
            </div>
          </div>

          <Separator />

          {/* Delivery Address */}
          <div>
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{address?.name}</p>
              <p className="text-muted-foreground">{address?.phone}</p>
              <p className="text-muted-foreground">
                {address?.address_line1}
                {address?.address_line2 && `, ${address?.address_line2}`}
              </p>
              <p className="text-muted-foreground">
                {address?.city}, {address?.state} - {address?.pincode}
              </p>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            {loading ? (
              <p className="text-muted-foreground">Loading items...</p>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.item_image && (
                      <img
                        src={item.item_image}
                        alt={item.item_name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.item_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.unit_price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">₹{item.total_price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Special Instructions */}
          {order.special_instructions && (
            <>
              <div>
                <h3 className="font-semibold mb-2">Special Instructions</h3>
                <p className="text-sm text-muted-foreground bg-accent/50 p-3 rounded-lg">
                  {order.special_instructions}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>₹{order.delivery_fee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
