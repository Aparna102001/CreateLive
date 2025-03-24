


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
