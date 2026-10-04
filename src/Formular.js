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

const combineDateAndTime = (dateValue, timeValue) => {
  const combined = new Date(dateValue);
  const time = new Date(timeValue);
  combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return combined;
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
	bemaerkning: yup.string(),
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
	bemaerkning: yup.string(),
  });

  const [komkode, setKomkode] = useState("751|741|727|746");
  const [imageSrc, setImageSrc] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);

  const setAdressData = (adress) => {
  //console.log(adress);

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
    const a = adress.data;
    //console.log("x/y:", a.x, a.y);

    let streetname = adress.tekst.split(",");
    let adressname = streetname.length > 0 ? streetname[0] : adress.tekst;
    setValues({
      overnat_adresse: adressname,
      overnat_postnr: a.postnr,
      overnat_by: a.postnrnavn,
      the_geom: `ST_Transform(ST_SetSRID(ST_MakePoint(x,y),4326),25832)`,
      x_coord: a.x,
      y_coord: a.y,
    });
  }
};


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
      overnat_start_tid: combineDateAndTime(
        state.overnat_start_dato,
        state.overnat_start_tid
      ),
      overnat_slut_tid: combineDateAndTime(
        state.overnat_slut_dato,
        state.overnat_slut_tid
      ),
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
		  Overnatninger i rum til mere end 50 personer skal ske efter en belægningsplan, så det sikres, at de fornødne flugtvejspassager til udgangsdøre ikke spærres af sovepladser, inventar, bagage m.m. Belægningsplanen skal ophænges i overnatningslokalet. Belægningsplaner til rum for midlertidig overnatning kan udføres som beskrevet i <a href="https://bygningsreglementet.dk/-/media/Br/Kap_5_Brand/Vejledninger/Bilag-11b--Praccepterede-lsninger-for-midlertidig-overnatning-i-bygninger--version-10.pdf">Bilag 11b: Præ-acceptable løsninger for midlertidige overnatninger i bygninger</a> – appendiks C: Belægningsplan
		  </Typography>
		  </Grid>
		  }
		  
		  	  
          <TextInput
            size={12}
            id='overnat_antal'
            type='number'
            title='Antal overnattende'
          />
		  <Grid item xs={12}>
		  <Typography style={{ color: "rgba(0, 0, 0, 0.74)", fontSize: "0.9em" }}>
          I bygningsafsnit, der indrettes til flere end 150 overnattende personer, skal der være en fast, vågen vagt, som skal foretage inspektionsrunder.
		  </Typography>
		  </Grid>
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
		  
		  <ImageUpload setImageSrc={setImageSrc} />
		  
		  <Grid item xs={12}>
		  <Typography style={{ color: "rgba(0, 0, 0, 0.74)", fontSize: "0.9em" }}>
          Den ansvarlige for overnatningen forpligter sig til følgende:
		  <ul>
		  <li>At der rettidigt er fremsendt meddelelse om den midlertidige overnatning til kommunalbestyrelsen.</li>
		  <li>At den midlertidige overnatning sker i overensstemmelse med retningslinjerne i <a href="https://www.bygningsreglementet.dk/media/vy1d0uyr/bilag-11bversion-11-uden-ndringsmarkeringer-a.pdf">Bilag 11b: Præ-acceptable løsninger for midlertidige overnatninger i bygninger</a> eller retningslinjerne i byggeriets DKV-plan for midlertidig overnatning.</li>
		  <li>At ordensregler er udarbejdet som opslag, der er ophængt i tilknytning til brand- og evakueringsinstruksen.</li>
		  <li>At der for overnatninger med børn og unge under 18 år er en myndig person til stede ved overnatningen og at den eller de myndige personer ved midlertidig overnatning for børn og unge under 18 år er bekendt med ordensreglerne.</li>
		  <li>At der er udarbejdet og ophængt brand- og evakueringsinstruks.</li>
		  <li>At der er udarbejdet driftsjournal, som kontrolleres hver dag ved overnatning over flere døgn. </li>
		  <li>At der er udarbejdet og ophængt en belægningsplan for overnatningslokaler til flere end 50 overnattende personer.</li>
		  <li>At der i bygningsafsnit, der indrettes til flere end 150 overnattende personer, etableres fast, vågen vagt, som skal foretage inspektionsrunder.</li>
		  <li>At den/de faste vågne, vagter er instrueret om deres opgave, alarmeringsmuligheder, brand- og evakueringsinstruks mv.</li>
		  <li>At hvis ansvar er overdraget til tredjepart, skal det sikres at den ansvarlige for overnatningen har modtaget kopi af anmeldelsen og godkendt indholdet.</li>
		  </ul>
		  </Typography>
</Grid>
          <SubmitButton onClick={submitHandler} />
        </Grid>
      </Container>
    </MuiPickersUtilsProvider>
  );
}
export default Formular;
