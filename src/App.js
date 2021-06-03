import './App.css';
import React, { useCallback, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  container: {
    marginTop: '20px',
    background: '#f3f3f3',
    overflow: 'hidden',
    paddingTop: '20px',
    paddingBottom: '20px'
    },
    padding: {
      padding: '20px'
    }
});

function App() {

  const classes = useStyles();
  
  const [state, setState] = React.useState({
    distance: 50,
    speed1: 50,
    speed2: 50,
    consumption1: 0,
    consumption2: 0,
    time1: 0,
    time2: 0,
    consumDiff: 0,
    timeDiff: 0,
    carType: "3"
  });

  // Initial render
  useEffect(() => {
    compare(state.distance, state.speed1, state.speed2, state.carType);
  }, []);

  
  const [distFactor, setDistFactor] = React.useState({
    distFactMax: 1
  });

  const handleDistChange = (event, distance) => {
    compare(distance, state.speed1, state.speed2, state.carType);
  };

  const handleTypeChange = (event, carType) => {
    compare(state.distance, state.speed1, state.speed2, carType);
  };

  const handleSpeed1Change = (event, speed1) => {
    compare(state.distance, speed1, state.speed2, state.carType);
  };

  const handleSpeed2Change = (event, speed2) => {
    compare(state.distance, state.speed1, speed2, state.carType);
  };

  const handleDistFactChange = (event, factor) => {
    setDistFactor({distFactMax: factor});
  }

  var distMarks = [
    {
      value: 0,
      label: '0Km'
    },
    {
      value: 100,
      label: '100Km'
    },
    {
      value: 500,
      label: '500Km'
    },
    {
      value: 1000,
      label: '1000Km'
    },
    {
      value: 2000,
      label: '2000Km'
    },
    {
      value: 3000,
      label: '3000Km'
    },
    {
      value: 4000,
      label: '4000Km'
    },
    {
      value: 5000,
      label: '6000Km'
    },
    {
      value: 10000,
      label: '10000Km'
    },

  ];

  function compare(distance, speed1, speed2, carType) {

    let s1 = speed1;
    let s2 = speed2;
    let d = distance;
    let type = carType;
    let k = 0.009;
    let c1 = k*(s1-1);
    let c2 = k*(s2-1);

    let t1 = 3600/s1*d;
    let t2 = 3600/s2*d;

    // factor for consumption per 100km
    let f = type/(100/d);

    let rawCons1 = f+f*c1;
    let rawCons2 = f+f*c2;

    let consumption1 = (Math.round((rawCons1 + Number.EPSILON) * 100) / 100)+"l";
    let consumption2 = (Math.round((rawCons2 + Number.EPSILON) * 100) / 100)+"l";
    
    let time1 = ~~(t1/3600)+"h "+ Math.round((t1/60)%60)+"min "+Math.round(t1%60)+"sec";
    let time2 = ~~(t2/3600)+"h "+ Math.round((t2/60)%60)+"min "+Math.round(t2%60)+"sec";

    let consumDiff = (Math.round((Math.abs(rawCons1-rawCons2) + Number.EPSILON) * 100) / 100)+"L";
    
    let diffSec = Math.round(Math.abs(t1-t2));

    let timeDiff = ~~(diffSec/3600)+"h "+ Math.round((diffSec/60)%60)+"min "+Math.round(diffSec%60)+"sec";

    setState({
      distance: distance,
      speed1: speed1,
      speed2: speed2,
      consumption1: consumption1,
      consumption2: consumption2,
      time1: time1,
      time2: time2,
      consumDiff: consumDiff,
      timeDiff: timeDiff,
      carType: carType
    });    

  }

  return (
    <>
<CssBaseline />
  <AppBar>
    <Toolbar>
      <Typography variant="h6">Autoilumittari</Typography>
    </Toolbar>
  </AppBar>
  <Toolbar />
  <Container maxWidth="sm" className={classes.container}>
     <Grid container spacing={3}>
       <Grid item xs={12}>
         <Paper elevation={3}>
           <Toolbar>
             <Typography>Matka {state.distance}Km</Typography>
           </Toolbar>
           <Divider />
           <Slider
           value={typeof state.distance === 'number' ? state.distance : 50}
           min={1}
           max={distFactor.distFactMax*100}
           marks={distMarks}
           defaultValue={50}
           valueLabelDisplay="auto"
           onChange={handleDistChange}
           />
           <Slider
           value={typeof distFactor.distFactMax === 'number' ? distFactor.distFactMax : 1}
           min={1}
           max={100}
           defaultValue={1}
           valueLabelDisplay="off"
           onChange={handleDistFactChange}
           />
         </Paper>
       </Grid>
     </Grid>

     <Grid container spacing={3}>
       <Grid item xs={12}>
         <Paper>
           <Toolbar>
             <Typography>Ajoneuvotyyppi</Typography>
           </Toolbar>
           <Box component="div" m={1}>
            <RadioGroup row aria-label="carType" name="carType_" value={state.carType} onChange={handleTypeChange}>
              <FormControlLabel value="3" control={<Radio />} label="3l/100Km" />
              <FormControlLabel value="3.5" control={<Radio />} label="3,5l/100Km" />
              <FormControlLabel value="4" control={<Radio />} label="4l/100Km" />
            </RadioGroup>
           </Box>
         </Paper>
       </Grid>
     </Grid>

     <Grid container spacing={3}>
       <Grid item xs={12}>
         <Paper>
           <Toolbar>
             <Typography>Vertailunopeudet</Typography>
           </Toolbar>

           <Grid container spacing={3}>
             <Grid item xs={6}>

               <Slider
               value={typeof state.speed1 === 'number' ? state.speed1 : 50}
               defaultValue={50}
               min={1}
               max={200}
               valueLabelDisplay="auto"
               onChange={handleSpeed1Change}
               />
              <Box component="div" m={1}>
                <Typography>
                Nopeus: {state.speed1}Km/h
                </Typography>
                <Typography>
                Kulutus: {state.consumption1}
                </Typography>
                <Typography>
                Aika: {state.time1}
                </Typography>
               </Box>
             </Grid>
             <Grid item xs={6}>
       
               <Slider
               value={typeof state.speed2 === 'number' ? state.speed2 : 50}
               defaultValue={50}
               min={1}
               max={200}
               valueLabelDisplay="auto"
               onChange={handleSpeed2Change}
             />
             <Box component="div" m={1}>
               <Typography>
               Nopeus: {state.speed2}Km/h
               </Typography>
               <Typography>
                 Kulutus: {state.consumption2}
               </Typography>
               <Typography>
                 Aika: {state.time2}
               </Typography>
              </Box>
             </Grid>
           </Grid>
         </Paper>
       </Grid>
     </Grid>

     <Paper>
       <Grid container spacing={3}>
         <Grid item xs={12}>
           <Toolbar>
             <Typography variant="h6">Kulutusero {state.consumDiff}</Typography>
           </Toolbar>
           <Divider />
           <Toolbar>
             <Typography variant="h6">Aikaero {state.timeDiff}</Typography>
           </Toolbar>
         </Grid>
       </Grid>
     </Paper>
  </Container>
    </>
  );
}

export default App;
