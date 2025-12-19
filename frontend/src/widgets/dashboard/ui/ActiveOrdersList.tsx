import { Link } from 'react-router-dom';
import type { Order } from '@/entities/order';

interface ActiveOrdersListProps {
  orders: Order[];
  userRole: 'client' | 'freelancer';
}

export function ActiveOrdersList({ orders, userRole }: ActiveOrdersListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Orders</h3>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No active orders</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {userRole === 'freelancer' ? `Client: ${order.buyer_name}` : `Freelancer: ${order.seller_name}`}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Due: {new Date(order.delivery_date || '').toLocaleDateString()}
                </span>
                <span className="font-bold text-gray-900">${order.amount}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
