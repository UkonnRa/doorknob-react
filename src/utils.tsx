import React from "react";

export const composeProviders = (
  wrappers: React.FunctionComponent[]
): React.FunctionComponent => {
  return wrappers.reduce(
    (Acc, Current): React.FunctionComponent => {
      // eslint-disable-next-line react/display-name
      return (props) => (
        <Current>
          <Acc {...props} />
        </Current>
      );
    }
  );
};
