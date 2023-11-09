import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

dotenv.config({ path: '.env.test' });
