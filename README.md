# Penpot Comment Tracker Plugin

A Penpot plugin that helps track comment history on shapes, maintaining the connection between comments and shapes even when comments are moved or shapes are modified.

## Features

- Automatically pins comments to any shapes they were placed on during their lifetime
- Tracks comment history across shape modifications
- Shows complete comment threads for selected shapes
- Maintains comment-shape relationships even if comments are moved
- Provides an easy-to-use interface to view comment history

## Usage

1. Install the plugin in your Penpot workspace
2. The plugin is now monitoring changes
3. Select any shape(s) on your artboard
4. The plugin will show all comment threads that have been associated with the selected shape(s)
5. Click on any comment to expand its full thread history

## How it works

The plugin works by:
- Monitoring all comments on the page
- Creating persistent associations between comments and shapes
- Maintaining these associations even when comments are moved
- Providing a clean interface to view comment history for any selected shape

## Permissions

The plugin requires the following permissions:
- page:read - To access page content
- content:write - To manage comment associations
- file:read - To read file content
- selection:read - To track selected shapes
- comment:write - To manage comments

## Roadmap

- Comment authors usernames in the plugin view
- Add a comment to a thread directly from the plugin view
- Mark a thread as resolved directly from the plugin view
- Filter threads by author
- Filter comments by author
- A filter to show resolved threads
