import { gql, useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles, TextField, Button, Grid, Link } from "@material-ui/core";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { selectedUserState } from "../../../recoil";

const INSERT_MESSAGE = gql`
  mutation MyMutation(
    $toUserId: String = ""
    $message: String = ""
    $fromUserId: String = ""
  ) {
    insert_messages_one(
      object: {
        fromUserId: $fromUserId
        toUserId: $toUserId
        message: $message
      }
    ) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  messageForm: {
    overflow: "hidden",
    margin: "20px",
    padding: "0",
  },
  submit: {
    marginLeft: "8px",
    marginTop: "8px"
  },
}));

const MessageForm = () => {
  const classes = useStyles();
  const { user } = useAuth0();
  const [message, setMessage] = useState("");
  const [selectedUser] = useRecoilState(selectedUserState);

  const [insertMessage] = useMutation(INSERT_MESSAGE, {
    variables: {
      fromUserId: user?.sub,
      message: message,
      toUserId: selectedUser?.id,
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    insertMessage();
    setMessage("");
  };

  return (
    <form
      className={classes.messageForm}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={10}>
            <TextField
              id="input-message"
              variant="outlined"
              placeholder="Kirim Pesan"
              fullWidth={true}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ background: "#fff" }}
            />
        </Grid>
        <Grid item xs={2}>
              <Button  
                className={classes.submit}
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}>Kirim</Button>
        </Grid>
      </Grid>


    </form>
  );
};

export default MessageForm;
