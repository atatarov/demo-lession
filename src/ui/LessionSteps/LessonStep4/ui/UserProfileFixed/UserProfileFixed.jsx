import { useSyncExternalStore } from "react";
import { subscribe, setUser, getUser } from "../../../../../store/store";

export const UserProfileFixed = () => {
  const user = useSyncExternalStore(subscribe, getUser);

  return (
    <div style={{ border: "2px solid green", padding: "10px", margin: "10px" }}>
      <p>User: {user.name}</p>
      <button onClick={() => setUser({ name: user.name === "Alice" ? "Bob" : "Alice" })}>
        Switch User
      </button>
    </div>
  );
};
