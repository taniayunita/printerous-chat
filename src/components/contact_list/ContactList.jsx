import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  img: {
    height: "40px",
    width: "40px",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
  },
}));

const ContactList = (props) => {
  const classes = useStyles(props);
  const { user } = props;

  return (
    <div>
      <ListItem button key={user.id} className={classes.root}>
        <img alt="" src={user.picture} className={classes.img}></img>
        <ListItemText primary={user.name} />
      </ListItem>
    </div>
    
  );
};

export default ContactList;
