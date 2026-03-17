const chatContainer = document.getElementById("chat-container");
const inputField = document.getElementById("user-input");

function addMessage(text, className) {
  const message = document.createElement("div");

  message.classList.add("message", className);

  message.innerHTML = marked.parse(text);

  chatContainer.appendChild(message);

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const userText = inputField.value.trim();

  if (userText === "") return;

  addMessage(userText, "user");

  inputField.value = "";

  addMessage("Typing...", "bot");

  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userText }),
  });

  const data = await response.json();

  chatContainer.lastChild.remove();

  addMessage(data.reply, "bot");
}

inputField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
