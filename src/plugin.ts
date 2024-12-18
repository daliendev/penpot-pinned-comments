import type { Shape, Comment, CommentThread } from '@penpot/plugin-types';
import type { PluginMessageEvent } from './model';

penpot.ui.open('Comment Tracker', `?theme=${penpot.theme}`);

penpot.on('themechange', (theme) => {
  sendMessage({ type: 'theme', content: theme });
});

pinAllComments();
sendThreadsByShapes(penpot.selection);

penpot.on('selectionchange', (elementIds: string[]) => {
  pinAllComments();
  sendThreadsByShapeIds(elementIds);
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

async function pinAllComments() {
  const allShapes = penpot.currentPage?.findShapes();
  if(allShapes) {
    pinCommentsToShapes(allShapes);
  }
}

async function pinCommentsToShapes(shapes: Shape[]) {
  const commentThreads: CommentThread[] = await penpot.currentPage?.findCommentThreads() ?? [];
  
  for (const thread of commentThreads) {
      const targetShape = shapes.find(shape => isPointInShape(thread.position, shape));
      if (targetShape) {
        targetShape.setSharedPluginData('pinnedComments', thread.seqNumber.toString(), 'pinned');
      }
  }
}

async function getShapesByIds(shapeIds: string[]): Promise<Shape[]> {
  let shapes = penpot.currentPage?.findShapes() ?? [];

  if(shapeIds.length) {
    shapes = shapes.filter((shape: Shape) => shapeIds.includes(shape.id));
  }

  return shapes;
}

async function sendThreadsByShapeIds(shapeIds: string[]) {
  const shapes: Shape[] = await getShapesByIds(shapeIds);
  sendThreadsByShapes(shapes);
}

async function sendThreadsByShapes(shapes: Shape[]) {
  const threadSeqNumbers: Number[] = [];

  for (const shape of shapes) {
    const sharedKeys = shape.getSharedPluginDataKeys('pinnedComments');
    for (const key of sharedKeys) {
      const seqNumber = parseInt(key);
      if(!threadSeqNumbers.includes(seqNumber)) {
        threadSeqNumbers.push(seqNumber);
      }
    }
  }

  const commentThreads: CommentThread[] = await penpot.currentPage?.findCommentThreads() ?? [];
  const formattedThreads = <string[][]>[];
  
  for (const thread of commentThreads) {
    if(threadSeqNumbers.includes(thread.seqNumber)) {
      const comments: Comment[] = await thread.findComments();
      const formattedComments: string[] = [];
      comments.forEach(function (comment) {
        formattedComments.push(comment.content);
      });
      formattedThreads.push(formattedComments)
    }
  }
  
  penpot.ui.sendMessage({ type: 'threads', content: JSON.stringify(formattedThreads)})
}

