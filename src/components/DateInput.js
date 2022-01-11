import React, { useContext } from "react";
import { KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import { FormularContext } from "../context/FormContext";

function DateInput({ size, id, title, label }) {
  const [state, setValue, setValues] = useContext(FormularContext);
  const handleDateChange = (date) => {
    if (date < new Date()) return;

    switch (id) {
      case "overnat_start_dato":
        let startDate = new Date(date);
        let slutDato = new Date(state.overnat_slut_dato);
        let endDate = slutDato < startDate ? startDate : slutDato;
        setValues({
          overnat_start_dato: startDate,
          overnat_slut_dato: endDate,
          overnat_start_tid: startDate,
          overnat_slut_tid: endDate,
        });
        break;
      case "overnat_slut_dato":
        if (new Date(date) < new Date(state.overnat_start_dato)) return;
        setValue("overnat_slut_dato", new Date(date));
        setValue("overnat_slut_tid", new Date(date));
        break;
      default:
        return;
    }
  };
  return (
    <Grid item xs={size}>
      <KeyboardDatePicker
        format='yyyy-MM-dd'
        margin='normal'
        id={id}
        label={
          <Typography variant='h6' component='h3'>
            {title}
          </Typography>
        }
        value={state[id]}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": { label },
        }}
        cancelLabel='Annulere'
      />
    </Grid>
  );
}

function TimeInput({ size, id, title, label }) {
  const [state, setValue, setValues] = useContext(FormularContext);
  const handleTimeChange = (time) => {
    setValue(id, new Date(time));
  };

  return (
    <Grid item xs={size}>
      <KeyboardTimePicker
        margin='normal'
        id={id}
        label={
          <Typography variant='h6' component='h3'>
            {title}
          </Typography>
        }
        ampm={false}
        value={state[id]}
        onChange={handleTimeChange}
        KeyboardButtonProps={{
          "aria-label": "ændre tidspunkt",
        }}
      />
    </Grid>
  );
}

export default function DateTimeInputs() {
  return (
    <>
      <DateInput id='overnat_start_dato' title='Start dato' size={6} />
      <TimeInput id='overnat_start_tid' title='Start tidspunkt' size={6} />
      <DateInput id='overnat_slut_dato' title='Slut dato' size={6} />
      <TimeInput id='overnat_slut_tid' title='Slut tidspunkt' size={6} />
    </>
  );
}
