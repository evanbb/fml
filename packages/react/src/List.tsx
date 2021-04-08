import {
  FmlListConfiguration,
  FmlValidationStatus,
  FmlValueState,
  FmlValueStateChangeHandler,
  Noop,
} from '@fml/core';
import { FmlFormConfiguration } from '@fml/core/src/types';
import { useRef, useState, useEffect, useCallback, memo } from 'react';
import FmlComponent, { FmlComponentProps } from './common/FmlComponent';
import { useFmlComponent } from './common/hooks';
import ValidationMessages from './ValidationMessages';

interface CollectionItem<TValue> {
  value: TValue;
  fmlListId: number;
  validity: FmlValidationStatus;
}

function useListItemId() {
  const currentId = useRef<number>(Number.MIN_SAFE_INTEGER);
  const newIdRef = useRef<{
    newId: () => number;
  }>({
    newId: () => currentId.current++,
  });

  return newIdRef.current;
}

function useListItemTransform<TValue>(
  props: FmlComponentProps<TValue[], FmlListConfiguration<TValue>>,
) {
  const {
    onChange: updateList,
    onFocus,
    value: list,
    validationMessages,
  } = useFmlComponent<TValue[]>({
    ...props,
    config: {
      ...props.config,
      defaultValue: props.config.defaultValue || [],
    },
  });

  const { newId } = useListItemId();

  const [collection, updateCollection] = useState<CollectionItem<TValue>[]>(
    list.value.map((item) => ({
      value: item,
      fmlListId: newId(),
      validity: 'unknown',
    })),
  );

  const insert = useCallback(() => {
    updateCollection((coll) => [
      ...coll,
      {
        value: props.config.itemSchema.defaultValue as TValue,
        fmlListId: newId(),
        validity: 'unknown',
      },
    ]);
  }, [props.config.itemSchema.defaultValue, newId]);

  const remove = useCallback((fmlListId: number) => {
    updateCollection((coll) => {
      return coll.filter((i) => i.fmlListId !== fmlListId);
    });
  }, []);

  const update = useCallback(
    (fmlListId: number) => (change: FmlValueState<TValue>) => {
      updateCollection((coll) => {
        const changedItemIndex = coll.findIndex(
          (i) => i.fmlListId === fmlListId,
        );

        return [
          ...coll.slice(0, changedItemIndex),
          {
            value: change.value as TValue,
            fmlListId,
            validity: change.validity,
            collectionIndex: changedItemIndex,
          },
          ...coll.slice(changedItemIndex + 1),
        ];
      });
    },
    [],
  );

  useEffect(() => {
    const listItems = collection.map((item) => ({
      value: item.value,
      validity: item.validity,
    }));

    const validities = new Set<FmlValidationStatus>(
      listItems.map((item) => item.validity),
    );

    updateList({
      value: listItems.map((item) => item.value),
      validity: validities.has('invalid')
        ? 'invalid'
        : validities.has('unknown') || validities.has('pending')
        ? 'unknown'
        : 'pending',
    });
  }, [collection, updateList]);

  return {
    validationMessages,
    collection,
    insert,
    remove,
    update,
    onFocus,
    validity: list.validity
  };
}

interface ListItemProps<TValue> {
  fmlListId: number;
  update: (fmlListId: number) => FmlValueStateChangeHandler<TValue>;
  remove: (fmlListId: number) => void;
  itemSchema: FmlFormConfiguration<TValue>;
  listControlId: string;
  onFocus: Noop;
  defaultValue: TValue
}

function ListItemComponent<TValue>({
  fmlListId,
  update,
  remove,
  itemSchema,
  listControlId,
  onFocus,
  defaultValue
}: ListItemProps<TValue>) {
  /**
   * if the list's config defaultValue is [1, 2, 3], we want each list
   * item's default value to reflect the corresponding value in the list,
   * not the default value from the itemSchema
   * 
   * if nothing is provided, use the defaultValue from the itemSchema config
   * and let the component figure it out
   * 
   * once it is set, though, we let the component maintain its own state, so 
   * no need to ever update this piece of information
   */
  const [actualConfig] = useState({
    ...itemSchema,
    defaultValue: typeof defaultValue === 'undefined'
      ? itemSchema.defaultValue
      : defaultValue
  })
  const changeHandler = useCallback(
    (change: FmlValueState<TValue>) => update(fmlListId)(change),
    [update, fmlListId],
  );

  const removeHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      remove(fmlListId);
      e.preventDefault();
    },
    [remove, fmlListId],
  );

  return (
    <li>
      <FmlComponent
        config={actualConfig}
        onChange={changeHandler}
        onFocus={onFocus}
        controlId={`${listControlId}[${fmlListId}]`}
      />
      <button onClick={removeHandler}>-</button>
    </li>
  );
}

function List<TValue>(
  props: FmlComponentProps<TValue[], FmlListConfiguration<TValue>>,
) {
  const {
    collection,
    update,
    insert,
    remove,
    onFocus,
    validationMessages,
    validity
  } = useListItemTransform(props);

  const labelId = `${props.controlId}-label`;

  return (
    <div role='group' aria-labelledby={labelId}>
      <ValidationMessages validationMessages={validationMessages} />
      <label data-fml-validity={validity} id={labelId}>{props.config.label}</label>
      <ul>
        {collection.map(({ value, fmlListId }) => (
          <ListItemComponent<TValue>
            key={fmlListId}
            fmlListId={fmlListId}
            update={update}
            remove={remove}
            listControlId={props.controlId}
            itemSchema={{...props.config.itemSchema as FmlFormConfiguration<TValue>}}
            onFocus={onFocus}
            defaultValue={value}
          />
        ))}
        <li>
          <button
            onClick={(e) => {
              insert();
              e.preventDefault();
            }}
          >
            +
          </button>
        </li>
      </ul>
    </div>
  );
}

export default memo(List) as typeof List;
