import { useItemStore } from '../stores/itemStore';

export function ItemList({ items }) {
  const { deleteItem } = useItemStore();

  if (!items.length) return <p>No items yet.</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item) => (
        <li
          key={item.id}
          style={{
            padding: '0.75rem',
            marginBottom: '0.5rem',
            background: '#18181b',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>{item.name}</strong>
            {item.description && (
              <span style={{ display: 'block', color: '#71717a', fontSize: '0.9rem' }}>
                {item.description}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => deleteItem(item.id)}
            style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
