import type { Shape } from '@penpot/plugin-types';
import type { PluginMessageEvent } from './model';

penpot.ui.open('Penpot Pinned Comments plugin', `?theme=${penpot.theme}`);

penpot.on('themechange', (theme) => {
  sendMessage({ type: 'theme', content: theme });
});

function sendMessage(message: PluginMessageEvent) {
  penpot.ui.sendMessage(message);
}

function isPointInShape(point: { x: number; y: number }, shape: Shape): boolean {
  const bounds = shape.bounds;
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

async function pinCommentsToShapes() {
  const page = penpot.currentPage;
  if (!page) return;

  try {
    const commentThreads = await page.findCommentThreads();
    const shapes = page.findShapes();

    for (const thread of commentThreads) {
      const commentPosition = thread.position;
      
      const targetShape = shapes.find(shape => isPointInShape(commentPosition, shape));
      console.log({targetShape, thread})
      if (targetShape) {
        await thread.reply(`Linked to ${targetShape.name}`)
      }
    }
  } catch (error) {
    console.error('Error pinning comments:', error);
  }
}

pinCommentsToShapes();

