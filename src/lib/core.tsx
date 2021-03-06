import * as React from "react";
import { observer, Provider } from "mobx-react";
import { Root } from "../stores/root.store";

/**
 * Higher order component that manages general application props.
 */
@observer
class SquidProvider extends React.Component<{ className: string }> {
  render() {
    const { className } = this.props;

    return (
      <Provider store={Root}>
        <div className={className}>
          {(this.props.children! as any[]).map((c: any, idx: number) => {
            return React.cloneElement(c, {
              key: idx
            });
          })}
        </div>
      </Provider>
    );
  }
}

/**
 * Default export provider
 */
export { SquidProvider };

/**
 * Plugin actions namespace
 */
export const plugin = {
  use: Root.use,
  register: Root.register
};
