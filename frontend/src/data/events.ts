export interface Event {
  id: string;
  name: string;
  department: string;
  maxTeamSize: number;
  entryFee: number;
  description?: string;
  image?: string;
  topics?: string[];
  rules?: string[];
  specifications?: string[];
  gameplay?: string[];
  scoring?: string[];
  safetyRegulations?: string[];
  disqualification?: string[];
  constructionGuidelines?: string[];
  testingProcedure?: string[];
  generalInstructions?: string[];
  teamComposition?: string[];
  themes?: string[];
  submissionGuidelines?: string[];
  coordinators?: {
    faculty?: {
      name: string;
      phone: string;
      email: string;
    };
    student?: {
      name: string;
      phone: string;
      email: string;
    };
  };
}

// Common rules for all Paper Presentation events (extracted from "Discovery 2K25Rules Final.pdf")
const paperPresentationRules: string[] = [
  "Maximum of 4 participants per team.",
  "Entry fee: ₹100 per participant.",
  "Participants must choose topics from the provided group/topic list and submit a one-page abstract by the designated deadline (soft copy to group faculty coordinators).",
  "Abstract submission is mandatory; approved teams must submit the full paper in IEEE format (PDF), maximum 10 pages including figures, tables and references.",
  "PowerPoint presentations should be provided on a pen drive or can be sent via email before the event.",
  "Each team will be allotted 10 minutes for presentation followed by a question-and-answer session.",
  "All participants must bring college ID cards and event registration receipts on the day of the event."
];

