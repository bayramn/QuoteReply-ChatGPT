/*global chrome*/
import React, { useState, createContext, useEffect } from "react";
export const Context = createContext();

export const Provider = (props) => {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    loading: true,
  });

  return <Context.Provider value={{}}>{props.children}</Context.Provider>;
};
