import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const resolverRef = useRef(null);
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback((options = {}) => new Promise((resolve) => {
    resolverRef.current = resolve;
    setDialog({
      title: options.title || 'Confirm action',
      message: options.message || 'Are you sure?',
      confirmLabel: options.confirmLabel || 'Confirm',
      cancelLabel: options.cancelLabel || 'Cancel',
      tone: options.tone || 'danger',
    });
  }), []);

  const close = useCallback((value) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setDialog(null);
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {dialog ? (
        <div className="confirm-overlay" role="presentation" onMouseDown={() => close(false)}>
          <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className={`confirm-icon confirm-${dialog.tone}`}><AlertTriangle size={18} /></div>
            <div>
              <h2 id="confirm-title">{dialog.title}</h2>
              <p>{dialog.message}</p>
            </div>
            <div className="confirm-actions">
              <button className="button button-secondary button-compact" type="button" onClick={() => close(false)}>{dialog.cancelLabel}</button>
              <button className="button button-danger button-compact" type="button" onClick={() => close(true)}>{dialog.confirmLabel}</button>
            </div>
          </section>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm must be used inside ConfirmProvider');
  return context.confirm;
}
