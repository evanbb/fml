import {
  ControlConfigurationBase,
  ValidityStatus,
  ValueState,
  ValueStateChangeHandler,
  registerComponent,
  ConfigurationFor,
} from '@fml/core';
import LIST from '@fml/add/controls/list';
import { FmlContextProvider, useFmlContext } from '../common/FmlControlContext';
import { useFmlControl } from '../common/useFmlControl';
import { useRef, useState, useEffect, useCallback, memo } from 'react';
import FmlComponent from '../common/FmlComponent';
import ValidationMessages from '../common/ValidationMessages';

interface CollectionItem<TValue> {
  value: TValue;
  fmlListId: number;
  validity: ValidityStatus;
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

function useListItemTransform<TValue>(props: ListProps<TValue>) {
  const {
    changeHandler: updateList,
    focusHandler: onFocus,
    value: list,
    validationMessages,
  } = useFmlControl<TValue[]>(props.config[1]);

  const { newId } = useListItemId();

  const [collection, updateCollection] = useState<CollectionItem<TValue>[]>(
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
        value: (props.config[1].itemConfig[1] as any).defaultValue as TValue,
        fmlListId: newId(),
        validity: 'unknown',
      },
    ]);
  }, [props.config[1].itemConfig[1], newId]);

  const remove = useCallback((fmlListId: number) => {
    updateCollection((coll) => {
      return coll.filter((i) => i.fmlListId !== fmlListId);
    });
  }, []);

  const update = useCallback(
    (fmlListId: number) => (change: ValueState<TValue>) => {
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

    const validities = new Set<ValidityStatus>(
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

interface ListItemProps<TValue> {
  fmlListId: number;
  elementIndex: number;
  update: (fmlListId: number) => ValueStateChangeHandler<TValue>;
  remove: (fmlListId: number) => void;
  itemConfig: any;
  onFocus: () => void;
  defaultValue: TValue;
}

function ListItemComponent<TValue>({
  fmlListId,
  update,
  remove,
  itemConfig: [, itemConfig],
  defaultValue,
  elementIndex,
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
   *
   * TODO: fix this for lists with items in layouts
   */

  const [actualConfig] = useState<ControlConfigurationBase<TValue>>({
    ...(itemConfig as any),
    defaultValue:
      typeof defaultValue === 'undefined'
        ? (itemConfig as any).defaultValue
        : defaultValue,
  });
  const changeHandler = useCallback(
    (change: ValueState<TValue>) => update(fmlListId)(change),
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
      <FmlContextProvider<TValue>
        onChange={changeHandler}
        localControlId={String(elementIndex)}
      >
        <FmlComponent config={actualConfig as any} />
      </FmlContextProvider>
      <button onClick={removeHandler}>-</button>
    </li>
  );
}

export interface ListProps<TValue> {
  config: ConfigurationFor<'fml:list', TValue>;
}

function List<TValue>(props: ListProps<TValue>) {
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
        {props.config[1].label}
      </label>
      <ValidationMessages validationMessages={validationMessages} />
      <ul>
        {collection.map(({ value, fmlListId }, elementIndex) => (
          <ListItemComponent<TValue>
            key={fmlListId}
            fmlListId={fmlListId}
            update={update}
            remove={remove}
            itemConfig={props.config[1].itemConfig}
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

registerComponent(LIST, List);

export default memo(List) as typeof List;
