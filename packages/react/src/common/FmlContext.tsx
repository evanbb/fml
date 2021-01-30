import { createContext, useContext } from 'react';

export interface FmlContextShape {
  currentFormPath: string;
}

export const FmlContext = createContext<FmlContextShape>({} as FmlContextShape);

export function useFmlContext() {
  return useContext(FmlContext);
}

interface FmlContextProviderProps
  extends React.PropsWithChildren<{
    value: FmlContextShape;
  }> {}

export function FmlContextProvider({
  value,
  children,
}: FmlContextProviderProps) {
  return <FmlContext.Provider value={value}>{children}</FmlContext.Provider>;
}

export function combineFormPath(
  { currentFormPath }: FmlContextShape,
  name: string,
) {
  return currentFormPath.length ? `${currentFormPath}[${name}]` : name;
}
