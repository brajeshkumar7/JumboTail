import { useEffect, useMemo, useState } from 'react';
import { useShippingStore } from '../stores/shippingStore';

const SPEEDS = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'EXPRESS', label: 'Express' },
];

export function ShippingCalculatorPage() {
  const {
    sellers,
    customers,
    products,
    loading,
    error,
    shippingResult,
    selectedOrder,
    setSelectedOrder,
    clearError,
    loadMasterData,
    calculateShipping,
    createSeller,
    createCustomer,
    createWarehouse,
    createProduct,
  } = useShippingStore();

  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState('SELLER');

  const [sellerForm, setSellerForm] = useState({ name: '', phone: '', latitude: '', longitude: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', latitude: '', longitude: '' });
  const [warehouseForm, setWarehouseForm] = useState({ name: '', latitude: '', longitude: '' });
  const [productForm, setProductForm] = useState({
    sellerId: '',
    sku: '',
    name: '',
    weightGrams: '',
    lengthCm: '',
    widthCm: '',
    heightCm: '',
  });

  const sellerOptions = useMemo(() => sellers ?? [], [sellers]);
  const customerOptions = useMemo(() => customers ?? [], [customers]);
  const productOptions = useMemo(() => products ?? [], [products]);

  useEffect(() => {
    loadMasterData().catch(() => {});
  }, [loadMasterData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validate all required fields are selected
    const sellerIdNum = Number(selectedOrder.sellerId);
    const customerIdNum = Number(selectedOrder.customerId);
    const productIdNum = Number(selectedOrder.productId);
    const quantityNum = Number(selectedOrder.quantity);

    if (Number.isNaN(sellerIdNum) || sellerIdNum <= 0) {
      // eslint-disable-next-line no-alert
      alert('Please select a valid seller.');
      return;
    }

    if (Number.isNaN(customerIdNum) || customerIdNum <= 0) {
      // eslint-disable-next-line no-alert
      alert('Please select a valid customer.');
      return;
    }

    if (Number.isNaN(productIdNum) || productIdNum <= 0) {
      // eslint-disable-next-line no-alert
      alert('Please select a valid product.');
      return;
    }

    if (Number.isNaN(quantityNum) || quantityNum <= 0) {
      // eslint-disable-next-line no-alert
      alert('Please enter a valid quantity (must be greater than 0).');
      return;
    }

    try {
      await calculateShipping();
    } catch {
      // store handles error
    }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    clearError();

    // Frontend guard so we never hit "Valid sellerId is required" from backend.
    if (addType === 'PRODUCT' && !productForm.sellerId) {
      // eslint-disable-next-line no-alert
      alert('Please select a seller before creating a product.');
      return;
    }

    try {
      if (addType === 'SELLER') {
        await createSeller({
          name: sellerForm.name,
          phone: sellerForm.phone || null,
          latitude: sellerForm.latitude === '' ? null : Number(sellerForm.latitude),
          longitude: sellerForm.longitude === '' ? null : Number(sellerForm.longitude),
        });
        setSellerForm({ name: '', phone: '', latitude: '', longitude: '' });
      } else if (addType === 'CUSTOMER') {
        await createCustomer({
          name: customerForm.name,
          phone: customerForm.phone,
          latitude: Number(customerForm.latitude),
          longitude: Number(customerForm.longitude),
        });
        setCustomerForm({ name: '', phone: '', latitude: '', longitude: '' });
      } else if (addType === 'WAREHOUSE') {
        await createWarehouse({
          name: warehouseForm.name,
          latitude: Number(warehouseForm.latitude),
          longitude: Number(warehouseForm.longitude),
        });
        setWarehouseForm({ name: '', latitude: '', longitude: '' });
      } else if (addType === 'PRODUCT') {
        await createProduct({
          sellerId: Number(productForm.sellerId),
          sku: productForm.sku,
          name: productForm.name,
          weightGrams: Number(productForm.weightGrams),
          lengthCm: Number(productForm.lengthCm),
          widthCm: Number(productForm.widthCm),
          heightCm: Number(productForm.heightCm),
        });
        setProductForm({
          sellerId: '',
          sku: '',
          name: '',
          weightGrams: '',
          lengthCm: '',
          widthCm: '',
          heightCm: '',
        });
      }
      setShowAdd(false);
      setAddType('SELLER');
    } catch {
      // store handles error
    }
  };

  return (
    <main className="page">
      <h1 className="page-title">Shipping Charge Calculator</h1>

      <section className="card form-card">
        <div className="field-row" style={{ alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: '1 1 auto' }}>
            <span className="field-label">Master data</span>
            <button
              className="primary-button"
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              style={{ width: 'fit-content' }}
            >
              {showAdd ? 'Close' : 'Add seller / product / customer / warehouse'}
            </button>
          </div>
        </div>

        {showAdd && (
          <form
            className="card"
            style={{ padding: '1rem', marginTop: '1rem', background: '#121216' }}
            onSubmit={onCreate}
          >
            <div className="field-row">
              <label className="field">
                <span className="field-label">Type</span>
                <select
                  value={addType}
                  onChange={(e) => setAddType(e.target.value)}
                >
                  <option value="SELLER">Seller</option>
                  <option value="PRODUCT">Product</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="WAREHOUSE">Warehouse</option>
                </select>
              </label>
            </div>

              {addType === 'SELLER' && (
                <div className="field-row">
                  <label className="field">
                    <span className="field-label">Name</span>
                    <input value={sellerForm.name} onChange={(e) => setSellerForm((s) => ({ ...s, name: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Phone (optional)</span>
                    <input value={sellerForm.phone} onChange={(e) => setSellerForm((s) => ({ ...s, phone: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Latitude (optional)</span>
                    <input value={sellerForm.latitude} onChange={(e) => setSellerForm((s) => ({ ...s, latitude: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Longitude (optional)</span>
                    <input value={sellerForm.longitude} onChange={(e) => setSellerForm((s) => ({ ...s, longitude: e.target.value }))} />
                  </label>
                </div>
              )}

              {addType === 'CUSTOMER' && (
                <div className="field-row">
                  <label className="field">
                    <span className="field-label">Name</span>
                    <input value={customerForm.name} onChange={(e) => setCustomerForm((s) => ({ ...s, name: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Phone</span>
                    <input value={customerForm.phone} onChange={(e) => setCustomerForm((s) => ({ ...s, phone: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Latitude</span>
                    <input value={customerForm.latitude} onChange={(e) => setCustomerForm((s) => ({ ...s, latitude: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Longitude</span>
                    <input value={customerForm.longitude} onChange={(e) => setCustomerForm((s) => ({ ...s, longitude: e.target.value }))} />
                  </label>
                </div>
              )}

              {addType === 'WAREHOUSE' && (
                <div className="field-row">
                  <label className="field">
                    <span className="field-label">Name</span>
                    <input value={warehouseForm.name} onChange={(e) => setWarehouseForm((s) => ({ ...s, name: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Latitude</span>
                    <input value={warehouseForm.latitude} onChange={(e) => setWarehouseForm((s) => ({ ...s, latitude: e.target.value }))} />
                  </label>
                  <label className="field">
                    <span className="field-label">Longitude</span>
                    <input value={warehouseForm.longitude} onChange={(e) => setWarehouseForm((s) => ({ ...s, longitude: e.target.value }))} />
                  </label>
                </div>
              )}

              {addType === 'PRODUCT' && (
                <>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Seller</span>
                      <select
                        value={productForm.sellerId}
                        onChange={(e) => setProductForm((s) => ({ ...s, sellerId: e.target.value }))}
                      >
                        {sellerOptions.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      <span className="field-label">SKU</span>
                      <input value={productForm.sku} onChange={(e) => setProductForm((s) => ({ ...s, sku: e.target.value }))} />
                    </label>
                    <label className="field">
                      <span className="field-label">Name</span>
                      <input value={productForm.name} onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))} />
                    </label>
                    <label className="field">
                      <span className="field-label">Weight (grams)</span>
                      <input value={productForm.weightGrams} onChange={(e) => setProductForm((s) => ({ ...s, weightGrams: e.target.value }))} />
                    </label>
                  </div>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">Length (cm)</span>
                      <input value={productForm.lengthCm} onChange={(e) => setProductForm((s) => ({ ...s, lengthCm: e.target.value }))} />
                    </label>
                    <label className="field">
                      <span className="field-label">Width (cm)</span>
                      <input value={productForm.widthCm} onChange={(e) => setProductForm((s) => ({ ...s, widthCm: e.target.value }))} />
                    </label>
                    <label className="field">
                      <span className="field-label">Height (cm)</span>
                      <input value={productForm.heightCm} onChange={(e) => setProductForm((s) => ({ ...s, heightCm: e.target.value }))} />
                    </label>
                  </div>
                </>
              )}

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save'}
              </button>
          </form>
        )}
      </section>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="field-row">
          <label className="field">
            <span className="field-label">Seller</span>
            <select
              value={selectedOrder.sellerId}
              onChange={(e) => setSelectedOrder({ sellerId: e.target.value })}
            >
              {sellerOptions.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Customer</span>
            <select
              value={selectedOrder.customerId}
              onChange={(e) => setSelectedOrder({ customerId: e.target.value })}
            >
              {customerOptions.map((c) => (
                <option key={c.id} value={String(c.id)}>
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
              value={selectedOrder.productId}
              onChange={(e) => setSelectedOrder({ productId: e.target.value })}
            >
              {productOptions.map((p) => (
                <option key={p.id} value={String(p.id)}>
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
              value={selectedOrder.quantity}
              onChange={(e) => setSelectedOrder({ quantity: e.target.value })}
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
                  checked={selectedOrder.deliverySpeed === speed.value}
                  onChange={(e) => setSelectedOrder({ deliverySpeed: e.target.value })}
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

      {shippingResult && (
        <section className="card result-card">
          <h2 className="section-title">Result</h2>
          <div className="result-grid">
            <div>
              <h3>Warehouse</h3>
              <p>ID: {shippingResult.warehouse?.id}</p>
              {shippingResult.warehouse?.distanceKmFromSeller != null && (
                <p>
                  Distance from seller:{' '}
                  {shippingResult.warehouse.distanceKmFromSeller.toFixed(2)} km
                </p>
              )}
            </div>
            <div>
              <h3>Shipping</h3>
              <p>Mode: {shippingResult.shipping?.transportMode}</p>
              <p>Speed: {shippingResult.shipping?.deliverySpeed}</p>
              <p>
                Distance:{' '}
                {shippingResult.shipping?.distanceKm != null
                  ? shippingResult.shipping.distanceKm.toFixed(2)
                  : '-'}{' '}
                km
              </p>
              <p>
                Weight:{' '}
                {shippingResult.shipping?.weightKg != null
                  ? shippingResult.shipping.weightKg.toFixed(2)
                  : '-'}{' '}
                kg
              </p>
            </div>
            <div>
              <h3>Total</h3>
              <p>Base shipping: ₹{shippingResult.shipping?.baseShippingCost}</p>
              <p className="total-amount">
                Total charge: ₹{shippingResult.shipping?.totalCharge}
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
