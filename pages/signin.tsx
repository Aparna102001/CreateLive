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

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <Image src="/assets/logo.svg" alt="createlive Logo" width={100} height={50} />
        </div>
      </nav>

      <div style={styles.formWrapper}>
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Sign In</h2>
          <form onSubmit={handleSignIn} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password:</label>
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
          {message && <p style={styles.message}>{message}</p>}

          <p style={styles.toggleText}>
          {"Don't have an account?"}{" "}
            <button
              onClick={toggleAuthMode}
              style={styles.toggleButton}
            >
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
    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('/your-image-url.jpg')", // Gradient background with shade and image
    backgroundSize: "cover",
    backgroundPosition: "center",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    transition: "background-color 0.5s ease-in-out", // Smooth transition for background color
  },
  navbar: {
    backgroundColor: "#1c1c1c", // Dark background for navbar
    padding: "20px",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.3s ease", // Smooth transition for navbar background
  },
  navContent: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "250px",
    height: "80px",
    marginRight: "10px",
  },
  navTitle: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
  },
  formWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    transition: "opacity 1s ease-in-out", // Transition for opacity of the form container
  },
  formContainer: {
    backgroundColor: "rgba(34, 34, 34, 0.8)", // Slightly transparent background for form container
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    animation: "fadeIn 0.5s ease-out", // Fade in effect for form container
    transition: "transform 0.5s ease, opacity 0.5s ease", // Smooth transition on form load
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#fff", // White color for the heading
  },
  form: {
    display: "flex",
    flexDirection: "column",
    transition: "all 0.5s ease", // Transition for form elements
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ddd", // Lighter color for the label text
    marginBottom: "8px",
    transition: "color 0.3s ease", // Smooth transition for label color
  },
  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #444", // Darker border color for input
    width: "100%",
    fontSize: "16px",
    boxSizing: "border-box",
    backgroundColor: "#333", // Dark background for input fields
    color: "#fff", // White text color in input fields
    transition: "border-color 0.3s, background-color 0.3s", // Smooth transition for input focus
  },
  button: {
    padding: "12px",
    backgroundColor: "#6f42c1", // Purple button color
    border: "none",
    borderRadius: "5px",
    color: "#fff", // Button text color
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.3s ease", // Button color and transform effect
  },
  buttonHover: {
    backgroundColor: "#5a32a3", // Darker purple button color on hover
  },
  message: {
    marginTop: "10px",
    color: "#28a745", // Green color for success messages
    fontSize: "14px",
    textAlign: "center",
  },
  toggleText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#ddd", // Lighter color for the toggle text
    transition: "color 0.3s ease", // Smooth color transition for toggle text
  },
  toggleButton: {
    color: "#6f42c1", // Purple color for Sign Up link
    textDecoration: "underline",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "color 0.3s ease", // Smooth transition for toggle button color
  },
};

export default SignIn;

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const SignIn = () => {
  const router = useRouter();
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
      setMessage("Login successful.");
      router.push("/dashboard"); // ✅ Redirect after login
    } else {
      setMessage(data.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <Image src="/assets/logo.svg" alt="createlive Logo" width={100} height={50} />
        </div>
      </nav>

      <div style={styles.formWrapper}>
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Sign In</h2>
          <form onSubmit={handleSignIn} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password:</label>
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
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
