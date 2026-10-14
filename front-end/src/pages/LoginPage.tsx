import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./../utils/api/authApi";
import { loginSuccess } from "../store/slices/authSlice";
import Input from "../components/form/Input";

function LoginPage() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: any) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await login(email, password);

      localStorage.setItem("auth-token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      dispatch(loginSuccess(result));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Inspection Tracker</h1>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          changeHandler={setEmail}
          required
        />

        <Input
          type="password"
          label="Password"
          value={password}
          changeHandler={setPassword}
          required
        />
        {error && <p>{error}</p>}

        <button disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
