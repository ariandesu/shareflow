# AI Workflow Canvas — 12 Agent Automation UI Prompts

**Product summary:** Prompt collection for building visual automation editors, node-based LLM workflows, and trace/debug interfaces.
**Suggested price:** BDT 89 / USD 1.99 (adjust in store)
**Gumroad listing title:** AI Workflow Canvas — 12 Agent Automation UI Prompts

## Shared brief
Create [WORKFLOW PRODUCT] for [USER]. Main workflow: [INPUT] → [PROCESS] → [OUTPUT]. Existing stack and installed graph library: [DETAILS]. Inspect package manifests and current code before proposing dependencies. Treat graph layout, execution state, persistence, and credentials as separate concerns. Never execute a workflow or claim a node succeeded from client-only mock state. Make node controls keyboard-accessible and provide a non-canvas representation of critical workflow details.

## 1 — Workflow canvas shell
Build a responsive editor shell with a node canvas, compact toolbar, minimap only if the selected graph library supports it, and a side inspector. Include fit-to-view, zoom controls, undo/redo only if implemented, selection state, and a clear empty canvas invitation. On small screens, provide a deliberate canvas/inspector switch rather than shrinking controls beyond usability.

## 2 — Node palette and search
Create a searchable node palette grouped by [NODE CATEGORIES]. Each node type has a name, short purpose, input/output compatibility, and accessible description. Drag-and-drop must have a keyboard alternative to add a node. Do not expose node types unavailable to the runtime.

## 3 — LLM node configuration
Design an LLM node inspector for model, prompt template, structured inputs, and output schema based only on supported runtime fields. Keep credentials out of the node JSON and browser storage. Validate required fields and show limits. Mark model availability from the actual provider catalog rather than an invented hardcoded list.

## 4 — Typed connections
Implement graph edges with typed source/target ports. Validate compatibility before connection and explain invalid links accessibly. Preserve existing graph on failed edits. Avoid allowing a connection to imply data has already flowed; edges are configuration, not execution evidence.

## 5 — Conditional and branch node
Create a condition node with explicit expression inputs, true/false branches, validation feedback, and safe display of untrusted values. Do not evaluate arbitrary code in the browser. State that runtime evaluation happens only through the approved executor.

## 6 — Execution controls
Build Run, Stop, and Run-from-here controls using the supplied API contract. Show an explicit confirmation when execution may incur cost or trigger external side effects. Disable duplicate runs, display job ID/status from server responses, and treat client disconnect as unknown—not success. Include retry only when backend supports it.

## 7 — Live run timeline
Design an execution timeline for real server events: queued, running, waiting, succeeded, failed, cancelled. Show timestamps and safe summaries. Distinguish stale stream from current state and reconnect without duplicating events. Do not expose chain-of-thought or secrets; render only approved operational telemetry.

## 8 — Node output inspector
Create an inspector for structured node outputs with JSON tree/table views, copy controls, truncation indicator, and redaction for sensitive fields. Use supplied content type; escape rendered text. Keep large payload rendering bounded and make download opt-in.

## 9 — Workflow templates
Build a template gallery using a real list of supported templates. Cards show purpose, required connectors, and estimated setup steps only if known. Preview must not auto-run. On import, confirm replacement/merge and preserve the current draft if import fails.

## 10 — Secrets and connector setup
Design a connector setup experience that hands off secrets to the server-side secure credential store. Never place raw API keys in URLs, node properties, logs, or local storage. Show masked labels and connection status returned from backend. Include revoke/rotate only where supported.

## 11 — Versioning and publishing
Create draft/version/published states backed by the actual persistence API. Show changed nodes and confirm publish. Make rollback target explicit. A green UI state is not proof of deployment: wait for the backend result and expose failures. Protect concurrent edits with version IDs when the API supports it.

## 12 — Reliability and accessibility review
Review the editor for keyboard navigation, screen-reader descriptions, focus return, undo behavior, stale async results, graph size, resource cleanup, server error recovery, secret leakage, and side-effect confirmation. Return verified findings with code references and items that still need live tests. Do not claim execution, security, or performance guarantees without evidence.