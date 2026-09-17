import 'fake-indexeddb/auto';
import { useIkigaiStore } from '../src/stores/fw-ikigai.store';

async function testIkigaiMatrix() {
  console.log('Testing Ikigai Store capabilities for H30...');
  const store = useIkigaiStore.getState();

  await store.addVision({
    id: 'test-h30-vision',
    type: 'vision',
    title: 'H30 Legacy Plan',
    content: 'Establishing multi-horizon generational assets',
    description: 'Generational assets',
    pillar: 'vocation',
    horizon: 'H30',
    alignmentLevel: 80,
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  const state = useIkigaiStore.getState();
  const vision = state.visions.find(v => v.id === 'test-h30-vision');

  if (vision && vision.horizon === 'H30') {
    console.log('✅ Ikigai Store successfully persisted an H30 vision');
    process.exit(0);
  } else {
    console.error('❌ Ikigai Store failed to persist the H30 vision');
    process.exit(1);
  }
}

testIkigaiMatrix();
