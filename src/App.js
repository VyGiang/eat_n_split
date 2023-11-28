import { useState } from "react"
import "./index.css"

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
    image: " ?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
]

function Button({ children, onShow }) {
  return (
    <button className="button" onClick={onShow}>
      {children}
    </button>
  )
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends)

  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null) // array of friends

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show)
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleSelectedFriend(friend) {
    // setSelectedFriend(friend)
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend))
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    console.log(value)

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    )
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && (
          <FormAddFriend
            onAddFriend={handleAddFriend}
            selectedFriend={selectedFriend}
          />
        )}
        <Button onShow={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  )
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul className="friends-list">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  )
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe You {friend.balance}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      {/* <button className="button" onClick={() => onSelection(friend)}>
        Select
      </button> */}
      <Button onShow={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("")
  const [image, setImage] = useState("https://i.pravatar.cc/48")

  function handleSubmit(e) {
    e.preventDefault()

    if (!name || !image) {
      alert("Please fill in all fields")
      return
    }
    const id = crypto.randomUUID()
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    }

    onAddFriend(newFriend)

    setName("")
    setImage("https://i.pravatar.cc/48")
  }

  return (
    <form className="form-add-friend " onSubmit={handleSubmit}>
      <label>👯Friend name </label>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image URL </label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState("")
  const [paidByUser, setpaidbyUser] = useState("")
  const paidByFriend = billValue ? billValue - paidByUser : ""
  const [whoisPaying, setWhoisPaying] = useState("user")

  function handleSubmit(e) {
    e.preventDefault()

    if (!billValue || !paidByUser) {
      alert("Please fill in all fields")
      return
    }

    onSplitBill(whoisPaying === "user" ? paidByFriend : -paidByUser)
  }
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name} </h2>

      <label>💰Bill value </label>
      <input
        type="text"
        placeholder="0"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />

      <label>💃Your expense</label>
      <input
        type="text"
        placeholder="0"
        value={paidByUser}
        onChange={(e) =>
          setpaidbyUser(
            Number(e.target.value) > billValue
              ? paidByUser
              : Number(e.target.value)
          )
        }
      />

      <label>👨‍🤝‍👩{selectedFriend.name}'s expense </label>
      <input type="text" placeholder="0" disabled value={paidByFriend} />

      <label>🤑Who is paying the bill? </label>
      <select
        value={whoisPaying}
        onChange={(e) => setWhoisPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button onShow={handleSubmit}>Split bill</Button>
    </form>
  )
}
