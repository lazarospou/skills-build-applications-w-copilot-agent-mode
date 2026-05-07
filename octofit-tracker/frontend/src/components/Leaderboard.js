import ResourceTableView from './ResourceTableView';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

function Leaderboard() {
  return <ResourceTableView title="Leaderboard" endpoint={endpoint} />;
}

export default Leaderboard;
