import path from "path"
import fs from "fs"
import url from "url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import type { Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// Load .env file if it exists into process.env
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEquals = trimmed.indexOf('=');
    if (firstEquals === -1) return;
    const key = trimmed.slice(0, firstEquals).trim();
    let val = trimmed.slice(firstEquals + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
}

// Vite plugin to simulate Vercel serverless functions in local dev
function vercelApiDevPlugin(): Plugin {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const parsedUrl = url.parse(req.url, true);
          const pathname = parsedUrl.pathname || '';
          const apiDir = path.resolve(__dirname, './api');

          let filePath = '';
          const queryParams: Record<string, any> = { ...parsedUrl.query };

          // Route mappings matching Vercel routes
          if (pathname === '/api/auth/login') {
            filePath = path.join(apiDir, 'auth/login.ts');
          } else if (pathname === '/api/auth/logout') {
            filePath = path.join(apiDir, 'auth/logout.ts');
          } else if (pathname === '/api/auth/verify') {
            filePath = path.join(apiDir, 'auth/verify.ts');
          } else if (pathname === '/api/upload/signature') {
            filePath = path.join(apiDir, 'upload/signature.ts');
          } else if (pathname === '/api/setup') {
            filePath = path.join(apiDir, 'setup.ts');
          } else if (pathname === '/api/messages') {
            filePath = path.join(apiDir, 'messages.ts');
          } else {
            // Dynamic routing
            const messagesMatch = pathname.match(/^\/api\/messages\/([^/]+)$/);
            if (messagesMatch) {
              filePath = path.join(apiDir, 'messages/[id].ts');
              queryParams.id = messagesMatch[1];
            } else {
              const contentMatch = pathname.match(/^\/api\/content\/([^/]+)$/);
              if (contentMatch) {
                filePath = path.join(apiDir, 'content/[section].ts');
                queryParams.section = contentMatch[1];
              }
            }
          }

          if (!filePath || !fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `API route not found: ${pathname}` }));
            return;
          }

          // Parse body if method is POST, PUT, PATCH
          let body = {};
          if (req.method && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
            body = await new Promise((resolve) => {
              let chunkString = '';
              req.on('data', chunk => {
                chunkString += chunk;
              });
              req.on('end', () => {
                try {
                  resolve(JSON.parse(chunkString));
                } catch {
                  resolve({});
                }
              });
            });
          }

          // Load the module through Vite's SSR module loader
          // This dynamically compiles TypeScript and updates when changes occur (HMR)
          const module = await server.ssrLoadModule(filePath);
          const handler = module.default;

          if (typeof handler !== 'function') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `API handler must export default function` }));
            return;
          }

          // Mock VercelRequest objects
          const vercelReq = Object.assign(req, {
            query: queryParams,
            body: body,
            cookies: {} as Record<string, string>,
          });

          // Extract cookies
          const cookieHeader = req.headers.cookie;
          if (cookieHeader) {
            const cookies: Record<string, string> = {};
            cookieHeader.split(';').forEach(str => {
              const parts = str.split('=');
              if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim();
                cookies[key] = decodeURIComponent(val);
              }
            });
            vercelReq.cookies = cookies;
          }

          // Mock VercelResponse objects
          const vercelRes = Object.assign(res, {
            status(code: number) {
              res.statusCode = code;
              return vercelRes;
            },
            json(obj: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(obj));
              return vercelRes;
            },
            send(obj: any) {
              if (typeof obj === 'object') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(obj));
              } else {
                res.end(obj);
              }
              return vercelRes;
            }
          });

          await handler(vercelReq, vercelRes);

        } catch (error: any) {
          console.error(`[API DEV SERVER ERROR] Error handling route:`, error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            error: 'Internal Server Error in Vite API Simulator',
            details: error instanceof Error ? error.message : String(error)
          }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [inspectAttr(), react(), vercelApiDevPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
