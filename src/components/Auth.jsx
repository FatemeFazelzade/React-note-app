import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

const validateEmail = (rawEmail) => {
  if (!rawEmail) return { valid: false, reason: "Email is required." };

  const email = rawEmail.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: "Please enter a valid email format." };
  }

  const parts = email.split("@");
  if (parts.length !== 2) return { valid: false, reason: "Invalid email." };

  const domain = parts[1];

  if (
    domain.startsWith("gmai") ||
    domain.startsWith("gmial") ||
    domain.startsWith("gamil")
  ) {
    if (domain !== "gmail.com") {
      return { valid: false, reason: "Did you mean 'gmail.com'?" };
    }
  }

  if (domain.startsWith("yaho") && domain !== "yahoo.com") {
    return { valid: false, reason: "Did you mean 'yahoo.com'?" };
  }

  if (domain.startsWith("outlook") && domain !== "outlook.com") {
    return { valid: false, reason: "Did you mean 'outlook.com'?" };
  }

  if (domain.startsWith("hotmail") && domain !== "hotmail.com") {
    return { valid: false, reason: "Did you mean 'hotmail.com'?" };
  }

  const invalidTlds = [".om", ".coom", ".cmo", ".ocm", ".con", ".comm", ".co"];
  const lastDot = domain.lastIndexOf(".");
  if (lastDot !== -1) {
    const tld = domain.slice(lastDot);
    if (invalidTlds.includes(tld)) {
      return {
        valid: false,
        reason: `Did you mean '.com' instead of '${tld}'?`,
      };
    }
  }

  return { valid: true };
};

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const checkEmail = (value) => {
    if (!value || !value.trim()) return true;

    const res = validateEmail(value);
    if (!res.valid) {
      toast.error("Invalid Email", {
        description: res.reason,
      });
      return false;
    }
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const isEmailOk = checkEmail(email);
    if (!isEmailOk) return;

    if (!isLogin && password.length <= 8) {
      toast.error("Invalid Password", {
        description: "Password must be longer than 8 characters.",
      });
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const result = isLogin
        ? await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          })
        : await supabase.auth.signUp({
            email: cleanEmail,
            password,
          });

      if (result.error) throw result.error;

      if (!isLogin && !result.data.session) {
        toast.info("Registration Successful", {
          description: "Please check your email to activate your account.",
        });
      } else {
        toast.success(
          isLogin ? "Logged in successfully!" : "Account created successfully!",
        );
      }
    } catch (err) {
      toast.error("Authentication Error", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Welcome back" : "Create an account"}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => checkEmail(e.target.value)}
          placeholder="name@example.com"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => {
            // Only show warning if signing up
            if (!isLogin && e.target.value && e.target.value.length <= 8) {
              toast.warning("Weak Password", {
                description: "Password must be more than 8 characters.",
              });
            }
          }}
          placeholder="Enter your password"
          minLength={isLogin ? 0 : 9}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
        </button>
      </form>

      <button
        type="button"
        className="auth-switch-btn"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default Auth;
