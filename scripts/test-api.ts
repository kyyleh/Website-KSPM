import loginHandler from '../api/auth/login';
import logoutHandler from '../api/auth/logout';
import verifyHandler from '../api/auth/verify';
import signatureHandler from '../api/upload/signature';
import setupHandler from '../api/setup';
import messagesHandler from '../api/messages';
import { createToken, hashPassword } from '../api/lib/auth';
import { setMockQuery } from '../api/lib/db';

// ---------------------------------------------------------------------------
// Mock Environment
// ---------------------------------------------------------------------------
process.env.CLOUDINARY_NAME = 'test_cloud';
process.env.CLOUDINARY_KEY = 'test_key';
process.env.CLOUDINARY_SECRET = 'test_secret_for_hash';
process.env.ADMIN_JWT_SECRET = 'test_jwt_secret_value_for_cookie';
process.env.ADMIN_SETUP_TOKEN = 'test_setup_token_value_123';
process.env.WEB3FORMS_ACCESS_KEY = 'test_web3forms_key_123';

type MockReq = {
  method: string;
  body: any;
  headers: any;
  cookies: any;
};

type MockRes = {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  status: (code: number) => MockRes;
  json: (obj: any) => MockRes;
  setHeader: (name: string, value: string) => MockRes;
  end: () => MockRes;
};

function createMockReq(options: Partial<MockReq> = {}): any {
  return {
    method: options.method || 'GET',
    body: options.body || {},
    headers: {
      'content-type': 'application/json',
      ...options.headers,
    },
    cookies: options.cookies || {},
    ...options,
  };
}

function createMockRes(): any {
  const res: MockRes = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

// ---------------------------------------------------------------------------
// Test Suite Runner
// ---------------------------------------------------------------------------
const tests: { name: string; fn: () => Promise<void> }[] = [];

function test(name: string, fn: () => Promise<void>) {
  tests.push({ name, fn });
}

// 1. LOGIN TESTS
test('POST /api/auth/login - Success with new scrypt password', async () => {
  const password = 'test_admin_pwd_123';
  const hashedPasswordValue = hashPassword(password);

  setMockQuery(async (sql, params) => {
    if (sql.includes('SELECT id, email, password, name FROM admins')) {
      return [{ id: 101, email: 'AdminTest', password: hashedPasswordValue, name: 'Admin User' }];
    }
    return [];
  });

  const req = createMockReq({
    method: 'POST',
    body: { userId: 'AdminTest', password },
  });
  const res = createMockRes();

  await loginHandler(req, res);
  setMockQuery(null); // reset mock

  if (res.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${res.statusCode}`);
  }
  if (!res.body.success) {
    throw new Error(`Expected body.success to be true`);
  }
  const setCookie = res.headers['set-cookie'];
  if (!setCookie || !setCookie.includes('Secure')) {
    throw new Error(`Expected cookie to contain Secure flag, got: ${setCookie}`);
  }
});

test('POST /api/auth/login - Success with legacy SHA-256 password', async () => {
  const password = 'legacy_pwd_456';
  // Standard SHA-256 hash using crypto
  const crypto = await import('crypto');
  const legacyHash = crypto.createHash('sha256').update(password).digest('hex');

  setMockQuery(async (sql, params) => {
    if (sql.includes('SELECT id, email, password, name FROM admins')) {
      return [{ id: 102, email: 'LegacyTest', password: legacyHash, name: 'Legacy Admin' }];
    }
    return [];
  });

  const req = createMockReq({
    method: 'POST',
    body: { userId: 'LegacyTest', password },
  });
  const res = createMockRes();

  await loginHandler(req, res);
  setMockQuery(null); // reset mock

  if (res.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${res.statusCode}`);
  }
  if (!res.body.success) {
    throw new Error(`Expected body.success to be true`);
  }
});

test('POST /api/auth/login - Invalid Credentials fails', async () => {
  setMockQuery(async () => []); // user not found

  const req = createMockReq({
    method: 'POST',
    body: { userId: 'WrongUser', password: 'WrongPassword' },
  });
  const res = createMockRes();

  await loginHandler(req, res);
  setMockQuery(null); // reset mock

  if (res.statusCode !== 401) {
    throw new Error(`Expected failure status 401, got ${res.statusCode}`);
  }
});

