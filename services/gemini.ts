import { api } from './api';

export async function getInitialGreeting(): Promise<string> {
  try {
    const response = await api.get<{ text: string }>('/api/chat/greeting');
    return response.text;
  } catch (error) {
     console.error("Error fetching greeting:", error);
     // Provide a fallback greeting
     return "Bem-vindo(a) ao Assistente de Pós-Cuidado da Maddock Tattoo! Como posso ajudar com sua nova tatuagem ou piercing hoje?";
  }
}

export async function generateChatResponse(prompt: string): Promise<string> {
   try {
    const response = await api.post<{ text: string }>('/api/chat', { prompt });
    return response.text;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente mais tarde.";
  }
}
