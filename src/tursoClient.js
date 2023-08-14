import { createClient } from '@libsql/client/web';

const turso = createClient({
    url: 'libsql://bailly-antoineboquet.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTIwMjk0MDIsImlkIjoiM2NmMzM4NGUtM2FiYi0xMWVlLThiYWItNWVlYzE1MjE2ZDM1In0.wtefIUboMWpwNgZdMeaHUUFkybCaG7MFUXc0KcmFS1vVYvuiZYoROZ0yrSttFpy6BPaAx_aYBQrvg-H5jN_7DA'
});