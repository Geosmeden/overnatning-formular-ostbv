import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { Checkbox, Typography } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import daLocale from "date-fns/locale/da";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import * as yup from "yup";
import DawaSearcher from "./DawaSearcher";
import ErrorComp from "./ErrorComp";
import SuccessAlert from "./SuccessAlert";
import TextInput from "./components/TextInput";
import { FormularContext } from "./context/FormContext";
import ImageUpload from "./components/ImageUpload";
import DateTimeInputs from "./components/DateInput";
import SelectInput from "./components/SelectInput";
import SubmitButton from "./components/SubmitButton";
import { postData, postFormData } from "./service";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: 25,
  },
}));

const buildQuery = (data) => {
  const keys = Object.keys(data);
  const columns = keys.join(",");
  const values = keys
    .map((key) => {
      if (
        key === "overnat_start_dato" ||
        key === "overnat_slut_dato" ||
        key === "overnat_start_tid" ||
        key === "ansoegn_indsendt" ||
        key === "overnat_slut_tid"
      ) {
        return `'${formatedTimestamp(data[key])}'`;
      }
      if (key === "the_geom") return `${data[key]}`;

      return `'${data[key]}'`;
    })
    .join(",");
  return `INSERT INTO faelles.midlertidig_overnatning(${columns}) VALUES(${values})`;
};

const formatedTimestamp = (d) => {
  const date = new Date(d).toISOString().split("T")[0];
  const time = new Date(d).toTimeString().split(" ")[0];
  return `${date} ${time}`;
};

