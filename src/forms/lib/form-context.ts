import { createContext, useContext, useEffect, useRef } from "react";

export type FormChild = {
  validate: () => boolean | Promise<boolean>;
  resetValidation: () => void;
  focus?: () => void;
  name?: string;
};

export type FormContextValue = {
  bindChild: (child: FormChild) => void;
  unbindChild: (child: FormChild) => void;
};

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormChild(child: FormChild) {
  const form = useContext(FormContext);
  const latest = useRef(child);
  latest.current = child;

  useEffect(() => {
    if (!form) return;

    const proxy: FormChild = {
      validate: () => latest.current.validate(),
      resetValidation: () => latest.current.resetValidation(),
      focus: () => latest.current.focus?.(),
      get name() {
        return latest.current.name;
      },
    };

    form.bindChild(proxy);
    return () => form.unbindChild(proxy);
  }, [form]);
}
