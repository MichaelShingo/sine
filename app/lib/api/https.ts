import { NextResponse } from 'next/server';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, { status: 200, ...init });
}

export function created<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, { status: 201, ...init });
}

export function noContent(init?: ResponseInit) {
  return new NextResponse(null, { status: 204, ...init });
}

export function badRequest(message: string, init?: ResponseInit) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 400, ...init },
  );
}

export function unauthorized(message = 'Unauthorized', init?: ResponseInit) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401, ...init },
  );
}

export function forbidden(message = 'Forbidden', init?: ResponseInit) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403, ...init },
  );
}

export function notFound(message = 'Not found', init?: ResponseInit) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 404, ...init },
  );
}

export function conflict(message = 'Conflict', init?: ResponseInit) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 409, ...init },
  );
}

export function unprocessable(message: string, init?: ResponseInit) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 422, ...init },
  );
}

export function internalError(
  message = 'Internal server error',
  init?: ResponseInit,
) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 500, ...init },
  );
}
