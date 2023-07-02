import { useState, useEffect, useReducer } from "react";
import {
  Stack,
  Box,
  Button,
  List,
  Link,
  ListItem,
  IconButton,
  LinearProgress,
  Typography,
  Divider,
  InputLabel,
  MenuItem,
  Menu,
  Tooltip,
  AppBar,
  Toolbar,
} from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function NavBar(props) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notify, setNotify] = useState(null);
  const [account, setAccount] = useState(null);
  const [loggedin, setLoggedin] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const { loggedinData } = props;
  ////login
  console.log("in nav login", loggedin);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccount = (event) => {
    setAccount(event.currentTarget);
  };

  const handleLogout = () => {
    console.log("in the logout");
    navigate("/login");
    // axios
    //   .post("http://localhost:5000/logout")
    //   .then((reponse) => {
    //     console.log("logout response", reponse);
    //     navigate("/sel/login");
    //   })
    //   .catch((err) => {
    //     navigate("/sel/login");
    //     console.log("logout errrio ", err);
    //   });
  };
  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{ marginTop: "5px" }}
    >
      <MenuItem onClick={handleMenuClose}>
        <Box>
          <NavLink to="/profile">
            <Typography>My profile</Typography>
          </NavLink>
        </Box>
      </MenuItem>

      <Divider />

      <MenuItem onClick={handleMenuClose}>
        <Button onClick={handleLogout}>
          <IconButton
            // color="inherit"
            sx={{ color: "#081263 " }}
          >
            <LogoutIcon sx={{ color: "black" }} />
            <Typography sx={{ margin: "8px" }}>Logout</Typography>
          </IconButton>
        </Button>
      </MenuItem>
    </Menu>
  );

  console.log("profileData", profileData);
  useEffect(() => {
    axios
      .get("http://localhost:3000/profile", {
        withCredentials: true,
      })
      .then((response) => {
        // console.log("fetched data", response.data);
        const data = response.data;
        console.log("loggedin in");
        setLoggedin(true);
      })
      .catch((err) => {
        setLoggedin(false);
      });
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={1} sx={{ backgroundColor: "white " }}>
        <Box
          sx={{
            // height: "15px",
            // marginTop: "30px",

            textAlign: "center",
            alignItems: "center",
            width: "auto",
            display: {
              lg: "flex",
              md: "flex",
              sm: "flex",
              xs: "flex",
            },
          }}
        >
          {/* <img src="air.jpg" alt="images_place" /> */}
          <Box
            sx={{
              textAlign: "center",
              alignItems: "center",
              width: "auto",
              ml: {
                lg: "40px",
                md: "30px",
                sm: "20px",
                xs: "8px",
              },
              display: {
                lg: "flex",
                md: "flex",
                sm: "flex",
                xs: "flex",
              },
            }}
          >
            <Box>
              <img
                src="/logo2.png"
                width="40px"
                height={"60px"}
                style={{ width: "40px", margin: "6px 10px " }}
              />
            </Box>
            <Typography
              sx={{
                marginLeft: {
                  lg: "10px",
                  md: "10px",
                  sm: "8px",
                  xs: "0px",
                },
                fontWeight: "800",
                color: "brown",
              }}
            >
              {" "}
              FunFinder
            </Typography>
          </Box>
          <Box
            className="registration"
            sx={{
              display: "flex",
              marginLeft: "auto",
            }}
          >
            <Box sx={{ display: "flex", gap: "17px", mr: "25px" }}>
              {loggedin && (
                <>
                  {" "}
                  <Link href="/">
                    {" "}
                    <Typography sx={{ color: "black" }}>Home</Typography>
                  </Link>
                </>
              )}

              {!loggedin && (
                <>
                  {" "}
                  <Link href="/signup">
                    {" "}
                    <Typography sx={{ color: "black" }}>Signup</Typography>
                  </Link>
                  <Link href="/login">
                    {" "}
                    <Typography sx={{ color: "black" }}>Login</Typography>
                  </Link>
                </>
              )}
            </Box>
          </Box>
          {loggedin && (
            <>
              {" "}
              <Box sx={{ float: "right", marginRight: "20px" }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  // aria-controls={menuId}
                  // aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle sx={{ color: "black" }} />
                  <Typography
                    sx={{
                      fontFamily: "Monospace",
                      fontWieght: "900",
                      display: { xs: "none", md: "flex", color: "black" },
                    }}
                  >
                    {" "}
                    {/* {state &&  state.data.fname} */}
                    {/* {state !== null ? <>{state.data.fname}</> : <>Profile</>} */}
                    {/* {"Profile"} */}
                    Profile
                  </Typography>
                </IconButton>
              </Box>
            </>
          )}
        </Box>

        {/* <Divider /> */}
      </AppBar>
      {renderMenu}
    </Box>
  );
}
