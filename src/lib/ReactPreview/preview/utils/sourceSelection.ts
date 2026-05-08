import type { SourceInfo } from '../types';
import type { ElementClickData } from './MessageHandler';

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max));

const getSelectedSourceText = (
  lines: string[],
  startLine: number,
  endLine: number,
  startColumn: number,
  endColumn: number
): string => {
  if (startLine === endLine) {
    const line = lines[startLine - 1] ?? '';
    const safeStartColumn = clamp(startColumn, 0, line.length);
    const safeEndColumn = clamp(endColumn, safeStartColumn, line.length);
    return line.slice(safeStartColumn, safeEndColumn);
  }

  const selectedLines: string[] = [];

  for (let lineIndex = startLine - 1; lineIndex < endLine; lineIndex += 1) {
    const line = lines[lineIndex] ?? '';

    if (lineIndex === startLine - 1) {
      selectedLines.push(line.slice(clamp(startColumn, 0, line.length)));
    } else if (lineIndex === endLine - 1) {
      selectedLines.push(line.slice(0, clamp(endColumn, 0, line.length)));
    } else {
      selectedLines.push(line);
    }
  }

  return selectedLines.join('\n');
};

export const createSourceInfo = (
  data: ElementClickData,
  files: Record<string, string>
): SourceInfo | null => {
  const fileContent = files[data.file];
  if (!fileContent) return null;

  const lines = fileContent.split('\n');
  const maxLine = lines.length;
  const startLine = clamp(data.startLine, 1, maxLine);
  const endLine = clamp(data.endLine, startLine, maxLine);

  return {
    file: data.file,
    startLine,
    endLine,
    startColumn: data.startColumn,
    endColumn: data.endColumn,
    content: getSelectedSourceText(
      lines,
      startLine,
      endLine,
      data.startColumn,
      data.endColumn
    ),
    position: { x: data.x, y: data.y }
  };
};
