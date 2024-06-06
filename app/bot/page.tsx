"use client";

import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const sessionId = uuidv4(); // Static session ID for the component instance
  const [loading, setLoading] = useState(false);
  const [preference, setPreference] = useState("serious"); // New state for preference

  const sendChat = async (message, preference) => {
    const { data } = await axios.post("/api/chat", { prompt: message, preference, sessionId });
    return data.response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateMessage = (res) => setMessages(prev => [...prev.slice(0, -1), { ...prev.at(-1), response: res, botResponse: !!res }]);

    setMessages(prev => [...prev, { message, response: "Loading...", botResponse: false }]);
    
    sendChat(message, preference).then(updateMessage).catch(() => updateMessage("Error: Unable to fetch response")).finally(() => setLoading(false));
  };

  return (
    <div className="container h-screen flex flex-col bg-black text-white-900 px-20 mx-auto">
      <h1 className="text-3xl font-bold pt-10">Chatbot</h1>
      <div className="flex flex-col flex-1 w-full mt-6 overflow-auto pb-10">
        {messages.map((msg, index) => (
          <div key={index} className="w-full my-2">
            <div className="p-2 bg-gray-200 rounded-lg text-black">{msg.message}</div>
            <div className="p-2 bg-gray-300 rounded-lg text-black mt-1 whitespace-pre-wrap">{msg.response}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="w-full py-5 flex items-center justify-center">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-3/4 p-2 border border-gray-300 text-black rounded-lg shadow-sm focus:outline-none"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className="w-1/4 ml-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          disabled={loading}
        >
          Send
        </button>
      </form>
      <div className="flex items-center justify-center py-5">
        <button
          onClick={() => setPreference("serious")}
          className={`mx-2 p-2 border ${preference === "serious" ? "border-blue-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none`}
        >
          Serious
        </button>
        <button
          onClick={() => setPreference("flirty")}
          className={`mx-2 p-2 border ${preference === "flirty" ? "border-blue-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none`}
        >
          Flirty
        </button>
      </div>
    </div>
  );
}
