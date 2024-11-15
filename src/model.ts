/**
 * This file contains the typescript interfaces for the plugin events.
 */

export interface ThemePluginEvent {
  type: 'theme'
  content: string
}

export interface PinCommentEvent {
  type: 'pin-comment'
  content: string
}

export type PluginMessageEvent = ThemePluginEvent | PinCommentEvent

