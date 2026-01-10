import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-500/20 text-blue-600 border-blue-500/30' },
  preparing: { label: 'Preparing', className: 'bg-orange-500/20 text-orange-600 border-orange-500/30' },
  out_for_delivery: { label: 'Out for Delivery', className: 'bg-purple-500/20 text-purple-600 border-purple-500/30' },
  delivered: { label: 'Delivered', className: 'bg-green-500/20 text-green-600 border-green-500/30' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-600 border-red-500/30' },
};

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
