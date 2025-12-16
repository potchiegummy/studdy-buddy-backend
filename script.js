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

    chat.innerHTML += `<div class="message user">${userText}</div>`;
    input.value = "";

    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'message bot';
    botMessageDiv.innerHTML = '<span class="typing-indicator">...</span>'; 
    chat.appendChild(botMessageDiv);

    chat.scrollTop = chat.scrollHeight;

    const response = await fetch(
      "https://studdy-buddy-ai-zpbg.onrender.com/chat", 
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

    botMessageDiv.innerHTML = aiReply;
    botMessageDiv.classList.remove('typing');

    chat.scrollTop = chat.scrollHeight;

  } catch (error) {
    console.error("Fetch Error:", error);
    
    // Attempt to display error in the last bot message container
    const botMessageDiv = document.querySelector('.message.bot:last-child');
    if (botMessageDiv) {
        botMessageDiv.innerHTML = "An error occurred, please check console/server logs.";
    } else {
        alert("An error occurred. Check Console (F12) or Server logs.");
    }
  }
}