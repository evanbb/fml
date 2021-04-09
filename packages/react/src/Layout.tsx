import { FmlLayoutConfiguration } from '@fml/core';
import { getLayoutImplementation } from '@fml/core/layouts';

interface LayoutProps<TValue> {
  config: FmlLayoutConfiguration<TValue>;
}

export default function Layout<TValue>(props: LayoutProps<TValue>) {
  const Component = getLayoutImplementation(
    props.config[0],
  ) as React.ComponentType<LayoutProps<TValue>>;
  return <Component {...props} />;
}
