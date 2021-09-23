const DATETIME = 'fml:datetime';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [DATETIME]: [Date | undefined, ControlConfigurationBase<Date | undefined>];
  }
}

export default DATETIME;
