import React, { FormEvent, LegacyRef, RefObject, useEffect } from "react";
import { ChatMessage } from "../types";
import { useState, useLayoutEffect, useRef } from "react";
import useStayScrolled from "react-stay-scrolled";
import "../styles/Chat.css";
import { Button, TextField } from "@mui/material";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
interface ChatProps {
  messages: ChatMessage[];
  handleSendMessage: (message: string) => void;
  roomCode: string;
}

export default function Chat(props: ChatProps) {
  const [chatInput, setChatInput] = useState("");
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const messagesRef: RefObject<HTMLDivElement> = useRef(null);
  const { stayScrolled, scrollBottom } = useStayScrolled(messagesRef);
  const scrollRef: LegacyRef<HTMLDivElement> = useBottomScrollListener(() => setIsScrolledToBottom(true));

  useLayoutEffect(() => {
    if (!isScrolledToBottom) {
      stayScrolled();
    } else {
      scrollBottom();
    }
  }, [props.messages.length]);

  const handleSendChat = () => {
    props.handleSendMessage(chatInput);
  };

  useEffect(() => {}, [props.messages]);

  const formatDate = (timestamp: string) => {
    const mili = parseInt(timestamp) * 1000;
    const date = new Date(mili);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const amPm = hours >= 12 ? "PM" : "AM";
    const timeString = formattedHours + ":" + formattedMinutes + " " + amPm;
    return timeString;
  };

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatInput.trim() !== "") {
      handleSendChat();
      setChatInput("");
    }
  };

  return (
    <>
      <div id="chat-container">
        <div id="chat-header">
          <p>Chat</p>
        </div>
        <div ref={scrollRef}>
          <div id="messages-container" ref={messagesRef}>
            {props.messages.map((message, index) => (
              <React.Fragment key={index}>
                {message.user.id === "system" ? (
                  <p className="system-message">{message.message}</p>
                ) : (
                  <div className={index % 2 === 0 ? "user-message even-message" : "user-message odd-message"}>
                    <p className="message-info">
                      {message.user.name} <span className="message-timestamp">{formatDate(message.timestamp)}</span>
                    </p>
                    <p className="message-content">{message.message}</p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <form onSubmit={handleChatSubmit}>
          <div id="chat-input-container">
            <div id="chat-input">
              <TextField onChange={(e) => setChatInput(e.target.value)} id="text-input" value={chatInput} variant="standard" size="small" fullWidth />
            </div>
            <Button type="submit" size="large">
              Send
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
