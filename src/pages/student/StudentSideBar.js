import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';

const StudentSideBar = () => {
    const location = useLocation();
    
    const isItemSelected = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <React.Fragment>
                <ListItemButton
                    component={Link}
                    to="/"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red background on hover
                        },
                        ...(isItemSelected("/") && { backgroundColor: 'rgba(255, 0, 0, 0.1)' }), // Red background when selected
                    }}
                >
                    <ListItemIcon>
                        <HomeIcon style={{ color: isItemSelected("/") ? 'red' : 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton
                    component={Link}
                    to="/Student/subjects"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red background on hover
                        },
                        ...(isItemSelected("/Student/subjects") && { backgroundColor: 'rgba(255, 0, 0, 0.1)' }), // Red background when selected
                    }}
                >
                    <ListItemIcon>
                        <AssignmentIcon style={{ color: isItemSelected("/Student/subjects") ? 'red' : 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Subjects" />
                </ListItemButton>
                <ListItemButton
                    component={Link}
                    to="/Student/attendance"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red background on hover
                        },
                        ...(isItemSelected("/Student/attendance") && { backgroundColor: 'rgba(255, 0, 0, 0.1)' }), // Red background when selected
                    }}
                >
                    <ListItemIcon>
                        <ClassOutlinedIcon style={{ color: isItemSelected("/Student/attendance") ? 'red' : 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Attendance" />
                </ListItemButton>
                <ListItemButton
                    component={Link}
                    to="/Student/complain"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red background on hover
                        },
                        ...(isItemSelected("/Student/complain") && { backgroundColor: 'rgba(255, 0, 0, 0.1)' }), // Red background when selected
                    }}
                >
                    <ListItemIcon>
                        <AnnouncementOutlinedIcon style={{ color: isItemSelected("/Student/complain") ? 'red' : 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Complain" />
                </ListItemButton>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
                <ListSubheader component="div" inset>
                    User
                </ListSubheader>
                <ListItemButton
                    component={Link}
                    to="/Student/profile"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red background on hover
                        },
                        ...(isItemSelected("/Student/profile") && { backgroundColor: 'rgba(255, 0, 0, 0.1)' }), // Red background when selected
                    }}
                >
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon style={{ color: isItemSelected("/Student/profile") ? 'red' : 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton
                    component={Link}
                    to="/logout"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red background on hover
                        },
                        ...(isItemSelected("/logout") && { backgroundColor: 'rgba(255, 0, 0, 0.1)' }), // Red background when selected
                    }}
                >
                    <ListItemIcon>
                        <ExitToAppIcon style={{ color: isItemSelected("/logout") ? 'red' : 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </React.Fragment>
        </>
    )
}

export default StudentSideBar;
