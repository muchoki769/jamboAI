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


export interface ChatCompletionChunk {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: {
    delta: {
      content?: string;
      role?: "system" | "user" | "assistant" | "tool";
    };
    index: number;
    finish_reason: string | null;
  }[];
}
