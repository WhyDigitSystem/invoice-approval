import CelebrationIcon from "@mui/icons-material/Celebration";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useNavigate } from "react-router-dom";
// import "./OverView.css";

const Overview = ({ userName = "User" }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize(); // Automatically adjusts confetti to window size
  const navigate = useNavigate();

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, []);

  const Listing = () => {
    navigate("/Listing"); // Navigate to the approved list page
  };


  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        position: "relative",
      }}
    >
      {/* Confetti */}
      {showConfetti && <Confetti width={width} height={height} />}

      <Card
        sx={{
          width: 500,
          boxShadow: 0,
          border: "1px solid #f1f1f1",
          borderRadius: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
        }}
      >



        {/* Content Section */}
        <CardContent
          sx={{
            flex: 1,
            padding: { xs: 3, md: 5 },
            textAlign: "center",
          }}
        >

{/* <button>
      <div className="svg-1" style={{height:"10px"}}>
        <svg
          viewBox="0 0 58.56 116.18"
          style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            imageRendering: 'optimizeQuality',
            fillRule: 'evenodd',
            clipRule: 'evenodd',
          }}
        >
          <g id="Layer_x0020_1">
            <path
              d="M51.68 79.32c-5.6,0.48 -18.01,6.61 -22.08,10.58 -0.8,0.78 -1.48,1.77 -2.33,2.43 0.46,-1.76 1.17,-3.5 1.71,-5.18 2.05,-6.36 0.6,-3.94 6.72,-6.92 4.39,-2.13 7.93,-4.39 11.48,-7.91 2.87,-2.84 6.6,-7.49 8.43,-10.95 -3.22,0.75 -8.91,3.73 -12.2,5.14 -3.4,1.56 -7.64,4.64 -10.05,7.42l1.92 -7.77c0.18,-0.6 12.35,-10.32 15.54,-15.33 3.24,-5.07 5.83,-12.73 7.72,-18.52 -3.83,2.95 -11.19,10.7 -14.1,14.29 -2.1,2.58 -4.06,5.29 -6.05,7.95 0.13,-1.52 1.01,-4.66 1.36,-6.17 2.16,-9.19 5.06,-41.4 -1.01,-48.38 0,3.22 -1.49,12.51 -2.05,15.9 -1.29,7.79 -4.08,25.67 -3.07,33.01l0.47 8.51c0.07,2.12 -0.24,6.17 -1.45,7.91 0,-8.9 -9.67,-35.19 -16.51,-40.2 0,5.82 4.29,23.1 6.2,27.9 1.71,4.29 4.8,10.38 7.54,14 1.93,2.55 2.5,2.41 -0.02,9.43l-3.29 11.08 -3.9 -12.16c-2.78,-6.77 -11.01,-23.67 -15.86,-26.92 0,11.78 8.37,33.86 19.11,40.13 -0.29,2.07 -3.42,10.31 -4.93,11.77 -1.78,-10.97 -7.2,-20.86 -13.98,-29.49l-7.03 -8.05c0.06,2.73 1.9,7.3 2.51,10.1 0.36,0.47 3.98,11.12 9.2,19.09 2.49,3.81 6.41,7.11 8.48,10.28 -1.04,3.19 -5.75,9.78 -8.03,12.98l1.81 0.91c2.75,-2.62 8.6,-12.41 9.74,-15.89 6.1,-3.14 7.06,-2.33 14.56,-7.45 5.18,-3.54 5.49,-4.51 8.86,-8.02 1.06,-1.1 4.21,-4.24 4.55,-5.5z"
              className="fil0"
            />
          </g>
        </svg>
      </div>
      <p>Button</p>
    </button> */}
          {/* Icons and Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <CelebrationIcon
              sx={{ fontSize: 40, color: "#FF5722" }}
              aria-label="Celebration"
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Welcome, {localStorage.getItem("nickName")}!
            </Typography>
          </Box>

          {/* Subtext */}
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              marginBottom: 3,
              fontSize: "1rem",
            }}
          >
            We're thrilled to have you here! Let's make your experience amazing.
          </Typography>

          {/* Action Buttons */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={Listing}
                sx={{
                  borderColor: "#FF5722",
                  color: "#FF5722",
                  "&:hover": {
                    backgroundColor: "#FFECE4",
                    borderColor: "#FF5722",
                  },
                }}
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Overview;
