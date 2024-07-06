import React, { useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../redux/userRelated/userSlice';
import { Button, Collapse, TextField, Typography } from '@mui/material';

const AdminProfile = () => {
    const [showTab, setShowTab] = useState(false);
    const buttonText = showTab ? 'Annuler' : 'Modifier le profil';

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, error } = useSelector((state) => state.user);
    const address = "Admin";

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [schoolName, setSchoolName] = useState(currentUser.schoolName);

    const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName };

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser(fields, currentUser._id, address));
    };

    const deleteHandler = () => {
        try {
            dispatch(deleteUser(currentUser._id, "Students"));
            dispatch(deleteUser(currentUser._id, address));
            dispatch(authLogout());
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <Typography variant="h5" gutterBottom style={{ color: '#ff0000', marginBottom: '20px' }}>Profil Administrateur</Typography>
            <Typography variant="body1" gutterBottom><strong>Nom :</strong> {currentUser.name}</Typography>
            <Typography variant="body1" gutterBottom><strong>Email :</strong> {currentUser.email}</Typography>
            <Typography variant="body1" gutterBottom><strong>École :</strong> {currentUser.schoolName}</Typography>
            <Button variant="contained" color="error" onClick={deleteHandler} style={{ marginTop: '20px', marginRight: '10px' }}>Supprimer</Button>
            <Button
                variant="contained"
                onClick={() => setShowTab(!showTab)}
                style={{ backgroundColor: "#270843", color: '#ffffff', "&:hover": { backgroundColor: "#3f1068" }, marginTop: '20px' }}>
                {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                {buttonText}
            </Button>
            <Collapse in={showTab} timeout="auto" unmountOnExit>
                <div style={{ marginTop: '20px' }}>
                    <form onSubmit={submitHandler}>
                        <Typography variant="h6" gutterBottom>Modifier les détails</Typography>
                        <TextField
                            label="Nom"
                            fullWidth
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Nom de l'école"
                            fullWidth
                            value={schoolName}
                            onChange={(event) => setSchoolName(event.target.value)}
                            autoComplete="name"
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Mot de passe"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            margin="normal"
                        />
                        <Button variant="contained" type="submit" style={{ backgroundColor: '#270843', color: '#ffffff', marginTop: '20px' }}>Mettre à jour</Button>
                    </form>
                </div>
            </Collapse>
        </div>
    );
};

export default AdminProfile;
