import { useEffect, useState } from "react";
import { version } from "../../package.json";

const CURRENT_VERSION = `v${version}`;

function UpdateModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const dismissedVersion = localStorage.getItem("app_update_version");

    if (dismissedVersion !== CURRENT_VERSION) {
      setShowModal(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("app_update_version", CURRENT_VERSION);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        className="modal-box update-modal"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-modal-title"
        style={{
          fontFamily: "'Vazirmatn', sans-serif",
          textAlign: "right",
        }}
      >
        <div className="modal-header">
          <h3 id="update-modal-title" className="modal-title">
            ✨ تغییرات جدید در نسخه {CURRENT_VERSION}
          </h3>

          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="بستن"
          >
            &times;
          </button>
        </div>

        <div className="modal-content">
          <ul className="update-modal__list">
            <li>
              <b>امکان ویرایش یادداشت‌ها:</b> حالا می‌توانید یادداشت‌های ثبت‌شده
              خود را به راحتی ویرایش کنید و تغییرات را ذخیره نمایید.
            </li>

            <li>
              <b>بهینه‌سازی رابط کاربری:</b> انتقال دکمه‌ی خروج به هدر برنامه و
              بهبود ظاهر منوی مرتب‌سازی.
            </li>
          </ul>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-danger" onClick={handleClose}>
            متوجه شدم، عالیه!
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateModal;
