import Link from "next/link";
import Image from "next/image";

interface BrandMarkProps {
  light?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  withEmblem?: boolean;
  className?: string;
  priority?: boolean;
}

export function BrandMark({
  light = false,
  size = "md",
  className = "",
  priority = true,
}: BrandMarkProps) {
  // Official MAH Diamonds logo provided by the client
  // White/ivory version for dark backgrounds (e.g. footer), Midnight Navy for light backgrounds (e.g. header)
  const logoSrc = light ? "/images/brand/mah-logo-white.png" : "/images/brand/mah-logo.png";

  const dims = {
    sm: { width: 28, height: 56 },
    md: { width: 38, height: 76 },
    lg: { width: 56, height: 112 },
    xl: { width: 75, height: 150 },
  }[size] || { width: 38, height: 76 };

  return (
    <Link
      href="/"
      className={`brand-mark brand-mark-${size} ${light ? "brand-mark-light" : "brand-mark-dark"} ${className}`}
      aria-label="MAH Diamonds home"
    >
      <span className="brand-logo-frame">
        <Image
          src={logoSrc}
          alt="MAH Diamonds London"
          width={dims.width}
          height={dims.height}
          priority={priority}
          className="brand-logo-img"
        />
      </span>
    </Link>
  );
}

