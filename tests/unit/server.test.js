/**
 * Unit Tests - Puppet Report Dashboard
 * CSE3253 DevOps | Venkata Pavan Kumar Utpala | 23FE10CSE00388
 */

'use strict';
const request = require('supertest');
const app     = require('../../src/main/server');

describe('Health Check', () => {
  it('GET /api/health should return 200 and status UP', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('puppet-report-dashboard');
  });
});

describe('Reports API', () => {
  it('GET /api/reports should return all reports', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/reports should accept a valid Puppet run report', async () => {
    const report = {
      host:           'test-node.example.com',
      status:         'changed',
      time:           new Date().toISOString(),
      puppet_version: '7.24.0',
      environment:    'production',
      resources: { total: 50, changed: 2, failed: 0, skipped: 0, out_of_sync: 2 },
      resource_statuses: [
        { resource: 'File[/etc/app.conf]', status: 'changed', changed: true, failed: false },
      ],
    };
    const res = await request(app).post('/api/reports').send(report);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.host).toBe('test-node.example.com');
    expect(res.body.data.status).toBe('changed');
  });

  it('POST /api/reports should return 400 when host is missing', async () => {
    const res = await request(app).post('/api/reports').send({ status: 'changed' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/reports should return 400 for invalid status value', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({ host: 'node.example.com', status: 'broken' });
    expect(res.statusCode).toBe(400);
  });

  it('GET /api/reports/:id should return a specific report', async () => {
    const res = await request(app).get('/api/reports/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it('GET /api/reports/:id should return 404 for unknown id', async () => {
    const res = await request(app).get('/api/reports/99999');
    expect(res.statusCode).toBe(404);
  });
});

describe('Nodes API', () => {
  it('GET /api/nodes should return node list', async () => {
    const res = await request(app).get('/api/nodes');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Dashboard API', () => {
  it('GET /api/dashboard/summary should return summary stats', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('total_nodes');
    expect(res.body.data).toHaveProperty('nodes_failed');
    expect(res.body.data).toHaveProperty('nodes_changed');
  });

  it('GET /api/dashboard/trends should return 7 day trend data', async () => {
    const res = await request(app).get('/api/dashboard/trends');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(7);
    expect(res.body.data[0]).toHaveProperty('date');
    expect(res.body.data[0]).toHaveProperty('changed');
    expect(res.body.data[0]).toHaveProperty('failed');
  });
});

describe('404 Handler', () => {
  it('Unknown route should return 404', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.statusCode).toBe(404);
  });
});
