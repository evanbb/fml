import {
  FmlControlConfigurationBase,  FmlValidityStatus,
  FmlValueState,
  FmlValueStateChangeHandler,
  FmlConfiguration,
  FmlControlConfiguration,
  FmlListConfiguration,
} from '@fml/core';
import { FmlContextProvider, useFmlContext } from './common/FmlControlContext';
import { useFmlControl } from './common/useFmlControl';
import { useRef, useState, useEffect, useCallback, memo } from 'react';
import FmlComponent, {
  getControlConfig,
} from './common/FmlComponent';
import ValidationMessages from './ValidationMessages';

interface CollectionItem<Value> {
  value: Value;
  fmlListId: number;
  validity: FmlValidityStatus;
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

function useListItemTransform<Value>(props: ListProps<Value>) {
  const {
    changeHandler: updateList,
    focusHandler: onFocus,
    value: list,
    validationMessages,
  } = useFmlControl<Value[]>(
    props.config as FmlControlConfiguration<Value[]>,
  );

  const { newId } = useListItemId();

  const [collection, updateCollection] = useState<CollectionItem<Value>[]>(
    (list.value || []).map((item) => ({
      value: item,
      fmlListId: newId(),
      validity: 'unknown',
    })),
  );

  const insert = useCallback(() => {
    updateCollection((coll) => [
      ...coll,
      {
        value: getControlConfig(
          (getControlConfig(props.config) as FmlListConfiguration<Value>)
            .itemConfig,
        ).defaultValue as Value,
        fmlListId: newId(),
        validity: 'unknown',
      },
    ]);
  }, [
    (getControlConfig(props.config) as FmlControlConfiguration<Value[]>)
      .itemConfig,
    newId,
  ]);

  const remove = useCallback((fmlListId: number) => {
    updateCollection((coll) => {
      return coll.filter((i) => i.fmlListId !== fmlListId);
    });
  }, []);

  const update = useCallback(
    (fmlListId: number) => (change: FmlValueState<Value>) => {
      updateCollection((coll) => {
        const changedItemIndex = coll.findIndex(
          (i) => i.fmlListId === fmlListId,
        );

        return [
          ...coll.slice(0, changedItemIndex),
          {
            value: change.value as Value,
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

    const validities = new Set<FmlValidityStatus>(
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
    validity: list.validity,
  };
}

interface ListItemProps<Value> {
  fmlListId: number;
  elementIndex: number;
  update: (fmlListId: number) => FmlValueStateChangeHandler<Value>;
  remove: (fmlListId: number) => void;
  itemConfig: FmlConfiguration<Value>;
  onFocus: () => void;
  defaultValue: Value;
}

function ListItemComponent<Value>({
  fmlListId,
  update,
  remove,
  itemConfig,
  defaultValue,
  elementIndex,
}: ListItemProps<Value>) {
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
   *
   * TODO: fix this for lists with items in layouts
   */

  const [actualConfig] = useState<FmlControlConfigurationBase<Value>>({
    ...getControlConfig(itemConfig),
    defaultValue:
      typeof defaultValue === 'undefined'
        ? getControlConfig<Value>(itemConfig).defaultValue
        : defaultValue,
  });
  const changeHandler = useCallback(
    (change: FmlValueState<Value>) => update(fmlListId)(change),
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
      <FmlContextProvider<Value>
        onChange={changeHandler}
        localControlId={String(elementIndex)}
      >
        <FmlComponent<Value>
          config={actualConfig as FmlConfiguration<Value>}
        />
      </FmlContextProvider>
      <button onClick={removeHandler}>-</button>
    </li>
  );
}

export interface ListProps<Value> {
  config: FmlListConfiguration<Value>;
}

function List<Value>(props: ListProps<Value>) {
  const {
    collection,
    update,
    insert,
    remove,
    onFocus,
    validationMessages,
    validity,
  } = useListItemTransform(props);

  const { controlId } = useFmlContext();

  const labelId = `${controlId}-label`;

  return (
    <div role='group' aria-labelledby={labelId}>
      <label data-fml-validity={validity} id={labelId}>
        {props.config.label}
      </label>
      <ValidationMessages validationMessages={validationMessages} />
      <ul>
        {collection.map(({ value, fmlListId }, elementIndex) => (
          <ListItemComponent<Value>
            key={fmlListId}
            fmlListId={fmlListId}
            update={update}
            remove={remove}
            itemConfig={props.config.itemConfig}
            onFocus={onFocus}
            defaultValue={value}
            elementIndex={elementIndex}
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
