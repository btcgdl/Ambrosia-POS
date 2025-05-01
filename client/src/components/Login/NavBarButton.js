export default function NavBarButton( {text, onClick, icon} ) {
    return(<>
        <button
            onClick={onClick}
            className="bg-[var(--color-secondary)] py-4"
        >
            <i className={`bi bi-${icon} text-[20px] pr-1`}></i>{text}
        </button>
    </>)
}