import { useState } from "react";
import { Item } from "./Item";

export function PackingList({
  items,
  deleteItems,
  handleToggleItem,
  handleClear,
}) {
  const [sortBy, setSortBy] = useState("input");
  let sortedList;
  if (sortBy === "input") sortedList = items;
  if (sortBy === "description")
    sortedList = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "pack")
    sortedList = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedList.map((item) => (
          <Item
            item={item}
            deleteItems={deleteItems}
            handleToggleItem={handleToggleItem}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onClick={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input</option>
          <option value="description">sort by description</option>
          <option value="pack">sort by packed</option>
        </select>
        <button onClick={handleClear}>Clear List</button>
      </div>
    </div>
  );
}
