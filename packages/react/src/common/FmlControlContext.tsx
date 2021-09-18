import { ValueState, ValueStateChangeHandler } from '@fml/core';
import { createContext, useCallback, useContext, useMemo } from 'react';

interface FmlControlContext<TValue> {
  value: ValueState<TValue>;
  validationMessages: string[];
  onChange: ValueStateChangeHandler<TValue>;
  onBlur: () => void;
  onFocus: () => void;
  hasBeenTouched: boolean;
  controlId: string;
}

const fmlControlContext = createContext<FmlControlContext<unknown>>({
  value: {
    value: undefined,
    validity: 'unknown',
  },
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  controlId: '',
  hasBeenTouched: false,
  validationMessages: [],
});

const { Provider } = fmlControlContext;

interface FmlControlContextProviderProps<
  TValue,
> extends React.PropsWithChildren<{
    localControlId: string;
    onChange?: ValueStateChangeHandler<TValue>;
  }> {}

export function FmlContextProvider<TValue>({
  children,
  localControlId,
  onChange,
}: FmlControlContextProviderProps<TValue>) {
  const {
    controlId: contextControlId,
    onBlur: contextOnBlur,
    onFocus: contextOnFocus,
    onChange: contextOnChange,
  } = useFmlContext<TValue>();

  const providerControlId = useFmlProviderControlId(
    contextControlId,
    localControlId,
  );

  const { blurHandler } = useFmlContextBlur(contextOnBlur);
  const { focusHandler } = useFmlContextFocus(contextOnFocus);
  const { changeHandler } = useFmlContextChange(contextOnChange, onChange);

  const newContextValue = useMemo(
    () => ({
      controlId: providerControlId,
      onChange: changeHandler,
      onFocus: focusHandler,
      onBlur: blurHandler,
    }),
    [providerControlId, changeHandler, focusHandler, blurHandler],
  );

  return (
    <Provider value={newContextValue as FmlControlContext<unknown>}>
      {children}
    </Provider>
  );
}

//#region hooks

function useFmlProviderControlId(parentId: string, childId: string) {
  return parentId ? `${parentId}[${childId}]` : childId;
}

export function useFmlContext<TValue>() {
  return useContext(fmlControlContext) as FmlControlContext<TValue>;
}

function useFmlContextBlur(contextOnBlur: () => void) {
  const blurHandler = useCallback(() => {
    contextOnBlur();
  }, [contextOnBlur]);

  return { blurHandler };
}

function useFmlContextFocus(contextOnFocus: () => void) {
  const focusHandler = useCallback(() => {
    contextOnFocus();
  }, [contextOnFocus]);

  return { focusHandler };
}

function useFmlContextChange(
  contextOnChange: ValueStateChangeHandler<never>,
  onChange?: ValueStateChangeHandler<never>,
) {
  const changeHandler = useCallback<ValueStateChangeHandler<never>>(
    (change) => {
      onChange?.(change);
      contextOnChange(change);
    },
    [contextOnChange, onChange],
  );

  return { changeHandler };
}

//#endregion
