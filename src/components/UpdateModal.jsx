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
    <div className="modal-backdrop">
      <div
        className="modal-box update-modal"
        dir="rtl"
        style={{
          fontFamily: "'Vazirmatn', sans-serif",
          textAlign: "right",
        }}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            ✨ تغییرات جدید در نسخه {CURRENT_VERSION}
          </h3>

          <button
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="بستن"
          >
            &times;
          </button>
        </div>

        <div className="modal-content">
          <ul
            style={{
              paddingRight: "1.25rem",
              paddingLeft: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <li>
              <b>پشتیبانی از خط جدید در توضیحات:</b> با زدن Enter به خط بعدی
              بروید و با کلید میانبر <code dir="ltr">Ctrl + Enter</code> یادداشت
              را ثبت کنید.
            </li>

            <li>
              <b>پالت رنگی بهینه‌شده:</b> رنگ‌های کارت‌ها برای حالت روشن و تاریک
              بازطراحی شدند تا ملایم‌تر باشند.
            </li>

            <li>
              <b>بهبود تب‌ها:</b> فاصله و اندازه‌ی تب‌ها برای نمایش یکدست در
              دستگاه‌های مختلف اصلاح شد.
            </li>
          </ul>
        </div>

        <div className="modal-actions">
          <button className="btn-danger" onClick={handleClose}>
            متوجه شدم، عالیه!
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateModal;
