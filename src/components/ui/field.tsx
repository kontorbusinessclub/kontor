import type {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  /** Sichtbares Label, per htmlFor mit dem Control verbunden. */
  label: ReactNode;
  /** id des zugehörigen Controls (für <label htmlFor>). */
  htmlFor: string;
  required?: boolean;
  /** Fehlertext. Wird als #{htmlFor}-error für aria-describedby ausgegeben. */
  error?: ReactNode;
  /** Optionaler Hilfetext unter dem Label. */
  hint?: ReactNode;
  className?: string;
  children?: ReactNode;
};

/**
 * Form-Field-Wrapper: Label, Pflicht-Markierung, Hilfe- und Fehlertext.
 * Controls (Input/Textarea/Select) erhalten aria-Anbindung über ids.
 */
export function Field({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const hintId = hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-koenigsblau"
      >
        {label}
        {required ? (
          <span className="text-smaragd" aria-hidden="true">
            {" *"}
          </span>
        ) : null}
      </label>

      {hint ? (
        <p id={hintId} className="font-sans text-sm text-tinte/70">
          {hint}
        </p>
      ) : null}

      {children}

      {error ? (
        <p id={errorId} role="alert" className="font-sans text-sm text-smaragd">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlBase =
  "w-full rounded-md border bg-white px-4 py-3 font-sans text-base text-tinte " +
  "placeholder:text-tinte/40 transition-colors duration-150 " +
  "focus:border-koenigsblau focus:outline-none focus:ring-2 focus:ring-kontorblau/30 " +
  "disabled:cursor-not-allowed disabled:bg-champagner/50 disabled:opacity-70 " +
  "aria-[invalid=true]:border-smaragd";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(controlBase, "border-koenigsblau/25", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid, rows = 5, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(controlBase, "min-h-32 resize-y border-koenigsblau/25", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  children?: ReactNode;
};

export function Select({ className, invalid, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(controlBase, "border-koenigsblau/25 pr-10", className)}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
}
