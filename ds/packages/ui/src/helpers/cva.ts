// Minimal cva (class variance authority) helper
// For advanced usage, consider installing 'class-variance-authority' package
export type CVAOptions = {
  variants?: Record<string, Record<string, string>>;
  defaultVariants?: Record<string, string>;
};

export function cva(
  base: string,
  options: CVAOptions = {}
) {
  return (props: Record<string, string | boolean | undefined> = {}) => {
    let classes = [base];
    if (options.variants) {
      for (const variant in options.variants) {
        const value = props[variant] ?? options.defaultVariants?.[variant];
        if (value && options.variants[variant][value as string]) {
          classes.push(options.variants[variant][value as string]);
        }
      }
    }
    return classes.join(' ');
  };
}
