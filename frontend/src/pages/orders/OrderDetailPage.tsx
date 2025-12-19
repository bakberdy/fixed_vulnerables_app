import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '@/shared/api/client';
import { useAuth } from '@/app/providers/AuthProvider';
import { FileUpload } from '@/shared/ui';
import type { Order } from '@/entities/order';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(newStatus: Order['status']) {
    if (!order) return;
    
    setUpdating(true);
    try {
      const response = await apiClient.put(`/orders/${order.id}`, { status: newStatus });
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  }

  async function markAsDelivered() {
    await updateOrderStatus('delivered');
  }

  async function markAsCompleted() {
    await updateOrderStatus('completed');
  }

  async function cancelOrder() {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    await updateOrderStatus('cancelled');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Order not found</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  const isSeller = user?.id === order.seller_id;
  const isBuyer = user?.id === order.buyer_id;
  const canDeliver = isSeller && order.status === 'in_progress';
  const canComplete = isBuyer && order.status === 'delivered';
  const canCancel = (isBuyer || isSeller) && (order.status === 'pending' || order.status === 'in_progress');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.id}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">${order.amount}</p>
              <p className="text-sm text-gray-500 mt-1">Total Amount</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Client</h3>
              <p className="text-gray-900">{order.buyer_name || `User #${order.buyer_id}`}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Freelancer</h3>
              <p className="text-gray-900">{order.seller_name || `User #${order.seller_id}`}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Order Date</h3>
              <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            {order.delivery_date && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Delivery Date</h3>
                <p className="text-gray-900">{new Date(order.delivery_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {order.requirements && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Requirements</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{order.requirements}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Attachments</h3>
            <FileUpload entityType="order" entityId={order.id} label="Upload order files" />
          </div>

          {order.gig_id && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Related Gig</h3>
              <Link
                to={`/gigs/${order.gig_id}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Gig →
              </Link>
            </div>
          )}

          {order.project_id && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Related Project</h3>
              <Link
                to={`/projects/${order.project_id}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Project →
              </Link>
            </div>
          )}

          <div className="flex gap-4 mt-6 pt-6 border-t">
            {canDeliver && (
              <button
                onClick={markAsDelivered}
                disabled={updating}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Mark as Delivered'}
              </button>
            )}
            
            {canComplete && (
              <button
                onClick={markAsCompleted}
                disabled={updating}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Mark as Completed'}
              </button>
            )}
            
            {canCancel && (
              <button
                onClick={cancelOrder}
                disabled={updating}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Cancel Order'}
              </button>
            )}

            <Link
              to={`/messages?user=${isSeller ? order.buyer_id : order.seller_id}`}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center"
            >
              Message {isSeller ? 'Client' : 'Freelancer'}
            </Link>
          </div>
        </div>

        {order.status === 'completed' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Review</h3>
            <Link
              to={`/reviews/create?order=${order.id}&user=${isSeller ? order.buyer_id : order.seller_id}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Write Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
