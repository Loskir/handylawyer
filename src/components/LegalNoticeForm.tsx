import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface LegalNoticeFormProps {
  onSubmit: (data: { country: string; problem: string }) => void;
  isLoading?: boolean;
}

export const LegalNoticeForm = ({ onSubmit, isLoading = false }: LegalNoticeFormProps) => {
  const [country, setCountry] = useState("Netherlands");
  const [problem, setProblem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ country, problem });
  };

  return (
    <div className="flex justify-center w-full my-8">
      <Card className="w-full max-w-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">
            Generate Your Legal Notice
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Fill in the details below to get your customized legal notice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={country}
                onValueChange={setCountry}
                disabled={isLoading}
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
                Currently, we only support legal notices for the Netherlands.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="problem">Describe Your Problem</Label>
              <Textarea
                id="problem"
                placeholder="Please describe your legal situation in detail..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                disabled={isLoading}
                required
              />
              <p className="text-sm text-muted-foreground">
                Be as specific as possible to get the most accurate legal notice.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:scale-[1.02]"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Legal Notice"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 