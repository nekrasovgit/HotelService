import React, { useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { SetToken } from 'Services/LocalStorage';
import { useHistory } from 'react-router-dom';
import 'Styles/AuthenticateStyle.css';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';
import AuthContext from '../Contexts/AuthContext/AuthContext';
import jwt_decode from 'jwt-decode';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Authenticate() {
    const _AuthContext = useContext(AuthContext);

    const classes = useStyles();
    const history = useHistory();
    const [loginUser, setloginUser] = useState({
        email: '',
        password: '',
    });

    const { enqueueSnackbar } = useSnackbar();
    const regex = new RegExp(
        /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

    const [formErrors, setformErrors] = useState({
        email: '',
        password: '',
        err: '',
    });

    const validate = () => {
        let isValid = true;

        if (!loginUser.email) {
            setformErrors((formErrors) => ({ ...formErrors, email: 'Email is required' }));
            isValid = false;
        } else {
            setformErrors((formErrors) => ({ ...formErrors, email: '' }));
        }

        if (!loginUser.password) {
            setformErrors((formErrors) => ({ ...formErrors, password: 'Password is required' }));
            isValid = false;
        } else {
            setformErrors((formErrors) => ({ ...formErrors, password: '' }));
        }

        if (!regex.test(loginUser.email)) {
            setformErrors((formErrors) => ({ ...formErrors, email: 'Email is not valid' }));
            isValid = false;
        } else {
            setformErrors((formErrors) => ({ ...formErrors, email: '' }));
        }

        return isValid;
    };

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setloginUser((currentloginUser) => ({ ...currentloginUser, [name]: value }));
            console.log(loginUser);
        },
        [loginUser],
    );

    const handleSumbit = (e) => {
        e.preventDefault();

        const result = validate();
        if (result) {
            setformErrors((formErrors) => ({ ...formErrors, err: null }));
            const userData = {
                email: loginUser.email,
                password: loginUser.password,
            };
            axios
                .post('https://localhost:44344/api/authenticate', userData)
                .then((res) => {
                    const token = res.data;
                    SetToken(token);
                    var decodeToken = jwt_decode(token);
                    _AuthContext.setUserData(decodeToken, token);
                    history.push('/HomePage');
                    enqueueSnackbar('You have successfully logged in!', { variant: 'success' });
                })
                .catch((res) => {
                    console.log(res);
                    setformErrors((formErrors) => ({ ...formErrors, err: res.response.data }));
                });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <form className={classes.form} noValidate>
                    {formErrors.err && <Alert severity="error">{formErrors.err}</Alert>}
                    <TextField
                        error={formErrors.email}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                        onChange={handleChange}
                        value={loginUser.email}
                        helperText={formErrors.email}
                    />
                    <TextField
                        error={formErrors.password}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={handleChange}
                        value={loginUser.password}
                        helperText={formErrors.password}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSumbit}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </Container>
    );
}

export default Authenticate;
