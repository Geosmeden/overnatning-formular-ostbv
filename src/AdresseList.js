import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export default function AdresseList({
  searchTerm,
  setTekst,
  handleChoice,
  komkode,
}) {
  const [adresses, setAdresses] = useState([]);
  const [doSearch, setDoSearch] = useState(true);
  const handleClick = (item) => {
    // console.log(tekst);
    //setTekst(tekst);
    handleChoice(item);
    setDoSearch(false);
  };

  useEffect(() => {
    if (searchTerm.length < 3) return;
    const url = `https://dawa.aws.dk/adgangsadresser/autocomplete?q=${searchTerm}&type=adgangsadresse&side=1&per_side=105&noformat=1&kommunekode=${komkode}&srid=25832`;
    console.log(url);
    fetch(url).then((res) => {
      res.json().then((data) => {
        setAdresses(data);
      });
    });
  }, [searchTerm]);

  let comps = adresses.map((item, index) => (
    <ListItem
      key={`${index}-${item.tekst}`}
      value={item.tekst}
      button
      onClick={(e) => handleClick(item)}
    >
      <ListItemText primary={item.tekst} />
    </ListItem>
  ));

  return (
    <List component='nav' style={{ maxHeight: 400, overflow: "auto" }}>
      {comps}
    </List>
  );
}
