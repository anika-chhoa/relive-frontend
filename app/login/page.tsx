"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleButton from "@/components/GoogleButton";
import { DEMO_CREDENTIALS, loginWithCredentials } from "@/lib/api";
import { signIn } from "@/lib/authClient";

interface LoginValues {
  email: string;
  password: string;
}

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

function validate(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  return errors;
}

export default function LoginPage() {
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof LoginValues, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const errors = validate(values);

  function handleChange(field: keyof LoginValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function handleBlur(field: keyof LoginValues) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function handleDemoLogin() {
    // Auto-fill only — the user still clicks "Log in" themselves.
    setValues(DEMO_CREDENTIALS);
    setTouched({ email: true, password: true });
    setFormError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setFormError("");
    try {
      await loginWithCredentials({ email: values.email, password: values.password });
      window.location.href = "/";
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    await signIn.social({ provider: "google", callbackURL: "/auth/callback" });
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to Relive"
      subtitle="Pick up right where you left off."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {formError && (
          <div className="alert alert-error py-2.5 text-sm">
            <span>{formError}</span>
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="you@example.com"
            className={`input input-bordered w-full text-sm focus:outline-cta/40 ${
              touched.email && errors.email ? "input-error" : ""
            }`}
          />
          {touched.email && errors.email && (
            <p className="mt-1.5 text-xs text-error">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-ink">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-cta hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="••••••••"
              className={`input input-bordered w-full pr-11 text-sm focus:outline-cta/40 ${
                touched.password && errors.password ? "input-error" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="mt-1.5 text-xs text-error">{errors.password}</p>
          )}
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary mt-1 w-full">
          {submitting && <span className="loading loading-spinner loading-xs" />}
          {submitting ? "Logging in…" : "Log in"}
        </button>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="btn btn-outline w-full gap-1.5 border-dashed border-lavender bg-cta-tint/40 text-ink hover:border-lavender hover:bg-cta-tint"
        >
          <Sparkles size={15} className="text-cta" />
          Try demo login
        </button>

        <div className="divider my-1 text-xs text-ink-faint">or</div>

        <GoogleButton onClick={handleGoogle} />

        <p className="mt-2 text-center text-sm text-ink-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-cta hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
