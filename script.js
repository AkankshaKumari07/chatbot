const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;

//API KEY 
const API_KEY = "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";

//textarea scrollheight
const inputInitialHeight = chatInput.scrollHeight

//created outgoing chat 
const createchatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};


// Generated incomming chat 

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  //send post request to API, get response
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.classList.add('error')
      messageElement.textContent =
        "Oops! Something went wrong. Pease try again. ";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};


//height of textarea
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height=`${inputInitialHeight}px`

  //Append the user's message to tthe chatbox
  chatbox.appendChild(createchatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);


  setTimeout(() => {
    //Display "Thinking... message while waiting for the response"
    const incomingChatLi = createchatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
  }, 600);
};

chatInput.addEventListener("input", ()=>{
  // Adjust the height of the input textarea based on its content 
     chatInput.style.height=`${inputInitialHeight}px`;
     chatInput.style.height=`${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) =>{
  //If Enter key is pressed without Shift key and the window 
  // width is greater than 800px, handle the chat 
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
    e.preventDefault()
    handleChat()

  }
});


sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);

// close button in mobile view 
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);


