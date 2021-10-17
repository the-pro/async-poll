import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import {useState,forwardRef} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {v4 as uuidv4} from 'uuid'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete'
import { useHistory } from 'react-router-dom';

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import CopyComponent from './CopyComponent';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreatePoll() {
    let [poll,setPoll] = useState(true)
    let [options,setOptions] = useState(["",""])
    let [title,setTitle] = useState("")
    let [id,setId] = useState(uuidv4())
    let [admin,setAdmin] = useState(uuidv4())
    const [open, setOpen] = useState(false);
    const [snackbar,setSnackbar] = useState(false)
    const history = useHistory()

    const handleClose = () => {
        setOpen(false);
        history.push(`/edit/${admin}`)

    };

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
        firebase.firestore().collection('Poll').doc().set({
            title,
            options,
            admin,
            id,
            votes
        })
        .then((res) => {
            setOpen(true)
        })
        
    }

    return (
        <div>
            {poll
                ?<Box sx={{ '& > :not(style)': { m: 1 } }} className="mid">
                    <Card variant="outlined">
                        <div>
                            <Fab color="primary" aria-label="add" onClick={() => {setPoll(false)}}>
                                <AddIcon />
                            </Fab>
                        </div>
                        <div>
                            <h1>Create a Poll</h1>
                        </div>
                    </Card>
                </Box>
                :   <Box className="partial-width" component="form">
                        {/* <h1>Create Your Poll</h1> */}
                        <h3>What would you like to ask?</h3>
                        <div class="">
                        <TextField
                            required
                            id="title"
                            label="Type your Question"
                            placeholder="Poll Title"
                            fullWidth
                            margin="normal"
                            onChange = {(e) => {setTitle(e.target.value)}}
                            className="wide"
                            multiline
                            rows={4}
                        />
                        <h3>Fill in your Options</h3>
                        {
                            options.map((val,index) => {
                                return (
                                    <div className="flex-row">
                                    <h3><br/>{index+1}:</h3>
                                    <TextField
                                        required
                                        id={`option-${index+1}`}
                                        label={`option ${index+1}`}
                                        placeholder={`option ${val}`}
                                        margin="normal"
                                        onChange = {(e) => {handleChange(e,index)}}
                                        className="long"
                                    />
                                    <div><br/>
                                        <Fab color="primary" aria-label="add" onClick={() => {setPoll(false)}} size="small">
                                            <DeleteIcon fontSize="small" onClick={(e) => {setOptions(options.filter((value,id) => id!==index))}}/>
                                        </Fab>
                                    </div>
                                    </div>
                                )
                            })
                        }
                        <br/>
                        <div className="mid">
                            <Fab color="primary" aria-label="add" onClick={() => {setOptions([...options,""])}}>
                                <AddIcon />
                            </Fab>
                        </div>
                        <br/>
                        <div className="mid">
                        <Button type="submit" onClick={handleSubmit} className="mid"><h3>Create Poll</h3></Button>
                        </div>
                        </div>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Poll Created</DialogTitle>
                            <DialogContent>
                            <DialogContentText>
                                Admin Link:<br/>
                                <CopyComponent link={window.location.href+'edit/'+admin}/>
                                <br/>
                                <span className="small">*Do not share this link with anyone*</span>
                                <br/>
                                <br/>
                                <br/>
                                Public Link:<br/>
                                <CopyComponent link={window.location.href+id}/>
                                <br/>
                                <span className="small">*The links might not get copied on pressing the copy button on some browsers*</span>
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleClose}>OK</Button>
                            </DialogActions>
                        </Dialog>
                        <Snackbar open={snackbar} autoHideDuration={6000} onClose={() => {setSnackbar(false)}}>
                            <Alert onClose={() => {setSnackbar(false)}} severity="warning" sx={{ width: '100%' }}>
                                Please fill all the inputs
                            </Alert>
                        </Snackbar>
                    </Box>
            }
        </div>
    )
} 