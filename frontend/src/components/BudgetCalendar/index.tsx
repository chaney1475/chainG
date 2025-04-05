import { useRef, useState } from 'react'

import koLocale from '@fullcalendar/core/locales/ko'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'

import {
  Container,
  CurrentMonth,
  DayCell,
  DayNumber,
  EventAmount,
  EventContent,
  ExpenseAmount,
  ExpenseLabel,
  ExpenseSummary,
  MonthNavigation,
  MonthSummary,
  NavArrow,
  StyledFullCalendar,
} from './styles'

export function BudgetCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef<FullCalendar>(null)

  const formatMonth = (date: Date) => {
    return `${date.getMonth() + 1}월`
  }

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(newDate)
    }
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(newDate)
    }
  }

  return (
    <Container>
      <MonthSummary>
        <MonthNavigation>
          <NavArrow onClick={handlePrevMonth}>{'<'}</NavArrow>
          <CurrentMonth>{formatMonth(currentDate)}</CurrentMonth>
          <NavArrow onClick={handleNextMonth}>{'>'}</NavArrow>
        </MonthNavigation>

        <ExpenseSummary>
          <ExpenseLabel>지출</ExpenseLabel>
          <ExpenseAmount>379,200 원</ExpenseAmount>
          <ExpenseLabel>지출</ExpenseLabel>
          <ExpenseAmount>379,200 원</ExpenseAmount>
        </ExpenseSummary>
      </MonthSummary>

      <StyledFullCalendar>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={koLocale}
          firstDay={1}
          initialDate={currentDate}
          events={[
            { title: '-300,000', date: '2025-04-09' },
            { title: '-25,000', date: '2025-04-11' },
          ]}
          height="auto"
          contentHeight="auto"
          headerToolbar={false}
          dayCellContent={(info) => {
            return (
              <DayCell>
                <DayNumber>{info.dayNumberText.replace('일', '')}</DayNumber>
              </DayCell>
            )
          }}
          eventContent={(eventInfo) => {
            return (
              <EventContent>
                <EventAmount>{eventInfo.event.title}원</EventAmount>
              </EventContent>
            )
          }}
          datesSet={(dateInfo) => {
            const newDate = dateInfo.view.currentStart
            if (
              newDate.getMonth() !== currentDate.getMonth() ||
              newDate.getFullYear() !== currentDate.getFullYear()
            ) {
              setCurrentDate(newDate)
            }
          }}
        />
      </StyledFullCalendar>
    </Container>
  )
}
