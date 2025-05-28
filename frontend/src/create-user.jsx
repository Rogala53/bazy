import { useEffect, useState } from "react";
import "./index.css";
import { initLabelAnimations } from "./labelAnimations";
import { validateInputAnimation } from "./validateInputAnimation";
import ReturnButton from "./returnButton";
export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const inputs = [
    {
      input: "username",
      label: "usernameLabel",
      button: "createAccountButton",
    },
    {
      input: "password",
      label: "passwordLabel",
      button: "createAccountButton",
    },
    {
      input: "confirmPassword",
      label: "confirmPasswordLabel",
      button: "createAccountButton",
    },
  ];
  useEffect(() => {
    initLabelAnimations(inputs);
    validateInputAnimation(inputs);
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Hasła nie są takie same!");
      return;
    }
    const accountData = {
      username,
      password,
      role,
    };

    try {
      const response = await fetch("api/create_user.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if(data.success) {
        alert("Konto zostało utworzone");
      } else {
        setError(data.message);
      }
    } catch(error) {
      console.error("Błąd komunikacji z serwerem: ", error);
      setError("Sprawdź konsolę, aby uzyskać więcej informacji");
    }
  };

  return (
    <>
    <ReturnButton />
    <div className="container" style={styles.container}>
      <h1 style={styles.h1}>Stwórz nowego użytkownika</h1>
      {error && <p style={styles.error}>{error}</p>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <select name="role" id="selectRole" style={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user" style={styles.option}>
            Pracownik
          </option>
          <option value="admin" style={styles.option}>
            Admin
          </option>
        </select>
        <label htmlFor="username" className="label" id="usernameLabel">
          Nazwa użytkownika
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password" className="label" id="passwordLabel">
          Hasło
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label
          htmlFor="confirmPassword"
          id="confirmPasswordLabel"
          className="label"
        >
          Powtórz hasło
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="form-button" styles={styles.button} id="createAccountButton">
          Stwórz
        </button>
      </form>
    </div>
    </>
  );
}
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    left: "55%",
  },
  h1: {
    textAlign: "left",
    width: "70%",

  },
  form: {
    width: "50%",
  },
  error: {
    color: "red",
  },
    select: {
    cursor: "pointer",
    borderRadius: "10px",
    fontSize: "16px",
    paddingLeft: "12px",
    height: "40px",
  },
  option: {
    cursor: "pointer",
    padding: "10px",
    borderRadius: "10px",
    height: "30px",
  },

};
