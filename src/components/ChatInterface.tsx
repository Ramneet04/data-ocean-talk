import { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onQuery: (query: string) => void;
  selectedFloat: string | null;
}

export const ChatInterface = ({ onQuery, selectedFloat }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI oceanography assistant. Ask me anything about ARGO float data from the Indian Ocean. For example:\n\n• "Show salinity near equator in March 2023"\n• "Compare oxygen levels at 100m vs 500m depth"\n• "Plot temperature changes in Arabian Sea"',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample AI responses for demonstration
  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('salinity')) {
      return `I found salinity data matching your query. The average salinity in the specified region ranges from 34.2 to 35.8 PSU. Here's what the data shows:\n\n• Surface salinity: 34.5-35.2 PSU\n• Deep water salinity: 34.8-35.8 PSU\n• Seasonal variation: ±0.3 PSU\n\nI've updated the visualization below to show this data.`;
    }
    
    if (lowerQuery.includes('temperature')) {
      return `Temperature analysis complete! The data shows:\n\n• Surface temperature: 26-29°C\n• Thermocline depth: 50-150m\n• Deep water temperature: 2-4°C\n\nThe temperature profile indicates typical tropical ocean stratification. Check the charts below for detailed analysis.`;
    }
    
    if (lowerQuery.includes('oxygen')) {
      return `Oxygen level analysis:\n\n• Surface oxygen: 4.5-5.2 ml/L\n• Oxygen minimum zone: 200-800m depth\n• Minimum oxygen: 0.1-0.5 ml/L\n\nThis data shows the characteristic oxygen minimum zone of the Indian Ocean. The visualization has been updated to reflect these findings.`;
    }
    
    if (selectedFloat) {
      return `Based on float ${selectedFloat}, I can provide specific data analysis. What parameters would you like me to examine? Available data includes:\n\n• Temperature profiles\n• Salinity measurements\n• Oxygen concentrations\n• Pressure/depth readings\n• Time series data`;
    }
    
    return `I understand you're asking about: "${query}". I can help you analyze ARGO float data including temperature, salinity, oxygen, and pressure measurements. Try being more specific about:\n\n• Geographic region\n• Time period\n• Depth range\n• Parameters of interest`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    onQuery(inputValue);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 border border-border rounded-lg mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={message.sender === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-accent'}>
                    {message.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-[80%]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing data...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about temperature, salinity, oxygen levels, or specific floats..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!inputValue.trim() || isLoading}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};