import ResourceTableView from './ResourceTableView';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

function Activities() {
  return <ResourceTableView title="Activities" endpoint={endpoint} />;
}

export default Activities;
