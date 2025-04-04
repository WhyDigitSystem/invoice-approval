import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Input,
  Space,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import confetti from "canvas-confetti";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoonly from "../logoonly.png";
import Loader from "../utils/Loader";
import { encryptPassword } from "../utils/passEnc";
import Gallery from "./Gallery";
import CryptoJS from "crypto-js";
// import "./logintest1.css";
import UWLNL from "../UWLNL.jpg";
import UWLNL1 from "../UWLNL1.png";
import scmprocess from "../scmprocess.gif";

import loginpage1 from "../loginpage1.png";
import loginpage1New from "../loginpage1New.png";
import expimp from "../expimp.jpg";

import login4 from "../login4.jpg";

import scm2 from "../scm2.jpg";

import scmvideo from "../scmvideo.mp4";
// import "./style.css";
import "./LoginPage.css"; //

const { Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); // Default theme from localStorage
  const navigate = useNavigate();
  const handleCelebrate = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Button animation
    const button = document.getElementById("celebrateBtn");
    if (button) {
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 100);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleCelebrate();
    }, 20000); // Trigger every 1 second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (value, index) => {
    const newPasscode = [...passcode];
    if (/^\d*$/.test(value)) {
      newPasscode[index] = value;
      setPasscode(newPasscode);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newPasscode = [...passcode];
      if (passcode[index]) {
        newPasscode[index] = "";
        setPasscode(newPasscode);
      } else if (index > 0) {
        newPasscode[index - 1] = "";
        setPasscode(newPasscode);
        document.getElementById(`otp-${index - 1}`).focus();
        handleSubmit();
      }
    }
  };

  // Automatically trigger login when passcode and username are valid
  useEffect(() => {
    if (username && passcode.join("").length === 6) {
      handleSubmit();
    }
  }, [username, passcode]);

  // To decrypt when needed

  const handleSubmit = async () => {
    if (!username) {
      setError("Username is required");
      return;
    }

    if (passcode.join("").length !== 6) {
      setError("Passcode must be exactly 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        userName: username,
        password: encryptPassword(passcode.join("")),
      });

      if (response.data.status === true) {
        setSuccess(
          response.data.paramObjectsMap?.message || "Successfully logged in"
        );

        const userData = response.data.paramObjectsMap?.userVO;
        const screens =
          response.data.paramObjectsMap?.userVO.roleVO[0].responsibilityVO[0]
            .screensVO;

        // Store user data and screens in localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("screens", JSON.stringify(screens)); // Store screen list

        localStorage.setItem("authToken", userData?.token);

        const token = response.data.paramObjectsMap?.userVO?.token;
        localStorage.setItem("authToken", token);

        const userName = response.data.paramObjectsMap?.userVO?.userName;
        localStorage.setItem("userName", userName);

        const userType = response.data.paramObjectsMap?.userVO?.userType;
        localStorage.setItem("userType", userType);

        const email = response.data.paramObjectsMap?.userVO?.email;
        localStorage.setItem("email", email);

        const nickName = response.data.paramObjectsMap?.userVO?.nickName;
        localStorage.setItem("nickName", nickName);

        // Extracting screensVO
        const responseScreens = JSON.stringify(
          response.data.paramObjectsMap.userVO.roleVO[0].responsibilityVO[0]
            .screensVO
        );
        localStorage.setItem("responseScreens", responseScreens);
        setLoading(false);
        navigate("/Transactions");

        notification.success({
          message: "Success",
          description: "Successfully Looged In",
          duration: 5, // Time in seconds for the toast to stay visible
        });
      } else {
        // Check for specific error message if user is already logged in on another device
        // if (response.data.paramObjectsMap?.errorMessage === "User Already Logged In Another Device") {
        //   setError("You are already logged in on another device. Please log out from the other device.");

        notification.error({
          message: "Error",
          description:
            "You are already logged in on another device. Please log out from the other device",
          duration: 10, // Time in seconds for the toast to stay visible
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.paramObjectsMap?.errorMessage ||
        error.response?.data?.message ||
        "An unexpected error occurred.";
      setError(errorMessage);
      // Set the error message for at least 30 seconds
    } finally {
      setLoading(false);
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Persist theme to localStorage
  };

  // useEffect(() => {
  //   if (theme === "dark") {
  //     // document.body.style.backgroundColor = "#1c1c1c"; // Dark background for the entire page

  //     document.body.style.backgroundColor = "#262626";
  //     document.body.style.color = "#fff"; // White text for dark mode
  //   } else {
  //     document.body.style.backgroundColor = "#fff"; // Light background for the body
  //     document.body.style.color = "#000"; // Black text for light mode
  //   }
  // }, [theme]);

  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Reset scrolling when component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    // If the current route is the login page, keep the background light
    if (window.location.pathname === "/login") {
      document.body.style.backgroundColor = "#fff"; // Always light background for the login page
      document.body.style.color = "#000"; // Black text for light mode
    } else {
      if (theme === "dark") {
        document.body.style.backgroundColor = "#262626"; // Dark background
        document.body.style.color = "#fff"; // White text for dark mode
      } else {
        document.body.style.backgroundColor = "#fff"; // Light background for the body
        document.body.style.color = "#000"; // Black text for light mode
      }
    }
  }, [theme]); // This effect runs whenever the theme changes

  useEffect(() => {
    // Ensure that the login page has a light background regardless of theme
    document.body.style.backgroundColor = "#fff";
    document.body.style.color = "#000"; // Black text for light mode

    // Clean up effect if needed
    return () => {
      // Reset styles if needed when the page unmounts
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []); // This effect only runs once when the component mounts
  // Dark mode styles for card and inputs
  const cardStyle =
    theme === "dark"
      ? { backgroundColor: "#fff", borderColor: "#444", color: "#000" } // Card background stays white
      : { backgroundColor: "#fff", borderColor: "#d9d9d9", color: "#000" };

  const inputStyle =
    theme === "dark"
      ? { backgroundColor: "#fff", color: "#000", borderColor: "#666" } // White background with black text
      : { backgroundColor: "#fff", color: "#000", borderColor: "#d9d9d9" }; // Light mode styling

  useEffect(() => {
    // Select all elements with the "arc-text" class
    const arcParagraphs = document.querySelectorAll(".arc-text");

    // Iterate over each <p> element
    arcParagraphs.forEach((paragraph, index) => {
      // Access the index 'n' and the paragraph element
      const n = index + 1; // Convert zero-based index to one-based index
      paragraph.innerHTML = paragraph.innerText
        .split("")
        .map(
          (char, i) =>
            `<span style="display: inline-block; transform:rotate(${
              i * (n * 5)
            }deg)">${char}</span>`
        )
        .join("");
    });
  }, []); // Run once after the component mounts

  const baseStyle = {
    // fontfamily: '"Reggae One", CenturyGothic, "AppleGothic", sans-serif',
    fontFamily: '"Familjen Grotesk"',
    color: "#00008B",
    fontsize: "52px",
    padding: "5px 20px",
    textalign: "center",
    // texttransform: 'uppercase',
    textrendering: "optimizeLegibility",
  };

  const elegantShadowStyle = {
    // color: '#131313',
    color: "#00008B",
    backgroundcolor: "#e7e5e4",
    letterspacing: ".12em",
    textShadow: `
          1px -1px 0 #767676, -1px 2px 1px #737272, -2px 4px 1px #767474, -3px 6px 1px #787777, -4px 8px 1px #7b7a7a, -5px 10px 1px #7f7d7d, -6px 12px 1px #828181, -7px 14px 1px #868585, -8px 16px 1px #8b8a89, -9px 18px 1px #8f8e8d, -10px 20px 1px #949392, -11px 22px 1px #999897, -12px 24px 1px #9e9c9c, -13px 26px 1px #a3a1a1, -14px 28px 1px #a8a6a6, -15px 30px 1px #adabab, -16px 32px 1px #b2b1b0, -17px 34px 1px #b7b6b5, -18px 36px 1px #bcbbba, -19px 38px 1px #c1bfbf, -20px 40px 1px #c6c4c4, -21px 42px 1px #cbc9c8, -22px 44px 1px #cfcdcd, -23px 46px 1px #d4d2d1, -24px 48px 1px #d8d6d5, -25px 50px 1px #dbdad9, -26px 52px 1px #dfdddc, -27px 54px 1px #e2e0df, -28px 56px 1px #e4e3e2`,
  };

  const retroshadowStyle = {
    fontFamily: "Arial, sans-serif", // You can choose any font family you want
    fontSize: "30px", // Example font size
    color: "#333", // Example text color
    textShadow: "#999 3px 3px 5px", // Applying the text-shadow style
  };

  const texts = ["W", "e", "l", "c", "o", "m", "e", ": )"];
  const numberOfParticles = 12;

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${loginpage1New})`, // Add the background image
          backgroundSize: "cover", // Ensure the image covers the entire div
          backgroundPosition: "center", // Center the background image
          backgroundRepeat: "no-repeat",
          height: "600px",
          width: "1400px",
          // marginTop: "10px",

          // opacity: 0.7, // Set the opacity to make it subtle like a watermark
          // pointerEvents: "none", // Prevent the watermark from interfering with clicks
          // zIndex: -1, // Place the watermark behind the content
        }}
      ></div>
      <div
        style={{
          background: "transparent",
          marginTop: "-600px",
        }}
      >
        <img src={UWLNL1} width="360px" height="140px" alt="Your Image" />
      </div>

      <div
        className="container"
        style={{
          marginTop: "-30px",
          height: "700px",
          width: "900px",
          // boxShadow: "0 8px 10px rgba(248, 192, 192, 0.2)",
          boxShadow: "none",
          // backgroundImage: `url(${loginpage1})`, // Add the background image
          backgroundSize: "cover", // Ensure the image covers the entire div
          backgroundPosition: "center", // Center the background image
          backgroundRepeat: "no-repeat",
          background: "transparent",
          // opacity: 0.1, // Set the opacity to make it subtle like a watermark
          // pointerEvents: "none", // Prevent the watermark from interfering with clicks
          // zIndex: -1, // Place the watermark behind the content
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            marginTop: "30px",
            // fontFamily: "Arial, sans-serif",
            // background: "#fff", // Ensure background is light
            gap: "30px",
            boxShadow: "none",
            background: "transparent",

            // background:"#cd995f"
          }}
        >
          {(error || success) && (
            <div
              style={{
                position: "absolute",
                top: 30,
                width: "100%",
                maxWidth: "400px",
              }}
            >
              {error && <Alert message={error} type="error" showIcon />}
              {success && <Alert message={success} type="success" showIcon />}
            </div>
          )}

          <div style={{ marginLeft: "-90px", background: "transparent" }}>
            {/* <img src="https://i.pinimg.com/originals/66/b0/02/66b002f6f5022553a6cf52d8d01241df.gif" /> */}

            {/* <img src={butterfly}></img> */}

            {/* <br/> */}

            {/* <h1 style={{ letterSpacing: "5px" , color:"#00008B"}}> */}
            {/* <img src={UWLNL} width="100px"  ></img> */}
            {/* <br/> */}
            {/* Uniworld <br /> <br/>
        Logistics <br /> */}
            {/* <br /> */}

            {/* <Gallery /> */}
            {/* </h1> */}
          </div>

          <div id="root"></div>

          <br />
          {/* <br/> */}
          {/* <p >Expense Claim List</p> */}

          <div
            className="ticketList"
            style={{
              marginTop: "-250px",
              marginLeft: "260px",
              background: "transparent",
            }}
          >
            <div class="card">
              <div class="face face1" style={{ background: "#2f3271" }}>
                {/* <div class="face face1" style={{ background: "#2f3271" }}> */}
                <div class="content">
                  <p style={{ color: "white" }}>Welcome To UGS Portal</p>
                </div>
              </div>
              <div class="face face2">
                <div class="content">
                  <p>
                    <Space
                      direction="vertical"
                      style={{ width: "100%", padding: "1px" }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          textAlign: "center",
                          marginBottom: "12px",
                          color: cardStyle.color,
                        }}
                      >
                        Username
                      </Text>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        style={{
                          padding: "4px",
                          fontSize: 16,
                          borderRadius: 8,
                          ...inputStyle,
                          marginBottom: "15px",
                        }}
                      />

                      <Text
                        style={{
                          fontSize: 16,
                          textAlign: "center",
                          marginBottom: "15px",
                          color: cardStyle.color,
                        }}
                      >
                        6-Digit Passcode
                      </Text>
                      <Space size="middle" style={{ justifyContent: "center" }}>
                        {passcode.map((digit, index) => (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            value={digit}
                            maxLength={1}
                            onChange={(e) =>
                              handleChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            style={{
                              width: "30px",
                              height: "30px",
                              textAlign: "center",
                              fontSize: "14px",
                              borderRadius: "8px",
                              ...inputStyle,
                            }}
                          />
                        ))}
                      </Space>

                      {/* <Button
                        type="primary"
                        size="large"
                        block
                        loading={loading}
                        onClick={handleSubmit}
                        style={{
                          backgroundColor: "#4c6ef5",
                          borderColor: "#4c6ef5",
                          marginTop: "20px",
                          borderRadius: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Login
                      </Button> */}

                      {/* Dark Mode Toggle */}
                      {/* <Button
                          type="text"
                          icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
                          onClick={toggleTheme}
                          size="small"
                          style={{ marginLeft: "10px" }}
                        >
                          {theme === "light" ? "Dark Mode" : "Light Mode"}
                        </Button> */}
                    </Space>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
