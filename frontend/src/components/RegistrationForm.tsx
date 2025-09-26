import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, UserPlus, Award, IndianRupee, Users, User, Trash2, ArrowLeft, Check, ChevronsUpDown, Search } from "lucide-react";
import { getAllEvents, type Event } from "@/data/events";
import { Footer } from "@/components/Footer";
import { calculateTeamFee, formatCurrency, type FeeBreakdown } from "@/utils/feeCalculation";
import { cn } from "@/lib/utils";
import { getApiBaseUrl } from '@/utils/api';

// Team member schema
const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  college: z.string().min(2, "Please enter college name"),
});

// Function to create dynamic registration schema based on event
const createRegistrationSchema = (maxTeamSize: number = 4, minTeamSize: number = 1, isPaperPresentation: boolean = false) => z.object({
  // Leader details
  leaderName: z.string().min(2, "Name must be at least 2 characters"),
  leaderCollege: z.string().min(2, "Please enter your college name"),
  leaderEmail: z.string().email("Please enter a valid email address"),
  leaderMobile: z.string().regex(/^\d{10,15}$/, "Mobile number should contain only digits"),
  leaderDepartment: z.string().min(1, "Please select your department"),
  leaderYear: z.string().min(1, "Please select your year of study"),
  leaderCity: z.string().min(2, "Please enter your city"),
  
  // Event selection
  selectedEvent: z.string().min(1, "Please select an event"),
  paperPresentationDept: isPaperPresentation 
    ? z.string().min(1, "Please select a department for paper presentation")
    : z.string().optional(),
  
  // Team details
  participationType: z.enum(["solo", "team"], {
    required_error: "Please select participation type",
  }),
  teamSize: z.number().min(minTeamSize).max(maxTeamSize).optional(),
  
  // Team members (conditional)
  teamMembers: z.array(teamMemberSchema).optional(),
});

// Default schema
const defaultRegistrationSchema = createRegistrationSchema();

type RegistrationFormValues = z.infer<typeof defaultRegistrationSchema>;

const departments = [
  "Aeronautical Engineering",
  "Mechanical Engineering", 
  "Electrical Engineering",
  "Civil Engineering",
  "Computer Science Engineering",
  "AI & Data Science",
  "IoT & Cyber Security",
  "Business Administration",
  "Food Technology",
  "Other"
];

