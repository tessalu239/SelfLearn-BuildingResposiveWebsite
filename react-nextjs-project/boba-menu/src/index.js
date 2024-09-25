import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const bobaData = [
  {
    id: 1,
    name: "Dalgona Coffee Bubble Milk Tea",
    price: 15,
    photoName: "drinks/dagona-coffee.png",
    soldOut: false,
    description:
      "A delightful blend of coffee and bubble milk tea topped with fluffy Dalgona foam.",
  },
  {
    id: 2,
    name: "Matcha Latte",
    price: 9,
    photoName: "drinks/matcha-latter.png",
    soldOut: false,
    description:
      "A creamy and smooth matcha latte, perfect for green tea lovers.",
  },
  {
    id: 3,
    name: "Brown Sugar Latte",
    price: 9,
    photoName: "drinks/brown-sugar-latte.png",
    soldOut: false,
    description:
      "A rich and sweet brown sugar milk tea with chewy tapioca pearls.",
  },
  {
    id: 4,
    name: "Creme Brulee Milk Tea",
    price: 12,
    photoName: "drinks/creme-bulee-classic.png",
    soldOut: true,
    description:
      "Classic milk tea with a hint of caramelized creme brulee flavor.",
  },
  {
    id: 5,
    name: "Taro Slush",
    price: 10,
    photoName: "drinks/taro-slush.png",
    soldOut: false,
    description:
      "A refreshing taro-flavored slush with a smooth and creamy texture.",
  },
  {
    id: 6,
    name: "Oreo Slush",
    price: 19,
    photoName: "drinks/oreo-slush.png",
    soldOut: false,
    description:
      "An indulgent slush made with crushed Oreos and a creamy base.",
  },
  {
    id: 7,
    name: "Pineapple Slush",
    price: 20,
    photoName: "drinks/pineapple-slush.png",
    soldOut: false,
    description: "A tropical pineapple slush that's both sweet and refreshing.",
  },
  {
    id: 8,
    name: "Wintermelon Punch",
    price: 7,
    photoName: "drinks/wintermelon-punch.png",
    soldOut: true,
    description:
      "A cooling wintermelon drink with a hint of sweetness and freshness.",
  },
  {
    id: 9,
    name: "Thai Milk Tea",
    price: 10,
    photoName: "drinks/thai-milk-tea.png",
    soldOut: false,
    description:
      "Traditional Thai milk tea with a strong tea flavor and a creamy finish.",
  },
  {
    id: 10,
    name: "Strawberry Black Tea",
    price: 8,
    photoName: "drinks/strawberry-tea.png",
    soldOut: false,
    description:
      "A fruity strawberry-infused black tea, perfect for a refreshing pick-me-up.",
  },
];

function App() {
  return (
    <div className="container">
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}
function Header() {
  return (
    <header className="header">
      <h1>TL Beverage Dream Store </h1>
    </header>
  );
}
function Menu() {
  const bobas = bobaData;
  const NumBobas = bobas.length;
  return (
    <main className="menu">
      <h2>Our menu</h2>
      {NumBobas > 0 && (
        <>
          <p>
            Crafted with Creativity, Sipped with Love—Each Beverage is a
            Masterpiece, Blending Unique Flavors and Joy in Every Sip.
          </p>
          <ul className="bobas">
            {bobas.map((boba) => (
              <Boba bobaObj={boba} key={boba.name} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
function Boba(props) {
  return (
    <li className={props.bobaObj.soldOut ? " boba sold-out" : "boba"}>
      <img src={props.bobaObj.photoName} alt={props.bobaObj.name} />
      <div>
        <h3>{props.bobaObj.name}</h3>
        <p>{props.bobaObj.description}</p>
        <span>
          {props.bobaObj.soldOut ? "SOLD OUT" : props.bobaObj.price + ".00"}
        </span>
      </div>
    </li>
  );
}
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closedHour = 23;
  const isOpen = hour >= openHour && hour <= closedHour;

  return (
    <footer className="footer">
      {isOpen ? (
        <div className="order">
          <p>
            We are open until {closedHour}:00. Come visit us or order online.
          </p>
          <button className="btn">Order Now</button>
        </div>
      ) : (
        <p>
          We will see you again between {openHour}:00 and {closedHour}:00
        </p>
      )}
    </footer>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
