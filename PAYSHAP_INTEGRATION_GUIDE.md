# PayShap Payment Integration Guide

This guide provides comprehensive instructions for integrating PayShap payment processing into your MSeriesAuto e-commerce website.

## 📋 Overview

PayShap integration has been prepared with placeholder implementations throughout the codebase. This guide will help you replace the placeholders with actual PayShap API calls.

## 🔧 Setup Requirements

### 1. PayShap Account Setup
1. Create a PayShap account at [https://payshap.io](https://payshap.io)
2. Complete business verification
3. Obtain your API credentials from the PayShap dashboard

### 2. Environment Configuration

Update your `.env` files with PayShap credentials:

**Backend (.env):**
```env
# PayShap Payment Integration
PAYSHAP_API_KEY=your-payshap-api-key
PAYSHAP_SECRET_KEY=your-payshap-secret-key
PAYSHAP_WEBHOOK_SECRET=your-payshap-webhook-secret
PAYSHAP_ENVIRONMENT=sandbox  # Change to 'production' for live
```

**Frontend (.env):**
```env
VITE_PAYSHAP_PUBLISHABLE_KEY=your-payshap-publishable-key
```

### 3. Install PayShap SDK

**Backend:**
```bash
npm install @payshap/node-payshap
```

**Frontend:**
```bash
npm install @payshap/react-payshap
```

## 🔄 Implementation Steps

### Backend Integration

#### 1. Update PayShap Service (`back-end/services/payshap.js`)

Replace placeholder implementations with actual PayShap API calls:

```javascript
// Example: Replace createPaymentIntent method
async createPaymentIntent(paymentData) {
  try {
    const response = await this.client.post('/payment-intents', {
      amount: paymentData.amount,
      currency: paymentData.currency,
      customer: paymentData.customer,
      metadata: {
        order_id: paymentData.orderId,
        items: JSON.stringify(paymentData.items)
      }
    });
    return response.data;
  } catch (error) {
    console.error('PayShap API error:', error);
    throw new Error('Failed to create payment intent');
  }
}
```

#### 2. Configure Webhook Endpoints

Set up webhook endpoints in your PayShap dashboard:
- **URL:** `https://your-domain.com/api/payments/webhook`
- **Events:** `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.dispute.created`

#### 3. Update Order Processing

The Order model has been updated with PayShap fields:
- `paymentIntentId`: PayShap payment intent ID
- `paymentDetails`: Complete payment information
- `paymentMethod`: Includes 'payshap' option

### Frontend Integration

#### 1. Install and Configure PayShap Elements

Replace the placeholder in `PayShapCheckout.jsx`:

```javascript
import { PayShap, Elements } from '@payshap/react-payshap';

// Initialize PayShap
const payshap = new PayShap(import.meta.env.VITE_PAYSHAP_PUBLISHABLE_KEY);

// Wrap your checkout component
<Elements payshap={payshap}>
  <PayShapCheckout />
</Elements>
```

#### 2. Implement Payment Form

Replace the placeholder payment form with PayShap Elements:

```javascript
import { useElements, usePayShap, CardElement } from '@payshap/react-payshap';

const PayShapCheckout = () => {
  const payshap = usePayShap();
  const elements = useElements();

  const handlePayment = async () => {
    const { error, paymentIntent } = await payshap.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
    });

    if (error) {
      // Handle error
    } else {
      // Handle success
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <button type="submit">Pay Now</button>
    </form>
  );
};
```

## 🔗 Integration Points

### 1. Checkout Process (`front-end/src/pages/Checkout.jsx`)

Add PayShap checkout component to your checkout page:

```javascript
import PayShapCheckout from '../components/PayShapCheckout';

// In your checkout component
<PayShapCheckout 
  order={orderData}
  onPaymentSuccess={handlePaymentSuccess}
  onPaymentError={handlePaymentError}
/>
```

### 2. Order Confirmation

Update order confirmation to handle PayShap payments:

```javascript
// Check payment status
if (order.paymentMethod === 'payshap' && order.paymentStatus === 'completed') {
  // Show success message with receipt link
  <a href={order.paymentDetails.receiptUrl}>Download Receipt</a>
}
```

### 3. Admin Dashboard

The admin dashboard can track PayShap payments:
- View payment status in order details
- Process refunds through PayShap
- Monitor payment analytics

## 🔒 Security Considerations

### 1. Webhook Security
- Always verify webhook signatures
- Use HTTPS for webhook endpoints
- Implement idempotency for webhook processing

### 2. API Key Management
- Never expose secret keys in frontend code
- Use environment variables for all credentials
- Rotate keys regularly

### 3. PCI Compliance
- PayShap handles PCI compliance for card data
- Never store card information on your servers
- Use PayShap Elements for secure card input

## 🧪 Testing

### 1. Sandbox Testing
- Use PayShap test credentials
- Test with PayShap test card numbers
- Verify webhook delivery in sandbox

### 2. Test Scenarios
- Successful payments
- Failed payments
- Disputed charges
- Refund processing
- Webhook failures

## 🚀 Production Deployment

### 1. Environment Switch
```env
PAYSHAP_ENVIRONMENT=production
```

### 2. Domain Configuration
- Update webhook URLs to production domain
- Configure CORS settings
- Set up SSL certificates

### 3. Monitoring
- Set up payment monitoring
- Configure error alerting
- Monitor webhook delivery

## 📊 Analytics and Reporting

PayShap provides built-in analytics, but you can also track:
- Payment conversion rates
- Failed payment reasons
- Revenue by payment method
- Customer payment preferences

## 🆘 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL configuration
   - Verify SSL certificate
   - Check firewall settings

2. **Payment intent creation fails**
   - Verify API credentials
   - Check request format
   - Review PayShap API documentation

3. **Frontend integration issues**
   - Ensure PayShap SDK is properly installed
   - Check publishable key configuration
   - Verify Elements implementation

### Support Resources
- PayShap Documentation: https://payshap.io/docs
- PayShap Support: support@payshap.io
- PayShap Community: https://community.payshap.io

## 📝 Implementation Checklist

- [ ] PayShap account created and verified
- [ ] API credentials obtained and configured
- [ ] Backend PayShap service implemented
- [ ] Frontend PayShap components implemented
- [ ] Webhook endpoints configured
- [ ] Order model updated with PayShap fields
- [ ] Payment routes tested
- [ ] Security measures implemented
- [ ] Sandbox testing completed
- [ ] Production deployment configured

## 🔄 Next Steps

1. Replace all placeholder implementations with actual PayShap API calls
2. Test thoroughly in sandbox environment
3. Configure production webhooks
4. Deploy to production
5. Monitor payment processing

---

**Note:** This integration guide provides the foundation for PayShap payment processing. Refer to the official PayShap documentation for the most up-to-date API specifications and best practices.
