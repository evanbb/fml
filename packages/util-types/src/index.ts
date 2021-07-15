export type StringUnionOnlyNotString<TValue> =
  /**
   * If a) it's a tuple of [TSomethingThatExtendsString]
   * and b) the tuple is of exactly [string]
   * then we don't want it.
   * Otherwise, it must be a tuple of ['something' | 'interesting'], in which
   * case we want the single element of the tuple (the union)
   */

  TValue extends [string]
    ? string extends TValue[0]
      ? never
      : TValue[0]
    : /**
     * Otherwise, if a) it's a TSomethingThatExtendsString
     * and b) it's exactly string
     * then we don't want it.
     * Otherwise, it must be 'something' | 'insteresting', in which case
     * we want the union
     */
    TValue extends string
    ? string extends TValue
      ? never
      : TValue
    : never;

export type StringOnlyNotStringUnion<TValue> =
  /**
   * If a) it's a TSomethingThatExtendsString
   * and b) it's exactly string
   * then it's what we want.
   * Otherwise, it must be 'something' | 'insteresting', in which case
   * we aren't interested
   */
  TValue extends string ? (string extends TValue ? string : never) : string;

export type KnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

export type IsPartial<T> = Partial<T> extends T ? true : false;