export const eventsByDepartment: Record<string, Event[]> = {
  aeronautical: [
    {
      id: "aero-paper",
      name: "Paper Presentation",
      department: "Aeronautical Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present cutting-edge research on advanced aeronautical engineering topics including materials science, structural design, aerodynamics, and UAV technologies. Showcase your academic research and technical expertise to industry professionals.",
      topics: [
        "Advanced Materials and Manufacturing",
        "High-Temperature Materials and composites", 
        "Surface Modification of Materials",
        "Materials for Space Applications",
        "Conventional Aerospace Metals and Materials",
        "Statics and dynamics of structures",
        "Behavior of Aerospace Structures",
        "Rocket, Helicopter, Missiles, and Spacecraft Structural Design",
        "Conventional and Non-Conventional Methods in Aerospace Structural Design",
        "Non-Destructive Testing (NDT) in Aerospace Systems",
        "Aerodynamic Optimization of Aircraft Wings",
        "Subsonic, Transonic and supersonic flow analysis",
        "Aerodynamic Flow Control",
        "Unmanned Aerial Vehicles (UAVs) Technologies"
      ],
      // use the common paper presentation rules and add the submission deadline explicitly
      rules: [
        ...paperPresentationRules,
        "Submit abstract (soft copy) to the group faculty coordinators by 7th October 2025."
      ],
      coordinators: {
        faculty: {
          name: "Dr. Sudharson Murugan",
          phone: "9790551772",
          email: "sm_aero@adcet.in"
        },
        student: {
          name: "Vedanti Gondhali", 
          phone: "9867980126",
          email: "vedantigondhali@gmail.com"
        }
      }
    },
    {
      id: "paper-glider",
      name: "Paper Glider: Flight Challenge",
      department: "Aeronautical Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/Paper_Glider.png",
      description: "Design and build innovative paper gliders optimized for maximum flight distance and time. Test your aerodynamic knowledge and engineering skills in this exciting hands-on competition where creativity meets physics.",
      specifications: [
        "Rockets must be constructed exclusively from paper, tape, and adhesive (glue, glue sticks, etc.).",
        "Prohibited materials include, but are not limited to: cardboard, plastic, metal, wood, foam, or any pre-fabricated components.",
        "Maximum Length: 30 cm; Maximum Diameter: 5 cm; Maximum Weight: 50 grams.",
        "The rocket will be weighed by the judges before each launch attempt.",
        "The rocket must be a single, self-contained unit with no external devices or components for guidance, deployment, or active stabilization."
      ],
      rules: [
        "The competition is open to all enrolled engineering students.",
        "Teams must consist of a minimum of two (2) and a maximum of four (4) members.",
        "Each team may only submit one (1) rocket for the competition.",
        "All rockets must pass a pre-flight inspection by the judges to verify adherence to all material and specification rules before being cleared for launch."
      ],
      gameplay: [
        "Each team will be given two (2) official launch attempts. The best score from these two attempts will be used for final ranking.",
        "The final score will be a combination of flight duration (measured in seconds) and horizontal distance (measured in meters)."
      ],
      safetyRegulations: [
        "All participants, judges, and spectators must be at a safe distance from the launch pad as designated by event staff.",
        "All team members within the designated launch area must wear safety goggles, which will be provided.",
        "Any team or individual found to be engaging in unsafe behavior will be immediately disqualified."
      ],
      disqualification: [
        "A team will be disqualified for failure to meet rocket specifications, use of unapproved materials, tampering with the official launch system, or unsportsmanlike conduct."
      ],
      coordinators: {
        faculty: {
          name: "Dr. Sakthipriya Balu",
          phone: "9500713664",
          email: "sbl_aero@adcet.in"
        },
        student: {
          name: "Pradyumn Deshmukh", 
          phone: "9404013880",
          email: "pradyumndeshmukh28@gmail.com"
        }
      }
    },
    {
      id: "water-rocket",
      name: "Water Rocket",
      department: "Aeronautical Engineering", 
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/Water_rocket.png",
      description: "Build and launch water-powered rockets for maximum altitude and accuracy. Apply principles of propulsion, aerodynamics, and structural design to create the ultimate high-flying rocket using only water and compressed air.",
      specifications: [
        "Rockets must be constructed from one or more standard plastic soda bottles (PET bottles).",
        "Additional materials such as paper, cardboard, tape, and adhesive (glue, glue sticks, etc.) are permitted for fins, nose cones, and other external components.",
        "Prohibited materials include, but are not limited to: metal, wood, glass, or any pre-fabricated components designed for model rocketry.",
        "The rocket must be built around a main body tube of standard 2 L or smaller plastic soda bottles.",
        "Maximum Length: 75 cm. The maximum diameter is determined by the bottle used.",
        "The only propellant is water and compressed air. No other liquids, gases, or solid propellants are permitted.",
        "Water Volume: A maximum of 1/3 of the bottle's total volume. This will be measured by judges prior to launch.",
        "The rocket must be a single, self-contained unit.",
        "Fins and nose cones must be securely attached and may not detach during flight.",
        "No external devices or components for active guidance, deployment, or stabilization are permitted."
      ],
      rules: [
        "The competition is open to all enrolled engineering students.",
        "Teams must consist of a minimum of two (2) and a maximum of four (4) members.",
        "Each team may only submit one (1) rocket for the competition.",
        "All rockets must pass a pre-flight inspection by the judges to verify adherence to all material and specification rules before being cleared for launch."
      ],
      gameplay: [
        "All rockets will be launched using a standardized water rocket launcher provided by the competition organizers. Teams are not permitted to use their own launch systems.",
        "The launch system will be pressurized to a standard pressure of 80 psi for all rockets.",
        "Each team will be given two (2) official launch attempts. The best score from these two attempts will be used for final ranking.",
        "The final score will be a combination of flight duration (measured in seconds) and horizontal distance (measured in meters)."
      ],
      safetyRegulations: [
        "Safety is the highest priority. All participants, judges, and spectators must be at a safe distance from the launch pad as designated by event staff.",
        "All team members within the designated launch area must wear safety goggles, which will be provided.",
        "Do not attempt to modify the launch system. Any tampering will result in immediate disqualification.",
        "Any team or individual found to be engaging in unsafe behavior will be immediately disqualified."
      ],
      disqualification: [
        "A team will be disqualified for failure to meet rocket specifications, use of unapproved materials or propellants, tampering with the official launch system, or unsportsmanlike conduct or unsafe behavior."
      ],
      coordinators: {
        faculty: {
          name: "Mr. Sabarishwaran R",
          phone: "9500395443",
          email: "sr_aero@adcet.in"
        },
        student: {
          name: "Anil Nandkumar Bhanuse", 
          phone: "7028280307",
          email: "anilbhanuse18@gmail.com"
        }
      }
    }
  ],
  mechanical: [
    {
      id: "mech-paper",
      name: "Paper Presentation",
      department: "Mechanical Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present innovative research in mechanical engineering covering automation, automotive innovations, thermal systems, manufacturing processes, and renewable energy technologies. Share groundbreaking ideas and technical solutions.",
      topics: [
        "Advances in Automation and Robotics",
        "Innovations in Automotive Industries", 
        "Thermal Engineering and Energy Systems",
        "Manufacturing and Production Engineering",
        "Materials Science and Engineering",
        "Fluid Mechanics and Heat Transfer",
        "Machine Design and Mechatronics",
        "Renewable Energy Technologies"
    ],
    rules: paperPresentationRules,
    coordinators: {
      faculty: {
        name: "Mr. Ajit R. Mane",
        phone: "9850567931",
        email: "arm_mech@adcet.in"
      },
      student: {
        name: "Mr. Suyash Santosh Koli", 
        phone: "9359756062",
        email: "suyashkoli100@gmail.com"
      }
    }
    },
    {
      id: "robo-race",
      name: "Robo Race",
      department: "Mechanical Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      image: "/event-images/Robo_race.png",
      description: "Design and build high-speed autonomous robots to navigate through challenging race tracks filled with obstacles. Showcase your robotics, programming, and mechanical engineering skills in this thrilling competition.",
      specifications: [
        "The dimensions of the bot must not exceed 300 mm x 300 mm x 300 mm (L X B X H).",
        "Weight of bot should not exceed 4kg.",
        "Bot must be controlled manually.",
        "The Machine cannot be constructed using ready-made 'Lego kits' or any ready-made mechanism.",
        "The maximum allowed voltage to power the robot is 12V.",
        "Failing to meet any of the above specifications will lead to disqualification of the team."
      ],
      rules: [
        "Only two members of the team are allowed to handle and operate the bot.",
        "The bot should not damage the arena. In case of arena damage team will be immediately Disqualified.",
        "The bot should not break or split into two or more Parts during the run. In such a case the team will be Disqualified immediately.",
        "The bot would be checked for safety before starting and disqualified if found unsafe for other players.",
        "The bots will be given five minutes to prepare their bots for the race.",
        "If a participant team fails to start the bot after 5 minutes the team will be disqualified.",
        "No one can comment on the referee's decision.",
        "Only three hand touches are allowed. After the third touch, the participant will be disqualified."
      ],
      gameplay: [
        "The race begins with the teams launching their bot From a START mark.",
        "Checkpoints are strategically placed throughout the Course.",
        "The bot must navigate between checkpoints without damaging the obstacles.",
        "If in case the team is unable to cross the obstacle then the team can choose to skip the obstacle.",
        "If an obstacle is skipped then the points will be Deducted.",
        "If the bot goes out of the track then start it from the Previous checkpoint.",
        "During the game if any of the team members touch the bot without the approval of the organizer then the bot has to start from the previous checkpoint.",
        "During the game bot has to cover all checkpoints and Finally reach the final endpoint then only the race Will be completed."
      ],
      coordinators: {
        faculty: {
          name: "Mr. Pritam V. Mali",
          phone: "8600664009",
          email: ""
        },
        student: {
          name: "Aman Mulla", 
          phone: "7385303243",
          email: ""
        }
      }
    },
    {
      id: "cad-conqueror",
      name: "CAD Conqueror",
      department: "Mechanical Engineering",
      maxTeamSize: 1,
      entryFee: 100,
      image: "/event-images/Cad_Conquer.png",
      description: "Showcase your 3D modeling and CAD design skills in this intensive individual competition. Create complex mechanical components and assemblies using industry-standard software like SolidWorks or CATIA under time pressure."
      ,
      rules: [
        "Individual participation is allowed and If the entry is more than 45 candidates, pre-qualifier round will be conducted.",
        "Participant should make the models in Solid works /CATIA.",
        "Computer and software facility will be provided in the event venue.",
        "Participant are not allowed to take digital gadgets and storage devices inside the event hall.",
        "Evaluation will be conducted by the Event management team with pre-defined rubrics.",
        "Task will be revealed during the event, and maximum time allowed in 1 hour for the event per candidate.",
        "If the candidate is consuming more time over the scheduled period will not be considered for evaluation.",
        "Event will be conducted in the scheduled time, flexibility will not be there.",
        "Focus areas are CAD Modelling, Assembly, Drafting and Rendering.",
        "Final output has to be in PDF file format, and it should be submitted to the Event Management team.",
        "Entry Fee: Rs. 100/-"
      ],
      coordinators: {
        faculty: {
          name: "Dr. R. R. Gaji",
          phone: "9923391006",
          email: ""
        },
        student: {
          name: "Shailendra Prakash Wadar", 
          phone: "9322493449",
          email: ""
        }
      }
    }
  ],
  electrical: [
    {
      id: "elec-paper",
      name: "Paper Presentation",
      department: "Electrical Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present cutting-edge research in electrical engineering covering power electronics, renewable energy systems, smart grid technologies, and digital signal processing. Showcase innovative solutions for modern electrical challenges.",
      topics: [
        "Power Electronics and Drives",
        "Renewable Energy Systems",
        "Smart Grid Technologies",
        "Electric Vehicles and Charging Infrastructure",
        "Power Quality and Energy Efficiency",
        "Digital Signal Processing",
        "Control Systems and Automation",
        "High Voltage Engineering"
    ],
    rules: paperPresentationRules,
    coordinators: {
      faculty: {
        name: "Mr. I.D.Pharane",
        phone: "9657240024",
        email: "idp_ele@adcet.in"
      },
      student: {
        name: "Mr. Sujal Gaikwad",
        phone: "9021982438",
        email: "sujalgaikwad2500@gmail.com"
      }
    }
    },
    {
      id: "circuit-builder",
      name: "Circuit Builder",
      department: "Electrical Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      image: "/event-images/Circuit_builder.png",
      description: "Design and build functional electronic circuits to solve complex engineering challenges. Test your knowledge of electrical components, circuit analysis, and practical implementation skills in this hands-on competition.",
      rules: [
        "Student must carry a valid college ID card.",
        "Event consist of 2 rounds.",
        "There will be certain time span for each round.",
        "Participants should not use any electronic accessories inside a venue hall.",
        "All the rights related with the competition are reserved to organizers."
      ],
      gameplay: [
        "Round 1: This is offline quiz round where you will be boosting your knowledge.",
        "Round 2: Here's the most interesting part, based on of given circuit diagram you have to build the same circuit using the components."
      ],
      coordinators: {
        faculty: { name: "Mrs. Rutuja S Pawar", phone: "9765317323", email: "" },
        student: { name: "Ms. Samruddhi Patil", phone: "9021681044", email: "" }
      }
    },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      department: "Electrical Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      image: "/event-images/Troubleshooting.png",
      description: "Identify and fix electrical circuit problems under intense time pressure. Test your analytical skills, circuit knowledge, and problem-solving abilities as you diagnose complex electrical faults in real-world scenarios.",
      specifications: [
        "Total 10 Circuits will be provided.",
        "Each Team will get one Minutes to find out Fault in one circuit."
      ],
      rules: [
        "Only two participants are permitted per team.",
        "The answer paper will be distributed at the commencement of the event.",
        "College ID cards and event registration receipts must be brought on the day of the event.",
        "Decision of Judges will be final."
      ],
      generalInstructions: [
        "Host institute reserves rights related to modification and updating the rules for successful completion of the event."
      ],
      coordinators: {
        faculty: { name: "Mr. P. D. More", phone: "09657175613", email: "pdm_ele@adcet.in" },
        student: { name: "Mr. Vivek Borage", phone: "8080220991", email: "vivekborage1711@gmail.com" }
      }
    }
  ],
  civil: [
    {
      id: "civil-paper",
      name: "Paper Presentation",
      department: "Civil Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present innovative solutions in civil engineering including sustainable construction materials, smart cities infrastructure, earthquake-resistant design, and water resources management. Address modern urban development challenges.",
      topics: [
        "Sustainable Construction Materials",
        "Smart Cities and Infrastructure",
        "Earthquake Resistant Design",
        "Water Resources Management",
        "Environmental Engineering",
        "Transportation Engineering",
        "Structural Health Monitoring",
        "Green Building Technologies"
    ],
    rules: paperPresentationRules,
    coordinators: {
      faculty: {
        name: "Dr. Vidya A. Lande",
        phone: "7387102650",
        email: "val_civil@adcet.in"
      },
      student: {
        name: "Vivek Lohar",
        phone: "9309735699",
        email: "loharvivek110@gmail.com"
      }
    }
    },
    {
      id: "akruti",
      name: "AKRUTI",
      department: "Civil Engineering",
      maxTeamSize: 1,
      entryFee: 100,
      image: "/event-images/akruti.png",
      description: "Individual structural design and analysis competition showcasing architectural and engineering excellence. Demonstrate your drafting skills, structural knowledge, and creative problem-solving in civil engineering design challenges."
      ,
      rules: [
        "Each team shall consist of a single participant only.",
        "The problem statement will be distributed at the beginning of the event.",
        "Evaluation criteria will include drafting accuracy, detailing, labeling, and use of appropriate coloring.",
        "Final assessment will be based on overall completeness of the drawing and effective utilization of time.",
        "Entry Fee: Rs. 100/- Per Participant."
      ],
      coordinators: {
        faculty: { name: "Mr. Atul N. Kolekar", phone: "9545428026", email: "Ank_civil@adcet.in" },
        student: { name: "Aman Attar", phone: "9356709191", email: "amanattar0303@gmail.com" }
      }
    },
    {
      id: "setu",
      name: "SETU",
      department: "Civil Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      image: "/event-images/setu.png",
      description: "Bridge design and construction challenge testing engineering fundamentals and structural analysis. Build efficient load-bearing bridges using popsicle sticks and demonstrate your understanding of structural mechanics and design optimization.",
      constructionGuidelines: [
        "Bridges must be constructed solely with Popsicle sticks and white adhesive glue (e.g., Fevicol type).",
        "The use of any other adhesives, fasteners, pins, clips, wires, or tapes is strictly prohibited.",
        "Popsicle sticks may be cut or trimmed but must not be split into multiple thin pieces.",
        "Span (clear distance between supports): 60 cm (±1 cm).",
        "Maximum height: 20 cm.",
        "Maximum width: 8 cm.",
        "The bridge must be a free-standing structure without external support."
      ],
      rules: [
        "Each team must consist of maximum two members. All participants must be registered students of their respective institutions.",
        "Bridges must be completed prior to the event day and brought to the venue for testing.",
        "Each team is responsible for transporting their bridge safely; any damage during transit is the team's responsibility.",
        "Teams must submit their bridge at the registration desk before testing begins.",
        "Once submitted, bridges cannot be altered or repaired."
      ],
      testingProcedure: [
        "Load will be applied at the center of the span.",
        "Additional loading will be done using sandbags or small weights.",
        "Participants themselves will apply the load under supervision.",
        "The bridge must sustain the applied load for at least 20 seconds.",
        "Teams will be given four attempts to increase the load incrementally.",
        "The load carried just before failure will be recorded for calculation.",
        "The Strength-to-Weight Ratio will be calculated as: Load carried in kg before failure / Bridge weight in g"
      ],
      disqualification: [
        "Use of unauthorized materials, non-compliance with specifications, or misconduct will result in disqualification."
      ],
      generalInstructions: [
        "The organizers reserve the right to modify rules if necessary, and any such changes will be announced before evaluation."
      ],
      coordinators: {
        faculty: { name: "Dr. Bajirao V. Mane", phone: "9373277474", email: "bvm_civil@adcet.in" },
        student: { name: "Vedant Bajare", phone: "9172919766", email: "bajarevedantraje@gmail.com" }
      }
    }
  ],
  cse: [
    {
      id: "cse-paper",
      name: "Paper Presentation",
      department: "Computer Science Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present innovative computer science research covering artificial intelligence, blockchain technology, cloud computing, cybersecurity, data science, IoT, and mobile application development. Showcase cutting-edge technological solutions.",
      topics: [
        "Artificial Intelligence and Machine Learning",
        "Blockchain Technology",
        "Cloud Computing and DevOps",
        "Cybersecurity and Information Security",
        "Data Science and Big Data Analytics",
        "Internet of Things (IoT)",
        "Mobile Application Development",
        "Software Engineering and Agile Methodologies"
    ],
    rules: paperPresentationRules,
    coordinators: {
      faculty: {
        name: "Dr. B. A. Jadhawar",
        phone: "9284068550",
        email: "baj_cse@adcet.in"
      },
      student: {
        name: "Mr. Swapnil Patil",
        phone: "9322524034",
        email: "swapnilp3104@gmail.com"
      }
    }
    },
    {
      id: "code-compete",
      name: "Code 2 Compete",
      department: "Computer Science Engineering",
      maxTeamSize: 1,
      entryFee: 100,
      image: "/event-images/code_to_compete.png",
      description: "Individual competitive programming challenge featuring algorithmic problem-solving and data structures. Test your coding skills through multiple rounds including MCQs and intensive programming tasks on HackerRank platform.",
      gameplay: [
        "The contest will be having two rounds. 1st round continues for 1 hour and 2nd round will continue for 2 hours.",
        "Contestants are given MCQ test of 50 questions based on C, C++, Java and Python concepts in 1st round and 3 problem statements in 2nd round.",
        "Shortlisted students from 1st round can appear for 2nd round.",
        "Statements of all problems become available to read at the moment the round starts.",
        "Environmental setup for Round2: HackerRank."
      ],
      rules: [
        "Participants must prefer C,C++,Java or Python to solve problems.",
        "The leader board generated will be final and no queries about it will be entertained."
      ],
      disqualification: [
        "If any plagiarism is found in the code of the participant, he/she will be disqualified immediately.",
        "If any copy cases found in Round1, the participant will be directly eliminated from the contest."
      ],
      coordinators: {
        faculty: { name: "Mr. Yogesh V. Koli", phone: "9503265322", email: "yvk_cse@adect.in" },
        student: { name: "Mr. Zahoorahmad Sayyad", phone: "8767354046", email: "zahoor.adcet@gmail.com" }
      }
    },
    {
      id: "b-plan",
      name: "B-Plan",
      department: "Computer Science Engineering",
      maxTeamSize: 2,
      entryFee: 200,
      image: "/event-images/b_plan.png",
      description: "Present your innovative startup business plan and pitch your entrepreneurial ideas to industry experts. Showcase your business acumen, market analysis, and financial projections in this comprehensive business competition."
      ,
      rules: [
        "Team size: Maximum 2 students per team.",
        "Poster must be 300 –800 words, readable from 10 feet.",
        "Use clear graphics, colors, and fonts for better impact.",
        "Presentation time: 10 minutes + 5 minutes Q&A.",
        "Teams must present both poster and business idea to judges.",
        "Entry fee: Rs. 200/- (per participant or per team of 2).",
        "Posters and presentations must be clear, concise, and focused on key aspects.",
        "Entry Fee: Rs. 100/- Per Participant."
      ],
      coordinators: {
        faculty: { name: "Mrs. Shubhangi Patil", phone: "9730623168", email: "spp1_cse@adcet.in" },
        student: { name: "Mr. Shardul Mane", phone: "9307708830", email: "shardulmane369@gmail.com" }
      }
    }
  ],
  aids: [
    {
      id: "aids-paper",
      name: "Paper Presentation",
      department: "AI & Data Science",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present groundbreaking research on AI and data science applications including deep learning, natural language processing, computer vision, predictive analytics, and ethical AI. Explore the future of intelligent systems.",
      topics: [
        "Deep Learning and Neural Networks",
        "Natural Language Processing",
        "Computer Vision and Image Processing",
        "Predictive Analytics and Forecasting",
        "Big Data Technologies",
        "Edge AI and IoT Integration",
        "Ethical AI and Bias Mitigation",
        "Reinforcement Learning"
    ],
    rules: paperPresentationRules,
    coordinators: {
      faculty: {
        name: "Mrs. Priyank S. Patil",
        phone: "7875642616",
        email: "psp_aids@adcet.in"
      },
      student: {
        name: "Kavyanjali Kishor Kamble",
        phone: "9309079890",
        email: "kavyanjalikamble29@gmail.com"
      }
    }
    },
    {
      id: "bgmi-dominator",
      name: "BGMI Dominator",
      department: "AI & Data Science",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/Bgmi_dominator.png",
      description: "Ultimate esports competition featuring intense Battlegrounds Mobile India (BGMI) battles. Form your squad and compete in strategic team-based gaming tournaments for the championship title and exciting prizes."
      ,
      rules: [
        "The player should join the room 10 min prior to the match time.",
        "All the players in the squad should be in the registered list.",
        "Any suspicious activity detected then the squad will be disqualified.",
        "Any use of unfair means such as aimbot, trigger bot, ESP and other then the squad will be disqualified.",
        "Any game modifying tool is not allowed.",
        "Only in game voice chat should be used while playing.",
        "Organizers would not be held responsible for the connectivity issue of the participant's side.",
        "The entry fee will not be refunded under any circumstances.",
        "The BGMI app must be in its updated version.",
        "Participants should carry their id cards.",
        "Entry Fee: Rs. 100/- Per Participant."
      ],
      coordinators: {
        faculty: { name: "Mr. V. N. Honmane", phone: "8329490361", email: "Vikas_aids@adcet.in" },
        student: { name: "Ronit Swami", phone: "8208980085", email: "ronitswami43@gmail.com" }
      }
    },
    {
      id: "coding-competition",
      name: "Coding Competition",
      department: "AI & Data Science",
      maxTeamSize: 1,
      entryFee: 100,
      image: "/event-images/Coding_Compi.png",
      description: "Individual coding challenge focusing on advanced algorithms and data structures. Solve complex programming problems across multiple rounds, testing your logical thinking, optimization skills, and coding proficiency under time constraints."
      ,
      rules: [
        "Contest have 3 round, problems are given at the time of round.",
        "Each round 2 problems are given.",
        "If any plagiarism is found, participant will be disqualified.",
        "Single participant.",
        "Every round must be of 30 min.",
        "Entry Fee: Rs. 100/- Per Participant."
      ],
      coordinators: {
        faculty: { name: "Ms. Smita Dhanaji Patil", phone: "7498695865", email: "Sdp_aids@adect.in" },
        student: { name: "Gaurav Kumbhare", phone: "7768807185", email: "" }
      }
    }
  ],
  iot: [
    {
      id: "iot-paper",
      name: "Paper Presentation",
      department: "IoT & Cyber Security",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present cutting-edge innovations in IoT and cybersecurity covering IoT security, blockchain integration, edge computing, industrial IoT, smart cities, threat detection, and digital forensics. Address modern security challenges.",
      topics: [
        "IoT Security and Privacy",
        "Blockchain in IoT",
        "Edge Computing and Fog Computing",
        "Industrial IoT and Industry 4.0",
        "Smart Home and Smart City Applications",
        "Cybersecurity Threat Detection",
        "Network Security and Firewalls",
        "Digital Forensics and Incident Response"
    ],
    rules: paperPresentationRules,
    coordinators: {
      faculty: {
        name: "Mr Samish N Kamble",
        phone: "8856855737",
        email: "snk_iot@adcet.in"
      },
      student: {
        name: "Ms Sakshi Pawar",
        phone: "9356856211",
        email: "Pawarsakshee25@gmail.com"
      }
    }
    },
    {
      id: "ideathon",
      name: "Ideathon",
      department: "IoT & Cyber Security",
      maxTeamSize: 2,
      entryFee: 100,
      image: "/event-images/Ideathon.png",
      description: "Brainstorm and pitch innovative IoT solutions addressing real-world challenges. Develop creative technology concepts, create prototypes, and present your ideas to industry experts in this intensive innovation competition.",
      themes: [
        "Technology and innovation solutions",
        "Sustainability and environmental solutions",
        "Smart city and IoT applications",
        "Healthcare technology innovations",
        "Educational technology solutions"
      ],
      teamComposition: [
        "Teams can have a maximum of 2 members.",
        "Cross-department and cross-year collaborations are allowed.",
        "No individual can be a member of more than one team."
      ],
      rules: [
        "Teams can work on any topic relevant to the event theme (e.g., technology, innovation, sustainability).",
        "Projects should be original and not previously submitted in other competitions.",
        "Deadlines for abstract and final submission will be strictly followed."
      ],
      submissionGuidelines: [
        "Initial submission should include a brief (500-word) abstract outlining the idea.",
        "Final submission must include a presentation, prototype demo (if applicable), and supporting documentation.",
        "Deadline to submit abstract is 1st October 2025."
      ],
      coordinators: {
        faculty: { name: "Mrs. Prachi S. Pathak", phone: "9158839366", email: "" },
        student: { name: "Vishwajit M Bavadhankar", phone: "9852511717", email: "" }
      }
    },
    {
      id: "box-cricket",
      name: "Box Cricket League",
      department: "IoT & Cyber Security",
      maxTeamSize: 6,
      entryFee: 100,
      image: "/event-images/box_cricket.png",
      description: "Indoor cricket tournament for tech enthusiasts combining sports and technology. Form your team and compete in fast-paced 3-over matches, demonstrating teamwork, strategy, and athletic skills in this exciting recreational competition."
      ,
      rules: [
        "Each team shall consist of six (6) players. A player may represent only one team.",
        "The match shall be of three (3) overs per side, with each bowler permitted to bowl a maximum of one (1) over.",
        "Throw bowling is strictly prohibited. Legitimacy of bowling action shall be determined solely by the umpire.",
        "In the event of a tie, a Super Over shall be conducted to determine the winner.",
        "Umpire's decisions shall be final and binding. Any argument or dispute with the umpire will result in immediate disqualification of the team.",
        "All rules and regulations shall be explained and clarified before the commencement of the match.",
        "Entry Fee: Rs. 100/- Per Participant."
      ],
      coordinators: {
        faculty: { name: "Prof. Kumarsagar M. Dange", phone: "9922425350", email: "" },
        student: { name: "Mr. Ruturaj Wani", phone: "9226990917", email: "" }
      }
    }
  ],
  bba: [
    {
      id: "bba-paper",
      name: "Paper Presentation",
      department: "Business Administration",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present innovative business strategies and management concepts covering digital marketing, sustainable practices, entrepreneurship, financial management, HR strategies, and corporate social responsibility. Explore modern business solutions.",
      topics: [
        "Digital Marketing and E-commerce",
        "Sustainable Business Practices",
        "Entrepreneurship and Innovation",
        "Financial Management and Investment",
        "Human Resource Management",
        "Supply Chain Management",
        "Business Analytics and Decision Making",
        "Corporate Social Responsibility"
      ],
      rules: paperPresentationRules,
      coordinators: {
        faculty: { name: "Mr. Aftab Mulla", phone: "8928735958", email: "ahm_bba@adcet.in" },
        student: { name: "Mr. Rudrapratap Chavan", phone: "7028354005", email: "rudrachavan400@gmail.com" }
      }
    }
  ],
  food: [
    {
      id: "food-paper",
      name: "Paper Presentation",
      department: "Food technology",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Develop innovative functional food products with enhanced health benefits and nutritional value. Design foods that go beyond basic nutrition, incorporating bioactive compounds and therapeutic properties for modern dietary needs.",
      rules: [
        "The idea to be presented must focus on food, food processing, and food waste management.",
        "The idea should be innovative, creative, and achievable.",
        "The idea should be presented using MS PowerPoint presentations only.",
        "Each group must have a minimum of 1 and a maximum of 4 participants.",
        "Each presenter will have a maximum of 10 minutes for their presentation.",
        "After the presentation, there will be a 10-minute question and answer session.",
        "Entry Fee: Rs. 100/- Per Participant."
      ],
      coordinators: {
        faculty: {
          name: "Dr. Jagruti J. Jankar",
          phone: "7028492068",
          email: "jjj_ft@adcet.in"
        },
        student: {
          name: "Sahil Suresh Ghatage",
          phone: "7385166092",
          email: "sahilghatage970@gmail.com"
        }
      }
    },
    {
      id: "product-development",
      name: "New Product Development (Prototype)",
      department: "Food Technology",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/New_Product_Development.png",
      description: "Create and prototype revolutionary new food products with commercial market potential. From concept to prototype, demonstrate innovation in food processing, packaging, preservation, and consumer appeal.",
      rules: [
        "Product must be unique or significantly better than existing options.",
        "Avoid copies of competitors' products.",
        "Product must comply with national and international standards (e.g., FSSAI, FDA, ISO, HACCP).",
        "Product must be technically feasible with available resources.",
        "Product should be cost-effective for both producer and consumer.",
        "Create small-scale prototypes and present them at the time of event.",
        "Sensory evaluation will be conducted during the event's official evaluation by a pane of judge.",
        "Each group/Team must consist of minimum 1 to maximum 4 members.",
        "Each presenter will get a maximum of 5 minutes for their presentation.",
        "All development must adhere to ethical standards, including safety and intellectual property respect.",
        "Entry Fee: Rs. 100/- Per Participant."
      ],
      coordinators: {
        faculty: {
          name: "Mr Yashodip R. Pawar",
          phone: "8308571863",
          email: "yrp_ft@adcet.in"
        },
        student: {
          name: "Vaishnavi Suryawanshi",
          phone: "8227987675",
          email: ""
        }
      }
    }
  ]
};

export const getAllEvents = (): Event[] => {
  return Object.values(eventsByDepartment).flat();
};

export const getEventsByDepartment = (departmentId: string): Event[] => {
  return eventsByDepartment[departmentId] || [];
};