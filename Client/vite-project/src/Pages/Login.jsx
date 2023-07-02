import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Box,
  Button,
  LinearProgress,
  Link,
  Typography,
} from "@mui/material";
import { redirect, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const baseUri = axios.create({
  baseURL: "http://localhost:3000/",
});

const Login = () => {
  const [message, setmessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const loginSubmit = (event) => {
    event.preventDefault();
    console.log(email);
    console.log(password);

    setloading(true);
    baseUri
      .post("/login", { email, password }, { withCredentials: true })
      .then((response) => {
        setloading(false);
        console.log("response", response);
        if (response.status === 200) {
          console.log("The response is ", response);
          setmessage("Successfully Logged in redirecting.....");
          navigate("/");
          // setTimeout(() => {

          // }, 2000);
        } else {
          setmessage("username or password error");
        }
      })
      .catch((err) => {
        setloading(false);
        setmessage("Error email or password");
        console.log("The error is ", err);
      });
  };
  return (
    <>
      {/* <NavBar /> */}

      <div
        style={{
          position: "relative",
          width: "100%",
          backgroundColor: "white",
          height: "100%",
          mt: "200px",
        }}
      >
        <br />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            // top: "25%",
            mt: "150px",
            height: "60%",
            backgroundColor: "white",
            left: {
              sm: "30%",
              xs: "8%",
              ms: "30%",
              lg: "30%",
            },
            width: {
              xs: "90%",
              sm: "40%",
              ms: "40%",
              lg: "40%",
            },
          }}
        >
          <h2
            style={{
              // left: "5%",
              marginLeft: "40px",
              ml: "10%",
              fontFamily: "serif",
            }}
          >
            Welcome Back,
          </h2>

          <p
            style={{
              position: "relative",
              top: "16%",
              color: "red",
              left: "25%",
              width: "72%",
            }}
          >
            {message}
          </p>
          {loading && (
            <LinearProgress
              sx={{
                position: "relative",
                top: "22%",
                color: "white",
                left: "30%",
                width: "20%",
              }}
            />
          )}
          <form onSubmit={loginSubmit}>
            <input
              required
              placeholder="username"
              onChange={(e) => {
                setEmail(e.target.value);
                setmessage("");
              }}
              type="email"
              style={{
                position: "relative",
                width: "70%",
                height: "35px",
                top: "25%",
                left: "8%",
                padding: "5px",
                border: "1px gray solid",
              }}
            />
            <br /> <br />
            <input
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setmessage("");
              }}
              placeholder="password"
              type="password"
              style={{
                position: "relative",
                width: "70%",
                height: "35px",
                top: "39%",
                left: "8%",
                padding: "5px",
                border: "1px gray solid",
              }}
            />
            <Button
              style={{
                position: "relative",
                top: "30px",
                left: "8%",
                width: "72%",
              }}
              variant="contained"
              color="error"
              type="submit"
            >
              Login
            </Button>
          </form>
          <div
            style={{
              position: "relative",
              // bottom: "25%",

              left: "10%",
              top: "50px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Link underline="none" sx={{ color: "gray", fontSize: "16px" }}>
              Do you have an account ?
            </Link>
            <Link
              href="/signup"
              underline="none"
              sx={{
                marginLeft: "10px",
                color: " #92291C  ",
                fontSize: "17px",
                ":hover": { color: "green", cursor: "pointer" },
              }}
            >
              Sign Up For Free
            </Link>
          </div>
        </Box>
      </div>
    </>
  );
};
export default Login;
