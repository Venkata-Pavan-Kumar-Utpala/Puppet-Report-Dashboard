# API Documentation - Puppet Report Dashboard

**Base URL:** `http://localhost:8080/api`

---

## Health

### `GET /health`
```json
{ "status": "UP", "timestamp": "...", "service": "puppet-report-dashboard", "version": "1.0.0" }
```

---

## Reports

### `POST /reports` ← Puppet agents POST here via `reporturl`
**Request body (JSON):**
```json
{
  "host": "web-node-01.example.com",
  "status": "changed",
  "time": "2025-10-01T10:00:00Z",
  "puppet_version": "7.24.0",
  "environment": "production",
  "configuration_version": "1696000001",
  "resources": { "total": 120, "changed": 3, "failed": 0, "skipped": 1, "out_of_sync": 3 },
  "resource_statuses": [
    { "resource": "File[/etc/nginx/nginx.conf]", "status": "changed", "changed": true, "failed": false }
  ]
}
```
**Response:** `201 Created` with the stored report object.

**Validation errors (400):**
- `host` or `status` missing
- `status` not one of `changed`, `unchanged`, `failed`

---

### `GET /reports?status=failed&env=production&limit=50`
Returns all reports. Optional query filters: `status`, `env`, `limit`.

### `GET /reports/:id`
Returns a single report by ID. Returns `404` if not found.

### `GET /reports/node/:nodename`
Returns all reports for a specific node, newest first.

### `DELETE /reports/:id`
Deletes a report. Returns `404` if not found.

---

## Nodes

### `GET /nodes`
Returns one summary object per unique node:
```json
{
  "node": "web-node-01.example.com",
  "environment": "production",
  "last_run": "2025-10-01T10:00:00Z",
  "last_status": "changed",
  "puppet_version": "7.24.0",
  "total_runs": 42,
  "failed_runs": 1,
  "resources": { "total": 120, "changed": 3, "failed": 0, "skipped": 1 }
}
```

### `GET /nodes/:nodename`
Returns detailed information for a single node including its latest report.

### `GET /nodes/:nodename/history?limit=20`
Returns the last N run results for a node (id, time, status, resources).

---

## Dashboard

### `GET /dashboard/summary`
```json
{
  "total_nodes": 10,
  "nodes_changed": 3,
  "nodes_unchanged": 6,
  "nodes_failed": 1,
  "nodes_unreported": 0,
  "total_reports_today": 48,
  "failed_reports_today": 2,
  "environments": ["production", "staging"],
  "last_updated": "..."
}
```

### `GET /dashboard/trends`
Returns last 7 days of run result counts (used for the bar chart):
```json
[
  { "date": "2025-09-25", "changed": 3, "unchanged": 6, "failed": 1 },
  ...
]
```

---

## Error Format
```json
{ "error": { "message": "Description of error", "status": 400 } }
```
