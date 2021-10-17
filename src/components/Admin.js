// import { useState } from "react"
import { useParams } from "react-router-dom"
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import {useState, useEffect, forwardRef} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete'

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import CopyComponent from './CopyComponent';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Admin(props) {
    const [title,setTitle] = useState("")
    const [options,setOptions] = useState([])
    const { id } = useParams()
    const [snackbar,setSnackbar] = useState(false)
    const [docRef,setDocRef] = useState(undefined)
    const admin = id
    const [publicId, setPublic] = useState(undefined)

    const handleChange = (e,id) => {
        setOptions((options) => {
            return options.map((val,index) => {
                if(id === index) return e.target.value
                return val
            })
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let empty = false
        options.forEach((val) => {
            if(val === "") empty = true
        })
        if (title === "" || empty) {
            setSnackbar(true)
            return
        }
        let votes = {}
        options.forEach((val,index) => {
            votes[index] = 0
        })
        firebase.firestore().runTransaction(async (transaction) => {
            transaction.update(firebase.firestore().collection("Poll").doc(docRef),{
                title,
                options
            })
            // realtime()
        })
    }

    useEffect(() => {
        firebase.firestore().collection("Poll")
        .where("admin","==",id)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                setDocRef(doc.id)
                setTitle(doc.data().title)
                setOptions(doc.data().options)
                setPublic(doc.data().id)
            });
        })
    },[])

    return (
        <Box>
            <Box className="partial-width" component="form">
            <h1>Admin Page</h1>
            <div>
               <div> Public Link: <br/><CopyComponent link={window.location.host+'/'+publicId}/></div>
            </div>
                <h3>Poll Question</h3>
                <div class="">
                <TextField
                    required
                    id="title"
                    fullWidth
                    margin="normal"
                    onChange = {(e) => {setTitle(e.target.value)}}
                    className="wide"
                    value={title}
                    multiline
                    rows={4}
                />
                <h3>Options</h3>
                {
                    options.map((val,index) => {
                        return (
                            <div className="flex-row">
                            <h3><br/>{index+1}:</h3>
                            <TextField
                                required
                                id={`option-${index+1}`}
                                margin="normal"
                                onChange = {(e) => {handleChange(e,index)}}
                                className="long"
                                value={val}
                            />
                            <div><br/>
                                <Fab color="primary" aria-label="add" onClick={() => {}} size="small">
                                    <DeleteIcon fontSize="small" onClick={(e) => {setOptions(options.filter((value,id) => id!==index))}}/>
                                </Fab>
                            </div>
                            </div>
                        )
                    })
                }
                <br/>
 
                <br/>
                <Button type="submit" onClick={handleSubmit} ><h3>Update Poll</h3></Button>
                </div>
                <Snackbar open={snackbar} autoHideDuration={6000} onClose={() => {setSnackbar(false)}}>
                    <Alert onClose={() => {setSnackbar(false)}} severity="success" sx={{ width: '100%' }}>
                        Poll Updated!
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    )
}