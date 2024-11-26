async function runChat({
  prompt,
  chatHistory,
  setChatHistory,
  setIsLoading,
  setError,
}) {
  if (!prompt || !prompt.trim()) {
    setError("Prompt cannot be empty.");
    return;
  }

  setError(null);
  setIsLoading(true);

  const userMessage = {
    role: "user",
    content: prompt.trim(),
    timestamp: Date.now(),
  };

  try {
    const response = await fetch("http://127.0.0.1:4100/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage.content,
        history: chatHistory.slice(-5),
      }),
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch response: ${response.statusText}`);
    }

    const data = await response.json();

    const aiResponse = {
      role: "model",
      content: data.message,
      timestamp: Date.now(),
    };

    setChatHistory((prev) => {
      const updatedHistory = [...prev, aiResponse];
      console.log("updated chatHistory after AI response:", updatedHistory);
      return updatedHistory;
    });
  } catch (err) {
    console.error("Error during chat interaction:", err);
    setError("An error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
}

export default runChat;

