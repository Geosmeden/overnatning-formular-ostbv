import React from "react";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SuccessAlert(props) {
  const classes = useStyles();
  const { closeAlert } = props;

  return (
    <div className={classes.root}>
      <Alert severity='success' onClose={() => closeAlert(false)}>
        Formular er sendt
      </Alert>
    </div>
  );
}
