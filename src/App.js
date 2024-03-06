import { useState } from 'react';
import * as React from 'react';
import axios from 'axios';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import './App.css';


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
  const [quiz, setQuiz] = useState([]);
  const [corrects, setCorrects] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [curIdx, setCurIdx] = useState(0);
  const [btnVariant1, setBtnVariant1] = useState('outlined');
  const [btnVariant2, setBtnVariant2] = useState('outlined');
  const [btnVariant3, setBtnVariant3] = useState('outlined');
  const [btnVariant4, setBtnVariant4] = useState('outlined');
  const [btnColor1, setBtnColor1] = useState('primary');
  const [btnColor2, setBtnColor2] = useState('primary');
  const [btnColor3, setBtnColor3] = useState('primary');
  const [btnColor4, setBtnColor4] = useState('primary');
  const [submitted, setSubmitted] = useState(false);
  const [scoreval, setScoreval] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  //data will be the string we send from our server
  const apiCall = () => {
    axios.post('https://5176-188-43-136-34.ngrok-free.app/video',
    {
      "videolink": link
    },
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Access-Control-Allow-Origin": "*"
      }
    }).then((data) => {
      var quizes = data['data']['quiz_list'];
      console.log(quizes);
      setQuiz(quizes);
      var temparr = [];
      var temparr1 = [];
      quizes.forEach(item => {
        temparr.push(item['options'].indexOf(item['correct_answer']));
        temparr1.push(-1);
      });
      setCorrects(temparr);
      setAnswers(temparr1);
    })
  }

  return (
    <div className="App" row="true">
      <FormControl 
        sx={{ m: 5 }}
      >
        <RadioGroup
          row={true}
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel value="youtubelink" control={<Radio />} label="YouTube Link" onClick={() => setTabname("youtubelink")} />
          <FormControlLabel value="docfile" control={<Radio />} label="Upload file"  onClick={() => setTabname("docfile")} />
        </RadioGroup>
        <FormControl sx={{ m: 5 }}>
          {(tabname === "youtubelink") && 
          <TextField id="link_input" label="YouTube link" variant="outlined" onChange={changeYouTubeLink} style={{width: 700}} />}
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
              width="320"
              height="240"
              src={`${link}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
        }
        { (link || file1) && quiz.length ===0 && <Button onClick={apiCall} variant="contained" sx={{mt:3}}>Generate Quiz</Button> }
        {quiz.length > 0 && !submitted && !showAnswer && 
        <FormControl>
          <h4>Question {curIdx+1} / {quiz.length}</h4>
          <h3>{quiz[curIdx]["question"]}</h3>
          <Button variant={btnVariant1} index="1" color={btnColor1} sx={{mt:3}} size="medium" onClick={selectAnswer}>{quiz[curIdx]["options"][0]}</Button>
          <Button variant={btnVariant2} index="2" color={btnColor2} sx={{mt:1}} size="medium" onClick={selectAnswer}>{quiz[curIdx]["options"][1]}</Button>
          <Button variant={btnVariant3} index="3" color={btnColor3} sx={{mt:1}} size="medium" onClick={selectAnswer}>{quiz[curIdx]["options"][2]}</Button>
          <Button variant={btnVariant4} index="4" color={btnColor4} sx={{mt:1}} size="medium" onClick={selectAnswer}>{quiz[curIdx]["options"][3]}</Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Button variant='contained' color="secondary" onClick={prevQuestion}>{"<<"}</Button>
            <Button variant='contained' color="secondary" onClick={nextQuestion}>{">>"}</Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Button variant='outlined' color="primary" onClick={submitQA}>Submit</Button>
          </Box>
        </FormControl>}
        {submitted && 
        <FormControl>
          <Box><h2>Congratulations!</h2></Box>
          <Box><h5>Your score {scoreval} / {quiz.length} ({(scoreval/quiz.length*100).toFixed(2)}%)</h5></Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Button variant='outlined' style={{width: 200}} onClick={retakeQA}>Retake</Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Button variant='outlined' style={{width: 200}} onClick={showAnswers}>Show Answers</Button>
          </Box>
        </FormControl>
        }
        {quiz.length > 0 && showAnswer && 
        <FormControl>
          <h4>Question {curIdx+1} / {quiz.length}</h4>
          <h3>{quiz[curIdx]["question"]}</h3>
          <Button 
            variant={corrects[curIdx] === 0 ? 'contained' : 'outlined'} 
            color={corrects[curIdx] === 0 ? 'secondary' : 'primary'} 
            sx={{mt:3}} size="medium">{quiz[curIdx]["options"][0]}
          </Button>
          <Button 
            variant={corrects[curIdx] === 1 ? 'contained' : 'outlined'} 
            color={corrects[curIdx] === 1 ? 'secondary' : 'primary'} 
            sx={{mt:1}} size="medium">{quiz[curIdx]["options"][1]}
          </Button>
          <Button
            variant={corrects[curIdx] === 2 ? 'contained' : 'outlined'} 
            color={corrects[curIdx] === 2 ? 'secondary' : 'primary'} 
            sx={{mt:1}} size="medium">{quiz[curIdx]["options"][2]}
          </Button>
          <Button 
            variant={corrects[curIdx] === 3 ? 'contained' : 'outlined'} 
            color={corrects[curIdx] === 3 ? 'secondary' : 'primary'} 
            sx={{mt:1}} size="medium">{quiz[curIdx]["options"][3]}
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Button variant='contained' color="secondary" onClick={prevQuestion}>{"<<"}</Button>
            <Button variant='contained' color="secondary" onClick={nextQuestion}>{">>"}</Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Button variant='outlined' color="primary" onClick={submitQA}>Submit</Button>
          </Box>
        </FormControl>}
      </FormControl>
    </div>
  );

  function clearBtnStyle() {
    setBtnVariant1('outlined');
    setBtnColor1('primary');
    setBtnVariant2('outlined');
    setBtnColor2('primary');
    setBtnVariant3('outlined');
    setBtnColor3('primary');
    setBtnVariant4('outlined');
    setBtnColor4('primary');
  }
  function showAnswers(event) {
    setShowAnswer(true);
    setSubmitted(false);
  }
  function retakeQA(event) {
    setCurIdx(0);
    var temparr = [];
    quiz.forEach(item => {
      temparr.push(-1);
    });
    setAnswers(temparr);
    setScoreval(0);
    setSubmitted(false);
    setShowAnswer(false);
  }
  function selectAnswer(event) {
    var index = Number(event.target.attributes.getNamedItem("index").value);
    clearBtnStyle();
    if (index === 1) {
      setBtnVariant1('contained');
      setBtnColor1('secondary');
    } else if (index === 2) {
      setBtnVariant2('contained');
      setBtnColor2('secondary');
    } else if (index === 3) {
      setBtnVariant3('contained');
      setBtnColor3('secondary');
    } else if (index === 4) {
      setBtnVariant4('contained');
      setBtnColor4('secondary');
    }
    // check score
    var answerdata = answers;
    answerdata[curIdx] = index-1;
    setAnswers(answerdata);
  }

  function prevQuestion(event) {
    if (curIdx > 0) {
      clearBtnStyle();
      setCurIdx(curIdx-1);
    }
  }
  function nextQuestion(event) {
    if (curIdx < quiz.length-1) {
      clearBtnStyle();
      setCurIdx(curIdx+1);
    }
  }
  function changeYouTubeLink(event) {
    setLink(event.target.value);
  }
  function onChangeFile(event) {
    const file = event.target.files[0];
    setFile1(file);
    const formData = new FormData();
    formData.append("quizfile", file);
    axios({
      method: "post",
      url: "https://5176-188-43-136-34.ngrok-free.app/parsefile",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  }

  function submitQA(event) {
    var score = 0;
    corrects.forEach((item, idx) => {
      if (item === answers[idx]) {
        score ++;
      }
    })
    setScoreval(score);
    console.log(score);
    setSubmitted(true);
  }
}


export default App;
