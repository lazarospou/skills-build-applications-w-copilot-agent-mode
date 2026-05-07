import ResourceTableView from './ResourceTableView';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

function Teams() {
  return <ResourceTableView title="Teams" endpoint={endpoint} />;
}

export default Teams;
