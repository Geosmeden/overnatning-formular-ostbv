import React, { useContext } from "react";
import { Grid, TextField, Typography, MenuItem } from "@material-ui/core";
import { FormularContext } from "../context/FormContext";

const kommuner = [
  {
    value: "Aarhus",
    nummer: 751,
  },
//   {
//     value: "Favrskov",
//     nummer: 710,
//   },
//   {
//     value: "Nordjurs",
//     nummer: 707,
//   },
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

export default function SelectInput({
  size,
  id,
  title,
  setKomkode,
  setAdresseTekst,
}) {
  const [state, setValue, setValues] = useContext(FormularContext);
  const handleSelect = (e) => {
    const [nr, val] = e.target.value.split("_");
    setValues({
      overnat_kommune: e.target.value,
      overnat_adresse: "",
      the_geom: "",
    });
    setKomkode(nr);
    setAdresseTekst("");
  };

  return (
    <Grid item xs={size}>
      <TextField
        id={id}
        select
        value={state.overnat_kommune}
        InputLabelProps={{ shrink: true }}
        label={
          <Typography variant='h6' component='h3'>
            {title}
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
