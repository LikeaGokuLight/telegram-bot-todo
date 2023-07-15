import { Markup } from 'telegraf';

export function inlineKeyboardAction() {
  return Markup.inlineKeyboard([
    Markup.button.callback('list of todo', 'list'),
    Markup.button.callback('edit list of todo', 'edit'),
    Markup.button.callback('delete list of todo', 'delete'),
  ]);
}

export function keyboardAction() {
  return Markup.keyboard(
    [
      Markup.button.callback('🆕 create new task', 'create'),
      Markup.button.callback('📝 list of tasks', 'list'),
      Markup.button.callback('✅ Complete task', 'done'),
      Markup.button.callback('✏️ edit task', 'edit'),
      Markup.button.callback('❌ delete task', 'delete'),
    ],
    {
      columns: 2,
    },
  );
}
