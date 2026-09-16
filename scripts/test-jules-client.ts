import { JulesApiClient } from '../src/services/jules/jules-api-client';
import { app } from '../server/jules-client/index';
import * as http from 'http';

// Setup proxy server for tests
const PORT = 3002;
const server = http.createServer(app);

async function runTests() {
    console.log('Starting Jules Proxy Server for tests...');

    await new Promise<void>((resolve) => {
        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
            resolve();
        });
    });

    try {
        console.log('\n--- Running JulesApiClient Tests ---');

        console.log('1. Testing listSessions...');
        const listResult = await JulesApiClient.listSessions();
        console.log('listResult:', listResult);
        if (listResult.quota?.remaining !== null) {
            throw new Error('Expected simulated unknown quota to be null');
        }

        console.log('\n2. Testing createSession...');
        const createResult = await JulesApiClient.createSession({
            autoCreatePr: true,
            requirePlanApproval: false,
            prompt: 'Test prompt'
        });
        console.log('createResult:', createResult);
        if (createResult.id !== 'simulated-session-id') {
             throw new Error('Expected simulated session id');
        }

        console.log('\n3. Testing approvePlan...');
        const approveResult = await JulesApiClient.approvePlan('simulated-session-id');
        console.log('approveResult:', approveResult);
        if (approveResult.status !== 'approved') {
            throw new Error('Expected status to be approved');
        }

        console.log('\n4. Testing sendMessage...');
        const msgResult = await JulesApiClient.sendMessage('simulated-session-id', 'Test message');
        console.log('msgResult:', msgResult);
        if (msgResult.status !== 'sent') {
             throw new Error('Expected status to be sent');
        }

        console.log('\nAll tests passed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\nTest failed:', error);
        process.exit(1);
    } finally {
        server.close();
    }
}

runTests();