// 2. VERIFY TESTS
test('GET /api/auth/verify - Denies access without cookie', async () => {
  const req = createMockReq({ method: 'GET' });
  const res = createMockRes();

  await verifyHandler(req, res);

  if (res.statusCode !== 401) {
    throw new Error(`Expected 401 Unauthorized, got ${res.statusCode}`);
  }
  if (res.body.valid !== false) {
    throw new Error(`Expected valid to be false`);
  }
});

test('GET /api/auth/verify - Accepts valid cookie', async () => {
  const token = createToken({ id: 999, email: 'Admin' });
  const req = createMockReq({
    method: 'GET',
    cookies: { kspm_admin_token: token },
  });
  const res = createMockRes();

  await verifyHandler(req, res);

  if (res.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${res.statusCode}`);
  }
  if (res.body.valid !== true) {
    throw new Error(`Expected valid to be true`);
  }
  if (res.body.admin.email !== 'Admin') {
    throw new Error(`Expected admin email Admin, got ${res.body.admin.email}`);
  }
});

// 3. CLOUDINARY SIGNATURE TESTS
test('GET /api/upload/signature - Returns allowed_formats restriction', async () => {
  const token = createToken({ id: 999, email: 'Admin' });
  const req = createMockReq({
    method: 'GET',
    cookies: { kspm_admin_token: token },
  });
  const res = createMockRes();

  await signatureHandler(req, res);

  if (res.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${res.statusCode}`);
  }
  if (!res.body.signature) {
    throw new Error('Expected signature in body');
  }
  if (res.body.allowed_formats !== 'png,jpg,jpeg,webp') {
    throw new Error(`Expected allowed_formats png,jpg,jpeg,webp, got: ${res.body.allowed_formats}`);
  }
});

// 4. LOGOUT TESTS
test('POST /api/auth/logout - Clears cookie', async () => {
  const req = createMockReq({ method: 'POST' });
  const res = createMockRes();

  await logoutHandler(req, res);

  if (res.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${res.statusCode}`);
  }
  const setCookie = res.headers['set-cookie'];
  if (!setCookie) {
    throw new Error('Expected Set-Cookie header on logout');
  }
  if (!setCookie.includes('Expires=Thu, 01 Jan 1970')) {
    throw new Error(`Expected expired date, got: ${setCookie}`);
  }
});

// 5. SETUP TESTS
test('GET /api/setup - Denies access without token', async () => {
  const req = createMockReq({ method: 'GET', query: {} });
  const res = createMockRes();

  await setupHandler(req, res);

  if (res.statusCode !== 403) {
    throw new Error(`Expected status 403, got ${res.statusCode}`);
  }
  if (res.body.success !== false) {
    throw new Error(`Expected success to be false`);
  }
});

test('GET /api/setup - Denies access with incorrect token', async () => {
  const req = createMockReq({ method: 'GET', query: { token: 'wrong_token' } });
  const res = createMockRes();

  await setupHandler(req, res);

  if (res.statusCode !== 403) {
    throw new Error(`Expected status 403, got ${res.statusCode}`);
  }
});

test('GET /api/setup - Accepts valid token and initializes database', async () => {
  const req = createMockReq({ method: 'GET', query: { token: 'test_setup_token_value_123' } });
  const res = createMockRes();

  // Mock DB query during setup
  setMockQuery(async (sql, params) => {
    return { affectedRows: 1 } as any;
  });

  await setupHandler(req, res);

  if (res.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${res.statusCode}`);
  }
  if (res.body.success !== true) {
    throw new Error(`Expected success to be true`);
  }
  
  // Reset mock query
  setMockQuery(null);
});

// 6. CORS TESTS
test('CORS - Dynamic origin mirroring and credentials allowed', async () => {
  const origin = 'https://kspmfeb-uika.com';
  const req = createMockReq({
    method: 'OPTIONS',
    headers: { origin },
  });
  const res = createMockRes();

  await verifyHandler(req, res);

  if (res.headers['access-control-allow-origin'] !== origin) {
    throw new Error(`Expected Access-Control-Allow-Origin: ${origin}, got: ${res.headers['access-control-allow-origin']}`);
  }
  if (res.headers['access-control-allow-credentials'] !== 'true') {
    throw new Error(`Expected Access-Control-Allow-Credentials: true, got: ${res.headers['access-control-allow-credentials']}`);
  }
});

