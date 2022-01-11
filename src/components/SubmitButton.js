import React from "react";
import { Grid, Button } from "@material-ui/core";

export default function SubmitButton({ onClick }) {
  return (
    <>
      <Grid item xs={4}></Grid>
      <Grid item xs={4}>
        <Button variant='contained' color='primary' onClick={onClick}>
          Send
        </Button>
      </Grid>
      <Grid item xs={4}></Grid>
    </>
  );
}
