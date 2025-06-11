import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { initLabelAnimations } from "./labelAnimations";
import { validateInputAnimation } from "./validateInputAnimation";
import "./index.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const inputs = [
    { input: "username", label: "usernameLabel", button: "loginButton" },
    { input: "password", label: "passwordLabel", button: "loginButton" },
  ];

  useEffect(() => {
    initLabelAnimations(inputs);
    validateInputAnimation(inputs);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const accountData = {
      username,
      password,
    };
    try {
      const response = await fetch("api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });

      const contentType = response.headers.get("content-type");
      if(!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response: ", text);
        throw new Error("Serwer zwrócił nieprawidłową odpowiedź");
      }
      const data = await response.json();
    
      if(data.success) {
        localStorage.setItem('username', data.username);
        navigate(`/menu`);
      } else {
        throw new Error(data.message || "Logowanie nie powiodło się");
      }
    } catch (e) {
      console.error("Login error: ", e);

      if(e.name === 'TypeError' && e.message.includes("fetch")) {
        setError("Nie można się połączyć się z serwerem");
      } else if(e.name === 'SyntaxError' || e.message.includes("Unexpected token")) {
        setError("Nieprawidłowa nazwa użytkownika lub hasło");
      } else {
        setError(e.message);
      }
    }
  }
  return (
    <div className="container">
      <h1>Zaloguj się</h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" id="usernameLabel" className="label">
          Nazwa użytkownika
        </label>
        <input type="text" name="username"
               id="username"
               value={username} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="password" id="passwordLabel" className="label">
          Hasło
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="form-button">
          Zaloguj
        </button>
      </form>
    </div>
  );
}

const styles = {
  error: {
    color: "red",
    marginTop: "20px",
  }
};
