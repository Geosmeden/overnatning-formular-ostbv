import React, { useContext } from "react";
import { Grid, TextField, Typography, MenuItem } from "@material-ui/core";
import { FormularContext } from "../context/FormContext";

const kommuner = [
  {
    value: "Aarhus",
    nummer: 751,
  },
  // {
  //   value: "Favrskov",
  //   nummer: 710,
  // },
  // {
  //   value: "Noordjurs",
  //   nummer: 707,
  //  },
  {
    value: "Odder",
    nummer: 727,
  },
  {
    value: "Samsø",
    nummer: 741,
  },
  {
    value: "Skanderborg",
    nummer: 746,
  },
//   {
//     value: "Syddjurs",
//     nummer: 706,
//   },
//   {
//     value: "Randers",
//     nummer: 730,
//   },
];

export default function KommuneChooser() {
  const [state, setValue, setValues] = useContext(FormularContext);
  return (
    <Grid item xs={12}>
      <TextField
        id='overnat_kommune'
        select
        value={state.overnat_kommune}
        InputLabelProps={{ shrink: true }}
        label={
          <Typography variant='h6' component='h3'>
            Hvilken kommune
          </Typography>
        }
        onChange={handleSelect}
        fullWidth
      >
        {kommuner.map((option) => (
          <MenuItem
            key={option.nummer}
            value={`${option.nummer}_${option.value}`}
          >
            {option.value}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
}
