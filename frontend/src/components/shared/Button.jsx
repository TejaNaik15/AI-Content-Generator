// A simple reusable Button component using Tailwind CSS
export default function Button({ children, variant = "primary", className = "", ...props }) {
  let base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ";
  let variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline: "border border-white/20 text-white bg-transparent hover:bg-white/10",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };
  return (
    <button className={`${base} ${variants[variant] || ""} ${className}`} {...props}>
      {children}
    </button>
  );
}
