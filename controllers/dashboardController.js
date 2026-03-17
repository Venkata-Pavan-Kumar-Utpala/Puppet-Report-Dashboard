'use strict';
const { getReportsStore } = require('./reportsController');

const getSummary = (req, res) => {
  const reports = getReportsStore();
  const nodeMap = {};
  reports.forEach(r => {
    if (!nodeMap[r.host] || new Date(r.time) > new Date(nodeMap[r.host].time)) {
      nodeMap[r.host] = r;
    }
  });
  const nodes = Object.values(nodeMap);
  const today = new Date().toISOString().split('T')[0];
  const todayReports = reports.filter(r => r.time.startsWith(today) || r.received_at?.startsWith(today));

  res.status(200).json({
    success: true,
    data: {
      total_nodes:           nodes.length,
      nodes_changed:         nodes.filter(r => r.status === 'changed').length,
      nodes_unchanged:       nodes.filter(r => r.status === 'unchanged').length,
      nodes_failed:          nodes.filter(r => r.status === 'failed').length,
      nodes_unreported:      0,
      total_reports_today:   todayReports.length,
      failed_reports_today:  todayReports.filter(r => r.status === 'failed').length,
      environments:          [...new Set(reports.map(r => r.environment))],
      last_updated:          new Date().toISOString(),
    },
  });
};

const getTrends = (req, res) => {
  const reports = getReportsStore();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayReports = reports.filter(r => r.time.startsWith(dateStr) || r.received_at?.startsWith(dateStr));
    return {
      date:      dateStr,
      changed:   dayReports.filter(r => r.status === 'changed').length,
      unchanged: dayReports.filter(r => r.status === 'unchanged').length,
      failed:    dayReports.filter(r => r.status === 'failed').length,
    };
  });
  res.status(200).json({ success: true, data: days });
};

module.exports = { getSummary, getTrends };