import { notFound } from "next/navigation";
import StudentChecklistEditor from "../StudentChecklistEditor";
import { getStudentDetailBySlug } from "../mock-data";
import "../checklist.css";

type ChecklistStudentPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ChecklistStudentPage({ params }: ChecklistStudentPageProps) {
  const { slug } = await params;
  const detail = getStudentDetailBySlug(slug);

  if (!detail) {
    notFound();
  }

  return (
    <main className="dashboard-main checklist-page student-detail-page">
      <h1 className="dashboard-heading">Checklist</h1>

      <StudentChecklistEditor detail={detail} />
    </main>
  );
}