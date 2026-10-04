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

const BASE = "https://api.danskadresseapi.dk/dawa";
const API_KEY = "sk_live_E5cOCBtotK0JJK5DqqEfj4gzcW7BlqYI7FF1W1fYEwY";

useEffect(() => {
  if (searchTerm.length < 3) return;

  const controller = new AbortController();

  const timer = setTimeout(() => {
    const url =
      `${BASE}/autocomplete` +
      `?q=${encodeURIComponent(searchTerm)}` +
      `&kommunekode=${komkode}&srid=25832`;

    fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Adresse-API fejlede: ${res.status}`);
        return res.json();
      })
      .then((data) => setAdresses(data))
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
  }, 300);

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [searchTerm, komkode]);



  // useEffect(() => {
    // if (searchTerm.length < 3) return;
    // const url = `https://api.danskadresseapi.dk/dawa/autocomplete?q={searchTerm}&kommunekode=${komkode}&api_key=xxxx`;
    // console.log(url);
    // fetch(url).then((res) => {
    //   res.json().then((data) => {
    //     setAdresses(data);
    //   });
    // });
  // }, [searchTerm]);

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
