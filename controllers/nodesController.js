'use strict';

/**
 * Nodes Controller
 * Aggregates per-node Puppet run summaries from stored reports.
 */

// We import from the reports store (in production this hits the DB)
const { getAllReports } = require('./reportsController');

const getAllNodes = (req, res) => {
  try {
    // Build a map of nodeName → latest report
    const nodeMap = {};

    // Grab all reports via internal mock store
    const allReports = _getReports();

    allReports.forEach(report => {
      const existing = nodeMap[report.host];
      if (!existing || new Date(report.time) > new Date(existing.last_run)) {
        nodeMap[report.host] = {
          node:            report.host,
          environment:     report.environment,
          last_run:        report.time,
          last_status:     report.status,
          puppet_version:  report.puppet_version,
          total_runs:      (existing ? existing.total_runs : 0) + 1,
          failed_runs:     (existing ? existing.failed_runs : 0) + (report.status === 'failed' ? 1 : 0),
          resources:       report.resources,
        };
      } else {
        nodeMap[report.host].total_runs  += 1;
        nodeMap[report.host].failed_runs += (report.status === 'failed' ? 1 : 0);
      }
    });

    const nodes = Object.values(nodeMap);
    res.status(200).json({ success: true, data: nodes, total: nodes.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getNodeDetail = (req, res) => {
  const { nodename } = req.params;
  const nodeReports  = _getReports().filter(r => r.host === nodename);

  if (nodeReports.length === 0) {
    return res.status(404).json({ success: false, error: `Node "${nodename}" not found` });
  }

  const latest = nodeReports.sort((a, b) => new Date(b.time) - new Date(a.time))[0];
  res.status(200).json({
    success: true,
    data: {
      node:           nodename,
      environment:    latest.environment,
      puppet_version: latest.puppet_version,
      last_run:       latest.time,
      last_status:    latest.status,
      total_runs:     nodeReports.length,
      failed_runs:    nodeReports.filter(r => r.status === 'failed').length,
      latest_report:  latest,
    },
  });
};

const getNodeHistory = (req, res) => {
  const { nodename } = req.params;
  const { limit = 20 } = req.query;
  const history = _getReports()
    .filter(r => r.host === nodename)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, Number(limit))
    .map(r => ({
      id:        r.id,
      time:      r.time,
      status:    r.status,
      resources: r.resources,
      environment: r.environment,
    }));

  res.status(200).json({ success: true, data: history, total: history.length });
};

// Internal helper — in production, replace with DB query
function _getReports() {
  return require('./reportsController').getReportsStore();
}

module.exports = { getAllNodes, getNodeDetail, getNodeHistory };
