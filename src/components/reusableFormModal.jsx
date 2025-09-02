import React from "react";

const ReusableFormModal = ({
  open,
  handleClose,
  title,
  fields,
  formData,
  setFormData,
  onSubmit,
  formErrors = {},
  tabs = null
}) => {
  if (!open) return null;

  const [activeTab, setActiveTab] = React.useState(tabs?.[0] ?? null);

  const handleChange = (e, field) => {
    let value = field.type === "checkbox" ? e.target.checked : e.target.value;
    const name = field.name;

    const arrayRegex = /^(\w+)\[(\d+)]\.(\w+)$/;
    const nestedRegex = /^(\w+)\.(\w+)$/;

    if (arrayRegex.test(name)) {
      const [, arrayName, indexStr, fieldKey] = name.match(arrayRegex);
      const index = parseInt(indexStr, 10);

      setFormData((prev) => ({
        ...prev,
        [arrayName]: prev[arrayName]?.map((item, i) =>
          i === index ? { ...item, [fieldKey]: value } : item
        ),
      }));
    } else if (nestedRegex.test(name)) {
      const [, objKey, fieldKey] = name.match(nestedRegex);

      setFormData((prev) => ({
        ...prev,
        [objKey]: {
          ...prev[objKey],
          [fieldKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const getNestedValue = (obj, path) => {
    return path
      .replace(/\[(\d+)]/g, ".$1")
      .split(".")
      .reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

        {tabs && (
          <div className="flex space-x-4 border-b mb-4 overflow-scroll">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div>
            {fields
              .filter((field) => !tabs || field.tab === activeTab)
              .map((field) => {
                const hasError = !!formErrors[field.name];

                return (
                  <div key={field.name} className="md:grid md:grid-cols-5 items-center mb-2">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700 col-span-2"
                    >
                      {field.label}
                    </label>

                    {field.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        name={field.name}
                        id={field.name}
                        checked={getNestedValue(formData, field.name) || false}
                        disabled={field.disabled}
                        onChange={(e) => handleChange(e, field)}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded col-span-3"
                      />
                    ) : field.type === "list" ? (
                      <select
                        name={field.name}
                        id={field.name}
                        value={getNestedValue(formData, field.name) ?? ""}
                        disabled={field.disabled}
                        onChange={(e) => handleChange(e, field)}
                        className={`mt-1 block w-full rounded-md shadow-sm p-2 sm:text-sm col-span-3
                          ${hasError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}
                          ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        id={field.name}
                        step={field.step || undefined}
                        value={getNestedValue(formData, field.name) ?? ""}
                        disabled={field.disabled}
                        onChange={(e) => handleChange(e, field)}
                        className={`mt-1 block w-full rounded-md shadow-sm p-2 sm:text-sm col-span-3
                          ${hasError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}
                          ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      />
                    )}

                    {hasError && (
                      <p className="text-red-500 text-xs mt-1">{formErrors[field.name]}</p>
                    )}
                  </div>
                );
              })}
          </div>

          <div className="sticky bottom-[-25px] flex justify-end space-x-2 mt-6 bg-white p-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReusableFormModal;