import styled from '@emotion/styled'

// Styled Components
export const Container = styled.div`
  width: 100%;
  ${({ theme }) => theme.typography.styles.description} !important;
  margin: 0 auto;
`

export const MonthSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`

export const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const NavArrow = styled.span`
  cursor: pointer;
  color: #999;
  font-size: 16px;
`

export const CurrentMonth = styled.span`
  font-size: 16px;
  font-weight: 500;
`

export const ExpenseSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const ExpenseLabel = styled.div`
  font-size: 12px;
  color: #666;
`

export const ExpenseAmount = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`

export const StyledFullCalendar = styled.div`
  .fc {
    width: 100%;
    font-family: inherit;
    border: none;
    background: none;
  }

  .fc-theme-standard td,
  .fc-theme-standard th {
    border: none;
  }

  .fc-theme-standard .fc-scrollgrid {
    border: none;
  }

  .fc .fc-scrollgrid-section-header > *,
  .fc .fc-scrollgrid-section-body > * {
    border-right-width: 0;
  }

  .fc .fc-scrollgrid-section > * {
    border-bottom-width: 0;
  }

  .fc .fc-col-header-cell {
    padding: 1rem;
  }

  .fc .fc-col-header-cell-cushion {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    width: 50px;
    display: inline-block;
    text-decoration: none;
  }

  /* 토요일 색상 */
  .fc-day-sat .fc-col-header-cell-cushion,
  .fc-day-sat .day-number {
    color: #5388cd !important;
  }

  /* 일요일 색상 */
  .fc-day-sun .fc-col-header-cell-cushion,
  .fc-day-sun .day-number {
    color: #e74c3c !important;
  }

  .fc-daygrid-day {
    cursor: pointer;
  }

  .fc .fc-daygrid-day.fc-day-today {
    background-color: transparent;
  }

  .fc .fc-daygrid-day.fc-day-today .day-number {
    background-color: #0066cc;
    color: white !important;
    font-weight: 600;
    border-radius: 50%;
  }

  /* 이전/다음 달 날짜 스타일 */
  .fc-day-other .day-number {
    opacity: 0.3;
  }

  /* 날짜 셀 크기 조정 */
  .fc-daygrid-day-frame {
    min-height: 50px;
  }

  .fc .fc-daygrid-body-balanced .fc-daygrid-day-events {
    margin: 0;
  }

  /* 날짜 셀 hover 효과 */
  .fc-daygrid-day:hover {
    background-color: #f0f0f0;
  }
`

export const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px;
`

export const DayNumber = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`

export const EventContent = styled.div`
  padding: 2px 0;
  text-align: center;
`

export const EventAmount = styled.div`
  font-size: 12px;
  color: #e74c3c;
  font-weight: 500;
`
