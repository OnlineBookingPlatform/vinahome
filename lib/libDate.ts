import dayjs from 'dayjs'

export const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('DD/MM/YYYY')
}
