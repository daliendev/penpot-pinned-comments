import type { Shape, Comment, CommentThread } from '@penpot/plugin-types';
import type { PluginMessageEvent } from './model';

penpot.ui.open('Comment Tracker', `?theme=${penpot.theme}`);

penpot.on('themechange', (theme) => {
  sendMessage({ type: 'theme', content: theme });
});

penpot.on('selectionchange', (elementIds: string[]) => {
  pinCommentsToShapes(elementIds);
  getThreadsByShapeId(elementIds);
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
    const shapes = await getShapesByIds(shapeIds)

    for (const thread of commentThreads) {
      const commentPosition = thread.position;
      
      const targetShape = shapes.find(shape => isPointInShape(commentPosition, shape));
      if (targetShape) {
        targetShape.setSharedPluginData('pinnedComments', thread.seqNumber.toString(), 'pinned');
      }
    }
  } catch (error) {
    console.error('Error pinning comments:', error);
  }
}

async function getShapesByIds(shapeIds: string[]): Promise<Shape[]> {
  const page = penpot.currentPage;
  if (!page) return [];

  let shapes = page.findShapes();

  if(shapeIds.length) {
    shapes = shapes.filter((shape: Shape) => shapeIds.includes(shape.id));
  }

  return shapes;
}

async function getThreadsByShapeId(shapeIds: string[]) {
  const page = penpot.currentPage;
  if (!page) return [];

  const shapes: Shape[] = await getShapesByIds(shapeIds);
  const threadIds: Number[] = [];

  for (const shape of shapes) {
    const sharedKeys = shape.getSharedPluginDataKeys('pinnedComments');
    sharedKeys.forEach((key) => {
      const seqNumber = parseInt(key);
      if(!threadIds.includes(seqNumber)) {
        threadIds.push(seqNumber);
      }
    });
  }

  const commentThreads: CommentThread[] = await page.findCommentThreads();
  for (const thread of commentThreads) {
    if(threadIds.includes(thread.seqNumber)) {
      const comments: Comment[] = await thread.findComments();
      console.log(comments[0].content);
    }
  }
}

