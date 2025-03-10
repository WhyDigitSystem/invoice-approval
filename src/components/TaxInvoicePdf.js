import DownloadIcon from "@mui/icons-material/Download";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { notification } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import logo from "../logo.png";
import {
  getIRNDetails,
  getIRNGridDetails,
  getIRNJobContDetails,
  getIRNJobDetails,
  getIRNQRbyDocNo,
} from "../services/api";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { toWords } from "number-to-words";

const TaxInvoicePdf = ({ docNo, row, callBackFunction, modalClose }) => {
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [data, setData] = useState("");
  const [gridData, setGridData] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const { documentNumber } = useParams();
  const [detailsData, setDetailsData] = useState([]);
  const [qrData, setQRData] = useState("");
  const [jobData, setJobData] = useState([]);
  const [jobContData, setJobContData] = useState([]);
  const [jobFormData, setJobFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobContFormData, setJobContFormData] = useState([]);

  useEffect(() => {
    getIRNDetails(documentNumber)
      .then((response) => {
        setData(response);
        const formattedData = formatInvoiceData(response);
        setInvoiceData(formattedData.slice(0, 1));
      })
      .catch((error) => {
        notification.error({
          message: "Failed to fetch Branches",
          description: "Error occurred while fetching branch names.",
        });
        setLoading(false);
      });
  }, [documentNumber]);

  useEffect(() => {
    getIRNJobDetails(documentNumber)
      .then((response) => {
        setJobData(response);
        const formattedData = formatJobInvoiceData(response);
        setJobFormData(formattedData);
      })
      .catch((error) => {
        notification.error({
          message: "Failed to fetch JobDetails details",
          description: "Error occurred while fetching JobDetails details.",
        });
        setLoading(false);
      });
  }, [documentNumber]);

  useEffect(() => {
    getIRNQRbyDocNo(documentNumber)
      .then((response) => {
        setQRData(response);
      })
      .catch((error) => {
        notification.error({
          message: "Failed to fetch Grid Details",
          description: "Error occurred while fetching grid details.",
        });
      });
  }, [documentNumber]);

  useEffect(() => {
    getIRNGridDetails(documentNumber)
      .then((response) => {
        setGridData(response);
        const formattedGridData = formatInvoiceDetailsData(response);
        setDetailsData(formattedGridData);
      })
      .catch((error) => {
        notification.error({
          message: "Failed to fetch Grid Details",
          description: "Error occurred while fetching grid details.",
        });
      });
  }, [documentNumber]);

  const styles = {
    container: {
      textAlign: "center",
      margin: "20px 0",
      position: "relative",
      fontFamily: "Arial, sans-serif",
    },
    beforeAfter: {
      content: '""',
      position: "absolute",
      top: "50%",
      width: "40%",
      height: "2px",
      backgroundColor: "#333",
    },
    before: {
      left: "0",
    },
    after: {
      right: "0",
    },
    text: {
      display: "inline-block",
      padding: "0 15px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000000",
      borderRadius: "5px",
    },
  };

  const styles1 = {
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      columnGap: "20px",
      fontSize: "12px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "5px",
    },
    label: {
      fontWeight: "bold",
    },
    value: {
      marginLeft: "10px",
    },
  };

  const styles2 = {
    container: {
      fontSize: "12px",
      margin: "20px 0",
    },
    heading: {
      marginBottom: "10px",
      textDecoration: "underline",
      fontSize: "14px",
    },
    item: {
      margin: "5px 0",
    },
    label: {
      fontWeight: "bold",
    },
  };

  const handleDownloadPdftest = async () => {
    const input = document.getElementById("pdf-content");
    if (input) {
      // Wait for all images (including the QR code) to load
      const images = input.getElementsByTagName("img");
      const imagePromises = Array.from(images).map((img) => {
        if (!img.complete) {
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Handle broken images
          });
        }
        return Promise.resolve();
      });

      await Promise.all(imagePromises);

      // Capture the content with html2canvas
      const canvas = await html2canvas(input, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Enable cross-origin images
      });

      const imgData = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Tax-Invoice_${documentNumber}.pdf`);
      modalClose();
    } else {
      console.error("Element not found: 'pdf-content'");
    }
  };

  const handleDownloadPdf = async () => {
    const input = document.getElementById("pdf-content");
    if (input) {
      const images = input.getElementsByTagName("img");
      const imagePromises = Array.from(images).map((img) => {
        if (!img.complete) {
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Handle broken images
          });
        }
        return Promise.resolve();
      });

      await Promise.all(imagePromises);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Function to split content into chunks
      const splitContentIntoChunks = async (element, chunkHeight) => {
        const chunks = [];
        let position = 0;

        while (position < element.scrollHeight) {
          // Create a temporary container for the chunk
          const chunk = document.createElement("div");
          chunk.style.width = `${element.clientWidth}px`;
          chunk.style.height = `${chunkHeight}px`;
          chunk.style.overflow = "hidden";
          chunk.style.position = "absolute";
          chunk.style.top = `-${position}px`;
          chunk.style.left = "0";

          // Clone the content and apply a transform to shift it
          const contentClone = element.cloneNode(true);
          contentClone.style.transform = `translateY(-${position}px)`;
          chunk.appendChild(contentClone);

          // Append the chunk to the body (temporarily)
          document.body.appendChild(chunk);

          // Capture the chunk with html2canvas
          const canvas = await html2canvas(chunk, {
            scale: 2,
            useCORS: true,
          });

          // Remove the temporary chunk
          document.body.removeChild(chunk);

          // Add the canvas image data to the chunks array
          chunks.push(canvas.toDataURL("image/png"));

          // Move to the next chunk
          position += chunkHeight;
        }

        return chunks;
      };

      // Calculate the height of each chunk (in pixels)
      const chunkHeight = pageHeight * 3.78; // Convert mm to pixels (1mm = 3.78px)

      // Split the content into chunks
      const chunks = await splitContentIntoChunks(input, chunkHeight);

      // Add each chunk to the PDF
      for (let i = 0; i < chunks.length; i++) {
        if (i > 0) {
          pdf.addPage(); // Add a new page for each chunk after the first
        }

        const imgData = chunks[i];
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      }

      // Save the PDF
      pdf.save(`Tax-Invoice_${documentNumber}.pdf`);
      modalClose();
    } else {
      console.error("Element not found: 'pdf-content'");
    }
  };

  const handleDownloadPdf4 = async () => {
    const input = document.getElementById("pdf-content");
    if (input) {
      // Ensure all images are loaded
      const images = input.getElementsByTagName("img");
      const imagePromises = Array.from(images).map((img) => {
        if (!img.complete) {
          return new Promise((resolve) => {
            img.onload = resolve;
          });
        }
        return Promise.resolve();
      });

      await Promise.all(imagePromises);

      // Capture the entire content
      const canvas = await html2canvas(input, {
        scrollY: -window.scrollY,
        scale: 2, // Increase scale for better quality
        useCORS: true, // Enable cross-origin images
      });

      const imgData = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Split content into multiple pages if it's too tall
      const pageHeight = pdf.internal.pageSize.getHeight();
      let position = 0;

      while (position < imgHeight) {
        if (position > 0) {
          pdf.addPage(); // Add a new page if needed
        }
        pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
        position += pageHeight;
      }

      // Save the PDF
      pdf.save(`Tax-Invoice_${documentNumber}.pdf`);
      modalClose();
    } else {
      console.error("Element not found: 'pdf-content'");
    }
  };

  const handleDownloadPdf3 = async () => {
    const input = document.getElementById("pdf-content");
    if (input) {
      // Ensure all images are loaded
      const images = input.getElementsByTagName("img");
      const imagePromises = Array.from(images).map((img) => {
        if (!img.complete) {
          return new Promise((resolve) => {
            img.onload = resolve;
          });
        }
        return Promise.resolve();
      });

      await Promise.all(imagePromises);

      // Capture the full content
      const canvas = await html2canvas(input, {
        scrollY: -window.scrollY,
        scale: 2, // Increase scale for better quality
        useCORS: true, // Enable cross-origin images
      });

      const imgData = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Tax-Invoice_${documentNumber}.pdf`);
      modalClose();
    } else {
      console.error("Element not found: 'pdf-content'");
    }
  };
  const handleDownloadPdf2 = async () => {
    const input = document.getElementById("pdf-content");
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`Tax-Invoice_${documentNumber}.pdf`);
      modalClose();
      // handleClose();
    } else {
      console.error("Element not found: 'pdf-content'");
    }
  };

  const handleDownloadPdf1 = async () => {
    const input = document.getElementById("pdf-content");
    if (!input) {
      console.error("Element not found: 'pdf-content'");
      return;
    }

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10; // Margin in mm
      const contentWidth = pageWidth - 2 * margin; // Adjust content width for margins

      // Function to calculate the height of the content
      const getContentHeight = (element) => {
        return element.scrollHeight;
      };

      // Function to split content into pages
      const splitContent = async (element, offsetY) => {
        const canvas = await html2canvas(element, {
          scale: 2, // Increase scale for better quality
          useCORS: true, // Enable CORS for external images
          windowHeight: pageHeight,
          windowWidth: pageWidth,
          y: offsetY, // Start capturing from this Y position
          height: pageHeight, // Capture only one page height
        });

        const imgData = canvas.toDataURL("image/png", 1.0);
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          contentWidth,
          0,
          undefined,
          "FAST"
        );
      };

      // Calculate total height of the content
      const totalHeight = getContentHeight(input);
      let offsetY = 0;

      // Loop through the content and split it into pages
      while (offsetY < totalHeight) {
        if (offsetY > 0) {
          pdf.addPage(); // Add a new page for the next section
        }
        await splitContent(input, offsetY);
        offsetY += pageHeight; // Move to the next section
      }

      // Save the PDF
      pdf.save(`Tax-Invoice_${documentNumber}.pdf`);

      // Close the modal if the callback function is provided
      if (typeof modalClose === "function") {
        modalClose();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      notification.error({
        message: "Failed to generate PDF",
        description: "An error occurred while generating the PDF.",
      });
    }
  };
  //   const handleDownloadPdf = async () => {
  //     const input = document.getElementById("pdf-content");
  //     if (!input) {
  //       console.error("Element not found: 'pdf-content'");
  //       return;
  //     }

  //     try {
  //       const pdf = new jsPDF("p", "mm", "a4");
  //       const pageHeight = pdf.internal.pageSize.getHeight();
  //       const pageWidth = pdf.internal.pageSize.getWidth();
  //       const margin = 10; // Margin in mm
  //       const contentWidth = pageWidth - 2 * margin; // Adjust content width for margins

  //       // Function to split content into pages
  //       const splitContent = async (element, offsetY) => {
  //         const canvas = await html2canvas(element, {
  //           scale: 2, // Increase scale for better quality
  //           useCORS: true, // Enable CORS for external images
  //           windowHeight: element.scrollHeight,
  //           windowWidth: element.scrollWidth,
  //           y: offsetY, // Start capturing from this Y position
  //           height: pageHeight, // Capture only one page height
  //         });

  //         const imgData = canvas.toDataURL("image/png", 1.0);
  //         pdf.addImage(
  //           imgData,
  //           "PNG",
  //           margin,
  //           margin,
  //           contentWidth,
  //           0,
  //           undefined,
  //           "FAST"
  //         );
  //       };

  //       // Calculate total height of the content
  //       const totalHeight = input.scrollHeight;
  //       let offsetY = 0;

  //       // Loop through the content and split it into pages
  //       while (offsetY < totalHeight) {
  //         if (offsetY > 0) {
  //           pdf.addPage(); // Add a new page for the next section
  //         }
  //         await splitContent(input, offsetY);
  //         offsetY += pageHeight; // Move to the next section
  //       }

  //       // Save the PDF
  //       pdf.save(`Tax-Invoice_${documentNumber}.pdf`);

  //       // Close the modal if the callback function is provided
  //       if (typeof modalClose === "function") {
  //         modalClose();
  //       }
  //     } catch (error) {
  //       console.error("Error generating PDF:", error);
  //       notification.error({
  //         message: "Failed to generate PDF",
  //         description: "An error occurred while generating the PDF.",
  //       });
  //     }
  //   };

  //   const handleDownloadPdf = async () => {
  //     const input = document.getElementById("pdf-content");
  //     if (!input) {
  //       console.error("Element not found: 'pdf-content'");
  //       return;
  //     }

  //     try {
  //       const pdf = new jsPDF("p", "mm", "a4");
  //       const pageHeight = pdf.internal.pageSize.getHeight();
  //       const pageWidth = pdf.internal.pageSize.getWidth();
  //       const margin = 10; // Margin in mm
  //       const contentWidth = pageWidth - 2 * margin; // Adjust content width for margins

  //       // Function to split content into pages
  //       const splitContent = async (element, offsetY) => {
  //         const canvas = await html2canvas(element, {
  //           scale: 2, // Increase scale for better quality
  //           useCORS: true, // Enable CORS for external images
  //           windowHeight: element.scrollHeight,
  //           windowWidth: element.scrollWidth,
  //           y: offsetY, // Start capturing from this Y position
  //           height: pageHeight, // Capture only one page height
  //         });

  //         const imgData = canvas.toDataURL("image/png", 1.0);
  //         pdf.addImage(
  //           imgData,
  //           "PNG",
  //           margin,
  //           margin,
  //           contentWidth,
  //           0,
  //           undefined,
  //           "FAST"
  //         );
  //       };

  //       // Calculate total height of the content
  //       const totalHeight = input.scrollHeight;
  //       let offsetY = 0;

  //       // Loop through the content and split it into pages
  //       while (offsetY < totalHeight) {
  //         if (offsetY > 0) {
  //           pdf.addPage(); // Add a new page for the next section
  //         }
  //         await splitContent(input, offsetY);
  //         offsetY += pageHeight; // Move to the next section
  //       }

  //       // Save the PDF
  //       pdf.save(`Tax-Invoice_${documentNumber}.pdf`);

  //       // Close the modal if the callback function is provided
  //       if (typeof modalClose === "function") {
  //         modalClose();
  //       }
  //     } catch (error) {
  //       console.error("Error generating PDF:", error);
  //       notification.error({
  //         message: "Failed to generate PDF",
  //         description: "An error occurred while generating the PDF.",
  //       });
  //     }
  //   };

  const numberToWordsIndian = (number) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (number === 0) return "Zero";

    let words = "";

    // Handle Crore
    if (Math.floor(number / 10000000) > 0) {
      words += numberToWordsIndian(Math.floor(number / 10000000)) + " Crore ";
      number %= 10000000;
    }

    // Handle Lakh
    if (Math.floor(number / 100000) > 0) {
      words += numberToWordsIndian(Math.floor(number / 100000)) + " Lakh ";
      number %= 100000;
    }

    // Handle Thousand
    if (Math.floor(number / 1000) > 0) {
      words += numberToWordsIndian(Math.floor(number / 1000)) + " Thousand ";
      number %= 1000;
    }

    // Handle Hundred
    if (Math.floor(number / 100) > 0) {
      words += numberToWordsIndian(Math.floor(number / 100)) + " Hundred ";
      number %= 100;
    }

    // Handle Tens and Units
    if (number > 0) {
      if (number < 10) {
        words += units[number];
      } else if (number < 20) {
        words += teens[number - 10];
      } else {
        words += tens[Math.floor(number / 10)];
        if (number % 10 > 0) {
          words += " " + units[number % 10];
        }
      }
    }

    return words.trim();
  };

  // Usage

  const formatInvoiceDetailsData = (gridData) => {
    if (!gridData || !Array.isArray(gridData)) {
      return [];
    }

    return gridData.map((item) => ({
      docNo: item.docNo?.trim() || "N/A",
      docDt: item.docDt?.trim() || "N/A",
      sno: item.sno?.trim() || "N/A",
      containerNo: item.cont,
      pkgs: item.pkgs?.trim() || "N/A",
      chargeDetails: [
        {
          sac: item.gChargeCode?.trim(),
          details: item.chargeName?.trim(),
          currency: item.curr?.trim(),
          exRate: item.exRate?.trim(),
          applyOn: item.applyOn?.trim(),
          qty: item.qty?.trim(),
          rate: item.rate?.trim(),
          fcAmount: item.fcAmt?.trim(),
          gst: item.gst?.trim(),
          amount: item.amount?.trim(),
          gstP: item.gstType?.trim(),
        },
      ],
    }));
  };

  const formatJobInvoiceData = (data) => {
    return jobData.map((item) => ({
      jobNumber: item.jobNo,
      jobDate: item.jobDt,
      houseNo: item.hNo,
      houseDate: item.hDt,
      masterNo: item.mNo,
      masterDt: item.mDt,
      chwt: item.chwt,
      grwt: item.grwt,
      pkgs: item.pkgs,
      containerNo: "",
      billOfEntry: "",
      goodsDesc: "",
      nCurr: item.nCurr,
      exRate: item.exRate,
      totalAmount: item.totalInvoiceValue || "N/A",
      amountInWords: item.totalInvoiceValue || "N/A",
      remarks: "Shipment Ref No:",
      shipperInvoiceNo: item.sinv || "N/A",
      sqr: item.sqr,
      printedOn: new Date().toLocaleString(),
    }));
  };

  const formatInvoiceData = (data) => {
    return data.map((item) => ({
      invoiceNo: item.documentNumber,
      invoiceDate: item.documentDate?.split(" ")[0] || "N/A",
      ackNo: item.ackNo || "N/A",
      irnNo: item.irnId || "N/A",
      name: item.recipientLegalName || "N/A",
      gstn: item.recipientGSTIN || "N/A",
      address: item.recipientAddress || "N/A",
      placeOfSupply: item.placeOfSupply || "N/A",
      dueDate: "27/03/2025",
      totalAmount: item.totalInvoiceValue || "N/A",
      amountInWords: item.totalInvoiceValue || "N/A",
      remarks: "Shipment Ref No:",
      shipperInvoiceNo: item.sinv || "N/A",
      sqr: item.sqr,
      printedOn: new Date().toLocaleString(),
      bankDetails: {
        bankName: "HDFC BANK LIMITED",
        accountCode: "UM LMD",
        beneficiaryName: "UNIVORLD LOGISTICS PVT LTD",
        branch: "KORAMANGALA, BENGALURU",
        ifsc: "HDFC0000053",
        accountNo: "00530330000072",
        accountType: "CURRENT ACCOUNT",
      },
      termsAndConditions: [
        "OUR LIABILITY IS RESTRICTED AND LIMITED TO STANDARD TRADING CONDITIONS OF FEDERATIONS OF FREIGHT FORWARDERS ASSOCIATIONS IN INDIA OF WHICH WE ARE MEMBERS, COPIES OF STANDARD TRADING CONDITIONS ARE AVAILABLE ON REQUEST.",
        "INTEREST WILL BE CHARGED AT 16% PER ANNUM FOR ALL PAYMENTS RECEIVED ON OR AFTER DUE DATE AS MENTIONED ABOVE.",
        "CHEQUE / DD SHOULD BE IN FAVOUR OF UNIVORLD LOGISTICS PRIVATE LIMITED.",
      ],
    }));
  };

  modalClose = () => {
    window.history.back(); // Takes the user to the previous page
  };

  useEffect(() => {
    if (invoiceData.length > 0) {
      setOpen(true);
    }
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const formattedTime = now.toLocaleTimeString("en-GB");
    setCurrentDateTime(`${formattedDate} ${formattedTime}`);
  }, [invoiceData]);

  if (!invoiceData || invoiceData.length === 0) {
    return null; // Render nothing until data is loaded
  }

  return (
    <Dialog
      open={open}
      onClose={modalClose}
      maxWidth="md"
      fullWidth
      onEntered={handleDownloadPdf}
    >
      <DialogTitle style={{ fontWeight: "bold" }}></DialogTitle>
      <DialogContent>
        <div
          id="pdf-content"
          style={{
            padding: "20px",
            backgroundColor: "#f9f9f9",
            width: "210mm",
            height: "auto",
            margin: "auto",
            fontFamily: "Roboto, Arial, sans-serif",
            position: "relative",
          }}
        >
          {/* QR Code */}

          <div>
            <img src={logo} style={{ marginLeft: "10px" }} alt="Your Image" />
            <div
              style={{
                marginLeft: "250px",
                marginTop: "-60px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <QRCodeCanvas value={qrData.sqr || "N/A"} size={140} />
              </div>
              <p style={{ marginLeft: "-230px" }}>Tax Invoice</p> <br />
              UNIWORLD LOGISTICS PRIVATE LIMITED
              <br /> CIN: U63090TN2002PTC048430 <br />B 405/406 SAKAR - NEHRU
              BRIDGE CORNER, <br />
              ASHRAM ROAD, AHMEDABAD 380 009
              <br /> GSTN: 24AAACU5187H128
            </div>
          </div>
          <br />
          {invoiceData.map((item, index) => (
            <div key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "16px",
                  marginBottom: "20px",
                  paddingBottom: "10px",
                  color: "#333",
                }}
              >
                <div>
                  <div>
                    <strong>Invoice No:</strong> {item.invoiceNo}
                  </div>
                  <div>
                    <strong>Invoice Date: </strong> {item.invoiceDate}
                  </div>
                  <div>
                    <strong>AckNo: </strong> {item.ackNo}
                  </div>
                  <div>
                    <strong>IRN: </strong> {item.irnNo}
                  </div>
                </div>
                <div>{localStorage.getItem("branch")}</div>
              </div>
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#555",
                }}
              >
                <div>
                  <div>
                    <strong>Bill To</strong>
                  </div>
                  <div>{item.name}</div>
                  <div style={{ width: 300 }}>
                    <strong>Place of address:</strong>
                    <br />
                    <span
                      style={{ textWrap: "auto", textOverflow: "ellipsis" }}
                    >
                      {item.address}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div>
                    <strong>Due date:</strong> {item.dueDate}
                  </div>
                  <div>
                    <strong>Place Of Supply:</strong> {item.placeOfSupply}
                  </div>
                </div>
              </div>
              <div style={styles.container}>
                <div style={{ ...styles.beforeAfter, ...styles.before }} />
                <span style={styles.text}>
                  {invoiceData.gstType === "INTRA"
                    ? "Intra State GST"
                    : "Inter State GST"}
                </span>

                <div style={{ ...styles.beforeAfter, ...styles.after }} />
              </div>
              <div style={styles1.container}>
                <div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Job Number / Dt. :</span>
                    <span style={styles1.value}>
                      {jobFormData[0]?.jobNumber || "N/A"}
                    </span>
                    <span style={styles1.value}>{jobFormData[0]?.jobDate}</span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Master No / Dt. :</span>
                    <span style={styles1.value}>
                      {jobFormData[0]?.masterNo}
                    </span>
                    <span style={styles1.value}>
                      {jobFormData[0]?.masterDt}
                    </span>
                    <span style={styles1.value}>
                      {jobFormData[0]?.flightNo}
                    </span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Currency :</span>
                    <span style={styles1.value}>{jobFormData[0]?.nCurr}</span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Ex. Rate :</span>
                    <span style={styles1.value}>{jobFormData[0]?.exRate}</span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Volume / Container No :</span>
                    <span style={styles1.value}>{detailsData.containerNo}</span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>IGM NO & Date :</span>
                    <span style={styles1.value}>
                      {jobContFormData.length > 0
                        ? `${jobContFormData[0].igmNo} ${jobContFormData[0].igmDt}`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>House No / Dt. :</span>
                    <span style={styles1.value}>{jobFormData[0]?.houseNo}</span>
                    <span style={styles1.value}>
                      {jobFormData[0]?.houseDate}
                    </span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Flight No./Vessel Name :</span>
                    <span style={styles1.value}>
                      {/* {jobContFormData[0].carrierNo} */}
                    </span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>ETD / ETA :</span>
                    <span style={styles1.value}>
                      {" "}
                      {jobContFormData.length > 0
                        ? jobContFormData[0].et
                        : "N/A"}
                    </span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Assessable Value :</span>
                    <span style={styles1.value}></span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Pkgs/Ch.Wt/Gr.Wt (Kgs.):</span>
                    <span style={styles1.value}>
                      {jobFormData[0]?.pkgs} / {jobFormData[0]?.chwt} /{" "}
                      {jobFormData[0]?.grwt}
                    </span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Bill of Entry/ S B No :</span>
                    <span style={styles1.value}></span>
                  </div>
                  <div style={styles1.row}>
                    <span style={styles1.label}>Goods Desc :</span>
                    <span style={styles1.value}>
                      {jobContFormData.length > 0
                        ? jobContFormData[0].hItemDesc
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "20px",
                  fontSize: "12px",
                  border: "1px solid #000000",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      SAC
                    </th>
                    <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      Details
                    </th>
                    <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      Cur
                    </th>
                    <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      Ex.Rt
                    </th>
                    <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      Apply On
                    </th>
                    <th style={{ border: "1px solid #000000", padding: "8px" }}>
                      Qty
                    </th>
                    <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      Rate
                    </th>
                    <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      FC Amount
                    </th>
                    <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      Tax %
                    </th>
                    {/* <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      GST
                    </th> */}
                    <th
                      style={{ border: "1px solid #000000", padding: "10px" }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detailsData.length > 0 ? (
                    detailsData.map((charge, chargeIndex) =>
                      charge.chargeDetails.map((chargeDetail, index) => (
                        <tr key={`${chargeIndex}-${index}`}>
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.sac}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.details}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.currency}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.exRate}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.applyOn}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.qty}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.rate}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.fcAmount}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.gstP}
                          </td>
                          {/* <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.gst}
                          </td> */}
                          <td
                            style={{
                              border: "1px solid #000000",
                              padding: "10px",
                            }}
                          >
                            {chargeDetail.amount}
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        style={{ textAlign: "center", padding: "10px" }}
                      >
                        No charges available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                Total:{" "}
                <span style={{ fontWeight: "normal" }}>{item.totalAmount}</span>
              </div>
              <div
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                Amount in words:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {numberToWordsIndian(item.amountInWords)}
                  {/* {toWords(parseFloat(item.amountInWords)).toUpperCase()} */}
                </span>
              </div>
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#555",
                }}
              >
                <div>
                  <strong>Remarks :</strong> {item.remarks}
                </div>
              </div>
              <div>
                <strong>Other Information :</strong>
              </div>
              <br />
              <div style={{ fontSize: "12px" }}>
                <strong>Terms And Conditions :</strong>
                <ol style={{ lineHeight: "1.6" }}>
                  {item.termsAndConditions.map((term, termIndex) => (
                    <li key={termIndex}>{term}</li>
                  ))}
                </ol>
              </div>
              <br />
              <div>
                <h4>Bank Details:</h4>
                BANK NAME: {item.bankDetails.bankName} <br />
                ACCOUNT CODE: {item.bankDetails.accountCode} <br />
                BENEFICIARY NAME: {item.bankDetails.beneficiaryName} <br />
                BRANCH: {item.bankDetails.branch} <br />
                IFSC: {item.bankDetails.ifsc} <br />
                ACCOUNT NO.: {item.bankDetails.accountNo} <br />
                ACCOUNT TYPE: {item.bankDetails.accountType}
              </div>
              <div
                style={{
                  textAlign: "Left",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#333",
                  marginTop: "10%",
                }}
              >
                Authorized Signatory
              </div>
              <div
                style={{
                  borderTop: "2px solid #000000",
                  paddingTop: "10px",
                  fontSize: "12px",
                  color: "#777",
                  textAlign: "center",
                  bottom: "0",
                  width: "100%",
                  marginTop: "5%",
                }}
              >
                <div
                  style={{
                    marginBottom: "20px",
                    textAlign: "left",
                    fontSize: "12px",
                    color: "#777",
                  }}
                >
                  <div>{currentDateTime}</div>
                  <div>Printed By: {localStorage.getItem("userName")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDownloadPdf}
          color="primary"
          variant="contained"
          startIcon={<DownloadIcon />}
        >
          PDF
        </Button>
        <Button onClick={modalClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaxInvoicePdf;
