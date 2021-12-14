import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, CircularProgress } from "@material-ui/core";
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ChatRoom from "./pages/Main/ChatRoom.js";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { useState } from "react";
import { RecoilRoot } from "recoil";

function App() {
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  
  const classes = useStyles();
  const {
    loginWithRedirect,
    getIdTokenClaims,
    isAuthenticated,
    isLoading,
  } = useAuth0();
  const [token, setToken] = useState("");

  if (isLoading) {
    return <CircularProgress className={classes.centered}></CircularProgress>;
  }
  
  getIdTokenClaims().then((result) => {
    console.log(result);
    if (result) {
      setToken(result.__raw);
    }
  });

  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WEBSOCKET,
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    },
  });
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local cookie if it exists
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, splitLink]),
  });

  return (
    <ApolloProvider client={client}>
      {isAuthenticated ? (
        <RecoilRoot>
          <ChatRoom></ChatRoom>
        </RecoilRoot>
      ) : (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
        <Card className={classes.root}>
          <CardContent>
            <Typography component="h1" variant="h3" align="center">
              Hi, Welcome!
            </Typography>
            <Typography component="h1" variant="h5" align="center">
              We are so excited if you interested to join our chat group
            </Typography>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                  loginWithRedirect();
                }}
              >
                Join
              </Button>
          </CardContent>
        </Card>
        </div>
      </Container>
      )}
    </ApolloProvider>
  );
}

export default App;
