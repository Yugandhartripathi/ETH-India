import React from "react";
import { Loading } from "@web3uikit/core";

export const Loader = () => {
  return (
    <div
      style={{
        // backgroundColor: "#ECECFE",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        // minHeight: "90vh",
        minWidth: "90vw",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Loading size={60} spinnerColor="#2E7DAF" />
    </div>
  );
};
