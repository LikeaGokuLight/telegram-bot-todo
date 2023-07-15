import { AppService } from './app.service';
import { Telegraf } from 'telegraf';
import {
  InjectBot,
  Start,
  Ctx,
  Update,
  On,
  Hears,
  Message,
} from 'nestjs-telegraf';
import { keyboardAction } from './utils/app.button';
import { Context } from 'src/types/context.interface';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Welcome', keyboardAction());
  }

  @Hears('🆕 create new task')
  async createNewTask(@Ctx() ctx: Context) {
    await ctx.reply('Write your new task: ');
    ctx.session.type = 'create';
  }

  @Hears('📝 list of tasks')
  async getAllTasks(@Ctx() ctx: Context) {
    console.log('worked getAllTasks AppUpdate');

    const todos = await this.appService.getAllTask();

    if (!todos) {
      await ctx.reply(`😢 Oops! It seems like you not have any task yet.`);
      return;
    }

    await ctx.reply(this.appService.getAllList(todos));
  }

  @Hears('✅ Complete task')
  async completeTodo(@Ctx() ctx: Context) {
    await ctx.reply('type ID of task: ');
    ctx.session.type = 'done';
  }

  @Hears('✏️ edit task')
  async editTodo(@Ctx() ctx: Context) {
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      `type ID and new name for task \n\n <b>in this format: 1 | new name task</b>`,
    );
    ctx.session.type = 'edit';
  }

  @Hears('❌ delete task')
  async deleteTodo(@Ctx() ctx: Context) {
    await ctx.reply('type ID of task to delete: ');
    ctx.session.type = 'delete';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    // On Message CREATE
    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message);
      await ctx.reply(this.appService.getAllList(todos));
    }

    // On Message DONE
    if (ctx.session.type === 'done') {
      const todos = await this.appService.completeTask(Number(message));

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply(
          `😢 Oops! It seems like the task you're looking for couldn't be found.`,
        );
        return;
      }
      await ctx.reply(this.appService.getAllList(todos));
    }

    // On Message EDIT
    if (ctx.session.type === 'edit') {
      const [taskId, newTaskName] = message.split(' | ');
      const todos = await this.appService.editTask(Number(taskId), newTaskName);

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply(
          `😢 Oops! It seems like the task you're looking for couldn't be found.`,
        );
        return;
      }

      await ctx.reply(this.appService.getAllList(todos));
    }

    // ON Message DELETE
    if (ctx.session.type === 'delete') {
      const todos = await this.appService.deleteTask(Number(message));

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply(
          `😢 Oops! It seems like the task you're looking for couldn't be found.`,
        );
        return;
      }

      return this.appService.getAllList(todos);
    }
  }
}
