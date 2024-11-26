import { useContext } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { Context } from "../../context/Context";
const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResults,
    loading,
    chatHistory,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  const handleCardClick = (promptText) => {
    setInput(promptText);
  };
  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user} alt="" />
      </div>
      <div className="main-container">
        {!showResults ? (
          <>
            <div className="greet">
              <p>
                <span>Hello , Dev </span>
              </p>
              <p>How Can i Help You Today?</p>
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() =>
                  handleCardClick("Suggest Some Place To Visit In India.")
                }
              >
                <p>Suggest Some Place To Visit In India.</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Explain the process of photosynthesis in simple terms"
                  )
                }
              >
                <p>Explain the process of photosynthesis in simple terms </p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "How do you create a responsive navbar using CSS and JavaScript?"
                  )
                }
              >
                <p>
                  How do you create a responsive navbar using CSS and
                  JavaScript?
                </p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() => {
                  handleCardClick(
                    "What are some essential skills for becoming a front-end developer?"
                  );
                }}
              >
                <p>
                  What are some essential skills for becoming a front-end
                  developer?
                </p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            {chatHistory.map((chat, index) => (
              <div key={index} className="result-item">
                <div className="result-title">
                  <img
                    src={
                      chat.role === "user" ? assets.user : assets.gemini_icon
                    }
                    alt={chat.role === "user" ? "User Icon" : "Gemini Icon"}
                  />
                  {chat.role === "model" && !loading ? (
                    <div className="result-data">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: chat.content,
                        }}
                      ></p>
                    </div>
                  ) : (
                    <p>{chat.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Loader untuk AI Response */}
            {loading && (
              <div className="result-data">
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
              type="text"
              placeholder="Enter the Prompt Here"
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img
                src={assets.send_icon}
                alt=""
                onClick={() => {
                  onSent();
                }}
              />
            </div>
          </div>
          <div className="bottom-info">
            <p>
              Gemini may display inaccurate info, including about people, so
              double-check its responses. Your privacy & Gemini Apps
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
