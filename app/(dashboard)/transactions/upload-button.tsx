
import { UploadIcon } from "lucide-react"
import { useCSVReader } from "react-papaparse"
import { Button } from "@/components/ui/button"

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpload: (results: any) => void;

}


const UploadButton = ({ onUpload }: Props) => {
    const { CSVReader } = useCSVReader();

    // TODO: Add a paywall

    return (
        <CSVReader onUploadAccepted={onUpload}>
            {({
                getRootProps,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }: any) => (
                <Button
                    {...getRootProps()}
                    size={"sm"}
                    className="w-full lg:w-auto"
                >
                    <UploadIcon className="size-4 mr-2" />
                    Import
                </Button>
            )}

        </CSVReader >
    )
}

export default UploadButton