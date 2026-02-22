# LiveChat

A real-time public chatroom. No account needed — just open it, pick a name, and start talking.

**[→ Try it live](https://chat-app-pi-ecru-87.vercel.app)**

---

## What it does

- Enter a username and join a shared chatroom instantly
- Messages appear in real-time for everyone in the room
- See who's online in the sidebar
- Get notified when people join or leave
- Open multiple tabs — they all stay in sync
- No database. No login. No persistence. When you close the tab, you're gone.

## Tech

- **Frontend** — Next.js + React + TypeScript, CSS Modules
- **Backend** — NestJS with a WebSocket Gateway (Socket.IO)
- **Storage** — in-memory only, intentionally simple

Built by [M. Ortikov](https://github.com/diyorend)
