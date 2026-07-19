"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, Wand2, RotateCcw, Loader2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import { CATEGORIES, CONDITIONS, LENGTH_OPTIONS } from "@/lib/constants";
import { generateListingDescription, improveListingText } from "@/lib/api";
import type { ListingLength } from "@/types/domain";

export interface ItemFormValues {
  title: string;
  category: string;
  condition: string;
  price: string;
  location: string;
  keywords: string;
  shortDescription: string;
  fullDescription: string;
}

type ItemFormErrors = Partial<Record<keyof ItemFormValues | "images", string>>;

const EMPTY_FORM: ItemFormValues = {
  title: "",
  category: "",
  condition: "",
  price: "",
  location: "",
  keywords: "",
  shortDescription: "",
  fullDescription: "",
};

function validate(values: ItemFormValues, images: string[]): ItemFormErrors {
  const errors: ItemFormErrors = {};
  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.category) errors.category = "Choose a category";
  if (!values.condition) errors.condition = "Choose a condition";
  if (!values.price) {
    errors.price = "Price is required";
  } else if (Number.isNaN(Number(values.price)) || Number(values.price) < 0) {
    errors.price = "Enter a valid price";
  }
  if (!values.location.trim()) errors.location = "Location is required";
  if (!values.shortDescription.trim()) errors.shortDescription = "Short description is required";
  if (!values.fullDescription.trim()) errors.fullDescription = "Full description is required";
  if (images.length === 0) errors.images = "Add at least a cover image";
  return errors;
}

interface ItemFormProps {
  initialValues?: Partial<ItemFormValues>;
  initialImages?: string[];
  onSubmit: (values: ItemFormValues, images: string[]) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
}

