import React from "react";
import { ChatMessage } from "../types";
import { useState } from "react";
interface ChatProps {
  messages: ChatMessage[];
  handleSendMessage: (message: string) => void;
}

export default function Chat(props: ChatProps) {
  const [chatInput, setChatInput] = useState("");
  console.log(props);

  const handleSendChat = () => {
    props.handleSendMessage(chatInput);
  };
  return (
    <>
      <h1>chat</h1>
      <input type="text" onChange={(e) => setChatInput(e.target.value)} />
      <button onClick={handleSendChat}>Send</button>
      {props.messages.map((message, index) => (
        <React.Fragment key={index}>
          {message.user.id === "system" ? (
            <p>{message.message}</p>
          ) : (
            <h4>
              {message.user.name}: {message.message}
            </h4>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
