import { useEffect } from 'react';
import { useItemStore } from '../stores/itemStore';
import { ItemList } from '../components/ItemList';
import { ItemForm } from '../components/ItemForm';

export function ItemsPage() {
  const { fetchItems, items, loading, error, clearError } = useItemStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <main>
      <h1>Items</h1>
      {error && (
        <div role="alert" style={{ color: '#f87171', marginBottom: '1rem' }}>
          {error}
          <button type="button" onClick={clearError} style={{ marginLeft: '0.5rem' }}>
            Dismiss
          </button>
        </div>
      )}
      <ItemForm />
      {loading && !items.length ? <p>Loading…</p> : <ItemList items={items} />}
    </main>
  );
}
