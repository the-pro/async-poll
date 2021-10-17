import {useState} from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import CopyIcon from '@mui/icons-material/CopyAll'
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check'

export default function CopyComponent(props) {
    const [copy,setCopy] = useState(false)
    const handleCopy = () => {
        setCopy(true)
        if(navigator.clipboard)
        navigator.clipboard.writeText(props.link)
    }
    return (
        <OutlinedInput
            disabled={true}
            endAdornment={
            <InputAdornment position="end">
                <IconButton
                onClick={handleCopy}
                edge="end"
                >
                {copy ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
            </InputAdornment>
            }
            label="Public Link"
            value={props.link}
        />
    )
}