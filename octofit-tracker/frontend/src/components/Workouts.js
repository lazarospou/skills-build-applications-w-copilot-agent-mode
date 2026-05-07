import ResourceTableView from './ResourceTableView';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

function Workouts() {
  return <ResourceTableView title="Workouts" endpoint={endpoint} />;
}

export default Workouts;
