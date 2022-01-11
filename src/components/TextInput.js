import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { FormularContext } from "../context/FormContext";

export default function TextInput(props) {
  const { size, id, title, type, evtHandler } = props;
  const [state, setValue, setValues] = useContext(FormularContext);
  const handleChange = (e, id) => {
    setValue(id, e.target.value);
  };

  return (
    <Grid item xs={size}>
      <TextField
        id={id}
        type={type || "text"}
        value={state[id]}
        InputLabelProps={{ shrink: true }}
        label={
          <Typography variant='h6' component='h3'>
            {title}
          </Typography>
        }
        onChange={(e) => handleChange(e, id)}
        fullWidth
      />
    </Grid>
  );
}