// 7. MESSAGES (POST) AND WEB3FORMS INTEGRATION TESTS
test('POST /api/messages - Success inserts to DB and notifies email', async () => {
  const req = createMockReq({
    method: 'POST',
    body: {
      name: 'Tester Asep',
      email: 'asep@gmail.com',
      phone: '089512345678',
      message: 'Hello testing message',
      category: 'contact',
    },
  });
  const res = createMockRes();

  const originalFetch = global.fetch;
  let web3FormsCalled = false;
  
  global.fetch = async (url: any, options: any) => {
    if (String(url).includes('api.web3forms.com')) {
      web3FormsCalled = true;
      const body = JSON.parse(options.body);
      if (body.access_key !== 'test_web3forms_key_123') {
        throw new Error('Incorrect Web3Forms API key passed');
      }
      return {
        ok: true,
        json: async () => ({ success: true }),
      } as any;
    }
    return originalFetch(url, options);
  };

  let dbInserted = false;
  setMockQuery(async (sql, params) => {
    if (sql.includes('INSERT INTO messages')) {
      dbInserted = true;
      return { affectedRows: 1 } as any;
    }
    return [];
  });

  await messagesHandler(req, res);

  setMockQuery(null);
  global.fetch = originalFetch;

  if (res.statusCode !== 201) {
    throw new Error(`Expected status 201, got ${res.statusCode}`);
  }
  if (!dbInserted) {
    throw new Error('Database insert was not triggered');
  }
  if (!web3FormsCalled) {
    throw new Error('Web3Forms email dispatch was not triggered');
  }
  if (res.body.email_notified !== true) {
    throw new Error('Expected email_notified to be true in response');
  }
});

test('POST /api/messages - Database offline falls back to Web3Forms email', async () => {
  const req = createMockReq({
    method: 'POST',
    body: {
      name: 'Tester Offline',
      email: 'offline@gmail.com',
      phone: '089599999999',
      message: 'Hello fallback message',
      category: 'contact',
    },
  });
  const res = createMockRes();

  const originalFetch = global.fetch;
  let web3FormsCalled = false;

  global.fetch = async (url: any, options: any) => {
    if (String(url).includes('api.web3forms.com')) {
      web3FormsCalled = true;
      return {
        ok: true,
        json: async () => ({ success: true }),
      } as any;
    }
    return originalFetch(url, options);
  };

  setMockQuery(async (sql, params) => {
    throw new Error('Connection refused (database offline)');
  });

  await messagesHandler(req, res);

  setMockQuery(null);
  global.fetch = originalFetch;

  if (res.statusCode !== 200) {
    throw new Error(`Expected status 200 (fallback success), got ${res.statusCode}`);
  }
  if (!web3FormsCalled) {
    throw new Error('Web3Forms fallback email dispatch was not triggered');
  }
  if (!res.body.message.includes('email fallback')) {
    throw new Error(`Expected message to mention fallback, got: ${res.body.message}`);
  }
});

// ---------------------------------------------------------------------------
// Run all tests
// ---------------------------------------------------------------------------
(async () => {
  console.log('🧪 Memulai Pengujian API Otomatis (Authentication & Upload Safety)...');
  console.log('==================================================================');
  let passedCount = 0;
  let failedCount = 0;

  for (const t of tests) {
    try {
      await t.fn();
      console.log(`✅ [PASS] ${t.name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${t.name}`);
      console.error(`   👉 Error: ${err.message}`);
      failedCount++;
    }
  }

  console.log('==================================================================');
  console.log(`Pengujian selesai: ${passedCount} Lulus, ${failedCount} Gagal.`);

  if (failedCount > 0) {
    console.error('❌ Terdapat pengujian yang gagal! Membatalkan kompilasi.');
    process.exit(1);
  } else {
    console.log('🎉 Seluruh pengujian otomatis berhasil lolos dengan sukses!');
    process.exit(0);
  }
})();
