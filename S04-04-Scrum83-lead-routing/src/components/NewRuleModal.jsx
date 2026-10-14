import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Check, 
  Globe, 
  Building2, 
  Repeat 
} from 'lucide-react';

export default function NewRuleModal({
  teams = [],
  onClose,
  onCreateRule
}) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState('REGION'); // 'REGION' | 'INDUSTRY' | 'ROUND_ROBIN'
  const [regionValue, setRegionValue] = useState('CENTRAL');
  const [industryValue, setIndustryValue] = useState('MANUFACTURING');
  const [targetTeamId, setTargetTeamId] = useState(teams[0]?.id || 'TEAM_NORTH');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên quy tắc!');
      return;
    }

    const targetTeam = teams.find(t => t.id === targetTeamId);

    let condition = {};
    let action = {};

    if (mode === 'REGION') {
      condition = {
        field: 'region',
        operator: 'EQUALS',
        values: [regionValue]
      };
      action = {
        type: 'ASSIGN_TEAM_ROUND_ROBIN',
        teamId: targetTeamId,
        targetName: targetTeam ? targetTeam.name : 'Nhóm Kinh Doanh'
      };
    } else if (mode === 'INDUSTRY') {
      condition = {
        field: 'industry',
        operator: 'IN',
        values: [industryValue]
      };
      action = {
        type: 'ASSIGN_TEAM_ROUND_ROBIN',
        teamId: targetTeamId,
        targetName: targetTeam ? targetTeam.name : 'Nhóm Kinh Doanh'
      };
    } else {
      condition = {
        field: 'industry',
        operator: 'IN',
        values: ['ANY']
      };
      action = {
        type: 'GLOBAL_ROUND_ROBIN',
        targetName: 'Xoay Vòng Đều Toàn Đội Ngũ'
      };
    }

    onCreateRule({
      id: `RULE-${Date.now()}`,
      name,
      mode,
      description: `Quy tắc bổ sung do Giám đốc kinh doanh tạo: ${mode === 'REGION' ? `Khu vực ${regionValue}` : mode === 'INDUSTRY' ? `Ngành ${industryValue}` : 'Xoay vòng đều'}`,
      enabled: true,
      condition,
      action
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon">
              <Plus size={20} />
            </div>
            <div>
              <div className="modal-title">Thêm Quy Tắc Phân Bổ Lead Mới</div>
              <div className="modal-subtitle">
                Được đặt vào danh sách ưu tiên để đánh giá tự động (First-Match-Wins)
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tên Quy Tắc (*):</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ví dụ: Phân bổ Lead Năng lượng cho Nhóm Miền Trung"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chế Độ Phân Bổ (Distribution Mode):</label>
              <select 
                className="form-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="REGION">Phân bổ theo Khu vực (Region-based)</option>
                <option value="INDUSTRY">Phân bổ theo Ngành nghề (Industry-based)</option>
                <option value="ROUND_ROBIN">Xoay vòng đều trong nhóm (Round-Robin)</option>
              </select>
            </div>

            {mode === 'REGION' && (
              <div className="form-group">
                <label className="form-label">Chọn Khu Vực Áp Dụng:</label>
                <select 
                  className="form-select"
                  value={regionValue}
                  onChange={(e) => setRegionValue(e.target.value)}
                >
                  <option value="NORTH">Miền Bắc (Hà Nội & các tỉnh phía Bắc)</option>
                  <option value="SOUTH">Miền Nam (TP.HCM & Đông/Tây Nam Bộ)</option>
                  <option value="CENTRAL">Miền Trung (Đà Nẵng & Duyên hải)</option>
                  <option value="INTERNATIONAL">Quốc tế (International)</option>
                </select>
              </div>
            )}

            {mode === 'INDUSTRY' && (
              <div className="form-group">
                <label className="form-label">Chọn Ngành Nghề Áp Dụng:</label>
                <select 
                  className="form-select"
                  value={industryValue}
                  onChange={(e) => setIndustryValue(e.target.value)}
                >
                  <option value="IT_TELECOM">Công nghệ thông tin & Viễn thông</option>
                  <option value="FINANCE_BANKING">Tài chính & Ngân hàng</option>
                  <option value="MANUFACTURING">Sản xuất & Công nghiệp</option>
                  <option value="RETAIL_ECOMMERCE">Bán lẻ & Thương mại điện tử</option>
                  <option value="ENERGY_SOLAR">Năng lượng tái tạo & Điện mặt trời</option>
                  <option value="SHIPPING_CARGO">Vận tải & Logistics</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Nhóm Kinh Doanh Tiếp Nhận (Target Team):</label>
              <select 
                className="form-select"
                value={targetTeamId}
                onChange={(e) => setTargetTeamId(e.target.value)}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.members.length} nhân viên)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Hủy Bỏ
            </button>
            <button type="submit" className="btn btn-success btn-sm">
              <Check size={16} />
              <span>Tạo Quy Tắc & Đưa Vào Hàng Ưu Tiên</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
