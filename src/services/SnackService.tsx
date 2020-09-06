import React, {
  createContext,
  FunctionComponent,
  useContext,
  useState,
} from "react";
import Snackbar from "@material-ui/core/Snackbar";

interface Service {
  createSnack(message: string): void;
}

interface SnackProps {
  id: number;
  message: string;
  open: boolean;
}

interface Props extends SnackProps {
  handleClose: () => void;
}

const Context = createContext<Service | null>(null);

const RenderSnack: FunctionComponent<Props> = ({
  id,
  message,
  open,
  handleClose,
}: Props) => {
  const messageId = `message-${id}`;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={<span id={messageId}>{message}</span>}
    />
  );
};

let uniqueId = 2;

export const SnackProvider: FunctionComponent = ({ children }) => {
  const [{ current, queue }, setState] = useState<{
    current: SnackProps | null;
    queue: SnackProps[];
  }>({ current: null, queue: [] });

  function createSnack(message: string) {
    const id = uniqueId++;
    const snack: SnackProps = { id, message, open: true };

    if (current) {
      setState({ current, queue: queue.concat(snack) });
    } else {
      setState({ queue, current: snack });
    }

    return id;
  }

  function handleClose() {
    setState((currentState) => ({
      ...currentState,
      current: currentState.current && { ...currentState.current, open: false },
    }));
    // time to snack close animation
    setTimeout(openNext, 1000);
  }

  function openNext() {
    if (queue.length) {
      setState({ current: queue[0], queue: queue.slice(1) });
    } else {
      setState({ current: null, queue: [] });
    }
  }

  return (
    <Context.Provider value={{ createSnack }}>
      {current && (
        <RenderSnack key={current.id} handleClose={handleClose} {...current} />
      )}
      {children}
    </Context.Provider>
  );
};

export const useSnack = (): Service => {
  const service = useContext(Context);
  if (!service) {
    throw Error("Please initialize `SnackProvider` before `useSnack`");
  }
  return service;
};
