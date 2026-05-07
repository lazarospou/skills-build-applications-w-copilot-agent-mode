import { useEffect, useMemo, useState } from 'react';

function getDisplayColumns(rows) {
  const preferredOrder = [
    'id',
    'name',
    'title',
    'username',
    'email',
    'team',
    'activity',
    'workout',
    'score',
    'date',
    'created_at'
  ];

  const discovered = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row || {})))
  );

  const ordered = [
    ...preferredOrder.filter((key) => discovered.includes(key)),
    ...discovered.filter((key) => !preferredOrder.includes(key))
  ];

  return ordered.slice(0, 5);
}

function formatCell(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function ResourceTableView({ title, endpoint }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchRows = async () => {
    setLoading(true);
    setError('');

    try {
      console.log(`${title} endpoint:`, endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${title.toLowerCase()}: ${response.status}`);
      }

      const payload = await response.json();
      console.log(`${title} fetched data:`, payload);

      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

      setRows(normalized);
    } catch (err) {
      setError(err.message || `Unknown error while fetching ${title.toLowerCase()}.`);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [endpoint]);

  const columns = useMemo(() => getDisplayColumns(rows), [rows]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((row) => {
      const values = selectedField === 'all'
        ? columns.map((column) => row?.[column])
        : [row?.[selectedField]];

      return values.some((value) =>
        formatCell(value).toLowerCase().includes(normalizedQuery)
      );
    });
  }, [rows, columns, query, selectedField]);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <h2 className="h3 mb-1 text-primary-emphasis">{title}</h2>
            <p className="mb-0 text-muted">
              Endpoint:{' '}
              <a className="link-primary link-offset-2" href={endpoint} target="_blank" rel="noreferrer">
                {endpoint}
              </a>
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={fetchRows}>
            Refresh {title}
          </button>
        </div>

        <form className="row g-3 align-items-end mb-4" onSubmit={(event) => event.preventDefault()}>
          <div className="col-12 col-lg-6">
            <label htmlFor={`${title}-query`} className="form-label fw-semibold">Search Data</label>
            <input
              id={`${title}-query`}
              type="text"
              className="form-control"
              placeholder="Search within table values"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-12 col-lg-4">
            <label htmlFor={`${title}-field`} className="form-label fw-semibold">Filter Field</label>
            <select
              id={`${title}-field`}
              className="form-select"
              value={selectedField}
              onChange={(event) => setSelectedField(event.target.value)}
            >
              <option value="all">All columns</option>
              {columns.map((column) => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-lg-2">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setQuery('')}>
              Clear
            </button>
          </div>
        </form>

        {loading && <p className="mb-0">Loading {title.toLowerCase()}...</p>}
        {!loading && error && <div className="alert alert-danger mb-0">{error}</div>}
        {!loading && !error && filteredRows.length === 0 && (
          <div className="alert alert-light border mb-0">No {title.toLowerCase()} found.</div>
        )}

        {!loading && !error && filteredRows.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0 resource-table">
              <thead className="table-dark">
                <tr>
                  {columns.map((column) => (
                    <th key={column} scope="col">{column}</th>
                  ))}
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr key={row.id || row._id || index}>
                    {columns.map((column) => (
                      <td key={`${row.id || index}-${column}`}>{formatCell(row?.[column])}</td>
                    ))}
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedRow(row)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRow && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">{title} Details</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedRow(null)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedRow, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedRow(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedRow(null)} />
        </>
      )}
    </section>
  );
}

export default ResourceTableView;