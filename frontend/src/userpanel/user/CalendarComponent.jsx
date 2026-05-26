import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Hardcoded dummy data for May 2026
const eventsData = [
  {
    real_date: "2026-05-05",
    image_type: "Banner",
    generated_caption: "Unlock your business potential with custom software development by Sparklers Infotech Pvt. Ltd. Our tailored solutions streamline operations and enhance efficiency, providing you with a competitive edge. Contact us today!",
    generated_hashtags: ["#SparklersIT", "#ITIndia", "#TechInnovation", "#SoftwareDevelopment"]
  },
  {
    real_date: "2026-05-10",
    image_type: "Infographic",
    generated_caption: "Transform your ideas into engaging mobile experiences with Sparklers Infotech Pvt. Ltd.'s expert mobile app development. Elevate your business's digital presence.",
    generated_hashtags: ["#SparklersIT", "#MobileApp", "#DigitalTransformation", "#IndiaTech"]
  },
  {
    real_date: "2026-05-15",
    image_type: "Quote Card",
    generated_caption: "Experience seamless interaction with Sparklers Infotech Pvt. Ltd. Our intuitive UI/UX designs ensure your software is functional, enjoyable, and easy to use.",
    generated_hashtags: ["#UIUX", "#SparklersIT", "#DesignThinking", "#UserExperience"]
  },
  {
    real_date: "2026-05-20",
    image_type: "Video Thumb",
    generated_caption: "Check out our latest video on digital marketing strategies! Learn how to grow your brand online.",
    generated_hashtags: ["#DigitalMarketing", "#SEO", "#SocialMedia", "#SparklersIT"]
  }
];

const DUMMY_IMAGE_URL = "https://www.shutterstock.com/image-vector/happy-independence-day-india-15-600nw-2185516149.jpg";

// Map date string -> event object
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
  // Default to May 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // month 4 = May
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (dateStr) => {
    const event = eventsByDate[dateStr];
    if (event) {
      setSelectedEvent({ date: dateStr, ...event });
    }
  };

  const closeModal = () => setSelectedEvent(null);

  const handleApprove = () => {
    if (selectedEvent) {
      toast.success(`✅ Scheduled for ${new Date(selectedEvent.date).toDateString()}`);
      closeModal();
    }
  };

  const handleReject = () => {
    if (selectedEvent) {
      toast.error(`❌ Rejected for ${new Date(selectedEvent.date).toDateString()}`);
      closeModal();
    }
  };

  // Build calendar grid (42 cells)
  const calendarDays = [];
  // Previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const date = new Date(year, month - 1, day);
    const dateStr = date.toISOString().split('T')[0];
    calendarDays.push({ date, dateStr, isCurrentMonth: false });
  }
  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    calendarDays.push({ date, dateStr, isCurrentMonth: true });
  }
  // Next month to fill 42 cells
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i);
    const dateStr = date.toISOString().split('T')[0];
    calendarDays.push({ date, dateStr, isCurrentMonth: false });
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-white border-b border-slate-200">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-white transition-colors text-indigo-600">
            <FaChevronLeft />
          </button>
          <h3 className="text-lg font-semibold text-slate-800">
            {monthNames[month]} {year}
          </h3>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-white transition-colors text-indigo-600">
            <FaChevronRight />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-slate-50 py-2 text-center text-xs font-medium text-slate-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {calendarDays.map(({ date, dateStr, isCurrentMonth }, idx) => {
            const event = eventsByDate[dateStr];
            const isToday = date.toDateString() === today.toDateString();
            const hasEvent = !!event;
            return (
              <div
                key={idx}
                onClick={() => hasEvent && handleDateClick(dateStr)}
                className={`bg-white min-h-[100px] p-2 transition-all ${
                  hasEvent ? 'cursor-pointer hover:bg-indigo-50' : ''
                } relative group ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium inline-block w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-indigo-600 text-white' : ''
                  }`}>
                    {date.getDate()}
                  </span>
                  {hasEvent && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  )}
                </div>
                {hasEvent && (
                  <div className="mt-1">
                    <img
                      src={event.thumbnail}
                      alt="post"
                      className="w-full h-14 object-cover rounded-md shadow-sm"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x150?text=Image+Error'; }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal with Approve/Reject buttons */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedEvent.fullImage}
                alt="Full post"
                className="w-full max-h-[60vh] object-contain bg-gray-100"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available'; }}
              />
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-indigo-600 text-sm mb-3">
                <span className="font-semibold">📅 {new Date(selectedEvent.date).toDateString()}</span>
                {selectedEvent.imageType && (
                  <span className="px-2 py-0.5 bg-indigo-100 rounded-full text-xs">{selectedEvent.imageType}</span>
                )}
              </div>
              <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
                {selectedEvent.caption}
              </p>
              {selectedEvent.hashtags && selectedEvent.hashtags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedEvent.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* Buttons */}
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarComponent;