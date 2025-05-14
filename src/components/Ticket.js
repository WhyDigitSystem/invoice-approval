import React, { useState, useRef, useEffect } from "react";
import "./Ticket.css";
import axios from "axios";
import { notification, Modal } from "antd";
import {
  getTicketReport,
  findByTicketById,
  getAdminNote,
  getUserNote,
} from "../services/api";
import NotificationBell from "./NotificationBell";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const Ticket = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [form, setForm] = useState({ title: "", message: "" });
  const [files, setFiles] = useState([]);
  const isAdmin = true;
  const createdBy = localStorage.getItem("userName");
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(localStorage.getItem("userName"));
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [yourDataArray, setYourDataArray] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [userNote, setUserNote] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getTicketReport(createdBy);
      console.log("first", response);

      const updatedData = await Promise.all(
        response.map(async (item) => {
          try {
            const attachmentResponse = await findByTicketById(
              item.gst_ticketId
            );

            const filesResponse = await findByTicketById(item.gst_ticketId);
            const profoma =
              filesResponse?.data?.paramObjectsMap?.ticketVO?.gst_ticketId ||
              "File";

            item.files =
              attachmentResponse?.data?.paramObjectsMap?.ticketVO?.ticketAttachmentVO?.map(
                (att, index) => ({
                  fileData: att.attachment,
                  fileName: `${profoma}_${String(index + 1).padStart(2, "0")}`,
                  fileType: getFileType(att.attachment),
                })
              ) || [];

            console.log("Attachment for item", item.gst_ticketId, item.files);
          } catch (error) {
            console.error(
              `Error fetching attachment for item with id ${item.gst_ticketId}:`,
              error
            );
            item.files = [];
          }

          return item;
        })
      );
      setData(updatedData);
      setPagination((prev) => ({
        ...prev,
        total: updatedData.length,
      }));
      console.log("Updated Data:", updatedData);
    } catch (error) {
      notification.error({
        message: "Data Fetch Error",
        description: "Failed to fetch data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (fileData) => {
    if (typeof fileData !== "string") return "unknown";

    const prefix = fileData.substring(0, 20);
    if (prefix.startsWith("iVBOR")) return "image/png";
    if (prefix.startsWith("/9j/")) return "image/jpeg";
    if (prefix.startsWith("JVBER")) return "application/pdf";
    if (prefix.startsWith("UEsDB"))
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    return "unknown";
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleReset = () => {
    setForm({ title: "", message: "" });
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFiles = async (ticketVOid, files) => {
    const formDataPayload = new FormData();
    formDataPayload.append("id", ticketVOid);

    files.forEach((file) => {
      formDataPayload.append("files", file);
    });

    try {
      const uploadResponse = await axios.put(
        `${API_URL}/api/Ticket/uploadfile`,
        formDataPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        console.log("Files uploaded successfully.");
      } else {
        console.error("Failed to upload files.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
  };

  const handleAssignChange = (index, newAssign) => {
    const updatedData = [...data];
    updatedData[index].assign = newAssign;
    setData(updatedData);
  };

  // const handleSolvedOnChange = (index, value) => {
  //   const updated = [...data];
  //   updated[index].solvedOn = value;
  //   setData(updated);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.message) {
      notification.error({
        message: "Validation Error",
        description: "Title and description are required fields.",
        duration: 3,
      });
      return; // Exit the function if validation fails
    }

    const payload = {
      title: form.title,
      description: form.message,
      createdBy,
    };

    try {
      const response = await axios.put(
        `${API_URL}/api/Ticket/updateTicket`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        const ticketVOid = response.data.paramObjectsMap.ticketVO.id;

        if (files.length > 0) {
          await uploadFiles(ticketVOid, files);
        }

        notification.success({
          message: "Success",
          description: "Ticket submitted successfully.",
          duration: 3,
        });

        handleReset();
        fetchData();
      } else {
        notification.error({
          message: "Error",
          description: "Failed to submit the ticket.",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while saving.",
        duration: 3,
      });
    }
  };

  // Update the handleSolvedOnChange function to properly handle date changes

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const formatDateToSolvedOn = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    const now = new Date();
    const time = now.toTimeString().split(" ")[0]; // current HH:mm:ss
    return `${day}-${month}-${year} ${time}`;
  };

  const getPaginatedData = () => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return data.slice(startIndex, endIndex);
  };

  const PaginationControls = () => (
    <div className="pagination-controls">
      <button
        className="pagination-button prev-next" // Added class for orange buttons
        onClick={() =>
          setPagination((prev) => ({
            ...prev,
            current: Math.max(prev.current - 1, 1),
          }))
        }
        disabled={pagination.current === 1}
      >
        Previous
      </button>
      <span>
        Page {pagination.current} of{" "}
        {Math.ceil(pagination.total / pagination.pageSize)}
      </span>
      <button
        className="pagination-button prev-next" // Added class for orange buttons
        onClick={() =>
          setPagination((prev) => ({
            ...prev,
            current: Math.min(
              prev.current + 1,
              Math.ceil(pagination.total / pagination.pageSize)
            ),
          }))
        }
        disabled={pagination.current * pagination.pageSize >= pagination.total}
      >
        Next
      </button>
      <select
        value={pagination.pageSize}
        onChange={(e) =>
          setPagination((prev) => ({
            ...prev,
            pageSize: Number(e.target.value),
            current: 1,
          }))
        }
      >
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
      </select>
    </div>
  );

  const handleUpdateTicket = async (item, gst_ticketId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/Ticket/approval1`,
        null, // No body
        {
          params: {
            id: gst_ticketId,
            approval: 1,
            createdby: localStorage.getItem("userName"),
            status: item.status,
            solvedon: item.solvedOn,
          },
        }
      );

      if (response.status === 200) {
        notification.success({
          message: "Success",
          description: `Ticket "${item.title}" updated successfully.`,
          duration: 2,
        });
        fetchData(); // Refresh data
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
      notification.error({
        message: "Error",
        description: "Failed to update ticket status.",
        duration: 3,
      });
    }
  };

  // const handleUpdateTicket = async (item, gst_ticketId) => {
  //   try {
  //     // Format the parameters as query string
  //     const params = new URLSearchParams();
  //     params.append("id", gst_ticketId);
  //     params.append("approval", 1);
  //     params.append("createdby", localStorage.getItem("userName"));
  //     params.append("status", item.status);

  //     // Format solvedOn date (date only, no time)
  //     let solvedOnDate = "";
  //     if (item.solvedOn) {
  //       // Extract just the date part (DD-MM-YYYY)
  //       solvedOnDate = item.solvedOn.split(" ")[0];
  //     } else {
  //       // Use current date if not set
  //       const today = new Date();
  //       const day = String(today.getDate()).padStart(2, "0");
  //       const month = String(today.getMonth() + 1).padStart(2, "0");
  //       const year = today.getFullYear();
  //       solvedOnDate = `${day}-${month}-${year}`;
  //     }

  //     params.append("solvedon", solvedOnDate);

  //     const requestUrl = `${API_URL}/api/Ticket/approval1?${params.toString()}`;
  //     console.log("Sending request to:", requestUrl); // For debugging

  //     const response = await axios.put(
  //       requestUrl,
  //       null, // No request body needed for query parameters
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       notification.success({
  //         message: "Success",
  //         description: `Ticket "${item.title}" updated successfully.`,
  //         duration: 2,
  //       });
  //       fetchData();
  //     } else {
  //       throw new Error("Update failed");
  //     }
  //   } catch (error) {
  //     console.error("Update Error:", error);
  //     notification.error({
  //       message: "Error",
  //       description:
  //         error.response?.data?.message || "Failed to update ticket status.",
  //       duration: 3,
  //     });
  //   }
  // };

  const handleSolvedOnChange = (index, newDate) => {
    const updated = [...data];

    if (newDate) {
      try {
        // Validate the date
        const dateObj = new Date(newDate);
        if (isNaN(dateObj.getTime())) {
          throw new Error("Invalid date");
        }

        // Convert from YYYY-MM-DD to DD-MM-YYYY
        const [year, month, day] = newDate.split("-");
        updated[index].solvedOn = `${day}-${month}-${year}`;
      } catch (error) {
        console.error("Invalid date:", error);
        // Handle error (maybe show notification to user)
      }
    } else {
      updated[index].solvedOn = ""; // or null if preferred
    }

    setData(updated);
  };

  const handlePreview = (files, fileIndex = 0) => {
    if (!files || files.length === 0) return;

    const file = files[fileIndex];
    if (file.fileType && file.fileType.startsWith("image/")) {
      setPreviewImage(`data:${file.fileType};base64,${file.fileData}`);
      setPreviewTitle(file.fileName);
      setCurrentFileIndex(fileIndex);
      setCurrentFiles(files);
      setPreviewVisible(true);
    } else {
      handleDownloadFile(file);
    }
  };

  const handleDownloadFile = (file) => {
    if (!file.fileData) {
      console.error(`No data for file: ${file.fileName}`);
      return;
    }

    let blob;
    let fileType = file.fileType || "application/octet-stream";

    if (file.fileData instanceof Blob) {
      blob = file.fileData;
    } else if (typeof file.fileData === "string") {
      const byteCharacters = atob(file.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: fileType });
    } else if (file.fileData instanceof ArrayBuffer) {
      blob = new Blob([file.fileData], { type: fileType });
    } else {
      console.error("Unsupported file format:", file.fileData);
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = (files) => {
    files.forEach((file, index) => {
      setTimeout(() => handleDownloadFile(file), index * 500);
    });
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };

  const handleNextPreview = () => {
    const nextIndex = (currentFileIndex + 1) % currentFiles.length;
    handlePreview(currentFiles, nextIndex);
  };

  const handlePrevPreview = () => {
    const prevIndex =
      (currentFileIndex - 1 + currentFiles.length) % currentFiles.length;
    handlePreview(currentFiles, prevIndex);
  };

  const handleSolvedByChange = (index, value) => {
    const updated = [...data];
    updated[index].solvedBy = value;
    const today = new Date().toISOString().split("T")[0];
    updated[index].solvedOn = today;
    setData(updated);
  };

  return (
    <div className="form-container" style={{ marginTop: "80px" }}>
      <span className="heading">Get in touch</span>
      <div className="tab-group">
        <button
          className={`tab-button ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Create Ticket
        </button>
        <button
          className={`tab-button ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          View Tickets
        </button>
        {user === "admin" && (
          <button
            className={`tab-button ${activeTab === "update" ? "active" : ""}`}
            onClick={() => setActiveTab("update")}
          >
            Update Status
          </button>
        )}
      </div>

      {activeTab === "create" && (
        <div className="form">
          <input
            placeholder="Title"
            type="text"
            name="title"
            className="input"
            value={form.title}
            onChange={handleChange}
          />
          <textarea
            placeholder="Description"
            rows="10"
            cols="30"
            name="message"
            className="textarea"
            value={form.message}
            onChange={handleChange}
          />
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ marginBottom: "20px", color: "white" }}
          />
          <div className="button-container">
            <div className="send-button" onClick={handleSubmit}>
              Send
            </div>
            <div className="reset-button-container">
              <div
                id="reset-btn"
                className="reset-button"
                onClick={handleReset}
              >
                Reset
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "view" && (
        <div className="form">
          <div className="ticket-table-container">
            {/* <PaginationControls /> */}
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created On</th>
                  <th>Solved On</th>
                  <th>Attachment</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData().map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>
                      <span
                        className={`status-badge status-${item.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.createdOn || "-"}</td>
                    <td>{item.solvedOn || "-"}</td>
                    <td>
                      {item.files && item.files.length > 0 ? (
                        <div className="file-actions">
                          <a
                            href="#"
                            className="download-link"
                            onClick={(e) => {
                              e.preventDefault();
                              if (item.files.length === 1) {
                                handlePreview(item.files);
                              } else {
                                handleDownloadAll(item.files);
                              }
                            }}
                          >
                            {item.files.length > 1
                              ? "Download All"
                              : "View/Download"}
                          </a>
                          {item.files.length > 1 && (
                            <a
                              href="#"
                              className="view-link"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePreview(item.files);
                              }}
                              style={{ marginLeft: "10px" }}
                            >
                              View
                            </a>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "#87a4b6" }}>No Files</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls />
          </div>
        </div>
      )}

      {activeTab === "update" && user === "admin" && (
        <div className="form">
          <div className="ticket-table-container">
            {/* <PaginationControls /> */}
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Attachment</th>
                  <th>Solved By</th>
                  <th>Solved On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData().map((item, index) => (
                  <tr key={item.gst_ticketId}>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(index, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Going On">Going On</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      {item.files && item.files.length > 0 ? (
                        <div className="file-actions">
                          <a
                            href="#"
                            className="download-link"
                            onClick={(e) => {
                              e.preventDefault();
                              if (item.files.length === 1) {
                                handlePreview(item.files);
                              } else {
                                handleDownloadAll(item.files);
                              }
                            }}
                          >
                            {item.files.length > 1
                              ? "Download All"
                              : "View/Download"}
                          </a>
                          {item.files.length > 1 && (
                            <a
                              href="#"
                              className="view-link"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePreview(item.files);
                              }}
                              style={{ marginLeft: "10px" }}
                            >
                              View
                            </a>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "#87a4b6" }}>No Files</span>
                      )}
                    </td>
                    <td>
                      <select
                        value={item.solvedBy}
                        onChange={(e) =>
                          handleSolvedByChange(index, e.target.value)
                        }
                      >
                        <option value="Admin">Admin</option>
                        <option value="Dev">Dev</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        value={
                          item.solvedOn
                            ? formatDateForInput(item.solvedOn)
                            : new Date().toISOString().split("T")[0]
                        }
                        onChange={(e) =>
                          handleSolvedOnChange(index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="action-button"
                        onClick={() =>
                          handleUpdateTicket(item, item.gst_ticketId)
                        }
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls />
          </div>
        </div>
      )}

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={[
          <button
            key="download"
            onClick={() => handleDownloadFile(currentFiles[currentFileIndex])}
          >
            Download
          </button>,
          <button
            key="prev"
            onClick={handlePrevPreview}
            disabled={currentFiles.length <= 1}
          >
            Previous
          </button>,
          <button
            key="next"
            onClick={handleNextPreview}
            disabled={currentFiles.length <= 1}
          >
            Next
          </button>,
          <button key="cancel" onClick={handleCancelPreview}>
            Close
          </button>,
        ]}
        onCancel={handleCancelPreview}
        width="80%"
        style={{ top: 20 }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            alt={previewTitle}
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
            src={previewImage}
          />
          <div style={{ marginTop: "10px" }}>
            File {currentFileIndex + 1} of {currentFiles.length}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Ticket;
