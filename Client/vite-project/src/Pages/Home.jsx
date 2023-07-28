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
  Link,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AddBoxIcon from "@mui/icons-material/AddBox";
import HomeIcon from "@mui/icons-material/Home";
import RecommendIcon from "@mui/icons-material/Recommend";
import SendIcon from "@mui/icons-material/Send";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { styled, alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import axios from "axios";
import NavBar from "./NavBar";
import Footer from "./Footer";
// import "./home.css";
const baseUri = axios.create({
  baseURL: "http://localhost:3000/",
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
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

const add = [1, 2, 3, 4, 5, 6, 4, 5, 6, 7, 7, 8, 9, 9];

function Home(props) {
  const [create, setCreate] = useState(false);
  const [openPost, setOpenPost] = useState(false);

  /////open images
  const [showImage, setShowImage] = useState(Array(100).fill(false));

  ////commetn things
  const [showComment, setShowComment] = useState(Array(100).fill(false));
  const [comments, setComments] = useState(Array(10).fill(""));
  const [commentText, setCommentText] = useState("");
  const [isCommentEmpty, setIsCommentEmpty] = useState(true);
  ////liek things
  const [liked, setLiked] = useState(useState(Array(10).fill(false)));
  const [likes, setLikes] = useState(useState(Array(10).fill(0)));

  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [picId, setPicId] = useState();
  //loggin creeditional
  const [loggedinData, setLoggedinData] = useState([]);
  const [loggedin, setLoggedin] = useState(false);

  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentImages, setCurrentImages] = useState(Array(10).fill(0));

  function handleNavigation(postIndex, direction) {
    const images = posts[postIndex].Pictures;
    const currentIndex = currentImages[postIndex];

    if (direction === "right" && currentIndex < images.length - 1) {
      // Navigate to the next image
      const newCurrentImages = [...currentImages];
      newCurrentImages[postIndex] = currentIndex + 1;
      setCurrentImages(newCurrentImages);
    } else if (direction === "left" && currentIndex > 0) {
      // Navigate to the previous image
      const newCurrentImages = [...currentImages];
      newCurrentImages[postIndex] = currentIndex - 1;
      setCurrentImages(newCurrentImages);
    }
  }

  // const [loggedin, setLoggedin] = useState(false);
  const { profile } = props;
  console.log("home", loggedinData);
  console.log("home profile", profile);
  const [state, setState] = useState({
    text: "",
    image: [],
    imageUrls: [],
    formData: new FormData(),
  });
  const handleImageChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 7) {
      setError("You can appload a maximum of 7 images");
    } else {
      const urls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const url = URL.createObjectURL(selectedFiles[i]);
        urls.push(url);
      }

      setState({
        ...state,
        image: selectedFiles,
        imageUrls: urls,
      });
    }
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);

    const formData = new FormData();
    for (let i = 0; i < state.image.length; i++) {
      formData.append("images", state.image[i]);
    }

    formData.append("text", state.text);
    console.log("formdata", formData.getAll("images"));
    console.log("formdata", formData.get("text"));
    if (Error == "") {
      console.log("to be apploaded");
      baseUri
        .post("/post", formData, { withCredentials: true })
        .then((res) => {
          setLoading(false);
          setError("Posted");
          console.log("res", res);
          // Handle the API response here
        })
        .catch((err) => {
          setLoading(false);
          console.log("errr", err);
        });
    } else {
      setLoading(false);
    }
  };

  const handleOpenPost = () => {
    setOpenPost(true);
  };
  const handleClosePost = () => {
    setOpenPost(false);
  };

  const createPost = () => {
    return (
      <BootstrapDialog
        onClose={handleClosePost}
        aria-labelledby="customized-dialog-title"
        open={openPost}
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
          onClose={handleClosePost}
        >
          <IconButton sx={{ float: "right" }} onClick={handleClosePost}>
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
            Creating Post
          </Typography>
        </Box>

        <DialogContent dividers>
          <Box
            sx={{
              border: "1px solid black",
              width: {
                lg: "500px",
              },
              padding: "10px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <form onSubmit={handleSubmit}>
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "red",
                  }}
                >
                  {Error}
                </p>
                <Box
                  sx={{ display: "flex", flexDirection: "column", mt: "20px" }}
                >
                  <TextField
                    label="Text"
                    multiline
                    rows={4}
                    name="text"
                    value={state.text}
                    sx={{ width: "300px" }}
                    onChange={handleTextChange}
                  />
                  <Box sx={{ mt: 4, display: "flex", flexDirection: "column" }}>
                    {/* <label htmlFor="image"> */}
                    <Box>
                      {state.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Uploaded Image ${index}`}
                          style={{ width: "60px", height: "60px" }}
                        />
                      ))}
                    </Box>
                    <Button variant="contained" component="label">
                      Upload Image
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        onChange={handleImageChange}
                      />
                    </Button>

                    {/* </label> */}
                  </Box>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <CircularProgress />
                          Saving
                        </>
                      ) : (
                        "Post"
                      )}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    );
  };
  // const commentPop = () => {
  //   return (
  //     <BootstrapDialog
  //     onClick={() => {
  //       handleCloseComment(post.id, postIndex);
  //     }}

  //       aria-labelledby="customized-dialog-title"
  //       open={openPost}
  //     >
  //       <Box
  //         sx={{
  //           height: {
  //             lg: "70px",
  //             md: "100px",
  //             sm: "80px",
  //             xs: "100px",
  //           },
  //         }}
  //         onClose={handleClosePost}
  //       >
  //         <IconButton sx={{ float: "right" }} onClick={handleClosePost}>
  //           <CloseIcon />
  //         </IconButton>
  //         <Typography
  //           sx={{
  //             alignItem: "center",
  //             // float: "left",
  //             textAlign: "Center",

  //             marginTop: "20px",
  //             fontSize: "20px",
  //             fontWeight: "bold",
  //           }}
  //         >
  //           Creating Post
  //         </Typography>
  //       </Box>

  //       <DialogContent dividers>
  //         <Box
  //           sx={{
  //             border: "1px solid black",
  //             width: {
  //               lg: "500px",
  //             },
  //             padding: "10px",
  //           }}
  //         >
  //           <Box sx={{ display: "flex", justifyContent: "center" }}>
  //             <form onSubmit={handleSubmit}>
  //               <p
  //                 style={{
  //                   display: "flex",
  //                   justifyContent: "center",
  //                   color: "red",
  //                 }}
  //               >
  //                 {Error}
  //               </p>
  //               <Box
  //                 sx={{ display: "flex", flexDirection: "column", mt: "20px" }}
  //               >
  //                 <TextField
  //                   label="Text"
  //                   multiline
  //                   rows={4}
  //                   name="text"
  //                   value={state.text}
  //                   sx={{ width: "300px" }}
  //                   onChange={handleTextChange}
  //                 />
  //                 <Box sx={{ mt: 4, display: "flex", flexDirection: "column" }}>
  //                   {/* <label htmlFor="image"> */}
  //                   <Box>
  //                     {state.imageUrls.map((url, index) => (
  //                       <img
  //                         key={index}
  //                         src={url}
  //                         alt={`Uploaded Image ${index}`}
  //                         style={{ width: "60px", height: "60px" }}
  //                       />
  //                     ))}
  //                   </Box>
  //                   <Button variant="contained" component="label">
  //                     Upload Image
  //                     <input
  //                       hidden
  //                       accept="image/*"
  //                       multiple
  //                       type="file"
  //                       onChange={handleImageChange}
  //                     />
  //                   </Button>

  //                   {/* </label> */}
  //                 </Box>
  //                 <Box
  //                   sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
  //                 >
  //                   <Button
  //                     variant="contained"
  //                     type="submit"
  //                     disabled={loading}
  //                   >
  //                     {loading ? (
  //                       <>
  //                         <CircularProgress />
  //                         Saving
  //                       </>
  //                     ) : (
  //                       "Post"
  //                     )}
  //                   </Button>
  //                 </Box>
  //               </Box>
  //             </form>
  //           </Box>
  //         </Box>
  //       </DialogContent>
  //     </BootstrapDialog>
  //   );
  // };
  const displayComment = () => {};

  const handlCreate = () => {
    setCreate(!create);
  };
  const handlePage = (event) => {
    const newpage = page + 1;
    setPage(newpage);
    console.log("clikededd", page);
  };

  const handleLikeNew = async (postId, postIndex) => {
    const newlike = likes[postIndex] + 1;

    setLikes((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[postIndex] = newlike;
      return updatedArray;
    });
    setLiked((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[postIndex] = true;
      return updatedArray;
    });
    try {
      axios
        .post("http://localhost:3000/like", {
          action: "like",
          postId,
        })
        .then((response) => {
          console.log("donelikes", response);
        })
        .catch((err) => {
          console.log("erro liking", err);
        });
    } catch (errr) {
      console.log("errr in catching", errr);
    }

    // await axios.post("http://localhost:3000/like", {
    //   action: "like",
    //   postId,
    // });
  };

  const handleCloseComment = async (postId, postIndex) => {
    setShowComment((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[postIndex] = !updatedArray[postIndex];
      return updatedArray;
    });
  };
  const handleDisplayComment = async (postId, postIndex) => {
    setShowComment((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[postIndex] = !updatedArray[postIndex];
      return updatedArray;
    });
    try {
      axios
        .get("http://localhost:3000/comments", {
          params: {
            postId: postId,
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
  const handleSubmitComment = async (postId, postIndex) => {
    try {
      axios
        .post(
          "http://localhost:3000/comment",
          {
            postId: postId,
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

  const handleCloseImage = async (postId, postIndex) => {
    setShowImage((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[postIndex] = !updatedArray[postIndex];
      return updatedArray;
    });
  };
  const handleDisplayImage = async (postId, postIndex) => {
    setShowImage((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[postIndex] = !updatedArray[postIndex];
      return updatedArray;
    });
  };

  useEffect(() => {
    console.log("in the home useEffect");
    axios
      .get(`http://localhost:3000/posts/${page}`, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        // setCurrentImages(posts.map(() => 0));
        setCurrentImages(Array(data.length).fill(0));
        const likesArray = data.map((post) => post.likes);
        const likesArrayLike = data.map((post) => false);
        const comment = data.map((post) => false);
        setLikes(likesArray);
        setLiked(likesArrayLike);
        setShowComment(comment);
        // setLikes(response.data.likes);
        console.log("response.data.likes", response.data.likes);
        // const pic = data.Pictures;
        // setImages(pic);
        setPosts(data);
        console.log("fetched data", response.data);
      })
      //
      .catch((err) => {
        console.log("err", err);
      });
  }, [page]);
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

  console.log("likes", likes);
  console.log("liked", liked);
  console.log("comment fro", comments);
  console.log("comment form me", commentText);
  return (
    <>
      <Box
        sx={{
          mb: "100px",

          display: "flex",
          justifyContent: "center",
          backgroundColor: "grey",
        }}
      >
        {/* <NavBar /> */}
        {loggedin && (
          <>
            <Box
              sx={
                {
                  // justifyContent: "center",
                }
              }
            >
              <Box
                sx={{
                  display: "flex",

                  // justifyContent: "center",
                  mt: "100px",
                }}
              >
                <Box className="popUp">
                  <Button
                    // variant="outlined"
                    onClick={handleOpenPost}
                    disabled={loading}
                    sx={{
                      border: "none",
                      // backgroundColor: "red",
                      textTransform: "unset",
                      color: "white",
                      width: {
                        lg: "170px",
                        md: "170px",
                        sm: "130px",
                        // xs: "130px",
                      },

                      // "&:hover": {
                      //   backgroundColor: "red",
                      //   color: "white",
                      // },
                    }}
                  >
                    <AddBoxIcon sx={{ color: "white" }} />
                    Create Post
                  </Button>

                  {createPost()}
                </Box>
                <Box sx={{ right: "0px" }}>
                  <Link href="/recommend" sx={{ textDecoration: "none" }}>
                    {" "}
                    <Button
                      sx={{
                        float: "right",
                        color: "white",
                        ml: {
                          xs: "10px",
                          sm: "15px",
                          ms: "20px",
                          lg: "20px",
                        },
                      }}
                      onClick={handlCreate}
                    >
                      <RecommendIcon sx={{ color: "white" }} />
                      Recommend Me Place
                    </Button>
                  </Link>
                </Box>
              </Box>
              {posts && posts.length > 0 && (
                <>
                  {posts.map((post, postIndex) => {
                    return (
                      <>
                        <Paper
                          className="container"
                          // elevation={2}
                          sx={{
                            marginTop: "10px",
                            backgroundColor: "#F5F3F3 ",
                            border: "1px solid #E0DFDF",

                            width: {
                              lg: "500px",
                              md: "550px",
                              sm: "500px",
                              xs: "350px",
                            },

                            // padding: "10px",
                          }}
                        >
                          <Box sx={{ display: "flex", mt: "5px", ml: "10px" }}>
                            <Avatar
                              alt="Travis Howard"
                              src={`http://localhost:3000/personimages/${post.User.id} `}
                            />
                            <Typography
                              sx={{ fontWeight: "bold", mt: "10px", ml: "5px" }}
                            >
                              {post.User.fname} {post.User.lname}
                            </Typography>
                            <Typography
                              clasName="date"
                              sx={{ marginTop: "10px", ml: "auto", mr: "15px" }}
                            >
                              {formatDate(post.date)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", mt: "10px", ml: "10px" }}>
                            <Typography sx={{ fontSize: "15px" }}>
                              {post.text}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              // display: "flex",
                              // flexDirection: "column",

                              // width: {
                              //   lg: "100%",
                              //   md: "100%",
                              //   sm: "100%",
                              //   xs: "100%",
                              // },

                              display: "flex",
                              alignItems: "center",

                              // width: {
                              //   lg: "500px",
                              //   md: "500px",
                              //   sm: "400px",
                              //   xs: "250px",
                              // },
                            }}
                          >
                            <Button
                              disabled={currentImages[postIndex] === 0}
                              onClick={() =>
                                handleNavigation(postIndex, "left")
                              }
                            >
                              <ChevronLeftIcon />
                            </Button>
                            {post.Pictures && post.Pictures.length > 0 && (
                              <Button
                                onClick={() => {
                                  handleDisplayImage(post.id, postIndex);
                                }}
                              >
                                <img
                                  style={{
                                    width: "100%",
                                    height: "300px",
                                  }}
                                  src={`http://localhost:3000/images/${
                                    // post.Pictures[postIndex].id
                                    post.Pictures[currentImages[postIndex]].id
                                  }`}
                                  alt={`Post Image ${currentImages[postIndex]}`}
                                />
                              </Button>
                            )}

                            <Button
                              disabled={
                                currentImages[postIndex] ===
                                post.Pictures.length - 1
                              }
                              onClick={() =>
                                handleNavigation(postIndex, "right")
                              }
                            >
                              <KeyboardArrowRightIcon />
                            </Button>
                          </Box>
                          <Box display="flex" sx={{ alignText: "center" }}>
                            <Button
                              // onClick={() =>
                              //   liked[postIndex]
                              //     ? handleUnlike(post.id)
                              //     : handleLike(post.id)
                              // }
                              disabled={liked[postIndex]}
                              onClick={() => {
                                handleLikeNew(post.id, postIndex);
                              }}

                              // sx={{ border: "1px solid grey" }}
                            >
                              {" "}
                              {liked[postIndex] ? (
                                <FavoriteIcon sx={{ color: "red" }} />
                              ) : (
                                <FavoriteBorderIcon sx={{ color: "red" }} />
                              )}
                            </Button>
                            <Typography sx={{ mt: "5px" }}>
                              {likes[postIndex]} people liked this
                            </Typography>
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
                                placeholder="Comment"
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
                                  handleSubmitComment(post.id, postIndex);
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
                                  handleDisplayComment(post.id, postIndex);
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
                                See Comments
                              </Button>

                              <Box className="pop up for comment">
                                <BootstrapDialog
                                  // onClose={handleClosePost}
                                  onClose={() => {
                                    handleCloseComment(post.id, postIndex);
                                  }}
                                  aria-labelledby="customized-dialog-title"
                                  // open={openPost}
                                  open={showComment[postIndex]}
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
                                      handleCloseComment(post.id, postIndex);
                                    }}
                                  >
                                    <IconButton
                                      sx={{ float: "right" }}
                                      onClick={() => {
                                        handleCloseComment(post.id, postIndex);
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
                                        // maxheight: "100vh",
                                        height: "80vh",
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
                                            <Button
                                              sx={{ width: "10px" }}
                                              disabled={
                                                currentImages[postIndex] === 0
                                              }
                                              onClick={() =>
                                                handleNavigation(
                                                  postIndex,
                                                  "left"
                                                )
                                              }
                                            >
                                              <ChevronLeftIcon />
                                            </Button>
                                            {post.Pictures &&
                                              post.Pictures.length > 0 && (
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
                                                  src={`http://localhost:3000/images/${
                                                    // post.Pictures[postIndex].id
                                                    post.Pictures[
                                                      currentImages[postIndex]
                                                    ].id
                                                  }`}
                                                  alt={`Post Image ${currentImages[postIndex]}`}
                                                />
                                              )}

                                            <Button
                                              disabled={
                                                currentImages[postIndex] ===
                                                post.Pictures.length - 1
                                              }
                                              onClick={() =>
                                                handleNavigation(
                                                  postIndex,
                                                  "right"
                                                )
                                              }
                                            >
                                              <KeyboardArrowRightIcon />
                                            </Button>
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
                                                        comment.User.id && (
                                                          <Avatar
                                                            alt="Travis Howard"
                                                            style={{
                                                              width: "37px",
                                                              height: "37px",
                                                            }}
                                                            src={`http://localhost:3000/personimages/${comment.User.id}`}
                                                          />
                                                        )}
                                                      <p
                                                        style={{
                                                          ml: "10px",
                                                          marginTop: "10px",
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {comment.commentText}
                                                      </p>
                                                    </Box>

                                                    <Divider />
                                                  </>
                                                );
                                              })}

                                            {comments.length > 5 && (
                                              <Button
                                                className="moreComment"
                                                onClick={() => {
                                                  handleMoreComment(
                                                    post.id,
                                                    postIndex
                                                  );
                                                }}
                                                sx={{
                                                  textTransform: "none",
                                                  marginLeft: "20px",
                                                }}
                                              >
                                                See more comment
                                              </Button>
                                            )}
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </DialogContent>
                                </BootstrapDialog>
                              </Box>

                              <Box className="pop up for image">
                                <BootstrapDialog
                                  // onClose={handleClosePost}
                                  onClose={() => {
                                    handleCloseImage(post.id, postIndex);
                                  }}
                                  aria-labelledby="customized-dialog-title"
                                  // open={openPost}
                                  open={showImage[postIndex]}
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
                                      handleCloseImage(post.id, postIndex);
                                    }}
                                  >
                                    <IconButton
                                      sx={{ float: "right" }}
                                      onClick={() => {
                                        handleCloseImage(post.id, postIndex);
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
                                      Pictures
                                    </Typography>
                                  </Box>

                                  <DialogContent dividers>
                                    <Box
                                      sx={{
                                        // border: "1px solid black",
                                        width: {
                                          lg: "700px",
                                        },
                                        // maxheight: "100vh",
                                        // height: "80vh",
                                        // padding: "10px",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "block",

                                          // justifyContent: "center",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            width: {
                                              lg: "600px",
                                            },
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              width: "100%",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItem: "center",
                                            }}
                                          >
                                            <Button
                                              sx={{ width: "10px" }}
                                              disabled={
                                                currentImages[postIndex] === 0
                                              }
                                              onClick={() =>
                                                handleNavigation(
                                                  postIndex,
                                                  "left"
                                                )
                                              }
                                            >
                                              <ChevronLeftIcon />
                                            </Button>
                                            {post.Pictures &&
                                              post.Pictures.length > 0 && (
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
                                                  src={`http://localhost:3000/images/${
                                                    // post.Pictures[postIndex].id
                                                    post.Pictures[
                                                      currentImages[postIndex]
                                                    ].id
                                                  }`}
                                                  alt={`Post Image ${currentImages[postIndex]}`}
                                                />
                                              )}

                                            <Button
                                              disabled={
                                                currentImages[postIndex] ===
                                                post.Pictures.length - 1
                                              }
                                              onClick={() =>
                                                handleNavigation(
                                                  postIndex,
                                                  "right"
                                                )
                                              }
                                            >
                                              <KeyboardArrowRightIcon />
                                            </Button>
                                          </Box>
                                          <Divider />
                                        </Box>
                                      </Box>
                                    </Box>
                                  </DialogContent>
                                </BootstrapDialog>
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </>
                    );
                  })}
                </>
              )}
              <Box
                className="paging"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button onClick={handlePage} sx={{ textTransform: "none" }}>
                  {" "}
                  See More
                </Button>
              </Box>
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
      <Divider />
      <Footer />
    </>
  );
}

export default Home;
