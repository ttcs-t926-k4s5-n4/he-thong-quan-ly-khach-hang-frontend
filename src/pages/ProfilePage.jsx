import ProfileForm from "../components/ProfileForm";
import AvatarUpload from "../components/AvatarUpload";

function ProfilePage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hồ sơ cá nhân</h1>
          <p>
            Xem và cập nhật thông tin cá nhân
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <AvatarUpload />
        <ProfileForm />
      </div>
    </div>
  );
}

export default ProfilePage;