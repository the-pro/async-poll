import {useState, useEffect, forwardRef} from 'react'
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useParams } from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Progress from './Progress'

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Poll(props) {

    const [title,setTitle] = useState("")
    const [options,setOptions] = useState([])
    const { id } = useParams()
    const [value,setValue] = useState(undefined)
    const [snackbar,setSnackbar] = useState(false)
    const [docRef,setDocRef] = useState(undefined)
    const [submit,setSubmit] = useState(localStorage.getItem(id)?true:false)
    const [votes,setVotes] = useState([])
    const [total,setTotal] = useState(0) 

    const handleRadioChange = (e) => {
        setValue(e.target.value)
    }

    const realtime = () => {
        firebase.firestore().collection("Poll").onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.data().id === id) {
                    setVotes(doc.data().votes)
                    setTitle(doc.data().title)
                    setOptions(doc.data().options)
                    calculateVotes(doc.data().votes)
                }
            })
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        if(value === undefined) {
            setSnackbar(true)
            return
        }
        setSubmit(true)
        localStorage.setItem(id,true)
        if(docRef === undefined) return
        firebase.firestore().runTransaction(async (transaction) => {
            const val = await firebase.firestore().collection("Poll").doc(docRef).get()
            let votes = val.data().votes
            votes[value] = votes[value] + 1
            transaction.update(firebase.firestore().collection("Poll").doc(docRef),{votes: votes})
            // realtime()
        })

    }

    const calculateVotes = (votes) => {
        if(votes){
            let sum = 0
            Object.getOwnPropertyNames(votes).forEach((val) => {
                sum+=votes[val]
            })

            setTotal(sum)
        }
    }

    useEffect(() => {
        firebase.firestore().collection("Poll")
        .where("id","==",id)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                setDocRef(doc.id)
                setTitle(doc.data().title)
                setOptions(doc.data().options)
                setVotes(doc.data().votes)
                calculateVotes(doc.data().votes)
                realtime()
            });
        })
    },[submit])

    return (
        <div className="flex-col">
            <br/>
            <div className="card long mid" style={{marginLeft: '7%'}}><h1>{title} {submit?<span>({total})</span>:''}</h1></div><br/>
            <FormControl component="fieldset" className="long">
                <RadioGroup
                    aria-label="gender"
                    defaultValue="female"
                    name="radio-buttons-group"
                    onChange={handleRadioChange}
                >
                    {
                        options.map((val,index) => {
                            return submit?<div><div className="card flex-col" style={{marginLeft: '20%'}}>{val} ({votes[index]}):<Progress value={(Math.floor(votes[`${index}`])/total)*100 | 0}/><br/></div><br/></div>:<div><div className="card flex-col" style={{marginLeft: '20%'}}><FormControlLabel value={index} control={<Radio />} label={val} key={index} id={index}/></div><br/></div>
                        })
                    }
                </RadioGroup>
            </FormControl>
            <br/>
            {
                submit
                ?<div></div>
                :<Button onClick={handleSubmit}>Submit</Button>
            }
            <Snackbar open={snackbar} autoHideDuration={6000} onClose={() => {setSnackbar(false)}}>
                <Alert onClose={() => {setSnackbar(false)}} severity="warning" sx={{ width: '100%' }}>
                    {submit?'The page has been updated, refresh to see the changes!':'Please select an option'}
                </Alert>
            </Snackbar>
        </div>
    )
    
} 