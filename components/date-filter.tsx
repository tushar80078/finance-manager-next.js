"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string"
import { useState } from "react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { ChevronDown } from "lucide-react";

import { fomratDateRange } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "./ui/popover";

const DateFilter = () => {

    const pathname = usePathname();
    const router = useRouter();
    const params = useSearchParams();
    const accountId = params.get("accountId");
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    const defualtTo = new Date();
    const defaultFrom = subDays(defualtTo, 30);

    const paramsState = {
        from: from ? new Date(from) : defaultFrom,
        to: to ? new Date(to) : defualtTo,
    }

    const [date, setDate] = useState<DateRange | undefined>(paramsState);

    const pushToUrl = (dateRange: DateRange | undefined) => {
        const query = {
            from: format(dateRange?.from || defaultFrom, 'yyyy-MM-dd'),
            to: format(dateRange?.to || defualtTo, 'yyyy-MM-dd'),
            accountId
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query,

        }, { skipEmptyString: true, skipNull: true })

        router.push(url)
    }

    const onReset = () => {
        setDate(undefined)
        pushToUrl(undefined)
    }


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={false}
                    size={"sm"}
                    variant={"outline"}
                    className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
                >
                    <span >
                        {fomratDateRange(paramsState)}
                    </span>
                    <ChevronDown className="mr-2 size-4 opacity-50" />
                </Button>

            </PopoverTrigger>

            <PopoverContent className="lg:w-auto w-full p-0" align="start">
                <Calendar
                    disabled={false}
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />

                <div className="p-4 w-full flex items-center gap-x-2">
                    <PopoverClose asChild>
                        <Button
                            onClick={onReset}
                            disabled={!date?.from || !date.to}
                            className="w-full "
                            variant={"outline"}
                        >
                            Reset
                        </Button>
                    </PopoverClose>

                    <PopoverClose asChild>
                        <Button
                            onClick={() => pushToUrl(date)}
                            disabled={!date?.from || !date.to}
                            className="w-full "
                        >
                            Apply
                        </Button>
                    </PopoverClose>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DateFilter