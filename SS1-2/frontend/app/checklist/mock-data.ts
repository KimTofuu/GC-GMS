export type ChecklistStatus = "incomplete" | "pending" | "approved";

export type Student = {
  id: string;
  slug: string;
  name: string;
  email: string;
  program: string;
  completedRequirements: number;
  totalRequirements: number;
  status: ChecklistStatus;
};

export type Requirement = {
  label: string;
  complete: boolean;
};

export type StudentDetail = {
  student: Student;
  requirements: Requirement[];
  achievements: string[];
};

export const collegeProgramMap: Record<string, string[]> = {
  "College of Allied Health Studies (CAHS)": [
    "Bachelor of Science in Nursing",
    "Bachelor of Science in Midwifery",
  ],
  "College of Business and Accountancy (CBA)": [
    "Bachelor of Science in Accountancy",
    "Bachelor of Science in Business Administration Major in Financial Management",
    "Bachelor of Science in Business Administration Major in Human Resource Management",
    "Bachelor of Science in Business Administration Major in Marketing Management",
    "Bachelor of Science in Customs Administration",
  ],
  "College of Computer Studies (CCS)": [
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Entertainment and Multimedia Computing",
    "Bachelor of Science in Information Technology",
  ],
  "College of Education, Arts, and Sciences (CEAS)": [
    "Bachelor of Arts in Communication",
    "Bachelor of Early Childhood Education",
    "Bachelor of Culture and Arts Education",
    "Bachelor of Physical Education",
    "Bachelor of Elementary Education (General Education)",
    "Bachelor of Secondary Education major in English",
    "Bachelor of Secondary Education major in Filipino",
    "Bachelor of Secondary Education major in Mathematics",
    "Bachelor of Secondary Education major in Social Studies",
    "Bachelor of Secondary Education major in Science",
    "Teacher Certificate Program (TCP)",
  ],
  "College of Hospitality and Tourism Management (CHTM)": [
    "Bachelor of Science in Hospitality Management",
    "Bachelor of Science in Tourism Management",
  ],
};

export const collegeOptions = Object.keys(collegeProgramMap);
export const programOptions = Object.values(collegeProgramMap).flat();

export const programAbbreviationMap: Record<string, string> = {
  "Bachelor of Science in Nursing": "BSN",
  "Bachelor of Science in Midwifery": "BSM",
  "Bachelor of Science in Accountancy": "BSA",
  "Bachelor of Science in Business Administration Major in Financial Management": "BSBA-FM",
  "Bachelor of Science in Business Administration Major in Human Resource Management": "BSBA-HRM",
  "Bachelor of Science in Business Administration Major in Marketing Management": "BSBA-MM",
  "Bachelor of Science in Customs Administration": "BSCA",
  "Bachelor of Science in Computer Science": "BSCS",
  "Bachelor of Science in Entertainment and Multimedia Computing": "BSEMC",
  "Bachelor of Science in Information Technology": "BSIT",
  "Bachelor of Arts in Communication": "BA Comm",
  "Bachelor of Early Childhood Education": "BECED",
  "Bachelor of Culture and Arts Education": "BCAED",
  "Bachelor of Physical Education": "BPEd",
  "Bachelor of Elementary Education (General Education)": "BEEd-GE",
  "Bachelor of Secondary Education major in English": "BSEd-English",
  "Bachelor of Secondary Education major in Filipino": "BSEd-Filipino",
  "Bachelor of Secondary Education major in Mathematics": "BSEd-Math",
  "Bachelor of Secondary Education major in Social Studies": "BSEd-SocStud",
  "Bachelor of Secondary Education major in Science": "BSEd-Science",
  "Teacher Certificate Program (TCP)": "TCP",
  "Bachelor of Science in Hospitality Management": "BSHM",
  "Bachelor of Science in Tourism Management": "BSTM",
};

export function getProgramAbbreviation(programName: string): string {
  return programAbbreviationMap[programName] ?? programName;
}

