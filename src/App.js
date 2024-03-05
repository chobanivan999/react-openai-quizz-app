import { useState } from 'react';
import axios from 'axios';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import './App.css';

//data will be the string we send from our server
const apiCall = () => {
  axios.get('https://d177-188-43-136-34.ngrok-free.app/video',
  {
    headers: {
      "ngrok-skip-browser-warning": "true",
      "Access-Control-Allow-Origin": "*"
    }
  }).then((data) => {
    //this console.log will be in our frontend console
    console.log(data)
  })
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


function App() {
  const [tabname, setTabname] = useState("");
  const [link, setLink] = useState("");
  const [file1, setFile1] = useState("");
  const [state, setState] = useState(false);
  return (
    <div className="App" row>
      <FormControl 
        sx={{ m: 5 }}
      >
        <button onClick={apiCall}>Make API Call</button>
        <RadioGroup
          row="true"
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel value="youtubelink" control={<Radio />} label="YouTube Link" onClick={() => setTabname("youtubelink")} />
          <FormControlLabel value="docfile" control={<Radio />} label="Upload file"  onClick={() => setTabname("docfile")} />
        </RadioGroup>
        <FormControl sx={{ m: 5 }}>
          {(tabname === "youtubelink") && 
          <TextField id="link_input" label="YouTube link" variant="outlined" onChange={changeYouTubeLink} />}
          {(tabname === "docfile") && 
            <FormControl>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={onChangeFile} />
              </Button>
            </FormControl>
          }
          {file1.name}
        </FormControl>
        { link && 
          <div className="video-responsive">
            <iframe
              width="853"
              height="480"
              src={`${link}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
        }
      </FormControl>
    </div>
  );
  function changeYouTubeLink(event) {
    setLink(event.target.value);
  }
  function onChangeFile(event) {
    setFile1(event.target.files[0]);
    console.log(event.target.files[0]);
  }
}

export default App;
