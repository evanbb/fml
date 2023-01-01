import { FmlValueState, FmlValueStateChangeHandler } from '@fml/core';
import { createContext, useCallback, useContext, useMemo } from 'react';

interface FmlControlContext<Value> {
  value: FmlValueState<Value>;
  validationMessages: string[];
  onChange: FmlValueStateChangeHandler<Value>;
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
  Value,
> extends React.PropsWithChildren<{
    localControlId: string;
    onChange?: FmlValueStateChangeHandler<Value>;
  }> {}

export function FmlContextProvider<Value>({
  children,
  localControlId,
  onChange,
}: FmlControlContextProviderProps<Value>) {
  const {
    controlId: contextControlId,
    onBlur: contextOnBlur,
    onFocus: contextOnFocus,
    onChange: contextOnChange,
  } = useFmlContext<Value>();

  const providerControlId = useFmlProviderControlId(
    contextControlId,
    localControlId,
  );

  const { blurHandler } = useFmlContextBlur(contextOnBlur);
  const { focusHandler } = useFmlContextFocus(contextOnFocus);
  const { changeHandler } = useFmlContextChange(contextOnChange, onChange);

  const newContexValue = useMemo(
    () => ({
      controlId: providerControlId,
      onChange: changeHandler,
      onFocus: focusHandler,
      onBlur: blurHandler,
    }),
    [providerControlId, changeHandler, focusHandler, blurHandler],
  );

  return (
    <Provider value={newContexValue as FmlControlContext<unknown>}>
      {children}
    </Provider>
  );
}

//#region hooks

function useFmlProviderControlId(parentId: string, childId: string) {
  return parentId ? `${parentId}[${childId}]` : childId;
}

export function useFmlContext<Value>() {
  return useContext(fmlControlContext) as FmlControlContext<Value>;
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
  contextOnChange: FmlValueStateChangeHandler<never>,
  onChange?: FmlValueStateChangeHandler<never>,
) {
  const changeHandler = useCallback<FmlValueStateChangeHandler<never>>(
    (change) => {
      onChange?.(change);
      contextOnChange(change);
    },
    [contextOnChange, onChange],
  );

  return { changeHandler };
}

//#endregion
