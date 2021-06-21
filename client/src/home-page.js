import React from "react";
import {
  Typography,
  InputBase,
  Paper,
  IconButton,
  Box,
  Button
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import banner from './images/banner.png'

export default function HomePage() {
  return (
    <>
      <Box  style={{ 
          backgroundImage: `url(${banner})`,
          backgroundSize: "fit",
          height: "40vh"
        }}>
        <Typography align="center" variant="h1">
          Local Scout
        </Typography>
        <Typography align="center" variant="h4">
          Scout, Order, & Deliver Locally!
        </Typography>
        <Paper align="center" style= {{width:"40vw", margin:"0 auto"}} rounded="true" outlined="true">
          <InputBase
            placeholder="Scout Local Market"
            inputProps={{ "aria-label": "Scout Local Market" }}
          />
          <IconButton type="submit" edge="end">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Button variant="contained" placeholder="Browse Markets" style={{display: "flex", margin: "0 auto"}} >Browse Markets </Button>
      </Box>
    </>
  );
}
