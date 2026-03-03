import { useEffect } from 'react';
import { useItemStore } from '../stores/itemStore';

export function useItems() {
  const { items, fetchItems, loading, error } = useItemStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}
