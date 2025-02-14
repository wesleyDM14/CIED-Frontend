import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { login, logout, setChecked } from "./reducers/sessionSlice";
import { RootState, AppDispatch } from "./store";
import AppRoutes from "./routes";
import { GlobalStyle } from "./utils/GlobalStyles";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { checked } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { loginTime, accessToken, userRole } = JSON.parse(storedUser);
      const currentTime = Date.now();
      const timeout = 30 * 24 * 60 * 60 * 1000;

      if (currentTime - loginTime <= timeout) {
        dispatch(login({ accessToken, userRole }));
      } else {
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }

    dispatch(setChecked());
  }, [dispatch]);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        {checked && <AppRoutes />}
      </BrowserRouter>
    </>
  );
};

export default App;