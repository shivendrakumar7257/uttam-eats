-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy for users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy for admins to manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create a view for order analytics (using correct column name 'total')
CREATE OR REPLACE VIEW public.order_analytics AS
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

-- Create policy to allow admins to view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create policy to allow admins to update all orders
CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create policy to allow admins to view all order items
CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));