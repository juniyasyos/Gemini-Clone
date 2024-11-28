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
    // const authToken_js = "!zdmAjA0FUCHeB#iIe'z3_A|t2X8OU']D>{k\#Z6";
    // const authToken_py = "2lX8Hg$r&J(/n+E<^AT4&@3mffZW2N)g2P0$@";
    

    // const response = await fetch("http://127.0.0.1:4100/gemini", {
    const response = await fetch("<url-api-python>/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
