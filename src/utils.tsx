import React, {
  FunctionComponent,
  JSXElementConstructor,
  PropsWithChildren,
} from "react";

interface Props {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: Array<JSXElementConstructor<PropsWithChildren<any>>>;
  children: React.ReactNode;
}

export const Compose: FunctionComponent<Props> = (props: Props) => {
  const { components = [], children, ...rest } = props;

  return (
    <>
      {components.reduceRight((acc, Comp) => {
        return <Comp {...rest}>{acc}</Comp>;
      }, children)}
    </>
  );
};
