import loginHandler from '../api/auth/login';
import logoutHandler from '../api/auth/logout';
import verifyHandler from '../api/auth/verify';
import signatureHandler from '../api/upload/signature';
import { createToken } from '../api/lib/auth';

// ---------------------------------------------------------------------------
// Mock Environment
// ---------------------------------------------------------------------------
process.env.CLOUDINARY_NAME = 'test_cloud';
process.env.CLOUDINARY_KEY = 'test_key';
process.env.CLOUDINARY_SECRET = 'test_secret_for_hash';
process.env.ADMIN_JWT_SECRET = 'test_jwt_secret_value_for_cookie';

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
test('POST /api/auth/login - Success sets HTTP-Only Cookie', async () => {
  const req = createMockReq({
    method: 'POST',
    body: { userId: 'KSPM', password: 'UIKA' },
  });
  const res = createMockRes();

  await loginHandler(req, res);

  if (res.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${res.statusCode}`);
  }
  if (!res.body.success) {
    throw new Error(`Expected body.success to be true`);
  }
  if (!res.body.token) {
    throw new Error('Expected response to contain token');
  }

  const setCookie = res.headers['set-cookie'];
  if (!setCookie) {
    throw new Error('Expected Set-Cookie header to be defined');
  }
  if (!setCookie.includes('kspm_admin_token=')) {
    throw new Error(`Expected Set-Cookie to contain kspm_admin_token, got: ${setCookie}`);
  }
  if (!setCookie.includes('HttpOnly')) {
    throw new Error(`Expected Set-Cookie to include HttpOnly, got: ${setCookie}`);
  }
  if (!setCookie.includes('SameSite=Strict')) {
    throw new Error(`Expected Set-Cookie to include SameSite=Strict, got: ${setCookie}`);
  }
});

test('POST /api/auth/login - Invalid Credentials fails', async () => {
  const req = createMockReq({
    method: 'POST',
    body: { userId: 'WrongUser', password: 'WrongPassword' },
  });
  const res = createMockRes();

  await loginHandler(req, res);

  // Note: Database check will run and fail (since query is mocked or offline, it throws an error in catch block and returns 500 or 401)
  if (res.statusCode !== 401 && res.statusCode !== 500) {
    throw new Error(`Expected failure status (401/500), got ${res.statusCode}`);
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
