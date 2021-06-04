import styles from "./style.module.css";
import { useCallback, useEffect, useState } from "preact/hooks";
import OneGraphAuth from "onegraph-auth";

const APP_ID = "b6a66044-13f0-4049-8d13-6d906de655d8";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [auth, setAuth] = useState(undefined);

  useEffect(() => {
    setAuth(
      new OneGraphAuth({
        appId: APP_ID,
      })
    );
  }, []);

  useEffect(() => {
    if (!auth) {
      return;
    }
    setToken(auth.accessToken().accessToken);
  }, [auth, loggedIn]);

  const doLogin = useCallback(async () => {
    await auth.login("github");
    const isLoggedIn = await auth.isLoggedIn("github");
    setLoggedIn(isLoggedIn);
  }, [auth]);

  useEffect(() => {
    if (!auth) {
      return;
    }
    auth.isLoggedIn("github").then(setLoggedIn);
  }, [auth]);

  return (
    <>
      <section class={styles.home}>
        <h1>Home</h1>
        <>
          {loggedIn ? (
            <p>Logged in</p>
          ) : (
            <button onClick={doLogin}>Login</button>
          )}
        </>
        <input value="ONEGRAPH_TOKEN" readonly />
        <input value={token} readonly />
      </section>
    </>
  );
}