// Departments that have paper presentation events
const paperPresentationDepartments = [
  "Aeronautical Engineering",
  "Mechanical Engineering", 
  "Electrical Engineering",
  "Civil Engineering",
  "Computer Science Engineering",
  "AI & Data Science",
  "IoT & Cyber Security",
  "Business Administration"
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Post Graduate"];

interface RegistrationFormProps {
  eventTitle?: string;
  onBack?: () => void;
  showFooter?: boolean;
}

export const RegistrationForm = ({ eventTitle, onBack, showFooter = true }: RegistrationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participationType, setParticipationType] = useState<"solo" | "team">("solo");
  const [teamSize, setTeamSize] = useState<number>(1);
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null);
  const [showPaperPresentationDept, setShowPaperPresentationDept] = useState(false);
  const [eventSelectOpen, setEventSelectOpen] = useState(false);
  const teamMembersRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const allEvents = getAllEvents();

  // Filter events to show only one Paper Presentation option
  const filteredEvents = allEvents.filter((event, index, arr) => {
    if (event.name === "Paper Presentation") {
      // Only show the first Paper Presentation event
      return arr.findIndex(e => e.name === "Paper Presentation") === index;
    }
    return true;
  }).map(event => {
    // Rename the Paper Presentation to be generic
    if (event.name === "Paper Presentation") {
      return {
        ...event,
        department: "All Departments"
      };
    }
    return event;
  });

  // Create dynamic schema based on selected event
  const currentSchema = selectedEvent 
    ? createRegistrationSchema(selectedEvent.maxTeamSize, selectedEvent.minTeamSize || 1, selectedEvent.name === "Paper Presentation")
    : defaultRegistrationSchema;

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      leaderName: "",
      leaderCollege: "",
      leaderEmail: "",
      leaderMobile: "",
      leaderDepartment: "",
      leaderYear: "",
      leaderCity: "",
      selectedEvent: "",
      paperPresentationDept: "",
      participationType: "solo",
      teamSize: 1,
      teamMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  // Calculate total fee based on participation type and team size
  useEffect(() => {
    const calculatedFee = calculateTeamFee(participationType, teamSize, 100);
    setFeeBreakdown(calculatedFee);
    
    if (participationType === "solo") {
      setTeamSize(1);
      form.setValue("teamSize", 1);
      form.setValue("teamMembers", []);
    } else {
      form.setValue("teamSize", teamSize);
      
      // Adjust team members array
      const currentMembers = form.getValues("teamMembers") || [];
      const targetMemberCount = teamSize - 1; // -1 because leader is separate
      
      if (currentMembers.length < targetMemberCount) {
        // Add empty members
        for (let i = currentMembers.length; i < targetMemberCount; i++) {
          append({ name: "", college: "" });
        }
      } else if (currentMembers.length > targetMemberCount) {
        // Remove excess members
        for (let i = currentMembers.length - 1; i >= targetMemberCount; i--) {
          remove(i);
        }
      }
      
      // Auto-scroll to team members section when team members are added for Box Cricket
      if (selectedEvent?.name === "Box Cricket League" && targetMemberCount > 0) {
        setTimeout(() => {
          teamMembersRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }, 200);
      }
    }
  }, [participationType, teamSize, form, append, remove]);

  const handleEventChange = (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId);
    setSelectedEvent(event || null);
    form.setValue("selectedEvent", eventId);
    
    // Check if it's a Paper Presentation event
    const isPaperPresentation = event?.name === "Paper Presentation";
    setShowPaperPresentationDept(isPaperPresentation);
    
    if (!isPaperPresentation) {
      form.setValue("paperPresentationDept", "");
    }

    // Handle participation type based on event's team size requirements
    if (event) {
      const minTeamSize = event.minTeamSize || 1;
      const maxTeamSize = event.maxTeamSize;
      
      if (maxTeamSize === 1) {
        // Force solo participation for events with maxTeamSize 1
        setParticipationType("solo");
        form.setValue("participationType", "solo");
        setTeamSize(1);
        form.setValue("teamSize", 1);
      } else if (minTeamSize > 1) {
        // Force team participation for events with minTeamSize > 1
        setParticipationType("team");
        form.setValue("participationType", "team");
        setTeamSize(minTeamSize);
        form.setValue("teamSize", minTeamSize);
      } else {
        // Reset team size if current size exceeds event's max or is below min
        if (teamSize > maxTeamSize || (participationType === "solo" && teamSize < minTeamSize) || (participationType === "team" && teamSize < Math.max(minTeamSize, 2))) {
          let newTeamSize;
          
          if (participationType === "team") {
            // For team mode, ensure minimum is 2 (or event minTeamSize if higher)
            newTeamSize = Math.max(minTeamSize, 2);
            newTeamSize = Math.min(newTeamSize, maxTeamSize);
          } else {
            // For solo mode or undetermined, use event requirements
            newTeamSize = Math.max(minTeamSize, Math.min(teamSize, maxTeamSize));
          }
          
          setTeamSize(newTeamSize);
          form.setValue("teamSize", newTeamSize);
          
          // Set appropriate participation type based on team size and event requirements
          if (newTeamSize === 1 && minTeamSize === 1 && participationType !== "team") {
            setParticipationType("solo");
            form.setValue("participationType", "solo");
          } else if (newTeamSize > 1) {
            setParticipationType("team");
            form.setValue("participationType", "team");
          }
        }
      }
      
      // Auto-scroll to team members section for Box Cricket
      if (event?.name === "Box Cricket League" && minTeamSize > 1) {
        // Show helpful toast
        toast({
          title: "Box Cricket Selected! 🏏",
          description: "Please add details for all 6 team members below.",
          duration: 4000,
        });
        
        // Use setTimeout to ensure the DOM has been updated and team members section is visible
        setTimeout(() => {
          if (teamMembersRef.current) {
            teamMembersRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
            
            // Add a subtle highlight effect
            teamMembersRef.current.style.transition = 'all 0.3s ease';
            teamMembersRef.current.style.transform = 'scale(1.02)';
            setTimeout(() => {
              if (teamMembersRef.current) {
                teamMembersRef.current.style.transform = 'scale(1)';
              }
            }, 300);
          }
        }, 300);
      }
    }
  };

  const handleParticipationTypeChange = (type: "solo" | "team") => {
    const minTeamSize = selectedEvent?.minTeamSize || 1;
    const maxTeamSize = selectedEvent?.maxTeamSize || 4;
    
    // Don't allow team participation for events with maxTeamSize 1
    if (type === "team" && maxTeamSize === 1) {
      toast({
        title: "Team participation not allowed",
        description: "This event only allows solo participation.",
        variant: "destructive",
      });
      return;
    }
    
    // Don't allow solo participation for events with minTeamSize > 1
    if (type === "solo" && minTeamSize > 1) {
      toast({
        title: "Solo participation not allowed",
        description: `This event requires teams of at least ${minTeamSize} members.`,
        variant: "destructive",
      });
      return;
    }

    setParticipationType(type);
    form.setValue("participationType", type);
    
    if (type === "solo") {
      setTeamSize(1);
    } else {
      // For team mode, minimum is 2 (or event minTeamSize if higher)
      const defaultTeamSize = Math.max(minTeamSize, 2);
      setTeamSize(Math.min(defaultTeamSize, maxTeamSize));
    }
  };

  const handleTeamSizeChange = (size: number) => {
    const minTeamSize = selectedEvent?.minTeamSize || 1;
    const maxTeamSize = selectedEvent?.maxTeamSize || 4;
    
    // For team mode, minimum should be 2 (unless event specifically requires more)
    const effectiveMinSize = Math.max(minTeamSize, 2);
    
    // Validate against event's maxTeamSize
    if (size > maxTeamSize) {
      toast({
        title: "Team size too large",
        description: `This event allows maximum ${maxTeamSize} team members.`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate against effective minimum (at least 2 for team mode)
    if (size < effectiveMinSize) {
      toast({
        title: "Team size too small",
        description: `Team mode requires at least ${effectiveMinSize} members. Use solo participation for 1 member.`,
        variant: "destructive",
      });
      return;
    }
    
    setTeamSize(size);
  };

  const onSubmit = async (values: RegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      // If Paper Presentation is selected, find the correct event based on department
      let finalEventDetails = selectedEvent;
      if (selectedEvent?.name === "Paper Presentation" && values.paperPresentationDept) {
        const paperPresentationEvent = allEvents.find(event => 
          event.name === "Paper Presentation" && 
          event.department === values.paperPresentationDept
        );
        if (paperPresentationEvent) {
          finalEventDetails = paperPresentationEvent;
        }
      }

      const registrationData = {
        leaderName: values.leaderName,
        leaderEmail: values.leaderEmail,
        leaderMobile: values.leaderMobile,
        leaderCollege: values.leaderCollege,
        leaderDepartment: values.leaderDepartment,
        leaderYear: values.leaderYear,
        leaderCity: values.leaderCity,
        selectedEvent: finalEventDetails?.name || values.selectedEvent,
        paperPresentationDept: values.paperPresentationDept || '',
        participationType: values.participationType,
        teamSize: values.teamSize || 1,
        teamMembers: values.teamMembers || [],
        totalFee: feeBreakdown?.totalAmount || 0,
        baseFee: feeBreakdown?.baseFee || 0,
        processingCharges: feeBreakdown?.processingCharges || 0
      };

      // Create Razorpay order with team details for automatic calculation
      const orderRes = await fetch(`${getApiBaseUrl()}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          participationType: values.participationType,
          teamSize: values.teamSize || 1,
          baseFeePerMember: 100,
          currency: "INR", 
          receipt: `receipt_${Date.now()}` 
        })
      });

      const orderResult = await orderRes.json();
      if (!orderResult.success) {
        throw new Error('Order creation failed');
      }

      const orderId = orderResult.order?.id;
      const backendFeeBreakdown = orderResult.feeBreakdown;
      
      if (!orderId) {
        throw new Error('Order creation failed');
      }

      // Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: backendFeeBreakdown?.totalAmountInPaise || feeBreakdown?.totalAmountInPaise || 0,
        currency: "INR",
        name: "Discovery ADCET 2025",
        description: `Registration for ${registrationData.selectedEvent}`,
        image: window.location.origin + "/event-images/temp_icon.png", // Your logo
        order_id: orderId,
        prefill: {
          name: registrationData.leaderName,
          email: registrationData.leaderEmail,
          contact: registrationData.leaderMobile,
        },
        handler: async (razorpayResponse: any) => {
          try {
            // Submit registration after successful payment
            const registerRes = await fetch(`${getApiBaseUrl()}/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...registrationData,
                paymentId: razorpayResponse.razorpay_payment_id,
                orderId: razorpayResponse.razorpay_order_id,
                signature: razorpayResponse.razorpay_signature
              })
            });

            const result = await registerRes.json();
            if (result.success) {
              setIsSubmitted(true);
              toast({
                title: "Registration Successful!",
                description: "Your registration has been submitted. You will receive a confirmation email shortly.",
              });
            } else {
              toast({
                title: "Registration Failed",
                description: result.error || "There was an error submitting your registration.",
                variant: "destructive",
              });
            }
          } catch (err) {
            console.error('Registration error:', err);
            toast({
              title: "Registration Failed",
              description: "There was an error submitting your registration. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast({
              title: "Payment Required",
              description: "Payment is mandatory to complete registration. Please try again.",
              variant: "destructive",
            });
          }
        },
        theme: {
          color: "#3b82f6"
        }
      };

      // Create Razorpay instance and open payment modal
      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        setIsSubmitting(false);
        toast({
          title: "Payment Failed",
          description: response.error?.description || 'Payment failed. Please try again.',
          variant: "destructive",
        });
      });
      
      razorpay.open();
      
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for registering{eventTitle ? ` for ${eventTitle}` : ""}. 
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/30 mb-6">
              <p className="text-lg font-semibold flex items-center justify-center gap-1">
                <IndianRupee className="h-5 w-5" />
                Total Fee: {formatCurrency(feeBreakdown?.totalAmount || 0)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              You will receive a confirmation email with payment details and further instructions shortly.
            </p>
            <div className="space-y-2">
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                Register Another Participant
              </Button>
              {onBack && (
                <Button onClick={onBack} className="w-full">
                  Back to Events
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-3xl mx-auto flex-1">
        {/* Back Button */}
        {onBack && (
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <Button variant="ghost" onClick={onBack} className="hover:bg-primary/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {eventTitle ? "Back to Events" : "Back to Home"}
            </Button>
          </div>
        )}
        
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-2" />
              <CardTitle className="text-2xl sm:text-3xl font-bold">Event Registration</CardTitle>
            </div>
            {eventTitle && (
              <CardDescription className="text-base sm:text-lg">
                Register for: <span className="font-semibold text-primary">{eventTitle}</span>
              </CardDescription>
            )}
            <CardDescription>
              Fill out the registration form step by step to complete your registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Leader Details Section */}
                <div className="bg-muted/30 p-6 rounded-lg border-2 border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Leader (Main Registrant) Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="leaderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderCollege"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your college name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderMobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="eg. 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderDepartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year of Study *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderCity"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Event Selection Section */}
                <div className="bg-muted/30 p-6 rounded-lg border-2 border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Event Selection
                  </h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="selectedEvent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Event *</FormLabel>
                          <Popover open={eventSelectOpen} onOpenChange={setEventSelectOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={eventSelectOpen}
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? (() => {
                                        const event = filteredEvents.find(e => e.id === field.value);
                                        return event ? (
                                          <div className="flex flex-col items-start">
                                            <span className="font-medium">{event.name}</span>
                                            <span className="text-xs text-muted-foreground">{event.department}</span>
                                          </div>
                                        ) : "Choose an event";
                                      })()
                                    : "Choose an event"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search by event name or department..." className="h-9" />
                                <CommandEmpty>No event found.</CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {filteredEvents.map((event) => (
                                      <CommandItem
                                        key={event.id}
                                        value={`${event.name} ${event.department}`}
                                        onSelect={() => {
                                          handleEventChange(event.id);
                                          setEventSelectOpen(false);
                                        }}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex flex-col">
                                          <span className="font-medium">{event.name}</span>
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{event.department}</span>
                                            <span>•</span>
                                            <span>
                                              {event.minTeamSize && event.minTeamSize > 1 
                                                ? `${event.minTeamSize}-${event.maxTeamSize} members` 
                                                : `Max ${event.maxTeamSize} ${event.maxTeamSize === 1 ? 'member' : 'members'}`
                                              }
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-primary">₹{event.entryFee}</span>
                                          <Check
                                            className={cn(
                                              "h-4 w-4",
                                              field.value === event.id ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <p className="text-xs text-muted-foreground mt-1">
                            💡 Click to search by event name or department
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {showPaperPresentationDept && (
                      <FormField
                        control={form.control}
                        name="paperPresentationDept"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Department for Paper Presentation *</FormLabel>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose department" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {paperPresentationDepartments.map((dept) => (
                                      <SelectItem key={dept} value={dept}>
                                        {dept}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Download button for paper submission doc */}
                              <div className="whitespace-nowrap">
                                <a
                                  href="/docs/Paper_Submission_Discovery2k25.docx"
                                  download
                                  className="inline-flex items-center px-3 py-2 border border-primary/30 rounded-md text-sm bg-primary/5 hover:bg-primary/10"
                                  title="Download paper submission template"
                                >
                                  Download Template
                                </a>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Team Size & Fees Section */}
                <div className="bg-muted/30 p-6 rounded-lg border-2 border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Team Size & Fees
                  </h3>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="participationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you want to participate solo or as a team? *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleParticipationTypeChange(value as "solo" | "team");
                              }}
                              defaultValue={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="solo" id="solo" />
                                <Label htmlFor="solo" className="cursor-pointer">
                                  Solo (₹100)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value="team" 
                                  id="team" 
                                  disabled={selectedEvent?.maxTeamSize === 1}
                                />
                                <Label 
                                  htmlFor="team" 
                                  className={`cursor-pointer ${selectedEvent?.maxTeamSize === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  Team (₹100 per member)
                                  {selectedEvent?.maxTeamSize === 1 && (
                                    <span className="text-xs text-muted-foreground block">
                                      Not available for this event
                                    </span>
                                  )}
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {participationType === "team" && selectedEvent && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Select Team Size *</Label>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {Array.from(
                              { length: selectedEvent.maxTeamSize - Math.max(selectedEvent.minTeamSize || 1, 2) + 1 }, 
                              (_, i) => Math.max(selectedEvent.minTeamSize || 1, 2) + i
                            ).map((size) => (
                              <Button
                                key={size}
                                type="button"
                                variant={teamSize === size ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleTeamSizeChange(size)}
                                disabled={size > selectedEvent.maxTeamSize || size < Math.max(selectedEvent.minTeamSize || 1, 2)}
                              >
                                {size} Members
                              </Button>
                            ))}
                          </div>
                          {selectedEvent.maxTeamSize === 1 && (
                            <p className="text-sm text-muted-foreground mt-2">
                              This event only allows solo participation.
                            </p>
                          )}
                          {(selectedEvent.minTeamSize || 1) > 1 && (
                            <p className="text-sm text-muted-foreground mt-2">
                              This event requires teams of at least {selectedEvent.minTeamSize} members. Solo participation is not allowed.
                            </p>
                          )}
                          {!(selectedEvent.minTeamSize && selectedEvent.minTeamSize > 1) && (
                            <p className="text-sm text-muted-foreground mt-2">
                              💡 For 1 member, use Solo participation. Team mode is for 2+ members.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Members Section - Only show if team is selected */}
                {participationType === "team" && teamSize > 1 && (
                  <div ref={teamMembersRef} className="bg-muted/30 p-6 rounded-lg border-2 border-primary/20">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {selectedEvent?.name === "Box Cricket League" ? "Box Cricket Team Members (5 more required)" : "Team Member Details"}
                    </h3>
                    
                    <div className="space-y-6">
                      {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Member {index + 2}</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`teamMembers.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter member name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`teamMembers.${index}.college`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>College *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter college name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fee Display with Breakdown */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Participation: {participationType === "solo" ? "Solo" : `Team of ${teamSize}`}
                      </p>
                      {selectedEvent && (
                        <p className="text-sm text-muted-foreground">Event: {selectedEvent.name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary flex items-center gap-1">
                        <IndianRupee className="h-5 w-5" />
                        {feeBreakdown?.totalAmount?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹100/- per member
                      </p>
                    </div>
                  </div>
                  
                  {/* Fee Breakdown */}
                  {feeBreakdown && (
                    <div className="mt-3 pt-3 border-t border-primary/20">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Event Fee:</span>
                          <span>{formatCurrency(feeBreakdown.baseFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Processing Charges:</span>
                          <span>{formatCurrency(feeBreakdown.processingCharges)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-1 border-t border-primary/20">
                          <span>Total Payable:</span>
                          <span>{formatCurrency(feeBreakdown.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Notice */}
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-orange-800">Payment Information</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Registration will only be confirmed after successful payment. The processing charges shown above include payment gateway fees to ensure you receive the exact event fee amount. You will be redirected to a secure payment gateway to complete the transaction.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  {onBack && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedEvent}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span className="hidden xs:inline">Proceed to Payment</span>
                        <span className="xs:hidden">Payment</span> ({formatCurrency(feeBreakdown?.totalAmount || 0)})
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};