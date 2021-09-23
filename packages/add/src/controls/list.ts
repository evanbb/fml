const LIST = 'fml:list';

declare module '@fml/core' {
  interface ListConfiguration<Value> extends ControlConfigurationBase<Value[]> {
    itemConfig: Configuration<Value>;
  }

  export interface ComponentRegistry<Value> {
    [LIST]: [
      Value extends ReadonlyArray<unknown> ? Value : never,
      Value extends ReadonlyArray<infer Item> ? ListConfiguration<Item> : never,
    ];
  }
}

export default LIST;
