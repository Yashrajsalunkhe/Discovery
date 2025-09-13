// Sample events data - this would typically come from an API or CMS
export const eventsData = [
  {
    id: 'coding-competition',
    name: 'Coding Competition',
    department: 'Computer Engineering',
    maxTeamSize: 3,
    entryFee: 100,
    description: 'Test your programming skills in this challenging coding competition. Solve complex algorithms and data structure problems.',
    rules: [
      'Maximum team size: 3 members',
      'Programming languages allowed: C, C++, Java, Python',
      'Duration: 3 hours',
      'No internet access during competition',
      'Participants must bring their own laptops'
    ],
    coordinators: {
      faculty: { name: 'Dr. A. B. Patil', contact: '+91 9876543210' },
      student: { name: 'Rahul Sharma', contact: '+91 8765432109' }
    },
    category: 'programming'
  },
  {
    id: 'web-development',
    name: 'Web Development Challenge',
    department: 'Information Technology',
    maxTeamSize: 2,
    entryFee: 100,
    description: 'Create innovative web applications using modern technologies and frameworks.',
    rules: [
      'Maximum team size: 2 members',
      'Technologies: HTML, CSS, JavaScript, React/Angular/Vue',
      'Duration: 4 hours',
      'Responsive design mandatory',
      'Participants must bring their own laptops'
    ],
    coordinators: {
      faculty: { name: 'Prof. C. D. Desai', contact: '+91 9876543211' },
      student: { name: 'Priya Patel', contact: '+91 8765432108' }
    },
    category: 'web'
  },
  {
    id: 'robotics-challenge',
    name: 'Robotics Challenge',
    department: 'Mechanical Engineering',
    maxTeamSize: 4,
    entryFee: 100,
    description: 'Design and build autonomous robots to complete challenging tasks and obstacles.',
    rules: [
      'Maximum team size: 4 members',
      'Robot size: Maximum 30cm x 30cm x 30cm',
      'Duration: 6 hours for building + competition',
      'Basic components will be provided',
      'Teams can bring additional sensors and components'
    ],
    coordinators: {
      faculty: { name: 'Dr. E. F. Joshi', contact: '+91 9876543212' },
      student: { name: 'Arjun Singh', contact: '+91 8765432107' }
    },
    category: 'robotics'
  },
  {
    id: 'circuit-design',
    name: 'Circuit Design Competition',
    department: 'Electronics Engineering',
    maxTeamSize: 2,
    entryFee: 100,
    description: 'Design innovative electronic circuits and demonstrate their practical applications.',
    rules: [
      'Maximum team size: 2 members',
      'Circuit simulation using SPICE/Multisim',
      'Duration: 3 hours design + 1 hour presentation',
      'Physical implementation preferred',
      'Innovation and practicality will be judged'
    ],
    coordinators: {
      faculty: { name: 'Prof. G. H. Kumar', contact: '+91 9876543213' },
      student: { name: 'Sneha Reddy', contact: '+91 8765432106' }
    },
    category: 'electronics'
  },
  {
    id: 'data-science',
    name: 'Data Science Hackathon',
    department: 'Computer Engineering',
    maxTeamSize: 3,
    entryFee: 100,
    description: 'Analyze real-world datasets and create meaningful insights using machine learning.',
    rules: [
      'Maximum team size: 3 members',
      'Tools: Python, R, Jupyter Notebook',
      'Duration: 8 hours',
      'Dataset will be provided on event day',
      'Final presentation required'
    ],
    coordinators: {
      faculty: { name: 'Dr. I. J. Mehta', contact: '+91 9876543214' },
      student: { name: 'Vikash Gupta', contact: '+91 8765432105' }
    },
    category: 'data-science'
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Development',
    department: 'Information Technology',
    maxTeamSize: 2,
    entryFee: 100,
    description: 'Develop innovative mobile applications for Android or iOS platforms.',
    rules: [
      'Maximum team size: 2 members',
      'Platform: Android (Java/Kotlin) or iOS (Swift)',
      'Duration: 6 hours',
      'App must be functional and deployable',
      'UI/UX design will be considered'
    ],
    coordinators: {
      faculty: { name: 'Prof. K. L. Shah', contact: '+91 9876543215' },
      student: { name: 'Anita Verma', contact: '+91 8765432104' }
    },
    category: 'mobile'
  },
  {
    id: 'cad-design',
    name: 'CAD Design Challenge',
    department: 'Mechanical Engineering',
    maxTeamSize: 1,
    entryFee: 100,
    description: 'Create detailed 3D models and technical drawings using CAD software.',
    rules: [
      'Individual participation only',
      'Software: AutoCAD, SolidWorks, or Fusion 360',
      'Duration: 4 hours',
      'Given problem statement on event day',
      'Technical accuracy and creativity judged'
    ],
    coordinators: {
      faculty: { name: 'Dr. M. N. Rao', contact: '+91 9876543216' },
      student: { name: 'Ravi Kumar', contact: '+91 8765432103' }
    },
    category: 'design'
  },
  {
    id: 'networking',
    name: 'Network Security Challenge',
    department: 'Computer Engineering',
    maxTeamSize: 2,
    entryFee: 100,
    description: 'Test your cybersecurity skills in network penetration testing and security analysis.',
    rules: [
      'Maximum team size: 2 members',
      'Virtual lab environment provided',
      'Duration: 4 hours',
      'Ethical hacking techniques only',
      'Report submission required'
    ],
    coordinators: {
      faculty: { name: 'Prof. O. P. Singh', contact: '+91 9876543217' },
      student: { name: 'Deepak Jain', contact: '+91 8765432102' }
    },
    category: 'security'
  }
]

// Committee data
export const committeeData = {
  central: [
    { name: 'Dr. S. K. Patil', position: 'Director', contact: '+91 9876543200' },
    { name: 'Dr. R. M. Desai', position: 'Dean Academics', contact: '+91 9876543201' },
    { name: 'Prof. A. N. Joshi', position: 'Dean Student Affairs', contact: '+91 9876543202' },
    { name: 'Mr. S. V. Nishandar', position: 'Main Coordinator', contact: '+91 9657028810' }
  ],
  departments: [
    {
      name: 'Computer Engineering',
      head: 'Dr. P. Q. Sharma',
      contact: '+91 9876543220',
      events: ['Coding Competition', 'Data Science Hackathon', 'Network Security Challenge']
    },
    {
      name: 'Information Technology',
      head: 'Prof. R. S. Patel',
      contact: '+91 9876543221',
      events: ['Web Development Challenge', 'Mobile App Development']
    },
    {
      name: 'Mechanical Engineering',
      head: 'Dr. T. U. Kumar',
      contact: '+91 9876543222',
      events: ['Robotics Challenge', 'CAD Design Challenge']
    },
    {
      name: 'Electronics Engineering',
      head: 'Prof. V. W. Reddy',
      contact: '+91 9876543223',
      events: ['Circuit Design Competition']
    }
  ]
}

// Event statistics for homepage
export const eventStats = {
  totalEvents: eventsData.length,
  expectedParticipants: 500,
  departments: 4,
  prizes: '₹50,000+'
}