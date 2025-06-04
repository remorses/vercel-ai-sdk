import { ToolInvocation, ToolInvocationUIPart, UIMessage } from './ui-messages';
import { ToolSet } from '../generate-text/tool-set';

export function getToolInvocations<TOOLS extends ToolSet>(
  message: UIMessage<any, any, TOOLS>,
): ToolInvocation<TOOLS>[] {
  return message.parts
    .filter(
      (part): part is ToolInvocationUIPart<TOOLS> =>
        part.type === 'tool-invocation',
    )
    .map(part => part.toolInvocation);
}
