function Tooltip({
  children,
  content,
  position = "top"
}) {
  const positions = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2"
  };

  return (
    <div className="group relative inline-flex">
      {children}

      <div
        role="tooltip"
        className={`pointer-events-none absolute z-50 w-max max-w-56 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 ${positions[position]}`}
      >
        {content}
      </div>
    </div>
  );
}

export default Tooltip;