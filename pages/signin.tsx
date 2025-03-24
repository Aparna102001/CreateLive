import { useState } from "react";
import Image from "next/image";

const SignIn = ({ setIsLoggedIn, toggleAuthMode }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; toggleAuthMode: () => void }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true); // Set logged in state
      setMessage("Login successful.");
    } else {
      setMessage(data.message || "Login failed. Please check your credentials.");
    }
  };

  // Move styles inside the component
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('/your-image-url.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      justifyContent: "center",
      alignItems: "center",
      transition: "background-color 0.5s ease-in-out",
    },
    navbar: {
      backgroundColor: "#1c1c1c",
      padding: "20px",
      position: "fixed",
      width: "100%",
      top: 0,
      zIndex: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "background-color 0.3s ease",
    },
    formContainer: {
      backgroundColor: "rgba(34, 34, 34, 0.8)",
      padding: "30px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#fff",
    },
    input: {
      padding: "12px",
      borderRadius: "5px",
      border: "1px solid #444",
      width: "100%",
      fontSize: "16px",
      backgroundColor: "#333",
      color: "#fff",
    },
    button: {
      padding: "12px",
      backgroundColor: "#6f42c1",
      border: "none",
      borderRadius: "5px",
      color: "#fff",
      fontSize: "16px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div>
          <Image src="/assets/logo.svg" alt="createlive Logo" width={100} height={50} />
        </div>
      </nav>

      <div>
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Sign In</h2>
          <form onSubmit={handleSignIn}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>Sign In</button>
          </form>
          {message && <p>{message}</p>}
          <p>
            {"Don't have an account?"}{" "}
            <button onClick={toggleAuthMode} style={{ color: "#6f42c1", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
