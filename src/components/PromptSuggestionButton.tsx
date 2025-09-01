

const PromptSuggestionButton = ({text,onClick}:PromptSuggestionButtonProps) => {
    return (
        <button className="prompt-suggestion-button px-4 py-2 cursor-pointer
        rounded-full  bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-200
        hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out"
        onClick={onClick}
        >
            {text}
        </button>
    );
}
export default PromptSuggestionButton;