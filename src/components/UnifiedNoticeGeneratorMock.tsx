import { useState, useRef, FormEvent, useEffect } from 'react';
import { Message } from 'ai';

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

// Mock data for demonstration
const mockScenario = {
  initialUserMessage: "I paid for website development services but haven't received anything yet.",
  assistantFollowUp: `Could you please provide some more information regarding your case?

What is the full name and (business) address of the recipient (DigitalCustoms)?

Is DigitalCustoms a registered business (KvK number or VAT number)?

Do you have proof of payment (e.g. bank transfer or transaction ID)?

Was the agreement confirmed in writing (e.g. by email)?

What are your own full name and contact details (to include in the letter)?

What is your IBAN?`,
  userDetailedResponse: "The blog is called DigitalCustoms. I don’t know their full legal name or business address, but they operate through their website and Instagram page. I’m not sure if they’re officially registered, as I couldn’t find a KvK or VAT number. I paid them via bank transfer and have the transaction receipt with the date and amount. Our agreement was made through email, where they confirmed the service details and acknowledged the payment. My full name is Ignat Mamedov and my IBAN is NL 58 999493",
};

export const UnifiedNoticeGenerator = ({ 
  onReset
}: UnifiedNoticeGeneratorProps) => {
  const [country, setCountry] = useState("Netherlands");
  const [problem, setProblem] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<NoticeResponse | null>(null);
  const [mockStage, setMockStage] = useState(0);
  const [input, setInput] = useState('');
  
  // Initialize with system message
  const systemMessage: Message = {
    id: 'system-1',
    content: 'I am your payment default notice assistant. I\'ll help you create a professional notice of default for missing payments based on your situation.',
    role: 'system'
  };
  
  const [messages, setMessages] = useState<Message[]>([systemMessage]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  // Handle form submission for the mock scenario
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Show the chat interface
      setShowForm(false);
      
      // For the mock scenario, add initial user message
      const initialUserMsg: Message = {
        id: 'user-1',
        content: mockScenario.initialUserMessage,
        role: 'user'
      };
      
      // Update messages with the initial user message
      setMessages([systemMessage, initialUserMsg]);
      
      // Set mock stage to 1 (waiting for assistant follow-up)
      setMockStage(1);
      
      // Simulate assistant typing delay
      setTimeout(() => {
        // Add assistant follow-up message
        const assistantFollowUpMsg: Message = {
          id: 'assistant-1',
          content: mockScenario.assistantFollowUp,
          role: 'assistant'
        };
        
        setMessages(prev => [...prev, assistantFollowUpMsg]);
        setMockStage(2); // Now waiting for user detailed response
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error in mock scenario:', error);
      setIsLoading(false);
    }
  };

  // Handle chat submission for the mock scenario
  const onChatFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() && mockStage !== 2) return;
    
    if (mockStage === 2) {
      // Use the predefined user response regardless of what was typed
      setIsLoading(true);
      
      // Add the detailed user response
      const userDetailedMsg: Message = {
        id: 'user-2',
        content: mockScenario.userDetailedResponse,
        role: 'user'
      };
      
      // Update messages
      setMessages(prev => [...prev, userDetailedMsg]);
      setInput(''); // Clear input
      
      // Simulate assistant typing delay
      setTimeout(() => {
        // Generate the notice
        setResponse({
          status: 'success',
          data: {
            notice: 'true',
            generatedAt: new Date().toLocaleString()
          }
        });
        
        setMockStage(3); // Completed scenario
        setIsLoading(false);
      }, 2000);
    } else {
      // Normal handling for other stages
      const userInput = input;
      setInput('');
      
      // Add user message
      const userMsg: Message = {
        id: `user-${messages.length}`,
        content: userInput,
        role: 'user'
      };
      
      setMessages(prev => [...prev, userMsg]);
    }
    
    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleReset = () => {
    setResponse(null);
    setShowForm(true);
    setMockStage(0);
    setMessages([systemMessage]);
    setInput('');
    if (onReset) onReset();
  };

  const hasGeneratedNotice = response?.status === 'success';
  const needsMoreContext = mockStage === 2;
  const isProcessing = isLoading;

  return (
    <div className={"flex justify-center w-full my-8 mx-auto" + (showForm ? " max-w-2xl" : "")}>
      <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
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
          {!showForm && (
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
                className="p-4" 
                ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
              >
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    if (message.role === 'system') return null;
                    
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
                          Here is your notice
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <a href='/sommatiebrief_digitalcustoms.pdf' target='_blank'>Download</a>
                          </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <CardFooter className="p-4 pt-0">
                <form onSubmit={onChatFormSubmit} className="flex w-full gap-2">
                  <Input
                    placeholder={mockStage === 2 ? "Respond with details about your case..." : "Type a message..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    ref={inputRef}
                    className="flex-1"
                    disabled={isProcessing || mockStage === 3}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isProcessing || (mockStage !== 2 && !input.trim())}
                  >
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