"use client";

import { uploadAvatarToCloudinary } from "@/lib/api";
import type { RelivUser } from "@/types/domain";
import toast from "react-hot-toast";
import {
  Camera,
  Check,
  Loader2,
  Shield,
  User as UserIcon,
  X,
  Calendar,
  KeyRound,
} from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ProfileCardProps {
  user: RelivUser;
  adminInfo?: { provider?: string; createdAt?: string };
  onSave?: (data: { name: string; image: string | null }) => Promise<void>;
  editable?: boolean;
  isSaving?: boolean;
}

export default function ProfileCard({
  user,
  adminInfo,
  onSave,
  editable = true,
  isSaving = false,
}: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const displayName = editing ? name : user.name || "Relive user";
  const displayImage = avatarPreview || user.image;
  const hasChanges = editing && (name !== (user.name || "") || avatarUrl !== (user.image ?? null));

  function handleCancel() {
    setEditing(false);
    setName(user.name || "");
    setAvatarPreview(null);
    setAvatarUrl(null);
    setAvatarError("");
    setFieldError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  async function handleSave() {
    setFieldError("");
    if (!name.trim()) {
      setFieldError("Name is required");
      return;
    }
    if (!onSave) return;
    try {
      await onSave({ name: name.trim(), image: avatarUrl ?? user.image ?? null });
      setEditing(false);
      setAvatarPreview(null);
      setAvatarUrl(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not update profile";
      setFieldError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="avatar placeholder h-24 w-24 rounded-full bg-lavender text-xl font-semibold text-ink ring-4 ring-cta-tint ring-offset-2 ring-offset-surface">
            {displayImage ? (
              <div className="w-24 rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayImage} alt="" className="object-cover" />
              </div>
            ) : (
              <span>{(user.name || "R").charAt(0).toUpperCase()}</span>
            )}
          </div>

          {editing && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-circle btn-sm absolute -bottom-1 -right-1 border border-border bg-surface shadow-soft hover:bg-cta-tint"
                aria-label="Change photo"
              >
                {avatarUploading ? (
                  <Loader2 size={14} className="animate-spin text-cta" />
                ) : (
                  <Camera size={14} className="text-cta" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarSelect}
                className="hidden"
              />
              {avatarPreview && !avatarUploading && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="btn btn-circle btn-xs absolute -bottom-1 -right-8 border border-border bg-surface shadow-soft"
                  aria-label="Remove photo"
                >
                  <X size={12} className="text-error" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input input-bordered w-full max-w-xs text-sm"
                autoFocus
              />
            ) : (
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {displayName}
              </h2>
            )}

            {user.isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cta-tint px-2.5 py-0.5 text-xs font-semibold text-cta">
                <Shield size={12} />
                Admin
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-ink-muted">{user.email}</p>

          {fieldError && (
            <p className="mt-2 text-xs text-error">{fieldError}</p>
          )}
          {avatarError && (
            <p className="mt-2 text-xs text-error">{avatarError}</p>
          )}

          {/* Admin extra info */}
          {adminInfo && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-ink-faint sm:justify-start">
              {adminInfo.provider && (
                <span className="flex items-center gap-1">
                  <KeyRound size={12} />
                  {adminInfo.provider === "google" ? "Google" : "Email"}
                </span>
              )}
              {adminInfo.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Joined {new Date(adminInfo.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          )}

          {!adminInfo && (
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-ink-faint sm:justify-start">
              <UserIcon size={12} />
              {user.isAdmin ? "Administrator" : "Member"}
            </div>
          )}
        </div>

        {/* Actions */}
        {editable && onSave && (
          <div className="shrink-0">
            {editing ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving || avatarUploading}
                  className="btn btn-ghost btn-sm gap-1 text-ink-muted"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || avatarUploading || !hasChanges}
                  className="btn btn-primary btn-sm gap-1 shadow-soft"
                >
                  {isSaving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn btn-outline btn-sm gap-1.5 rounded-field border-border text-ink-muted hover:border-ink-faint hover:text-white"
              >
                Edit Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
