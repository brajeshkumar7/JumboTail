import { useState } from 'react';
import { useItemStore } from '../stores/itemStore';

export function ItemForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createItem } = useItemStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createItem({ name: name.trim(), description: description.trim() || undefined });
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: '0.5rem', padding: '0.5rem' }}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginRight: '0.5rem', padding: '0.5rem' }}
      />
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>
        Add
      </button>
    </form>
  );
}
