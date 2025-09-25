import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  GraduationCap,
  BookOpen,
  Target,
  CheckCircle,
  UserPlus,
  Download
} from "lucide-react";
import { Event } from "@/data/events";
import { downloadRuleBook } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";
import { CodingCompetitionRounds } from "./CodingCompetitionRounds";

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
  onRegister?: () => void;
}

export const EventDetails = ({ event, onBack, onRegister }: EventDetailsProps) => {
  const { toast } = useToast();

  const handleDownloadRuleBook = () => {
    const success = downloadRuleBook(event);
    if (success) {
      toast({
        title: "Rule Book Downloaded",
        description: "Paper submission guidelines have been downloaded successfully!",
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Could not download the rule book. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <section className="pt-20 pb-8 sm:pt-32 sm:pb-20 px-2 sm:px-6 lg:px-8 min-h-screen flex justify-center">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">`
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="hover:bg-primary/20 w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {event.name === "Paper Presentation" && event.ruleBookFile && (
              <Button variant="outline" onClick={handleDownloadRuleBook} className="hidden sm:flex hover:bg-primary/10">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            )}
            {onRegister && (
              <Button onClick={onRegister} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Register Now
              </Button>
            )}
          </div>
        </div>

        {/* Event Title */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gradient px-1">
            {event.name}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 px-1">
            {event.department}
          </p>
          
          {/* Key Info */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-1">
            <Badge variant="secondary" className="flex items-center justify-center gap-2 px-3 py-2 text-sm sm:text-base mx-auto sm:mx-0 w-fit">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="text-center">
                {event.minTeamSize && event.minTeamSize > 1 
                  ? `${event.minTeamSize}-${event.maxTeamSize} Participants` 
                  : `Max ${event.maxTeamSize} ${event.maxTeamSize === 1 ? 'Participant' : 'Participants'}`
                }
              </span>
            </Badge>
            <Badge variant="outline" className="flex items-center justify-center gap-2 px-3 py-2 text-sm sm:text-base text-primary border-primary/30 mx-auto sm:mx-0 w-fit">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span>₹{event.entryFee}/- per participant</span>
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8">
          {/* Description */}
          {event.description && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Event Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Topics */}
          {event.topics && event.topics.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Topics (for Paper Presentation)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.topics.map((topic, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground leading-relaxed">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bot/Rocket Specifications */}
          {event.specifications && event.specifications.length > 0 && (
            event.id === "coding-competition" ? (
              <CodingCompetitionRounds specifications={event.specifications} />
            ) : (
              <Card className="festival-card mx-0 sm:mx-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.specifications.map((spec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-foreground text-sm sm:text-base leading-relaxed">{spec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )}

          {/* Construction Guidelines */}
          {event.constructionGuidelines && event.constructionGuidelines.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Construction Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.constructionGuidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground text-sm sm:text-base leading-relaxed">{guideline}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rules */}
          {event.rules && event.rules.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Rules & Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground text-sm sm:text-base leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gameplay */}
          {event.gameplay && event.gameplay.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Gameplay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.gameplay.map((game, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{game}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Testing Procedure */}
          {event.testingProcedure && event.testingProcedure.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Testing Procedure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.testingProcedure.map((procedure, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{procedure}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Safety Regulations */}
          {event.safetyRegulations && event.safetyRegulations.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  Safety Regulations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.safetyRegulations.map((safety, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{safety}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disqualification */}
          {event.disqualification && event.disqualification.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-red-500" />
                  Disqualification Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.disqualification.map((disqual, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-950/30 border border-red-800/50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-red-100">{disqual}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Themes (for Ideathon) */}
          {event.themes && event.themes.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Event Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.themes.map((theme, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{theme}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Composition */}
          {event.teamComposition && event.teamComposition.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Composition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.teamComposition.map((comp, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{comp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submission Guidelines */}
          {event.submissionGuidelines && event.submissionGuidelines.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Submission Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.submissionGuidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{guideline}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* General Instructions */}
          {event.generalInstructions && event.generalInstructions.length > 0 && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  General Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.generalInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{instruction}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Download Rule Book Button - Only for Paper Presentation */}
          {event.name === "Paper Presentation" && event.ruleBookFile && (
            <div className="sm:hidden"> {/* Only show on mobile */}
              <Card className="festival-card border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 mx-0 sm:mx-0">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-semibold text-primary">Need the Template?</h3>
                    <p className="text-sm text-muted-foreground px-2">
                      Download the complete paper submission guidelines
                    </p>
                    <Button 
                      onClick={handleDownloadRuleBook} 
                      size="lg" 
                      variant="outline"
                      className="w-full border-primary/30 hover:bg-primary/10 text-primary py-2"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Coordinators */}
          {event.coordinators && (
            <Card className="festival-card mx-0 sm:mx-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Event Coordinators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Faculty Coordinator */}
                  {event.coordinators.faculty && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-secondary">
                        <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base">Faculty Coordinator</span>
                      </div>
                      <div className="bg-muted/30 p-3 sm:p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">
                          {event.coordinators.faculty.name}
                        </h4>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm break-all">{event.coordinators.faculty.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm break-all">{event.coordinators.faculty.email}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Student Coordinator */}
                  {event.coordinators.student && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-accent">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base">Student Coordinator</span>
                      </div>
                      <div className="bg-muted/30 p-3 sm:p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">
                          {event.coordinators.student.name}
                        </h4>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm break-all">{event.coordinators.student.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm break-all">{event.coordinators.student.email}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Dates */}
          <Card className="festival-card mx-0 sm:mx-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/30 rounded-lg gap-1 sm:gap-0">
                  <span className="font-medium">Abstract Submission Deadline</span>
                  <span className="text-primary font-semibold">7th October 2025</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/30 rounded-lg gap-1 sm:gap-0">
                  <span className="font-medium">Event Date</span>
                  <span className="text-primary font-semibold">11th October 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Call to Action */}
          {onRegister && (
            <Card className="festival-card border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 mx-0 sm:mx-0">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary">Ready to Participate?</h3>
                  <p className="text-muted-foreground text-sm sm:text-base px-2">
                    Register now to secure your spot in this exciting event!
                  </p>
                  <Button 
                    onClick={onRegister} 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
                  >
                    <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Register for {event.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};