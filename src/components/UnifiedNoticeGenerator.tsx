import { useState, useRef, FormEvent, useEffect } from 'react';
import { Message } from 'ai';
import { useChat } from '@ai-sdk/react';

// UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, RefreshCw, Send, User } from 'lucide-react';

interface NoticeResponse {
  status: 'success' | 'insufficient_data' | 'error';
  message?: string;
  data?: {
    notice: string;
    generatedAt: string;
  };
}

interface UnifiedNoticeGeneratorProps {
  onReset?: () => void;
}

export const UnifiedNoticeGenerator = ({ 
  onReset
}: UnifiedNoticeGeneratorProps) => {
  const [country, setCountry] = useState("Netherlands");
  const [problem, setProblem] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<NoticeResponse | null>(null);
  
  // Initialize chat with system message
  const systemMessage: Message = {
    id: 'system-1',
    content: 'I am your payment default notice assistant. I\'ll help you create a professional notice of default for missing payments based on your situation.',
    role: 'system'
  };
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit,
    isLoading: isChatLoading,
    append,
  } = useChat({
    api: '/api/chat',
    initialMessages: [systemMessage],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parse the latest assistant message to check for notice data
    const lastAssistantMessage = [...messages]
      .reverse()
      .find(m => m.role === 'assistant');
      
    if (lastAssistantMessage && showForm === false) {
      try {
        // Try to parse the message content as JSON
        const messageContent = lastAssistantMessage.content as string;
        if (messageContent.includes('{') && messageContent.includes('}')) {
          // Extract JSON part from the message
          const jsonMatch = messageContent.match(/```json\n([\s\S]*?)\n```/) || 
                           messageContent.match(/{[\s\S]*?}/);
                           
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0].replace(/```json\n|\n```/g, ''));
            if (jsonData.notice) {
              setResponse({
                status: 'success',
                data: {
                  notice: jsonData.notice,
                  generatedAt: new Date().toLocaleString()
                }
              });
              return;
            }
          }
        }
        
        // If we can't find a JSON structure but have a message, check for specific phrases
        if (messageContent.includes("insufficient") || messageContent.includes("more information")) {
          setResponse({
            status: 'insufficient_data',
            message: messageContent
          });
          return;
        }
        
        // Default case - show as success with the message content as notice
        if (messageContent.includes("NOTICE") || messageContent.includes("Notice")) {
          setResponse({
            status: 'success',
            data: {
              notice: messageContent,
              generatedAt: new Date().toLocaleString()
            }
          });
        }
      } catch (error) {
        console.error('Error parsing assistant response:', error);
      }
    }
  }, [messages, showForm]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create initial user message with form data
      await append({
        content: `I need a payment default notice for a situation in ${country}. The problem is: ${problem}. Please format your response as a formal legal notice and include the full notice text.`,
        role: 'user',
      });
      
      // Hide the form after submitting
      setShowForm(false);
    } catch (error) {
      console.error('Error generating payment default notice:', error);
      setResponse({
        status: 'error',
        message: 'An error occurred while generating the notice. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle chat submission
  const onChatFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // The useChat hook will handle the message updates
    handleSubmit(e);
    
    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleReset = () => {
    setResponse(null);
    setShowForm(true);
    if (onReset) onReset();
  };

  const hasGeneratedNotice = response?.status === 'success';
  const needsMoreContext = response?.status === 'insufficient_data';
  const isProcessing = isLoading || isChatLoading;

  return (
    <div className="flex justify-center w-full my-8">
      <Card className="w-full max-w-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">
            {showForm ? "Generate Your Payment Default Notice" : (
              <div className="flex items-center justify-center gap-2">
                <Bot className="h-5 w-5" />
                Legal Notice Assistant
              </div>
            )}
          </CardTitle>
          {showForm && (
            <CardDescription className="text-center text-muted-foreground">
              Fill in the details below to create a notice for missing payments
            </CardDescription>
          )}
          {!showForm && response && (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="text-muted-foreground flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Start Over
              </Button>
            </div>
          )}
        </CardHeader>

        {showForm ? (
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={country}
                  onValueChange={setCountry}
                  disabled={isProcessing}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Netherlands" className="font-medium">
                      Netherlands
                    </SelectItem>
                    <SelectItem 
                      value="USA" 
                      disabled 
                      className="text-muted-foreground cursor-not-allowed"
                    >
                      USA (Coming Soon)
                    </SelectItem>
                    <SelectItem 
                      value="UK" 
                      disabled 
                      className="text-muted-foreground cursor-not-allowed"
                    >
                      UK (Coming Soon)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Currently, we only support payment default notices for the Netherlands.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem">Describe the Payment Issue</Label>
                <Textarea
                  id="problem"
                  placeholder="Describe the missing payment situation (e.g., invoice details, amount owed, due date)..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  disabled={isProcessing}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Include specific details like invoice numbers, payment amounts, and deadlines for the most effective notice.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full transition-all duration-200 hover:scale-[1.02]"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Payment Default Notice"
                )}
              </Button>
            </form>
          </CardContent>
        ) : (
          <>
            <CardContent className="p-0">
              <ScrollArea 
                className="h-[400px] p-4" 
                ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
              >
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    if (message.role === 'system') return null;

                    console.log(message)
                    
                    return (
                      <div 
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`flex gap-2 max-w-[80%] ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          } rounded-lg p-3`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {message.role === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {needsMoreContext && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-2">
                      <p className="text-sm text-amber-800">
                        Please provide more specific details about your situation to generate a more accurate legal notice.
                      </p>
                    </div>
                  )}

                  {hasGeneratedNotice && (
                    <div className="flex justify-start w-full -mt-2">
                      <div className="max-w-[90%] bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="mb-2 font-semibold text-green-800 flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          Generated Legal Notice
                        </div>
                        <div className="font-mono whitespace-pre-wrap text-sm border rounded-md p-3 bg-white">
                          {response.data?.notice}
                        </div>
                        <div className="text-right text-xs text-muted-foreground mt-2">
                          Generated at: {response.data?.generatedAt}
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => window.print()}>
                            Print
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              if (response.data?.notice) {
                                navigator.clipboard.writeText(response.data.notice);
                              }
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <CardFooter className="p-4 pt-0">
                <form onSubmit={onChatFormSubmit} className="flex w-full gap-2">
                  <Input
                    placeholder="Add more context about your situation..."
                    value={input}
                    onChange={handleInputChange}
                    ref={inputRef}
                    className="flex-1"
                    disabled={isProcessing}
                  />
                  <Button type="submit" size="icon" disabled={isProcessing || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}; 