import styles from './DepartmentGrid.module.css';
import { eventsByDepartment } from '../data/events';

export interface Department {
  id: string;
  name: string;
  eventCount: number;
  eventNames: string[];
}

const departmentNames: Record<string, string> = {
  aids: "AI & Data Science",
  mechanical: "Mechanical Engineering",
  electrical: "Electrical Engineering",
  civil: "Civil Engineering",
  cse: "Computer Science Engineering",
  aeronautical: "Aeronautical Engineering",
  iot: "IoT & Cyber Security",
  bba: "Business Administration",
  food: "Food Technology",
  robotics: "Robotics & AI",
  bca: "BCA"
};

const departments: Department[] = Object.entries(eventsByDepartment).map(([id, events]) => ({
  id,
  name: departmentNames[id] || id,
  eventCount: events.length,
  eventNames: events.map(event => event.name)
}));

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
            Explore events across {departments.length} departments and showcase your skills in your area of expertise
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
