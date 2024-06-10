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
    const pages = FacebookDetails;
    const [selectedPage, setSelectedPage] = useState(null);
    const instagramData = InstagramDetails.data;
    
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

        window.location.href = window.location.href; // automatically reload after logging in current page. hotfix for Warning: Maximum update depth exceeded on the console.
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
  }, []);


    return (
<>
  {user.name ? (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-6">
        <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full mr-4" />
        <div className="flex-1">
          <p className="text-lg font-bold">Welcome, {user.name}</p>
          <p className="text-gray-600">Email: {user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{user.name}'s FB Pages</h2>
        <div className="overflow-y-auto max-h-64">
          <ul className="divide-y divide-gray-200">
            {pages.map((page, index) => (
              <li
                key={index}
                onClick={() => setSelectedPage(page)}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded transition duration-200"
              >
                <img src={page.image} alt={page.image_alt} className="w-10 h-10 rounded-full mr-4" />
                <span>{page.title}</span>
              </li>
            ))}
          </ul>
        </div>
        {selectedPage && (
          <div className="mt-6 p-6 border-t border-gray-200">
            <h3 className="text-lg font-bold mb-4">{selectedPage.title}</h3>
            <img src={selectedPage.image} alt={selectedPage.image_alt} className="w-full max-w-md mx-auto my-4 rounded-lg" />
            <p className="mb-2"><strong>About:</strong> {selectedPage.about_me_text}</p>
            <p className="mb-2">{selectedPage.about_me_text_content}</p>
            <p className="mb-2"><strong>Category:</strong> {selectedPage.category.join(', ')}</p>
            <p className="mb-2"><strong>Description:</strong> {selectedPage.description}</p>
            <p className="mb-2"><strong>Followers:</strong> {selectedPage.followers_count}</p>
            <p className="mb-2"><strong>Likes:</strong> {selectedPage.likes_count}</p>
            {selectedPage.address && <p className="mb-2"><strong>Address:</strong> {selectedPage.address}</p>}
            {selectedPage.phone && <p className="mb-2"><strong>Phone:</strong> <a href={`tel:${selectedPage.phone}`} className="text-green-400 underline">{selectedPage.phone}</a></p>}
            {selectedPage.email && <p className="mb-2"><strong>Email:</strong> {selectedPage.email}</p>}
            {selectedPage.website && <p className="mb-2"><strong>Website:</strong> <a href={selectedPage.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{selectedPage.website}</a></p>}
            {selectedPage.url && <p className="mb-2"><strong>Facebook URL:</strong> <a href={selectedPage.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{selectedPage.url}</a></p>}
            {selectedPage.rating && <p className="mb-2"><strong>Rating:</strong> {selectedPage.rating} (based on {selectedPage.rating_count} reviews)</p>}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">{user.name}'s Instagram</h2>
        <div className="p-6 border-t border-gray-200">
          <img src={instagramData.hd_profile_pic_url_info.url} alt={instagramData.full_name} className="w-24 h-24 rounded-full mx-auto my-4" />
          <p className="mb-2"><strong>Username:</strong> {instagramData.username}</p>
          <p className="mb-2"><strong>Full Name:</strong> {instagramData.full_name}</p>
          <p className="mb-2"><strong>Bio:</strong> {instagramData.biography}</p>
          <p className="mb-2"><strong>Category:</strong> {instagramData.category}</p>
          <p className="mb-2"><strong>Followers:</strong> {instagramData.follower_count}</p>
          <p className="mb-2"><strong>Following:</strong> {instagramData.following_count}</p>
          <p className="mb-2"><strong>Media Count:</strong> {instagramData.media_count}</p>
          {instagramData.external_url && <p className="mb-2"><strong>Website:</strong> <a href={instagramData.external_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{instagramData.external_url}</a></p>}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <FacebookLogin
        appId={APP_ID}
        autoLoad={false}
        fields="name, email, picture"
        callback={responseFB}
        cssClass="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
      />
    </div>
  )}
</>

    );
}

export default Login;