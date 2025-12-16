// script.js
async function sendMessage() {
  try {
    const input = document.getElementById("userInput");
    const chat = document.getElementById("chat");

    if (!input || !chat) {
      alert("HTML elements not found!");
      return;
    }

    const userText = input.value;
    if (userText.trim() === "") return;
    
    // 1. Display the User message immediately
    chat.innerHTML += `<div class="message user">${userText}</div>`;
    input.value = "";
    
    // 2. Create the Bot container and display a Typing Indicator
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'message bot';
    // Use a special class for the typing animation
    botMessageDiv.innerHTML = '<span class="typing-indicator">...</span>'; 
    chat.appendChild(botMessageDiv);

    // Auto-scroll down to show the new messages and indicator
    chat.scrollTop = chat.scrollHeight;

    // 3. Call your Node.js backend
    const response = await fetch(
      "http://localhost:3000/chat", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userText 
        })
      }
    );

    const data = await response.json();

    const aiReply = data.reply || "Error: No response received from the server.";
    
    // 4. Replace the Typing Indicator with the actual AI Reply
    botMessageDiv.innerHTML = aiReply;
    botMessageDiv.classList.remove('typing'); // Remove any typing-related class if we added one

    // Auto-scroll down again
    chat.scrollTop = chat.scrollHeight;

  } catch (error) {
    console.error("Fetch Error:", error);
    // Display error message in the bot's container if it exists, otherwise use alert
    if (botMessageDiv) {
        botMessageDiv.innerHTML = "An error occurred, check console/server logs.";
    } else {
        alert("An error occurred. Check Console (F12) or Server logs.");
    }
  }
}