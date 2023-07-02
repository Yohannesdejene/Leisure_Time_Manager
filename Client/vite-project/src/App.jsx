import { useState, useEffect } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Recommend from "./Pages/Recommend";
import Profile from "./Pages/Profile";
import CreatePost from "./Pages/CreatePost";
import EnterProduct from "./Pages/EnterProduct";
import NavBar from "./Pages/NavBar";
import axios from "axios";

function App() {
  const [loggedin, setLoggedin] = useState(false);
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/profile", {
        withCredentials: true,
      })
      .then((response) => {
        // console.log("fetched data", response.data);
        const data = response.data;
        setProfile(data);
        setLoggedin(true);
      })
      .catch((err) => {
        setLoggedin(false);
      });
  }, []);

  return (
    <>
      <BrowserRouter>
        <NavBar loggedinData={loggedin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommend" element={<Recommend />} />
          {loggedin && (
            <>
              <Route path="/" element={<Home />} />
              {/* <Route path="/recommend" element={<Recommend />} /> */}
              <Route
                path="/profile"
                element={<Profile loggedin={loggedin} profile={profile} />}
              />
              <Route path="/createPost" element={<CreatePost />} />
              <Route path="/enterproduct" element={<EnterProduct />} />
            </>
          )}
          {!loggedin && (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/recommend" element={<Login />} />
              <Route path="/profile" element={<Login />} />
              <Route path="/createPost" element={<Login />} />
              <Route path="/enterproduct" element={<Login />} />
            </>
          )}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
