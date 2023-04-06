/**
=========================================================
* Soft UD - Demo - v4.0.0
=========================================================

* Product Page: https://www.gwarant-service.pl/product/soft-ui-dashboard-react
* Copyright 2022 Gwarant-Service (https://www.gwarant-service.pl)

Coded by Ambro-Dev

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Soft UD - Demo Context Provider
import { SoftUIControllerProvider } from "context";
import { AuthProvider } from "context/AuthProvider";
import { SocketProvider } from "context/socket";

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <SocketProvider>
        <SoftUIControllerProvider>
          <App />
        </SoftUIControllerProvider>
      </SocketProvider>
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById("root")
);
