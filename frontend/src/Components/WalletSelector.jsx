import React, { useState, useEffect } from "react";
import { wallets } from "../blockchain/wallets";

export default function WalletSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role && wallets[user.role]) {
      setSelected(user.role);
      onSelect(wallets[user.role]);
    }
  }, [onSelect]);

  return <div>{selected && <p>Selected: {wallets[selected].name}</p>}</div>;
}
