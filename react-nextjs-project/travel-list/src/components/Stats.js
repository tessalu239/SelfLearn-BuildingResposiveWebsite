export function Stats({ items }) {
  const numItems = items.length;
  const packed = items.filter((item) => item.packed === true).length;
  const percentage = Math.round((packed / numItems) * 100);
  return (
    <footer className="stats">
      {items.length === 0 ? (
        <em>Start by adding items</em>
      ) : percentage !== 100 ? (
        <em>
          You have {numItems} items on your list, you already packed {packed} (
          {percentage}%)
        </em>
      ) : (
        <em>You got everything! Ready to go ✈️</em>
      )}
    </footer>
  );
}
