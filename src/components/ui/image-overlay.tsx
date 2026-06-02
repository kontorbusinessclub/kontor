import Image from "next/image";
import { cn } from "@/lib/utils";

type Overlay = "soft" | "medium" | "strong";

const OVERLAY: Record<Overlay, string> = {
  soft: "bg-koenigsblau/55",
  medium: "bg-koenigsblau/70",
  strong: "bg-koenigsblau/85",
};

export type ImageOverlayProps = {
  src: string;
  alt: string;
  children?: React.ReactNode;
  /** Königsblau-Schleier (Markenregel: Foto immer abdunkeln, dann Champagner-Text). */
  overlay?: Overlay;
  priority?: boolean;
  /** Höhe der Bühne, z.B. "min-h-[70vh]" oder "min-h-[340px]". */
  heightClassName?: string;
  align?: "center" | "end";
  className?: string;
  contentClassName?: string;
};

/**
 * Atmosphärische Bild-Bühne im Markenlook: Foto + Königsblau-Schleier,
 * Inhalt (Champagner-Text) liegt darüber. Bilder liegen in /public/images.
 */
export function ImageOverlay({
  src,
  alt,
  children,
  overlay = "medium",
  priority = false,
  heightClassName = "min-h-[60vh]",
  align = "center",
  className,
  contentClassName,
}: ImageOverlayProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden text-champagner",
        heightClassName,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      <div className={cn("absolute inset-0", OVERLAY[overlay])} aria-hidden="true" />
      <div
        className={cn(
          "relative z-10 mx-auto flex h-full w-full max-w-[var(--container-wide)] flex-col px-5 py-16 sm:py-24",
          align === "end" ? "justify-end" : "justify-center",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
