import { createContext, useContext, useState, type ReactNode } from "react";
import { AlertCircle, HelpCircle } from "lucide-react";

export interface ModalOptions {
  title: string;
  message: string;
  type?: "confirm" | "prompt";
  defaultValue?: string;
}

interface ModalContextType {
  confirm: (options: ModalOptions) => Promise<boolean>;
  prompt: (options: ModalOptions) => Promise<string | null>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [resolvePromise, setResolvePromise] = useState<{ resolve: (value: any) => void } | null>(null);

  const confirm = (opts: ModalOptions): Promise<boolean> => {
    setOptions({ ...opts, type: "confirm" });
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolvePromise({ resolve });
    });
  };

  const prompt = (opts: ModalOptions): Promise<string | null> => {
    setOptions({ ...opts, type: "prompt" });
    setInputValue(opts.defaultValue || "");
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolvePromise({ resolve });
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise.resolve(options?.type === "prompt" ? null : false);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise.resolve(options?.type === "prompt" ? inputValue : true);
    }
  };

  return (
    <ModalContext.Provider value={{ confirm, prompt }}>
      {children}

      {isOpen && options && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCancel}></div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md relative z-10 animate-fadeIn">
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-full shrink-0 ${options.type === 'confirm' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                {options.type === 'confirm' ? <AlertCircle className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
              </div>
              <div className="flex-1 mt-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{options.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{options.message}</p>
                
                {options.type === "prompt" && (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirm();
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer ${
                  options.type === 'confirm' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
