import { useState, useEffect, startTransition } from "react";
import { subscribe, setUser, getUser } from "../../../../../store/store";

export const UserProfileBroken = () => {
  const [currentUser, setCurrentUser] = useState(getUser());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      startTransition(() => {
        setTimeout(() => {
          setCurrentUser(getUser());
        }, 500);
      });
    });
    return unsubscribe;
  }, []);

  return (
    <div style={{ border: "2px solid red", padding: "10px", margin: "10px" }}>
      <p>User: {currentUser.name}</p>
      <button onClick={() => setUser({ name: currentUser.name === "Alice" ? "Bob" : "Alice" })}>
        Switch User
      </button>
    </div>
  );
};
