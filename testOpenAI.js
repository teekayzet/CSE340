// testOpenAI.js
const { callGPT } = require('./services/openaiService');

(async () => {
  const promptContent = "Hello, how are you?";
  const systemContent = "You are a helpful assistant.";
  const previousChat = "";

  const response = await callGPT(promptContent, systemContent, previousChat);
  console.log(response);
})();
