import { useAuth0 } from "@auth0/auth0-react";
import { Typography, Button } from "@material-ui/core";
import { useRecoilState } from "recoil";
import { selectedUserState } from "../../../recoil";

const MessageHeader = () => {
  const [selectedUser] = useRecoilState(selectedUserState);
  const { logout } = useAuth0();

  return (
    <Typography variant="h6" noWrap style={{ width: "100%" }}>
      {selectedUser?.name}
      <Button
        color="secondary"
        variant="contained"
        style={{ float: "right" }}
        onClick={() =>
          logout({
            returnTo: process.env.REACT_APP_BASE_URL,
          })
        }
      >Logout</Button>
    </Typography>
  );
};

export default MessageHeader;
