import { useState } from "react";
import Image from "next/image";

const SignIn = ({
  setIsLoggedIn,
  toggleAuthMode,
}: {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAuthMode: () => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      sessionStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setMessage("Login successful.");
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <Image src="/assets/logo.svg" alt="createlive Logo" width={100} height={50} priority />
        </div>
      </nav>

      <div style={styles.formWrapper}>
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Sign In</h2>
          <form onSubmit={handleSignIn} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                aria-label="Email Input"
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
                aria-label="Password Input"
              />
            </div>
            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a32a3")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6f42c1")}
              aria-label="Sign In Button"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {message && <p style={styles.message}>{message}</p>}

          <p style={styles.toggleText}>
            {"Don’t have an account?"}{" "}
            <button onClick={toggleAuthMode} style={styles.toggleButton}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
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
  navContent: {
    display: "flex",
    alignItems: "center",
  },
  formWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    transition: "opacity 1s ease-in-out",
  },
  formContainer: {
    backgroundColor: "rgba(34, 34, 34, 0.8)",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    animation: "fadeIn 0.5s ease-out",
    transition: "transform 0.5s ease, opacity 0.5s ease",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    transition: "all 0.5s ease",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ddd",
    marginBottom: "8px",
    transition: "color 0.3s ease",
  },
  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #444",
    width: "100%",
    fontSize: "16px",
    boxSizing: "border-box",
    backgroundColor: "#333",
    color: "#fff",
    transition: "border-color 0.3s, background-color 0.3s",
  },
  button: {
    padding: "12px",
    backgroundColor: "#6f42c1",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
  message: {
    marginTop: "10px",
    color: "#28a745",
    fontSize: "14px",
    textAlign: "center",
  },
  toggleText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#ddd",
    transition: "color 0.3s ease",
  },
  toggleButton: {
    color: "#6f42c1",
    textDecoration: "underline",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
};

export default SignIn;


