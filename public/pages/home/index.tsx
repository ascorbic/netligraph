import styles from "./style.module.css";
import { useCallback, useEffect, useState } from "preact/hooks";
import OneGraphAuth from "onegraph-auth";

const APP_ID = "b6a66044-13f0-4049-8d13-6d906de655d8";

export default function Home() {
  const [token, setToken] = useState("");
  const [auth, setAuth] = useState(undefined);
  const [servicesStatus, setServicesStatus] = useState({});

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
  }, [auth]);

  const refreshServices = useCallback(async () => {
    if (!auth) {
      return;
    }
    const status = await auth.servicesStatus();
    console.log(status);
    setServicesStatus(status);
    setToken(auth.accessToken().accessToken);
  }, [auth]);

  const doLogin = useCallback(
    async (service) => {
      await auth.login(service);
      refreshServices();
    },
    [auth, refreshServices]
  );

  const doLogout = useCallback(
    async (service) => {
      await auth.logout(service);
      refreshServices();
    },
    [auth, refreshServices]
  );

  useEffect(() => {
    refreshServices();
  }, [refreshServices]);

  const dataURI = token
    ? `data:text/plain;charset=utf-8,${encodeURIComponent(
        `ONEGRAPH_TOKEN=${token}`
      )}`
    : null;

  return (
    <>
      <section class={styles.home}>
        <table>
          {auth?.supportedServices.map((service) => {
            if (service === "zeit") {
              return;
            }
            const loggedIn = servicesStatus?.[service]?.isLoggedIn;
            return (
              <tr key={service}>
                <td>
                  {loggedIn ? "✅ " : "❌ "}
                  {auth.friendlyServiceName(service)}
                </td>
                <td>
                  <button
                    style={{ marginLeft: 20 }}
                    onClick={() =>
                      loggedIn ? doLogout(service) : doLogin(service)
                    }
                  >
                    {loggedIn ? "Logout" : "Login"}
                  </button>
                </td>
              </tr>
            );
          })}
        </table>

        {token && (
          <>
            <input value="ONEGRAPH_TOKEN" readonly />
            <input value={token} readonly />

            <p>
              Copy or download the token <em>after</em> logging-in to all
              required services, as the token changes.{" "}
              <a href={dataURI} download="netlify.env">
                Download .env
              </a>
            </p>
          </>
        )}
      </section>
    </>
  );
}
