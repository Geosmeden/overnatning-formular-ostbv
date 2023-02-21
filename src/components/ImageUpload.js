import React, { useContext, useRef } from "react";
import { Grid, Chip, Typography, IconButton } from "@material-ui/core";
import PhotoCameraIcon from "@material-ui/icons/CloudUploadRounded";
import { FormularContext } from "../context/FormContext";

const _substr = (str) => {
  if (str.length > 25) {
    return "..." + str.substring(str.length - 22);
  }
  return str;
};

export default function ImageUpload({ setImageSrc }) {
  const fileRef = React.useRef(null);
  const [state, setValue, setValues] = useContext(FormularContext);
  const { overnat_tegning_filnavn } = state;
  const deleteImage = () => {
    setValues({
      // imageSrc: "",
      overnat_tegning_filnavn: "",
    });
    fileRef.current.value = "";
    setImageSrc("");
  };

  const reader = new FileReader();
  const handleImageUpload = (e) => {
    console.log("file upload: ", e.target.files[0].name);
    let file = e.target.files[0];
    let name = e.target.files[0].name;
    // fileName = name;

    setValue("overnat_tegning_filnavn", e.target.files[0].name);

    if (file) {
      reader.onload = handleReaderLoaded;
      // reader.readAsBinaryString(file);
      reader.readAsDataURL(file);
    }
  };

  const handleReaderLoaded = (e) => {
    let binaryString = e.target.result;
    console.log("before setImageSrc");
    setImageSrc(reader.result);
    setValue("overnat_tegning", reader.result.replace(/^data:.+;base64,/, ""));
    // setData({
    //   ...data,
    //   overnat_tegning : btoa(binaryString)
    // });
  };

  return (
    <>
      <Grid item xs={10}>
        <Typography
          style={{ color: "rgba(0, 0, 0, 0.74)" }}
          variant='subtitle1'
          component='h3'
        >		
          Vedhæft dokumentation: Der kan her vedhæftes driftsjournal og belægningsplan {" "}
        </Typography>
      </Grid>
      
	  <Grid item xs={2}>
        <label htmlFor='upload-photo'>
          <input
            style={{ display: "none" }}
            id='upload-photo'
            name='upload-photo'
            type='file'
            accept='.jpeg,.jpg,.png,.pdf'
            onChange={handleImageUpload}
            ref={fileRef}
          />

          <IconButton
            color='primary'
            aria-label='upload fil'
            onClick={(e) => fileRef.current && fileRef.current.click()}
          >
            <PhotoCameraIcon />
          </IconButton>
        </label>
      </Grid>
      <Grid item xs={5}>
        {overnat_tegning_filnavn && (
          <Chip
            variant='outlined'
            label={_substr(overnat_tegning_filnavn)}
            size='medium'
            color='secondary'
            onDelete={(x) => deleteImage()}
          />
        )}
      </Grid>
    </>
  );
}
