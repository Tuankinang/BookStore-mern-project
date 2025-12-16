import { createRoot } from "react-dom/client";
import router from "./routers/router";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import "sweetalert2/dist/sweetalert2.js";
import { AuthProvide } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvide>
      <RouterProvider router={router} />
    </AuthProvide>
  </Provider>
);
