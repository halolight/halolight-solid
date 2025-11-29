/**
 * 日历相关类型定义
 */

/** 日历事件类型 */
export type CalendarEventType = 'meeting' | 'task' | 'reminder' | 'holiday' | 'birthday' | 'other'

/** 参会者状态 */
export type AttendeeStatus = 'accepted' | 'declined' | 'pending' | 'tentative'

/** 事件重复类型 */
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'

/** 参会者 */
export interface CalendarAttendee {
  id: string
  name: string
  email?: string
  avatar?: string
  status: AttendeeStatus
  isOrganizer?: boolean
}

/** 日历事件 */
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start?: string
  end?: string
  startTime?: string
  endTime?: string
  type?: CalendarEventType | string
  color?: string
  allDay?: boolean
  location?: string
  attendees?: CalendarAttendee[] | Array<{id: string | number; name: string; email?: string; status: string}>
  reminders?: string[] | Array<{type: string; minutes: number}>
  recurrence?: RecurrenceType
  createdAt?: string
  updatedAt?: string
  createdBy?: string
}

/** 日历事件创建请求 */
export interface CalendarEventCreateRequest {
  title: string
  description?: string
  start: string
  end: string
  type?: CalendarEventType
  color?: string
  allDay?: boolean
  location?: string
  attendeeIds?: string[]
  reminders?: string[]
  recurrence?: RecurrenceType
}

/** 日历事件更新请求 */
export interface CalendarEventUpdateRequest {
  title?: string
  description?: string
  start?: string
  end?: string
  type?: CalendarEventType
  color?: string
  allDay?: boolean
  location?: string
  attendeeIds?: string[]
  reminders?: string[]
  recurrence?: RecurrenceType
}

/** 日历视图类型 */
export type CalendarView = 'month' | 'week' | 'day' | 'agenda'

/** 日历过滤参数 */
export interface CalendarFilterParams {
  start: string
  end: string
  types?: CalendarEventType[]
  attendeeId?: string
}

/** 日历统计 */
export interface CalendarStats {
  totalEvents: number
  upcomingEvents: number
  todayEvents: number
  byType: Record<CalendarEventType, number>
}
