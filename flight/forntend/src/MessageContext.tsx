import { createContext, useReducer, useRef } from "react";

type Action = { type: "set"; payload: string } | { type: "reset" };

const messageReducer = (state: string, action: Action): string => {
  switch (action.type) {
    case "set":
      return action.payload;
    case "reset":
      return "";
    default:
      return state;
  }
};

type MessageContextType = {
  message: string;
  setMessage: (payload: string, seconds: number) => void;
};

const MessageContext = createContext<MessageContextType>({
  message: "",
  setMessage: () => {},
});

export const MessageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, dispatch] = useReducer(messageReducer, "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setMessage = (payload: string, seconds: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dispatch({ type: "set", payload });
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: "reset" });
    }, seconds * 1000);
  };

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
