import React, { useState, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';

const Login = () =>  {
    
    const APP_ID = process.env.REACT_APP_FB_ID;
    const [user, setUser] = useState(() => {
        
        //retrieve user data from localstorage if it exists
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : {};
    });

    const responseFB = (resp) => {
        if (resp?.status === "unknown"){
            console.log("sorry!, fb login not working");
            return;
        }
        const userData = {
            name: resp.name,
            email: resp.email,
            picture: resp.picture.data.url,
        };
        setUser({userData})
        //save user data reposne to localStorage.
        localStorage.setItem('user', JSON.stringify(userData))
        //console.log(resp)
    }

    const handleLogout = () => {
        // clear user data from state and localStorage.
        setUser({});
        localStorage.removeItem('user')
    }
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [user]);
    return (
        <div className='login'>
            
            {user.name ? (
                <div>
                    <img src={user.picture} alt={user.name}/>
                    <p>Welcome, {user.name}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>

            ): (
                <FacebookLogin
                    appId={APP_ID}
                    autoLoad={false}
                    fields="name, email, picture"
                    callback={responseFB}
                />
            )}
        </div>
    );
}

export default Login;