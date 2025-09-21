import styles from './DepartmentGrid.module.css';

interface Department {
  id: string;
  name: string;
  eventCount: number;
}

const departments: Department[] = [
  {
    id: "aids",
    name: "AI & Data Science",
    eventCount: 3
  },
  {
    id: "mechanical", 
    name: "Mechanical Engineering",
    eventCount: 3
  },
  {
    id: "electrical",
    name: "Electrical Engineering", 
    eventCount: 3
  },
  {
    id: "civil",
    name: "Civil Engineering",
    eventCount: 3
  },
  {
    id: "cse",
    name: "Computer Science Engineering",
    eventCount: 3
  },
  {
    id: "aeronautical",
    name: "Aeronautical Engineering",
    eventCount: 3
  },
  {
    id: "iot",
    name: "IoT & Cyber Security",
    eventCount: 3
  },
  {
    id: "bba",
    name: "Business Administration",
    eventCount: 1
  },
  {
    id: "food",
    name: "Food Technology",
    eventCount: 2
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