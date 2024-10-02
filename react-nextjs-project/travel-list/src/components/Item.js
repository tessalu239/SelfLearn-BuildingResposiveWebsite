export function Item({ item, deleteItems, handleToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => handleToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} &nbsp;
        {item.description}
      </span>
      <button onClick={() => deleteItems(item.id)}>❌</button>
    </li>
  );
}
