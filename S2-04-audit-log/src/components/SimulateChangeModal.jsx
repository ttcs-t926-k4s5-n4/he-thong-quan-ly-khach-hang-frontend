import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Percent,
  Target,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { SIMULATION_TARGETS, USERS_LIST, OBJECT_TYPES } from '../data/mockData';

export function SimulateChangeModal({ isOpen, onClose, onSaveAuditLog }) {
  if (!isOpen) return null;

  // Selected target
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(0);
  const currentTarget = SIMULATION_TARGETS[selectedTargetIndex];

  // Form states
  const [selectedUserId, setSelectedUserId] = useState(USERS_LIST[0].id);
  const [newValue, setNewValue] = useState('');
  const [reason, setReason] = useState('');
  const [approvedBy, setApprovedBy] = useState('Được phê duyệt bởi Ban Giám Đốc');
  const [isAnomalous, setIsAnomalous] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTargetChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedTargetIndex(idx);
    setNewValue('');
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newValue.trim()) {
      setErrorMsg('Vui lòng nhập giá trị mới sau khi thay đổi!');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Vui lòng nhập lý do giải trình thay đổi dữ liệu nhạy cảm!');
      return;
    }

    const operator = USERS_LIST.find((u) => u.id === selectedUserId) || USERS_LIST[0];
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const newId = `AUD-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Fake hash
    const fakeHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newLog = {
      id: newId,
      timestamp,
      user: operator,
      ipAddress: '192.168.1.100 (Thao tác Trực tiếp)',
      objectType: currentTarget.type,
      targetId: currentTarget.id,
      targetName: currentTarget.name,
      fieldName: currentTarget.fieldName,
      oldValue: currentTarget.currentValue,
      newValue: newValue.trim(),
      changeType:
        currentTarget.type === 'DISCOUNT'
          ? 'Cập nhật mức chiết khấu'
          : currentTarget.type === 'SALES_TARGET'
          ? 'Điều chỉnh chỉ tiêu doanh số'
          : currentTarget.type === 'DATA_OWNERSHIP'
          ? 'Chuyển giao quyền sở hữu'
          : 'Thay đổi phân quyền vai trò',
      severity: isAnomalous ? 'critical' : 'high',
      isAnomalous,
      anomalyReason: isAnomalous
        ? 'Thay đổi giá trị lớn vào thời điểm nhạy cảm không qua quy trình chuẩn.'
        : '',
      reason: reason.trim(),
      approvedBy: approvedBy.trim() || 'Tự động duyệt hệ thống',
      integrityHash: fakeHash
    };

    onSaveAuditLog(newLog);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <PlusCircle size={20} className="text-cyan" />
            <h2 className="modal-title">
              Giả Lập Sửa Dữ Liệu Nhạy Cảm & Sinh Nhật Ký
            </h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="alert alert-info">
              💡 <strong>Thực hành nghiệp vụ:</strong> Hãy thử chỉnh sửa một trường dữ liệu nhạy cảm bên dưới (Chiết khấu, Chỉ tiêu, Quyền sở hữu, hoặc Vai trò). Hệ thống sẽ tự động bắt sự kiện và ghi lại một bản ghi Audit Log chuẩn chỉ vào danh sách theo thời gian thực!
            </div>

            {errorMsg && (
              <div className="alert alert-danger">
                <AlertTriangle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Chọn Người thực hiện */}
            <div className="form-group">
              <label className="form-label" htmlFor="operator-select">
                1. Người thực hiện thao tác (Operator):
              </label>
              <select
                id="operator-select"
                className="form-control"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                {USERS_LIST.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} - {u.role}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Chọn đối tượng nhạy cảm */}
            <div className="form-group">
              <label className="form-label" htmlFor="target-select">
                2. Chọn đối tượng dữ liệu nhạy cảm cần can thiệp:
              </label>
              <select
                id="target-select"
                className="form-control"
                value={selectedTargetIndex}
                onChange={handleTargetChange}
              >
                {SIMULATION_TARGETS.map((t, idx) => {
                  const typeLabel = OBJECT_TYPES[t.type]?.label || t.type;
                  return (
                    <option key={t.id} value={idx}>
                      [{typeLabel}] {t.name} ({t.id})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Giá trị Trước (Readonly) */}
            <div className="form-group">
              <label className="form-label">
                3. Giá trị HIỆN TẠI trước khi sửa (Previous Value):
              </label>
              <div className="readonly-value-box font-mono">
                {currentTarget.currentValue}
              </div>
              <span className="field-hint">
                Trường bị tác động: <code>{currentTarget.fieldName}</code>
              </span>
            </div>

            {/* Giá trị Mới */}
            <div className="form-group">
              <label className="form-label" htmlFor="new-val-input">
                4. Nhập GIÁ TRỊ MỚI muốn thay đổi (New Value) *:
              </label>
              <input
                id="new-val-input"
                type="text"
                className="form-control font-mono"
                placeholder={
                  currentTarget.type === 'DISCOUNT'
                    ? 'Ví dụ: 25.0% hoặc 30%'
                    : currentTarget.type === 'SALES_TARGET'
                    ? 'Ví dụ: 18,000,000,000 VND (18 Tỷ)'
                    : currentTarget.type === 'DATA_OWNERSHIP'
                    ? 'Ví dụ: Nguyễn Văn Toàn (Giám đốc dự án)'
                    : 'Ví dụ: System_SuperAdmin'
                }
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </div>

            {/* Lý do thay đổi */}
            <div className="form-group">
              <label className="form-label" htmlFor="reason-input">
                5. Lý do điều chỉnh (Audit Justification) *:
              </label>
              <textarea
                id="reason-input"
                rows={2}
                className="form-control"
                placeholder="Nhập lý do nghiệp vụ hoặc số phiếu đề xuất thay đổi..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* Căn cứ phê duyệt */}
            <div className="form-group">
              <label className="form-label" htmlFor="approved-input">
                6. Căn cứ / Người duyệt:
              </label>
              <input
                id="approved-input"
                type="text"
                className="form-control"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
              />
            </div>

            {/* Checkbox đánh dấu bất thường cuối quý */}
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAnomalous}
                  onChange={(e) => setIsAnomalous(e.target.checked)}
                />
                <span className="checkbox-text">
                  Đánh dấu là giao dịch bất thường (Gây lệch số liệu cuối quý để kiểm tra cảnh báo)
                </span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Xác nhận & Ghi nhận Audit Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
