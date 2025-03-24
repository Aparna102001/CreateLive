import { useState, useEffect } from "react";
import Image from "next/image";

const SignIn = ({ setIsLoggedIn, toggleAuthMode }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; toggleAuthMode: () => void }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      console.log("Signing in with:", email, password);
      setMessage("Sign-in successful!");
      setIsLoggedIn(true);
    } catch (error) {
      setMessage("Sign-in failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <nav>
        <Image src="/assets/logo.svg" alt="createlive Logo" width={100} height={50} />
      </nav>

      <div>
        <h2>Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Sign In</button>
        </form>
        {message && <p>{message}</p>}
        <p>
          {"Don't have an account?"}{" "}
          <button onClick={toggleAuthMode}>Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
