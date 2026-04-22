"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  className?: string;
};

export function Progress({ label, value, className }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-text">{label}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-xs text-text-muted tabular-nums"
        >
          {value}%
        </motion.span>
      </div>
      <ProgressPrimitive.Root
        className="relative h-[2px] w-full overflow-hidden bg-[var(--border)]"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-accent"
        />
      </ProgressPrimitive.Root>
    </div>
  );
}
