
"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "../ui/Button";

export function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);

  // Run only on the client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  // Don’t render until client mount
  if (!hasMounted) return null;

  return (
    <Button
      intent="outline"
      size="sm"
      onClick={toggle}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    >
      {mode === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}

