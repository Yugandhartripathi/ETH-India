import Header from "./Header";

export default function Layout({ children }) {
    const styles = {
        display: "flex",
        flexDirection: "row"
    }; return (
        <>
            <Header />
            <main style={styles}>
                {children}
            </main>
        </>);
}