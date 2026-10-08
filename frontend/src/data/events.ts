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
  whatsappGroupLink?: string; // WhatsApp group invite link
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
  "Connect Your Research with the Relevant Sustainable Development Goals (SDGs).",
  "Participants must report at least 15 minutes before their scheduled presentation. Judges' decisions are final."
];

export const eventsByDepartment: Record<string, Event[]> = {
  aeronautical: [
    {
      id: "aero-paper",
      name: "Paper Presentation",
      department: "Aeronautical Engineering",
      minTeamSize: 2,
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
      ruleBookFile: "/docs/Paper_Template.docx",
      whatsappGroupLink: "https://chat.whatsapp.com/EAXqI5aqwty73f40C3saRo",
      coordinators: {
        faculty: {
          name: "Dr. S. Sendhil Kumar",
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
      minTeamSize: 1,
      maxTeamSize: 2,
      entryFee: 100,
      image: "/event-images/Paper_Glider.png",
      description: "Design, fold, and hand-launch an original paper glider using only the A4 sheet provided at the venue. Compete for flight time, distance, accuracy, and design excellence.",
      specifications: [
        "One A4-size paper sheet will be provided to each participant.",
        "No extra paper or additional material is allowed.",
        "The glider must be made completely from the provided paper by folding only."
      ],
      rules: [
        "Each team must consist of exactly two (2) members.",
        "The glider must be made completely at the event venue.",
        "Participants may fold, crease, roll, or tear the provided paper only if the organizers permit it.",
        "No modification or addition of material is allowed after the glider is submitted for inspection.",
        "The glider must be hand-launched.",
        "The organizer's or judge's decision will be final and binding."
      ],
      gameplay: [
        "The glider must be launched from the designated launch line.",
        "Only one person may launch the glider.",
        "Throwing the glider with excessive force or using a mechanical launching device is not allowed.",
        "The participant must release the glider by hand.",
        "The glider must be launched within the given time limit.",
        "Each participant will get 3 attempts, and the best valid attempt will be considered for the final score."
      ],
      scoring: [
        "For maximum flight time, time is measured from release until the glider first touches the ground.",
        "For maximum distance, distance is measured from the launch line to the point where the glider first touches the ground.",
        "For accuracy landing, the closest valid landing to the designated target will be ranked highest.",
        "Best Glider Design will be judged on creativity and construction.",
        "Recommended format: 10–15 minutes construction time, 3 flight attempts, and the best attempt counts."
      ],
      safetyRegulations: [
        "Scissors, blades, cutters, and any sharp tools are strictly prohibited.",
        "A glider touching a wall, ceiling, person, or other obstruction may be declared invalid by the judges.",
        "The event coordinators may stop or invalidate a flight if it creates a safety issue."
      ],
      disqualification: [
        "Using extra paper or any unauthorized material.",
        "Using scissors, cutters, glue, tape, or any unauthorized tool or material.",
        "Bringing a pre-made or pre-folded glider.",
        "Receiving outside assistance during construction.",
        "Intentionally interfering with another participant's glider.",
        "Arguing with or disrespecting judges or organizers.",
        "Violating any competition rule."
      ],
      constructionGuidelines: [
        "No glue, tape, stapler, pins, clips, rubber bands, or any additional material is allowed.",
        "Participants must make the glider only by folding the provided paper.",
        "No pre-folded, pre-made, or prepared gliders are permitted."
      ],
      generalInstructions: [
        "Participants must follow the instructions given by the event coordinators.",
        "Participants are responsible for keeping their work area clean.",
        "Any rule not specifically mentioned will be decided by the event coordinators based on fairness and safety."
      ],
      whatsappGroupLink: "https://chat.whatsapp.com/JGJehAk9VskJ4R9y7UJ8FR",
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
      description: "Test your aircraft control and landing precision in the Phoenix RC Flight Simulator.",
      rules: [
        "Each participant receives 2 minutes of familiarization with the transmitter/controller.",
        "Familiarization time is not included in the competition time or score.",
        "A valid cycle requires a controlled take-off, the required flight or maneuver, and a safe landing on the designated runway.",
        "A landing outside the runway, crash, loss of control, or significant aircraft damage makes the cycle invalid.",
        "Round 1 qualifiers proceed to Round 2. The event coordinator's decision is final."
      ],
      gameplay: [
        "Round 1 - Basic Flight: 3 minutes in Ground View. Complete as many valid take-off, maneuver, and runway landing cycles as possible.",
        "Round 2 - Cockpit View and Aerobatics: 3 minutes for qualified participants. Complete the required loops or rolls before landing on the runway."
      ],
      scoring: [
        "Each valid flight cycle earns 1 point. The participant with the highest Round 1 score qualifies, and the participant with the most valid Round 2 cycles wins.",
        "In case of a tie, the coordinator will conduct a tie-breaker flight with conditions and tasks decided by the coordinator.",
        "FLY SMART - CONTROL THE AIRCRAFT - LAND WITH PRECISION."
      ],
      whatsappGroupLink: "https://chat.whatsapp.com/IvK6tEwHukb9HMcNouaqVa",
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
      minTeamSize: 2,
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
      ruleBookFile: "/docs/Paper_Template.docx",
      whatsappGroupLink: "https://chat.whatsapp.com/BMSXrvvKLAm09Vi8RFRe3X?s=sw&p=i&mlu=4&ilr=4",
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
      description: "Compete in a 2 vs 2 robotic football match that tests robot control, strategy, coordination, attacking ability, defensive planning, and technical skill.",
      specifications: [
        "Each team has two participants and two robots: one organizer-provided wired defensive robot and one wireless active robot.",
        "The wireless robot may be brought by the team or requested from the organizing committee, subject to approval and availability.",
        "The two participants may operate the permitted robots according to the event instructions.",
        "The playing field is 200 cm x 180 cm and includes a clearly marked centre line.",
        "Each goal is 40 cm wide. A goal counts when the entire ball crosses the goal line.",
        "The official ball is a plastic table-tennis ball supplied or approved by the organizers.",
        "An externally supplied wireless robot must weigh no more than 3 kg and use no more than 4 motors, each with a maximum speed of 1000 RPM.",
        "Manual wireless control is compulsory for the active robot; wired control is prohibited.",
        "All wires must be insulated and securely arranged, and the robot must pass the organizing committee's safety inspection.",
        "Pneumatic, hydraulic, combustion, flammable-liquid, explosive, RF-jamming, wireless-interference, dangerous electrical, and intentional-damage systems are prohibited."
      ],
      rules: [
        "The wired defensive robot is provided by the organizing committee, positioned near the team's own goal, and may not be modified by participants.",
        "The wired defensive robot must remain in its own defensive half and must not cross the centre line.",
        "The wired robot may block, deflect, or intercept the ball, but participants must not deliberately misuse its cable or use it to obstruct an opponent.",
        "The wireless robot may cross the centre line, enter the opponent's half, attack the goal, and return to defend.",
        "The wireless robot may push, strike, deflect, and intercept the ball, but must not intentionally damage another robot.",
        "A robot must not permanently trap, illegally carry, enclose, or use adhesive to retain the ball.",
        "The ball is placed at the centre before the match. Both wireless robots must remain in their starting positions until the referee's start signal.",
        "The wired robots remain at their respective goal areas, and no participant may move a robot before the official start signal.",
        "Each match lasts 3 minutes and continues until time expires unless the referee stops it for safety, technical, or other valid reasons.",
        "After a goal, the referee confirms and records the score, returns the ball and robots to their designated positions, and restarts play on the signal.",
        "Teams using their own wireless robot must contact the organizing committee before the event for inspection and approval; the committee's eligibility decision is final.",
        "The referee may stop a match for safety or technical issues and has final authority on legal ball control and event decisions.",
        "Teams must follow all safety instructions and may be disqualified for unsafe operation, misconduct, or serious rule violations.",
        "A damaged or unsuitable official ball may be replaced only by the referee."
      ],
      gameplay: [
        "Two teams compete with one wired defensive robot at each goal and one wireless active robot on the field for each team.",
        "The team that scores more goals before the 3-minute match ends wins.",
        "The wireless robot is the active field robot and may perform both attacking and defensive movements throughout the permitted playing area.",
        "A goal is awarded only when the entire ball crosses the opponent's goal line.",
        "The referee may award a goal to the opposing team, remove a robot from play, stop the match, or disqualify a team for fouls.",
        "Fouls include crossing the centre line with the wired robot, intentional damage, aggressive or unsafe collisions, intentional obstruction, illegal ball trapping, control interference, unauthorized wired-robot modification, prohibited systems, cable misuse, unsafe operation, and misconduct.",
        "Penalties may include a verbal or official warning, temporary stoppage, a goal for the opposing team, removal of the offending robot, or team disqualification. Repeated or serious violations may result in immediate disqualification."
      ],
      safetyRegulations: [
        "Robots must not have dangerous exposed components, sharp projections, or other hazards.",
        "The wired robot cable must remain connected to its provided control system and may not be pulled aggressively, wrapped around another robot, or placed across an opponent's path.",
        "Only authorized organizers may repair or modify the wired robot or its cable.",
        "Prohibited systems include pneumatic, hydraulic, combustion, flammable-liquid, explosive, RF-jamming, wireless-interference, dangerous electrical, and intentional-damage mechanisms.",
        "If the wired robot fails, the participant must inform the referee; the technical team will inspect it and the organizers may repair or replace it. The referee decides whether to restart or continue the match.",
        "If the wireless robot fails, the team must inform the referee, may not enter the field without permission, and may repair or replace it only as directed by the organizers.",
        "Any replacement wireless robot must satisfy the event's technical requirements.",
        "All participants must follow safety instructions, and no robot may intentionally damage another robot or create a safety hazard."
      ],
      whatsappGroupLink: "https://chat.whatsapp.com/Gc1VAtLLcgo9xdViWh6t4s",
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
      description: "Showcase your 3D modeling and CAD design skills in this intensive individual competition. Create complex mechanical components and assemblies using industry-standard software like CATIA under time pressure.",
      rules: [
        "Individual participation is allowed and If the entry is more than 45 candidates, pre-qualifier round will be conducted.",
        "Participant should make the models in CATIA.",
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
      whatsappGroupLink: "https://chat.whatsapp.com/CnHYVYSBVtL99RLAY8qmu2",
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
      minTeamSize: 2,
      maxTeamSize: 5,
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
      ruleBookFile: "/docs/Paper_Template.docx",
      coordinators: {
        faculty: {
          name: "Mr. Indrajit D. Pharane",
          phone: "9657240024",
          email: "idp_ele@adcet.in"
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
        "The question paper will be distributed at the commencement of the event.",
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
      minTeamSize: 2,
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
      ruleBookFile: "/docs/Paper_Template.docx",
      coordinators: {
        faculty: {
          name: "Dr. Vidya Abhijeet Lande",
          phone: "7387102650",
          email: "vmp_civil@adcet.in"
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
      minTeamSize: 2,
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
      ruleBookFile: "/docs/Paper_Template.docx",
      coordinators: {
        faculty: {
          name: "Dr. Anisa B. Shikalgar",
          phone: "9284068550",
          email: "abs_cse@adcet.in"
        },
        student: {
          name: "Parth Lande",
          phone: "9175296745",
          email: ""
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
      minTeamSize: 2,
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
      ruleBookFile: "/docs/Paper_Template.docx",
      coordinators: {
        faculty: {
          name: "Mrs. Supriya Abhijeet Pati",
          phone: "9096898542",
          email: "sap_aids@adcet.in"
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
      description: "CodeMania is a three-round coding event that tests programming knowledge, teamwork, strategy and debugging skill. Participants are filtered at each stage — starting with an individual MCQ test (Code Quest), progressing to a team-based clue hunt (Code Treasure Hunt), and culminating in an individual auction-and-debug finale (Code Auction & Debug). Think. Solve. Conquer.",
      specifications: [
        "Round 1 – Code Quest: Individual MCQ test (30 min, 30 questions). Topics include programming fundamentals, data structures, algorithms, output prediction, logic & aptitude, basic DBMS/OS/networking, and tech general knowledge. Languages: C, C++, Java, Python.",
        "Round 2 – Code Treasure Hunt: Team-based clue hunt (60 min, 5–6 checkpoints). Qualified participants are randomly divided into teams of 3–4. Clues involve output prediction, cipher/pattern decoding, algorithm problems, and completing missing code.",
        "Round 3 – Code Auction & Debug: Individual auction + debugging finale (~70 min). Participants bid for buggy code lots using 1000 virtual CodeCoins, then debug the won lots against test cases."
      ],
      coordinators: {
        faculty: { name: "Mrs. Smita Pavan Nalavade", phone: "7498695865", email: "sdp_aids@adcet.in" },
        student: { name: "Asmita Shinde", phone: "7745019675", email: "asmitashinde2808@gmail.com" }
      }
    },
    {
      id: "prompt-wars",
      name: "Prompt Wars",
      department: "AI & Data Science",
      maxTeamSize: 1,
      entryFee: 100,
      image: "/event-images/Coding_Compi.png",
      description: "PROMPT WARS - Battle of the Minds is a three-round timed Generative AI challenge designed to test participants' prompt engineering, creativity, problem-solving, and AI-assisted development skills. Participants progress from basic image generation to scenario-based prompting and finally to building a functional digital product using prompts.",
      rules: [
        "Participants compete individually.",
        "Only AI tools permitted or announced by the organizers may be used.",
        "All prompts, outputs, screenshots, prototypes, and demonstrations must be submitted through the official submission method.",
        "Participants must complete and submit their work within the time allotted for each round.",
        "Round 1 requires a mobile screenshot showing the exact prompt and generated image.",
        "Round 2 requires submission of the final prompt and generated output.",
        "Round 3 requires a functional prototype with the required features and a demonstration when requested by the judges.",
        "Judges' decisions regarding the final product and demonstration are final."
      ],
      specifications: [
        "Round 1 - Prompt to Picture: Classroom, Easy, 10 minutes. Create an image from an organizer-provided topic and submit a screenshot showing the prompt and output.",
        "Round 2 - Scenario Sprint: Computer Lab, Intermediate, 10 minutes. Convert a randomly assigned approximately 15-word scenario into an effective prompt and generate a relevant output.",
        "Round 3 - Prompt to Product: Computer Lab, Advanced / Final Round, 20-30 minutes. Build and refine a functional website, landing page, dashboard, portfolio, booking interface, event website, or other assigned digital product using AI-assisted development."
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
      minTeamSize: 2,
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
      ruleBookFile: "/docs/Paper_Template.docx",
      coordinators: {
        faculty: {
          name: "Prof. S. N. Kamble",
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
      description: "This event will be conducted through individual participation.",
      rules: [
        "Round 1 - MCQ Test: The first round will consist of an MCQ-based test. Participants will have to answer 30 questions within 30 minutes. The test will be conducted on the college-provided PCs and not on personal laptops or devices. Students who achieve the minimum qualifying score will be selected for the second round.",
        "Round 2 - Code Debugging: In the second round, participants will be given 3 programs along with their specific expected outputs. Participants will have to identify and correct errors in the given code and fill in the required blanks to produce the specified output.",
        "Round 3 - Software-Based Round: The final round will be conducted using the designated software. Participants will have to complete the given tasks within the specified time. The performance in this round will be considered for the final evaluation.",
        "The event is open for individual participation. Team participation is not allowed.",
        "Participants must complete 30 MCQs within 30 minutes in Round 1.",
        "Only participants who meet the minimum qualifying criteria will proceed to Round 2.",
        "In Round 2, participants must identify errors, fill in the blanks, and obtain the specified output from the given programs.",
        "Any form of unfair means, cheating, copying, or use of unauthorized resources will result in immediate disqualification.",
        "The time limit for each round must be strictly followed. No extra time will be provided unless announced by the organizers.",
        "Participants must save or submit their answers or output as instructed before the time expires.",
        "The decision of the event coordinators or judges will be final."
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
      minTeamSize: 2,
      maxTeamSize: 5,
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
      ruleBookFile: "/docs/Paper_Template.docx",
      coordinators: {
        faculty: { name: "Ms. Anuja Ashok Salgar", phone: "7447251200", email: "aas_bba@adcet.in" },
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
      minTeamSize: 2,
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
      minTeamSize: 2,
      maxTeamSize: 4,
      entryFee: 100,
      image: "/event-images/placeholder.svg",
      description: "Build and present an innovative robotics or artificial intelligence solution for a real-world problem.",
      rules: [
        "Each team must have a minimum of 2 and a maximum of 4 members.",
        "The project must be original and presented by the registered team.",
        "Teams must bring a live working prototype of their project and a PPT containing a minimum of 3 slides.",
        "Project Guidelines: Hardware-based projects are compulsory. Hardware + Software projects are welcome, but software-only projects are not accepted.",
        "Judges' decisions will be final.",
        "Only registered participants are allowed to join the official WhatsApp group. The group link and further instructions are provided below."
      ],
      whatsappGroupLink: "https://chat.whatsapp.com/BBjFrCRNWKG9m8l0JOVjae",
      coordinators: {
        faculty: { name: "Mrs. Rutuja S. Pawar", phone: "9765317323", email: "" },
        student: { name: "Mr. Shivaji shivaji Patil", phone: "8767493503", email: "shivajipatil9868@gmail.com" }
      }
    }
  ],
  bca: [
    {
      id: "bca-paper",
      name: "Paper Presentation",
      department: "BCA",
      minTeamSize: 2,
      maxTeamSize: 5,
      entryFee: 100,
      image: "/event-images/paper_presentation.png",
      description: "Present an original paper on an emerging technology, application, or computing solution.",
      rules: paperPresentationRules,
      ruleBookFile: "/docs/Paper_Template.docx",
      coordinators: {
        faculty: { name: "Ms. Piusha U. Magdum", phone: "8767258041", email: "pum_bca@adcet.in" },
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
        student: { name: "Mr. Sudharshan J. Sawant", phone: "7028740881", email: "sawantsudarshan6@gmail.com" }
      }
    }
  ]
};

const whatsappGroupLinks: Record<string, string> = {
  "rc-simulator": "https://chat.whatsapp.com/IvK6tEwHukb9HMcNouaqVa",
  "functional-food": "https://chat.whatsapp.com/JYALcHpljCJ4Xl70jllLtJ",
  "catch-the-flag": "https://chat.whatsapp.com/GPNQsL6wrC266M0lxv6wWB",
  "tech-treasure-hunt": "https://chat.whatsapp.com/KGTLVkRDiXSCZ4XtBG1rKY",
  akruti: "https://chat.whatsapp.com/GmJBeJehdmZ36PZhlHlI5l?s=sw&p=i&mlu=4&ilr=4",
  "mech-paper": "https://chat.whatsapp.com/BMSXrvvKLAm09Vi8RFRe3X?s=sw&p=i&mlu=4&ilr=4",
  "aids-paper": "https://chat.whatsapp.com/CQg8eIAtKln2JFHgfXYXJr",
  "aero-paper": "https://chat.whatsapp.com/EAXqI5aqwty73f40C3saRo",
  setu: "https://chat.whatsapp.com/IS2eeZAP2hC0Qkzmev1J3M",
  "paper-glider": "https://chat.whatsapp.com/JGJehAk9VskJ4R9y7UJ8FR",
  "cad-master": "https://chat.whatsapp.com/CnHYVYSBVtL99RLAY8qmu2",
  troubleshooting: "https://chat.whatsapp.com/JtiltjLOjfrAoD6346RRDl",
  "circuit-builder": "https://chat.whatsapp.com/IK5jdUslIUn0TrEcKcH0PS",
  "cse-paper": "https://chat.whatsapp.com/Bj2Rru0eAEx58ExI67yMsC?s=cl&p=a&mlu=4&ilr=4",
  "code-compete": "https://chat.whatsapp.com/EuvFNQZsYqeGfcS08rF1ww?s=sh&p=a&mlu=4&ilr=4",
  "b-plan": "https://chat.whatsapp.com/L7mu4urDe7j5goEgwuZlIK",
  "new-product-development": "https://chat.whatsapp.com/J1oYSFfMviA9WuI3b9osf4?mode=gi_t",
  "civil-paper": "https://chat.whatsapp.com/BAyF7BdLYXaLE7KcWd7hGh",
  bgmi: "https://chat.whatsapp.com/DdfePy6hLsoHgaIEwyBPUd",
  "iot-paper": "https://chat.whatsapp.com/K6QAzUts32OFwswLgNJTeG",
  "prompt-wars": "https://chat.whatsapp.com/IYwIocttxeH5QTUyl6962W",
  "bca-paper": "https://chat.whatsapp.com/E5C6r1cTqvEEPU6rMbbztL",
  codemania: "https://chat.whatsapp.com/EvESL3ztfcZGholOFBks7t?mode=gi_t",
  "innovatex-robotics-ai": "https://chat.whatsapp.com/BBjFrCRNWKG9m8l0JOVjae",
  "ad-mad": "https://chat.whatsapp.com/Ee9W6GuGd1v5mDu7PqXvX0?s=sh&p=a&mlu=4&ilr=4",
  "bba-paper": "https://chat.whatsapp.com/LHwTQ7aGdIV6L1Q4iygsRA",
  "robo-soccer": "https://chat.whatsapp.com/Gc1VAtLLcgo9xdViWh6t4s",
  "elec-paper": "https://chat.whatsapp.com/JYcX3pUcIzIBWXKP3Bpdsp?mode=gi_t"
};

export const getAllEvents = (): Event[] => {
  return Object.values(eventsByDepartment).flat().map((event) => ({
    ...event,
    whatsappGroupLink: whatsappGroupLinks[event.id] || event.whatsappGroupLink
  }));
};

export const getEventsByDepartment = (departmentId: string): Event[] => {
  return (eventsByDepartment[departmentId] || []).map((event) => ({
    ...event,
    whatsappGroupLink: whatsappGroupLinks[event.id] || event.whatsappGroupLink
  }));
};