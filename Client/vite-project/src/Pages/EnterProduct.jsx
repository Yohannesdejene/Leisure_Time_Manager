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
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import CircularProgress from "@mui/material/CircularProgress";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const baseUri = axios.create({
  baseURL: "http://localhost:3000/",
});
function EnterProduct() {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [errmessage, seterrmessage] = useState("");
  const [state, setState] = useState({
    placeName: "",
    productName: "",
    price: "",
    description: "",
    image: null,
    imageUrls: null,
    formData: new FormData(),
  });

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setloading(true);
    const { placeName, productName, price, description, image } = state;
    const formData = new FormData();
    formData.append("placeName", placeName);
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", image);
    console.log("formdata", formData.get("productName"));
    baseUri
      .post("/enterproduct", formData)
      .then((res) => {
        setloading(false);
        if (res.status == 200) {
          seterrmessage("Data entred succesffully redirecting....");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      })
      .catch((err) => {
        setloading(false);
        seterrmessage("Error while entering data");
        console.log("errr", err);
      });
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
        Enter new product
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
        <Box
          sx={{
            // display: "flex",
            // justifyContent: "center",
            height: "80vh",
            width: "80%",
          }}
        >
          <form onSubmit={handleSubmit}>
            <p style={{ color: "red", textAlign: "center" }}>{errmessage}</p>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Select Places
                </InputLabel>
                <NativeSelect
                  required
                  defaultValue={"Romina"}
                  value={state.placeName}
                  name="placeName"
                  onChange={handleTextChange}
                >
                  <option value={"Romina Launge"}>Romina Launge</option>
                  <option value={"Sheger Launge"}>Sheger Launge</option>
                  <option value={"Maleda Restaurant"}>Maleda Restaurant</option>
                  <option value={"Pizeria Piza"}>Pizeria Piza</option>
                  <option value={"WOW Burger"}>WOW Burger</option>
                  <option value={"Angela Burger"}>Angela Burger</option>
                  <option value={"Ambasader Mole"}>Ambasader Mole </option>
                </NativeSelect>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                mt: "20px",
              }}
            >
              {" "}
              <TextField
                required
                label="Product Name"
                type="text"
                value={state.productName}
                name="productName"
                sx={{ mb: "20px" }}
                onChange={handleTextChange}
              />
              <TextField
                required
                label="Price"
                type="number"
                value={state.price}
                name="price"
                sx={{ mb: "20px" }}
                onChange={handleTextChange}
              />
              <TextField
                label="Descritpion"
                multiline
                rows={4}
                value={state.description}
                name="description"
                onChange={handleTextChange}
                // onChange={handleTextChange}
              />
              <Box sx={{ mt: 4 }}>
                {/* <label htmlFor="image"> */}
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
                    required
                  />
                </Button>
                {/* </label> */}
              </Box>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <CircularProgress size="small" />
                      "Saving..."
                    </>
                  ) : (
                    "Enter Product"
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}
export default EnterProduct;
