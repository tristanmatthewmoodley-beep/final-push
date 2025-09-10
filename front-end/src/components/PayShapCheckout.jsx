import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

/**
 * PayShap Checkout Component
 * 
 * This component handles PayShap payment integration for the checkout process.
 * 
 * TODO: Replace placeholder implementation with actual PayShap SDK integration
 * Documentation: https://payshap.io/docs/frontend-integration
 * 
 * Required: Install PayShap SDK
 * npm install @payshap/react-payshap
 */

const PayShapCheckout = ({ order, onPaymentSuccess, onPaymentError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize PayShap payment intent when component mounts
    initializePayment();
  }, [order]);

  const initializePayment = async () => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call to create PayShap payment intent
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: order.total,
          currency: 'ZAR',
          orderId: order._id,
          customer: {
            email: order.customer.email,
            name: `${order.customer.firstName} ${order.customer.lastName}`
          },
          items: order.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      const data = await response.json();

      if (data.success) {
        setPaymentIntent(data.data.paymentIntent);
        console.log('💳 PayShap payment intent created:', data.data.paymentIntent.id);
      } else {
        throw new Error(data.message || 'Failed to create payment intent');
      }

    } catch (error) {
      console.error('PayShap initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
      onPaymentError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentIntent) {
      toast.error('Payment not initialized. Please refresh and try again.');
      return;
    }

    try {
      setIsLoading(true);

      // TODO: Replace with actual PayShap payment confirmation
      // This is a placeholder implementation
      console.log('🔄 Processing PayShap payment...');
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder payment confirmation
      const paymentResult = {
        status: 'succeeded',
        paymentIntentId: paymentIntent.id,
        receiptUrl: `${import.meta.env.VITE_API_URL}/receipts/${Date.now()}`
      };

      // Confirm payment with backend
      const confirmResponse = await fetch(`${import.meta.env.VITE_API_URL}/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          paymentMethod: {
            type: 'card',
            amount: paymentIntent.amount
          }
        })
      });

      const confirmData = await confirmResponse.json();

      if (confirmData.success && paymentResult.status === 'succeeded') {
        toast.success('Payment successful!');
        onPaymentSuccess?.(confirmData.data.payment);
        
        // Redirect to success page
        navigate(`/order-confirmation/${order._id}`);
      } else {
        throw new Error('Payment failed');
      }

      /* 
      TODO: Actual PayShap implementation would look like this:
      
      // Import PayShap SDK
      import { PayShap } from '@payshap/react-payshap';
      
      // Initialize PayShap with your publishable key
      const payshap = new PayShap(import.meta.env.VITE_PAYSHAP_PUBLISHABLE_KEY);
      
      // Confirm payment with PayShap
      const { error, paymentIntent: confirmedPayment } = await payshap.confirmPayment({
        elements, // PayShap Elements instance
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation/${order._id}`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Handle successful payment
      if (confirmedPayment.status === 'succeeded') {
        onPaymentSuccess?.(confirmedPayment);
      }
      */

    } catch (error) {
      console.error('PayShap payment error:', error);
      toast.error('Payment failed. Please try again.');
      onPaymentError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!paymentIntent && isLoading) {
    return (
      <div className="bg-car-gray p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-600 rounded mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-car-gray p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Payment Details</h3>
      
      {/* Payment Summary */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Order Total:</span>
          <span className="text-white font-semibold">R{order.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Payment Method:</span>
          <span className="text-white">PayShap Secure Payment</span>
        </div>
      </div>

      {/* PayShap Payment Form Placeholder */}
      <div className="mb-6">
        <div className="border border-gray-600 rounded-lg p-4 bg-car-black">
          <div className="text-center text-gray-400 py-8">
            {/* TODO: Replace with actual PayShap Elements */}
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-sm">PayShap Secure Payment Form</p>
              <p className="text-xs text-gray-500 mt-1">
                Card details will be processed securely by PayShap
              </p>
            </div>
            
            {/* Placeholder for PayShap Elements */}
            <div className="space-y-3">
              <div className="h-10 bg-gray-700 rounded border border-gray-600"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-gray-700 rounded border border-gray-600"></div>
                <div className="h-10 bg-gray-700 rounded border border-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading || !paymentIntent}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay R${order.total.toFixed(2)}`
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment information is secure and encrypted by PayShap
        </p>
      </div>

      {/* Development Notice */}
      <div className="mt-4 p-3 bg-yellow-900 border border-yellow-600 rounded-lg">
        <p className="text-yellow-200 text-sm">
          <strong>Development Mode:</strong> This is a placeholder PayShap integration. 
          Replace with actual PayShap SDK implementation for production use.
        </p>
      </div>
    </div>
  );
};

export default PayShapCheckout;
