import React from 'react';
import { X, CheckCircle2, FileText, Target, Calendar, Users, TrendingUp, ShieldCheck } from 'lucide-react';

export const JiraTicketModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 780 }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="ticket-tag" style={{ fontSize: '0.82rem' }}>
              <CheckCircle2 size={14} />
              SCRUM-20 / SCRUM-92
            </span>
            <h2 className="modal-title">Nhiệm Vụ Dự Báo Doanh Số (Revenue Forecast)</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* User Story Box */}
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.1)', 
            border: '1px solid rgba(99, 102, 241, 0.3)', 
            padding: '1rem 1.25rem', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, color: '#818cf8', marginBottom: '0.35rem' }}>
              👤 User Story Đề Bài (Sales Director Persona)
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.5 }}>
              "Là Giám đốc kinh doanh, tôi muốn xem dự báo doanh số tính theo trọng số xác suất, để trả lời được câu hỏi tháng này về bao nhiêu bằng số liệu."
            </div>
          </div>

          {/* 4 Acceptance Criteria Table */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Target size={16} color="var(--accent-primary)" />
              Bảng Đối Chiếu 4 Tiêu Chí Chấp Nhận (Acceptance Criteria)
            </h4>

            <div className="table-responsive">
              <table className="data-table" style={{ fontSize: '0.83rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>Tiêu Chí</th>
                    <th style={{ width: 220 }}>Yêu Cầu Jira Ticket</th>
                    <th>Giải Pháp Kỹ Thuật Trong Ứng Dụng React</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong style={{ color: '#818cf8' }}>AC1</strong></td>
                    <td><strong>Dự báo bằng tổng của giá trị cơ hội nhân xác suất thắng của giai đoạn</strong></td>
                    <td>
                      • Động cơ tính toán: <code>∑ (Opportunity Value × Stage Win Probability)</code>.<br />
                      • Ma trận xác suất chuẩn theo từng giai đoạn: Khảo sát (20%), Demo POC (40%), Gửi Báo Giá (60%), Thương Thảo (80%), Đóng Thắng (100%), Đóng Thua (0%).<br />
                      • Hộp công cụ <strong>"Mô phỏng What-If"</strong> cho phép Giám đốc thử nghiệm thay đổi xác suất tức thời.
                    </td>
                  </tr>
                  <tr>
                    <td><strong style={{ color: '#818cf8' }}>AC2</strong></td>
                    <td><strong>Nhóm theo kỳ dự kiến chốt: tháng này, tháng sau, quý này</strong></td>
                    <td>
                      • Bộ lọc & phân kỳ tức thời: <strong>Tháng Này (10/2026)</strong>, <strong>Tháng Sau (11/2026)</strong>, <strong>Quý Này (Q4/2026)</strong>, và Toàn bộ kỳ.<br />
                      • Tự động phân loại kỳ hạn từ <code>expectedCloseDate</code> của cơ hội và tính toán lại toàn bộ chỉ số KPI.
                    </td>
                  </tr>
                  <tr>
                    <td><strong style={{ color: '#818cf8' }}>AC3</strong></td>
                    <td><strong>So sánh dự báo với chỉ tiêu và với số đã chốt thực tế</strong></td>
                    <td>
                      • Thẻ điểm điều hành 5 chỉ số vàng: <strong>Chỉ Tiêu (Quota)</strong> vs <strong>Đã Chốt Thực Tế (Won)</strong> vs <strong>Dự Báo Trọng Số (Forecast)</strong> vs <strong>Tổng Doanh Số Kỳ Vọng</strong> vs <strong>Khoảng Cách Chỉ Tiêu (Gap)</strong>.<br />
                      • Thước đo tiến độ kép (Dual Progress Gauge) thể hiện trực quan vạch thực tế + dự báo so với mốc 100% KPI.<br />
                      • Phân tích 3 Kịch bản doanh số: Kịch bản Thấp nhất (Worst Case) / Kịch bản Kỳ vọng (Most Likely) / Kịch bản Tối đa (Best Case).
                    </td>
                  </tr>
                  <tr>
                    <td><strong style={{ color: '#818cf8' }}>AC4</strong></td>
                    <td><strong>Xem được theo từng nhân viên và từng nhóm</strong></td>
                    <td>
                      • Phân cấp cây bán hàng: Xem toàn công ty, hoặc xem theo <strong>Từng Nhóm Kinh Doanh</strong> (Miền Bắc, Enterprise, Bán lẻ F&B), hoặc theo <strong>Từng Nhân Viên</strong> (Sales Rep Leaderboard).<br />
                      • Tính năng drill-down: Bấm chọn vào nhân viên hoặc nhóm nào thì toàn bộ thẻ KPI và bảng chi tiết cơ hội sẽ lọc theo đối tượng đó.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Executive Answer highlight */}
          <div style={{ background: 'var(--bg-primary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            💡 <strong>Tính năng Vượt trội (Smart Executive Box):</strong> Ứng dụng tích hợp khối tóm tắt ngôn ngữ tự nhiên dành riêng cho Giám đốc kinh doanh trả lời trực tiếp câu hỏi: <em>"Tháng này về bao nhiêu bằng số liệu?"</em> kèm khuyến nghị điều hành chốt deal.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Đã Hiểu & Đóng Modal
          </button>
        </div>
      </div>
    </div>
  );
};
