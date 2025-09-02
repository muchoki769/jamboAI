
import LoadingBubble from "./loadingBubble";

const Bubble = ({message}:BubbleProps) => {
    const {content, role} = message;
    const isUser = role === "user";
    return (
          <div className={`flex w-full mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
             <div 
             className={`px-4 py-3 max-w-xs md:max-w-md rounded-2xl shadow-md text-sm md:text-base break-words ${
                isUser
                 ? "bg-blue-600 text-white rounde-br-none"
                 :"bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
             >
                {role === "assistant" && content === "_loading_" ? (
                    <LoadingBubble/>
                ) : (
                    content
                )
            }

            </div>
          </div>
    )
}
export default Bubble;