"use client";

import { X } from "lucide-react";
import { useId, useMemo, useState } from "react";

type Props = {
  label: string;
  description?: string;
  value: string[];
  onChange: (next: string[]) => void;
  max: number;
  placeholder?: string;
};

function normalizeTag(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export function TagInput({
  label,
  description,
  value,
  onChange,
  max,
  placeholder = "Type a skill and press Enter",
}: Props) {
  const id = useId();
  const [input, setInput] = useState("");

  const remaining = Math.max(0, max - value.length);
  const canAddMore = value.length < max;

  const existing = useMemo(() => new Set(value.map((v) => v.toLowerCase())), [value]);

  function addTag(raw: string) {
    const tag = normalizeTag(raw);
    if (!tag) return;
    if (!canAddMore) return;
    if (existing.has(tag.toLowerCase())) return;
    onChange([...value, tag]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <label htmlFor={id} className="text-sm font-semibold text-cream">
            {label}
          </label>
          {description ? (
            <p className="text-xs text-white/60">{description}</p>
          ) : null}
        </div>
        <p className="text-xs font-semibold text-white/60">
          {value.length}/{max}
          {remaining > 0 ? ` • ${remaining} left` : ""}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface-card p-3">
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/80 hover:bg-black/40"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <input
          id={id}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(input);
              return;
            }
            if (e.key === "," || e.key === "Tab") {
              e.preventDefault();
              addTag(input);
            }
            if (e.key === "Backspace" && input.length === 0 && value.length > 0) {
              removeTag(value[value.length - 1]);
            }
          }}
          placeholder={canAddMore ? placeholder : "Limit reached"}
          className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/20"
          disabled={!canAddMore}
        />
      </div>
    </div>
  );
}

