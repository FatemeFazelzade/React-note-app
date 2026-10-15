import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = isLogin
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
          });

      if (result.error) throw result.error;

      if (!isLogin && !result.data.session) {
        setMessage("Check your email to confirm your account.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Welcome back" : "Create an account"}</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <button
        type="button"
        onClick={() => {
          setIsLogin(!isLogin);
          setError("");
          setMessage("");
        }}
      >
        {isLogin
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default Auth;
