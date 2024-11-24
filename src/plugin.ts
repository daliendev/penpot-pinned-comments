import type { Shape, Comment, CommentThread } from '@penpot/plugin-types';
import type { PluginMessageEvent } from './model';

penpot.ui.open('Penpot Pinned Comments plugin', `?theme=${penpot.theme}`);

penpot.on('themechange', (theme) => {
  sendMessage({ type: 'theme', content: theme });
});

penpot.on('selectionchange', (elementIds: string[]) => {
  pinCommentsToShapes(elementIds)
})

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

async function pinCommentsToShapes(shapeIds: string[] = []) {
  const page = penpot.currentPage;
  if (!page) return;

  try {
    const commentThreads: CommentThread[] = await page.findCommentThreads();
    let shapes = page.findShapes();

    if(shapeIds.length) {
      shapes = shapes.filter((shape: Shape) => shapeIds.includes(shape.id))
    }

    for (const thread of commentThreads) {
      const commentPosition = thread.position;
      
      const targetShape = shapes.find(shape => isPointInShape(commentPosition, shape));
      if (targetShape) {
        await thread.reply(`📌 Pinned to id:${targetShape.id}`)
      }
    }
  } catch (error) {
    console.error('Error pinning comments:', error);
  }
}

async function getThreadsByElementId(elementId: string) {
  const allThreads: CommentThread[]|undefined = await penpot.currentPage?.findCommentThreads();
  for(const thread of allThreads ?? []) {
    const comments: Comment[]|undefined = await thread.findComments();
    let results = [];
    for (const comment of comments ?? []) {
      const pattern = /📌 Pinned to id:([a-zA-Z0-9-]+)/;
      const match = comment.content.match(pattern);
      if (match) {
        const extractedId = match[1];
        if(extractedId === elementId) {
          results.push(comments.shift()?.content)
        }
      }
    }
    console.log(results)
  }
}

getThreadsByElementId('')
