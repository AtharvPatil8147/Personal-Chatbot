const chatContainer = document.getElementById("chat-container");
const inputField = document.getElementById("user-input");

function addMessage(text, className) {
  const message = document.createElement("div");

  message.classList.add("message", className);

  message.innerHTML = marked.parse(text);

  chatContainer.appendChild(message);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  return message;
}

async function sendMessage() {
  const userText = inputField.value.trim();

  if (userText === "") return;

  addMessage(userText, "user");

  inputField.value = "";

  // Create empty bot message for streaming
  const botMessage = document.createElement("div");
  botMessage.classList.add("message", "bot");
  chatContainer.appendChild(botMessage);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userText }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let fullText = "";

  while (true) {
const { done, value } = await reader.read();

if (done) break;

const chunk = decoder.decode(value);

fullText += chunk;

// Render markdown continuously
botMessage.innerHTML = marked.parse(fullText);

chatContainer.scrollTop = chatContainer.scrollHeight;;
  }
}

inputField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
