import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_FILE_SIZE, canAccessOpportunity, canDownloadAttachment, canUploadAttachment, validateFiles, formatBytes, normalizeSearch, filterAttachments, classifyFile, sortAttachments } from './attachments.js';

const opportunity = { id: 'OPP-1', ownerId: 'owner-1', sharedUserIds: ['member-1', 'member-2'] };

test('owner can download and upload attachments', () => {
  assert.equal(canDownloadAttachment('owner-1', opportunity), true);
  assert.equal(canUploadAttachment('owner-1', opportunity), true);
});
test('shared members can download and upload attachments', () => {
  assert.equal(canDownloadAttachment('member-1', opportunity), true);
  assert.equal(canUploadAttachment('member-2', opportunity), true);
});
test('users who are neither owner nor shared cannot download or upload', () => {
  assert.equal(canAccessOpportunity('outsider', opportunity), false);
  assert.equal(canDownloadAttachment('outsider', opportunity), false);
  assert.equal(canUploadAttachment('outsider', opportunity), false);
});
test('file size exactly at 20 MB is accepted; larger file is rejected', () => {
  const result = validateFiles([{ name: 'allowed.pdf', size: MAX_FILE_SIZE }, { name: 'too-large.pdf', size: MAX_FILE_SIZE + 1 }]);
  assert.equal(result.accepted.length, 1);
  assert.equal(result.accepted[0].name, 'allowed.pdf');
  assert.equal(result.rejected.length, 1);
  assert.match(result.rejected[0].reason, /Vượt giới hạn/);
});
test('multiple files are validated independently', () => {
  const result = validateFiles([{ name: 'one.txt', size: 12 }, { name: 'two.txt', size: 8 }, { name: 'large.mov', size: 21 * 1024 * 1024 }]);
  assert.equal(result.accepted.length, 2);
  assert.equal(result.rejected.length, 1);
});
test('file size formatting supports bytes, KB and MB', () => {
  assert.equal(formatBytes(500), '500 B');
  assert.equal(formatBytes(2048), '2.0 KB');
  assert.equal(formatBytes(3 * 1024 * 1024), '3.0 MB');
});
test('Vietnamese search normalization ignores case and diacritics', () => {
  assert.equal(normalizeSearch('Biên Bản Họp'), 'bien ban hop');
  assert.equal(normalizeSearch('ĐẠI PHÁT'), 'dai phat');
});
test('attachment search matches names and uploader', () => {
  const attachments = [{ name: 'Bien-ban-hop.pdf', uploaderName: 'Nguyễn Linh', type: 'application/pdf' }, { name: 'Bao-gia.xlsx', uploaderName: 'Minh Phạm', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }];
  assert.equal(filterAttachments(attachments, 'biên bản').length, 1);
  assert.equal(filterAttachments(attachments, 'minh pham').length, 1);
});
test('file type classification covers common document formats', () => {
  assert.equal(classifyFile('dossier.pdf'), 'pdf');
  assert.equal(classifyFile('contract.docx'), 'word');
  assert.equal(classifyFile('budget.xlsx'), 'sheet');
  assert.equal(classifyFile('slide.pptx'), 'slides');
  assert.equal(classifyFile('photo.png'), 'image');
});
test('type filter and sort order return expected results without mutating input', () => {
  const attachments = [{ name: 'z.pdf', type: 'application/pdf', uploadedAt: '2026-01-01T00:00:00Z' }, { name: 'a.txt', type: 'text/plain', uploadedAt: '2026-02-01T00:00:00Z' }];
  assert.equal(filterAttachments(attachments, '', 'pdf').length, 1);
  assert.equal(sortAttachments(attachments, 'newest')[0].name, 'a.txt');
  assert.equal(attachments[0].name, 'z.pdf');
});
