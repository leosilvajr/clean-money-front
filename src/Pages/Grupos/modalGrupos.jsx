import { useEffect, useRef, useState } from "react";

export default function ModalCreateGroup({
  isOpen,
  onClose,
  onCreate,          // (name) => void
  existingNames = [], // opcional: valida nomes duplicados
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setError("");
      // foca no input ao abrir
      setTimeout(() => inputRef.current?.focus(), 0);
      // ESC fecha
      const onKey = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    if (!name.trim()) return "Informe o nome do grupo.";
    if (name.trim().length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    const dup = existingNames.some(
      (n) => n.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (dup) return "Já existe um grupo com esse nome.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    onCreate(name.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-[95%] max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Criar grupo
        </h2>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="group-name"
              className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
            >
              Nome do grupo
            </label>
            <input
              id="group-name"
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex.: Grupo Financeiro"
            />
            {!!error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
