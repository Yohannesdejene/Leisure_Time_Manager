import NavBar from "./NavBar";
import Footer from "./Footer";
import { styled } from "@mui/material/styles";
import { react, useState, useReducer, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Divider,
  Button,
  IconButton,
  Link,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

// import Category from "./Category/Category";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";

// import axios from "axios";

export default function Profile(props) {
  const [loggedin, setLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState([]);

  const { profile } = props;
  useEffect(() => {
    setProfileData(profile);
  }, []);

  const navigate = useNavigate();
  // console.log("profile page", profileData);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/custom/profile", {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       setLoggedIn(true);
  //       dispatch({ type: "SET_PROFILE_DATA", payload: response.data });
  //       dispatch({ type: "SET_EDITED_PROFILE_DATA", payload: response.data });
  //       console.log("fetched data", response.data);
  //     })
  //     .catch((err) => {
  //       console.group("errrrr", err);
  //       navigate("/login");
  //       setLoggedIn(false);
  //       console.log("heyy", loggedin);
  //       if (err.response.status === 403) {
  //         console.log("errr r");
  //       }
  //       saving(false);
  //     });
  // }, []);

  return (
    <div>
      {/* {state.data.fname} */}
      <Box my={5}>
        {/* <Category /> */}

        <Box className="backtoHome">
          <NavLink to="/">
            <IconButton
              // color="inherit"
              sx={{ color: "red" }}
            >
              <ChevronLeftOutlinedIcon />

              <Typography> Back to auctions</Typography>
            </IconButton>
          </NavLink>
        </Box>
        <Box
          className="profile"
          my={5}
          sx={{
            alignItems: "center",

            marginLeft: {
              lg: "100px",
              md: "90px",
              sm: "30px",
              xs: "15px",
            },
            marginRight: {
              lg: "100px",
              md: "90px",
              sm: "30px",
              xs: "15px",
            },
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography my={2} sx={{ marginLeft: "10px" }}>
              {" "}
              Account info
            </Typography>
            <Button
              sx={{
                height: "50px",
                fontSize: "5px",
                textTransform: "unset",
                alignItems: "center",
                justify: "center",
                textAlign: "Center",
                marginLeft: {
                  xs: "60px",
                  sm: "200px",
                  md: "300px",
                  lg: "300px",
                },
              }}
            ></Button>
          </Box>
          <Divider />
          <Box
            className="name"
            my={4}
            sx={{
              diplay: {
                lg: "flex",
                md: "flex",
                sm: "block",
                xs: "block",
              },
            }}
          >
            <TextField
              sx={{
                margin: "10px",
                color: "red",
                width: {
                  lg: 245,
                  md: 260,
                  sm: 200,
                  xs: 200,
                },
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
              value={profileData.fname}
              // label="First name"
              // placeholder={state.profileData.fname}
              // disabled={true}
            />

            <TextField
              sx={{
                margin: "10px",

                width: {
                  lg: 245,
                  md: 260,
                  sm: 200,
                  xs: 200,
                },
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
              variant="outlined"
              value={profileData.lname}
              // label="Last Name"
            />
          </Box>
          <Box className="email">
            <TextField
              sx={{
                marginLeft: "10px",
                marginRight: "10px",

                width: {
                  lg: 510,
                  md: 540,
                  sm: 420,
                  xs: 250,
                },
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
              variant="outlined"
              value={profileData.email}
              // label="Email"
            />
          </Box>
          <Box className="phone">
            <TextField
              sx={{
                marginLeft: "10px",
                marginRight: "10px",

                marginTop: "20px",
                width: {
                  lg: 510,
                  md: 540,
                  sm: 420,
                  xs: 250,
                },
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
              variant="outlined"
              value={profileData.phonenumber}
              // label="Phone number"
            />
          </Box>
          <Box className="City">
            <TextField
              sx={{
                marginLeft: "10px",
                marginRight: "10px",

                marginTop: "20px",
                width: {
                  lg: 510,
                  md: 540,
                  sm: 420,
                  xs: 250,
                },
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
              variant="outlined"
              value={profileData.location}
              label="City"
            />
          </Box>
        </Box>
      </Box>
      <Divider />
      <Footer />
    </div>
  );
}
