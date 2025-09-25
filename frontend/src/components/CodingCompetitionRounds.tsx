import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, ChevronRight, Code, Zap, Brain } from "lucide-react";

interface CodingCompetitionRoundsProps {
  specifications: string[];
}

export const CodingCompetitionRounds = ({ specifications }: CodingCompetitionRoundsProps) => {
  const rounds = [
    {
      id: "01",
      title: "MCQ Challenge",
      duration: "30 Minutes",
      description: "Multiple Choice Questions (MCQs) based on basic C programming concepts.",
      topics: ["C Syntax & Fundamentals", "Control Structures", "Memory Management"],
      icon: Code,
      accent: "text-blue-600 dark:text-blue-400",
      borderAccent: "border-blue-500/20"
    },
    {
      id: "02",
      title: "Basic DSA", 
      duration: "45 Minutes",
      description: "Questions will cover fundamental Data Structures and Algorithms, up to the Linked List level.",
      topics: ["Arrays & Stacks", "Queues Implementation", "Linked Lists"],
      icon: Brain,
      accent: "text-purple-600 dark:text-purple-400",
      borderAccent: "border-purple-500/20"
    },
    {
      id: "03",
      title: "Advanced DSA",
      duration: "45 Minutes", 
      description: "Problem-solving questions of medium to hard difficulty, covering topics up to Graphs and Basic Dynamic Programming.",
      topics: ["Graph Algorithms", "Dynamic Programming", "Complex Problem Solving"],
      icon: Zap,
      accent: "text-orange-600 dark:text-orange-400",
      borderAccent: "border-orange-500/20"
    }
  ];

  return (
    <Card className="festival-card mx-0 sm:mx-0 overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-muted/30 to-muted/10">
        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          Competition Structure
          <Badge variant="outline" className="ml-auto text-xs">
            Sequential Rounds
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {rounds.map((round, index) => {
          const IconComponent = round.icon;
          return (
            <div key={round.id} className="group relative">
              {/* Connecting line */}
              {index < rounds.length - 1 && (
                <div className="absolute left-8 top-16 w-px h-8 bg-border opacity-30" />
              )}
              
              <div className={`
                relative p-5 rounded-xl bg-muted/20 border-l-3 ${round.borderAccent}
                hover:bg-muted/30 hover:shadow-sm transition-all duration-200
                group-hover:border-l-4
              `}>
                {/* Round Badge */}
                <div className="absolute -left-3 top-6">
                  <div className="w-6 h-6 bg-background border-2 border-border rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">{round.id}</span>
                  </div>
                </div>
                
                <div className="ml-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted/50 ${round.accent}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-base sm:text-lg">
                          Round {round.id} – {round.title}
                        </h3>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {round.duration}
                    </Badge>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed pl-11">
                    {round.description}
                  </p>
                  
                  {/* Topics */}
                  <div className="pl-11 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <div className="w-4 h-px bg-border"></div>
                      Key Topics
                    </div>
                    <div className="grid gap-1">
                      {round.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center gap-2 text-sm">
                          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                          <span className="text-muted-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Footer Note */}
        <div className="mt-8 p-4 bg-muted/20 rounded-lg border-l-3 border-l-primary/30">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Sequential Progression:</span> Complete each round successfully to advance. Only qualified participants proceed to the next challenge.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
