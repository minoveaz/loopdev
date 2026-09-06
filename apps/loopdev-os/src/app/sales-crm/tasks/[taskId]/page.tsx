import { TaskRecordView } from '@/suites/sales-crm/crm';

export default async function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  return <TaskRecordView taskId={taskId} />;
}
