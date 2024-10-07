import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friendList, setFriendList] = useState(initialFriends);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  function handleShow() {
    setShow((show) => !show);
  }
  function handleAddFriend(newFriend) {
    setFriendList((current) => [...current, newFriend]);
    setShow(!show);
  }
  console.log(friendList);
  function handleSelect(friend) {
    if (selected === null) {
      setSelected(friend);
    } else {
      if (selected === friend) setSelected(null);
      else {
        setSelected(friend);
      }
    }
  }
  console.log(selected);

  function handleSplitBill(value) {
    console.log(value);
    setFriendList((friendList) =>
      friendList.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelected(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friendList={friendList}
          handleSelect={handleSelect}
          selected={selected}
        />
        {show && (
          <FormAddFriend
            friendList={friendList}
            handleAddFriend={handleAddFriend}
          />
        )}
        <Button onClick={handleShow}>{!show ? "Add friend" : "Close"}</Button>
      </div>
      <div>
        {selected && (
          <FormSplitBill
            friendList={friendList}
            selected={selected}
            handleSplitBill={handleSplitBill}
          />
        )}
      </div>
    </div>
  );
}
function FriendList({ friendList, handleSelect, selected }) {
  return (
    <ul>
      {friendList.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          handleSelect={handleSelect}
          selected={selected}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, handleSelect, selected }) {
  const isSelected = selected ? friend.id === selected.id : false;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} /> <h2>{friend.name}</h2>
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${friend.balance * -1}
        </p>
      )}
      <Button onClick={() => handleSelect(friend)}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}
function FormAddFriend({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/150");
  function handleSubmit(e) {
    e.preventDefault();
    const idFriend = crypto.randomUUID();
    const newFriend = {
      name,
      image: `https://i.pravatar.cc/150?u=${idFriend}`,
      balance: 0,
      id: idFriend,
    };
    console.log(newFriend);
    handleAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend">
      <label>🧑‍🤝‍🧑Friend name</label>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <label>🌆 Image URL</label>
      <input type="text" onChange={(e) => setImage(e.target.value)} />
      <Button onClick={(e) => handleSubmit(e)}>Add</Button>
    </form>
  );
}
function FormSplitBill({ selected, handleSplitBill }) {
  const [bill, setBill] = useState(0);
  const [youPay, setYouPay] = useState(0);
  const friendPay = bill ? bill - youPay : 0;
  const [whoPay, setWhoPay] = useState("you");
  function handleSubmitBill(e) {
    e.preventDefault();
    if (!bill || !youPay) return;
    handleSplitBill(whoPay === "you" ? friendPay : -youPay);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmitBill}>
      <h2>split a bill with {selected.name}</h2>
      <label>💰 Bill Value</label>
      <input type="number" onChange={(e) => setBill(Number(e.target.value))} />
      <label>💁🏻‍♀️ Your expense</label>
      <input
        type="number"
        onChange={(e) =>
          e.target.value <= bill
            ? setYouPay(Number(e.target.value))
            : setYouPay(youPay)
        }
      />
      <label>💁🏻 {selected.name}'s expense</label>
      <input type="number" disable="true" value={friendPay} />
      <label>🤑 Who is paying the bill?</label>
      <select defaultValue={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
        <option value="you">You</option>
        <option value="friend">{selected.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

// REUSABLE COMPONENTS
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
