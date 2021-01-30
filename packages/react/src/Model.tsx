import { ModelConfiguration } from '@evanbb/fml-core';
import FmlComponent from './common/FmlComponent';
import {
  combineFormPath,
  FmlContextProvider,
  useFmlContext,
} from './common/FmlContext';

interface ModelProps<TValue> {
  config: ModelConfiguration<TValue>;
}

export default function Model<TValue>({ config }: ModelProps<TValue>) {
  const context = useFmlContext();
  return (
    <fieldset>
      <legend>{config.label}</legend>
      {Object.keys(config.schema).map((c) => (
        <FmlContextProvider
          key={c}
          // clean this up so it doesnt constantly rerender
          value={{
            currentFormPath: combineFormPath(context, c),
          }}
        >
          <FmlComponent
            config={config.schema[c as keyof typeof config.schema]}
          />
        </FmlContextProvider>
      ))}
    </fieldset>
  );
}
