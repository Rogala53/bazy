import { useEffect, useState } from "react";
import "./index.css";
import { initLabelAnimations } from "./labelAnimations";
import { validateInputAnimation } from "./validateInputAnimation";
import {Link, useNavigate} from "react-router-dom";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const navigate =  useNavigate();
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
    if (password.length < 8) {
      setError("Długość hasła musi wynosić przynajmniej 8 znaków")
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
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch(error) {
      console.error("Błąd komunikacji z serwerem: ", error);
      setError("Sprawdź konsolę, aby uzyskać więcej informacji");
    }
  };

  return (
    <div id="container">
      <h1 >Stwórz nowego użytkownika</h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <select name="role" id="selectRole" style={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user" style={styles.option}>
            Użytkownik
          </option>
          <option value="admin" style={styles.option}>
            Admin
          </option>
        </select>
        <label htmlFor="username" id="usernameLabel">
          Nazwa użytkownika
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password" id="passwordLabel">
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

        <Link to="/login" style={styles.link}>Zaloguj się</Link>
        <button type="submit" style={styles.button} id="createAccountButton">
          Stwórz
        </button>
      </form>
    </div>
  );
}
const styles = {
  select: {
    backgroundColor: "#2b2b2b",
    color: "whitesmoke",
    cursor: "pointer",
    borderRadius: "10px",
    fontSize: "16px",
    paddingLeft: "12px",
    height: "40px",
  },
  option: {
    backgroundColor: "#2b2b2b",
    color: "whitesmoke",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "10px",
    height: "30px",
  },
  button: {
    display: "inline",
    width: "50%",
    position: "relative",
    float: "right",
    right: "-120px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid black",
    backgroundColor: " #c8c8c8",
    cursor: "pointer",
    fontSize: "14px",
  },
  link: {
    display: "inline",
    color: "whitesmoke",
    position: "relative",
    top: "30px",
    textAlign: "left",
  },
  error: {
    color: "red",
    position: "relative",
  },
};
