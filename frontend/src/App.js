import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FiCalendar, FiExternalLink, FiLoader } from 'react-icons/fi';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    fetchEvents(selectedDate);
    setIsInitialLoad(false);
  }, []);

  const fetchEvents = async (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/events', { month, day });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchEvents(date);
  };

  const getWikipediaLink = (eventText, year) => {
    const searchQuery = encodeURIComponent(`${year} ${eventText}`);
    return `https://en.wikipedia.org/w/index.php?search=${searchQuery}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>TimeTales</h1>
        <p style={styles.subheading}>Discover historical events on any day</p>
      </div>
      
      <div style={styles.datePickerRow}>
        <FiCalendar style={styles.calendarIcon} />
        <div style={styles.datePickerContainer}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM d"
            className="custom-datepicker"
            placeholderText="Select a date"
            showMonthDropdown
            showYearDropdown={false}
            dropdownMode="select"
            todayButton="Today"
            peekNextMonth
            withPortal
            style={styles.datePicker}
          />
          <button 
            style={styles.todayButton}
            onClick={() => handleDateChange(new Date())}
          >
            Today
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <FiLoader style={styles.spinner} />
            <p style={styles.loadingText}>Discovering historical events...</p>
          </div>
        ) : (
          <>
            <h2 style={styles.resultsHeading}>
              {events.length > 0 
                ? `Historical Events on ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
                : 'No events found for this date'
              }
            </h2>
            <div style={styles.eventsGrid}>
              {events.map((event, index) => (
                <div key={index} style={styles.eventCard}>
                  <div style={styles.eventYear}>{event.year}</div>
                  <p style={styles.eventText}>{event.text}</p>
                  <a
                    href={event.links?.wikipedia || getWikipediaLink(event.text, event.year)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.sourceLink}
                  >
                    <FiExternalLink /> Learn more
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '2rem',
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
    maxWidth: '1200px',
    margin: '0 auto 2.5rem',
  },
  heading: {
    color: '#1a1a1a',
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subheading: {
    color: '#64748b',
    fontSize: '1.1rem',
    fontWeight: '400',
    marginTop: '0',
  },
  datePickerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  calendarIcon: {
    color: '#64748b',
    fontSize: '1.8rem',
    flexShrink: 0,
  },
  datePickerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
  },
  datePicker: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    flexGrow: 1,
    maxWidth: '300px',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    ':focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
    },
  },
  todayButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: '#cbd5e1',
    },
  },
  content: {
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    fontSize: '2rem',
    color: '#3b82f6',
    marginBottom: '1rem',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '1rem',
  },
  resultsHeading: {
    color: '#1e293b',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
  },
  eventYear: {
    fontWeight: '700',
    color: '#3b82f6',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
  },
  eventText: {
    color: '#334155',
    margin: '0.5rem 0',
    lineHeight: '1.6',
  },
  sourceLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginTop: '0.75rem',
    transition: 'all 0.2s ease',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

export default App;