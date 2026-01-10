-- Fix the security definer view issue by using SECURITY INVOKER (default)
DROP VIEW IF EXISTS public.order_analytics;

-- Recreate view with explicit SECURITY INVOKER
CREATE VIEW public.order_analytics 
WITH (security_invoker = true)
AS
SELECT 
  DATE(created_at) as order_date,
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  AVG(total) as average_order_value,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
FROM public.orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- Grant access to the view
GRANT SELECT ON public.order_analytics TO authenticated;