export const students: Student[] = [
  {
    id: "202312263",
    slug: "francis-emil-rosete",
    name: "Francis Emil Rosete",
    email: "202312263@gordoncollege.edu.ph",
    program: "BS Information Technology",
    completedRequirements: 6,
    totalRequirements: 10,
    status: "incomplete",
  },
  {
    id: "202312264",
    slug: "ridley-angeles",
    name: "Ridley Angeles",
    email: "202312263@gordoncollege.edu.ph",
    program: "BS Information Technology",
    completedRequirements: 1,
    totalRequirements: 10,
    status: "incomplete",
  },
  {
    id: "202312265",
    slug: "varnard-paulo-udani",
    name: "Varnard Paulo Udani",
    email: "202312263@gordoncollege.edu.ph",
    program: "BS Information Technology",
    completedRequirements: 10,
    totalRequirements: 10,
    status: "pending",
  },
  {
    id: "202312266",
    slug: "janico-gyle-sorio",
    name: "Janico Gyle Sorio",
    email: "202312263@gordoncollege.edu.ph",
    program: "BS Information Technology",
    completedRequirements: 4,
    totalRequirements: 10,
    status: "incomplete",
  },
  {
    id: "202312267",
    slug: "richard-del-carmen-jr",
    name: "Richard Del Carmen Jr.",
    email: "202312263@gordoncollege.edu.ph",
    program: "BS Information Technology",
    completedRequirements: 10,
    totalRequirements: 10,
    status: "pending",
  },
];

export const studentDetails: StudentDetail[] = [
  {
    student: students[0],
    requirements: [
      { label: "Official Transcript of Record", complete: false },
      { label: "Thesis / Capstone Submission", complete: true },
      { label: "Curriculum Evaluation Sheet", complete: true },
      { label: "Graduation Photo", complete: true },
      { label: "Graduation Fee Payment Receipt", complete: true },
      { label: "Library Clearance", complete: true },
      { label: "Exit Interview Form", complete: false },
      { label: "Guidance Clearance", complete: false },
      { label: "Student Account Clearance", complete: true },
      { label: "OJT Completion Certificate", complete: false },
    ],
    achievements: ["Summa Cum Laude", "Dean's Lister", "Medalya ng Kahusayan"],
  },
  {
    student: students[1],
    requirements: students[1]
      ? [
          { label: "Official Transcript of Record", complete: true },
          { label: "Thesis / Capstone Submission", complete: false },
          { label: "Curriculum Evaluation Sheet", complete: false },
          { label: "Graduation Photo", complete: false },
          { label: "Graduation Fee Payment Receipt", complete: false },
          { label: "Library Clearance", complete: false },
          { label: "Exit Interview Form", complete: false },
          { label: "Guidance Clearance", complete: false },
          { label: "Student Account Clearance", complete: false },
          { label: "OJT Completion Certificate", complete: false },
        ]
      : [],
    achievements: [],
  },
  {
    student: students[2],
    requirements: students[2]
      ? [
          { label: "Official Transcript of Record", complete: true },
          { label: "Thesis / Capstone Submission", complete: true },
          { label: "Curriculum Evaluation Sheet", complete: true },
          { label: "Graduation Photo", complete: true },
          { label: "Graduation Fee Payment Receipt", complete: true },
          { label: "Library Clearance", complete: true },
          { label: "Exit Interview Form", complete: true },
          { label: "Guidance Clearance", complete: true },
          { label: "Student Account Clearance", complete: true },
          { label: "OJT Completion Certificate", complete: true },
        ]
      : [],
    achievements: ["Dean's Lister"],
  },
  {
    student: students[3],
    requirements: students[3]
      ? [
          { label: "Official Transcript of Record", complete: true },
          { label: "Thesis / Capstone Submission", complete: true },
          { label: "Curriculum Evaluation Sheet", complete: true },
          { label: "Graduation Photo", complete: false },
          { label: "Graduation Fee Payment Receipt", complete: false },
          { label: "Library Clearance", complete: false },
          { label: "Exit Interview Form", complete: false },
          { label: "Guidance Clearance", complete: false },
          { label: "Student Account Clearance", complete: false },
          { label: "OJT Completion Certificate", complete: false },
        ]
      : [],
    achievements: [],
  },
  {
    student: students[4],
    requirements: students[4]
      ? [
          { label: "Official Transcript of Record", complete: true },
          { label: "Thesis / Capstone Submission", complete: true },
          { label: "Curriculum Evaluation Sheet", complete: true },
          { label: "Graduation Photo", complete: true },
          { label: "Graduation Fee Payment Receipt", complete: true },
          { label: "Library Clearance", complete: true },
          { label: "Exit Interview Form", complete: true },
          { label: "Guidance Clearance", complete: true },
          { label: "Student Account Clearance", complete: true },
          { label: "OJT Completion Certificate", complete: true },
        ]
      : [],
    achievements: ["Medalya ng Kahusayan"],
  },
];

export function getStudentDetailBySlug(slug: string): StudentDetail | undefined {
  return studentDetails.find((detail) => detail.student.slug === slug);
}

export function getAllStudentDetails(): StudentDetail[] {
  return studentDetails;
}