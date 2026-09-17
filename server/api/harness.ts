import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;
const HOST = '127.0.0.1';

// Strict local binding for security
app.use(cors({
  origin: ['http://localhost:4444', 'http://127.0.0.1:4444', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'OPTIONS']
}));

app.use(express.json());

// Validation schemas
const LifeToBusinessSchema = z.object({
  availableBandwidthBlocks: z.number().min(0, "Bandwidth must be a positive number"),
});

// Mock/Empty states according to PRD
const EMPTY_BUSINESS_STATE = {
  cashflowMilestones: [],
  deadlines: [],
  status: 'disconnected'
};

// POST /api/bridge/life-to-business
app.post('/api/bridge/life-to-business', (req, res) => {
  try {
    const data = LifeToBusinessSchema.parse(req.body);

    // Create an event payload mimicking the CrossCategoryEvent structure
    const responseEvent = {
      schemaVersion: 1,
      eventId: uuidv4(),
      correlationId: req.headers['x-correlation-id'] || uuidv4(),
      causationId: req.headers['x-causation-id'] || uuidv4(),
      occurredAt: new Date().toISOString(),
      aggregateId: 'business-os-bridge',
      aggregateVersion: 1,
      type: 'LIFE_OS_BANDWIDTH_UPDATED',
      payload: {
        acknowledgedBandwidth: data.availableBandwidthBlocks,
        status: 'received'
      }
    };

    res.status(200).json(responseEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.format()
      });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// GET /api/bridge/business-to-life
app.get('/api/bridge/business-to-life', (req, res) => {
  // Always returning empty state if Business OS is not natively connected.
  // We don't hardcode or invent data.
  res.status(200).json(EMPTY_BUSINESS_STATE);
});

// Export the app for testing
export { app };

// Start server if run directly (ESM way to check if this is the main module)
import url from 'url';
if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, HOST, () => {
    console.log(`[Harness] API Bridge listening locally on http://${HOST}:${PORT}`);
  });
}
