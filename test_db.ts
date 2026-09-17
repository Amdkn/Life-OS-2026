import { db } from './server/blackboard/db.js';
console.log(db.prepare('SELECT * FROM workspaces').all());
