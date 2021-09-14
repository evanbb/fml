import { getLayoutImplementation, FmlLayoutConfiguration } from '@fml/core';

interface LayoutProps<TValue> {
  config: FmlLayoutConfiguration<TValue>;
}

export default function Layout<TValue>(props: LayoutProps<TValue>) {
  const Component = getLayoutImplementation(
    props.config[0],
  ) as React.ComponentType<LayoutProps<TValue>>;
  return <Component {...props} />;
}
