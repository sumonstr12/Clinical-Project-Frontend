import Toastify from "toastify-js";
// import "toastify-js/src/toastify.css";

function earlierUpdate(msg) {
    Toastify({
        text: `🔄 ${msg}`,
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        className: "update-toast",
        style: {
            background: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
            color: "#ffffff",
            borderRadius: "30px",
            padding: "12px 25px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 25px rgba(243, 156, 18, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            letterSpacing: "0.3px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            margin: "0 auto",
            zIndex: 9999,
            textTransform: "none",
            backdropFilter: "blur(10px)"
        },
        onClick: function() {} // Callback after click
    }).showToast();
}

// Alternative version with different styling
function earlierUpdateAlt(msg) {
    Toastify({
        text: `⚠️ ${msg}`,
        duration: 3500,
        gravity: "top",
        position: "center",
        className: "update-toast-alt",
        style: {
            background: "#2c3e50",
            color: "#ecf0f1",
            borderRadius: "8px",
            padding: "14px 28px",
            fontSize: "15px",
            fontWeight: "400",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
            borderLeft: "4px solid #f39c12",
            letterSpacing: "0.3px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "420px",
            margin: "20px auto 0",
            zIndex: 9999,
            fontFamily: "'Inter', -apple-system, sans-serif"
        },
        onClick: function() {} // Callback after click
    }).showToast();
}

// Version with more detailed update information
function earlierUpdateDetailed(title, description) {
    Toastify({
        text: `<div style="display: flex; flex-direction: column; gap: 5px;">
            <strong style="font-size: 15px; color: #f39c12;">🔄 ${title}</strong>
            <span style="font-size: 13px; opacity: 0.9;">${description}</span>
        </div>`,
        duration: 4000,
        gravity: "top",
        position: "center",
        className: "update-toast-detailed",
        escapeMarkup: false, // Allow HTML
        style: {
            background: "rgba(44, 62, 80, 0.95)",
            color: "#ffffff",
            borderRadius: "12px",
            padding: "15px 25px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(243, 156, 18, 0.3)",
            backdropFilter: "blur(15px)",
            maxWidth: "450px",
            margin: "10px auto",
            zIndex: 9999,
            textAlign: "left",
            lineHeight: "1.5"
        },
        onClick: function() {} // Callback after click
    }).showToast();
}

// Example usage function
function showUpdateExamples() {
    // Simple update
    earlierUpdate("Profile information has been updated");
    
    // Alternative style update
    earlierUpdateAlt("Your settings have been saved successfully");
    
    // Detailed update
    earlierUpdateDetailed(
        "Profile Updated", 
        "Your profile information has been successfully updated in our system"
    );
    
    // Different update messages for various scenarios
    earlierUpdate("Password changed successfully");
    earlierUpdate("Email preferences updated");
    earlierUpdate("Account settings have been modified");
    earlierUpdate("New features are now available");
    earlierUpdate("Your subscription has been updated");
}

export { earlierUpdate, earlierUpdateAlt, earlierUpdateDetailed, showUpdateExamples };