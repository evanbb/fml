import { useId } from 'react';
import { FmlFormState, type FmlFormStateClassification } from '@fml/core';
import FmlComponent from './common/FmlComponent';
import ValidationMessages from './ValidationMessages';

export interface ListProps<Value> {
  formState: FmlFormStateClassification<Value, 'list'>;
  renderListItem?: (
    listItem: FmlFormState<Value>,
    index: number,
    key: string,
  ) => React.ReactNode;
}

function List<Value>({ formState, renderListItem }: ListProps<Value>) {
  const {
    bindings: { addItem, removeItem, keyOf, items: bindingsItems },
    state: { validity, validationMessages, label, items: stateItems },
    value,
  } = formState;

  const id = useId();
  const labelId = `${id}-label`;

  return (
    <div role='group' aria-labelledby={labelId}>
      <label data-fml-validity={validity} id={labelId}>
        {label}
      </label>
      <ValidationMessages validationMessages={validationMessages} />
      <ul>
        {value.map((value, idx) =>
          renderListItem ? (
            renderListItem(
              {
                value,
                bindings: bindingsItems[idx],
                state: stateItems[idx],
              },
              idx,
              keyOf(idx),
            )
          ) : (
            <li key={keyOf(idx)}>
              <FmlComponent
                formState={{
                  value,
                  bindings: bindingsItems[idx],
                  state: stateItems[idx],
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeItem(idx);
                }}
                title='Remove item'
              >
                -
              </button>
            </li>
          ),
        )}
        <li>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem();
            }}
            title='Add item'
          >
            +
          </button>
        </li>
      </ul>
    </div>
  );
}

export default List;