export default function ItemForm({
  initialValues,
  initialImages,
  onSubmit,
  submitLabel,
  submittingLabel,
}: ItemFormProps) {
  const [values, setValues] = useState<ItemFormValues>({ ...EMPTY_FORM, ...initialValues });
  const [images, setImages] = useState<string[]>(initialImages || []);
  const [touched, setTouched] = useState<Partial<Record<keyof ItemFormValues, boolean>>>({});
  const [imagesTouched, setImagesTouched] = useState(false);
  const [length, setLength] = useState<ListingLength>("medium");
  const [generating, setGenerating] = useState(false);
  const [improving, setImproving] = useState<"short" | "full" | null>(null);
  const [aiError, setAiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = validate(values, images);

  function set<K extends keyof ItemFormValues>(field: K, value: ItemFormValues[K]) {
    setValues((v) => ({ ...v, [field]: value }));
  }
  function blur(field: keyof ItemFormValues) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleGenerate() {
    if (!values.title.trim()) {
      setTouched((t) => ({ ...t, title: true }));
      return;
    }
    setAiError("");
    setGenerating(true);
    try {
      const { shortDescription, fullDescription } = await generateListingDescription({
        title: values.title,
        keywords: values.keywords,
        category: values.category,
        condition: values.condition,
        length,
      });
      set("shortDescription", shortDescription);
      set("fullDescription", fullDescription);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Could not generate a description");
    } finally {
      setGenerating(false);
    }
  }

  async function handleImprove(field: "short" | "full") {
    const text = field === "short" ? values.shortDescription : values.fullDescription;
    if (!text.trim()) return;
    setAiError("");
    setImproving(field);
    try {
      const improved = await improveListingText({ text, field });
      set(field === "short" ? "shortDescription" : "fullDescription", improved);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Could not improve this text");
    } finally {
      setImproving(null);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({
      title: true,
      category: true,
      condition: true,
      price: true,
      location: true,
      shortDescription: true,
      fullDescription: true,
    });
    setImagesTouched(true);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(values, images);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass = (field: keyof ItemFormValues) =>
    `w-full rounded-field border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-cta/40 ${
      touched[field] && errors[field] ? "border-error" : "border-border"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {submitError && (
        <div className="rounded-field border border-error/30 bg-error/10 px-4 py-2.5 text-sm text-error">
          {submitError}
        </div>
      )}

      {/* Images */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Photos</label>
        <ImageUploader
          onChange={setImages}
          error={imagesTouched ? errors.images : undefined}
          initialUrls={initialImages}
        />
      </div>

      {/* Basics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink">Title</label>
          <input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            onBlur={() => blur("title")}
            placeholder="e.g. iPhone 12, 128GB"
            className={fieldClass("title")}
          />
          {touched.title && errors.title && (
            <p className="mt-1.5 text-xs text-error">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Category</label>
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            onBlur={() => blur("category")}
            className={fieldClass("category")}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {touched.category && errors.category && (
            <p className="mt-1.5 text-xs text-error">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Condition</label>
          <select
            value={values.condition}
            onChange={(e) => set("condition", e.target.value)}
            onBlur={() => blur("condition")}
            className={fieldClass("condition")}
          >
            <option value="">Select condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {touched.condition && errors.condition && (
            <p className="mt-1.5 text-xs text-error">{errors.condition}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Price</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">
              ৳
            </span>
            <input
              type="number"
              min="0"
              value={values.price}
              onChange={(e) => set("price", e.target.value)}
              onBlur={() => blur("price")}
              placeholder="0"
              className={`${fieldClass("price")} pl-8`}
            />
          </div>
          {touched.price && errors.price && (
            <p className="mt-1.5 text-xs text-error">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Location</label>
          <input
            value={values.location}
            onChange={(e) => set("location", e.target.value)}
            onBlur={() => blur("location")}
            placeholder="e.g. Dhanmondi, Dhaka"
            className={fieldClass("location")}
          />
          {touched.location && errors.location && (
            <p className="mt-1.5 text-xs text-error">{errors.location}</p>
          )}
        </div>
      </div>

      {/* AI Smart Listing Assistant */}
      <div className="rounded-card border border-dashed border-lavender bg-cta-tint/30 p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cta" />
          <h2 className="text-sm font-semibold text-ink">AI Listing Assistant</h2>
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          Add a few keywords about the item and let AI draft the descriptions below.
        </p>

        <textarea
          value={values.keywords}
          onChange={(e) => set("keywords", e.target.value)}
          placeholder="e.g. 2 years used, minor scratch on back, original charger included"
          rows={2}
          className="mt-3 w-full rounded-field border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-cta/40"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-border bg-surface p-1">
            {LENGTH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLength(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-standard ${
                  length === opt.value ? "bg-cta text-white" : "text-ink-muted hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 rounded-full bg-cta px-4 py-1.5 text-xs font-semibold text-white shadow-soft transition-standard hover:bg-cta-hover disabled:opacity-60"
          >
            {generating ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
            {values.shortDescription ? "Regenerate" : "Generate with AI"}
          </button>

          {values.shortDescription && !generating && (
            <span className="flex items-center gap-1 text-xs text-ink-faint">
              <RotateCcw size={12} /> Not happy? Regenerate anytime
            </span>
          )}
        </div>

        {aiError && <p className="mt-2 text-xs text-error">{aiError}</p>}
      </div>

      {/* Short description */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Short description</label>
          <button
            type="button"
            onClick={() => handleImprove("short")}
            disabled={!values.shortDescription.trim() || improving === "short"}
            className="flex items-center gap-1 text-xs font-medium text-cta hover:underline disabled:opacity-50"
          >
            {improving === "short" ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Sparkles size={12} />
            )}
            Improve my description
          </button>
        </div>
        <textarea
          value={values.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
          onBlur={() => blur("shortDescription")}
          placeholder="A one to two line summary shown on listing cards"
          rows={2}
          className={fieldClass("shortDescription")}
        />
        {touched.shortDescription && errors.shortDescription && (
          <p className="mt-1.5 text-xs text-error">{errors.shortDescription}</p>
        )}
      </div>

      {/* Full description */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Full description</label>
          <button
            type="button"
            onClick={() => handleImprove("full")}
            disabled={!values.fullDescription.trim() || improving === "full"}
            className="flex items-center gap-1 text-xs font-medium text-cta hover:underline disabled:opacity-50"
          >
            {improving === "full" ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Sparkles size={12} />
            )}
            Improve my description
          </button>
        </div>
        <textarea
          value={values.fullDescription}
          onChange={(e) => set("fullDescription", e.target.value)}
          onBlur={() => blur("fullDescription")}
          placeholder="Condition, features, why you're selling it, anything a buyer should know"
          rows={6}
          className={fieldClass("fullDescription")}
        />
        {touched.fullDescription && errors.fullDescription && (
          <p className="mt-1.5 text-xs text-error">{errors.fullDescription}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-field bg-cta py-3 text-sm font-semibold text-white shadow-soft transition-standard hover:bg-cta-hover disabled:opacity-60"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
