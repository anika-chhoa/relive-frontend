"use client";

import AuthLayout from "@/components/AuthLayout";
import GoogleButton from "@/components/GoogleButton";
import { registerWithCredentials, uploadAvatarToCloudinary } from "@/lib/api";
import { signIn } from "@/lib/authClient";
import { Camera, Eye, EyeOff, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>;

function validate(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {};
  if (!values.name.trim()) errors.name = "Full name is required";

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

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export default function RegisterPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<RegisterValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState<
    Partial<Record<keyof RegisterValues, boolean>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const errors = validate(values);

  function handleChange(field: keyof RegisterValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }
  function handleBlur(field: keyof RegisterValues) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleAvatarSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError("Only JPG, PNG or WEBP images are allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setAvatarError("Image must be under 2MB");
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);
    try {
      const url = await uploadAvatarToCloudinary(file);
      setAvatarUrl(url);
    } catch {
      setAvatarError("Upload failed. Please try again.");
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
    }
  }

  function removeAvatar() {
    setAvatarPreview(null);
    setAvatarUrl(null);
    setAvatarError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setFormError("");
    try {
      await registerWithCredentials({
        name: values.name,
        email: values.email,
        password: values.password,
        image: avatarUrl || undefined, // optional — profile photo is not required
      });
      window.location.href = "/";
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not create your account",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/auth/callback`,
    });
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Join our marketplace and start buying or selling today."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {formError && (
          <div className="alert alert-error py-2.5 text-sm">
            <span>{formError}</span>
          </div>
        )}

        {/* Optional avatar upload */}
        <div className="flex flex-col items-center gap-2 pb-1">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="avatar placeholder btn btn-circle btn-ghost h-20 w-20 border-2 border-dashed border-lavender bg-cta-tint/40 hover:bg-cta-tint"
              aria-label="Upload profile photo"
            >
              {avatarPreview ? (
                <div className="w-20 rounded-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarPreview} alt="" className="object-cover" />
                </div>
              ) : (
                <Camera size={22} className="text-cta" />
              )}
              {avatarUploading && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/40">
                  <Loader2 size={20} className="animate-spin text-white" />
                </span>
              )}
            </button>
            {avatarPreview && !avatarUploading && (
              <button
                type="button"
                onClick={removeAvatar}
                className="btn btn-circle btn-neutral btn-xs absolute -right-1 -top-1 shadow-soft"
                aria-label="Remove photo"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium text-cta hover:underline"
          >
            {avatarPreview ? "Change photo" : "Upload photo (optional)"}
          </button>
          {avatarError && <p className="text-xs text-error">{avatarError}</p>}
        </div>

        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Jane Rahman"
            className={`input input-bordered w-full text-sm ${
              touched.name && errors.name ? "input-error" : ""
            }`}
          />
          {touched.name && errors.name && (
            <p className="mt-1.5 text-xs text-error">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="reg-email"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="you@example.com"
            className={`input input-bordered w-full text-sm ${
              touched.email && errors.email ? "input-error" : ""
            }`}
          />
          {touched.email && errors.email && (
            <p className="mt-1.5 text-xs text-error">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="reg-password"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="At least 8 characters"
              className={`input input-bordered w-full pr-11 text-sm ${
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

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            placeholder="Re-enter your password"
            className={`input input-bordered w-full text-sm ${
              touched.confirmPassword && errors.confirmPassword
                ? "input-error"
                : ""
            }`}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-error">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || avatarUploading}
          className="btn btn-primary mt-1 w-full"
        >
          {submitting && (
            <span className="loading loading-spinner loading-xs" />
          )}
          {submitting ? "Creating account…" : "Create account"}
        </button>

        <div className="divider my-1 text-xs text-ink-faint">or</div>

        <GoogleButton label="Sign up with Google" onClick={handleGoogle} />

        <p className="mt-2 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-cta hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
