import { withGraph, gql } from "../../helper";
export const handler = withGraph(async (event, { graph }) => {
  if (!graph) {
    return {
      statusCode: 400,
      body: "Did you set your token?",
    };
  }
  const { data } = await graph
    .query(
      gql`
        {
          gitHub {
            viewer {
              bio
              avatarUrl
              name
            }
          }
          me {
            serviceMetadata {
              loggedInServices {
                friendlyServiceName
                isLoggedIn
              }
            }
          }
        }
      `
    )
    .toPromise();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  };
});
