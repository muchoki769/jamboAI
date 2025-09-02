"use client";

import { Message, useChat } from "ai/react";
import Image from "next/image";
import PromptSuggestionsRow from "./PromptSuggestionsRow";
import Bubble from "./Bubble";
import LoadingBubble from "./loadingBubble";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function HomePage () {
  const {append,messages, input, handleInputChange, handleSubmit} = useChat()
  const noMessages = !messages || messages.length === 0 ;
  const router = useRouter();

  const handlePrompt = (promptText: string) => {
     const msg:Message = {
        id: crypto.randomUUID(),
        content: promptText,
        role: "user",
      }
      append(msg)
  }
   

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4  bg-gray-100 w-full ">
    
        <Image
        src="/icon-512.png"
        alt="JamboAI"
        width={200}
        height={200}
        className="mx-auto my-4"
      />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
          <div  className="max-w-3xl mx-auto text-center px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Your Personal Health Assistant is Here!
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-700 leading-relaxed">
              Ask<span className="font-semibold  p-1 text-blue-600">jamboAI</span>anything about
        your health and wellness, and it will provide personalized, evidence-based answers.
            </p>
            <p className="mt-2 text-base text-gray-600">
              Get instant guidance on symptoms, nutrition, fitness, and mental wellbeing. 
            </p>
          
          </div>
          <br />
          <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ): (
          <>
           {messages.map((message, index) => <Bubble key={`message-${index}`} message = {message}/>)}

          {messages.length > 0 && messages[messages.length - 1].role==="user" && (
            <LoadingBubble />
          )}
            
          </>
        )}
        </section>
         <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full px-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me something...."/> */}
          <input className="flex rounded-2xl bg-gray-100 border border-gray-300 
          py-4 px-16 text-ls shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition  m-4"
          onChange={handleInputChange} value={input} placeholder="Ask me something...."/>

          <button className="rounded-2xl sm:w-auto cursor-pointer bg-gray-600 text-white font-semibold 
          py-4 px-8 shadow-md hover:bg-gray-700 active:scale-95 transition duration-200
          " 
          type="submit">Send</button>
         </div>
        </form>
    </div>
  )
}