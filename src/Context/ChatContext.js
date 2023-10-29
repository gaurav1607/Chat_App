import { createContext, useReducer, useEffect, useContext } from "react";

export const ChatContext = createContext();

const initialState = {
  selectedChat: null,
  chatUsers: null,
  chat: null,
  users: null,
  loading: false,
  error: null,
  drawer: false,
  groupDialog: false,
  notifications: null,
};

export const chatReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_CHAT_USER":
      return {
        ...state,
        selectedChat: action.payload,
      };
    case "FETCH_CHATS_USERS":
      return {
        ...state,
        chatUsers: action.payload,
      };
    case "FETCH_USERS_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_USERS_SUCCESS":
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case "FETCH_USERS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "DRAWER":
      return {
        ...state,
        drawer: action.payload,
      };
    case "GROUP_DIALOG":
      return {
        ...state,
        groupDialog: action.payload,
      };
    case "SELECT_CHAT":
      return {
        ...state,
        selectedChat: action.payload,
      };
    case "FETCH_CHAT":
      return {
        ...state,
        chat: action.payload,
      };
    case "SET_NOTIFICATION":
      return {
        ...state,
        notifications: action.payload,
      };
    
    default:
      return state;
  }
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw Error("useChatContext must be used inside an ChatContextProvider");
  }
  return context;
};

export const ChatContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);


  

  console.log("ChatContext state:", state);
  return (
    <ChatContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
