import { useState } from 'react';
import { api } from '../utils/api';

const SELLERS = [
  { id: 1, name: 'Seller 1' },
  { id: 2, name: 'Seller 2' },
];

const CUSTOMERS = [
  { id: 1, name: 'Customer 1' },
  { id: 2, name: 'Customer 2' },
];

const PRODUCTS = [
  { id: 1, name: 'Product 1' },
  { id: 2, name: 'Product 2' },
];

const SPEEDS = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'EXPRESS', label: 'Express' },
];

export function ShippingCalculatorPage() {
  const [sellerId, setSellerId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState('STANDARD');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!sellerId || !customerId || !productId || quantity <= 0) {
      setError('Please select seller, customer, product and a valid quantity.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/v1/shipping-charge/calculate', {
        sellerId: Number(sellerId),
        customerId: Number(customerId),
        productId: Number(productId),
        quantity: Number(quantity),
        deliverySpeed,
      });
      setResult(response);
    } catch (err) {
      const message =
        err?.body?.error || err.message || 'Failed to calculate shipping charge';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <h1 className="page-title">Shipping Charge Calculator</h1>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="field-row">
          <label className="field">
            <span className="field-label">Seller</span>
            <select
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
            >
              <option value="">Select seller</option>
              {SELLERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Customer</span>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Select customer</option>
              {CUSTOMERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Product</span>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Select product</option>
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Quantity</span>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
        </div>

        <div className="field">
          <span className="field-label">Delivery speed</span>
          <div className="radio-group">
            {SPEEDS.map((speed) => (
              <label key={speed.value} className="radio-option">
                <input
                  type="radio"
                  name="deliverySpeed"
                  value={speed.value}
                  checked={deliverySpeed === speed.value}
                  onChange={(e) => setDeliverySpeed(e.target.value)}
                />
                <span>{speed.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Calculating…' : 'Calculate shipping'}
        </button>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
      </form>

      {result && (
        <section className="card result-card">
          <h2 className="section-title">Result</h2>
          <div className="result-grid">
            <div>
              <h3>Warehouse</h3>
              <p>ID: {result.warehouse?.id}</p>
              {result.warehouse?.distanceKmFromSeller != null && (
                <p>
                  Distance from seller:{' '}
                  {result.warehouse.distanceKmFromSeller.toFixed(2)} km
                </p>
              )}
            </div>
            <div>
              <h3>Shipping</h3>
              <p>Mode: {result.shipping?.transportMode}</p>
              <p>Speed: {result.shipping?.deliverySpeed}</p>
              <p>
                Distance:{' '}
                {result.shipping?.distanceKm != null
                  ? result.shipping.distanceKm.toFixed(2)
                  : '-'}{' '}
                km
              </p>
              <p>
                Weight:{' '}
                {result.shipping?.weightKg != null
                  ? result.shipping.weightKg.toFixed(2)
                  : '-'}{' '}
                kg
              </p>
            </div>
            <div>
              <h3>Total</h3>
              <p>Base shipping: ₹{result.shipping?.baseShippingCost}</p>
              <p className="total-amount">
                Total charge: ₹{result.shipping?.totalCharge}
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
