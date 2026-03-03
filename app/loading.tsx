import Loading from "./components/Loading";

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            <Loading />
        </div>
    );
}
