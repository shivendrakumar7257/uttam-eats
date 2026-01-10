import { useState } from 'react';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import OrderStatusBadge from './OrderStatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

interface OrdersTableProps {
  orders: Order[];
  onOrderUpdate: () => void;
  onViewOrder: (order: Order) => void;
}

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

const OrdersTable = ({ orders, onOrderUpdate, onViewOrder }: OrdersTableProps) => {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Order status updated');
      onOrderUpdate();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.delivery_address?.name || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">{order.delivery_address?.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                    disabled={updatingOrderId === order.id}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue>
                        <OrderStatusBadge status={order.status} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          <OrderStatusBadge status={status} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="capitalize">{order.payment_method}</p>
                    <p className="text-muted-foreground capitalize">{order.payment_status}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">₹{order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
