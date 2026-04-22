# Urban Tribe App

A Supabase-powered platform for activity booking and community engagement.

## Architecture

- **Frontend**: Vanilla JavaScript (ESM) with Vite.
- **Backend**: Supabase (Auth, DB, Storage).
- **Navigation**: Single-page application logic in `src/main.js`.

## Key Features & Implementation Notes

### 1. Messaging System
Private messages are stored in the same `comments` table as public activity discussions to satisfy existing database constraints.
- **Privacy Marker**: Private messages are prefixed with `🔒 [PRIVATE_MESSAGE]`.
- **Custom Titles**: If a message has a custom title, it is prefixed with `🔒 [TITLE: Your Title]`.
- **Filtering**: The `src/api.js` functions (`getComments`, `getConversations`, `getThreadComments`) automatically filter and strip these markers for the UI.

### 2. Unread Notifications
Unread message tracking is implemented using `localStorage`.
- **Logic**: Each conversation thread's "last read" timestamp is stored locally.
- **Limitation**: Unread badges are currently **device-specific**. If you log in on a new device, messages will appear unread until viewed there.

### 3. Comment Moderation
- Business providers can moderate public comments on their activities and news items.
- Private messages are automatically auto-approved and bypass the moderation queue to ensure instant delivery to the inbox.

## Codebase Cleanup
The root directory has been cleaned of all temporary migration, seeding, and debugging scripts.
- `src/`: Application source code.
- `public/`: Static assets.
- `supabase_schema.sql`: Reference for the database structure.
