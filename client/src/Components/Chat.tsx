import React, { FormEvent, RefObject, useEffect } from "react";
import { ChatMessage } from "../types";
import { useState, useLayoutEffect, useRef } from "react";
import useStayScrolled from "react-stay-scrolled";
import "../styles/Chat.css";
import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ChatProps {
  messages: ChatMessage[];
  handleSendMessage: (message: string) => void;
  roomCode: string;
}

export default function Chat(props: ChatProps) {
  const [chatInput, setChatInput] = useState("");
  const [toolTipText, setToolTipText] = useState("Copy to clipboard");
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const messagesRef: RefObject<HTMLDivElement> = useRef(null);
  const { stayScrolled, scrollBottom } = useStayScrolled(messagesRef);

  const isBigScreen = useMediaQuery({ query: "(min-width: 950px)" });

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

  const handleCopyClick = () => {
    navigator.clipboard.writeText(props.roomCode);
    setToolTipText("Copied ✅");
  };

  const resetTooltip = () => {
    setTimeout(() => {
      setToolTipText("Copy to clipboard");
    }, 200);
  };

  const handleScroll = () => {
    const element = document.querySelector(".messages-scroll");
    if (!element) return false;

    setIsScrolledToBottom(Math.abs(element.scrollHeight - (element.scrollTop + element.clientHeight)) <= 1);
  };

  return (
    <>
      <div id={isBigScreen ? "chat-container" : "chat-container-small"}>
        <div id="chat-header">
          {isBigScreen ? (
            <p>Chat</p>
          ) : (
            <p>
              Lounge: {props.roomCode}{" "}
              <span onMouseLeave={resetTooltip}>
                <Tooltip title={toolTipText} arrow color="success">
                  <IconButton color="secondary" id="copy-button" size="large" onClick={handleCopyClick}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </span>
            </p>
          )}
        </div>

        <div
          onScroll={handleScroll}
          className="scroll-bar messages-scroll"
          id={isBigScreen ? "messages-container" : "messages-container-small"}
          ref={messagesRef}
          style={isBigScreen ? {} : { paddingBottom: "5vh" }}
        >
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
        <form onSubmit={handleChatSubmit}>
          <div id="chat-input-container" className={isBigScreen ? "" : "chat-input-container-small"}>
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
