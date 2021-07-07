import { RawHistoricalPrice } from "../../finance-api/getHistoricalPrices";
import { format } from 'date-fns'

type MonthlyHistoricalPrice = {
  closeDate: string, // end date of month
  baseDate: string // yyyy-MM
  high: number,
  low: number,
  open: number,
  close: number,
  adjustedClose: number
}

export function groupByMonth(historicalPrices: RawHistoricalPrice[]){
  return historicalPrices.reduce((acc, current) => {
    const date = new Date(current.date)
    const baseDate = format(date, 'yyyy-MM')
    const priceInfo = acc.find(info => info.baseDate === baseDate)
    if(!priceInfo){
      acc.push({
        baseDate,
        close: current.close,
        adjustedClose: current.adjClose,
        closeDate: current.date,
        high: current.high,
        low: current.low,
        open: current.open
      })
    } else {
      priceInfo.high = Math.max(priceInfo.high, current.high);
      priceInfo.low = Math.min(priceInfo.low, current.low);
      priceInfo.open = current.open
    }
    return acc;
  }, [] as MonthlyHistoricalPrice[])
}
