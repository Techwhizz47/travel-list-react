import React, { useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const handleaddItems = (item) => {
    setItems((items) => [...items, item]);
  };
  const handleDeleteItem = (id) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const handletoggleitem = (id) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };
  const handleclearlist = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );
    if (confirmed) {
      setItems([]);
    }
  };
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleaddItems} />
      <Packinglist
        items={items}
        onToggleItem={handletoggleitem}
        onDelete={handleDeleteItem}
        onClearList={handleclearlist}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>Far Away</h1>;
}

function Form({ onAddItems }) {
  const [desc, setDesc] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { desc, quantity, packed: false, id: Date.now() };
    onAddItems(newItem);
    setDesc("");
    setQuantity(1);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <div>
        <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <input
          placeholder="description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          type="text"
        />
        <button>Add</button>
      </div>
    </form>
  );
}
function Packinglist({ items, onDelete, onToggleItem, onClearList }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;
  if (sortBy === "input" || sortBy === "") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items.slice().sort((a, b) =>
      a.description.LocaleCompare(b.description)
    );
  return (
    <>
      <ul>
        {sortedItems.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              value={item.packed}
              onChange={() => onToggleItem(item.id)}
            />
            <span style={item.packed ? { textDecoration: "line-through" } : {}}>
              {item.quantity} {item.desc}
            </span>
            <button onClick={() => onDelete(item.id)}>❌</button>
          </li>
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort by...</option>
          <option value="input">input</option>
          <option value="description">description</option>
        </select>
        <button disabled={items.length === 0} onClick={onClearList}>
          Clearlist
        </button>
      </div>
    </>
  );
}

function Stats({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start Adding Some Items To Your Packing List</em>
      </p>
    );
  }
  const numItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentage = Math.round((packedItems / numItems) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "Youve Got Everything! Ready To Go."
          : `You have ${numItems} ${
              items.length === 1 ? "item" : "items"
            } on your list and you already packed ${packedItems}(${percentage}%)`}
      </em>
    </footer>
  );
}

export default App;
