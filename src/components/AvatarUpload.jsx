function AvatarUpload() {
  return (
    <div className="card">
      <h2>Ảnh đại diện</h2>

      <div
        style={{
          width: "120px",
          height: "120px",
          margin: "20px auto",
          borderRadius: "50%",
          background: "#eef2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4f46e5",
          fontWeight: "700",
          fontSize: "32px",
        }}
      >
        NA
      </div>

      <p
        style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: "13px",
        }}
      >
        Chức năng upload ảnh đại diện sẽ được
        xây dựng ở bước tiếp theo.
      </p>
    </div>
  );
}

export default AvatarUpload;