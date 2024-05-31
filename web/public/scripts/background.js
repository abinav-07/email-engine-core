const BASEURL="http://localhost:5000/v1"

chrome.runtime.onMessage.addListener((message) => {
  if (message) {

    // Send to backend in chunks
    fetch(`${BASEURL}/admin/pages/create`, {
        method: "POST",
        body: JSON.stringify(message),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response from backend:", data)
        })
        .catch((error) => {
          console.error("Error sending:", error);
        })
    
  }
})
