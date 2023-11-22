import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

class ClipboardEventMock extends Event {
  constructor(type, eventInitDict) {
    super(type, eventInitDict);
    this.clipboardData = {
      getData: jest.fn(),
      setData: jest.fn(),
    };
  }
}
global.ClipboardEvent = ClipboardEventMock;

class DragEventMock extends Event {
  constructor(type, eventInitDict) {
    super(type, eventInitDict);
    this.dataTransfer = {
      getData: jest.fn(),
      setData: jest.fn(),
    };
  }
}
global.DragEvent = DragEventMock;

// Suppress Prisma errors when running tests...
const originalConsoleLog = console.log;

jest.spyOn(console, 'log').mockImplementation((...args) => {
  const logMessage = args.join(' ');
  if (!logMessage.includes('prisma:error')) {
    originalConsoleLog(...args);
  }
});

afterAll(() => {
  jest.restoreAllMocks();
});

dotenv.config({ path: '.env.test' });
