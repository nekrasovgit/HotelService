import React, { useState, useCallback } from 'react';
import axios from 'axios';

function Authenticate() {
    const [loginUser, setloginUser] = useState({
        firstname: '',
        email: '',
        password: '',
    });

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setloginUser((currentloginUser) => ({ ...currentloginUser, [name]: value }));
            console.log(loginUser);
        },
        [loginUser],
    );

    const handleSumbit = useCallback( e => {
      e.preventDefault();
      const userData = {
        firstname: loginUser.firstname,
        email: loginUser.email,
        password: loginUser.password
      };
      axios.post("https://localhost:44344/api/authenticate", userData)
    }, [loginUser]);

    return (
        <form onSubmit={handleSumbit}>
            <h1>Sign Up For An Account</h1>
            <label>First Name</label>
            <input
                name="firstname"
                placeholder="Firstname"
                value={loginUser.firstname}
                onChange={handleChange}
            />
            <br />
            <label>Email</label>
            <input
                name="email"
                placeholder="Email"
                value={loginUser.email}
                onChange={handleChange}
            />
            <br />
            <label>Password</label>
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginUser.password}
                onChange={handleChange}
            />
            <br />
            <input type="submit" />
        </form>
    );
}

export default Authenticate;
