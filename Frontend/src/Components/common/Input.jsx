import { useLanguage } from "../../hooks/useLanguage";

function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  className = "",
  ...props
}) {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {typeof label === "string" ? t(label, label) : label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={typeof placeholder === "string" ? t(placeholder, placeholder) : placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`ui-field text-sm
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          }
          ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {typeof error === "string" ? t(error, error) : error}
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1 text-xs text-gray-500">
          {typeof helperText === "string" ? t(helperText, helperText) : helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
