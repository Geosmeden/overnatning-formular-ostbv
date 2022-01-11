import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';  
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));

export default function AlertComp(props){
    const classes = useStyles();
    const {errors, closeAlert} = props;
    const list = <ul>
        {
            errors.map((err, index) => <li key={index}>{err}</li>)
        }
    </ul>;
    return (
        <div className={classes.root}>
            <Alert severity="error" onClose={() => closeAlert([])}>{list}</Alert>
        </div>
    );
}