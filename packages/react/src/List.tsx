import { useId } from 'react';
import { type FmlFormStateClassification } from '@fml/core';
import FmlComponent from './common/FmlComponent';
import ValidationMessages from './ValidationMessages';

export interface ListProps<Value> {
  formState: FmlFormStateClassification<Value, 'list'>;
}

function List<Value>({ formState }: ListProps<Value>) {
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
        {value.map((value, idx) => (
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
        ))}
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
