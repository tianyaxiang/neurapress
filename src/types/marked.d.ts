import { marked } from 'marked';

declare module 'marked' {
  interface RendererThis {
    footnote: (token: any) => string;
  }
}
