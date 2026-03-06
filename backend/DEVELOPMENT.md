# Backend development

## Port configuration

- **Default port:** `5001` (set in code; overridden by `PORT` in `.env`).
- **Why not 5000?** On macOS, port 5000 is often used by **AirPlay Receiver** (Control Center). Use `PORT=5001` in `.env` to avoid conflicts.

Example `.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/healthcare-appointments
JWT_SECRET=your-secret
```

## If you see "address already in use"

1. **Find what is using the port (e.g. 5001 or 5000):**

   ```bash
   lsof -i :5001
   ```

   Or for port 5000:

   ```bash
   lsof -i :5000
   ```

2. **Kill that process (replace `<PID>` with the number from the first column):**

   ```bash
   kill -9 <PID>
   ```

   Example if PID is 12345:

   ```bash
   kill -9 12345
   ```

3. **Or use one line to kill whatever is on 5001:**

   ```bash
   lsof -ti :5001 | xargs kill -9
   ```

## Dev workflow – avoid duplicate servers

- Run **only one** `npm run dev` (or `npm run dev:nodemon`) in one terminal.
- Before starting again, stop the current process with `Ctrl+C`.
- If using `node --watch`, a file save restarts the process; the previous one should exit. If you still get EADDRINUSE, another process (or macOS on 5000) is using the port – use the commands above.

## Scripts

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Run with `node --watch` (Node 18+)   |
| `npm run dev:nodemon` | Run with nodemon (restart on file change) |
| `npm start`        | Production: `node server.js`        |

To use nodemon, install once:

```bash
npm install
npm run dev:nodemon
```
