import React from "react";
import { styled } from "@mui/material/styles";
import { Container, Grid, Link, Typography, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const FooterContainer = styled("footer")(({ theme }) => ({
  backgroundColor: "linear-gradient(to right, #00ff00, #00cc00)",
  padding: theme.spacing(5),
  color: "black",
}));

const Footer = () => {
  return (
    <>
      <FooterContainer>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-evenly">
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                <Link href="/about">About Us</Link>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                funFinder PLC
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Email: funfinder@gmail.com
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Link href="https://facebook.com">
                <FacebookIcon />
              </Link>
              <Link href="https://twitter.com">
                <TwitterIcon />
              </Link>
              <Link href="https://instagram.com">
                <InstagramIcon />
              </Link>
            </Grid>
          </Grid>
        </Container>
      </FooterContainer>
    </>
  );
};
export default Footer;
