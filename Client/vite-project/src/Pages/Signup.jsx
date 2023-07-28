import { useState, useRef, useEffect } from "react";

import {
  TextField,
  Box,
  Button,
  LinearProgress,
  Link,
  Typography,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as React from "react";

import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import AlbumIcon from "@mui/icons-material/Album";
import Checkbox from "@mui/material/Checkbox";
import { FormControl } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const baseUri = axios.create({
  baseURL: "http://localhost:3000/",
});
function BuyerForm() {
  const [state, setState] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmpassword: "",
    phonenumber: "",
    location: "",
    image: null,
    imageUrls: null,
    formData: new FormData(),
  });

  const [errmessage, seterrmessage] = useState("");
  const [loading, setloading] = useState(false);
  const nav = useNavigate();
  function isValidPhoneNumber(phoneNumber) {
    const regex = /^(09|07)\d{8}$/;
    return regex.test(phoneNumber);
  }
  function isValidPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(password);
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    const url = URL.createObjectURL(file);

    setState((prevState) => ({
      ...prevState,
      image: file,
      imageUrls: url,
    }));
  };
  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitFormBuyer = (event) => {
    event.preventDefault();
    setloading(true);
    let validphone = isValidPhoneNumber(state.phonenumber);
    let validpassword = isValidPassword(state.password);
    if (!validpassword) {
      seterrmessage(
        "Password length must be greater than 6 and must contain digits and letters"
      );
      setloading(false);
      return;
    }
    if (!validphone) {
      seterrmessage("Enter a valid phonenumber");
      setloading(false);
      return;
    }

    if (state.password !== state.confirmpassword) {
      seterrmessage("Password don't match");
      setloading(false);
      return;
    }

    const { fname, lname, email, phonenumber, password, location, image } =
      state;
    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("email", email);
    formData.append("phonenumber", phonenumber);
    formData.append("password", password);
    formData.append("location", location);
    formData.append("image", image);
    console.log("formdata", formData.get("phonenumber"));
    if (
      validphone &&
      validpassword &&
      state.password == state.confirmpassword &&
      state.lname != "" &&
      state.fname != ""
    ) {
      baseUri
        .post("/signup", formData)
        .then((res) => {
          setloading(false);
          if (res.status == 200) {
            seterrmessage("Registration succesfful redirecting....");
            setTimeout(() => {
              nav("/");
            }, 2000);
          } else if (res.status == 400) {
            seterrmessage(
              "It looks like you have already an account, try login"
            );
          } else {
            seterrmessage(
              "It looks like you have already an account, try login"
            );
          }
        })
        .catch((err) => {
          setloading(false);
          if (err.response.status == 304) {
            seterrmessage(
              "It looks like you have already an account, try login"
            );
          } else if (err.response.status == 500) {
            seterrmessage(
              "It looks like you have already an account, try login"
            );
          } else {
            console.log("The error is ", err);
            seterrmessage("Network error ");
          }
        });
    }
  };
  return (
    <Box
      sx={{
        position: "absolute",
        backgroundColor: "white",
        zIndex: "2",
        marginLeft: {
          lg: "25%",
          md: "25%",
          sm: "7%",
          xs: "7%",
        },

        marginRight: "30px",
        marginBottom: "-30%",
        top: "20%",

        width: {
          lg: "50%",
          md: "50%",
          sm: "83%",
          xs: "83%",
        },
      }}
    >
      <div
        style={{
          border: "1px gray solid",
          borderRadius: "30px",
          padding: "20px",
        }}
      >
        <form onSubmit={submitFormBuyer}>
          <center>
            <Typography
              sx={{
                color: "black",
                marginTop: "20px",
                fontSize: {
                  lg: "30px",
                  md: "30px",
                  sm: "25px",
                  xs: "25px",
                },

                fontFamily:
                  "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
              }}
            >
              {" "}
              Sign up and Never be bored again
            </Typography>
          </center>
          <br />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "red" }}>{errmessage}</span>
            <Stack
              gap={2}
              direction={{ sm: "column", xs: "column", lg: "row", md: "row" }}
              sx={{ width: "100%" }}
            >
              <TextField
                value={state.fname}
                onChange={handleTextChange}
                name="fname"
                label="First Name"
                variant="standard"
                sx={{
                  margin: "5px",
                  width: { sm: "47%", xs: "96%", lg: "96%", md: "47%" },
                }}
                required
              />
              <TextField
                value={state.lname}
                onChange={handleTextChange}
                name="lname"
                label="Last Name"
                variant="standard"
                sx={{
                  margin: "5px",
                  width: { sm: "47%", xs: "96%", lg: "96%", md: "47%" },
                }}
                required
              />
            </Stack>
            <TextField
              value={state.email}
              onChange={handleTextChange}
              name="email"
              label="Email"
              variant="standard"
              sx={{ margin: "5px" }}
              required
              type="email"
            />

            <TextField
              value={state.phonenumber}
              onChange={handleTextChange}
              name="phonenumber"
              label="Phone Number"
              variant="standard"
              sx={{ margin: "5px" }}
              required
              type="text"
            />

            <TextField
              value={state.password}
              onChange={handleTextChange}
              name="password"
              label="Password"
              variant="standard"
              sx={{ margin: "5px" }}
              required
              type="password"
            />
            {/* <span style={{ color: "red" }}>{formErrorsSeller.password}</span> */}
            <TextField
              value={state.confirmpassword}
              onChange={handleTextChange}
              name="confirmpassword"
              label="Confirm Password"
              variant="standard"
              sx={{ margin: "5px" }}
              required
              type="password"
            />
            <TextField
              value={state.location}
              onChange={handleTextChange}
              name="location"
              label="Location"
              variant="standard"
              sx={{ margin: "5px" }}
              required
              type="text"
            />

            <Box>
              {state.imageUrls && (
                <img
                  src={state.imageUrls}
                  style={{ width: "60px", height: "60px" }}
                />
              )}
            </Box>

            <Button variant="contained" component="label">
              Upload Image
              <input
                id="image"
                type="file"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>
          <Box>
            <Typography sx={{ color: "red", marginTop: "30px" }}>
              {/* {responseSeller} */}
            </Typography>
          </Box>
          <span></span>
          <Box
            sx={{
              alignItems: "center",
              justify: "center",
              textAlign: "Center",
              backgroundColor: "red",
              marginTop: "30px",
            }}
          >
            <Button
              type="submit"
              disabled={loading}
              sx={{
                fontSize: "20px",
                textTransform: "unset",
                color: "white",
              }}
              //   disabled={savingSeller}
            >
              {loading ? "Saving..." : "Create my account"}
            </Button>
          </Box>
          <center>
            <p>
              Already have an account ?
              <b>
                <a
                  href="/login"
                  style={{
                    color: "brown",
                    textDecoration: "none",
                    fontFamily: "serif",
                    marginLeft: "10px",
                  }}
                  underline="none"
                >
                  Login
                </a>
              </b>
            </p>
          </center>
        </form>
      </div>
      <br /> <br />
    </Box>
  );
}

const SignUp = () => {
  const [type, settype] = useState(0);
  // 1 type=1 for bidder
  // 2 type=2 for seller
  // 0 type=0for not selected yet

  useEffect(() => {
    settype(0);
  }, []);
  return (
    <>
      {/* <NavBar /> */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          backgroundColor: "white",
          height: "100%",
        }}
      >
        <br />

        {/* <div style={{
                width: "20px",
                marginTop:"15%",
                marginLeft:"50%",
                height:"60%",
                transform: "rotate(45deg)",
                // transformOrigin: "left bottom",
                backgroundColor: "brown"
            }}></div> */}

        <BuyerForm />
      </div>
    </>
  );
};
export default SignUp;
