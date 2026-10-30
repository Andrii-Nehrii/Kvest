// Пакеты синхронизации. Телефон никогда не присылает «готовое состояние» — только свой журнал
// действий и ответы. Партнёр сам воспроизводит журнал, поэтому чужие решения нельзя перезаписать,
// а повторная отправка того же пакета ничего не меняет (идемпотентность).
// Подпись HMAC-SHA256 общим секретом пары защищает от подмены и от пакетов чужой пары.
import type { ActionRecord } from './game';
import { canonical } from './rng';
import type { PlayerId } from './types';

export interface SegmentPacket {
  v: 1;
  type: 'segment';
  pairId: string;
  from: PlayerId;
  /** Номер контрольной точки, к которой ведёт участок. */
  checkpoint: number;
  baseHash: string;
  engine: string;
  content: string;
  /** Отпечаток сборки сюжета: у партнёров должна быть одна и та же сборка. */
  build?: string;
  actions: ActionRecord[];
  endHash: string;
  /** Чем закончился участок: дошёл до точки, погиб, без сознания. */
  finish: 'checkpoint' | 'incapacitated' | 'dead' | 'absent';
}

export interface AnswersPacket {
  v: 1;
  type: 'answers';
  pairId: string;
  from: PlayerId;
  checkpoint: number;
  mergedHash: string;
  build?: string;
  answers: Record<string, string>;
}

export interface InvitePacket {
  v: 1;
  type: 'invite' | 'join';
  pairId: string;
  from: PlayerId;
  seed: string;
  /** Секрет пары передаётся только в приглашении (один раз, напрямую партнёру). */
  secret?: string;
  /** Токен облака (GitHub) — едет в приглашении, чтобы второй телефон подключился сам. */
  cloudToken?: string;
  content: string;
  engine: string;
  build?: string;
  setup: unknown;
}

export type Packet = SegmentPacket | AnswersPacket | InvitePacket;
export type Signed<T> = T & { mac: string };

const PREFIX = 'KVEST1.';

function b64url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64url(s: string): Uint8Array {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pump(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function deflate(data: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream === 'undefined') return data;
  return pump(new Blob([data as BlobPart]).stream().pipeThrough(new CompressionStream('deflate-raw')));
}

async function inflate(data: Uint8Array): Promise<Uint8Array> {
  return pump(new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw')));
}

export function newSecret(): string {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return b64url(b);
}

export function newId(bytes = 12): string {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return b64url(b);
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', unb64url(secret) as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return b64url(new Uint8Array(sig));
}

export async function sign<T extends Packet>(p: T, secret: string): Promise<Signed<T>> {
  return { ...p, mac: await hmac(secret, canonical(p)) };
}

export async function verify<T extends Packet>(p: Signed<T>, secret: string): Promise<boolean> {
  const { mac, ...rest } = p;
  return (await hmac(secret, canonical(rest))) === mac;
}

/** Пакет → короткий текст, который можно переслать в мессенджере. */
export async function encode(p: Packet | Signed<Packet>): Promise<string> {
  const raw = new TextEncoder().encode(canonical(p));
  const z = await deflate(raw);
  return PREFIX + (z === raw ? 'j' : 'z') + b64url(z);
}

export async function decode(text: string): Promise<Signed<Packet> | Packet> {
  // Мессенджеры переносят длинные строки и дописывают подписи: берём только сам код после метки.
  const t = text.replace(/\s+/g, '');
  const at = t.indexOf(PREFIX);
  if (at < 0) throw new Error('Это не код игры (нет метки KVEST1).');
  const body = /^[A-Za-z0-9_-]*/.exec(t.slice(at + PREFIX.length))![0];
  let obj: { v?: number; type?: unknown };
  try {
    const bytes = unb64url(body.slice(1));
    const raw = body[0] === 'z' ? await inflate(bytes) : bytes;
    obj = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    throw new Error('Код повреждён или обрезан — скопируй его целиком ещё раз.');
  }
  if (obj?.v !== 1 || typeof obj.type !== 'string') throw new Error('Неизвестный формат кода.');
  return obj as Signed<Packet> | Packet;
}
