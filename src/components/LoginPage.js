import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ParticleOrbit from "./ParticleOrbit";
import UWLNL1 from "../UWLNL1.png";
import logoonly from "../logoonly.jpg";
import {
  Alert,
  Button,
  Card,
  Input,
  Space,
  Typography,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import { encryptPassword } from "../utils/passEnc";
import axios from "axios";
import logoonly1 from "../logoonly.png";
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
          description: "Successfully Logged In",
          duration: 5, // Time in seconds for the toast to stay visible
        });
      } else {
        // Check for specific error message if user is already logged in on another device
        // if (response.data.paramObjectsMap?.errorMessage === "User Already Logged In Another Device") {
        //   setError("You are already logged in on another device. Please log out from the other device.");

        notification.error({
          message: "Error",
          description:
            "You are already logged in on another device or Your Account is InActive",
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
  useEffect(() => {
    if (username && passcode.join("").length === 6) {
      handleSubmit();
    }
  }, [username, passcode]);

  return (
    <div className="body-wrapper">
      <div className="logo-container">
        <img src={logoonly1} width="110px" height="60px" alt="Logo" />
        <div
          style={{
            fontSize: "24px",
            marginLeft: "120px",
            marginTop: "-60px",
            color: "white",
            fontWeight: "bpld",
          }}
        >
          {" "}
          Uniworld <br />
          Logistics
        </div>
      </div>
      <div className="background">{/* <ParticleOrbit /> */}</div>

      <div className="wrapper">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="bubble"></span>
        ))}
      </div>

      <form className="glass-form">
        <br />
        <p style={{ color: "white" }}>
          <h4> Welcome To UGS Portal</h4>
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
                placeholder="Username"
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
      </form>
    </div>
  );
};

export default LoginPage;
