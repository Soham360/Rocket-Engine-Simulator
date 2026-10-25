import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||path.relative(root,file).split(path.sep).some(p=>p.startsWith('.'))){res.writeHead(403).end();return;}const data=await readFile(file);res.writeHead(200,{'Content-Type':({'.ico':'image/vnd.microsoft.icon','.png':'image/png','.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json'})[path.extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404).end('Not found');}}).listen(5174,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:5174'));
