import ResourceTableView from './ResourceTableView';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

function Users() {
  return <ResourceTableView title="Users" endpoint={endpoint} />;
}

export default Users;
