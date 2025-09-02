const ConfirmationModal = ({ title, message, onClose, onConfirm, confirmText = "Confirmar", cancelText = "Cancelar", type = "default" }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-lg p-6 border border-slate-300 dark:border-slate-700 animate-fade-in-up">
                
                {/* Título */}
                <h2 className="text-lg font-bold text-center text-slate-800 dark:text-white mb-2">
                    {title}
                </h2>

                {/* Mensagem */}
                {message && (
                    <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
                        {message}
                    </p>
                )}

                {/* Ações */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2 rounded-lg font-medium text-white transition-colors ${
                            type === "danger"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg font-medium bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ConfirmationModal;