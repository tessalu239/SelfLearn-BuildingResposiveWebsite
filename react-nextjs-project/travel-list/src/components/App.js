import { useState } from "react";
import Logo from "./Logo";
import { Form } from "./Form";
import { PackingList } from "./PackingList";
import { Stats } from "./Stats";
export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }
  function deleteItems(id) {
    setItems((items) => items.filter((item) => id !== item.id));
  }
  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function handleClear() {
    const confirmed = window.confirm(
      "Are you sure you want to delete everything?"
    );
    if (confirmed) setItems([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form handleAddItems={handleAddItems} />
      <PackingList
        items={items}
        deleteItems={deleteItems}
        handleToggleItem={handleToggleItem}
        handleClear={handleClear}
      />
      <Stats items={items} />
    </div>
  );
}
