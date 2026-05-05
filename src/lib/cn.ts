import clsx, { type ClassValue } from "clsx";

/** Tiny className merger — wraps clsx so callers don't import it everywhere. */
export const cn = (...args: ClassValue[]): string => clsx(args);
