import * as React from "react";
import Badge from "@mui/material/Badge";
import WifiIcon from "@mui/icons-material/Wifi";
import PermScanWifiIcon from '@mui/icons-material/PermScanWifi';
import TextField from "@mui/material/TextField";

class myBadge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            badgeContent: this.props.badgeContent,
        };
    } 
    
    handleTextFieldChange = (event) => {
        const newValue = event.target.value;
        this.setState({ badgeContent: newValue });
    };

    render() {
        const { badgeContent } = this.state;
        if (badgeContent < 60) {
            return (
                <div>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={this.handleTextFieldChange} />
                    <Badge badgeContent={badgeContent} color="primary">
                        <PermScanWifiIcon color="action" />
                    </Badge>
                </div>
            );
        }
        else {
            return (
                <div>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={this.handleTextFieldChange} />
                    <Badge badgeContent={badgeContent} color="primary">
                        <WifiIcon color="action" />
                    </Badge>
                </div>
            );
        }
    }
}

export default myBadge;