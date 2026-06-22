// ========= Copyright 2025-2026 @ Eigent.ai All Rights Reserved. =========
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ========= Copyright 2025-2026 @ Eigent.ai All Rights Reserved. =========

type AgentFileLike = {
  path?: string;
  relativePath?: string;
  name?: string;
  source?: string;
};

const RUNTIME_ONLY_DIRS = new Set([
  'browser_agent',
  'camel_logs',
  'developer_agent',
  'document_agent',
  'multi_modal_agent',
  'terminal_logs',
]);
const RUNTIME_ONLY_EXTENSIONS = new Set(['.tmp', '.temp', '.pyc']);
const RUNTIME_ONLY_NAME_PATTERNS = [
  /\bpython(?:3)?(?:\.exe)?["']?\s+-c\b/i,
  /\bis not recognized as an internal or external command\b/i,
  /不是内部或外部命令/,
  /\uFFFD/,
];

function pathSegments(value: string | undefined): string[] {
  return (value || '').replace(/\\/g, '/').split('/').filter(Boolean);
}

function basename(value: string | undefined): string {
  const segments = pathSegments(value);
  return segments[segments.length - 1] || value || '';
}

function extension(value: string): string {
  const idx = value.lastIndexOf('.');
  return idx >= 0 ? value.slice(idx).toLowerCase() : '';
}

export function isRuntimeOnlyAgentFile(file: AgentFileLike): boolean {
  if (file.source === 'camel_log') return true;

  const segments = [
    ...pathSegments(file.relativePath),
    ...pathSegments(file.path),
    file.name || '',
  ];

  if (segments.some((segment) => RUNTIME_ONLY_DIRS.has(segment))) return true;

  const leaf = basename(file.name || file.relativePath || file.path).trim();
  if (!leaf) return false;
  if (leaf.startsWith('.')) return true;
  if (RUNTIME_ONLY_EXTENSIONS.has(extension(leaf))) return true;

  return RUNTIME_ONLY_NAME_PATTERNS.some((pattern) => pattern.test(leaf));
}

export function filterVisibleAgentFiles<T extends AgentFileLike>(
  files: T[]
): T[] {
  return files.filter((file) => !isRuntimeOnlyAgentFile(file));
}
