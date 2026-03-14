import { useTheme } from "../context/ThemeContext";

/**
 * Logo component for CricketXI branding
 * Props:
 *   size - "sm" | "md" | "lg" for different use cases
 *   variant - "full" (shows CRICKET XI) | "xi" (shows only XI)
 */
export default function Logo({ size = "md", variant = "full" }) {
  const { colors } = useTheme();

  // Size configurations
  const sizes = {
    sm: {
      cricketSize: "text-xs",
      xiSize: "text-sm",
      dotSize: "w-0.5 h-0.5",
      dotOffset: { top: "1px", right: "-3px" },
      gap: "gap-0.5",
    },
    md: {
      cricketSize: "text-lg",
      xiSize: "text-2xl",
      dotSize: "w-1 h-1",
      dotOffset: { top: "2px", right: "-4px" },
      gap: "gap-1",
    },
    lg: {
      cricketSize: "text-3xl",
      xiSize: "text-5xl",
      dotSize: "w-1.5 h-1.5",
      dotOffset: { top: "4px", right: "-6px" },
      gap: "gap-2",
    },
  };

  const config = sizes[size];

  if (variant === "xi") {
    return (
      <div className="relative flex items-center justify-center">
        <span
          className={`${config.xiSize} font-black leading-none tracking-tight uppercase font-sans`}
          style={{
            color: "transparent",
            WebkitTextStroke: `2px ${colors.accent}`,
          }}
        >
          XI
        </span>
        <div
          className={`absolute ${config.dotSize}`}
          style={{
            background: colors.accent,
            ...config.dotOffset,
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-center ${config.gap}`}>
      <span
        className={`${config.cricketSize} font-black leading-none tracking-tight uppercase font-sans`}
        style={{ color: colors.text }}
      >
        CRICKET
      </span>
      <span
        className={`${config.xiSize} font-black leading-none tracking-tight uppercase font-sans`}
        style={{
          color: "transparent",
          WebkitTextStroke: `2px ${colors.accent}`,
        }}
      >
        XI
      </span>
      <div
        className={`absolute ${config.dotSize}`}
        style={{
          background: colors.accent,
          bottom: config.dotOffset.top,
          right: config.dotOffset.right,
        }}
      />
    </div>
  );
}
