import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Divider,
  Button,
  IconButton,
  Paper,
  CardMedia,
  Card,
  Link,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import PropTypes from "prop-types";

import axios from "axios";
import NavBar from "./NavBar";
const add = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },

  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          // sx={{
          //   position: 'absolute',
          //   right: 8,
          //   top: 8,
          //   // color: (theme) => theme.palette.grey[500],
          // }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0"); // Get the day and pad it with leading zeros if necessary
  const monthIndex = date.getMonth(); // Get the month index
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]; // Define an array of month names
  const monthName = monthNames[monthIndex]; // Get the month name using the month index
  return `${day} ${monthName}`; // Return the formatted date string with day and month name
}
function Recommend() {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [isPriceEmpty, setIsPriceEmpty] = useState(true);
  const [recommend, setRecommend] = useState([]);
  //////comment
  const [showComment, setShowComment] = useState(Array(100).fill(false));
  const [comments, setComments] = useState(Array(10).fill(""));
  const [commentText, setCommentText] = useState("");
  const [isCommentEmpty, setIsCommentEmpty] = useState(true);

  const [result, setResult] = useState([]);
  const [noofResult, setnofResult] = useState(1);

  const [loggedinData, setLoggedinData] = useState([]);
  const [loggedin, setLoggedin] = useState(false);

  const handleRecommend = (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      axios
        .post("http://localhost:3000/recommend", {
          money: price,
        })
        .then((response) => {
          const data = response.data;
          setRecommend(data);
          console.log("rocomended done", response.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log("err in submiting commetn", err);
        });
    } catch (err) {
      setLoading(false);
      console.log("Error", err);
    }
  };
  console.log("recomend", recommend);

  const handleCloseComment = async (productId, productIndex) => {
    setShowComment((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[productIndex] = !updatedArray[productIndex];
      return updatedArray;
    });
  };
  const handleDisplayComment = async (productId, productIndex) => {
    setShowComment((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[productIndex] = !updatedArray[productIndex];
      return updatedArray;
    });
    try {
      axios
        .get("http://localhost:3000/commentonproduct", {
          params: {
            productId: productId,
            page: 1,
          },
        })
        .then((response) => {
          setComments(response.data.rows);
          console.log("comments", response.data);
        })
        .catch((err) => {
          console.log("erro fetching commetn", err);
        });
    } catch (errr) {
      console.log("errr in catching", errr);
    }
  };
  const handleSubmitComment = async (productId, productIndex) => {
    try {
      axios
        .post(
          "http://localhost:3000/commentonproduct",
          {
            productId: productId,
            text: commentText,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log("comments done", response.data);
          setCommentText("");
        })
        .catch((err) => {
          console.log("err in submiting commetn", err);
        });
    } catch (errr) {
      console.log("errr in catching", errr);
    }
  };
  console.log("comments", comments);

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
        setLoggedinData(data);
      })
      .catch((err) => {
        setLoggedin(false);
      });
  }, []);
  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          mt: "100px",
          ml: "30px",
        }}
      >
        {loggedin && (
          <>
            <Box sx={{ padding: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TextField
                  label="How much do you have in Birr?"
                  required
                  type="number"
                  value={price}
                  onChange={(event) => {
                    setPrice(event.target.value);
                    setIsPriceEmpty(event.target.value.trim() === "");
                  }}
                />
                <br />
                <Button
                  type="submit"
                  sx={{
                    color: "red",
                    border: "1px solid black",
                    mt: "10px",
                    backgroundColor: "white",

                    "&[disabled]": {
                      color: "red", // set the color of the button text when disabled
                      backgroundColor: "lightgray", // set the background color of the button when disabled
                    },
                  }}
                  disabled={isPriceEmpty || loading}
                  onClick={handleRecommend}
                >
                  {loading ? (
                    <>
                      {" "}
                      <CircularProgress /> searching
                    </>
                  ) : (
                    <>Recomend Me Place</>
                  )}
                </Button>
                <br />
              </Box>

              {recommend && recommend.recommendedProducts && (
                <>
                  {recommend.recommendedProducts.length == 0 && (
                    <p style={{ display: "flex" }}>
                      Sorry We have nothing to recommend you for this amount of
                      money
                    </p>
                  )}
                  {recommend.recommendedProducts.length > 0 && (
                    <>
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          color: "blue",
                          mt: "20px",
                        }}
                      >
                        Places we recommend for this Money with total of{" "}
                        <span style={{ color: "red", marginLeft: "10px" }}>
                          ETB: {recommend.totalRecommendedPrice}
                        </span>
                      </Typography>

                      {recommend.recommendedProducts.map(
                        (product, productIndex) => {
                          return (
                            <>
                              <Box
                                className="container"
                                sx={{
                                  marginTop: "10px",
                                  border: "1px solid #E0DFDF",
                                  // ml: {
                                  //   lg: "40%",
                                  //   md: "20%",
                                  //   sm: "15%",
                                  //   xs: "10%",
                                  // },
                                  // mr: {
                                  //   md: "20%",
                                  //   sm: "15%",
                                  //   xs: "10%",
                                  // },
                                  width: {
                                    lg: "600px",
                                    md: "600px",
                                    sm: "500px",
                                    xs: "300px",
                                  },
                                  padding: "10px",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    mt: "5px",
                                    mb: "20px",
                                  }}
                                >
                                  <Typography sx={{ color: "black" }}>
                                    You can enjoy this
                                    <span>
                                      {" "}
                                      {product.productName}{" "}
                                    </span>from {product.place.name}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: "flex", mt: "20px" }}>
                                  <Typography
                                    sx={{
                                      fontWeight: "bold",
                                      mt: "10px",
                                      ml: "5px",
                                    }}
                                  >
                                    {product.place.name}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex" }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      //   width: "100%",
                                      justifyContent: "center",
                                      flexDirection: "column",
                                      width: "50%",
                                      // width: {
                                      //   lg: "500px",
                                      //   md: "500px",
                                      //   sm: "400px",
                                      //   xs: "250px",
                                      // },
                                    }}
                                  >
                                    <Paper sx={{ p: 2 }}>
                                      <img
                                        style={{ width: "100%" }}
                                        src={`http://localhost:3000/productimage/${
                                          // post.Pictures[postIndex].id
                                          product.id
                                        }`}
                                        alt="Post Image"
                                        sx={{ mb: 2 }}
                                      />
                                    </Paper>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      //   width: "100%",
                                      justifyContent: "center",
                                      flexDirection: "column",
                                      padding: "30px",
                                      width: "50%",
                                      // width: {
                                      //   lg: "500px",
                                      //   md: "500px",
                                      //   sm: "400px",
                                      //   xs: "250px",
                                      // },
                                    }}
                                  >
                                    <p>{product.productName}</p>
                                    <p>Price :ETB {product.price}</p>
                                    <p>Description:{product.description}</p>
                                  </Box>
                                </Box>
                                <Box sx={{ mt: "2px" }}>
                                  <p style={{ display: "flex" }}>
                                    <LocationOnIcon
                                      sx={{ ml: "5px", mr: "4px" }}
                                    />
                                    {product.place.location}
                                  </p>
                                </Box>
                                <Box className="commentBox">
                                  <Box sx={{ display: "flex", mb: "10px" }}>
                                    <TextField
                                      value={commentText}
                                      onChange={(event) => {
                                        setCommentText(event.target.value);
                                        setIsCommentEmpty(
                                          event.target.value.trim() === ""
                                        );
                                      }}
                                      type="text"
                                      placeholder="Put some review"
                                      InputProps={{
                                        style: {
                                          height: "35px", // adjust the value to decrease the height
                                        },
                                      }}
                                      sx={{
                                        width: {
                                          lg: "280px",
                                          md: "270px",
                                          sm: "265px",
                                          xs: "240px",
                                        },
                                        marginLeft: "10px",
                                      }}
                                      required
                                    />
                                    <Button
                                      type="submit"
                                      onClick={() => {
                                        handleSubmitComment(
                                          product.id,
                                          productIndex
                                        );
                                      }}
                                      sx={{
                                        color: "black",
                                        marginLeft: "5px",
                                        disabled: isCommentEmpty,
                                      }}
                                      disabled={isCommentEmpty}
                                    >
                                      <SendIcon />
                                    </Button>
                                  </Box>
                                  <Divider />
                                  <Box className="popUp">
                                    <Button
                                      // variant="outlined"
                                      onClick={() => {
                                        handleDisplayComment(
                                          product.id,
                                          productIndex
                                        );
                                      }}
                                      sx={{
                                        border: "none",
                                        // backgroundColor: "red",
                                        textTransform: "unset",

                                        // "&:hover": {
                                        //   backgroundColor: "red",
                                        //   color: "white",
                                        // },
                                      }}
                                    >
                                      Review Comments
                                    </Button>

                                    <Box>
                                      <BootstrapDialog
                                        // onClose={handleClosePost}
                                        onClose={() => {
                                          handleCloseComment(
                                            product.id,
                                            productIndex
                                          );
                                        }}
                                        aria-labelledby="customized-dialog-title"
                                        // open={openPost}
                                        open={showComment[productIndex]}
                                        className="custom-dialog"
                                        // sx={{ maxWidth: "800px" }}
                                      >
                                        <Box
                                          sx={{
                                            height: {
                                              lg: "70px",
                                              md: "100px",
                                              sm: "80px",
                                              xs: "100px",
                                            },
                                          }}
                                          onClose={() => {
                                            handleCloseComment(
                                              product.id,
                                              productIndex
                                            );
                                          }}
                                        >
                                          <IconButton
                                            sx={{ float: "right" }}
                                            onClick={() => {
                                              handleCloseComment(
                                                product.id,
                                                productIndex
                                              );
                                            }}
                                          >
                                            <CloseIcon />
                                          </IconButton>
                                          <Typography
                                            sx={{
                                              alignItem: "center",
                                              // float: "left",
                                              textAlign: "Center",

                                              marginTop: "20px",
                                              fontSize: "20px",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Comments
                                          </Typography>
                                        </Box>

                                        <DialogContent dividers>
                                          <Box
                                            sx={{
                                              // border: "1px solid black",
                                              width: {
                                                lg: "700px",
                                              },
                                              maxheight: "100vh",
                                              // padding: "10px",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "block",

                                                // justifyContent: "center",
                                              }}
                                            >
                                              {comments.length === 0 && (
                                                <p>No comments so far</p>
                                              )}
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  width: {
                                                    lg: "600px",
                                                  },
                                                  flexDirection: {
                                                    lg: "row",
                                                    md: "row",
                                                    sm: "column",
                                                    xs: "column",
                                                  },
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    width: "50%",
                                                    display: "flex",
                                                  }}
                                                >
                                                  {comments.length > 0 && (
                                                    <img
                                                      style={{
                                                        width: "100%",
                                                        height: {
                                                          lg: "300px",
                                                          md: "300px",
                                                          sm: "300px",
                                                          xs: "100px",
                                                        },
                                                      }}
                                                      src={`http://localhost:3000/productimage/${
                                                        // post.Pictures[postIndex].id
                                                        product.id
                                                      }`}
                                                      alt={`Post Image $}`}
                                                    />
                                                  )}
                                                </Box>
                                                <Divider />
                                                <Box
                                                  sx={{
                                                    // justifyContent: "center",
                                                    marginLeft: {
                                                      lg: "100px",
                                                      md: "100px",
                                                    },
                                                    width: {
                                                      lg: "50%",
                                                      md: "50%",
                                                      sm: "100%",
                                                      xs: "100%",
                                                    },
                                                  }}
                                                >
                                                  {comments.length > 0 &&
                                                    comments.map((comment) => {
                                                      return (
                                                        <>
                                                          <Box
                                                            sx={{
                                                              display: "flex",
                                                              // alignItem: "center",
                                                              ml: "15px",
                                                              padding: "10px",
                                                            }}
                                                          >
                                                            {comment.User &&
                                                              comment.User
                                                                .id && (
                                                                <Avatar
                                                                  alt="Travis Howard"
                                                                  style={{
                                                                    width:
                                                                      "37px",
                                                                    height:
                                                                      "37px",
                                                                  }}
                                                                  src={`http://localhost:3000/personimages/${comment.User.id}`}
                                                                />
                                                              )}
                                                            <p
                                                              style={{
                                                                ml: "10px",
                                                                marginTop:
                                                                  "10px",
                                                                marginLeft:
                                                                  "10px",
                                                              }}
                                                            >
                                                              {
                                                                comment.commentText
                                                              }
                                                            </p>
                                                          </Box>

                                                          <Divider />
                                                        </>
                                                      );
                                                    })}
                                                </Box>
                                              </Box>

                                              {/* <Button
                                                className="moreComment"
                                                onClick={() => {
                                                  handleMoreComment(
                                                    post.id,
                                                    postIndex
                                                  );
                                                }}
                                                sx={{ textTransform: "none" }}
                                              >
                                                See more comment
                                              </Button> */}
                                            </Box>
                                          </Box>
                                        </DialogContent>
                                      </BootstrapDialog>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </>
                          );
                        }
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </>
        )}
        {!loggedin && (
          <>
            <Box
              sx={{
                marginTop: "200px",
                display: "flex",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <Link href="/login">
                <Button
                  variant="outlined"
                  sx={{
                    border: "none",
                    backgroundColor: "red",
                    textTransform: "unset",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "red",
                      color: "white",
                    },
                  }}
                >
                  Login to connect to other
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
export default Recommend;
