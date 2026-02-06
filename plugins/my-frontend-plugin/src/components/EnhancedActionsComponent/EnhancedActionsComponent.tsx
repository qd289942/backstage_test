import { useApi } from '@backstage/core-plugin-api';
import { githubActionsApiRef } from '@backstage-community/plugin-github-actions';
import { Table, TableColumn, Link, StatusOK, StatusRunning } from '@backstage/core-components';
import { useAsync } from 'react-use';
import { useEntity } from '@backstage/plugin-catalog-react';

// 1. 定义数据类型，解决 "Property does not exist" 报错
interface WorkflowRun {
  id: number;
  status: string;
  conclusion?: string;
  name: string;
  head_sha: string;
  created_at: string;
}

export const EnhancedActionsComponent = () => {
  const api = useApi(githubActionsApiRef);
  const { entity } = useEntity();
  
  const projectSlug = entity.metadata.annotations?.['github.com/project-slug'] || '';
  const [owner, repo] = projectSlug.split('/');

  const { value, loading } = useAsync(async () => {

    if (!owner || !repo) return [];

    const response = await api.listWorkflowRuns({
      hostname: 'github.com',
      owner,
      repo,
    });

    return (response.workflow_runs as unknown as WorkflowRun[]);
  }, [owner, repo, api]);


  const columns: TableColumn<WorkflowRun>[] = [
    { 
      title: 'Status', 
      render: row => row.status === 'completed' ? <StatusOK /> : <StatusRunning /> 
    },
    { title: 'Workflow', field: 'name' },
    {
      title: 'Commit ID',
      render: row => (
        <Link to={`https://github.com/${owner}/${repo}/commit/${row.head_sha}`}>
          <code>{row.head_sha.substring(0, 7)}</code>
        </Link>
      )
    },
    { title: 'Time', field: 'created_at' }
  ];


  if (!projectSlug) {
    return <div>github.com/project-slug annotation not found</div>;
  }

  return (
    <Table
      title="My Custom Ticket Actions"
      options={{ paging: true, pageSize: 5 }}
      columns={columns}
      data={value || []}
      isLoading={loading}
    />
  );
};