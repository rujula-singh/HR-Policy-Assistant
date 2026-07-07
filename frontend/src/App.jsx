import React from 'react';
import { useState } from 'react'
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { v4 as uuidv4 } from "uuid"
/**
 * Main Application Component (UI Demo Only)
 * 
 * NOTE: As requested, this file does not implement active state management, hooks, or backend logic.
 * Toggle the `SHOW_EMPTY_STATE` constant below to see how the interface renders 
 * before a chat starts (EmptyState with suggested questions) versus during an active conversation.
 */


export default function App() {

  //for the user input
  let [input,setInput] = useState("");
  const [messages,setMessages] = useState([]);
  const [loading,setLoading] = useState(false);

  // UI-only placeholders for props to be wired up by the user
  const handleSelectQuestion = (questionText) => {
    //console.log(`UI Event: Clicked suggested question: "${questionText}"`);
    input = questionText;
    getResponse();
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const getResponse = async() => {
    try{
    if(input !== ""){
      let newArray = [...messages,{
        id:uuidv4(),
        sender:'user',
        text:input,
        timestamp:new Date().toISOString()
      }
    ];
      setMessages(newArray);
      setInput("");
      setLoading(true);
    const response = await fetch("http://127.0.0.1:8000/ask",{
        method:'POST',
        headers:{
        'Content-Type':'application/json'
       },
       body:JSON.stringify({
         question:input
      })
      })

      if(!response.ok){
        throw new Error("Failed to get response");
      }
      console.log(response)
      const data = await response.json();
      console.log(data)
      newArray = [...newArray,{
        id:uuidv4(),
        sender:"assistant",
        text:data.answer,
        timestamp:new Date().toISOString()
      }];
      setMessages(newArray);
      setLoading(false);
    } 
  }
    catch(err){
      console.error(err);
    }
  }
const handleFormSubmit = async(e) => {
  e.preventDefault();
  getResponse();
  };

const handleDeleteChat = () => {
  setInput("");
  setMessages([]);
  setLoading(false);
  console.log("hello")
}  

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 1. Header Area */}
      <Header />

      {/* 2. Chat Area (Scrollable conversation section) */}
      <ChatWindow 
        messages = {messages}
        isLoading={loading} // Display the typing indicator at the end of the conversation demo
        onSelectQuestion={handleSelectQuestion}
        onDeleteChat={handleDeleteChat}
      />

      {/* 3. Input Area */}
      <ChatInput 
        value={input}// UI placeholder value
        onChange={handleInputChange}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
