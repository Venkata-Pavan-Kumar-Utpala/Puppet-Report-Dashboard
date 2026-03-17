'use strict';

/**
 * Reports Controller
 * Handles ingestion and retrieval of Puppet run reports.
 *
 * A Puppet run report contains:
 *  - host          : the node that ran Puppet
 *  - status        : "changed" | "unchanged" | "failed"
 *  - time          : timestamp of the run
 *  - resource_statuses : map of each resource and whether it changed/failed/skipped
 */

// In-memory store (replace with PostgreSQL in production)
let reports = [
  {
    id: 1,
    host: 'web-node-01.example.com',
    status: 'changed',
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    puppet_version: '7.24.0',
    environment: 'production',
    configuration_version: '1696000001',
    resources: {
      total: 120, changed: 3, failed: 0, skipped: 1, out_of_sync: 3,
    },
    resource_statuses: [
      { resource: 'File[/etc/nginx/nginx.conf]', status: 'changed',   changed: true,  failed: false },
      { resource: 'Service[nginx]',              status: 'changed',   changed: true,  failed: false },
      { resource: 'Package[nodejs]',             status: 'unchanged', changed: false, failed: false },
      { resource: 'User[deploy]',                status: 'skipped',   changed: false, failed: false },
    ],
  },
  {
    id: 2,
    host: 'db-node-01.example.com',
    status: 'failed',
    time: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    puppet_version: '7.24.0',
    environment: 'production',
    configuration_version: '1696000001',
    resources: {
      total: 85, changed: 0, failed: 2, skipped: 0, out_of_sync: 2,
    },
    resource_statuses: [
      { resource: 'Package[postgresql]', status: 'failed',    changed: false, failed: true  },
      { resource: 'Service[postgresql]', status: 'failed',    changed: false, failed: true  },
      { resource: 'File[/etc/hosts]',    status: 'unchanged', changed: false, failed: false },
    ],
  },
  {
    id: 3,
    host: 'app-node-02.example.com',
    status: 'unchanged',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    puppet_version: '7.24.0',
    environment: 'staging',
    configuration_version: '1696000000',
    resources: {
      total: 98, changed: 0, failed: 0, skipped: 0, out_of_sync: 0,
    },
    resource_statuses: [],
  },
];

let nextId = 4;

// POST /api/reports  — called by Puppet agents via reporturl
const receiveReport = (req, res) => {
  try {
    let body = req.body;

    // Accept both JSON and YAML (YAML would be pre-parsed by middleware)
    if (typeof body === 'string') {
      try {
        const yaml = require('js-yaml');
        body = yaml.load(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Could not parse report body as YAML or JSON' });
      }
    }

    // Validate required fields
    if (!body.host || !body.status) {
      return res.status(400).json({ success: false, error: '"host" and "status" are required fields in the report' });
    }

    const validStatuses = ['changed', 'unchanged', 'failed'];
    if (!validStatuses.includes(body.status)) {
      return res.status(400).json({ success: false, error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const report = {
      id:                    nextId++,
      host:                  body.host,
      status:                body.status,
      time:                  body.time || new Date().toISOString(),
      puppet_version:        body.puppet_version || 'unknown',
      environment:           body.environment || 'production',
      configuration_version: body.configuration_version || '',
      resources:             body.resources || { total: 0, changed: 0, failed: 0, skipped: 0, out_of_sync: 0 },
      resource_statuses:     body.resource_statuses || [],
      received_at:           new Date().toISOString(),
    };

    reports.push(report);
    console.log(`[INFO] Report received from ${report.host} — status: ${report.status}`);
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllReports = (req, res) => {
  const { status, env, limit = 50 } = req.query;
  let filtered = [...reports];
  if (status) filtered = filtered.filter(r => r.status === status);
  if (env)    filtered = filtered.filter(r => r.environment === env);
  filtered = filtered.slice(-Number(limit)).reverse();
  res.status(200).json({ success: true, data: filtered, total: filtered.length });
};

const getReportById = (req, res) => {
  const report = reports.find(r => r.id === parseInt(req.params.id));
  if (!report) return res.status(404).json({ success: false, error: `Report ${req.params.id} not found` });
  res.status(200).json({ success: true, data: report });
};

const getReportsByNode = (req, res) => {
  const nodeReports = reports
    .filter(r => r.host === req.params.node)
    .reverse();
  res.status(200).json({ success: true, data: nodeReports, total: nodeReports.length });
};

const deleteReport = (req, res) => {
  const idx = reports.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, error: `Report ${req.params.id} not found` });
  reports.splice(idx, 1);
  res.status(200).json({ success: true, message: `Report ${req.params.id} deleted` });
};

const getReportsStore = () => reports;

module.exports = { receiveReport, getAllReports, getReportById, getReportsByNode, deleteReport, getReportsStore };
