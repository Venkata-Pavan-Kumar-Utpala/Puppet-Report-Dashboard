/**
 * Integration Tests - Puppet Report Dashboard
 * CSE3253 DevOps | Venkata Pavan Kumar Utpala | 23FE10CSE00388
 */

'use strict';
const request = require('supertest');
const app     = require('../../src/main/server');

describe('Integration: Full Report Lifecycle', () => {
  let createdReportId;

  it('should submit a Puppet report and retrieve it by node', async () => {
    // Step 1: Submit report (simulating a Puppet agent posting to reporturl)
    const createRes = await request(app)
      .post('/api/reports')
      .send({
        host:           'integration-node.example.com',
        status:         'failed',
        time:           new Date().toISOString(),
        puppet_version: '7.24.0',
        environment:    'staging',
        resources: { total: 40, changed: 0, failed: 1, skipped: 0, out_of_sync: 1 },
        resource_statuses: [
          { resource: 'Service[myapp]', status: 'failed', changed: false, failed: true },
        ],
      });
    expect(createRes.statusCode).toBe(201);
    createdReportId = createRes.body.data.id;

    // Step 2: Retrieve by node name
    const nodeRes = await request(app).get('/api/reports/node/integration-node.example.com');
    expect(nodeRes.statusCode).toBe(200);
    const found = nodeRes.body.data.find(r => r.id === createdReportId);
    expect(found).toBeDefined();
    expect(found.status).toBe('failed');

    // Step 3: Retrieve by ID and check resource_statuses
    const detailRes = await request(app).get(`/api/reports/${createdReportId}`);
    expect(detailRes.statusCode).toBe(200);
    expect(detailRes.body.data.resource_statuses[0].resource).toBe('Service[myapp]');
  });
});

describe('Integration: Dashboard reflects submitted reports', () => {
  it('summary total_nodes should be positive after reports are stored', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.total_nodes).toBeGreaterThan(0);
  });
});
