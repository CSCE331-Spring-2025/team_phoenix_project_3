var speechOn = false;

function scrollModuleToBottom() {
  var chatModule = document.querySelector('.chat-module');
  chatModule.scrollTop = chatModule.scrollHeight;
}

function sendInput() {
  const inputElt = document.querySelector('[data-role="user-input"]');
  const prompt = inputElt.value.trim();
  if (!prompt) return;

  toggleInput(false);
  const thread = document.querySelector('.thread');
  const userItem = createThreadItem(false, prompt);
  thread.appendChild(userItem);
  inputElt.value = '';
  scrollModuleToBottom();

  fetch('/chat/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
    .then(res => res.json())
    .then(data => showResponse(data.reply))
    .catch(() => showResponse("Sorry, I couldn't think of anything!"));
}

function createThreadItem(isBot, text = '') {
  const threadItem = document.createElement('div');
  threadItem.classList.add('thread-item');

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.textContent = isBot ? '🧋' : '😊';

  const responseContainer = document.createElement('div');
  responseContainer.classList.add('response-container');
  if (!isBot) responseContainer.classList.add('user');

  const response = document.createElement('div');
  response.classList.add('response');
  if (!isBot) response.textContent = text;

  responseContainer.appendChild(response);
  threadItem.appendChild(avatar);
  threadItem.appendChild(responseContainer);

  return threadItem;
}

function showResponse(response) {
  const thread = document.querySelector('.thread');
  const botItem = createThreadItem(true);
  const responseEl = botItem.querySelector('.response');
  thread.appendChild(botItem);
  scrollModuleToBottom();

  if (speechOn && 'speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance(response);
    window.speechSynthesis.speak(speech);
  }

  let charsCompleted = 0;
  const intervalID = setInterval(() => {
    if (charsCompleted >= response.length) {
      toggleInput(true);
      manageChatOverlay();
      clearInterval(intervalID);
    } else {
      const span = document.createElement('span');
      span.classList.add('char');
      span.innerHTML = response[charsCompleted++] === ' ' ? '&nbsp;' : response[charsCompleted - 1];
      responseEl.appendChild(span);
    }
  }, 5);
}

function manageChatOverlay() {
  const overlay = document.querySelector('.scroll-overlay');
  const chatModule = document.querySelector('.chat-module');
  if (chatModule.scrollTop > 0) {
    overlay.classList.remove('overlay-hidden');
  } else {
    overlay.classList.add('overlay-hidden');
  }
}

function toggleInput(enabled) {
  const input = document.querySelector('[data-role="user-input"]');
  input.disabled = !enabled;
  if (enabled) input.focus();
}
