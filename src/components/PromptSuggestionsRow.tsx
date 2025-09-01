import PromptSuggestionButton from "./PromptSuggestionButton";


const PromptSuggestionsRow = ({onPromptClick}: PromptSuggestionRowProps) => {
    const prompts = [
        "What are the symptoms of seasonal allergies?",
        "How can I improve my sleep quality?",
        "Suggest a healthy meal plan for weight loss",
        "What exercises are good for lower back pain?",
        "How to manage stress and anxiety?",
        "What are the benefits of intermittent fasting?",
        "How to recognize signs of dehydration?",
        "What's a good workout routine for beginners?",
        "How to lower blood pressure naturally?",
        "What are common migraine triggers?"
    ]
    return (
        <div className="max-w-3xl mx-auto mt-6 px-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Try asking:</h2>
            <div className="flex flex-wrap gap-3"> 
            {prompts.map((prompt, index) => 
            <PromptSuggestionButton
             key={`suggestion-${index}`}
              text={prompt}
              onClick={() => onPromptClick(prompt)}
            />)}
            </div>
        </div>
    )
}
export default PromptSuggestionsRow;