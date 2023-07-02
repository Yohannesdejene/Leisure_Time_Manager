import { useState } from "react";
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
import NavBar from "./NavBar";

function CreatePost() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
 

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(text, file);

    // Handle submit logic here
  };
  return (
    <>
      <p
        style={{
          marginTop: "100px",
          display: "flex",
          justifyContent: "Center",
          marginRight: "100px",
          fontSize: "20px",
          color: "red",
          width: {
            lg: "600px",
          },
        }}
      >
        Share you day
      </p>
      <Box
        sx={{
          border: "1px solid black",
          ml: {
            lg: "25%",
            md: "20%",
            sm: "15%",
            xs: "10%",
          },
          mr: {
            md: "20%",
            sm: "15%",
            xs: "10%",
          },
          width: {
            lg: "600px",
          },
          padding: "10px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", height: "70vh" }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", mt: "20px" }}>
              <TextField
                label="Text"
                multiline
                rows={4}
                value={text}
                onChange={handleTextChange}
              />
              <Box sx={{ mt: 4 }}>
                {/* <label htmlFor="image"> */}
                <Button variant="contained" component="span">
                  <input
                    id="image"
                    type="file"
                    onChange={handleFileUpload}
                    required
                  />
                  Upload Image
                </Button>
                {/* </label> */}
              </Box>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" type="submit">
                  Post
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}
export default CreatePost;
