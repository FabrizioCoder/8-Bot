import {
  Declare,
  Command,
  AutoLoad,
  type CommandContext,
  OnOptionsReturnObject,
} from 'seyfert';

@Declare({
  name: 'blawler',
  description: 'blawler commands',
})
@AutoLoad()
export default class BrawlerCommands extends Command {
  async onRunError(context: CommandContext, error: unknown) {
    context.client.logger.fatal(error);
    await context.editOrReply({
      content: error instanceof Error ? error.message : `Error: ${error}`,
    });
  }

  async onOptionsError(
    context: CommandContext,
    metadata: OnOptionsReturnObject
  ) {
    await context.editOrReply({
      content: Object.entries(metadata)
        .filter((_) => _[1].failed)
        .map((error) => `${error[0]}: ${error[1].value}`)
        .join('\n'),
    });
  }
}
