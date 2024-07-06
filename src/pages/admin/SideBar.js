import * as React from 'react';
import {
    Divider,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    List,
    useTheme,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';

const SideBar = () => {
    const location = useLocation();
    const theme = useTheme();

    const menuItems = [
        { text: 'Accueil', icon: <HomeIcon />, path: '/' },
        { text: 'Classes', icon: <ClassOutlinedIcon />, path: '/Admin/classes' },
        { text: 'Matières', icon: <AssignmentIcon />, path: '/Admin/subjects' },
        { text: 'moniteurs', icon: <SupervisorAccountOutlinedIcon />, path: '/Admin/teachers' },
        { text: 'Étudiants', icon: <PersonOutlineIcon />, path: '/Admin/students' },
        { text: 'Annonces', icon: <AnnouncementOutlinedIcon />, path: '/Admin/notices' },
        { text: 'Réclamations', icon: <ReportIcon />, path: '/Admin/complains' },
    ];

    const userItems = [
        { text: 'Profil', icon: <AccountCircleOutlinedIcon />, path: '/Admin/profile' },
        { text: 'Déconnexion', icon: <ExitToAppIcon />, path: '/logout' },
    ];

    return (
        <List>
            {menuItems.map((item) => (
                <ListItemButton
                    key={item.text}
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)', // couleur rouge claire au survol
                            '& .MuiListItemIcon-root': {
                                color: 'red', // couleur de l'icône rouge au survol
                            },
                        },
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(255, 0, 0, 0.2)', // couleur rouge claire lorsqu'élément sélectionné
                            '& .MuiListItemIcon-root': {
                                color: 'red', // couleur de l'icône rouge lorsqu'élément sélectionné
                            },
                            '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.3)', // couleur rouge plus sombre au survol lorsqu'élément sélectionné
                            },
                        },
                    }}
                >
                    <ListItemIcon>
                        {React.cloneElement(item.icon, {
                            sx: { color: location.pathname === item.path ? 'red' : 'inherit' },
                        })}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
                Utilisateur
            </ListSubheader>
            {userItems.map((item) => (
                <ListItemButton
                    key={item.text}
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)', // couleur rouge claire au survol
                            '& .MuiListItemIcon-root': {
                                color: 'red', // couleur de l'icône rouge au survol
                            },
                        },
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(255, 0, 0, 0.2)', // couleur rouge claire lorsqu'élément sélectionné
                            '& .MuiListItemIcon-root': {
                                color: 'red', // couleur de l'icône rouge lorsqu'élément sélectionné
                            },
                            '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.3)', // couleur rouge plus sombre au survol lorsqu'élément sélectionné
                            },
                        },
                    }}
                >
                    <ListItemIcon>
                        {React.cloneElement(item.icon, {
                            sx: { color: location.pathname === item.path ? 'red' : 'inherit' },
                        })}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            ))}
        </List>
    );
};

export default SideBar;
