const fs = require('fs');
async function test() {
  const fd = new FormData();
  fd.append('file', new Blob(['test content']), 'test.txt');
  const res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: fd });
  console.log(res.status, await res.text());
}
test();
