// export {};

declare global {
    interface Message {
        id: string;
        text: string;
        sender: "user" | "assistant";
        timestamp?:number;
    }
}

interface BubbleProps {
    message:Message;
}

interface PromptSuggestionRowProps {
    // suggestion: string;
    onPromptClick: (promptText: string) => void;
}

type PromptSuggestionButtonProps = {
    onClick: () => void;
    text: string;
};


