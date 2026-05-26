import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaBriefcase, FaFileAlt, FaImage, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance'; // your configured axios instance

// Dummy events for May 2026 (example)
const eventsData = [
  { real_date: "2026-05-05", image_type: "Banner", generated_caption: "Unlock your business potential...", generated_hashtags: ["#SparklersIT","#ITIndia"] },
  { real_date: "2026-05-10", image_type: "Infographic", generated_caption: "Transform your ideas...", generated_hashtags: ["#SparklersIT","#MobileApp"] },
  { real_date: "2026-05-15", image_type: "Quote Card", generated_caption: "Experience seamless interaction...", generated_hashtags: ["#UIUX","#SparklersIT"] },
  { real_date: "2026-05-20", image_type: "Video Thumb", generated_caption: "Check out our latest video...", generated_hashtags: ["#DigitalMarketing","#SEO"] }
];
const DUMMY_IMAGE_URL = "https://www.shutterstock.com/image-vector/happy-independence-day-india-15-600nw-2185516149.jpg";
const eventsByDate = {};
eventsData.forEach(item => {
  eventsByDate[item.real_date] = {
    thumbnail: DUMMY_IMAGE_URL,
    fullImage: DUMMY_IMAGE_URL,
    caption: item.generated_caption,
    hashtags: item.generated_hashtags,
    imageType: item.image_type
  };
});

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  
  // Multiple file states
  const [businessDataFiles, setBusinessDataFiles] = useState([]);
  const [referenceImgFiles, setReferenceImgFiles] = useState([]);
  const [referenceImgPreviews, setReferenceImgPreviews] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Calendar helper functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const year = currentDate.getFullYear(), month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const today = new Date(); today.setHours(0,0,0,0);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleDateClick = (dateStr) => {
    if (eventsByDate[dateStr]) setSelectedEvent({ date: dateStr, ...eventsByDate[dateStr] });
  };
  const closeModal = () => setSelectedEvent(null);
  const handleApprove = () => {
    toast.success(`✅ Scheduled for ${new Date(selectedEvent.date).toDateString()}`);
    closeModal();
  };
  const handleReject = () => {
    toast.error(`❌ Rejected for ${new Date(selectedEvent.date).toDateString()}`);
    closeModal();
  };

  // Business modal handlers
  const openBusinessModal = () => setShowBusinessModal(true);
  const closeBusinessModal = () => {
    setShowBusinessModal(false);
    setBusinessDataFiles([]);
    setReferenceImgFiles([]);
    setReferenceImgPreviews([]);
    setStartDate("");
  };

  const handleBusinessFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setBusinessDataFiles(files);
  };

  const handleReferenceImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setReferenceImgFiles(files);
    // Create previews for images
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) setReferenceImgPreviews([...previews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSendBusinessData = async () => {
    if (businessDataFiles.length === 0) {
      return toast.error("Please select at least one Business Data File");
    }
    if (referenceImgFiles.length === 0) {
      return toast.error("Please select at least one Reference Image");
    }
    if (!startDate) {
      return toast.error("Please select Start Date");
    }

    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (!token) {
      toast.error("User not authenticated. Please login again.");
      return;
    }

    const formData = new FormData();
    businessDataFiles.forEach(file => formData.append('businessFile', file));
    referenceImgFiles.forEach(file => formData.append('referenceImage', file));
    formData.append('startDate', startDate);

    setIsUploading(true);
    try {
      const response = await axiosInstance.post('/business-data', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(response.data.message);
      closeBusinessModal();
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || 'Failed to save data';
      toast.error(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  // Build calendar grid (42 cells)
  let calendarDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    let day = prevMonthDays - i;
    let date = new Date(year, month - 1, day);
    calendarDays.push({ date, dateStr: date.toISOString().split('T')[0], isCurrentMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    let date = new Date(year, month, day);
    calendarDays.push({ date, dateStr: date.toISOString().split('T')[0], isCurrentMonth: true });
  }
  let remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    let date = new Date(year, month + 1, i);
    calendarDays.push({ date, dateStr: date.toISOString().split('T')[0], isCurrentMonth: false });
  }
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <>
      {/* Calendar UI */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-50/50 to-white">
          <h2 className="text-xl font-bold text-slate-800">Content Calendar</h2>
          <button onClick={openBusinessModal} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md cursor-pointer">
            <FaBriefcase /> Add Business Data
          </button>
        </div>
        <div className="flex justify-between px-6 py-3 bg-white border-b">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100"><FaChevronLeft /></button>
          <h3 className="text-lg font-semibold">{monthNames[month]} {year}</h3>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100"><FaChevronRight /></button>
        </div>
        <div className="grid grid-cols-7 gap-px bg-slate-100">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="bg-slate-50 py-3 text-center text-xs font-semibold">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-px bg-slate-100">
          {calendarDays.map(({date, dateStr, isCurrentMonth}, idx) => {
            const event = eventsByDate[dateStr];
            const isToday = date.toDateString() === today.toDateString();
            const hasEvent = !!event;
            return (
              <div key={idx} onClick={() => hasEvent && handleDateClick(dateStr)} className={`bg-white min-h-[110px] p-2 transition-all ${hasEvent ? 'cursor-pointer hover:bg-indigo-50' : ''} ${!isCurrentMonth ? 'text-slate-300 bg-slate-50/30' : 'text-slate-700'}`}>
                <div className="flex justify-between">
                  <span className={`text-sm font-medium inline-flex w-7 h-7 items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : ''}`}>{date.getDate()}</span>
                  {hasEvent && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>}
                </div>
                {hasEvent && <img src={event.thumbnail} className="w-full h-14 object-cover rounded-lg mt-1" alt="post" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal (Approve/Reject) */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedEvent.fullImage} className="w-full max-h-[60vh] object-contain bg-gray-100" alt="event" />
              <button onClick={closeModal} className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2"><FaTimes /></button>
            </div>
            <div className="p-6">
              <p className="text-slate-700">{selectedEvent.caption}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedEvent.hashtags?.map((tag, i) => <span key={i} className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">{tag}</span>)}
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button onClick={handleReject} className="px-5 py-2 bg-red-500 text-white rounded-xl">Reject</button>
                <button onClick={handleApprove} className="px-5 py-2 bg-green-500 text-white rounded-xl">Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Data Modal (Multiple Files + Images) */}
      {showBusinessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeBusinessModal}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-slate-800">Add Business Data</h3>
              <button onClick={closeBusinessModal} className="text-slate-400 hover:text-slate-600"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Business Data Files (any file type) */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-slate-700"><FaFileAlt className="text-indigo-500" /> Business Data Files (multiple) <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  multiple
                  accept="*/*"
                  onChange={handleBusinessFilesChange}
                  className="w-full border border-slate-200 rounded-xl p-2.5 mt-1 cursor-pointer"
                />
                {businessDataFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-600">Selected files:</p>
                    <ul className="text-xs text-green-600 space-y-1">
                      {businessDataFiles.map((f, i) => <li key={i}>✓ {f.name} ({(f.size / 1024).toFixed(1)} KB)</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {/* Reference Images (any image type) */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-slate-700"><FaImage className="text-indigo-500" /> Reference Images (multiple) <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif,image/jpg"
                  onChange={handleReferenceImagesChange}
                  className="w-full border border-slate-200 rounded-xl p-2.5 mt-1 cursor-pointer"
                />
                {referenceImgPreviews.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {referenceImgPreviews.map((src, i) => (
                      <img key={i} src={src} alt={`preview-${i}`} className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
                    ))}
                  </div>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-slate-700"><FaCalendarAlt className="text-indigo-500" /> Start Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 mt-1 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t">
              <button onClick={closeBusinessModal} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300">Cancel</button>
              <button
                onClick={handleSendBusinessData}
                disabled={isUploading}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? 'Sending...' : 'Send Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarComponent;