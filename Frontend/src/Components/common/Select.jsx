import { useLanguage } from "../../hooks/useLanguage";

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  required = false
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

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none
          ${
            error
              ? "border-red-500"
              : "border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          }`}
      >
        <option value="">{typeof placeholder === "string" ? t(placeholder, placeholder) : placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {typeof option.label === "string" ? t(option.label, option.label) : option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {typeof error === "string" ? t(error, error) : error}
        </p>
      )}
    </div>
  );
}

export default Select;
