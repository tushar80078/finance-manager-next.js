
import { VariantProps, cva } from "class-variance-authority"
import { IconType } from "react-icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { cn, formatCurrency, formatPercentage } from "@/lib/utils"
import { CountUp } from "@/components/count-up"
import { Skeleton } from "./ui/skeleton"

export const boxVariant = cva(
    "rounded-md p-3",
    {
        variants: {
            variant: {
                default: "bg-blue-500/20",
                succes: "bg-emerald-500/20",
                danger: "bg-rose-500/20",
                warning: "bg-yellow-500/20",
            }
        },
        defaultVariants: {
            variant: "default",
        }
    }
)

export const iconVariant = cva(
    "size-6 shrink-0",
    {
        variants: {
            variant: {
                default: "fill-blue-500",
                succes: "fill-emerald-500",
                danger: "fill-rose-500",
                warning: "fill-yellow-500",
            }
        },
        defaultVariants: {
            variant: "default",
        }
    }
)

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;



interface DataCardProps extends BoxVariants, IconVariants {
    title: string;
    icon: IconType;
    value: number;
    dateRange: string;
    percentageChange: number
}

const DataCard = ({ title, dateRange, icon: Icon, percentageChange, value, variant }: DataCardProps) => {
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center gap-x-4 ">
                <div className="space-y-2">

                    <CardTitle className="text-2xl line-clamp-1">
                        {title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1 ">
                        {dateRange}
                    </CardDescription>
                </div>

                <div className={cn(
                    boxVariant({ variant }),
                )}>
                    <Icon className={cn(iconVariant({ variant }))} />
                </div>
            </CardHeader>

            <CardContent>
                <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
                    <CountUp
                        preserveValue
                        start={0}
                        end={value}
                        decimals={2}
                        decimalPlaces={2}
                        formattingFn={formatCurrency}
                    />
                </h1>
                <p className={cn(
                    "text-muted-foreground text-sm line-clamp-1",
                    percentageChange > 0 && "text-emerald-500",
                    percentageChange < 0 && "text-rose-500"
                )}>
                    {formatPercentage(percentageChange, { addPrefix: true })} from last period
                </p>
            </CardContent>
        </Card >
    )
}

export default DataCard

export const DataCardLoading = () => {
    return (
        <Card className="border-none drop-shadow-sm h-[192px]">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="size-12" />
            </CardHeader>
            <CardContent>
                <Skeleton className="shrink-0 h-10 w-24 mb-2" />
                <Skeleton className="shrink-0 h-4 w-40" />
            </CardContent>
        </Card>
    )
}