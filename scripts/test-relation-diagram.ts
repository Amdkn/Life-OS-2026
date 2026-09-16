import React from 'react';
import { JSDOM } from 'jsdom';
import "fake-indexeddb/auto";

// Mock browser globals BEFORE importing components
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window as any;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true
});

// Mock window resize observer
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// We don't have react testing library here so we just test rendering to string
import { renderToString } from 'react-dom/server';

import SkillsView from '../src/apps/agent-portal/components/SkillsView';
import RelationDiagram from '../src/apps/agent-portal/components/RelationDiagram';

// Simple testing function
function testRender() {
  console.log("Starting test-relation-diagram runner...");

  try {
    const skillsHtml = renderToString(React.createElement(SkillsView));
    if (skillsHtml.length > 0) {
      console.log("✅ SkillsView rendered successfully without crashing");
    }

    const relationHtml = renderToString(React.createElement(RelationDiagram));
    if (relationHtml.length > 0) {
      console.log("✅ RelationDiagram rendered successfully without crashing");
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testRender();
process.exit(0);
