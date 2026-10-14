import { useState } from "react";
import { CalendarDays, Megaphone, Plus } from "lucide-react";

const blankCampaign = {
  name: "",
  budget: "",
  startDate: "",
  endDate: "",
  channel: "Website",
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN") + " đ";

function CampaignTracking({
  campaigns,
  leads,
  onCreateCampaign,
  onUpdateCampaign,
  onNotify,
}) {
  const [campaignForm, setCampaignForm] = useState(blankCampaign);

  function updateCampaignForm(event) {
    const { name, value } = event.target;

    setCampaignForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function addCampaign(event) {
    event.preventDefault();

    const name = campaignForm.name.trim();
    const budget = Number(campaignForm.budget);

    if (!name) {
      onNotify("Vui lòng nhập tên chiến dịch.", "error");
      return;
    }

    if (!Number.isFinite(budget) || budget < 0) {
      onNotify("Ngân sách phải là số không âm.", "error");
      return;
    }

    if (
      campaignForm.startDate &&
      campaignForm.endDate &&
      campaignForm.endDate < campaignForm.startDate
    ) {
      onNotify("Ngày kết thúc phải sau ngày bắt đầu.", "error");
      return;
    }

    if (
      campaigns.some(
        (campaign) =>
          campaign.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      onNotify("Tên chiến dịch đã tồn tại.", "error");
      return;
    }

    onCreateCampaign({
      id: Date.now(),
      name,
      budget,
      startDate: campaignForm.startDate,
      endDate: campaignForm.endDate,
      channel: campaignForm.channel,
      opportunities: 0,
      revenue: 0,
    });

    setCampaignForm(blankCampaign);
    onNotify("Tạo chiến dịch thành công.");
  }

  function updateCampaign(id, field, value) {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount < 0) {
      onNotify("Giá trị phải là số không âm.", "error");
      return;
    }

    onUpdateCampaign(id, field, amount);
  }

  return (
    <>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Tạo chiến dịch Marketing</h3>
            <p>Khai báo ngân sách, thời gian chạy và kênh triển khai</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={addCampaign}>
          <CampaignField
            label="Tên chiến dịch *"
            name="name"
            value={campaignForm.name}
            onChange={updateCampaignForm}
            placeholder="Ví dụ: Chiến dịch tháng 11"
            required
          />
          <CampaignField
            label="Ngân sách (VNĐ)"
            name="budget"
            type="number"
            value={campaignForm.budget}
            onChange={updateCampaignForm}
            placeholder="10000000"
            required
          />
          <CampaignField
            label="Ngày bắt đầu"
            name="startDate"
            type="date"
            value={campaignForm.startDate}
            onChange={updateCampaignForm}
          />
          <CampaignField
            label="Ngày kết thúc"
            name="endDate"
            type="date"
            value={campaignForm.endDate}
            onChange={updateCampaignForm}
          />

          <div className="field">
            <label>Kênh Marketing</label>
            <select
              name="channel"
              value={campaignForm.channel}
              onChange={updateCampaignForm}
            >
              <option>Website</option>
              <option>Email</option>
              <option>Quảng cáo</option>
              <option>Sự kiện</option>
              <option>Mạng xã hội</option>
            </select>
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit">
              <Plus size={17} />
              Tạo chiến dịch
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Hiệu quả chiến dịch</h3>
            <p>Theo dõi số Lead, cơ hội và doanh thu đã chốt</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Chiến dịch</th>
                <th>Kênh</th>
                <th>Thời gian</th>
                <th>Ngân sách</th>
                <th>Số Lead</th>
                <th>Cơ hội</th>
                <th>Doanh thu đã chốt</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td><strong>{campaign.name}</strong></td>
                  <td>{campaign.channel}</td>
                  <td>
                    {campaign.startDate || "—"} đến {campaign.endDate || "—"}
                  </td>
                  <td>{formatMoney(campaign.budget)}</td>
                  <td>
                    {leads.filter(
                      (lead) => lead.campaign === campaign.name
                    ).length}
                  </td>
                  <td>
                    <input
                      className="small-number"
                      type="number"
                      min="0"
                      value={campaign.opportunities}
                      onChange={(event) =>
                        updateCampaign(
                          campaign.id,
                          "opportunities",
                          event.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="small-number revenue"
                      type="number"
                      min="0"
                      value={campaign.revenue}
                      onChange={(event) =>
                        updateCampaign(
                          campaign.id,
                          "revenue",
                          event.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export function CampaignSummary({ leads, campaigns }) {
  return (
    <div className="campaign-summary">
      {campaigns.map((campaign) => {
        const count = leads.filter(
          (lead) => lead.campaign === campaign.name
        ).length;

        return (
          <div className="campaign-summary-row" key={campaign.id}>
            <div className="campaign-summary-title">
              <div className="campaign-icon"><Megaphone size={18} /></div>
              <div>
                <strong>{campaign.name}</strong>
                <small>
                  <CalendarDays size={13} />
                  {campaign.startDate || "Chưa đặt ngày"}
                  {" – "}
                  {campaign.endDate || "Chưa đặt ngày"}
                </small>
              </div>
            </div>
            <div className="campaign-metric">
              <span>Lead</span>
              <strong>{count}</strong>
            </div>
            <div className="campaign-metric">
              <span>Ngân sách</span>
              <strong>{formatMoney(campaign.budget)}</strong>
            </div>
            <div className="campaign-metric">
              <span>Doanh thu</span>
              <strong>{formatMoney(campaign.revenue)}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CampaignField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default CampaignTracking;