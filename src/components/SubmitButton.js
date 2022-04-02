import React from "react";
import { Grid, Button } from "@material-ui/core";

export default function SubmitButton({ onClick }) {
  return (
    <>
      <Grid item xs={2}></Grid>
      <Grid item xs={8}>
        <Button variant='contained' color='primary' onClick={onClick}>
          Godkend og indsend anmeldelse om midlertidig overnatning
        </Button>
      </Grid>
      <Grid item xs={2}></Grid>
    </>
  );
}
