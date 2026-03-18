# Technical Design Document - Puppet Report Dashboard

**Student:** Venkata Pavan Kumar Utpala | **Reg No:** 23FE10CSE00388

---

## Architecture Overview

```
 Puppet Agents (nodes)
        │  POST /api/reports  (via puppet.conf reporturl)
        ▼
 ┌─────────────────────────────────┐
 │  Express.js API Server          │
 │  ┌──────────┐  ┌─────────────┐ │
 │  │ Reports  │  │ Dashboard   │ │
 │  │ Router   │  │ Router      │ │
 │  └────┬─────┘  └──────┬──────┘ │
 │       │               │        │
 │  ┌────▼───────────────▼──────┐ │
 │  │       Controllers         │ │
 │  └────────────┬──────────────┘ │
 └───────────────┼────────────────┘
                 │
        ┌────────▼────────┐
        │   PostgreSQL DB  │
        └─────────────────┘
                 │
        ┌────────▼────────┐
        │  Browser (UI)   │  ← reads /api/dashboard/*, /api/nodes, /api/reports
        └─────────────────┘
```

---

## Component Design

### Report Receiver (`POST /api/reports`)
- Accepts Puppet run reports in JSON or YAML format
- Validates required fields: `host`, `status`
- Parses `resource_statuses` for per-resource breakdown
- Stores in PostgreSQL (or in-memory for development)
- Triggers alert if `status === 'failed'`

### Nodes API (`GET /api/nodes`)
- Aggregates all stored reports and returns one summary row per node
- Includes: `last_run`, `last_status`, `total_runs`, `failed_runs`, `resources`

### Dashboard API
- `GET /api/dashboard/summary` — counts of changed/unchanged/failed nodes
- `GET /api/dashboard/trends` — last 7 days of run results (for the bar chart)

### Frontend (Single-page `index.html`)
- No build step — served as static files by Express
- Polls all API endpoints every 30 seconds
- Stacked bar chart (trends) + doughnut (status breakdown) using Chart.js
- Clicking any report row opens a drill-down modal showing resource-level details

---

## Database Schema

```sql
CREATE TABLE reports (
  id                    SERIAL PRIMARY KEY,
  host                  VARCHAR(255) NOT NULL,
  status                VARCHAR(20)  NOT NULL,  -- changed | unchanged | failed
  run_time              TIMESTAMPTZ  NOT NULL,
  puppet_version        VARCHAR(50),
  environment           VARCHAR(100),
  configuration_version VARCHAR(100),
  resources_total       INT DEFAULT 0,
  resources_changed     INT DEFAULT 0,
  resources_failed      INT DEFAULT 0,
  resources_skipped     INT DEFAULT 0,
  resource_statuses     JSONB,
  received_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_host   ON reports(host);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_time   ON reports(run_time DESC);
```

---

## Security Design
- Helmet.js for HTTP security headers
- Input validation on `POST /api/reports` (required fields + enum check on status)
- Non-root Docker user
- Environment variables for all secrets
- CORS restricted to known origins in production
