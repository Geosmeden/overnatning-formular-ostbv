import React, { useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import AdresseList from "./AdresseList";
import { IconButton } from "@material-ui/core";
import { Clear, Delete } from "@material-ui/icons";

export default function DawaSearcher({
  size,
  setAdressData,
  komkode,
  adresseTekst,
  setAdresseTekst,
}) {
  const [data, setData] = useState([]);
  const [showAutocompleteList, setShowAutocompleteList] = useState(true);
  const [tekst, setTekst] = useState("");
  const [_item, setItem] = useState({
    tekst: "",
    adgangsadresse: { x: "", y: "" },
  });

  const [searchTerm, setSearchTerm] = useState("");
  /*
     Called when inputing in the search box / adresse field

     - setShowList : 
    */
  const handleChange = (e) => {
    setShowAutocompleteList(true);
    setAdresseTekst(e.target.value);
  };

  const handleChoice = (item) => {
    setShowAutocompleteList(false);
    setItem(item);
    setAdresseTekst(item.tekst);
    setAdressData(item); // pass text and location to the parent component
  };

  return (
    <Grid item xs={size}>
      <TextField
        id='standard-basic'
        InputLabelProps={{ shrink: true }}
        label={
          <Typography variant='h6' component='h3'>
            Overnatningstedets adresse
          </Typography>
        }
        fullWidth
        value={adresseTekst}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                onClick={(e) => {
                  setAdresseTekst("");
                  setAdressData("");
                  setShowAutocompleteList(false);
                }}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {showAutocompleteList && (
        <AdresseList
          searchTerm={adresseTekst}
          setTekst={setAdresseTekst}
          handleChoice={handleChoice}
          komkode={komkode}
        />
      )}
    </Grid>
  );
}
