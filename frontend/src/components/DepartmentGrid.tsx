import styles from './DepartmentGrid.module.css';
import { eventsByDepartment } from '../data/events';

interface Department {
  id: string;
  name: string;
  eventCount: number;
  eventNames: string[];
}

const departments: Department[] = [
  {
    id: "aids",
    name: "AI & Data Science",
    eventCount: 3,
    eventNames: eventsByDepartment.aids?.map(event => event.name) || []
  },
  {
    id: "mechanical", 
    name: "Mechanical Engineering",
    eventCount: 3,
    eventNames: eventsByDepartment.mechanical?.map(event => event.name) || []
  },
  {
    id: "electrical",
    name: "Electrical Engineering", 
    eventCount: 3,
    eventNames: eventsByDepartment.electrical?.map(event => event.name) || []
  },
  {
    id: "civil",
    name: "Civil Engineering",
    eventCount: 3,
    eventNames: eventsByDepartment.civil?.map(event => event.name) || []
  },
  {
    id: "cse",
    name: "Computer Science Engineering",
    eventCount: 3,
    eventNames: eventsByDepartment.cse?.map(event => event.name) || []
  },
  {
    id: "aeronautical",
    name: "Aeronautical Engineering",
    eventCount: 3,
    eventNames: eventsByDepartment.aeronautical?.map(event => event.name) || []
  },
  {
    id: "iot",
    name: "IoT & Cyber Security",
    eventCount: 3,
    eventNames: eventsByDepartment.iot?.map(event => event.name) || []
  },
  {
    id: "bba",
    name: "Business Administration",
    eventCount: 1,
    eventNames: eventsByDepartment.bba?.map(event => event.name) || []
  },
  {
    id: "food",
    name: "Food Technology",
    eventCount: 2,
    eventNames: eventsByDepartment.food?.map(event => event.name) || []
  }
];

interface DepartmentGridProps {
  onDepartmentSelect: (department: Department) => void;
}

export const DepartmentGrid = ({ onDepartmentSelect }: DepartmentGridProps) => {
  return (
    <section id="departments" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Choose Your Department
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore events across 9 departments and showcase your skills in your area of expertise
          </p>
        </div>
        
        <div className={styles.agFormatContainer}>
          <div className={styles.agCoursesBox}>
            {departments.map((dept, index) => (
              <div key={dept.id} className={styles.agCoursesItem} onClick={() => onDepartmentSelect(dept)}>
                <div className={styles.agCoursesItemLink}>
                  <div className={styles.agCoursesItemBg}></div>
                  <div className={styles.agCoursesItemTitle}>
                    {dept.name}
                  </div>
                  <div className={styles.agCoursesItemDateBox}>
                    Events:
                    <span className={styles.agCoursesItemDate}>
                      {dept.eventCount}
                    </span>
                  </div>
                  <div className={styles.eventNamesList}>
                    <div className={styles.eventNamesTitle}>Event Names:</div>
                    <ul>
                      {dept.eventNames.map((eventName, idx) => (
                        <li key={idx} title={eventName}>• {eventName}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export type { Department };