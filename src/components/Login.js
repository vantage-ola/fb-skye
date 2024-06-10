import React, { useState, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';
import FacebookDetails from '../data/myFB.json';
import InstagramDetails from '../data/myIG.json';

const Login = () => {

    const APP_ID = process.env.REACT_APP_FB_ID;
    const [user, setUser] = useState(() => {

        //retrieve user data from localstorage if it exists
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : {};
    });
    const [pages, setPages] = useState(FacebookDetails);
    const [selectedPage, setSelectedPage] = useState(null);
    const [instagramData, setInstagramData] = useState(InstagramDetails.data);

    const responseFB = (resp) => {
        if (resp?.status === "unknown") {
            console.log("sorry!, fb login not working");
            return;
        }
        const userData = {
            name: resp.name,
            email: resp.email,
            picture: resp.picture.data.url,
        };
        setUser({ userData })
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

                    <div>
                        <img src={user.picture} alt={user.name} />
                        <p>Welcome, {user.name}</p>
                        <p>Email: {user.email}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </div>

                    <div>
                        <h2>{user.name}'s FB PAGES </h2>

                        <div className='pages-container'>
                            <ul className='pages-list'>
                                {pages.map((page, index) => (
                                    <li key={index} onClick={() => setSelectedPage(page)}>
                                        <img src={page.image} alt={page.image_alt} width="50" />
                                        <span>{page.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {selectedPage && (
                            <div className="page-details">
                                <h3>{selectedPage.title}</h3>
                                <img src={selectedPage.image} alt={selectedPage.image_alt} />
                                <p><strong>About:</strong> {selectedPage.about_me_text}</p>
                                <p>{selectedPage.about_me_text_content}</p>
                                <p><strong>Category:</strong> {selectedPage.category.join(', ')}</p>
                                <p><strong>Description:</strong> {selectedPage.description}</p>
                                <p><strong>Followers:</strong> {selectedPage.followers_count}</p>
                                <p><strong>Likes:</strong> {selectedPage.likes_count}</p>
                                {selectedPage.address && <p><strong>Address:</strong> {selectedPage.address}</p>}
                                {selectedPage.phone && <p><strong>Phone:</strong> {selectedPage.phone}</p>}
                                {selectedPage.email && <p><strong>Email:</strong> {selectedPage.email}</p>}
                                {selectedPage.website && <p><strong>Website:</strong> <a href={selectedPage.website} target="_blank" rel="noopener noreferrer">{selectedPage.website}</a></p>}
                                {selectedPage.url && <p><strong>Facebook URL:</strong> <a href={selectedPage.url} target="_blank" rel="noopener noreferrer">{selectedPage.url}</a></p>}
                                {selectedPage.rating && <p><strong>Rating:</strong> {selectedPage.rating} (based on {selectedPage.rating_count} reviews)</p>}
                            </div>
                        )}
                    </div>
                    <div>
                        <h2>{user.name}'s Instagram</h2>
                        <div className="instagram-details">
                            <img src={instagramData.hd_profile_pic_url_info.url} alt={instagramData.full_name} width="100" />
                            <p><strong>Username:</strong> {instagramData.username}</p>
                            <p><strong>Full Name:</strong> {instagramData.full_name}</p>
                            <p><strong>Bio:</strong> {instagramData.biography}</p>
                            <p><strong>Category:</strong> {instagramData.category}</p>
                            <p><strong>Followers:</strong> {instagramData.follower_count}</p>
                            <p><strong>Following:</strong> {instagramData.following_count}</p>
                            <p><strong>Media Count:</strong> {instagramData.media_count}</p>
                            {instagramData.external_url && <p><strong>Website:</strong> <a href={instagramData.external_url} target="_blank" rel="noopener noreferrer">{instagramData.external_url}</a></p>}
                        </div>
                    </div>
                </div>
            ) : (
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