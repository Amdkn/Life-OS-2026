import 'fake-indexeddb/auto';
import { useParaStore } from '../src/stores/fw-para.store';

async function testExportToRdf() {
  console.log('Initializing store for testing...');
  const store = useParaStore.getState();

  // Test that exportToRdf is present and functions without crashing
  const result = store.exportToRdf();

  if (!result.turtle || !result.jsonld) {
    console.error('Export failed to produce turtle and jsonld');
    process.exit(1);
  }

  // Verify Turtle string content
  const requiredTurtleTerms = ['aspace:Project', 'aspace:Area', 'aspace:covers', 'aspace:partOf'];
  let missingTerms = false;
  for (const term of requiredTurtleTerms) {
    if (!result.turtle.includes(term)) {
       console.error(`Turtle output is missing required term: ${term}`);
       missingTerms = true;
    }
  }

  if (missingTerms) {
      console.log('Turtle snippet for review:\n', result.turtle.substring(0, 500));
      process.exit(1);
  }

  // Basic validation of JSON-LD
  let jsonParsed;
  try {
     jsonParsed = JSON.parse(result.jsonld);
  } catch(e) {
     console.error('Failed to parse jsonld output:', e);
     process.exit(1);
  }

  if (!jsonParsed['@graph'] || !Array.isArray(jsonParsed['@graph'])) {
      console.error('JSON-LD output is missing @graph array');
      process.exit(1);
  }

  console.log('✅ test-para-rdf.ts: RDF generated correctly and passes basic checks.');
}

testExportToRdf().catch(e => {
  console.error(e);
  process.exit(1);
});
