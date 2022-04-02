import React, { useState } from "react";

let data = {
  ansoeger_mail: "",
  ansoeger_navn: "",
  ansoeger_tlf: "",
  ansoegn_indsendt: "",
  ansvarl_kontaktmail: "",
  ansvarl_kontaktpers: "",
  ansvarl_kontaktlf: "",
  overnat_adresse: "",
  overnat_postnr: "",
  overnat_by: "",
  overnat_antal: "",
  overnat_kommune: "",
  overnat_lokaler: "",
  overnat_navn: "",
  overnat_over_150: false,
  overnat_slut_dato: new Date(),
  overnat_slut_tid: new Date(),
  overnat_start_dato: new Date(),
  overnat_start_tid: new Date(),
  overnat_tegning: "",
  overnat_tegning_filnavn: "",
  the_geom: "",
  x_coord: "",
  y_coord: "",
  overnat_kontaktpers: "",
  overnat_kontakttlf: "",
  bemaerkning: "",
};

const FormularContext = React.createContext([{}, () => {}, () => {}, () => {}]);

const FormularProvider = (props) => {
  const [state, setState] = useState(data);
  const [imageSrc, setImageSrc] = useState("");
  const setValue = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const resetForm = () => setState(data);

  const setValues = (keyValues) => {
    Object.keys(keyValues).forEach((k) => {
      setValue(k, keyValues[k]);
    });
  };

  return (
    <FormularContext.Provider value={[state, setValue, setValues, resetForm]}>
      {props.children}
    </FormularContext.Provider>
  );
};

export { FormularContext, FormularProvider };
