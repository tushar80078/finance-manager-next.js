
import HeaderComponent from "@/components/header";

type Props = {
    children: React.ReactNode
}
export default function Layout({ children }: Props) {
    return (
        <>
            <HeaderComponent />
            <main className="px-3 lg:px-14">
                {children}
            </main>
        </>
    );
}
