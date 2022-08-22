export function encode(data: string): string {
  return Buffer.from(data, 'utf-8').toString('base64');
}

export function decode(data: string): string {
  return Buffer.from(data, 'base64').toString('utf-8');
}
