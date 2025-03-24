const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();

  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  console.log("Response Data:", data); // Debugging: Check what API is returning

  if (response.ok) {
    localStorage.setItem("token", data.token);
    setIsLoggedIn(true);
    setMessage("Login successful.");
  } else {
    setMessage(data.message || "Login failed. Please check your credentials.");
  }
};
