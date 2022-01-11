import React from "react";
import Formular from "./Formular";
import { FormularProvider } from "./context/FormContext";
import "./App.css";

function App() {
  return (
    <div className='App'>
      <FormularProvider>
        <Formular />
      </FormularProvider>
    </div>
  );
}

export default App;
