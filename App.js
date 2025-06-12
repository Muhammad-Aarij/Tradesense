import React, { useEffect } from "react";
import store from "./src/redux/store/store";
import { Provider } from "react-redux";
import AppNavContainer from "./src/navigation";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from "@env";
import { ThemeProvider } from "./src/context/ThemeProvider";

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      scopes: ["profile", "email"],
    });
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavContainer />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
