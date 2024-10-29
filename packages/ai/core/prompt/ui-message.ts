import { Attachment, ToolInvocation } from '@ai-sdk/ui-utils';

// only for internal use - should be removed when we fully migrate to core messages
export type UIMessage = {
  role:
    | 'system'
    | 'user'
    | 'assistant'
    | 'function' // @deprecated
    | 'data'
    | 'tool'; // @deprecated

  content: string;
  toolInvocations?: ToolInvocation[];
  experimental_attachments?: Attachment[];
};
