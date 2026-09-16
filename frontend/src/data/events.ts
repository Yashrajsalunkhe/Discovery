export interface Event {
  id: string;
  name: string;
  department: string;
  minTeamSize?: number;
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
  ruleBookFile?: string; // Path to downloadable rule book file
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

// Common rules for all Paper Presentation events from the supplied 2026 documents.
const paperPresentationRules: string[] = [
  "The maximum team size is specified for each department's paper presentation.",
  "Entry fee: ₹100 per participant.",
  "Participants must email their abstract, research paper, and PowerPoint presentation to the event coordinator.",
  "The submitted research paper and presentation must be in .docx format; bring a pen-drive backup of the presentation.",
  "Each team will be allotted 10 minutes for presentation followed by a question-and-answer session.",
  "Participants from different institutions may form a single team, but a participant cannot join more than one team.",
  "The paper must be original, properly referenced, and based on the submitted abstract.",
  "Participants must report at least 15 minutes before their scheduled presentation. Judges' decisions are final."
];

export const eventsByDepartment: Record<string, Event[]> = {
  aeronautical: [
    {
      id: "aero-paper",
      name: "Paper Presentation",
      department: "Aeronautical Engineering",
        maxTeamSize: 5,
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
      rules: [
        ...paperPresentationRules,
        "Submit the abstract, research paper, and presentation to the event coordinator by the announced deadline."
      ],
      ruleBookFile: "/docs/Paper_Submission_Discovery2k25.docx",
      coordinators: {
        faculty: {
          name: "Dr. Sendhil Kumar S",
          phone: "9486172845",
          email: "ssk_aero@adcet.in"
        },
        student: {
          name: "Mr. Mandar G.",
          phone: "9699532950",
          email: "mandarghodake3@gmail.com"
        }
      }
    },
    {
      id: "paper-glider",
      name: "Paper Glider",
      department: "Aeronautical Engineering",
        maxTeamSize: 1,
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
        "Teams must consist of a minimum of two (2) and a maximum of three (3) members.",
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
          name: "Dr. T. Anand",
          phone: "9786292925",
          email: "drat_aero@adcet.in"
        },
        student: {
          name: "Mr. Raj Kamble",
          phone: "9860257507",
          email: "r03062007@gmail.com"
        }
      }
    },
    {
      id: "rc-simulator",
      name: "RC Simulator",
      department: "Aeronautical Engineering", 
      maxTeamSize: 1,
      entryFee: 100,
      image: "/event-images/Water_rocket.png",
      description: "Experience realistic drone flight simulation with precision control challenges. Test your piloting skills through take-off, maneuvering, and safe landing procedures using professional flight simulation equipment.",
      rules: [
        "Each participant will get a briefing session and one trial attempt before the main round.",
        "Participants must successfully take off, maneuver, and land the drone safely using the simulator.",
        "Performance will be judged on control, safety, and smooth landing within the given time."
      ],
      coordinators: {
        faculty: {
          name: "Mr. Mohammed Hashim Y.",
          phone: "906129305",
          email: "mhy_aero@adcet.in"
        },
        student: {
          name: "Mr. Samarth Lomate",
          phone: "9022161641",
          email: "samarthlomate6@gmail.com"
        }
      }
    }
  ],
  mechanical: [
    {
      id: "mech-paper",
      name: "Paper Presentation",
      department: "Mechanical Engineering",
      maxTeamSize: 5,
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
    ruleBookFile: "/docs/Paper_Submission_Discovery2k25.docx",
    coordinators: {
      faculty: {
        name: "Mr. Ajit R. Mane",
        phone: "9850567931",
        email: ""
      },
      student: {
        name: "Mr. Shreyash Yadav",
        phone: "9960308760",
        email: ""
      }
    }
    },
    {
      id: "robo-soccer",
      name: "Robo Soccer",
      department: "Mechanical Engineering",
      minTeamSize: 2,
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
          name: "Mr. Aditya Yadav",
          phone: "8767785044",
          email: ""
        }
      }
    },
    {
      id: "cad-master",
      name: "CAD Master",
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
          name: "Mr. Ganesh N. Rakate",
          phone: "9527994100",
          email: ""
        },
        student: {
          name: "Mr. Suraj Chavan",
          phone: "7249501283",
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
      maxTeamSize: 6,
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
    ruleBookFile: "/docs/Paper_Submission_Discovery2k25.docx",
    coordinators: {
      faculty: {
        name: "Mr. Indrajit D. Pharane",
        phone: "9657240024",
        email: ""
      },
      student: {
          name: "Nilesh Lohar",
          phone: "8329293272",
        email: ""
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
        faculty: { name: "Mrs. Komal Nagsen Jadhav", phone: "7972037461", email: "" },
        student: { name: "Sujay Kedge", phone: "9373374002", email: "sujaykedge05@gmail.com" }
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
        faculty: { name: "Mrs. Tejal S Bangdar", phone: "8788312214", email: "" },
        student: { name: "Ritika Shevade", phone: "8999921327", email: "ritikashevade9@gmail.com" }
      }
    }
  ],
  civil: [
    {
      id: "civil-paper",
      name: "Paper Presentation",
      department: "Civil Engineering",
      maxTeamSize: 5,
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
    ruleBookFile: "/docs/Paper_Submission_Discovery2k25.docx",
    coordinators: {
      faculty: {
        name: "Dr. Vidya Abhijeet Lande",
        phone: "7387102650",
        email: ""
      },
      student: {
        name: "Mr. Chinmay Jadhav",
        phone: "9309417271",
        email: ""
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
        faculty: { name: "Dr. Shashiraj S. Chougle", phone: "9890154849", email: "" },
        student: { name: "Mr. Ayush Atugade", phone: "7666290293", email: "atuayush.5203@gmail.com" }
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
        faculty: { name: "Mr. Kiran K. Shinde", phone: "9766641010", email: "" },
        student: { name: "Mr. Varad More", phone: "7249380924", email: "morevarad937@gmail.com" }
      }
    }
  ],
  cse: [
    {
      id: "cse-paper",
      name: "Paper Presentation",
      department: "Computer Science Engineering",
      maxTeamSize: 5,
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
    ruleBookFile: "/docs/Paper_Submission_Discovery2k25.docx",
    coordinators: {
      faculty: {
        name: "Dr. Anisa B. Shikalgar",
        phone: "9284068550",
        email: "baj_cse@adcet.in"
      },
      student: {
        name: "Parth Lande",
        phone: "7972467100",
        email: ""
      }
    }
    },
    {
      id: "code-compete",
      name: "Code 2 Compete",
      department: "Computer Science Engineering",
      maxTeamSize: 2,
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
        faculty: { name: "Mr. Ajit R. Pradyavant", phone: "7304721566", email: "" },
        student: { name: "Sudarshan Kosti", phone: "9049575622", email: "sudarshan.kosti811@gmail.com" }
      }
    },
    {
      id: "b-plan",
      name: "B-Plan",
      department: "Computer Science Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      image: "/event-images/b_plan.png",
      description: "Present your innovative startup business plan and pitch your entrepreneurial ideas to industry experts. Showcase your business acumen, market analysis, and financial projections in this comprehensive business competition.",
      rules: [
        "Team size: Maximum 2 students per team.",
        "Poster must be 300 –800 words, readable from 10 feet.",
        "Use clear graphics, colors, and fonts for better impact.",
        "Presentation time: 10 minutes + 5 minutes Q&A.",
        "Teams must present both poster and business idea to judges.",
        "Entry fee: Rs. 100/- per participant.",
        "Posters and presentations must be clear, concise, and focused on key aspects."
      ],
      coordinators: {
        faculty: { name: "Dr. Bhagyashala A. Jadhawar", phone: "9284068550", email: "" },
        student: { name: "Vinay Niranjan", phone: "7755932511", email: "vinaynirananjan7@gmail.com" }
      }
    }
  ],
  aids: [
    {
      id: "aids-paper",
      name: "Paper Presentation",
      department: "AI & Data Science",
      maxTeamSize: 5,
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
    ruleBookFile: "/docs/Paper_Submission_Discovery2k25.docx",
    coordinators: {
      faculty: {
        name: "Mrs. Supriya S. Patil",
        phone: "9096898542",
        email: "psp_aids@adcet.in"
      },
      student: {
        name: "Rishikesh Dilip Dhapse",
        phone: "8857869924",
        email: "rushikeshdhapse81@gmail.com"
      }
    }
    },
    {
      id: "codemania",
      name: "CodeMania",
      department: "AI & Data Science",
      maxTeamSize: 1,
      entryFee: 100,
      image: "/event-images/Coding_Compi.png",
      description: "A three-round coding challenge that tests programming fundamentals and problem-solving under time pressure.",
      rules: [
        "The contest has three rounds, with two problems in each round.",
        "Each round lasts 30 minutes.",
        "Participants compete individually.",
        "Any plagiarism results in immediate disqualification."
      ],
      coordinators: {
        faculty: { name: "Mrs. Smita Pavan Nalavade", phone: "7498695865", email: "sdp_aids@adcet.in" },
        student: { name: "Asmita Shinde", phone: "7745019675", email: "asmitashinde2808@gmail.com" }
      }
    },
    {
      id: "prompt-wars",
      name: "PROMPT WARS - Battle of the Minds",
      department: "AI & Data Science",
      maxTeamSize: 1,
      entryFee: 100,
      image: "/event-images/Coding_Compi.png",
      description: "A timed generative-AI challenge where teams reveal, refine, and submit prompts for a secret scenario.",
      rules: [
        "Teams may have 1 to 3 participants.",
        "Any accessible LLM or image generator may be used unless the organizers specify a unified platform.",
        "Each round lasts 5 to 10 minutes.",
        "Submit the final output with an uncropped full-screen screenshot showing the exact prompt, model output, and timestamp.",
        "Re-uploads are locked after submission."
      ],
      specifications: [
        "Challenge reveal: the host announces the target scenario or output requirement at the start of each round.",
        "Execution window: teams draft, test, and iterate on prompts within the allocated time.",
        "Final submission: include the output and an uncropped screenshot showing the prompt, model output, and timestamp."
      ],
      coordinators: {
        faculty: { name: "Prof. Prajakta S. Dabade", phone: "8262975756", email: "psd_aids@adcet.in" },
        student: { name: "Amit Kadam", phone: "9075768121", email: "amitkadam1441@gmail.com" }
      }
    }
  ],
  iot: [
    {
      id: "iot-paper",
      name: "Paper Presentation",
      department: "IoT & Cyber Security",
      maxTeamSize: 5,
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
    ruleBookFile: "/docs/Paper_Submission_Discovery2k25.docx",
    coordinators: {
      faculty: {
          name: "Mr. Samish N. Kamble",
        phone: "9823723719",
        email: "snk_iot@adcet.in"
      },
      student: {
        name: "Mr. Anoj Pawar",
        phone: "8446384538",
        email: "pawaranoj038@gmail.com"
      }
    }
    },
    {
      id: "catch-the-flag",
      name: "Catch the Flag",
      department: "IoT & Cyber Security",
      maxTeamSize: 1,
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
        "Submission deadline will be announced by the organizers."
      ],
      coordinators: {
        faculty: { name: "Mrs. Simran Tanvir Chaus", phone: "7840929304", email: "" },
        student: { name: "Mr. Gaurav Rajguru", phone: "7057565661", email: "gauravrajguru321@gmail.com" }
      }
    },
    {
      id: "bgmi",
      name: "BGMI",
      department: "IoT & Cyber Security",
      minTeamSize: 2,
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/Bgmi_dominator.png",
      description: "A competitive BGMI team challenge focused on coordination, strategy, and sportsmanship.",
      rules: [
        "Teams consist of 4 participants.",
        "Players must follow the event officials' instructions and sportsmanship requirements.",
        "The decision of the officials is final."
      ],
      coordinators: {
        faculty: { name: "Ms. Vaishali G. Waghmode", phone: "8788172378", email: "" },
        student: { name: "Ms. Dhanshree Tandale", phone: "9022239537", email: "" }
      }
    }
  ],
  bba: [
    {
      id: "bba-paper",
      name: "Paper Presentation",
      department: "Business Administration",
        maxTeamSize: 2,
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
      ruleBookFile: "/docs/Paper_Submission_Discovery2k25.docx",
      coordinators: {
          faculty: { name: "Ms. Anuja Ashok Salgar", phone: "7447251200", email: "" },
        student: { name: "Sanika Pawar", phone: "7020073670", email: "" }
      }
    },
    {
      id: "ad-mad",
      name: "Ad-Mad",
      department: "Business Administration",
      maxTeamSize: 5,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "A creative advertising challenge where teams develop and present an engaging campaign.",
      rules: [
        "Teams may have up to 5 participants.",
        "The advertising concept and presentation must be original.",
        "Judges' decisions are final."
      ],
      coordinators: {
        faculty: { name: "Mr. Aman Shakil Sayyad", phone: "8530022400", email: "" },
        student: { name: "Parth Yadav", phone: "9604171177", email: "" }
      }
    }
  ],
  food: [
    {
      id: "functional-food",
      name: "Paper Presentation",
      department: "Food Technology",
      maxTeamSize: 5,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present an original food technology research paper, process, or product innovation to a judging panel.",
      rules: paperPresentationRules,
      coordinators: {
        faculty: {
          name: "Dr. Jagruti J. Jankar",
          phone: "7028492068",
          email: "jjj_ft@adcet.in"
        },
        student: {
          name: "Ms. Pranali Kokare",
          phone: "9321655038",
          email: ""
        }
      }
    },
    {
      id: "new-product-development",
      name: "New Food Product Development",
      department: "Food Technology",
      maxTeamSize: 3,
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
        "Each group/Team must consist of minimum 1 to maximum 3 members.",
        "Each presenter will get a maximum of 5 minutes for their presentation.",
        "All development must adhere to ethical standards, including safety and intellectual property respect."
      ],
      coordinators: {
        faculty: {
          name: "Dr. Kishor Kailasrao Giram",
          phone: "8575751111",
          email: ""
        },
        student: {
          name: "Mr. Vidhan R. Lade",
          phone: "9370104546",
          email: ""
        }
      }
    }
  ],
  robotics: [
    {
      id: "innovatex-robotics-ai",
      name: "InnovateX - Robotics & AI",
      department: "Robotics & AI",
      maxTeamSize: 2,
      entryFee: 100,
      image: "/event-images/placeholder.svg",
      description: "Build and present an innovative robotics or artificial intelligence solution for a real-world problem.",
      rules: [
        "Teams may include up to two participants.",
        "The project must be original and presented by the registered team.",
        "Teams must bring their prototype, presentation, and supporting documentation.",
        "Judges' decisions will be final."
      ],
      coordinators: {
        faculty: { name: "Mrs. Rutuja S. Pawar", phone: "9765317323", email: "" },
        student: { name: "Mr. Shivaji Shivaji Patil", phone: "8767493503", email: "shivajipatil9868@gmail.com" }
      }
    }
  ],
  bca: [
    {
      id: "bca-paper",
      name: "Paper Presentation",
      department: "BCA",
      maxTeamSize: 5,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present an original paper on an emerging technology, application, or computing solution.",
      rules: paperPresentationRules,
      ruleBookFile: "/docs/Paper_Submission_Discovery2k25.docx",
      coordinators: {
        faculty: { name: "Ms. Piusha U. Magdum", phone: "8767258041", email: "" },
        student: { name: "Mr. Mateen L. Mulla", phone: "9545289737", email: "" }
      }
    },
    {
      id: "tech-treasure-hunt",
      name: "Tech Treasure Hunt",
      department: "BCA",
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/placeholder.svg",
      description: "Solve a chain of technology-focused clues and challenges in this fast-paced team competition.",
      rules: [
        "Teams may include up to four participants.",
        "All clues and challenges must be completed within the allotted time.",
        "Participants must follow the instructions of event coordinators.",
        "The decision of the organizers will be final."
      ],
      coordinators: {
        faculty: { name: "Ms. Alisha A. Jamadar", phone: "7558296750", email: "" },
        student: { name: "Mr. Sudharshan J. Sawant", phone: "7028740881", email: "sudharshansawant6@gmail.com" }
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