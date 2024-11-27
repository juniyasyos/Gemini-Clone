import { createContext, useState, useEffect } from "react";
import runChat from "../config/Gemini.js";

// Helper function untuk format response
const formatResponse = (response) => {
  let responseArray = response.split("**");
  let formattedResponse = "";

  for (let i = 0; i < responseArray.length; i++) {
    formattedResponse +=
      i % 2 === 0 ? responseArray[i] : `<b>${responseArray[i]}</b>`;
  }

  return formattedResponse.split("*").join("<br/>");
};

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [error, setError] = useState(null);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 10 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResults(false);
    setResultData("");
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      const lastResponse = chatHistory
        .slice()
        .reverse()
        .find((item) => item.role === "model")?.content;

      if (!lastResponse) return;
      const formattedResponse = formatResponse(lastResponse);
      setResultData("");
      const responseCharacters = formattedResponse.split("");
      responseCharacters.forEach((char, i) => delayPara(i, char));
    }
  }, [chatHistory]);

  const onSent = async (prompt) => {
    const message = prompt || input;
    if (!message.trim()) return;

    const lastUserMessage = chatHistory
      .slice()
      .reverse()
      .find((item) => item.role === "user")?.content;

    if (lastUserMessage === message) {
      return;
    }

    setInput(message);
    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: message, timestamp: Date.now() },
    ]);
    setRecentPrompt(message);
    setShowResults(true);
    setLoading(true);

    try {
      await runChat({
        prompt: message,
        chatHistory,
        setChatHistory,
        setIsLoading: setLoading,
        setError,
      });
    } catch (error) {
      console.error("Error while running chat:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
	  setInput("")
    }
  };

  const contextValue = {
    chatHistory,
    setChatHistory,
    onSent,
    setRecentPrompt,
    recentPrompt,
    input,
    setInput,
    showResults,
    loading,
    resultData,
    error,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
