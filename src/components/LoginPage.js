import {
  ConsoleSqlOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
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
import { useNavigate, useLocation } from "react-router-dom";
import logoonly from "../logoonly.png";
import Loader from "../utils/Loader";
import { encryptPassword } from "../utils/passEnc";
import Gallery from "./Gallery";
import CryptoJS from "crypto-js";
import "./LoginPage.css";
import UWLNL from "../UWLNL.jpg";
import UWLNL1 from "../UWLNL1.png";
import scmprocess from "../scmprocess.gif";
import loginpage1 from "../loginpage1.png";
import loginpage1New from "../loginpage1New.png";
import loginpage1New1 from "../loginpage1New1.jpg";
import expimp from "../expimp.jpg";
import login4 from "../login4.jpg";
import scm2 from "../scm2.jpg";
import scmvideo from "../scmvideo.mp4";
import logoonly1 from "../logoonly.png";
import ParticleOrbit from "./ParticleOrbit";

const { Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle mobile state persistence
  // useEffect(() => {
  //   // First check URL state (from logout)
  //   if (location.state?.isMobile !== undefined) {
  //     setIsMobile(location.state.isMobile);
  //     return;
  //   }

  //   // Then check localStorage
  //   const savedMobileView = localStorage.getItem("isMobileView");
  //   if (savedMobileView) {
  //     setIsMobile(savedMobileView === "true");
  //   }

  //   const handleResize = () => {
  //     const mobile = window.innerWidth < 768;
  //     setIsMobile(mobile);
  //     localStorage.setItem("isMobileView", mobile.toString());
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [location.state]);

  // Handle mobile state persistence
  // useEffect(() => {
  //   // Check URL state first (from logout)
  //   if (location.state?.isMobile !== undefined) {
  //     setIsMobile(location.state.isMobile);
  //     return;
  //   }

  //   // Otherwise check localStorage
  //   const savedMobileView = localStorage.getItem("isMobileView");
  //   if (savedMobileView) {
  //     setIsMobile(savedMobileView === "true");
  //   }

  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [location.state]);

  // Save mobile view preference
  // useEffect(() => {
  //   localStorage.setItem("isMobileView", isMobile);
  // }, [isMobile]);

  // Handle mobile state and window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        localStorage.setItem("isMobileView", mobile.toString());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

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
    }, 20000);
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

  useEffect(() => {
    if (username && passcode.join("").length === 6) {
      handleSubmit();
    }
  }, [username, passcode]);

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

        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("screens", JSON.stringify(screens));
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

        const responseScreens = JSON.stringify(
          response.data.paramObjectsMap.userVO.roleVO[0].responsibilityVO[0]
            .screensVO
        );
        localStorage.setItem("responseScreens", responseScreens);
        setLoading(false);
        navigate("/Transactions");

        notification.success({
          message: "Success",
          description: "Successfully Logged In",
          duration: 5,
        });
      } else {
        const errorMsg = response?.data.paramObjectsMap.errorMessage;
        const message = response?.data.paramObjectsMap.message;

        notification.error({
          message: "Login attempt has failed",
          description: errorMsg,
          duration: 10,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.paramObjectsMap?.errorMessage ||
        error.response?.data?.message ||
        "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/login") {
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
    } else {
      if (theme === "dark") {
        document.body.style.backgroundColor = "#262626";
        document.body.style.color = "#fff";
      } else {
        document.body.style.backgroundColor = "#fff";
        document.body.style.color = "#000";
      }
    }
  }, [theme]);

  useEffect(() => {
    document.body.style.backgroundColor = "#fff";
    document.body.style.color = "#000";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  const cardStyle =
    theme === "dark"
      ? { backgroundColor: "#fff", borderColor: "#444", color: "#000" }
      : { backgroundColor: "#fff", borderColor: "#d9d9d9", color: "#000" };

  const inputStyle =
    theme === "dark"
      ? { backgroundColor: "#fff", color: "#000", borderColor: "#666" }
      : { backgroundColor: "#fff", color: "#000", borderColor: "#d9d9d9" };

  return (
    <>
      {!isMobile ? (
        // Desktop View
        <>
          <div className="wrapper">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="bubble"></span>
            ))}
          </div>
          <div
            style={{
              backgroundImage: `url(${loginpage1New})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "600px",
              width: "1400px",
              boxShadow: "none",
            }}
          ></div>
          <div
            style={{
              background: "transparent",
              marginTop: "-600px",
            }}
          >
            <img src={UWLNL1} width="260px" height="90px" alt="Your Image" />
          </div>

          <div
            className="container"
            style={{
              marginTop: "-30px",
              height: "700px",
              width: "900px",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              background: "transparent",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                marginTop: "30px",
                gap: "30px",
                boxShadow: "none",
                background: "transparent",
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
                  {success && (
                    <Alert message={success} type="success" showIcon />
                  )}
                </div>
              )}

              <div className="wrapper">
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="bubble"></span>
                ))}
              </div>

              <div
                style={{ marginLeft: "-90px", background: "transparent" }}
              ></div>

              <div id="root"></div>

              <div
                className="ticketList"
                style={{
                  marginTop: "-250px",
                  marginLeft: "300px",
                  background: "transparent",
                }}
              >
                <div class="card">
                  <div class="face face1" style={{ background: "#2f3271" }}>
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
                          <Space
                            size="middle"
                            style={{ justifyContent: "center" }}
                          >
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
                        </Space>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="wrapper">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="bubble"></span>
            ))}
          </div>
        </>
      ) : (
        // Mobile View
        <div className="body-wrapper">
          <div className="logo-container">
            <img
              src={logoonly1}
              style={{ width: "10px !important", height: "10px !important" }}
              alt="Logo"
            />
            <div
              style={{
                fontSize: "24px",
                marginLeft: "100px",
                marginTop: "-50px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              <br /> Uniworld <br />
              Logistics
            </div>
          </div>

          <div className="background"></div>

          <div className="wrapper">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="bubble"></span>
            ))}
          </div>

          <form className="glass-form">
            <br />
            <p style={{ color: "white" }}>
              <h5> Welcome To UGS Portal</h5>
            </p>
            <br />
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
                      color: "white",
                    }}
                  >
                    Username
                  </Text>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      padding: "4px",
                      fontSize: 16,
                      borderRadius: 8,
                      marginBottom: "15px",
                    }}
                  />

                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: "center",
                      marginBottom: "15px",
                      color: "white",
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
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        style={{
                          width: "30px",
                          height: "30px",
                          textAlign: "center",
                          fontSize: "14px",
                          borderRadius: "8px",
                          color: "black",
                        }}
                      />
                    ))}
                  </Space>
                </Space>
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LoginPage;
