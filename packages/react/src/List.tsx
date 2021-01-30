import { ListConfiguration } from '@evanbb/fml-core';
import FmlComponent from './common/FmlComponent';
import {
  FmlContextProvider,
  useFmlContext,
  combineFormPath,
} from './common/FmlContext';

interface ListProps<TValue> {
  config: ListConfiguration<TValue>;
}

export default function List<TValue>({ config }: ListProps<TValue>) {
  const context = useFmlContext();
  const labelId = `${context.currentFormPath}-label`;

  return (
    <div role='group' aria-labelledby={labelId}>
      <label id={labelId}>{config.label}</label>
      <ul>
        <li>
          <FmlContextProvider
            // clean this up so it doesnt constantly rerender
            value={{
              currentFormPath: combineFormPath(context, `${0}`),
            }}
          >
            <FmlComponent config={config.itemSchema} />
          </FmlContextProvider>
        </li>
      </ul>
    </div>
  );
}