function Formular() {
  const [state, setValue, setValues, resetForm] = useContext(FormularContext);
  const fileRef = React.useRef(null);
  const classes = useStyles();
  const [data, setData] = useState({	
    bemaerkning: "",
    ansoeger_mail: "",
    ansoeger_navn: "",
    ansoeger_tlf: "",
    ansoegn_indsendt: "",
    ansvarl_kontaktmail: "",
    ansvarl_kontaktpers: "",
    ansvarl_kontaktlf: "",
    overnat_adresse: "",
    overnat_antal: "",
    overnat_kommune: "",
    overnat_lokaler: "",
    overnat_navn: "",
    overnat_over_150: false,
    overnat_slut_dato: new Date().toISOString(),
    overnat_slut_tid: new Date().toISOString(),
    overnat_start_dato: new Date().toISOString(),
    overnat_start_tid: new Date().toISOString(),
    overnat_tegning: "",
    overnat_tegning_filnavn: "",
    the_geom: "",
    gid: "",
    file: "",
  });

  let schema = yup.object().shape({
    overnat_kommune: yup.string().required("Vælg kommune, for at kunne vælge adresse"),
    overnat_adresse: yup.string().required("Overnatningstedets adresse er et krævet felt"),
    overnat_navn: yup.string().required("Overnatningstedets navn er et krævet felt"),
    overnat_lokaler: yup.string().required("Lokaler er et krævet felt"),
	overnat_over_150: yup.string().required(),
    overnat_antal: yup
	  .number("Antal overnattende skal udfyldes med et tal")
	  .typeError("Antal overnattende skal udfyldes med et tal")
	  .positive("Antal overnattende skal udfyldes med et positivt tal.")
	  .integer("Antal overnattende skal udfyldes med et tal"),
    ansoeger_navn: yup
      .string()
      .required("Anmelder navn er et krævet felt"),
    ansoeger_tlf: yup
      .string()
      .matches(/^[0-9]{8}$/, "Anmelder tlf. skal have 8 tal"),
	ansoeger_mail: yup
      .string()
	  .email("Anmelder mail skal være en valid email adresse")
      .required("Anmelder mail er et krævet felt"),
	ansvarl_kontaktpers: yup
      .string()
      .required("Navn på kontaktperson under overnatningen er et krævet felt"),
    ansvarl_kontaktlf: yup
      .string()
      .matches(/^[0-9]{8}$/, "Tlf. til kontaktperson skal have 8 tal"),
    ansvarl_kontaktmail: yup
      .string()
      .email("Mail til kontaktperson skal være en valid email adresse")
      .required("Mail til kontaktperson mail er et krævet felt"),    
    // overnat_tegning : yup.string().required(),
    // overnat_tegning_filnavn : yup.string().required(),
    overnat_slut_dato: yup.string().required(),
    overnat_slut_tid: yup.string().required(),
    overnat_start_dato: yup.string().required(),
    overnat_start_tid: yup.string().required(),
  });

  const [komkode, setKomkode] = useState("751|741|727|746");
  const [imageSrc, setImageSrc] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);

  // const handleInputChange = (e) => {};

  // const { register, handleSubmit, watch, errors } = useForm();
  // const onSubmit = (data) => console.log(data);
  // const [selectedDate, setSelectedDate] = React.useState(new Date());

  // const deleteImage = () => {
  //   setData({
  //     ...data,
  //     overnat_tegning_filnavn: "",
  //   });

  //   setImageSrc("");
  // };

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  // const handleStartDate = (date) => {
  //   let startDate = new Date(date);
  //   let slutDato = new Date(data.overnat_slut_dato);
  //   let endDate = slutDato < startDate ? startDate : slutDato;
  //   console.log("startDate :", startDate, " , endDate : ", endDate);
  //   setData({
  //     ...data,
  //     overnat_start_dato: startDate.toISOString(),
  //     overnat_slut_dato: endDate.toISOString(),
  //   });
  // };

  // const handleStartTime = (date) => {
  //   setData({
  //     ...data,
  //     overnat_start_tid: new Date(date).toISOString(),
  //   });
  // };

  // const handleEndDate = (date) => {
  //   let endDate = new Date(date);
  //   let startDate = new Date(data.overnat_start_dato);
  //   setData({
  //     ...data,
  //     overnat_slut_dato: new Date(date).toISOString(),
  //   });
  // };

  // const handleEndTime = (date) => {
  //   setData({
  //     ...data,
  //     overnat_slut_tid: new Date(date).toISOString(),
  //   });
  // };

  // const handleSelect = (e) => {
  //   const [nr, val] = e.target.value.split("_");
  //   console.log("kommune selected: ", e.target.value);
  //   setData({
  //     ...data,
  //     overnat_kommune: e.target.value,
  //     overnat_adresse: "",
  //     the_geom: "",
  //   });
  //   setKomkode(nr);
  //   setAdresseTekst("");
  // };

  const setAdressData = (adress) => {
    //console.log(`[${adress.adgangsadresse.x},${adress.adgangsadresse.x}]`);
    // if (adress === "") {
    //   setData({
    //     ...data,
    //     overnat_adresse: "",
    //     the_geom: "",
    //   });
    // } else {
    //   setData({
    //     ...data,
    //     overnat_adresse: adress.tekst,
    //     the_geom: `[${adress.adgangsadresse.x},${adress.adgangsadresse.y}]`, // TODO: post geometry
    //   });
    // }
    //ST_setsrid(ST_MakePoint(lat,long),4326) as geom
    //the_geom: `[${adress.adgangsadresse.x},${adress.adgangsadresse.y}]`,

    if (adress === "") {
      setValues({
        overnat_adresse: "",
        overnat_postnr: "",
        overnat_by: "",
        the_geom: "",
        x_coord: "",
        y_coord: "",
      });
    } else {
      let streetname = adress.tekst.split(",");
      let adressname = streetname.length > 0 ? streetname[0] : adress.tekst;
      setValues({
        overnat_adresse: adressname,
        overnat_postnr: adress.adgangsadresse.postnr,
        overnat_by: adress.adgangsadresse.postnrnavn,
        the_geom: `ST_setsrid(ST_MakePoint(${adress.adgangsadresse.x},${adress.adgangsadresse.y}),25832)`,
        x_coord: adress.adgangsadresse.x,
        y_coord: adress.adgangsadresse.y,
      });
    }
  };

  // const handleFormData = (e) => {
  //   console.log(e.target.id, ":", e.target.value);
  //   setData({
  //     ...data,
  //     [e.target.id]: e.target.value,
  //   });
  // };

  const handleCheckBox = (e) => {
    console.log("handleCheckbox => ", e.target.value);
    setValue("overnat_over_150", e.target.checked);
  };

  const [adresseTekst, setAdresseTekst] = useState("");

  const submitHandler = (e) => {
    /*
     * 1. collect all the data to send, including base64 string
       2. create geom ST_setsrid(ST_MakePoint(lat,long),4326) as geom
       3. build sql, axios.post
       4. Success or Error => show feedback 
     */
    // console.log(data);
    const formData = {
      ...state,
      ansoegn_indsendt: new Date(),
    };
    console.log("ansøgning", formData);
    schema
      .validate(formData, { abortEarly: false })
      .then(function (valid) {
        //alert("schame validity =>" + valid);
        const q = buildQuery(formData);
        //postData(q)
        postFormData(formData)
          .then((res) => {
            setSuccessMessage(true);
            setFormErrors([]);
            setAdresseTekst("");
            setKomkode("751|741|727|746");
            resetForm();
            window.scrollTo({ top: 0, behavior: "smooth" });
          })
          .catch((err) => {
            setFormErrors(["Der var fejl ved indsending..."]);
            setSuccessMessage(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
      })
      .catch(function (err) {
        console.log(err.errors);
        setFormErrors(err.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={daLocale}>
      <Container maxWidth='sm'>
        <Typography variant='h6' gutterBottom>
          Anmeldelse af midlertidig overnatning
        </Typography>
        {formErrors.length > 0 && (
          <ErrorComp errors={formErrors} closeAlert={setFormErrors} />
        )}

        {successMessage && <SuccessAlert closeAlert={setSuccessMessage} />}

        <Grid container spacing={3}>
          <SelectInput
            size={12}
            id='overnat_kommune'
            title='Hvilken kommune'
            setKomkode={setKomkode}
            setAdresseTekst={setAdresseTekst}
          />
          <DawaSearcher
            size={12}
            setAdressData={setAdressData}
            komkode={komkode}
            adresseTekst={adresseTekst}
            setAdresseTekst={setAdresseTekst}
          />
          <TextInput
            size={12}
            id='overnat_navn'
            title='Overnatningstedets navn'
          />
          <TextInput size={12} id='overnat_lokaler' title='Lokaler (navn på de lokaler overnatningen foregår i)' />
          <Grid item xs={8}>
            <Typography
              style={{ color: "rgba(0, 0, 0, 0.74)" }}
              variant='subtitle1'
              component='h3'
            >
              Overnatning for flere end 50 i samme rum{" "}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Checkbox
              color='primary'
              checked={state.overnat_over_150}
              onChange={handleCheckBox}
            />
          </Grid>
          {state.overnat_over_150 && 
		  <Grid item xs={12}>
		  <Typography style={{ color: "rgba(0, 0, 0, 0.74)", fontSize: "0.9em" }}>
		  Overnatninger i rum til mere end 50 personer skal ske efter en belægningsplan, så det sikres, at de fornødne flugtvejspassager til udgangsdøre ikke spærres af sovepladser, inventar, bagage m.m. Belægningsplanen skal ophænges i overnatningslokalet. Belægningsplaner til rum for midlertidig overnatning kan udføres som beskrevet i bilag 11d og 13 til vejledningen.
		  <p><a href="https://bygningsreglementet.dk/-/media/Br/Kap_5_Brand/Vejledninger/Generel-vejledning/Bilag-11-abcde/211219-Bilag-11d-Vejledning-for-bel%C3%A6gningsplaner-ved-midlertidige-overnatning.pdf">Bilag 11d - Vejledning for belægningsplaner ved midlertidig overnatning</a></p>
		  <p><a href="https://bygningsreglementet.dk/-/media/Br/Kap_5_Brand/Vejledninger/Bilag-13-Udfaerdigelse-af-planer-i-forhold-til-brand/Bilag-13-Udfrdigelse-af-planer-i-forhold-til-brand-ver-11.pdf">Bilag 13: Udfærdigelse af planer i forhold til brand</a></p>
		  </Typography>
		  </Grid>
		  }
		  
		  <ImageUpload setImageSrc={setImageSrc} />
		  
          <TextInput
            size={12}
            id='overnat_antal'
            type='number'
            title='Antal overnattende'
          />
          <DateTimeInputs />
          <TextInput size={12} id='ansoeger_navn' title='Anmelder navn' />
          <TextInput
            type='number'
            size={6}
            id='ansoeger_tlf'
            title='Anmelder tlf.'
          />
          <TextInput size={6} id='ansoeger_mail' title='Anmelder mail' />
          <Grid item xs={12}></Grid>
          <TextInput
            size={12}
            id='ansvarl_kontaktpers'
            title='Navn på kontaktperson under overnatningen'
          />
          <TextInput
            type='number'
            size={6}
            id='ansvarl_kontaktlf'
            title='Tlf. til kontaktperson'
          />
          <TextInput
            size={6}
            id='ansvarl_kontaktmail'
            title='Mail til kontaktperson'
          />
		  <TextInput
            size={12}
            id='bemaerkning'
            title='Bemærkninger'
          />
		  <Grid item xs={12}>
		  <Typography style={{ color: "rgba(0, 0, 0, 0.74)", fontSize: "0.9em" }}>
          Den ansvarlige for overnatningen forpligter sig til at overholde kravene i Bygningsreglementet § 152 a samt tilhørende vejledninger:
		  <p>1.	Der er tale om kortvarigt ophold på op til 5 døgn.</p>
		  <p>2.	Der er tilstrækkelige alarmerings-, evakuerings- og redningsmuligheder.</p>
		  <p>3.	Der i byggeri, hvor der midlertidigt overnatter mere end 150 personer, skal være mindst én fast vågen vagt.</p>
		  <p>4.	Der udarbejdes en driftsplan efter bestemmelserne i § 83, som sikrer, at der opnås et sikkerhedsniveau som beskrevet i § 82.</p>
		  <p>5.	Der er udarbejdet ordensregler om forebyggelse af brand.</p>
		  <p>6.	Der er udarbejdet en brand- og evakueringsinstruks.</p>
		  <p>7.	Der er udarbejdet en belægningsplan for lokaler, hvor der overnatter mere end 50 personer.</p>
		  </Typography>
</Grid>
          <SubmitButton onClick={submitHandler} />
        </Grid>
      </Container>
    </MuiPickersUtilsProvider>
  );
}
export default Formular;
