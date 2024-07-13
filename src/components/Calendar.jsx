import React, { useState, useEffect } from 'react';
import { Row, Container, Modal, Button } from 'react-bootstrap';
import "../CSS/Calendar.css";
import moment from 'moment';
import * as Icon from "react-bootstrap-icons";

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [detailedMeeting, setDetailedMeeting] = useState(null);
  const [view, setView] = useState('Mes');
  const [openedFromMore, setOpenedFromMore] = useState(false);

  useEffect(() => {
    fetchMeetings(currentDate);
  }, [currentDate]);

  const fetchMeetings = async (date) => {
    const datos = { fecha: date.format('YYYY-MM-DD') };
    try {
      const respuesta = await fetch(
        "http://localhost/RegistrAgil/GestionarJuntas/Calendario.php",
        {
          method: "POST",
          body: JSON.stringify(datos),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const text = await respuesta.text();

      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}, message: ${text}`);
      }

      const json = JSON.parse(text);
      if (Array.isArray(json)) {
        setMeetings(json);
      } else {
        console.error("La respuesta no es un array:", json);
        setMeetings([]);
      }
    } catch (error) {
      console.error("Error fetching meetings", error);
    }
  };

  const startOfMonth = currentDate.clone().startOf('month').startOf('week');
  const endOfMonth = currentDate.clone().endOf('month').endOf('week');

  const startOfWeek = currentDate.clone().startOf('week');
  const endOfWeek = currentDate.clone().endOf('week');

  const handleDayClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    setSelectedDate(day.clone());
    setShowModal(true);
  };

  const handleDetailClick = (meeting) => {
    setDetailedMeeting(meeting);
    setShowModal(false);
    setShowDetailModal(true);
  };

  const handleGuestsClick = (meeting) => {
    setDetailedMeeting(meeting);
    setShowGuestsModal(true);
  };

  const getMeetingsForDay = (day) => {
    return meetings.filter(meeting => moment(meeting.fecha).isSame(day, 'day')).sort((a, b) => moment(a.horaInicio, 'HH:mm') - moment(b.horaInicio, 'HH:mm'));
  };

  const getMeetingStatus = (meeting) => {
    const now = moment();
    const start = moment(meeting.fecha + ' ' + meeting.horaInicio, 'YYYY-MM-DD HH:mm');
    const end = moment(meeting.fecha + ' ' + meeting.horaFin, 'YYYY-MM-DD HH:mm');

    if (now.isBefore(start)) return 'future';
    if (now.isBetween(start, end)) return 'in-progress';
    return 'past';
  };

  const renderStatusCircle = (status) => {
    const color = {
      'past': 'red',
      'in-progress': 'yellow',
      'future': 'green'
    }[status];
    return <span className="status-circle" style={{ backgroundColor: color }}></span>;
  };

  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  };

  const renderHeaders = () => {
    if (view === 'Mes') {
      return diasSemana.map(day => (
        <div key={day} className="calendar-header-day">
          {day}
        </div>
      ));
    } else if (view === 'Semana') {
      let day = startOfWeek.clone();
      return diasSemana.map((dayName, index) => {
        const dateHeader = `${dayName} ${day.format('DD/MM')}`;
        const headerElement = (
          <div key={index} className="calendar-header-day">
            {dateHeader}
          </div>
        );
        day.add(1, 'day');
        return headerElement;
      });
    }
  };

  const getWeekTitle = (startOfWeek, endOfWeek) => {
    const startMonth = meses[startOfWeek.month()];
    const endMonth = meses[endOfWeek.month()];
    const startYear = startOfWeek.format('YYYY');
    const endYear = endOfWeek.format('YYYY');

    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonth} de ${startYear}`;
    } else if (startYear === endYear) {
      return `${startMonth} - ${endMonth} de ${startYear}`;
    } else {
      return `${startMonth} de ${startYear} - ${endMonth} de ${endYear}`;
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    let day = startOfMonth.clone();

    while (day.isBefore(endOfMonth + 1, 'day')) {
      const currentDay = day.clone();
      const isCurrentMonth = day.month() === currentDate.month();
      const isToday = day.isSame(moment(), 'day');
      const meetingsForDay = getMeetingsForDay(currentDay);
      const firstMeeting = meetingsForDay[0];
      days.push(
        <div
          key={currentDay.format('YYYY-MM-DD')}
          className={`calendar-day ${isCurrentMonth ? '' : 'disabled'} ${isToday ? 'today' : ''}`}
          onClick={() => { handleDayClick(currentDay, isCurrentMonth); setOpenedFromMore(true); }}
        >
          <div className="date">{currentDay.date()}</div>
          <div className="reunion">
            {firstMeeting && (
              <div>
                {renderStatusCircle(getMeetingStatus(firstMeeting))} {truncateText(firstMeeting.asunto, 10)}
              </div>
            )}
            {meetingsForDay.length > 1 && <div className="text-ver-mas">{meetingsForDay.length - 1} más</div>}
          </div>
        </div>
      );
      day.add(1, 'day');
    }

    return days;
  };

  const renderWeekDays = () => {
    const days = [];
    let day = startOfWeek.clone();

    while (day.isBefore(endOfWeek + 1, 'day')) {
      const currentDay = day.clone();
      const isToday = day.isSame(moment(), 'day');
      const meetingsForDay = getMeetingsForDay(currentDay);
      days.push(
        <div
          key={currentDay.format('YYYY-MM-DD')}
          className={`calendar-day calendar-week-day ${isToday ? 'today' : ''}`}
        >
          {meetingsForDay.length > 0 && (
            <div className="reuniones">
              {meetingsForDay.slice(0, 5).map(meeting => (
                <div key={meeting.asunto} className="reunion" onClick={() => handleDetailClick(meeting)}>
                  {renderStatusCircle(getMeetingStatus(meeting))} {truncateText(meeting.asunto, 12)}
                  <br></br>
                  <Icon.Clock color="#0B1215" className="me-2 clock" />{meeting.horaInicio} - {meeting.horaFin}
                </div>
              ))}
              {meetingsForDay.length > 5 && (
                <div className="d-flex justify-content-center">
                  <Button className="text-ver-mas" onClick={() => { handleDayClick(currentDay, true); setOpenedFromMore(true); }}>
                    Ver más
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      );
      day.add(1, 'day');
    }

    return days;
  };

  const renderDayView = () => {
    const meetingsForDay = getMeetingsForDay(currentDate);

    return (
      <div>
        <div className='calendar-day-header'>Reuniones</div>
        {meetingsForDay.length > 0 ? (
          <>
            {meetingsForDay.slice(0, 9).map(meeting => (
              <div key={meeting.asunto} className="calendar-day-row" onClick={() => handleDetailClick(meeting)}>
                <div>
                  <span className='me-5'><Icon.Clock color="#0B1215" size={12} className="me-2" />{meeting.horaInicio} - {meeting.horaFin} </span>
                  {renderStatusCircle(getMeetingStatus(meeting))} {meeting.asunto}
                </div>
              </div>
            ))}
            {meetingsForDay.length > 9 && (
              <div className="d-flex justify-content-center">
                <Button className="text-ver-mas" onClick={() => { setShowModal(true); setOpenedFromMore(true); }}>
                  Ver más
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className='calendar-day-row-empty'>Sin reuniones.</div>
        )}
      </div>
    );
  };

  const renderMeetingDetails = (meeting) => (
    <div key={meeting.asunto} className="mb-4">
      <h5>{renderStatusCircle(getMeetingStatus(meeting))} {meeting.asunto}</h5>
      <p>{meeting.anfitrion}</p>
      <p className="mb-2"><Icon.Clock color="#0B1215" size={14} className="me-2" />{meeting.horaInicio} - {meeting.horaFin}</p>
      <Button className="boton-detalles-juntas" onClick={() => handleDetailClick(meeting)}>Ver más detalles</Button>
    </div>
  );

  return (
    <Container fluid className={`mainContainer d-flex justify-content-center m-1 mt-3 ${view === 'Mes' ? 'mb-5' : ''}`}>
      <Row className="d-flex justify-content-center" style={{ width: '90%' }}>
        <div className="calendar">
          <div className="calendar-header">
            <div>
              <Button className='boton-regresar me-2' onClick={() => setCurrentDate(currentDate.clone().subtract(1, view === 'Dia' ? 'day' : view === 'Mes' ? 'month' : 'week'))}>
                <Icon.ArrowLeft size={25} />
              </Button>
              <Button className="boton-regresar" onClick={() => setCurrentDate(currentDate.clone().add(1, view === 'Dia' ? 'day' : view === 'Mes' ? 'month' : 'week'))}>
                <Icon.ArrowRight size={25} />
              </Button>
            </div>
            <h2>
              {view === 'Mes'
                ? `${meses[currentDate.month()]} ${currentDate.year()}`
                : view === 'Semana'
                  ? `${getWeekTitle(startOfWeek, endOfWeek)}`
                  : `${currentDate.format('DD')} de ${meses[currentDate.month()]} de ${currentDate.year()}`}
            </h2>

            <select
              name="vista-calendario"
              id="vista-calendario"
              className="calendario-select"
              onChange={(e) => setView(e.target.value)}
              value={view}
            >
              <option value="Mes">Mes</option>
              <option value="Semana">Semana</option>
              <option value="Dia">Día</option>
            </select>
          </div>
          <div className={`calendar-grid ${view === 'Dia' ? 'calendar-day-view' : ''}`}>
            <div className="calendar-grid-header">
              {view === 'Mes' && renderHeaders()}
              {view === 'Semana' && renderHeaders()}
            </div>
            <div className="calendar-grid-body">
              {view === 'Mes' && renderCalendarDays()}
              {view === 'Semana' && renderWeekDays()}
              {view === 'Dia' && renderDayView()}
            </div>
          </div>

          {/* Modal Reuniones del Día*/}
          <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>Reuniones - {selectedDate && `${diasSemana[selectedDate.day()]} ${selectedDate.format('DD')} de ${meses[selectedDate.month()]} de ${selectedDate.format('YYYY')}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedDate && getMeetingsForDay(selectedDate).length > 0 ? (
                getMeetingsForDay(selectedDate).map(meeting => (
                  renderMeetingDetails(meeting)
                ))
              ) : (
                <p>Sin reuniones.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button className="boton" onClick={() => setShowModal(false)}>
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal Detalles de una Reunión */}
          <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} className="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>Detalles de la Reunión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detailedMeeting && (
                <div>
                  <h5 className='mb-3'>{renderStatusCircle(getMeetingStatus(detailedMeeting))} {detailedMeeting.asunto}</h5>
                  <p><strong>Anfitrión: </strong>{detailedMeeting.anfitrion}</p>
                  <p><strong>Descripción: </strong>{detailedMeeting.descripcion}</p>
                  <p><Icon.Calendar color="#0B1215" size={13} className="me-2" />{detailedMeeting.fecha}</p>
                  <p><Icon.Clock color="#0B1215" size={13} className="me-2" />{detailedMeeting.horaInicio} - {detailedMeeting.horaFin}</p>
                  <p><Icon.GeoAlt color="#0B1215" size={15} className="me-2" />{detailedMeeting.direccion} - {detailedMeeting.sala}</p>
                  <Button className="boton-detalles-juntas" onClick={() => { setShowDetailModal(false); handleGuestsClick(detailedMeeting) }}>Ver invitados</Button>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              {openedFromMore ? (
                <Button className="boton" onClick={() => { setOpenedFromMore(false); setShowDetailModal(false); setShowModal(true); }}>
                  Regresar
                </Button>
              ) : (
                <Button className="boton" onClick={() => setShowDetailModal(false)}>
                  Aceptar
                </Button>
              )}
            </Modal.Footer>
          </Modal>

          {/* Modal Lista de Invitados de una Junta*/}
          <Modal show={showGuestsModal} onHide={() => setShowGuestsModal(false)} className="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>Invitados</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detailedMeeting && Array.isArray(detailedMeeting.invitados) && detailedMeeting.invitados.length > 0 ? (
                detailedMeeting.invitados.map((invitado, index) => (
                  <p key={index}>{index + 1}. {invitado}</p>
                ))
              ) : (
                <p>Sin invitados.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button className="boton" onClick={() => { setShowGuestsModal(false); setShowDetailModal(true) }}>
                Regresar
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </Row>
    </Container>
  );
};

export default Calendar;
