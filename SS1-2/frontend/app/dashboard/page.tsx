import "./dashboard.css";
import DashboardImportControl from "./DashboardImportControl";

type StatCard = {
  value: number;
  label: string;
  iconClass: string;
  tone: "blue" | "red" | "yellow" | "green";
};

type DepartmentRow = {
  department: string;
  programs: number;
  students: number;
  approved: number;
};

const statCards: StatCard[] = [
  { value: 454, label: "Total Enrolled", iconClass: "fa-solid fa-user-graduate", tone: "blue" },
  { value: 159, label: "Incomplete", iconClass: "fa-solid fa-circle-xmark", tone: "red" },
  { value: 228, label: "Pending", iconClass: "fa-solid fa-hourglass-half", tone: "yellow" },
  { value: 67, label: "Approved", iconClass: "fa-solid fa-circle-check", tone: "green" },
];

const departmentRows: DepartmentRow[] = [
  {
    department: "College of Computer Studies",
    programs: 3,
    students: 1270,
    approved: 750,
  },
  {
    department: "College of Allied Health Studies",
    programs: 2,
    students: 1016,
    approved: 360,
  },
  {
    department: "College of Business and Accountancy",
    programs: 5,
    students: 2354,
    approved: 950,
  },
  {
    department: "College of Education, Arts, and Sciences",
    programs: 11,
    students: 6769,
    approved: 3564,
  },
  {
    department: "College of Hospitality and Tourism Management",
    programs: 4,
    students: 1435,
    approved: 685,
  },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-main dashboard-page">
      <section className="dashboard-top-row" aria-label="Dashboard controls">
        <h1 className="dashboard-heading">Dashboard</h1>
        <DashboardImportControl />
      </section>

      <section className="stats-grid" aria-label="Enrollment Summary">
        {statCards.map((card) => (
          <article key={card.label} className="stat-card">
            <div className={`stat-icon ${card.tone}`}>
              <i className={card.iconClass} aria-hidden />
            </div>
            <p className="stat-value">{card.value}</p>
            <p className="stat-label">{card.label}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-mark" aria-hidden>
            <i className="fa-solid fa-table-list" />
          </span>
          <h2>Department Overview</h2>
        </div>

        <div className="table-scroll" role="region" aria-label="Department Overview Table">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Programs</th>
                <th>Students</th>
                <th>Approved</th>
              </tr>
            </thead>
            <tbody>
              {departmentRows.map((row) => (
                <tr key={row.department}>
                  <td>{row.department}</td>
                  <td>{row.programs}</td>
                  <td>{row.students}</td>
                  <td>{row.approved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
